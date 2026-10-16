import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const viewportWidths = [320, 375, 768, 1280];

test('booking page has no horizontal overflow at supported widths', async ({ page }) => {
    await page.goto('/');

    for (const width of viewportWidths) {
        await page.setViewportSize({ width, height: 900 });
        const dimensions = await page.evaluate(() => ({
            viewport: window.innerWidth,
            document: document.documentElement.scrollWidth,
            body: document.body.scrollWidth,
        }));

        expect(dimensions.document, `document overflows at ${width}px`).toBeLessThanOrEqual(width);
        expect(dimensions.body, `body overflows at ${width}px`).toBeLessThanOrEqual(width);
        expect(dimensions.viewport).toBe(width);
    }
});

test('booking page exposes visible keyboard focus and passes axe WCAG checks', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    const outlineStyle = await page.locator(':focus').evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(outlineStyle).not.toBe('none');

    for (const theme of ['light', 'dark']) {
        await page.evaluate((nextTheme) => document.documentElement.classList.toggle('dark', nextTheme === 'dark'), theme);
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(results.violations, `axe violations in ${theme} theme`).toEqual([]);
    }
});

test('SUS questionnaire passes axe WCAG checks', async ({ page }) => {
    for (const theme of ['light', 'dark']) {
        await page.goto('/evaluacion/sus');
        await page.evaluate((nextTheme) => document.documentElement.classList.toggle('dark', nextTheme === 'dark'), theme);

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(results.violations, `axe violations in ${theme} theme`).toEqual([]);
    }
});

test('Card Sorting controls pass axe WCAG checks', async ({ page }) => {
    await page.goto('/evaluacion/card-sorting');

    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

    expect(results.violations).toEqual([]);
});
