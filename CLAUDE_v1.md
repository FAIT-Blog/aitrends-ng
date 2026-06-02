# AITrends.ng — Claude Code Project Spec
**Project:** AITrends.ng Automated AI News Blog  
**Owner:** Felix Okon  
**Stack:** Next.js · Supabase · Vercel · Pollinations.ai · Gemini Flash API · Render  
**Session Start:** May 2026  
**Claude Code Version:** Log all sessions as described in the SESSION LOG section below.

---

## 1. PROJECT OVERVIEW

AITrends.ng is a fully automated AI news digest blog covering Claude, Anthropic, and the broader AI model ecosystem. It is written in a punchy, opinionated digest voice and targeted at African builders and developers who follow global AI closely.

Every post is:
- Sourced automatically from RSS feeds
- Rewritten by Gemini 1.5 Flash into a punchy digest
- Illustrated with an AI-generated cover image (Pollinations.ai)
- Published automatically via a protected API endpoint
- Stored in Supabase
- Notified via Slack

The human owner (Felix) does **nothing daily**. The system runs autonomously on a schedule.

---

## 2. BRAND IDENTITY

**Name:** AITrends.ng  
**Tagline:** "The African builder's daily briefing on Claude, Anthropic, and the models shaping what's next."  
**Powered by:** FAIT (small footer attribution — "by FAIT")  
**Voice:** Punchy, opinionated, like a smart friend briefing you — not a journalist reporting at you  
**Audience:** African developers, founders, and AI builders  

