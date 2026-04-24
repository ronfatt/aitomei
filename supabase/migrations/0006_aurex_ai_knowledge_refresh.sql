update public.ai_knowledge_sources
set
  status = 'archived',
  deleted_at = coalesce(deleted_at, timezone('utc', now()))
where slug in ('goldnow-en-2026', 'goldnow-cn-2026');

update public.ai_knowledge_entries
set
  status = 'archived',
  deleted_at = coalesce(deleted_at, timezone('utc', now()))
where slug in (
  'platform-positioning',
  'gold-purity',
  'low-entry-point',
  'why-gold',
  'real-gold-backing',
  'physical-redemption',
  'tomei-trust-foundation',
  'shariah-structure',
  'buy-flow'
);

update public.ai_objection_scripts
set
  status = 'archived',
  deleted_at = coalesce(deleted_at, timezone('utc', now()))
where slug in (
  'is-this-real-gold',
  'is-this-mlm',
  'how-much-to-start',
  'what-makes-it-shariah',
  'can-redeem-physical',
  'is-there-guaranteed-return',
  'why-tomei'
);

insert into public.ai_knowledge_sources (slug, title, language, page_count, scope, summary, status, deleted_at)
values
  (
    'aurex-legacy-docx',
    '项目名称AUREX LEGACY.docx',
    '中文',
    13,
    '品牌定位、商业模型、产品阶梯、资本叙事、公司愿景',
    '策略文档定义了 Aurex Legacy 的核心定位：高端文化珠宝资产平台，连接实物收藏、会员关系与数字确权基础设施。',
    'active',
    null
  ),
  (
    'aurex-jewelry-ecosystem-pdf',
    'AI_珠宝生态.pdf',
    '中文',
    0,
    '珠宝生态、页面叙事、黑金品牌世界观、会员演示场景',
    '视觉资料用于辅助表达黑金品牌气质、会员生态和 provenance 叙事。',
    'active',
    null
  )
on conflict (slug) do update
set
  title = excluded.title,
  language = excluded.language,
  page_count = excluded.page_count,
  scope = excluded.scope,
  summary = excluded.summary,
  status = excluded.status,
  deleted_at = excluded.deleted_at,
  updated_at = timezone('utc', now());

insert into public.ai_knowledge_entries (slug, source_id, tag, title, detail, sequence, status, deleted_at)
select payload.slug, src.id, payload.tag, payload.title, payload.detail, payload.sequence, 'active', null
from (
  values
    ('platform-positioning', 'aurex-legacy-docx', '核心定位', 'Luxury Consumer Asset System', 'Aurex Legacy 不是单纯卖珠宝，而是把高端文化金章、珠宝消费权益、数字确权证书和全球会员网络做成一个可持续经营的高端消费资产系统。', 1),
    ('three-layer-model', 'aurex-legacy-docx', '三层结构', '实物层、会员层、数字层共同闭环', '它的商业闭环分成三层：实物层承接金章与珠宝成交，会员层沉淀权益与服务关系，数字层承接确权、溯源、防伪和资产记录。', 2),
    ('heritage-gold-plaque', 'aurex-legacy-docx', '产品锚点', 'Heritage Gold Plaque 是最容易讲的入口', 'Heritage Gold Plaque 强调唯一编号、定制内容、发行批次和收藏故事，适合从高端礼赠、纪念和身份表达切入。', 3),
    ('privilege-account', 'aurex-legacy-docx', '会员逻辑', 'Jewelry Privilege Account 不是一次性卖货', '用户购买指定配套后，会进入珠宝权益账户逻辑，后续可以围绕兑换、定制、升级和 VIP 服务持续经营，而不是卖完就结束。', 4),
    ('digital-provenance', 'aurex-legacy-docx', '数字确权', 'Digital Provenance Certificate 强调溯源与所有权记录', '每件产品都绑定数字确权证书，用于溯源、防伪、所有权记录和未来资产接口，但表达重点是 provenance 与 audit trail，不是炒概念。', 5),
    ('membership-club', 'aurex-legacy-docx', '会员生态', 'Global Membership Club 让高端成交变长期关系', '会员可获得专属活动邀请、私人定制服务、线下礼遇、新品优先购买权和全球门店权益互通，所以它更像高端会员俱乐部，不像普通零售门店。', 6),
    ('product-ladder', 'aurex-legacy-docx', '产品分层', '从 Entry 到 Founder Circle 的分层设计', '产品阶梯分成 Heritage Access Pack、Signature Legacy Pack、Family Heritage Pack 和 Founder Circle / Black Card，用来承接首购、升级、家族传承和顶层客户关系。', 7),
    ('global-capital-language', 'aurex-legacy-docx', '资本语言', '四条国际资本市场能听懂的语言', 'Aurex Legacy 同时踩中 Luxury Brand、Membership Economy、Asset Digitization 和 RWA Optionality 四条资本语言，所以品牌叙事既能面向客户，也能面向更长期的公司故事。', 8),
    ('rwa-direction', 'aurex-legacy-docx', '合规表达', 'RWA 是战略基础设施方向，不是当前零售承诺', '资料写得很清楚：RWA 方向是未来合规基础设施能力，包括确权、数字凭证登记、审计和兼容接口，不是现在就向客户承诺任何证券化或收益结果。', 9),
    ('nasdaq-roadmap', 'aurex-legacy-docx', '路线图', '纳斯达克叙事是三阶段治理升级路线', '上市叙事不是一句口号，而是 Brand & Revenue Foundation、Regional Expansion & Governance Upgrade、Capital Market Readiness 三阶段路线，先把收入、治理、审计和系统做扎实。', 10),
    ('brand-moat', 'aurex-legacy-docx', '竞争壁垒', '品牌护城河来自身份价值、履约能力与数字基础设施', '它的壁垒不只是珠宝本身，还包括情绪与身份价值、线下履约能力、可审计的编号体系、高毛利会员模型，以及未来资本化弹性。', 11)
) as payload(slug, source_slug, tag, title, detail, sequence)
join public.ai_knowledge_sources src
  on src.slug = payload.source_slug
