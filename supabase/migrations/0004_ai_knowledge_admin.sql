create table if not exists public.ai_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  language text not null,
  page_count integer not null default 0,
  scope text not null,
  summary text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.ai_knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  source_id uuid references public.ai_knowledge_sources(id) on delete set null,
  tag text not null,
  title text not null,
  detail text not null,
  sequence integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.ai_objection_scripts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  objection text not null,
  short_answer text not null,
  talk_track text not null,
  next_move text not null,
  sequence integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index if not exists idx_ai_knowledge_sources_status_language
  on public.ai_knowledge_sources(status, language)
  where deleted_at is null;

create index if not exists idx_ai_knowledge_entries_status_sequence
  on public.ai_knowledge_entries(status, sequence)
  where deleted_at is null;

create index if not exists idx_ai_knowledge_entries_source_id
  on public.ai_knowledge_entries(source_id);

create index if not exists idx_ai_objection_scripts_status_sequence
  on public.ai_objection_scripts(status, sequence)
  where deleted_at is null;

drop trigger if exists handle_ai_knowledge_sources_updated_at on public.ai_knowledge_sources;
create trigger handle_ai_knowledge_sources_updated_at
before update on public.ai_knowledge_sources
for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_ai_knowledge_entries_updated_at on public.ai_knowledge_entries;
create trigger handle_ai_knowledge_entries_updated_at
before update on public.ai_knowledge_entries
for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_ai_objection_scripts_updated_at on public.ai_objection_scripts;
create trigger handle_ai_objection_scripts_updated_at
before update on public.ai_objection_scripts
for each row execute procedure public.handle_updated_at();

alter table public.ai_knowledge_sources enable row level security;
alter table public.ai_knowledge_entries enable row level security;
alter table public.ai_objection_scripts enable row level security;

drop policy if exists "members read active ai knowledge sources" on public.ai_knowledge_sources;
create policy "members read active ai knowledge sources"
on public.ai_knowledge_sources for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "admins manage ai knowledge sources" on public.ai_knowledge_sources;
create policy "admins manage ai knowledge sources"
on public.ai_knowledge_sources for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "members read active ai knowledge entries" on public.ai_knowledge_entries;
create policy "members read active ai knowledge entries"
on public.ai_knowledge_entries for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "admins manage ai knowledge entries" on public.ai_knowledge_entries;
create policy "admins manage ai knowledge entries"
on public.ai_knowledge_entries for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "members read active ai objection scripts" on public.ai_objection_scripts;
create policy "members read active ai objection scripts"
on public.ai_objection_scripts for select
using (
  (status = 'active' and deleted_at is null)
  or public.is_admin()
);

drop policy if exists "admins manage ai objection scripts" on public.ai_objection_scripts;
create policy "admins manage ai objection scripts"
on public.ai_objection_scripts for all
using (public.is_admin())
with check (public.is_admin());

insert into public.ai_knowledge_sources (slug, title, language, page_count, scope, summary)
values
  (
    'goldnow-en-2026',
    'GoldNow by Tomei pdf.pdf',
    'English',
    15,
    '产品定位、信任基础、买入流程、兑换流程、伙伴计划',
    '英文版资料较完整，包含 Why Gold、Trust & Security、伙伴计划、购买流程与实体兑换流程。'
  ),
  (
    'goldnow-cn-2026',
    'GoldNow-by-Tomei-CN_2026.pdf',
    '中文',
    11,
    '核心卖点、Shariah 结构、0.1 克起购、实体兑换、推荐计划',
    '中文版资料更适合中文 demo 口径，表达更直接，适合提炼给 AI 作为客户可理解的话术基础。'
  )
on conflict (slug) do nothing;

