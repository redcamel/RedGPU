import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - AutoExposure');

redUnit.testGroup(
    'RedGPU.PostEffect.BuiltIn.AutoExposure',
    (runner) => {
        const setup = (run, callback) => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera();
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    callback(redGPUContext, view, view.builtInEffectManager.autoExposure);
                    redGPUContext.destroy();
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        };

        runner.defineTest('Success Test: METERING_MODE Constants', (run) => {
            try {
                const M = RedGPU.PostEffect.BuiltIn.METERING_MODE;
                run(
                    M.AVERAGE === 0 &&
                    M.CENTER_WEIGHTED === 1 &&
                    M.SPOT === 2 &&
                    M.BASIC === 3
                );
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success Test: Default Properties & Initial Telemetry', (run) => {
            setup(run, (ctx, view, ae) => {
                run(
                    ae.minEV100 === -4.0 &&
                    ae.maxEV100 === 20.0 &&
                    ae.lowPercentile === 0.10 &&
                    ae.highPercentile === 0.90 &&
                    ae.adaptationSpeedUp === 3.0 &&
                    ae.adaptationSpeedDown === 1.0 &&
                    ae.maxExposureMultiplier === 64.0 &&
                    ae.meteringMode === RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED &&
                    ae.targetLuminance === 0.18 &&
                    ae.exposureCompensation === 0.0 &&
                    ae.spotRadius === 0.15 &&
                    ae.skyMeteringWeight === 0.65 &&
                    ae.maxHistogramLuminance === 262144.0 &&
                    ae.lowKeyBias === 0.0 &&
                    ae.lowKeyEV100 === 1.0 &&
                    ae.highKeyBias === 0.0 &&
                    ae.highKeyEV100 === 13.0 &&
                    ae.highlightProtection === 0.85 &&
                    ae.useDebugOverlay === false &&
                    ae.preExposureRatio === 1.0 &&
                    ae.videoMemorySize > 0
                );
            });
        }, true);

        runner.defineTest('Success Test: Single 2^EC Exposure Compensation & Photometric PreExposure Formula', (run) => {
            setup(run, (ctx, view, ae) => {
                ae.currentAdaptedEV100 = 10.0;
                ae.exposureCompensation = 0.0;
                const basePreExposure = ae.preExposure;
                const expectedBase = 1.0 / (1.2 * Math.pow(2, 10.0));

                ae.exposureCompensation = 1.0;
                const plusOneStopPreExposure = ae.preExposure;

                run(
                    Math.abs(basePreExposure - expectedBase) < 1e-9 &&
                    Math.abs(ae.effectiveEV100 - 9.0) < 1e-9 &&
                    Math.abs(plusOneStopPreExposure / basePreExposure - 2.0) < 1e-6
                );
            });
        }, true);

        runner.defineTest('Success Test: All Setters, Presets, Locked EV Range & resetAdaptation()', (run) => {
            setup(run, (ctx, view, ae) => {
                ae.setNaturalCinematic();
                const checkCinematic =
                    ae.meteringMode === RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED &&
                    ae.lowKeyBias === -0.6 &&
                    ae.highKeyBias === -0.3 &&
                    ae.highlightProtection === 0.90;

                ae.setIndoorPrioritized();
                const checkIndoor =
                    ae.skyMeteringWeight === 0.1 &&
                    ae.maxExposureMultiplier === 128.0 &&
                    ae.highlightProtection === 0.30;

                ae.setNightLowKey();
                const checkNight =
                    ae.minEV100 === -6.0 &&
                    ae.lowKeyBias === -1.2 &&
                    ae.highlightProtection === 0.85;

                ae.setDefault();
                const checkDefault =
                    ae.minEV100 === -4.0 &&
                    ae.maxEV100 === 20.0 &&
                    ae.meteringMode === RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED &&
                    ae.skyMeteringWeight === 0.65 &&
                    ae.highlightProtection === 0.85 &&
                    ae.lowKeyBias === 0.0;

                ae.spotRadius = 0.25;
                ae.skyMeteringWeight = 0.3;
                ae.highlightProtection = 0.5;
                ae.maxHistogramLuminance = 4096;
                ae.lowKeyEV100 = 0.5;
                ae.highKeyEV100 = 14.5;
                ae.useDebugOverlay = true;
                ae.minEV100 = 12.0;
                ae.maxEV100 = 12.0;
                ae.resetAdaptation();

                run(
                    checkCinematic &&
                    checkIndoor &&
                    checkNight &&
                    checkDefault &&
                    ae.spotRadius === 0.25 &&
                    ae.skyMeteringWeight === 0.3 &&
                    ae.highlightProtection === 0.5 &&
                    ae.maxHistogramLuminance === 4096 &&
                    ae.lowKeyEV100 === 0.5 &&
                    ae.highKeyEV100 === 14.5 &&
                    ae.useDebugOverlay === true &&
                    ae.minEV100 === 12.0 &&
                    ae.maxEV100 === 12.0
                );
            });
        }, true);

        runner.defineTest('Success Test: Lazy Allocation Guard for View2D & Manual Camera (Zero GPU Buffer Allocation)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const view2D = new RedGPU.Display.View2D(redGPUContext, scene);
                    const check2DCamera = view2D.camera.useAutoExposure === false;
                    const preExp2D = view2D.builtInEffectManager.getPreExposure();
                    const check2DNoAlloc =
                        view2D.builtInEffectManager.hasAutoExposure === false &&
                        view2D.builtInEffectManager.videoMemorySize === 0 &&
                        preExp2D === 1.0;

                    const manualCam = new RedGPU.Camera.PerspectiveCamera();
                    manualCam.useAutoExposure = false;
                    const manualView = new RedGPU.Display.View3D(redGPUContext, scene, manualCam);
                    const preExpManual = manualView.builtInEffectManager.getPreExposure();
                    const checkManualNoAlloc =
                        manualView.builtInEffectManager.hasAutoExposure === false &&
                        manualView.builtInEffectManager.videoMemorySize === 0 &&
                        preExpManual > 0;

                    redGPUContext.destroy();
                    run(check2DCamera && check2DNoAlloc && checkManualNoAlloc);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure Test: NaN & Out-of-Range Setter Validation', (run) => {
            setup(run, (ctx, view, ae) => {
                const invalidCases = [
                    () => {
                        ae.exposureCompensation = NaN;
                    },
                    () => {
                        ae.targetLuminance = -0.1;
                    },
                    () => {
                        ae.targetLuminance = NaN;
                    },
                    () => {
                        ae.minEV100 = NaN;
                    },
                    () => {
                        ae.maxEV100 = NaN;
                    },
                    () => {
                        ae.adaptationSpeedUp = -1;
                    },
                    () => {
                        ae.adaptationSpeedDown = -1;
                    },
                    () => {
                        ae.lowPercentile = -0.1;
                    },
                    () => {
                        ae.highPercentile = 1.1;
                    },
                    () => {
                        ae.maxExposureMultiplier = 0.5;
                    },
                    () => {
                        ae.meteringMode = 99;
                    },
                    () => {
                        ae.spotRadius = 0.01;
                    },
                    () => {
                        ae.spotRadius = 0.8;
                    },
                    () => {
                        ae.skyMeteringWeight = -0.1;
                    },
                    () => {
                        ae.skyMeteringWeight = 1.2;
                    },
                    () => {
                        ae.skyMeteringWeight = NaN;
                    },
                    () => {
                        ae.highlightProtection = -0.1;
                    },
                    () => {
                        ae.highlightProtection = 1.2;
                    },
                    () => {
                        ae.highlightProtection = NaN;
                    },
                    () => {
                        ae.maxHistogramLuminance = 0;
                    },
                    () => {
                        ae.lowKeyBias = -10;
                    },
                    () => {
                        ae.highKeyBias = 10;
                    },
                    () => {
                        ae.lowKeyEV100 = NaN;
                    },
                    () => {
                        ae.highKeyEV100 = NaN;
                    },
                    () => {
                        ae.currentAdaptedEV100 = NaN;
                    }
                ];

                let allThrew = true;
                for (let i = 0; i < invalidCases.length; i++) {
                    let threw = false;
                    try {
                        invalidCases[i]();
                    } catch (err) {
                        threw = true;
                    }
                    if (!threw) {
                        allThrew = false;
                        break;
                    }
                }
                run(allThrew);
            });
        }, true);

        runner.defineTest('Success Test: Clear & Destroy Release Video Memory', (run) => {
            setup(run, (ctx, view, ae) => {
                const memBefore = ae.videoMemorySize;
                ae.clear();
                ae.destroy();
                const memAfter = ae.videoMemorySize;
                run(memBefore > 0 && memAfter === 0);
            });
        }, true);
    }
);
