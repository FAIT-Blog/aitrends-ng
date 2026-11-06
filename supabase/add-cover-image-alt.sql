-- Cover image alt text
-- Editorial polish.
--
-- Before this migration every frontend <img> used cover_image_prompt as its alt
-- text, so screen readers read the image-generation prompt (a long art
-- direction string) instead of a description of the rendered image. The
-- pipeline now generates a dedicated IMAGE_ALT value, stores it on
-- pending_posts.image_alt during Phase 1, and carries it through Phase 2 into
-- posts.cover_image_alt.
--
-- pending_posts is created outside this repository (the live table predates the
-- repo's SQL files), so both statements are idempotent ALTERs. Safe to re-run.
-- Run once in the Supabase SQL editor, then:
--   NOTIFY pgrst, 'reload schema';

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS cover_image_alt text NOT NULL DEFAULT '';

ALTER TABLE pending_posts
  ADD COLUMN IF NOT EXISTS image_alt text NOT NULL DEFAULT '';

NOTIFY pgrst, 'reload schema';
