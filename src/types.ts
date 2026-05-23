/**
 * @module @arraypress/before-after-astro/types
 */

export interface BeforeAfterProps {
	/** URL of the "before" (left) image. */
	before: string;
	/** URL of the "after" (right, clipped) image. */
	after: string;
	/** Alt text for the before image. Default: `''`. */
	beforeAlt?: string;
	/** Alt text for the after image. Default: `''`. */
	afterAlt?: string;
	/** Optional pill label rendered on the before side. */
	beforeLabel?: string;
	/** Optional pill label rendered on the after side. */
	afterLabel?: string;
	/** CSS `aspect-ratio` value for the viewport. Default: `'16 / 9'`. */
	aspectRatio?: string;
	/** Starting position of the divider, 0–100 (percent from left). Default: `50`. */
	startAt?: number;
	/** Accessible label for the handle (`aria-label`). Default: `'Drag to compare'`. */
	handleLabel?: string;
	/** Extra classes appended to the outer wrapper. */
	class?: string;
}
