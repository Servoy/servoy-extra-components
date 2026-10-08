# SVY-21367 — Peer Review Summary

**Risk: Low.** A client-side Angular DI scoping fix (`NG0201` crash in `lightboxgallery`
when instantiated in the Servoy form editor). No server-side, security, or data-access
impact. Four of five findings from the initial review were resolved with follow-up commits
and manual verification; one low-severity behavior-change check is still open.

## Manual test plan

1. Open (or create) a CSS-positioned form containing a `lightboxgallery` component in the
   actual Servoy form editor. Confirm the component renders on the canvas with no `NG0201`
   console error. — **Done.** Verified manually: component renders, no related
   errors/warnings in the console.
2. In a running NGClient, open a form with a single `lightboxgallery`, trigger `open()`,
   confirm the lightbox overlay opens, navigates (next/prev), and closes normally.
3. **Two-gallery cross-talk check** — build or find a test form with two `lightboxgallery`
   components, each bound to its own set of images (gallery A and gallery B). Run the form
   in NGClient. Click an image in gallery A to open its lightbox popup, use next/prev and
   close it normally. Close it, then repeat with gallery B. Watch for: a popup that doesn't
   close, keyboard arrows jumping to the wrong gallery's images, or anything from gallery
   A's `open()`/`close()` visibly affecting gallery B's lightbox state (or vice versa).
   Expected result: no cross-talk — each gallery's lightbox behaves independently.
   — **Not yet executed.** This is the one remaining open item (see "Possible
   improvements / follow-ups" below).
4. Repeat step 1 and step 2 after a full page reload / form re-open to confirm providers
   are correctly recreated on each new instance rather than reusing stale state from a
   previous instance.

## Possible improvements / follow-ups

- **Two-gallery cross-talk (step 3 above) has not been run.** `LightboxConfig`/
  `LightboxEvent` moved from one shared app-wide singleton to one private instance per
  gallery. This is architecturally more correct and a likely net improvement, but is an
  unverified behavior change for any solution with multiple `lightboxgallery` components on
  one form. Low practical risk — only one lightbox popup is realistically visible at a
  time — but worth running when a suitable test form is available, or explicitly accepting
  as untested.
- Confirm with the author why `providedIn: 'root'` (the first attempted fix) was reverted —
  the commit message for the final fix doesn't record the reason. Likely the
  cross-instance state-isolation concern above, but worth capturing for the record since it
  constrains any future change to these services.
- The Jira description ("component completely lacks margins") doesn't match the summary or
  the implemented fix (an `NG0201` DI crash) — worth correcting on the ticket so the paper
  trail matches what was actually fixed.

## Scope reviewed

- `servoy-extra-components` (branch `master`, pushed): `5e6d39c`, `20fe44e`, `0a0f18e`,
  `fb7a0d8`, plus post-review follow-up `002dfff` (spec doc rewrite)
- `ngx-lightbox` (branch `@servoy`, pushed): `0966042`, `29d3868`, plus post-review
  follow-up `4fb6ed3` (`lightbox.service.spec.ts` — new regression test for the
  `elementInjector` forwarding mechanism)