insert into public.ai_knowledge_entries (slug, source_id, tag, title, detail, sequence)
select payload.slug, src.id, payload.tag, payload.title, payload.detail, payload.sequence
from (
  values
    ('platform-positioning', 'goldnow-cn-2026', '核心定位', '安全且符合 Shariah 的数字黄金平台', 'GoldNow by Tomei 是一个安全、符合伊斯兰教法（Shariah）的数字黄金平台，强调真实黄金、数字化持有与随时兑换。', 1),
    ('gold-purity', 'goldnow-cn-2026', '产品事实', '999.9 纯度真实黄金', '根据中文版资料，GoldNow 支持按所需数量购买 999.9 纯度黄金，并以克数累积持有。', 2),
    ('low-entry-point', 'goldnow-en-2026', '低门槛', '从 0.1 克开始', '用户可以从 0.1 克开始买入，不需要大额资金，重点是长期累积与纪律。', 3),
    ('why-gold', 'goldnow-cn-2026', '黄金逻辑', '黄金重点是保值，不是投机', 'GoldNow 资料强调黄金是跨越时间的价值保存工具，尤其适合面对通胀、货币购买力下降与不确定环境。', 4),
    ('real-gold-backing', 'goldnow-cn-2026', '实体支持', '真实黄金支持，不是纯虚拟概念', '资料强调数字黄金只有在真实黄金完全支持、透明且可兑换时才有意义；中文版写明每 1 克数字黄金对应 1 克真实实体黄金。', 5),
    ('physical-redemption', 'goldnow-en-2026', '兑换能力', '可在 Tomei 门店兑换实体黄金', 'GoldNow 支持将数字黄金兑换为实体黄金，可在全国 Tomei 门店进行兑换与领取。', 6),
    ('tomei-trust-foundation', 'goldnow-en-2026', '信任基础', 'Tomei 的实体基础设施支撑', '资料强调 Tomei 是马来西亚上市黄金与珠宝集团，成立于 1968 年，拥有 50+ 年行业经验与 60+ 零售网点。', 7),
    ('shariah-structure', 'goldnow-en-2026', 'Shariah', '无利息、无保本、无保证回报', 'GoldNow 的 Shariah 结构重点是：真实资产支持、无利息型收益、无保证回报、不做投机或杠杆式交易。', 8),
    ('buy-flow', 'goldnow-en-2026', '购买流程', '先 Top Up，再 Buy', '英文版购买流程显示：先在 Top Up 菜单充值 GoldNow Points，再去 Buy 菜单按克数买入黄金。', 9)
) as payload(slug, source_slug, tag, title, detail, sequence)
join public.ai_knowledge_sources src
  on src.slug = payload.source_slug
on conflict (slug) do nothing;

insert into public.ai_objection_scripts (slug, objection, short_answer, talk_track, next_move, sequence)
values
  ('is-this-real-gold', '客户问：这是真的吗？还是只是 App 里的数字？', '这是 GoldNow 最值得主动讲的地方，它强调每 1 克数字黄金对应 1 克真实实体黄金，而且可以兑换实体黄金。', '你可以这样讲：『它不是只有价格曲线的虚拟点数，而是背后有真实黄金支持。你在 App 里是数字化持有，但需要时可以到 Tomei 门店换成实体黄金。』', '下一句建议主动补：Tomei 有实体门店与长期基础设施，不是纯线上概念。', 1),
  ('is-this-mlm', '客户问：这个是不是 MLM？', 'GoldNow 资料里确实有推荐与伙伴计划，但官方写法是合规、交易驱动、无保证收入，不能讲成拉人头承诺回报。', '你可以这样讲：『它有伙伴参与机制，但奖励是建立在真实黄金交易基础上，不是空口承诺收益；而且官方资料明确写了无保证收入、无投资回报承诺，并要求 KYC 与合规。』', '如果客户继续追问，重点回到“真实交易、合规介绍、长期参与”这三个关键词。', 2),
  ('how-much-to-start', '客户问：我要很多钱才能开始吗？', '不用，GoldNow 的重点之一就是门槛低，从 0.1 克就可以开始。', '你可以这样讲：『这不是一定要很大笔钱才玩得起的产品，0.1 克就能开始，更像是用比较轻松的方式慢慢累积真实黄金。』', '下一句建议补：重点不是一次买很多，而是持续累积。', 3),
  ('what-makes-it-shariah', '客户问：为什么它可以说符合 Shariah？', '因为它强调真实资产支持、没有利息型收益、没有保本或保证回报，也不是杠杆和投机结构。', '你可以这样讲：『它不是靠承诺回报来吸引人，而是用真实黄金所有权为基础，再加上无利息、无保证回报的结构，所以才会把 Shariah 放成核心原则。』', '如果对方很在意宗教合规，补一句有权威伊斯兰教法顾问背书会更稳。', 4),
  ('can-redeem-physical', '客户问：买了以后真的能拿到实体黄金吗？', '可以，GoldNow 最强的说服点之一就是数字持有、实体可兑。', '你可以这样讲：『你平时在 App 管理持有量，需要的时候可以选兑换重量、选 Tomei 门店，再去指定门店领取实体黄金。』', '建议顺手补一句：领取时会做身份核验，这反而更像正规的实物交付流程。', 5),
  ('is-there-guaranteed-return', '客户问：这个会不会保证我赚？', '官方资料没有把它包装成保证赚钱产品，反而一直强调黄金更适合做长期保值，而不是短线投机。', '你可以这样讲：『它的重点不是向你承诺回报，而是让你更容易拥有真实黄金；如果讲得更直一点，它卖的是资产持有逻辑，不是收益保证。』', '把对话拉回“真实黄金、低门槛、可兑换”会更专业。', 6),
  ('why-tomei', '客户问：为什么是 Tomei，凭什么信它？', '因为 GoldNow 背后不是一间纯 App 公司，而是有实体黄金零售、制造、供应链和门店网络支撑的 Tomei 集团。', '你可以这样讲：『Tomei 是马来西亚上市黄金与珠宝集团，成立于 1968 年，拥有 50+ 年经验和 60+ 零售网点，所以它的数字黄金不是脱离实体能力存在的。』', '如果客户点头，就接“这也是为什么它能做实体兑换”这句。', 7)
on conflict (slug) do nothing;
