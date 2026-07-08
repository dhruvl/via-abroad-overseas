create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger enquiries_set_updated_at
  before update on enquiries
  for each row execute function set_updated_at();

create trigger admin_profiles_set_updated_at
  before update on admin_profiles
  for each row execute function set_updated_at();

create trigger admin_notes_set_updated_at
  before update on admin_notes
  for each row execute function set_updated_at();
