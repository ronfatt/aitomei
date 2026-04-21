insert into public.missions (slug, title, description, type, sequence, reward_points, reward_item, unlock_condition, proof_requirement, validation_rule)
values
  ('complete-profile', 'Complete Your Member Profile', 'Add your personal details, product interests, and content goals.', 'profile', 1, 100, 'Foundation badge', 'Available on signup', 'No proof required', 'Profile completion reaches 100%'),
  ('upload-profile-photo', 'Upload a Premium Profile Photo', 'Upload a clear portrait for personalized materials.', 'profile', 2, 80, 'Visual identity badge', 'Mission 1 completed', 'Profile photo upload', 'A valid storage object is attached to the profile'),
  ('generate-first-poster', 'Generate Your First Personalized Poster', 'Choose a campaign, upload a photo, and request your first branded poster.', 'content', 3, 150, 'Studio starter bonus', 'Profile photo uploaded', 'Saved generated asset', 'At least one poster asset exists'),
  ('submit-first-post', 'Publish Your First Social Post', 'Share your first branded post and submit the URL for review.', 'social', 4, 180, 'Spotlight badge', 'Poster generated', 'Social URL and optional screenshot', 'Approved proof submission on a supported platform'),
  ('three-day-streak', 'Complete a 3-Day Posting Streak', 'Stay visible for three consecutive days using campaign-aligned content.', 'social', 5, 260, 'Consistency badge', 'First social post approved', 'Three approved submissions across three dates', 'Three-day streak recorded'),
  ('brand-introduction-lesson', 'Complete the TOMEI Brand Introduction', 'Learn the brand story and communication pillars.', 'learning', 6, 120, 'Brand fluency badge', 'Available on signup', 'Lesson completion', 'Learning module completion stored'),
  ('first-video-request', 'Request Your First Personalized Short Video', 'Queue a branded short-form template with your CTA and ending card.', 'content', 7, 200, 'Motion creator badge', 'First poster and first post completed', 'Queued video generation request', 'A queued or delivered video asset exists'),
  ('product-knowledge-quiz', 'Pass the Product Knowledge Quiz', 'Demonstrate confidence recommending key jewelry categories.', 'learning', 8, 220, 'Advisor badge', 'Brand lesson completed', 'Quiz score submission', 'Quiz score greater than passing threshold'),
  ('ask-ai-coach', 'Ask AI Coach Three Questions', 'Use AI Coach to learn and plan content with confidence.', 'ai', 9, 90, 'AI learner badge', 'AI Coach activated', 'Chat interaction count', 'Three member messages logged'),
  ('campaign-finale', 'Complete a Campaign Challenge Finale', 'Join a featured campaign and hit the final milestone.', 'campaign', 10, 400, 'Campaign prestige badge', 'Missions 1-9 completed', 'Campaign participation and approved proof', 'Campaign milestone met and verified')
on conflict (slug) do nothing;

insert into public.rewards (slug, title, description, badge_name, points_required, reward_type, is_redeemable)
values
  ('starter-glow', 'Starter Glow', 'Unlock the foundational badge set and onboarding pack.', 'Founder Light', 500, 'milestone', false),
  ('signature-presence', 'Signature Presence', 'Access premium templates and priority challenge invites.', 'Signature Circle', 1500, 'milestone', false),
  ('campaign-luminary', 'Campaign Luminary', 'Unlock elevated seasonal rewards and exclusive briefs.', 'Luminary Crest', 3000, 'milestone', true)
on conflict (slug) do nothing;

insert into public.campaigns (slug, title, theme, summary, cta, starts_at, ends_at)
values
  ('raya-radiance-2026', 'Raya Radiance 2026', 'Festive elegance', 'Drive festive storytelling with warm gifting and family celebration visuals.', 'Generate a festive poster', '2026-04-20T00:00:00+08', '2026-05-31T23:59:59+08'),
  ('bridal-signatures', 'Bridal Signatures', 'Bridal & promise', 'Highlight timeless bridal and promise pieces with a soft luxury tone.', 'Open campaign brief', '2026-01-01T00:00:00+08', null),
  ('daily-gold-story', 'Daily Gold Story', 'Educational content', 'Encourage daily product education content with AI caption support.', 'See today''s prompt', '2026-01-01T00:00:00+08', null)
on conflict (slug) do nothing;

insert into public.news_items (slug, category, title, summary)
values
  ('raya-assets-live', 'Campaign', 'New social assets released for Raya Radiance', 'Fresh poster layouts and short-video end cards are now available in Content Studio.'),
  ('brand-story-refresh', 'Training', 'Brand story micro-learning refreshed', 'The intro lesson now includes new luxury positioning language and updated quiz prompts.'),
  ('proof-sla-updated', 'Operations', 'Proof review SLA improved to same-day', 'Pending social proof submissions will be reviewed within the same business day when possible.')
on conflict (slug) do nothing;

insert into public.products (slug, name, category, story, price_range, spotlight)
values
  ('celestial-gold-pendant', 'Celestial Gold Pendant', 'Gold jewelry', 'A lightweight everyday gold piece designed for gifting and effortless layering.', 'RM 899 - RM 1,299', 'Great for daily elegance storytelling and gifting themes.'),
  ('promise-diamond-ring', 'Promise Diamond Ring', 'Diamond jewelry', 'A modern promise silhouette for anniversaries and milestone moments.', 'RM 2,600 - RM 4,800', 'Ideal for aspiration-led content with educational captions.'),
  ('heritage-bangle-collection', 'Heritage Bangle Collection', 'Festive collection', 'Warm gold bangles built for family occasions and heirloom gifting stories.', 'RM 1,800 - RM 3,500', 'Strong fit for festive campaign visuals and family-focused narratives.')
on conflict (slug) do nothing;

insert into public.learning_modules (slug, title, category, summary, duration_minutes)
values
  ('brand-story', 'The TOMEI Brand Story', 'Brand fundamentals', 'Learn the brand narrative, trust cues, and premium communication pillars.', 8),
  ('gold-basics', 'Gold Jewelry Basics for Members', 'Product knowledge', 'Understand categories, gifting occasions, and how to explain quality with confidence.', 12),
  ('luxury-social', 'Posting Luxury Content Without Feeling Pushy', 'Promotion skills', 'Create aspirational, helpful content that supports the brand without sounding salesy.', 10)
on conflict (slug) do nothing;

insert into public.quizzes (learning_module_id, slug, title, passing_score, question_payload)
select lm.id,
       concat(lm.slug, '-quiz'),
       concat(lm.title, ' Quiz'),
       70,
       jsonb_build_array(
         jsonb_build_object('question', 'What is the core message of this module?', 'type', 'short_text'),
         jsonb_build_object('question', 'How would you apply this lesson in a member post?', 'type', 'short_text')
       )
from public.learning_modules lm
on conflict (slug) do nothing;

insert into public.content_templates (slug, title, asset_type, audience, metadata)
values
  ('ivory-signature-poster', 'Ivory Signature Poster', 'poster', 'Festive & gifting', '{"theme":"ivory-gold","layout":"hero"}'::jsonb),
  ('luxury-social-caption-pack', 'Luxury Social Starter Caption Set', 'caption', 'Education-first promoters', '{"platforms":["facebook","instagram","tiktok"]}'::jsonb),
  ('campaign-end-card-video', '30s Campaign End Card Video', 'video', 'Short-form creators', '{"duration_seconds":30}'::jsonb)
on conflict (slug) do nothing;
