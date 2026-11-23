import {expect, test as base} from '@playwright/test';

const WEBGPU_ERROR_PATTERN =
    /GPUValidationError|GPUOutOfMemoryError|GPUInternalError|Device lost|WebGPU validation|Uncaptured WebGPU error/i;

export const test = base.extend({
    page: async ({page}, use) => {
        const runtimeErrors: string[] = [];

        page.on('pageerror', (error) => {
            runtimeErrors.push(`[pageerror] ${error.message}`);
        });

        page.on('console', (msg) => {
            const text = msg.text();
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

export {expect};
