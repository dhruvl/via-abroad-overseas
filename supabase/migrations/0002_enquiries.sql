create table enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type enquiry_type not null,

  full_name text not null,
  phone text not null,
  email text not null,

  interested_country text,
  service_required text,
  current_qualification text,
  interested_course text,
  message text,

  status enquiry_status not null default 'new',

  source_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  consent boolean not null default false,
  consent_at timestamptz,

  -- Short-lived, salted hash of a coarse request fingerprint used only for
  -- abuse-pattern detection. Never a raw IP address or other direct
  -- identifier.
  abuse_fingerprint text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint enquiries_full_name_length check (char_length(full_name) between 2 and 120),
  constraint enquiries_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint enquiries_message_length check (message is null or char_length(message) <= 4000)
);

create index enquiries_status_idx on enquiries (status);
create index enquiries_enquiry_type_idx on enquiries (enquiry_type);
create index enquiries_created_at_idx on enquiries (created_at desc);
create index enquiries_email_idx on enquiries (lower(email));
create index enquiries_phone_idx on enquiries (phone);

comment on table enquiries is 'Public contact and consultation form submissions. Inserted only via server-side code using the Supabase secret key.';
