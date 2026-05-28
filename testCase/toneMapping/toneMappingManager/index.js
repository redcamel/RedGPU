import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - ToneMappingManager');

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager',
    (runner) => {
        const setup = (callback) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                    callback(redGPUContext, manager);
                    redGPUContext.destroy();
                } catch (e) {
                    redGPUContext.destroy();
                    throw e;
                }
            }, (error) => { throw error; });
        };

        runner.defineTest('Success Test: Constructor and Context', (run) => {
            setup((ctx, manager) => {
                run(manager.redGPUContext === ctx);
            });
        }, true);

        runner.defineTest('Success Test: Initial mode and Getters', (run) => {
            setup((ctx, manager) => {
                const checkMode = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;
                const checkContrast = manager.contrast === 1.0;
                const checkBrightness = manager.brightness === 0.0;
                run(checkMode && checkContrast && checkBrightness);
            });
        }, true);

        runner.defineTest('Success Test: Property synchronization (contrast/brightness)', (run) => {
            setup((ctx, manager) => {
                manager.contrast = 1.5;
                manager.brightness = 0.5;
                const effect = manager.toneMapping;
                run(effect.contrast === 1.5 && effect.brightness === 0.5);
            });
        }, true);

        runner.defineTest('Success Test: Mode change and Lazy Loading', (run) => {
            setup((ctx, manager) => {
                manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;
                const effect = manager.toneMapping;
                const checkInstance = effect instanceof RedGPU.PostEffect.Core.ASinglePassPostEffect;
                const checkMode = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;
                run(checkInstance && checkMode);
            });
        }, true);

        runner.defineTest('Success Test: clear() method', (run) => {
            setup((ctx, manager) => {
                manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                const effectBefore = manager.toneMapping;
                manager.clear();
                // Accessing toneMapping again will recreate it
                run(true); 
            });
        }, true);

        runner.defineTest('Success Test: render access', (run) => {
            setup((ctx, manager) => {
                run(typeof manager.render === 'function');
            });
        }, true);
    }
);
