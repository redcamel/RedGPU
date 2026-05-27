import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Shadow');

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Defaults',
    (runner) => {
        runner.defineTest('Success: Default shadowDepthTextureSize (2048)', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                if (manager.shadowDepthTextureSize === 2048) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: Default bias (0.005)', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                if (manager.bias === 0.005) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
        runner.defineTest('Success: Initial castingList is empty', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                if (Array.isArray(manager.castingList) && manager.castingList.length === 0) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
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
            } catch (e) {
                run(false);
            }
        }, false);
        runner.defineTest('Failure: bias range (> 1)', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.bias = 1.1;
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
        runner.defineTest('Failure: bias is NaN', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.bias = NaN;
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
        runner.defineTest('Failure: size range (<= 0)', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.shadowDepthTextureSize = 0;
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
        runner.defineTest('Failure: size is NaN', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.shadowDepthTextureSize = NaN;
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - GPU Resources',
    (runner) => {
        runner.defineTest('Success: Texture and View creation', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.Shadow.DirectionalShadowManager();
                    manager.update(redGPUContext);
                    const hasView = manager.shadowDepthTextureView instanceof GPUTextureView;
                    const hasEmptyView = manager.shadowDepthTextureViewEmpty instanceof GPUTextureView;
                    manager.destroy();
                    redGPUContext.destroy();
                    if (hasView && hasEmptyView) run(true);
                    else run(false);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, true);

        runner.defineTest('Success: Memory calculation (2048x2048 depth32float)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.Shadow.DirectionalShadowManager();
                    manager.shadowDepthTextureSize = 2048;
                    manager.update(redGPUContext);
                    const expected = 2048 * 2048 * 4;
                    const actual = manager.videoMemorySize;
                    manager.destroy();
                    redGPUContext.destroy();
                    if (actual === expected) run(true);
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
    'RedGPU.Shadow.ShadowManager',
    (runner) => {
        runner.defineTest('Success: Composition: has DirectionalShadowManager', (run) => {
            try {
                const manager = new RedGPU.Shadow.ShadowManager();
                if (manager.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);