### Visual Style
- **Background:** #0a0a0f (near black, slight blue tint)
- **Primary accent:** #2563eb (electric blue)
- **Secondary accent:** #f59e0b (gold — nods to Nigerian colours)
- **Text:** #e5e7eb
- **Muted text:** #6b7280
- **Font — headings:** Sora (Google Fonts)
- **Font — body:** Inter (Google Fonts)
- **Font — code:** JetBrains Mono (Google Fonts)
- **Border radius:** 8px standard, 12px cards
- **Card style:** Dark surface (#111827), 1px border (#1f2937), subtle hover lift

### AI-Generated Image Style
See **Section 15** for full image generation guidelines (updated after Session 1 audit).

The base style string appended to every Pollinations prompt:
```
...painterly [ART STYLE] illustration, dark background, electric blue and gold accent tones,
no text in image, sharp and modern
```
The `[ART STYLE]` and the scene description must reflect the actual story content — not the RSS source name. See Section 15.

---

## 3. ARCHITECTURE

```
RSS Feeds (Anthropic, Reddit, HN, newsletters)
        ↓
Scout Agent (Node.js cron — hosted on Render)
        ↓
Gemini 1.5 Flash — rewrites digest + generates image prompt
        ↓
Pollinations.ai — generates cover image from prompt
        ↓
Supabase — stores post record
        ↓
/api/posts/create — protected POST endpoint (Next.js API route)
        ↓
Post goes live on AITrends.ng (Vercel)
        ↓
Slack webhook — notifies Felix with title + image preview
```

---

## 4. DATABASE SCHEMA (Supabase)

### Table: `posts`

| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key, auto |
| title | text | post headline |
| slug | text | unique, auto-generated from title |
| content | text | full digest HTML or markdown |
| excerpt | text | 2-sentence summary for cards |
| category | text | `ai-models` · `anthropic` · `industry` · `tools` |
| tags | text[] | array e.g. ["claude", "anthropic", "llm"] |
| cover_image_url | text | Pollinations.ai generated URL |
| cover_image_prompt | text | the prompt used to generate the image |
| source_urls | text[] | original RSS article URLs (attribution) |
| status | text | `published` · `draft` |
| auto_generated | boolean | true if Scout posted it |
| created_at | timestamptz | auto |
| published_at | timestamptz | set on publish |

### Table: `scout_memory`

| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| feed_url | text | the RSS feed source |
| item_guid | text | RSS item unique ID |
| item_title | text | original article title |
| processed_at | timestamptz | when Scout consumed it |
| post_id | uuid | FK → posts.id (nullable if skipped) |

This table prevents Scout from publishing duplicate stories.

---

## 5. PAGES & ROUTES

### Public Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero digest + latest posts grid |
| `/category/[slug]` | Filtered feed by category |
| `/post/[slug]` | Individual post page |
| `/about` | What AITrends.ng is and who it's for |

### API Routes (internal — Scout calls these)

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/posts/create` | POST | API key header | Creates and publishes a post |
| `/api/posts/draft` | POST | API key header | Saves a post as draft |
| `/api/health` | GET | none | Returns `{ status: "ok" }` — Scout pings this to confirm blog is live |

### API Key Authentication
All protected routes check for:
```
Headers: { "x-api-key": "SCOUT_API_KEY" }
```
`SCOUT_API_KEY` is stored in Vercel environment variables. Never hardcode it.

---

## 6. THE `/api/posts/create` ENDPOINT

This is the most critical piece. Scout calls this to publish automatically.

### Request Body (JSON)
```json
{
  "title": "Anthropic Quietly Ships Claude's Most Significant Memory Update Yet",
  "content": "<p>Here's your 60-second briefing...</p>",
  "excerpt": "Claude can now remember across sessions. Here's what changed and why it matters.",
  "category": "anthropic",
  "tags": ["claude", "memory", "anthropic"],
  "cover_image_url": "https://image.pollinations.ai/prompt/...",
  "cover_image_prompt": "Anthropic logo glowing neural network...",
  "source_urls": ["https://anthropic.com/news/...", "https://techcrunch.com/..."],
  "status": "published",
  "auto_generated": true
}
```

### Response
```json
{
  "success": true,
  "post_id": "uuid-here",
  "slug": "anthropic-quietly-ships-claude-memory-update",
  "url": "https://aitrends.ng/post/anthropic-quietly-ships-claude-memory-update"
}
```

### Slug Generation Rules
- Lowercase, hyphen-separated
- Strip special characters
- Max 80 characters
- Append `-2`, `-3` etc. if slug already exists

---

## 7. UI COMPONENTS TO BUILD

### 7.1 Homepage (`/`)

**Hero Section**
- Large heading: "Today in AI" or "Latest Digest"
- Subtitle with current date
- Featured post card (largest, full width) — latest auto post
- Category filter tabs: All · Anthropic · AI Models · Industry · Tools

**Posts Grid**
- 3-column on desktop, 2 on tablet, 1 on mobile
- Each card contains:
  - Cover image (AI-generated, 16:9 ratio)
  - Category badge (coloured by category)
  - Title (2 lines max, truncate)
  - Excerpt (3 lines max)
  - Published date + read time estimate
  - "Auto-generated" subtle badge if `auto_generated: true`
- Infinite scroll OR "Load More" button — fetch next 9 posts

**Sidebar** (desktop only)
- "About AITrends.ng" blurb
- Top categories with post counts
- Latest 5 posts list

### 7.2 Post Page (`/post/[slug]`)

- Full-width cover image at top
- Title (h1)
- Meta row: date · category · read time · "AI Generated" badge
- Article body (rendered HTML)
- Sources section at bottom: "This digest was compiled from:" + list of source URLs with attribution
- Related posts (3 cards, same category)
- Social share buttons: Twitter/X · LinkedIn · Copy link

### 7.3 Category Page (`/category/[slug]`)
Same grid as homepage but filtered. Show category description at top.

### 7.4 About Page (`/about`)
Static page explaining:
- What AITrends.ng is
- How it works (the automation pipeline — be transparent about it)
- Who it's for
- Powered by FAIT attribution

---

## 8. SEO & META

Every page must have:
```html
<title>{post title} — AITrends.ng</title>
<meta name="description" content="{excerpt}" />
<meta property="og:title" content="{post title}" />
<meta property="og:description" content="{excerpt}" />
<meta property="og:image" content="{cover_image_url}" />
<meta property="og:url" content="https://aitrends.ng/post/{slug}" />
<meta name="twitter:card" content="summary_large_image" />
```

Also generate `/sitemap.xml` dynamically from all published posts.
Also generate `/feed.xml` (RSS) from latest 20 posts — this allows AITrends.ng itself to eventually be read by other Scout-like systems.

---

## 9. ENVIRONMENT VARIABLES

Store all secrets in Vercel environment variables. Never commit to git.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SCOUT_API_KEY=
SLACK_WEBHOOK_URL=
NEXT_PUBLIC_SITE_URL=
```

> **Note (updated Session 1):** Variable names were changed from the original spec:
> - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
> - `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SECRET_KEY`
>
> Reason: old JWT-style keys were exposed in SESSION_LOG.html on GitHub (public repo). New Supabase publishable/secret keys were issued and the old ones retired.

---

## 10. DEPLOYMENT

- **Platform:** Vercel (free tier)
- **Domain:** aitrends.ng (configure DNS via Go54/Whogohost once deployed)
- **Vercel URL:** aitrends-ng.vercel.app
- **Branch:** `main` → auto-deploys on git push
- **Node version:** 18+
- **Framework preset:** Next.js (App Router)

### DNS Records to add at Go54
Once Vercel gives the deployment URL:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

---

## 11. WHAT CLAUDE CODE MUST NOT DO

- Never hardcode API keys, secrets, or webhook URLs in source files
- Never use `pages/` router — use App Router (`app/`) only
- Never use `<form>` tags — use controlled React state and `onClick` handlers
- Never upgrade to React 19 — stay on React 18
- Never use `npm audit fix --force` — it breaks dependencies silently
- Never delete the `/api/posts/create` endpoint — Scout depends on it
- Never make the API endpoint publicly writable without the `x-api-key` check
- Never log real API keys, tokens, or secrets in SESSION_LOG.html — always use `[REDACTED]`

---

## 12. SESSION LOG REQUIREMENT

**This is mandatory and non-negotiable.**

Claude Code must maintain a session log file called:
```
SESSION_LOG.html
```

Located at the project root.

### Purpose
Felix reads this log to understand everything that happened in every Claude Code session — decisions made, files changed, errors encountered, fixes applied. It is a verbatim, full-detail record. No summaries. No omissions.

### Log Style
The log must match the visual style of the reference file at `/Users/felixokon/Downloads/lubconafrica-website/lubcon-session-v2.html`. Every user message is quoted word for word. Every command shows its complete terminal output. Every code change shows before/after in full. Every error message is verbatim.

**Page structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>AITrends.ng — Claude Dev Session · {DATE}</title>
<style>/* CSS as specified */</style>
</head>
<body>
<div class="page">
  <div class="session-header">
    <h1>AITrends.ng — Claude Dev Session</h1>
    <p>Date: {DATE} | Project: aitrends.ng | Participants: Felix Okon & Claude Code | Session: #{N}</p>
  </div>
  <!-- turns go here -->
</div>
</body>
</html>
```

### Log Update Rules
1. **Update the log at the END of every session** — after all work is done
2. **Every session is appended** — never overwrite previous sessions
3. **Tool calls are logged** — file reads, writes, edits, bash commands, errors, with full output
4. **Felix's messages are logged verbatim** — exact words, no paraphrasing
5. **Claude Code's responses are logged in full** — every decision, file changed, error and fix
6. **Increment session number** in the header each session
7. **All secrets logged as `[REDACTED]`** — never the real value

---

## 13. FIRST SESSION CHECKLIST

✅ **Session 1 completed — 30 May 2026**

All steps below were completed in Session 1:

- ✅ Step 1 — Scaffold: Next.js 16.2.6, React 18 (downgraded from 19), `@supabase/supabase-js` installed
- ✅ Step 2 — Environment: `.env.local` and `.env.example` created with all variables
- ✅ Step 3 — Supabase: `supabase/schema.sql` written and run by Felix in Supabase SQL editor
- ✅ Step 4 — API Route: `/api/posts/create`, `/api/posts/draft`, `/api/health` built and deployed
- ✅ Step 5 — Pages: homepage, post page, category page, about page built
- ✅ Step 6 — Components: PostCard, PostGrid, CategoryBadge, HeroPost, Sidebar, NavBar, Footer built
- ✅ Step 7 — SEO: dynamic metadata, sitemap.ts, feed.xml, robots.ts added
- ✅ Step 8 — Deploy: pushed to GitHub (FAIT-Blog/aitrends-ng), connected to Vercel, `/api/health` confirmed live
- ✅ Step 9 — Session Log: SESSION_LOG.html created and maintained

**Post-Session 1 fixes applied:**
- `'use client'` added to `HeroPost.tsx` and `PostCard.tsx` (event handler error)
- `image.pollinations.ai` and `*.supabase.co` added to `next.config.ts` image remote patterns
- Supabase env var names updated (publishable/secret key naming)
- All API key values scrubbed from SESSION_LOG.html → `[REDACTED]`

---

## 14. NOTES FOR CLAUDE CODE

- Felix is building multiple projects simultaneously. Be efficient with his time.
- Always explain what you're about to do before doing it.
- If something can break the Scout integration (the `/api/posts/create` endpoint), flag it loudly before making changes.
- The session log is not optional — Felix uses it to stay informed without being present during builds.
- When in doubt about a design decision, match the FAIT blog aesthetic: dark, clean, minimal, professional.
- Felix uses npm. Never suggest yarn or pnpm.
- The project is deployed on Vercel free tier. Do not introduce services that require paid hosting.
- **Never log real secrets in SESSION_LOG.html.** All keys, tokens, passwords → `[REDACTED]`.
- **CLAUDE_v1.md is the project spec file.** Read it at the start of every session.

---

## 15. IMAGE GENERATION GUIDELINES

**Added after Session 1 audit — 2 June 2026**

### The Problem (identified in production)

After Session 1, the Scout Agent published 11 posts. A site audit revealed that all cover images were visually generic — dark circuit backgrounds with different publication logos (Hacker News "Y", MIT Technology Review, TechCrunch, HuggingFace). The images were aesthetically consistent but did not communicate the story.

**Root cause:** The Gemini prompt was extracting the **RSS feed source name** (Hacker News, MIT Tech Review) as the primary entity rather than the **actual subject of the story** (Beijing, brain chips, Africa, Google I/O, etc.).

### The Fix — What Gemini Must Do

When generating the image prompt, Gemini must:

1. **Extract 3–5 visually concrete nouns from the story content itself** — places, people, products, technologies, events. Not the publication name.

   Examples:
   - "Beijing's Brain Chip Breakthrough" → Beijing skyline, neural implant chip, African continent, data threads
   - "Africa AI Digest: Google's Searchbox Shake-Up" → Google search bar, African cityscape, search results disrupted
   - "I/O 2026: Your Essential Builder's Digest" → Google I/O stage, developer tools, 2026 tech landscape

2. **Choose an art style** that matches the mood of the story. Style must vary between posts — no two consecutive posts should use the same style. Approved styles:
   - Watercolour paint
   - Ink sketch / pen drawing
   - Vector flat illustration
   - Oil painting / digital oil
   - Pencil sketch
   - Risograph print
   - Linocut print

3. **Build a scene, not a logo.** The image should depict a moment, a concept, or a place — not a brand identity. Logos and wordmarks must not appear.

### Prompt Template

```
[ART STYLE] illustration of [SCENE BUILT FROM STORY NOUNS]. Dark background,
electric blue and gold accent tones, highly detailed, cinematic composition.
No text in image, no logos, no wordmarks.
```

### Example — Before vs After

**Post:** "Beijing's Brain Chip Breakthrough: What It Means for African Devs"

**Before (wrong):**
```
Clean tech illustration featuring the MIT Technology Review brand identity,
with a subtle brain-computer interface chip. Dark background, electric blue
and gold accents. No text.
```

**After (correct):**
```
Watercolour illustration of a glowing neural implant chip hovering above a
stylised Beijing skyline at night, connected by electric-blue data threads
to a silhouette of the African continent below. Dark background, gold and
blue accent tones, painterly texture, cinematic composition. No text in
image, no logos.
```

### Rule
The image must pass this test: **if you showed the image to someone who hadn't read the title, could they guess the general topic?** If yes, the prompt is correct. If it just looks like a generic tech illustration, the prompt needs to be rewritten.
