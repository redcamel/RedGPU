import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Shadow.DirectionalShadowManager & ShadowManager', () => {
    // 기본 속성, Setter 유효성 검증 및 GPU 그림자 깊이 텍스처 할당 검증
    test('validates defaults, setters, validation errors, and GPU shadow depth texture allocation', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            // 1. DirectionalShadowManager 기본값 및 Setter 검증
            const dsm = new RedGPU.Shadow.DirectionalShadowManager();
            const defaultsOk =
                dsm.shadowDepthTextureSize === 2048 &&
                dsm.bias === 0.00015 &&
                Array.isArray(dsm.castingList) &&
                dsm.castingList.length === 0;

            dsm.shadowDepthTextureSize = 1024;
            dsm.bias = 0.01;
            const settersOk = dsm.shadowDepthTextureSize === 1024 && dsm.bias === 0.01;

            // NaN 텍스처 크기 및 범위 초과 bias 차단 검증
            const validationOk =
                expectThrows(() => {
                    dsm.shadowDepthTextureSize = NaN;
                }) &&
                expectThrows(() => {
                    dsm.bias = 1.1;
                });

            dsm.resetCastingList();

            const sm = new RedGPU.Shadow.ShadowManager();
            const smCtorOk = sm.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager;

            // 2. 실제 GPUDevice에서 그림자 깊이 텍스처 뷰 할당 및 VRAM 집계 검증
            const canvas = document.createElement('canvas');
            const gpuOk = await new Promise<boolean>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const dsmGpu = new RedGPU.Shadow.DirectionalShadowManager();
                            dsmGpu.update(ctx);
                            const allocOk =
                                dsmGpu.shadowDepthTextureView instanceof GPUTextureView &&
                                dsmGpu.shadowDepthTextureViewEmpty instanceof GPUTextureView &&
                                dsmGpu.videoMemorySize > 0;
                            dsmGpu.destroy();

                            const scene = new RedGPU.Display.Scene(ctx);
                            const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
                            new RedGPU.Display.View3D(ctx, scene, camera);
                            scene.shadowManager.update(ctx);
                            const hasRender = typeof scene.shadowManager.render === 'function';

                            ctx.destroy();
                            resolve(allocOk && hasRender);
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });

            return {defaultsOk, settersOk, validationOk, smCtorOk, gpuOk};
        });

        expect(result).toEqual({
            defaultsOk: true,
            settersOk: true,
            validationOk: true,
            smCtorOk: true,
            gpuOk: true
        });
    });
});
