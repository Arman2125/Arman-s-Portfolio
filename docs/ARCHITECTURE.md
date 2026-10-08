# Architecture

How the portfolio is put together: content model, design system, motion engine and the contact form.
For setup and an overview, see the [README](../README.md).

- [Content model](#content-model)
- [Structure](#structure)
- [Design system](#design-system)
- [Motion](#motion)
- [Contact form](#contact-form)
- [Testing](#testing)

## Content model

All copy lives in **`src/data/resume.ts`**, written from the resume (October 2026 edition). The site never says more
than that document:

- Skills the resume lists as *fundamentals / basics / concepts* (Java 17, unit testing, AWS, deployment, design
  patterns) are tagged `fundamentals` and render as dashed tags.
- `skillUsage` (the "Where I've used it" table) links a skill to SharpFlux or ProAzure only when that experience entry
  names it. The hero marquee (`heroStack`) only lists skills backed by that table.
- Project `links.github` / `links.demo` and `socials.github` / `socials.linkedin` stay empty until a real URL exists;
  every button that uses them is hidden while they are empty.
- A project gets the "View details" dialog (overview, features, architecture) only when it has `details`.

`src/data/resume.test.ts` enforces these rules: a fundamentals skill listed as job or project experience, a `#`
placeholder link, or a marquee item without evidence fails the test run.

The resume download is `public/Arman_Shaikh_ATS_Resume.pdf`; the hero photo is `public/images/arman-shaikh.webp`
(256 px, ~6 KB).

## Structure

```
src/
  data/resume.ts            all content + types
  data/techIcons.ts         brand marks (SVG paths copied from Simple Icons, CC0) for logos in tags and the marquee
  components/
    ui/                     shadcn/ui primitives (button, badge, card, dialog, sheet, tabs, tooltip, separator, table,
                            input, textarea, label)
    effects/                Atmosphere (background), Spotlight + GridCells (hero), Marquee, SpotlightCard, Reveal,
                            ScrollText (scroll-lit paragraph), Magnetic (buttons)
    common/                 Section / SectionHeader, TechTag, TechLogo, ExternalLinkButtons, BrandIcons
    contact/                ContactForm (validation, FormSubmit delivery, states)
    layout/                 Navbar (scroll-aware, desktop links + mobile Sheet), ThemeToggle, ScrollProgress, Footer
    projects/               CaseStudy, CompactProjectCard, ProjectPreview (schematic demos), ProjectDialog,
                            ArchitectureDiagram
    sections/               Hero, StackStrip, About, Skills, Experience, Projects, AiSection, MoreWork, Education,
                            Contact
  lib/
    scroll.ts               the scroll engine: Lenis (desktop), one frame loop for all scroll-linked effects,
                            in-page link handling (smooth scroll + focus), dialog scroll locking
    useScrollEffect.ts      hook: run an effect per scroll frame with cached (transform-proof) element positions
    pointer.ts              damped follower + useMagnetic / useTilt (mouse only)
    motion.ts               seqDelay / enterDelay helpers for the CSS motion utilities
    theme.ts, contact.ts, techLogos.ts, useActiveSection.ts, utils.ts
```

The page reads as a story: Hero → stack strip → About → Skills → Experience → Projects (Sugam AI OS / Playground) →
AI application development → More work → Education → Contact. Plain and softly tinted sections alternate.

Add shadcn components with `npx shadcn@latest add <name>` (config in `components.json`, alias `@/` → `src/`).
After adding, check the generated import of `cn` is `@/lib/utils`.

## Design system

- **Tokens** (`src/index.css`): shadcn semantic variables (`background`, `card`, `primary`, `muted`, `border`,
  `ring`, …) plus `brand` (accent text/marks), `success`, and the atmosphere (`--blob-*`, `--cursor-light`,
  `--grain-opacity`). Warm stone neutrals with one ember accent; light and dark both meet WCAG AA for text.
- **Theme**: light by design. Dark mode exists but only when a visitor picks it with the toggle (remembered in
  `localStorage`); the OS setting is deliberately ignored. An inline script in `index.html` applies the stored choice
  before first paint; `src/lib/theme.ts` mirrors it.
- **Type**: Geist Sans for copy, Geist Mono for labels and tags (self-hosted via `@fontsource`).

## Motion

No animation library: CSS transitions and keyframes plus a small engine in `src/lib`, so nothing re-renders while
animating. One dependency, **Lenis**, smooths wheel scrolling on desktop. Everything respects
`prefers-reduced-motion` (no Lenis, no scroll-linked or pointer effects, all content shown in place), and pointer
effects only run for mouse and trackpad users.

- **Scroll engine** (`lib/scroll.ts`): Lenis on desktop (fine pointer); native scrolling on touch. Every
  scroll-linked effect subscribes once and runs inside the same frame as the scroll, measured from cached layout
  positions (never per frame), only while near the viewport. In-page links scroll smoothly, clear the sticky header
  (CSS `scroll-padding-top`) and move keyboard focus to the section. Lenis pauses while a dialog or the mobile menu
  is open; their own content still scrolls.
- **Atmosphere**: three very soft warm blobs drifting over about a minute, a cursor-following light and fine grain.
  All fixed, transform-only layers.
- **Navigation**: the header tints once you scroll, slides away while you read downwards and returns on any upward
  scroll (never during link navigation, with a dialog open, or while it has focus). A hover pill follows the pointer
  across links and a brand underline glides to the section in view. A 2 px progress line sits at the top.
- **Hero**: the name rises word by word, roles blur in, the portrait ring draws itself and the photo opens; CTAs are
  magnetic; the glance card floats, tilts toward the cursor and drifts with cursor parallax; on scroll the copy, card
  and grid move at three different depths.
- **Reveals**: `<Reveal>` (rise, slide from a side on tablets and up, or scale) flips `data-reveal`; children use
  `seq-item` / `seq-grow` / `seq-pop` / `seq-draw` / `seq-rise` with an inline `--d` delay (`seqDelay(ms)`). Section
  titles rise word by word from masks, hairlines draw, and the About introduction lights up word by word as it
  scrolls (`ScrollText`).
- **Skills**: logo tags cascade in; cards lift, the icon tile fills with the accent and an oversized watermark drifts
  against the cursor; the usage table's checks draw row by row, and pointing at a column highlights it.
- **Experience**: the timeline line fills with scroll and each node pings when the line reaches it; dates stay pinned
  beside their card; cards slide in from the right.
- **Projects**: case studies scale in; previews drift against the scroll, tilt toward the cursor with layers at
  different depths, zoom slightly and play a short demo of the project's flow once; a cursor light and a border
  beam follow on hover.
- **AI section**: the request-flow pipeline builds node by node, then light pulses run along the connectors while
  it is on screen.
- **Micro-interactions**: buttons press to 97%, primary buttons glow and sweep a light, arrows nudge, and the theme
  switch opens as a circle from the toggle (View Transitions API).

Rule of thumb when adding motion: put hover or transform effects on an element *inside* a `<Reveal>` (or inside an
element whose transform is driven by script), not on the same element; their transitions would override each other.

## Contact form

The form in the Contact section (`src/components/contact/ContactForm.tsx`) works without the visitor having a mail
app: it validates in the browser (`src/lib/contact.ts`) and posts to [FormSubmit](https://formsubmit.co), which emails
each message to the address in `contactForm.endpoint` (`src/data/resume.ts`). It has a honeypot field for spam,
loading / success / error states, and a direct-email fallback if sending fails.

**One-time activation:** the first submission makes FormSubmit send an "Activate Form" email to the inbox in the
endpoint. After that link is clicked once, every message is delivered. FormSubmit can also issue a random alias to
use in the endpoint instead of the plain address.

## Testing

`npm test` runs Vitest:

- `src/data/resume.test.ts`: content guards (real links only, fundamentals never listed as experience, evidence for
  every marquee item, details for featured projects).
- `src/lib/contact.test.ts`: form validation and every FormSubmit outcome (success, not activated, HTTP error,
  network failure) against a mocked `fetch`.
- `src/App.test.tsx`: renders the page to HTML and checks structure (one `h1`, a labelled section per navigation
  item, no placeholder links, safe external links).

`npm run lint` (oxlint) and `npm run typecheck` (`tsc --noEmit`) run separately; `npm run build` typechecks first.
