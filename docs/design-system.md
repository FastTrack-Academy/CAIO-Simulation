# AI Olympiad practice studio

The redesign uses the generated library and active-exam concepts as its visual references. All UI is native HTML/CSS/React; the concept PNGs are reference material, not embedded page screenshots.

## Visual contract

- True white sidebar, header, and panels on a cool `#f6f8fa` canvas.
- Ink `#172b32`, muted slate `#74838a`, border `#e5eaed`, primary teal `#147d64`, and pale sage `#eaf5f2`.
- Green Equivalent, red Harder, amber pending/flagged. Meaning is always written as well as colored.
- Plus Jakarta Sans with system fallbacks; JetBrains Mono for code. Clear 36px page titles, 14px controls/body, 12px metadata.
- 240px fixed sidebar, 64px topbar, 32px desktop gutters. White 12px-radius panels, 8px buttons, thin dividers, restrained shadows.
- Compact paper rows grouped into practice sets and Max's drills. Three real summary values; no decorative chart or invented progress.
- Spacious test panel next to a numbered navigator. Timer and submission stay easy to find; question/answer content gets priority.
- Mobile uses an explicit navigation drawer, a persistent competition switch, stacked rows, and a compact collapsible question navigator.

## Feature inventory preserved

Authentication/registration/sign-out and account identity; both competition libraries and all nine papers; difficulty labels; correct 60/90-minute limits; start/resume/retake; autosave and save errors; single-choice, select-all, and written answers; flags, question saving, timer expiry and confirmation; submitted reviews with marking status, partial credit, filters, answer explanations and saves; saved/wrong-question book with search/reveal/resolve; attempt history, deletion and topic analytics; administrator candidate/session history, marking links, and partial-credit marking.

Exam data, IDs, answer keys, grading rules, Supabase tables, and persistence behavior remain the existing sources of truth. Shorter display names do not replace stored exam names or IDs.
