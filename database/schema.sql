create extension if not exists pgcrypto;

create table if not exists leads (
  id text primary key,
  business_name text not null,
  contact_person_name text default '',
  job_title text default '',
  email text default '',
  phone_number text default '',
  website text default '',
  instagram text default '',
  linkedin text default '',
  country text default '',
  city text default '',
  industry text default '',
  business_type text default '',
  source text default '',
  lead_status text default 'New',
  priority text default 'Low',
  lead_score integer default 0,
  estimated_opportunity text default '',
  monthly_ad_spend_estimate text default '',
  website_quality_score integer default 5,
  social_media_quality_score integer default 5,
  ads_presence text default '',
  tracking_quality text default '',
  what_they_are_missing text default '',
  how_rayq_can_help text default '',
  personalized_outreach_angle text default '',
  first_message_draft text default '',
  follow_up_1_draft text default '',
  follow_up_2_draft text default '',
  notes text default '',
  assigned_founder text default 'Omar',
  last_contacted_date date,
  next_follow_up_date date,
  created_date date default current_date,
  updated_date date default current_date,
  business_stage text,
  best_rayq_service_to_pitch text,
  why_it_matters text,
  estimated_impact text,
  why_now text,
  cro_opportunity_score integer,
  paid_ads_opportunity_score integer,
  content_opportunity_score integer,
  tracking_opportunity_score integer,
  overall_rayq_fit_score integer,
  diagnosis_tags text[],
  verification_status text,
  contact_data_quality text,
  opportunity_type text[],
  best_outreach_channel text,
  data_confidence_score integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null references leads(id) on delete cascade,
  due_date date not null,
  status text not null default 'Open',
  notes text default '',
  assigned_founder text default 'Omar',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists outreach_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null references leads(id) on delete cascade,
  channel text not null default 'Email',
  message text not null default '',
  status text not null default 'Draft',
  created_by text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists discovered_leads (
  id text primary key,
  business_name text not null,
  website text default '',
  phone_number text default '',
  email text default '',
  address text default '',
  city text default '',
  country text default '',
  industry text default '',
  business_type text default '',
  business_stage text,
  source text not null,
  verification_status text default 'Needs review',
  contact_data_quality text default 'Missing',
  opportunity_type text[],
  best_outreach_channel text,
  opportunity_score integer default 0,
  best_rayq_service_to_pitch text default '',
  suggested_outreach_angle text default '',
  source_url text default '',
  google_maps_url text default '',
  rating numeric,
  category text default '',
  data_confidence_score integer default 0,
  raw_payload jsonb default '{}'::jsonb,
  saved_lead_id text references leads(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists leads_status_idx on leads (lead_status);
create index if not exists leads_priority_idx on leads (priority);
create index if not exists leads_founder_idx on leads (assigned_founder);
create index if not exists leads_country_idx on leads (country);
create index if not exists leads_next_follow_up_idx on leads (next_follow_up_date);
create index if not exists leads_source_idx on leads (source);
create index if not exists follow_ups_lead_id_idx on follow_ups (lead_id);
create index if not exists follow_ups_due_date_idx on follow_ups (due_date);
create index if not exists outreach_notes_lead_id_idx on outreach_notes (lead_id);
create index if not exists discovered_leads_source_idx on discovered_leads (source);
create index if not exists discovered_leads_score_idx on discovered_leads (opportunity_score);
