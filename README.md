# @arraypress/before-after-astro

> Astro image-comparison slider. Two stacked images, top one
> clipped by a draggable handle. Mouse / touch / pen / keyboard.

Common uses: design before/after, photo retouch, dark/light mode
preview, UI redesigns, plugin chain audio screenshots.

## Install

```bash
npm install @arraypress/before-after-astro
```

## Use

```astro
---
import { BeforeAfter } from '@arraypress/before-after-astro';
import '@arraypress/before-after-astro/style.css';
---
<BeforeAfter
  before="/img/raw.jpg"
  after="/img/processed.jpg"
  beforeLabel="Raw"
  afterLabel="Processed"
  aspectRatio="16 / 9"
  startAt={50}
/>
```

## Props

| Prop          | Default              | Description                                                             |
|---------------|----------------------|-------------------------------------------------------------------------|
| `before`      | **required**         | URL of the left image.                                                  |
| `after`       | **required**         | URL of the right (clipped) image.                                       |
| `beforeAlt`   | `''`                 | Alt text for the before image.                                          |
| `afterAlt`    | `''`                 | Alt text for the after image.                                           |
| `beforeLabel` | —                    | Optional pill label on the before side.                                 |
| `afterLabel`  | —                    | Optional pill label on the after side.                                  |
| `aspectRatio` | `'16 / 9'`           | CSS `aspect-ratio` value.                                               |
| `startAt`     | `50`                 | Starting divider position (0–100).                                      |
| `handleLabel` | `'Drag to compare'`  | aria-label for the handle.                                              |
| `class`       | —                    | Extra classes on the outer wrapper.                                     |

## Keyboard

Focus the handle (Tab) and use ← / → to step the divider in 5%
increments. The `role="slider"` + `aria-valuenow` give screen
readers a live read-out of the current position.

## Styling

The canonical stylesheet exposes everything via CSS custom
properties:

```css
:root {
  --ba-radius: 14px;
  --ba-bg: #141414;
  --ba-border: rgba(255, 255, 255, 0.08);
  --ba-handle-color: rgba(255, 255, 255, 0.85);
  --ba-handle-grip-bg: #f5f5f5;
  --ba-handle-grip-fg: #141414;
  --ba-focus-ring: #ffe26e;
}
```

Override any of these to rebrand. Or write your own stylesheet
from scratch keyed on `.before-after`, `.before-after-viewer`,
`.before-after-img--before/--after`, `.before-after-label`,
`.before-after-handle`, `.before-after-handle-grip`.

## Programmatic access

```ts
import {
  initBeforeAfterSlider,
  initAllBeforeAfter,
  calculateClipPercent,
} from '@arraypress/before-after-astro';

/* Bind a specific viewer (the component does this automatically). */
const el = document.querySelector<HTMLElement>('[data-before-after]');
if (el) initBeforeAfterSlider(el);

/* Or every viewer on the page in one call. */
initAllBeforeAfter();

/* Pure-math helper — handy for custom drag interactions. */
const pct = calculateClipPercent(clientX, element.getBoundingClientRect());
```

Both `initBeforeAfterSlider` and `initAllBeforeAfter` are
idempotent — calling twice on the same element is a no-op
(guarded via `dataset.baInit`). Safe to re-fire on
`astro:after-swap`.

## License

MIT
