create table admin_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries (id) on delete cascade,
  admin_user_id uuid not null references admin_profiles (id) on delete set null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admin_notes_note_length check (char_length(note) between 1 and 4000)
);

create index admin_notes_enquiry_id_idx on admin_notes (enquiry_id);
