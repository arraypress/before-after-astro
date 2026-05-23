import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BeforeAfterRaw from '../src/BeforeAfter.astro';
import type { BeforeAfterProps } from '../src/types';

const BeforeAfter = BeforeAfterRaw as Parameters<AstroContainer['renderToString']>[0];

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

async function render(props: Partial<BeforeAfterProps> = {}): Promise<string> {
	const merged = {
		before: '/img/before.jpg',
		after: '/img/after.jpg',
		...props,
	};
	return container.renderToString(BeforeAfter, {
		props: merged as unknown as Record<string, unknown>,
	});
}

function getAttrOn(html: string, tag: string, name: string): string | null {
	const tagRe = new RegExp(`<${tag}[^>]*>`);
	const match = tagRe.exec(html)?.[0] ?? '';
	const m = new RegExp(`\\s${name}="([^"]*)"`).exec(match);
	return m ? m[1] : null;
}

describe('<BeforeAfter>', () => {
	it('renders before + after images with the supplied URLs', async () => {
		const html = await render({ before: '/img/raw.jpg', after: '/img/done.jpg' });
		expect(html).toContain('src="/img/raw.jpg"');
		expect(html).toContain('src="/img/done.jpg"');
	});

	it('emits the data-before-after viewer + data-start at default 50', async () => {
		const html = await render();
		expect(html).toMatch(/data-before-after\b/);
		expect(html).toMatch(/data-start="50"/);
	});

	it('clamps startAt to [0, 100]', async () => {
		const above = await render({ startAt: 150 });
		expect(above).toMatch(/data-start="100"/);
		const below = await render({ startAt: -25 });
		expect(below).toMatch(/data-start="0"/);
	});

	it('sets the initial clip-path on the after image', async () => {
		const html = await render({ startAt: 70 });
		expect(html).toContain('clip-path: inset(0 30% 0 0)');
	});

	it('sets the initial handle left to startAt', async () => {
		const html = await render({ startAt: 30 });
		/* The handle inline style is `left: 30%`. */
		expect(html).toMatch(/left:\s*30%/);
	});

	it('honours a custom aspect-ratio', async () => {
		const html = await render({ aspectRatio: '4 / 3' });
		expect(html).toMatch(/aspect-ratio:\s*4 \/ 3/);
	});

	it('omits labels when neither beforeLabel nor afterLabel is set', async () => {
		const html = await render();
		expect(html).not.toContain('before-after-label--before');
		expect(html).not.toContain('before-after-label--after');
	});

	it('renders both labels when both are set', async () => {
		const html = await render({ beforeLabel: 'Raw', afterLabel: 'Processed' });
		expect(html).toContain('before-after-label--before');
		expect(html).toContain('before-after-label--after');
		expect(html).toContain('Raw');
		expect(html).toContain('Processed');
	});

	it('handle has role=slider + aria-valuemin/max/now', async () => {
		const html = await render({ startAt: 60 });
		expect(html).toContain('role="slider"');
		expect(html).toContain('aria-valuemin="0"');
		expect(html).toContain('aria-valuemax="100"');
		expect(html).toContain('aria-valuenow="60"');
	});

	it('uses the configured handleLabel as aria-label', async () => {
		const html = await render({ handleLabel: 'Glissez pour comparer' });
		expect(html).toContain('aria-label="Glissez pour comparer"');
	});

	it('merges the user class onto the outer wrapper', async () => {
		const html = await render({ class: 'hero-shot' });
		const outerClass = getAttrOn(html, 'div', 'class');
		expect(outerClass).toContain('before-after');
		expect(outerClass).toContain('hero-shot');
	});

	it('image alt text falls through from the props', async () => {
		const html = await render({ beforeAlt: 'Raw mix', afterAlt: 'Final mix' });
		expect(html).toContain('alt="Raw mix"');
		expect(html).toContain('alt="Final mix"');
	});

	it('emits the data attributes the runtime queries', async () => {
		/* `astro container` strips processed `<script>` blocks from
		 * its HTML output (they're externalised by Vite), so we
		 * verify the runtime's contract by asserting on the data
		 * attributes it queries — the script behaviour itself is
		 * covered in test/runtime.test.ts. */
		const html = await render();
		expect(html).toMatch(/data-before-after\b/);
		expect(html).toMatch(/data-before-after-handle\b/);
		expect(html).toMatch(/data-start="50"/);
	});
});
