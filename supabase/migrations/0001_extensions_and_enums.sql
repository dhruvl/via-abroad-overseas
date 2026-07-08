-- Extensions
create extension if not exists "pgcrypto";

-- Enumerated types used to constrain enquiry classification.
-- Application code must validate against these same values before insert.
create type enquiry_type as enum ('general', 'consultation');

create type enquiry_status as enum ('new', 'contacted', 'qualified', 'closed', 'spam');

create type admin_role as enum ('admin');
