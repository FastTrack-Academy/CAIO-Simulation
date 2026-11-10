This is the FastTrack CAIO and CJAIO practice platform, built with Next.js and Supabase.

## Workspace design

The application uses a shared light workspace: a white sidebar and header, cool gray canvas, teal actions, compact paper lists, and the same readable controls across practice, review, the dashboard, question book, sign-in, admin activity, and teacher marking. The CAIO/CJAIO switch stays in the top bar. On phones the sidebar becomes a keyboard-accessible drawer and the question navigator can collapse.

Design tokens and shared screen styles live in `src/app/globals.css`; the reference specification and preserved feature inventory are in `docs/design-system.md`. Stored paper names/IDs and marking rules remain unchanged; display names are shortened only in the interface. Code blocks support the indented fences used by older CAIO papers, and KaTeX CSS ships from the installed package.

## 2026-27 CAIO National Qualifier papers

Papers A, B, and C are available in the CAIO catalog, adding 105 questions and independently worked solutions. Each paper has 35 questions and 100 marks. Q1-15 are single-choice; Q16-25 use exact select-all scoring; Q26-35 accept five labeled answers and use teacher marking with a practice rubric of one point per blank. Four ambiguous select-all items (B16, B18, B25, C22) also use teacher review. The existing 90-minute CAIO practice setting is retained; the PDFs do not state a time limit.

The catalog groups dated papers newest first: **2026 papers** (A-C), then **2025 papers** (Past Exams 1-3). Max's drills remain separate and undated. Numeric `year` metadata is retained by both importers; year-prefixed paper names appear in practice, review, history, and the question book. Existing exam/question IDs remain unchanged, including saved 2025 attempts.

See [the import guide and solution index](content/caio-2026/README.md) for source caveats, alternative answers, regeneration, and validation. Runtime data is `src/data/caio-2026-exams.json`; existing CAIO and CJAIO IDs are preserved. These files use a dedicated importer because the legacy Markdown parser does not support select-all or manual marking metadata.

## CJAIO practice and marking

- The header's **CAIO** and **CJAIO** tabs open `/` and `/cjaio` respectively. Existing CAIO exam IDs and saved attempts are preserved.
- CJAIO has two imported papers, each with 26 questions, 100 points, and a 60-minute timer. CAIO retains its 90-minute timer.
- Two original **Max's CJAIO Drill Tests** add 52 more questions in the same format. Drill 1 is **Equivalent** to the supplied practice sets; Drill 2 is **Harder**. Green/red difficulty badges appear on catalog cards, inside the test, and on the review. These are practice-set calibrations, not official difficulty ratings.
- Q1-12 allow one answer. Q13-18 allow multiple selections and earn points only when the selection exactly matches the key. Q19 is automatically checked.
- Q20-26 accept written calculations/code and are marked by the teacher, with partial credit. Answered responses remain pending until a score is recorded. Skipped responses earn zero. Pending work is excluded from final-score averages and is not treated as an incorrect written response.
- Answers, flags, time, submissions, and teacher marks use the existing Supabase records. Submissions wait for successful persistence before opening the review. Save failures are shown to the student.
- In the existing **Admin Console**, expand a student and choose **Review / Mark** for a submitted CJAIO attempt. Enter scores and save them. Blank score fields keep answered responses pending. Students can reload their review to see updated marks.
- Teacher marking uses the existing administrator account and requires its Supabase policies to permit reading/updating the student's `attempts` and `question_books`. Database authorization must enforce those permissions; the UI role check is not a substitute for row-level security. No table/column migration is needed.

### Sources and reproducible import

Question-only transcriptions are in `content/cjaio/practice-set-1.md` and `practice-set-2.md`. Runtime data is in `src/data/cjaio-exams.json`; `src/data/all-exams.ts` combines both competitions. The original PDF filenames are retained as provenance.

To regenerate with Python and `pdfplumber` installed:

```powershell
python scripts/import-cjaio.py C:/path/to/the/pdfs
```

The importer restores code indentation from PDF character positions and decodes the literal HTML comparison entities printed in the source. Answer keys and written marking guidance are independently prepared, rather than an official answer key. The select-all scoring rule is the platform's explicit practice rule; the supplied PDFs do not specify partial-credit details for that section.

Original drill data lives separately in `src/data/cjaio-drills.json`, so rerunning the PDF importer preserves it. Edit `scripts/build-cjaio-drills.py` and run it to regenerate both drill banks and the `content/cjaio/max-drill-*-questions.md` / `max-drill-*-solutions.md` files. Run `python scripts/verify-cjaio-drills.py` to independently check executable questions, arithmetic, model calculations, and teacher program examples (including empty lists and ties). Neither drill script needs third-party Python packages.

Teacher marks are versioned metadata in the existing `answers` JSON column (`__manual_marks_v1`). Student responses remain under their original question IDs. The same grading functions drive submission, reviews, teacher marking, and incorrect-question tracking.

### Validation

```powershell
npm test
npx tsc --noEmit
npm run build
```

The grading tests cover import structure, exact select-all matching, pending written work, partial credit, stored marks, and legacy CAIO matching. Browser checks should cover student and teacher flows with test accounts or mocked Supabase responses before production use. Node.js 22 or later is recommended by the installed Supabase SDK.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
