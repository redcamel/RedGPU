import {expect, test as base} from '@playwright/test';

const WEBGPU_ERROR_PATTERN =
    /GPUValidationError|GPUOutOfMemoryError|GPUInternalError|Device lost|WebGPU validation|Uncaptured WebGPU error/i;
const EXPECTED_DESTROY_PATTERN = /Device lost occurred:\s*Device was destroyed\./i;

export const test = base.extend({
    page: async ({page}, use) => {
        const runtimeErrors: string[] = [];

        page.on('pageerror', (error) => {
            runtimeErrors.push(`[pageerror] ${error.message}`);
        });

        page.on('console', (msg) => {
            const text = msg.text();
            if (EXPECTED_DESTROY_PATTERN.test(text)) return;
            if (msg.type() === 'error') {
                runtimeErrors.push(`[console.error] ${text}`);
            } else if (WEBGPU_ERROR_PATTERN.test(text)) {
                runtimeErrors.push(`[webgpu] ${text}`);
            }
        });

        await use(page);

        expect(
            runtimeErrors,
            `Unexpected browser or WebGPU errors:\n${runtimeErrors.join('\n')}`
        ).toEqual([]);
    },
});

export async function openWebGPUHarness(page: import('@playwright/test').Page) {
    await page.goto('/tests/e2e/fixtures/webgpu-harness.html');
    await page.waitForFunction(() => Boolean((window as any).__REDGPU_HARNESS_READY__));
}

export {expect};
