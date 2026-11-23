import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Util.texture (GPU & Browser)', () => {
    // 실제 GPUTexture 바이트 크기 계산(rgba8unorm 2x2 = 16B) 및 ImageBitmap 이미지 로딩 검증
    test('calculates GPU texture byte size and loads valid image into ImageBitmap', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            // 1. 실제 GPUDevice로 2x2 rgba8unorm 텍스처 생성 후 바이트 크기 계산 검증
            const byteSize = await new Promise<number>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const texture = ctx.gpuDevice.createTexture({
                                size: [2, 2, 1],
                                format: 'rgba8unorm',
                                usage: GPUTextureUsage.TEXTURE_BINDING
                            });
                            const size = RedGPU.Util.calculateTextureByteSize(texture);
                            texture.destroy();
                            ctx.destroy();
                            resolve(size);
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });

            // 2. 로컬 예제 이미지 에셋을 ImageBitmap으로 비동기 디코딩 검증
            const bitmap = await RedGPU.Util.TextureParser.loadImageToImageBitmap(
                '/examples/assets/UV_Grid_Sm.jpg'
            );
            const bitmapOk = bitmap instanceof ImageBitmap && bitmap.width > 0 && bitmap.height > 0;
            bitmap.close();

            return {byteSize, bitmapOk};
        });

        expect(result.byteSize).toBe(16);
        expect(result.bitmapOk).toBe(true);
    });
});
