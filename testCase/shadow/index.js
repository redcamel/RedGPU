import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Shadow');

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Defaults',
    (runner) => {
        runner.defineTest('Default shadowDepthTextureSize (2048)', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            run(manager.shadowDepthTextureSize === 2048);
        }, true);
        runner.defineTest('Default bias (0.005)', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            run(manager.bias === 0.005);
        }, true);
        runner.defineTest('Initial castingList is empty', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            run(Array.isArray(manager.castingList) && manager.castingList.length === 0);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - Validation',
    (runner) => {
        runner.defineTest('Failure: bias range (< 0)', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try { manager.bias = -0.1; run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: bias range (> 1)', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try { manager.bias = 1.1; run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: bias is NaN', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try { manager.bias = NaN; run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: size range (<= 0)', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try { manager.shadowDepthTextureSize = 0; run(true); } catch (e) { run(false); }
        }, false);
        runner.defineTest('Failure: size is NaN', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try { manager.shadowDepthTextureSize = NaN; run(true); } catch (e) { run(false); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager - GPU Resources',
    (runner) => {
        runner.defineTest('Texture and View creation', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.update(redGPUContext);
                const hasView = manager.shadowDepthTextureView instanceof GPUTextureView;
                const hasEmptyView = manager.shadowDepthTextureViewEmpty instanceof GPUTextureView;
                manager.destroy();
                redGPUContext.destroy();
                run(hasView && hasEmptyView);
            });
        }, true);

        runner.defineTest('Memory calculation (2048x2048 depth32float)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.shadowDepthTextureSize = 2048;
                manager.update(redGPUContext);
                const expected = 2048 * 2048 * 4;
                const actual = manager.videoMemorySize;
                manager.destroy();
                redGPUContext.destroy();
                run(actual === expected);
            });
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.ShadowManager',
    (runner) => {
        runner.defineTest('Composition: has DirectionalShadowManager', (run) => {
            const manager = new RedGPU.Shadow.ShadowManager();
            run(manager.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager);
        }, true);
    }
);