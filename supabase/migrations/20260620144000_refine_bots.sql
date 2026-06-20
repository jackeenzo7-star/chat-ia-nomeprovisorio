alter table bots
  drop column if exists personality,
  drop column if exists speaking_style,
  drop column if exists meeting_context,
  drop column if exists relationship,
  drop column if exists avatar_url,
  add column language_style text default 'informal',
  add column tone text default 'friendly',
  add column initial_greeting text default 'Olá! Como posso ajudar?';
