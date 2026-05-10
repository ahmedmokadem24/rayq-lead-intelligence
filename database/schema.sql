create table leads (
  id text primary key,
  business_name text not null,
  contact_person_name text,
  job_title text,
  email text,
  phone_number text,
  website text,
  instagram text,
  linkedin text,
  country text,
  city text,
  industry text,
  business_type text,
  source text,
  lead_status text,
  priority text,
  lead_score integer,
  estimated_opportunity text,
  monthly_ad_spend_estimate text,
  website_quality_score integer,
  social_media_quality_score integer,
  ads_presence text,
  tracking_quality text,
  what_they_are_missing text,
  how_rayq_can_help text,
  personalized_outreach_angle text,
  first_message_draft text,
  follow_up_1_draft text,
  follow_up_2_draft text,
  notes text,
  assigned_founder text,
  last_contacted_date date,
  next_follow_up_date date,
  created_date date,
  updated_date date
);

create index leads_status_idx on leads (lead_status);
create index leads_priority_idx on leads (priority);
create index leads_founder_idx on leads (assigned_founder);
create index leads_country_idx on leads (country);
create index leads_next_follow_up_idx on leads (next_follow_up_date);
