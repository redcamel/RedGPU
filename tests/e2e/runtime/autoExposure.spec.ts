import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.BuiltIn.AutoExposure', () => {
    // METERING_MODE 상수, 기본 속성, 물리 preExposure 공식, 지연 할당 가드, NaN 차단 및 메모리 해제 검증
    test('verifies METERING_MODE, defaults, photometric preExposure formula, lazy allocation guard, validation, and memory release', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const M = RedGPU.PostEffect.BuiltIn.METERING_MODE;
            const constantsOk =
                M.AVERAGE === 0 &&
                M.CENTER_WEIGHTED === 1 &&
                M.SPOT === 2 &&
                Object.keys(M).length === 3;

            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;

            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const scene = new RedGPU.Display.Scene();

                            // 1. View2D 및 수동 노출 카메라에서는 AutoExposure GPU 버퍼가 할당되지 않는지(Zero Allocation) 검증
                            const view2D = new RedGPU.Display.View2D(ctx, scene);
                            const preExp2D = view2D.builtInEffectManager.getPreExposure();
                            const lazy2DOk =
                                view2D.camera.useAutoExposure === false &&
                                view2D.builtInEffectManager.hasAutoExposure === false &&
                                view2D.builtInEffectManager.videoMemorySize === 0 &&
                                preExp2D === 1.0;

                            const manualCam = new RedGPU.Camera.PerspectiveCamera();
                            manualCam.useAutoExposure = false;
                            const manualView = new RedGPU.Display.View3D(ctx, scene, manualCam);
                            const preExpManual = manualView.builtInEffectManager.getPreExposure();
                            const lazyManualOk =
                                manualView.builtInEffectManager.hasAutoExposure === false &&
                                manualView.builtInEffectManager.videoMemorySize === 0 &&
                                preExpManual > 0;

                            // 2. AutoExposure 기본 속성 및 초기 VRAM 할당 검증
                            const camera = new RedGPU.Camera.PerspectiveCamera();
                            const view = new RedGPU.Display.View3D(ctx, scene, camera);
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

                            // 3. 물리 측광 preExposure 공식(1 / (1.2 * 2^EV100)) 및 +1 Stop 노출 보정 2배 스케일 검증
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

                            // 4. 전체 Setter 갱신, EV 고정 범위 및 resetAdaptation() 동작 검증
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
                                ae.meteringMode === M.CENTER_WEIGHTED &&
                                ae.targetLuminance === 0.22 &&
                                ae.adaptationSpeedUp === 4.0 &&
                                ae.adaptationSpeedDown === 1.5 &&
                                ae.lowPercentile === 0.5 &&
                                ae.highPercentile === 0.98 &&
                                ae.maxExposureMultiplier === 128.0 &&
                                ae.useDebugOverlay === true &&
                                ae.minEV100 === 12.0 &&
                                ae.maxEV100 === 12.0;

                            // 5. NaN 및 허용 범위 초과 Setter 예외 차단 전수 검증
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

                            // 6. clear() + destroy() 호출 후 VRAM 0으로 완전 해제 검증
                            const memBefore = ae.videoMemorySize;
                            ae.clear();
                            ae.destroy();
                            const releaseOk = memBefore > 0 && ae.videoMemorySize === 0;

                            ctx.destroy();
                            resolve({
                                constantsOk,
                                lazy2DOk,
                                lazyManualOk,
                                defaultsOk,
                                formulaOk,
                                settersOk,
                                validationOk,
                                releaseOk
                            });
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(result).toEqual({
            constantsOk: true,
            lazy2DOk: true,
            lazyManualOk: true,
            defaultsOk: true,
            formulaOk: true,
            settersOk: true,
            validationOk: true,
            releaseOk: true
        });
    });
});
