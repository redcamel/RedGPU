import type {Browser, Page} from '@playwright/test';
import {expect, test as base} from '@playwright/test';

const WEBGPU_ERROR_PATTERN =
    /GPUValidationError|GPUOutOfMemoryError|GPUInternalError|Device lost|WebGPU validation|Uncaptured WebGPU error/i;
const EXPECTED_DESTROY_PATTERN = /Device lost occurred:\s*Device was destroyed\./i;

function attachErrorListeners(page: Page, runtimeErrors: string[]) {
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
}

export const test = base.extend({
    page: async ({page}, use) => {
        const runtimeErrors: string[] = [];
        attachErrorListeners(page, runtimeErrors);

        await use(page);

        expect(
            runtimeErrors,
            `Unexpected browser or WebGPU errors:\n${runtimeErrors.join('\n')}`
        ).toEqual([]);
    },
});

export async function openWebGPUHarness(page: Page) {
    await page.goto('/tests/e2e/fixtures/webgpu-harness.html');
    await page.waitForFunction(() => Boolean((window as any).__REDGPU_HARNESS_READY__));
}

export interface SharedWebGPUHarness {
    page: Page;
    assertNoErrors: () => void;
    dispose: () => Promise<void>;
}

// 스위트(describe) 단위로 RedGPUContext를 1회 초기화하고 각 test()는 독립 검증만 수행하기 위한 공용 하네스
export async function createSharedWebGPUHarness(
    browser: Browser,
    options: { initContext?: boolean } = {}
): Promise<SharedWebGPUHarness> {
    const {initContext = true} = options;
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    const runtimeErrors: string[] = [];
    attachErrorListeners(page, runtimeErrors);

    await openWebGPUHarness(page);

    if (initContext) {
        await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.getElementById('redgpu-test-canvas') as HTMLCanvasElement;
            await new Promise<void>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        (window as any).__REDGPU_CTX__ = ctx;
                        resolve();
                    },
                    (err: any) => reject(err)
                );
            });
        });
    }

    return {
        page,
        assertNoErrors: () => {
            const errors = runtimeErrors.splice(0, runtimeErrors.length);
            expect(
                errors,
                `Unexpected browser or WebGPU errors:\n${errors.join('\n')}`
            ).toEqual([]);
        },
        dispose: async () => {
            if (initContext) {
                await page.evaluate(() => {
                    const ctx = (window as any).__REDGPU_CTX__;
                    if (ctx) {
                        ctx.destroy();
                        (window as any).__REDGPU_CTX__ = null;
                    }
                });
            }
            await browserContext.close();
        },
    };
}

export {expect};
