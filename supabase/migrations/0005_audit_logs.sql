-- Records significant administrative actions for accountability.
-- safe_metadata must never contain full enquiry payloads or secrets —
-- only small, non-sensitive descriptive fields (e.g. { "from_status":
-- "new", "to_status": "contacted" }).
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references admin_profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  safe_metadata jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);
create index audit_logs_created_at_idx on audit_logs (created_at desc);
