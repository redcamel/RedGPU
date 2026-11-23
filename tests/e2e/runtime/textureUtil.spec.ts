import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Util.texture (GPU & Browser)', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // 실제 GPUTexture(rgba8unorm 2x2) 바이트 크기 계산(16B) 검증
    test('calculates GPU texture byte size for rgba8unorm 2x2 texture', async () => {
        const byteSize = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const texture = ctx.gpuDevice.createTexture({
                size: [2, 2, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING
            });
            const size = RedGPU.Util.calculateTextureByteSize(texture);
            texture.destroy();
            return size;
        });

        expect(byteSize).toBe(16);
    });

    // 로컬 예제 이미지 에셋을 ImageBitmap으로 비동기 디코딩 검증
    test('loads valid image asset into ImageBitmap', async () => {
        const bitmapOk = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const bitmap = await RedGPU.Util.TextureParser.loadImageToImageBitmap(
                '/examples/assets/UV_Grid_Sm.jpg'
            );
            const ok = bitmap instanceof ImageBitmap && bitmap.width > 0 && bitmap.height > 0;
            bitmap.close();
            return ok;
        });

        expect(bitmapOk).toBe(true);
    });
});
