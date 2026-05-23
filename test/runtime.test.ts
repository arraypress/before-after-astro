import { describe, it, expect } from 'vitest';
import { calculateClipPercent } from '../src/runtime';

/** Build a DOMRect-shaped object — vitest in Node has no
 *  DOMRect constructor, so we just hand-roll the fields the
 *  helper actually reads. */
function rect(left: number, width: number): DOMRect {
	return { left, width, top: 0, height: 0, right: left + width, bottom: 0, x: left, y: 0, toJSON: () => ({}) } as unknown as DOMRect;
}

describe('calculateClipPercent', () => {
	it('returns 0 when clientX is at the left edge', () => {
		expect(calculateClipPercent(100, rect(100, 400))).toBe(0);
	});

	it('returns 100 when clientX is at the right edge', () => {
		expect(calculateClipPercent(500, rect(100, 400))).toBe(100);
	});

	it('returns 50 for the midpoint', () => {
		expect(calculateClipPercent(300, rect(100, 400))).toBe(50);
	});

	it('clamps to 0 when clientX is left of the rect', () => {
		expect(calculateClipPercent(50, rect(100, 400))).toBe(0);
	});

	it('clamps to 100 when clientX is right of the rect', () => {
		expect(calculateClipPercent(600, rect(100, 400))).toBe(100);
	});

	it('returns 0 for a zero-width rect (no NaN/Infinity)', () => {
		expect(calculateClipPercent(150, rect(100, 0))).toBe(0);
	});

	it('handles rects not at the origin', () => {
		expect(calculateClipPercent(450, rect(200, 500))).toBe(50);
	});
});