on conflict (slug) do update
set
  source_id = excluded.source_id,
  tag = excluded.tag,
  title = excluded.title,
  detail = excluded.detail,
  sequence = excluded.sequence,
  status = excluded.status,
  deleted_at = excluded.deleted_at,
  updated_at = timezone('utc', now());

insert into public.ai_objection_scripts (slug, objection, short_answer, talk_track, next_move, sequence, status, deleted_at)
values
  ('what-is-aurex', '客户问：Aurex Legacy 到底是什么？你用一句话讲给我听。', '它可以被理解成一个把高端珠宝、会员权益和数字确权做成长期关系的 luxury heritage platform。', '你可以这样讲：『它不是普通珠宝零售，而是把产品、会员身份和可追溯的 provenance 记录串在一起，让每次成交都能变成长期关系。』', '下一句建议补：先有真实商品和会员服务，再谈数字确权与未来接口。', 1, 'active', null),
  ('is-this-just-jewelry-store', '客户问：这不就是一家卖珠宝的吗？为什么要讲这么多系统？', '它当然卖珠宝，但重点不是卖完就结束，而是把高端成交沉淀进会员账户、礼遇服务和数字档案。', '你可以这样讲：『普通珠宝店是一次性成交，Aurex Legacy 想做的是成交之后还有权益、升级、活动、档案和长期关系，所以系统层才有意义。』', '如果客户点头，就接 Privilege Account 和 Global Membership Club 这两个词。', 2, 'active', null),
  ('is-this-mlm', '客户问：这个是不是 MLM、会员盘或拉人头系统？', '不是。它的设计逻辑不是 downline/upline，也不是招募返佣模型，而是高端产品、会员权益和品牌关系经营。', '你可以这样讲：『它不是靠拉人头结算的系统，也不是多层级招募盘。它讲的是高端消费、会员服务、数字确权和品牌长期关系。』', '如果对方继续追问，就回到“真实产品、会员权益、非招募结算”这三个关键词。', 3, 'active', null),
  ('what-is-provenance', '客户问：数字确权证书到底有什么实际意义？', '它最实际的意义是让每件产品有清晰的编号、来源、故事和所有权记录，看起来更高级，也更容易沉淀品牌资产。', '你可以这样讲：『它不是随便贴一个二维码，而是把产品身份、批次、故事和 ownership record 做成可追溯档案，这对高端礼赠、收藏和会员信任都很重要。』', '建议顺手补一句：这也是未来 audit trail 和更长期资产化接口的基础。', 4, 'active', null),
  ('why-membership-account', '客户问：为什么还要做会员权益账户？', '因为高端珠宝最大的难点不是卖一次，而是怎么把客户留在品牌体系里持续复购、升级和参与。', '你可以这样讲：『会员权益账户的作用，是把消费额度、礼遇、服务和升级路径放进长期关系里，让品牌从一次性销售变成可经营的会员经济。』', '下一句建议补：这也是为什么产品要做 Entry、Core、Premium、Elite 四层阶梯。', 5, 'active', null),
  ('is-this-crypto', '客户问：你们这是 NFT、Crypto，还是发币项目吗？', '不是。Aurex Legacy 现在讲的是数字确权、可审计记录和未来接口，不是面向零售客户卖币或炒链上概念。', '你可以这样讲：『我们先把真实商品、会员系统和 provenance 做扎实，再谈未来合规数字资产基础设施；现在不是一个发币项目。』', '如果对方关注科技感，就补一句“先做底层数据与治理，再谈更远接口”。', 6, 'active', null),
  ('returns-and-rwa', '客户问：你们一直讲 RWA，是不是在暗示投资回报或升值？', '不是。RWA 在这里是长期基础设施方向，不是当前零售承诺，更不是收益保证。', '你可以这样讲：『我们现在讲 RWA，是指未来在合规前提下具备更完整的确权、登记和审计能力，不是向客户承诺升值、回本或证券化收益。』', '如果场景敏感，建议立刻回到 provenance、audit trail 和 member relationship 这三个表达。', 7, 'active', null),
  ('why-nasdaq-story', '客户问：为什么你们会提到纳斯达克或资本市场路线？', '那是公司治理和长期发展方向，不是对零售客户的销售承诺。', '你可以这样讲：『它想把品牌、会员、数字确权和治理系统做成国际资本市场能理解的结构，但路线是分阶段推进，先把收入、治理和系统做好。』', '你可以接一句：今天给客户看的重点，仍然是产品、会员礼遇和品牌信任基础。', 8, 'active', null)
on conflict (slug) do update
set
  objection = excluded.objection,
  short_answer = excluded.short_answer,
  talk_track = excluded.talk_track,
  next_move = excluded.next_move,
  sequence = excluded.sequence,
  status = excluded.status,
  deleted_at = excluded.deleted_at,
  updated_at = timezone('utc', now());
