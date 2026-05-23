/**
 * @module @arraypress/before-after-astro/runtime
 *
 * Pointer / keyboard / clip-path math for the `<BeforeAfter>` Astro
 * component. Lifted from the component so the math is unit-testable
 * and the behaviour stays in one typed place.
 *
 * The component renders a viewer (`[data-before-after]`) containing
 * a "before" image, an "after" image clipped via `clip-path: inset(...)`,
 * and a draggable handle (`[data-before-after-handle]`). This module
 * wires pointer + keyboard input to update the clip and handle
 * position between 0 and 100 percent.
 */

/** Step (percent) applied when the handle is focused and ←/→ is pressed. */
const KEYBOARD_STEP = 5;

/** Fallback handle position when no `data-start` attribute is provided. */
const DEFAULT_START = 50;

/**
 * Pure math — convert a `clientX` coordinate to the slider's 0–100
 * percent position within `rect`. Clamps the result so callers never
 * have to clamp again, and guards against zero-width rects (returns 0)
 * so we don't produce `NaN` / `Infinity` during early hydration.
 *
 * No DOM access on purpose — keeps it trivially unit-testable.
 */
export function calculateClipPercent(clientX: number, rect: DOMRect): number {
	if (!rect.width) return 0;
	const pct = ((clientX - rect.left) / rect.width) * 100;
	if (pct <= 0) return 0;
	if (pct >= 100) return 100;
	return pct;
}

/** Clamp a number to the slider's valid 0–100 range. */
function clamp(pct: number): number {
	if (pct <= 0) return 0;
	if (pct >= 100) return 100;
	return pct;
}

/**
 * Wire up pointer + keyboard handlers on a single slider viewer
 * element and apply the initial clip-path.
 *
 * Idempotent — calling twice on the same element is a no-op (guarded
 * by `dataset.baInit`), so re-binding on `astro:after-swap` won't
 * double-attach listeners.
 *
 * @example
 *   document.querySelectorAll<HTMLElement>('[data-before-after]')
 *     .forEach((el) => initBeforeAfterSlider(el));
 */
export function initBeforeAfterSlider(element: HTMLElement): void {
	if (element.dataset.baInit) return;
	element.dataset.baInit = '1';

	const afterImg = element.querySelector<HTMLImageElement>('.before-after-img--after');
	const handle   = element.querySelector<HTMLButtonElement>('[data-before-after-handle]');

	const startAttr = parseFloat(element.dataset.start ?? '');
	const start = Number.isFinite(startAttr) ? clamp(startAttr) : DEFAULT_START;

	const setPos = (pct: number): void => {
		const clamped = clamp(pct);
		if (afterImg) afterImg.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
		if (handle) {
			handle.style.left = `${clamped}%`;
			handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
		}
	};

	const moveFromClient = (clientX: number): void => {
		setPos(calculateClipPercent(clientX, element.getBoundingClientRect()));
	};

	/* Apply initial position — re-asserts clip + handle left and
	 * sets aria-valuenow. */
	setPos(start);

	let dragging = false;

	element.addEventListener('pointerdown', (e: PointerEvent) => {
		dragging = true;
		element.setPointerCapture(e.pointerId);
		element.classList.add('is-dragging');
		moveFromClient(e.clientX);
	});

	element.addEventListener('pointermove', (e: PointerEvent) => {
		if (!dragging) return;
		moveFromClient(e.clientX);
	});

	(['pointerup', 'pointercancel', 'pointerleave'] as const).forEach((ev) => {
		element.addEventListener(ev, () => {
			dragging = false;
			element.classList.remove('is-dragging');
		});
	});

	handle?.addEventListener('keydown', (e: KeyboardEvent) => {
		const current =
			parseFloat((handle.style.left || `${DEFAULT_START}`).replace('%', '')) || DEFAULT_START;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			setPos(current - KEYBOARD_STEP);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			setPos(current + KEYBOARD_STEP);
		}
	});
}

/**
 * Bind every `[data-before-after]` element on the page in one call.
 * Safe to fire on both `DOMContentLoaded` and `astro:after-swap` —
 * `initBeforeAfterSlider` is idempotent per element.
 */
export function initAllBeforeAfter(root: ParentNode = document): void {
	root.querySelectorAll<HTMLElement>('[data-before-after]').forEach((el) =>
		initBeforeAfterSlider(el),
	);
}
