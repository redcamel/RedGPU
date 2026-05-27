import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Shadow');

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Defaults',
    (runner) => {
        runner.defineTest('Success: Default shadowDepthTextureSize', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                run(manager.shadowDepthTextureSize);
            } catch (e) { run(e); }
        }, 2048);
        runner.defineTest('Success: Default bias', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                run(manager.bias);
            } catch (e) { run(e); }
        }, 0.005);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Validation',
    (runner) => {
        runner.defineTest('Failure: bias range (< 0)', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.bias = -0.1;
                run(true);
            } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - GPU Resources',
    (runner) => {
        runner.defineTest('Success: Memory calculation (1024x1024 depth32float)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.Shadow.DirectionalShadowManager();
                    manager.shadowDepthTextureSize = 1024;
                    manager.update(redGPUContext);
                    const expected = 1024 * 1024 * 4;
                    const actual = manager.videoMemorySize;
                    manager.destroy();
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1024 * 1024 * 4);
    }
);