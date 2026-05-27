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
            } catch (e) { run(null, e); }
        }, 2048);
        runner.defineTest('Success: Default bias', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                run(manager.bias);
            } catch (e) { run(null, e); }
        }, 0.005);
        runner.defineTest('Success: Initial castingList length', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                run(manager.castingList.length);
            } catch (e) { run(null, e); }
        }, 0);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Validation',
    (runner) => {
        runner.defineTest('Failure: bias < 0', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.bias = -0.1;
                run(true);
            } catch (e) { run(false, e); }
        }, false);
        runner.defineTest('Failure: bias is NaN', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.bias = NaN;
                run(true);
            } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Resources',
    (runner) => {
        runner.defineTest('Success: Memory calculation (1024 size)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.Shadow.DirectionalShadowManager();
                    manager.shadowDepthTextureSize = 1024;
                    manager.update(redGPUContext);
                    const actual = manager.videoMemorySize;
                    manager.destroy();
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 1024 * 1024 * 4);
    }
);