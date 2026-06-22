# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] — Unreleased

### Changed

- Widened the `astro` peerDependency to `^6.0.0 || ^7.0.0` for
  Astro 7 readiness. No runtime changes — the component is unaffected by the
  Astro 7 compiler / Vite 8 (Rolldown) upgrade.

## [1.0.0] — Unreleased

### Initial Release

- `<BeforeAfter>` Astro component — two stacked images, top one
  clipped via `clip-path: inset(...)` driven by a draggable
  handle. Mouse / touch / pen flow through `pointer*` events.
- Keyboard accessible — `role="slider"` + `aria-valuemin/max/now`,
  focus the handle and use ← / → for 5% steps.
- Idempotent runtime — `initBeforeAfterSlider()` guards on
  `dataset.baInit`, so re-binding on `astro:after-swap` is safe.
- Pure-math `calculateClipPercent(clientX, rect)` helper is the
  unit-testable core. Returns 0 for zero-width rects (no NaN /
  Infinity).
- Canonical stylesheet at `@arraypress/before-after-astro/style.css`
  with CSS custom properties for rebranding
  (`--ba-radius`, `--ba-bg`, `--ba-border`, `--ba-handle-color`,
  `--ba-handle-grip-bg`, `--ba-handle-grip-fg`, `--ba-focus-ring`).
- Props: `before`, `after`, `beforeAlt?`, `afterAlt?`,
  `beforeLabel?`, `afterLabel?`, `aspectRatio?` (default
  `'16 / 9'`), `startAt?` (default `50`), `handleLabel?`,
  `class?`.

20 tests passing (jsdom-free pure math + Astro container).
Zero runtime dependencies.
