import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Shadow.DirectionalShadowManager & ShadowManager', () => {
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

    // DirectionalShadowManager 기본값, 크기/bias Setter 및 NaN·범위 초과 차단 검증
    test('validates DirectionalShadowManager defaults, setters, and invalid input rejection', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };
            const dsm = new RedGPU.Shadow.DirectionalShadowManager();
            const defaultsOk =
                dsm.shadowDepthTextureSize === 2048 &&
                dsm.bias === 0.00015 &&
                Array.isArray(dsm.castingList) &&
                dsm.castingList.length === 0;

            dsm.shadowDepthTextureSize = 1024;
            dsm.bias = 0.01;
            dsm.resetCastingList();

            return (
                defaultsOk &&
                dsm.shadowDepthTextureSize === 1024 &&
                dsm.bias === 0.01 &&
                expectThrows(() => (dsm.shadowDepthTextureSize = NaN)) &&
                expectThrows(() => (dsm.bias = 1.1))
            );
        });

        expect(ok).toBe(true);
    });

    // 실제 GPUDevice에서 그림자 깊이 텍스처 뷰 할당 및 VRAM 집계 검증
    test('allocates GPU shadow depth textures and tracks video memory on update', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const dsm = new RedGPU.Shadow.DirectionalShadowManager();
            dsm.update(ctx);
            const allocOk =
                dsm.shadowDepthTextureView instanceof GPUTextureView &&
                dsm.shadowDepthTextureViewEmpty instanceof GPUTextureView &&
                dsm.videoMemorySize > 0;
            dsm.destroy();
            return allocOk;
        });

        expect(ok).toBe(true);
    });

    // ShadowManager 생성자, DirectionalShadowManager 참조 및 update/render 인터페이스 검증
    test('initializes ShadowManager and exposes update and render methods', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const sm = new RedGPU.Shadow.ShadowManager();
            const ctorOk = sm.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager;

            const scene = new RedGPU.Display.Scene(ctx);
            const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
            new RedGPU.Display.View3D(ctx, scene, camera);
            scene.shadowManager.update(ctx);

            return ctorOk && typeof scene.shadowManager.render === 'function';
        });

        expect(ok).toBe(true);
    });
});
