import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('seen', '1'); } catch {}
  });
});

test('T1: page loads without JavaScript errors or failed local requests', async ({ page, baseURL }) => {
  const failures = [];
  const origin = new URL(baseURL).origin;
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === origin) failures.push(`${request.url()}: ${request.failure()?.errorText}`);
  });

  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(failures).toEqual([]);
});

test('T2: the document does not overflow horizontally at this viewport', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('T3: the home link returns from a case study and the theme toggle still works', async ({ page }) => {
  await page.goto('/#/work/agriequip');
  await expect(page.getByRole('heading', { name: 'AgriEquip' })).toBeVisible();
  await page.getByRole('link', { name: 'Shubham', exact: true }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.locator('h1')).toBeVisible();

  await page.getByRole('button', { name: 'Switch to Paper theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
  await page.getByRole('button', { name: 'Switch to Blue theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue');
});

test('T4: the home page has one h1 and headings for its main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Featured Work', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My Journey', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Technical Arsenal', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education', level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Background & Philosophy', level: 2 })).toBeVisible();
});

test('T5: every image has alt text and loads', async ({ page }) => {
  await page.goto('/');
  const images = await page.locator('img').evaluateAll((nodes) => nodes.map((img) => ({ alt: img.getAttribute('alt'), loaded: img.complete && img.naturalWidth > 0 })));
  for (const image of images) {
    expect(image.alt).not.toBeNull();
    expect(image.loaded).toBeTruthy();
  }
});

test('T6: external links open safely in a new tab', async ({ page }) => {
  await page.goto('/');
  const externalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links.map((link) => ({ href: link.href, rel: link.rel })));
  expect(externalLinks.length).toBeGreaterThan(0);
  for (const link of externalLinks) {
    expect(link.href).toMatch(/^https:\/\//);
    expect(link.rel.split(/\s+/)).toContain('noopener');
  }
});

test('T7: contact form gives validation and confirmation feedback', async ({ page }) => {
  test.fixme(true, 'The current portfolio has no contact form or configured email endpoint.');
  await page.goto('/');
});

test('T8: keyboard reaches the skip link and project controls with visible focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');

  for (let i = 0; i < 30; i += 1) {
    if (await page.locator(':focus').evaluate((node) => node.classList.contains('projToggle'))) break;
    await page.keyboard.press('Tab');
  }
  await expect(page.locator(':focus')).toHaveClass(/projToggle/);
  expect(await page.locator(':focus').evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
});

test('T9: reduced motion keeps every roadmap phase in the document without pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.stop')).toHaveCount(4);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  for (const stop of await page.locator('.stop').all()) await expect(stop).toBeVisible();
});

test('T10: roadmap controls reach the final phase and return to the first', async ({ page }) => {
  await page.goto('/');
  const count = page.locator('.jCount');
  const next = page.getByRole('button', { name: 'Next roadmap phase' });
  const previous = page.getByRole('button', { name: 'Previous roadmap phase' });

  for (const phase of ['02 / 04', '03 / 04', '04 / 04']) {
    await next.click();
    await expect(count).toHaveText(phase);
  }
  for (const phase of ['03 / 04', '02 / 04', '01 / 04']) {
    await previous.click();
    await expect(count).toHaveText(phase);
  }
});

test('T11: axe reports no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious).toEqual([]);
});

test('T12: cumulative layout shift stays below 0.1', async ({ page }) => {
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 2500))]));
  await page.waitForTimeout(1000);
  const cls = await page.evaluate(() => window.__cls);
  expect(cls).toBeLessThan(0.1);
});

test('T14: full-page visual baseline at this viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 2500))]));
  await expect(page).toHaveScreenshot('portfolio-full-page.png', { fullPage: true, animations: 'disabled' });
});
