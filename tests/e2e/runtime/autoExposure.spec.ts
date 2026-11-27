import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.BuiltIn.AutoExposure', () => {
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

    // METERING_MODE 상수 및 View2D·수동 노출 카메라에서의 Zero GPU Allocation 가드 검증
    test('verifies METERING_MODE constants and zero-allocation lazy guard for View2D/manual camera', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const M = RedGPU.PostEffect.BuiltIn.METERING_MODE;
            const constantsOk =
                M.AVERAGE === 0 && M.CENTER_WEIGHTED === 1 && M.SPOT === 2 && Object.keys(M).length === 3;

            const scene = new RedGPU.Display.Scene();
            const view2D = new RedGPU.Display.View2D(ctx, scene);
            const lazy2DOk =
                view2D.camera.useAutoExposure === false &&
                view2D.builtInEffectManager.hasAutoExposure === false &&
                view2D.builtInEffectManager.videoMemorySize === 0 &&
                view2D.builtInEffectManager.getPreExposure() === 1.0;

            const manualCam = new RedGPU.Camera.PerspectiveCamera();
            manualCam.useAutoExposure = false;
            const manualView = new RedGPU.Display.View3D(ctx, scene, manualCam);
            const lazyManualOk =
                manualView.builtInEffectManager.hasAutoExposure === false &&
                manualView.builtInEffectManager.videoMemorySize === 0 &&
                manualView.builtInEffectManager.getPreExposure() > 0;

            return constantsOk && lazy2DOk && lazyManualOk;
        });

        expect(ok).toBe(true);
    });

    // AutoExposure 기본 속성 및 물리 측광 preExposure 공식(2^EC) 정밀도 검증
    test('validates defaults and photometric preExposure formula with exposureCompensation', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const M = RedGPU.PostEffect.BuiltIn.METERING_MODE;
            const scene = new RedGPU.Display.Scene();
            const view = new RedGPU.Display.View3D(ctx, scene, new RedGPU.Camera.PerspectiveCamera());
            const ae = view.builtInEffectManager.autoExposure;

            const defaultsOk =
                ae.minEV100 === -2.0 &&
                ae.maxEV100 === 16.0 &&
                ae.lowPercentile === 0.8 &&
                ae.highPercentile === 0.983 &&
                ae.adaptationSpeedUp === 3.0 &&
                ae.adaptationSpeedDown === 1.0 &&
                ae.maxExposureMultiplier === 64.0 &&
                ae.meteringMode === M.CENTER_WEIGHTED &&
                ae.targetLuminance === 0.18 &&
                ae.exposureCompensation === 0.0 &&
                ae.useDebugOverlay === false &&
                ae.preExposureRatio === 1.0 &&
                ae.videoMemorySize > 0;

            ae.currentAdaptedEV100 = 10.0;
            ae.exposureCompensation = 0.0;
            const basePreExp = ae.preExposure;
            const expectedBase = 1.0 / (1.2 * Math.pow(2, 10.0));
            ae.exposureCompensation = 1.0;
            const plusOnePreExp = ae.preExposure;

            const formulaOk =
                Math.abs(basePreExp - expectedBase) < 1e-9 &&
                Math.abs(ae.effectiveEV100 - 9.0) < 1e-9 &&
                Math.abs(plusOnePreExp / basePreExp - 2.0) < 1e-6;

            ae.clear();
            ae.destroy();
            return defaultsOk && formulaOk;
        });

        expect(ok).toBe(true);
    });

    // Setter 갱신, resetAdaptation(), NaN/범위 초과 차단 및 clear/destroy VRAM 해제 검증
    test('validates setters, NaN/out-of-range guards, and VRAM release on destroy', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const M = RedGPU.PostEffect.BuiltIn.METERING_MODE;
            const scene = new RedGPU.Display.Scene();
            const view = new RedGPU.Display.View3D(ctx, scene, new RedGPU.Camera.PerspectiveCamera());
            const ae = view.builtInEffectManager.autoExposure;

            ae.meteringMode = M.CENTER_WEIGHTED;
            ae.targetLuminance = 0.22;
            ae.adaptationSpeedUp = 4.0;
            ae.adaptationSpeedDown = 1.5;
            ae.lowPercentile = 0.5;
            ae.highPercentile = 0.98;
            ae.maxExposureMultiplier = 128.0;
            ae.useDebugOverlay = true;
            ae.minEV100 = 12.0;
            ae.maxEV100 = 12.0;
            ae.resetAdaptation();

            const settersOk =
                ae.targetLuminance === 0.22 &&
                ae.adaptationSpeedUp === 4.0 &&
                ae.adaptationSpeedDown === 1.5 &&
                ae.lowPercentile === 0.5 &&
                ae.highPercentile === 0.98 &&
                ae.maxExposureMultiplier === 128.0 &&
                ae.useDebugOverlay === true &&
                ae.minEV100 === 12.0 &&
                ae.maxEV100 === 12.0;

            const invalidOps = [
                () => (ae.exposureCompensation = NaN),
                () => (ae.targetLuminance = -0.1),
                () => (ae.targetLuminance = NaN),
                () => (ae.minEV100 = NaN),
                () => (ae.maxEV100 = NaN),
                () => (ae.adaptationSpeedUp = -1),
                () => (ae.adaptationSpeedDown = -1),
                () => (ae.lowPercentile = -0.1),
                () => (ae.highPercentile = 1.1),
                () => (ae.maxExposureMultiplier = 0.5),
                () => (ae.meteringMode = 99),
                () => (ae.currentAdaptedEV100 = NaN)
            ];
            const validationOk = invalidOps.every((fn) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            });

            const memBefore = ae.videoMemorySize;
            ae.clear();
            ae.destroy();
            const releaseOk = memBefore > 0 && ae.videoMemorySize === 0;

            return settersOk && validationOk && releaseOk;
        });

        expect(ok).toBe(true);
    });
});
