import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - ToneMappingManager');

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Lifecycle & Properties',
    (runner) => {
        runner.defineTest('Success: Constructor & Initial State', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const checkContext = manager.redGPUContext === redGPUContext;
                    const checkMode = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;
                    const checkContrast = manager.contrast === 1.0;
                    const checkBrightness = manager.brightness === 0.0;
                    const checkInitialEffect = manager.toneMapping !== undefined;
                    redGPUContext.destroy();
                    if (checkContext && checkMode && checkContrast && checkBrightness && checkInitialEffect) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Mode Switching (Automatic Cleanup)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const effect1 = manager.toneMapping;
                    manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                    const effect2 = manager.toneMapping;
                    const checkModeChange = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                    const checkInstanceChange = effect1 !== effect2;
                    redGPUContext.destroy();
                    if (checkModeChange && checkInstanceChange) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Property Synchronization (Contrast/Brightness)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    manager.contrast = 1.2;
                    manager.brightness = -0.1;
                    const effect = manager.toneMapping;
                    const checkSync1 = effect.contrast === 1.2 && effect.brightness === -0.1;
                    manager.contrast = 1.8;
                    manager.brightness = 0.5;
                    const checkSync2 = effect.contrast === 1.8 && effect.brightness === 0.5;
                    redGPUContext.destroy();
                    if (checkSync1 && checkSync2) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Manual clear()', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const effect1 = manager.toneMapping;
                    manager.clear();
                    const effect2 = manager.toneMapping;
                    redGPUContext.destroy();
                    if (effect1 !== effect2) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Rendering',
    (runner) => {
        runner.defineTest('Success: Render Delegation Path', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const mockTextureInfo = {
                        texture: redGPUContext.gpuDevice.createTexture({
                            size: [4, 4, 1],
                            format: 'rgba8unorm',
                            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
                        }),
                        textureView: null
                    };
                    const result = manager.render(view, 4, 4, mockTextureInfo);
                    const pass = result && result.texture instanceof GPUTexture;
                    redGPUContext.destroy();
                    if (pass) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);
    }
);