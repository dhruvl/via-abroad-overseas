import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import {
  addAdminNoteAction,
  updateEnquiryStatusAction,
} from "@/lib/actions/admin-actions";
import {
  addAdminNote,
  AuditLogWriteError,
  updateEnquiryStatus,
} from "@/lib/database/admin-queries";

type QueryResult = {
  data: { status: string } | null;
  error: { code?: string; message?: string } | null;
};

type QueryBuilder = PromiseLike<QueryResult> & {
  select: (...args: unknown[]) => QueryBuilder;
  eq: (...args: unknown[]) => QueryBuilder;
  maybeSingle: () => Promise<QueryResult>;
  update: (...args: unknown[]) => QueryBuilder;
  insert: (...args: unknown[]) => QueryBuilder;
};

function createSupabaseClient(auditWriteError = true) {
  const from = vi.fn((table: string) => {
    let result: QueryResult = { data: null, error: null };
    const builder = {} as QueryBuilder;
    Object.assign(builder, {
      select: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      maybeSingle: vi.fn(async () => ({ data: { status: "new" }, error: null })),
      update: vi.fn(() => {
        result = { data: null, error: null };
        return builder;
      }),
      insert: vi.fn(() => {
        result =
          table === "audit_logs" && auditWriteError
            ? { data: null, error: { code: "42501", message: "provider detail must not escape" } }
            : { data: null, error: null };
        return builder;
      }),
      then: <TResult1 = QueryResult, TResult2 = never>(
        onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
      ) => Promise.resolve(result).then(onfulfilled, onrejected),
    });
    return builder;
  });

  return { from };
}

describe("audit write failures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not ignore an audit insert error after a status update", async () => {
    const supabase = createSupabaseClient();

    const error = await updateEnquiryStatus(
      supabase as unknown as Parameters<typeof updateEnquiryStatus>[0],
      "00000000-0000-4000-8000-000000000001",
      "contacted",
      "00000000-0000-4000-8000-000000000002"
    ).catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(AuditLogWriteError);
    expect(error).toMatchObject({ databaseCode: "42501" });
    expect(supabase.from.mock.calls.map(([table]) => table)).toEqual([
      "enquiries",
      "enquiries",
      "audit_logs",
    ]);
  });

  it("does not ignore an audit insert error after an admin note", async () => {
    const supabase = createSupabaseClient();

    const error = await addAdminNote(
      supabase as unknown as Parameters<typeof addAdminNote>[0],
      "00000000-0000-4000-8000-000000000001",
      "00000000-0000-4000-8000-000000000002",
      "Reviewed application timeline"
    ).catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(AuditLogWriteError);
    expect(error).toMatchObject({ databaseCode: "42501" });
    expect(supabase.from.mock.calls.map(([table]) => table)).toEqual([
      "admin_notes",
      "audit_logs",
    ]);
  });

  it("returns a controlled partial-failure result when status audit persistence fails", async () => {
    const supabase = createSupabaseClient();
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.requireAdmin.mockResolvedValue({
      supabase,
      profile: { id: "00000000-0000-4000-8000-000000000002" },
    });

    const result = await updateEnquiryStatusAction({
      enquiryId: "00000000-0000-4000-8000-000000000001",
      status: "contacted",
    });

    expect(result).toEqual({
      success: false,
      error: "Status was updated, but its audit record could not be saved. Refresh and verify before retrying.",
    });
    expect(JSON.stringify(result)).not.toContain("provider detail");
    expect(JSON.stringify(log.mock.calls)).not.toContain("provider detail");
    expect(log).toHaveBeenCalledWith("[admin] Audit persistence failed after status update.", {
      operation: "status_update",
      databaseCode: "42501",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("returns a controlled partial-failure result when note audit persistence fails", async () => {
    const supabase = createSupabaseClient();
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.requireAdmin.mockResolvedValue({
      supabase,
      profile: { id: "00000000-0000-4000-8000-000000000002" },
    });

    const result = await addAdminNoteAction({
      enquiryId: "00000000-0000-4000-8000-000000000001",
      note: "Reviewed application timeline",
    });

    expect(result).toEqual({
      success: false,
      error: "Note was saved, but its audit record could not be saved. Refresh before retrying.",
    });
    expect(JSON.stringify(result)).not.toContain("provider detail");
    expect(JSON.stringify(log.mock.calls)).not.toContain("provider detail");
    expect(log).toHaveBeenCalledWith("[admin] Audit persistence failed after note creation.", {
      operation: "note_create",
      databaseCode: "42501",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe("database grants and audit policy migration", () => {
  const migration = readFileSync(
    join(process.cwd(), "supabase/migrations/0008_explicit_data_api_grants_and_audit_policy.sql"),
    "utf8"
  );

  it("revokes blanket table privileges and grants only application-required access", () => {
    expect(migration).toMatch(/revoke all privileges on table[\s\S]*from anon, authenticated, service_role, public/i);
    expect(migration).toMatch(/grant select on table public\.enquiries to authenticated/i);
    expect(migration).toMatch(/grant update \(status\) on table public\.enquiries to authenticated/i);
    expect(migration).toMatch(/grant select \(id, auth_user_id, display_name, role\)[\s\S]*on table public\.admin_profiles to authenticated/i);
    expect(migration).toMatch(/grant select on table public\.admin_notes to authenticated/i);
    expect(migration).toMatch(/grant insert \(enquiry_id, admin_user_id, note\)[\s\S]*on table public\.admin_notes to authenticated/i);
    expect(migration).toMatch(/grant select on table public\.audit_logs to authenticated/i);
    expect(migration).toMatch(/grant insert \(admin_user_id, action, entity_type, entity_id, safe_metadata\)[\s\S]*on table public\.audit_logs to authenticated/i);
    expect(migration).toMatch(/grant insert \([\s\S]*?\) on table public\.enquiries to service_role/i);
    expect(migration).toMatch(/grant select \(id, created_at\) on table public\.enquiries to service_role/i);
    expect(migration).not.toMatch(/grant\s+all\s+(?:privileges\s+)?on\s+table/i);
  });

  it("does not grant anonymous reads and limits is_admin execution to authenticated admins", () => {
    const revokeBlock = migration.match(/revoke all privileges on table[\s\S]*?;/i)?.[0] ?? "";
    for (const table of ["enquiries", "admin_profiles", "admin_notes", "audit_logs"]) {
      expect(revokeBlock).toContain(`public.${table}`);
    }
    expect(revokeBlock).toMatch(/from anon, authenticated, service_role, public/i);
    expect(migration).toMatch(/revoke execute on function public\.is_admin\(\) from public, anon, service_role/i);
    expect(migration).toMatch(/grant execute on function public\.is_admin\(\) to authenticated/i);
    expect(migration).not.toMatch(/grant\s+select[^;]*\bto\s+anon\b/i);
  });

  it("allows only authenticated admins to append audit rows", () => {
    expect(migration).toMatch(
      /create policy "Admins can insert audit logs"\s+on public\.audit_logs for insert\s+to authenticated\s+with check \([\s\S]*?public\.is_admin\(\)[\s\S]*?admin_user_id =/i
    );
    expect(migration).toMatch(
      /admin_user_id = \(\s*select profile\.id[\s\S]*where profile\.auth_user_id = \(select auth\.uid\(\)\)/i
    );
    expect(migration).not.toMatch(/create policy[^;]*on public\.audit_logs for (?:update|delete)/i);
    expect(migration).not.toMatch(/grant\s+(?:update|delete)[^;]*on table public\.audit_logs/i);
  });
});
