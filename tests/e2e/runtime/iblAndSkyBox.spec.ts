import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('IBL & SkyBox GPU Pipeline', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(async () => {
        await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            if (ctx) ctx.removeAllViews();
        });
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // 6면 큐브맵 소스로부터 IBL Environment/Prefilter/Irradiance GPU 큐브맵 생성 및 SkyBox + PBR 렌더링 검증
    test('generates IBL environment/prefilter/irradiance cubemaps and renders SkyBox with PBRMesh', async () => {
        const res = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            const makeFace = (color: string) => {
                const c = document.createElement('canvas');
                c.width = 16;
                c.height = 16;
                const g = c.getContext('2d')!;
                g.fillStyle = color;
                g.fillRect(0, 0, 16, 16);
                return c.toDataURL('image/png');
            };

            const faces: [string, string, string, string, string, string] = [
                makeFace('#ff4444'),
                makeFace('#44ff44'),
                makeFace('#4444ff'),
                makeFace('#ffff44'),
                makeFace('#ff44ff'),
                makeFace('#44ffff')
            ];

            const ibl = new RedGPU.Resource.IBL(ctx, faces, 15000, 16, 16, 8);

            // 비동기 GPU 프리필터/이래디언스 큐브맵 생성 완료 대기
            const deadline = performance.now() + 8000;
            while (
                !(
                    ibl.environmentTexture.gpuTexture &&
                    ibl.prefilterTexture.gpuTexture &&
                    ibl.irradianceTexture.gpuTexture
                )
                ) {
                if (performance.now() > deadline) {
                    throw new Error('Timed out waiting for IBL GPU cubemap generation');
                }
                await new Promise((r) => setTimeout(r, 20));
            }

            const skybox = new RedGPU.Display.SkyBox(ctx, ibl.environmentTexture, 20000);
            skybox.intensityMultiplier = 1.25;

            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            cam.setPosition(0, 0, 4);
            cam.lookAt(0, 0, 0);
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            view.ibl = ibl;
            view.skybox = skybox;

            const mesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Sphere(ctx, 1, 12, 12),
                new RedGPU.Material.PBRMaterial(ctx)
            );
            scene.addChild(mesh);
            ctx.addView(view);

            const renderer = new RedGPU.Renderer();
            renderer.renderFrame(ctx, 16);
            const drawCalls = view.renderViewStateData.renderResults.numDrawCalls;

            const result = {
                envLayers: ibl.environmentTexture.gpuTexture.depthOrArrayLayers,
                prefilterSize: ibl.prefilterTexture.gpuTexture.width,
                prefilterLayers: ibl.prefilterTexture.gpuTexture.depthOrArrayLayers,
                prefilterMips: ibl.prefilterTexture.gpuTexture.mipLevelCount,
                irradianceSize: ibl.irradianceTexture.gpuTexture.width,
                irradianceLayers: ibl.irradianceTexture.gpuTexture.depthOrArrayLayers,
                skyboxLuminance: skybox.luminance,
                skyboxIntensity: skybox.intensityMultiplier,
                drawCalls
            };

            renderer.destroy(ctx);
            return result;
        });

        expect(res.envLayers).toBe(6);
        expect(res.prefilterSize).toBe(16);
        expect(res.prefilterLayers).toBe(6);
        expect(res.prefilterMips).toBeGreaterThan(1);
        expect(res.irradianceSize).toBe(8);
        expect(res.irradianceLayers).toBe(6);
        expect(res.skyboxLuminance).toBe(20000);
        expect(res.skyboxIntensity).toBe(1.25);
        expect(res.drawCalls).toBeGreaterThanOrEqual(1);
    });
});
