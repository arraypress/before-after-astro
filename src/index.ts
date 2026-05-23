/**
 * @module @arraypress/before-after-astro
 */
import BeforeAfter from './BeforeAfter.astro';
export { BeforeAfter };
export default BeforeAfter;
export {
	calculateClipPercent,
	initBeforeAfterSlider,
	initAllBeforeAfter,
} from './runtime';
export type * from './types';
