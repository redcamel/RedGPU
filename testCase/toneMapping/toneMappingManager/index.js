import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - ToneMappingManager');

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Lifecycle & Properties',
    (runner) => {
        runner.defineTest('Success: Constructor check Context', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const actual = manager.redGPUContext;
                    redGPUContext.destroy();
                    run(actual === redGPUContext);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Initial mode check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    const actual = manager.mode;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL);

        runner.defineTest('Success: Property Synchronization - contrast', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    manager.contrast = 1.8;
                    const actual = manager.toneMapping.contrast;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1.8);
    }
);

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Rendering',
    (runner) => {
        runner.defineTest('Success: Render Delegation check texture creation', (run) => {
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
                    const isGPUTexture = result && result.texture instanceof GPUTexture;
                    redGPUContext.destroy();
                    run(isGPUTexture);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);
    }
);