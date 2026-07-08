"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { updateStatusSchema, createNoteSchema } from "@/lib/validation/admin";
import { updateEnquiryStatus, addAdminNote } from "@/lib/database/admin-queries";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateEnquiryStatusAction(
  input: unknown
): Promise<ActionResult> {
  // Re-verifies the session + admin role on every call — this action is
  // reachable from client code, so it must never trust that only the
  // dashboard UI calls it.
  const { supabase, profile } = await requireAdmin();

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    await updateEnquiryStatus(supabase, parsed.data.enquiryId, parsed.data.status, profile.id);
  } catch (error) {
    console.error(
      "[admin] Failed to update enquiry status:",
      error instanceof Error ? error.message : "unknown error"
    );
    return { success: false, error: "Could not update status. Please try again." };
  }

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${parsed.data.enquiryId}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function addAdminNoteAction(input: unknown): Promise<ActionResult> {
  const { supabase, profile } = await requireAdmin();

  const parsed = createNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Note cannot be empty." };
  }

  try {
    await addAdminNote(supabase, parsed.data.enquiryId, profile.id, parsed.data.note);
  } catch (error) {
    console.error(
      "[admin] Failed to add note:",
      error instanceof Error ? error.message : "unknown error"
    );
    return { success: false, error: "Could not save note. Please try again." };
  }

  revalidatePath(`/admin/enquiries/${parsed.data.enquiryId}`);
  return { success: true };
}
