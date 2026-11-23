import {expect, test} from '../fixtures/webgpuTest';

test('WebGPU harness initializes RedGPUContext without errors', async ({page}) => {
    await page.goto('/tests/e2e/fixtures/webgpu-harness.html');
    await page.waitForFunction(() => Boolean((window as any).__REDGPU_HARNESS_READY__));

    const result = await page.evaluate(async () => {
        const canvas = document.getElementById('redgpu-test-canvas') as HTMLCanvasElement;
        const RedGPU = (window as any).RedGPU;

        return await new Promise<{ ok: boolean; reason?: string }>((resolve) => {
            RedGPU.init(
                canvas,
                (redGPUContext: any) => {
                    const hasDevice = Boolean(redGPUContext?.gpuDevice);
                    redGPUContext.destroy();
                    resolve({ok: hasDevice});
                },
                (failReason: any) => {
                    resolve({ok: false, reason: String(failReason)});
                }
            );
        });
    });

    expect(result.ok, result.reason).toBe(true);
});
