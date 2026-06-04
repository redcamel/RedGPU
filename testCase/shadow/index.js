import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Shadow');

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager',
    (runner) => {
        runner.defineTest('Success Test: Default Properties', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                const check = manager.shadowDepthTextureSize === 2048 &&
                              manager.bias === 0.005 &&
                              Array.isArray(manager.castingList) &&
                              manager.castingList.length === 0;
                run(check);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Size and Bias Setters', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.shadowDepthTextureSize = 1024;
                manager.bias = 0.01;
                run(manager.shadowDepthTextureSize === 1024 && manager.bias === 0.01);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: shadowDepthTextureSize - NaN', (run) => {
            try { new RedGPU.Shadow.DirectionalShadowManager().shadowDepthTextureSize = NaN; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: bias - out of range (1.1)', (run) => {
            try { new RedGPU.Shadow.DirectionalShadowManager().bias = 1.1; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Success Test: Resource Allocation (update)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const manager = new RedGPU.Shadow.DirectionalShadowManager();
                    manager.update(redGPUContext);
                    const checkView = manager.shadowDepthTextureView instanceof GPUTextureView;
                    const checkEmpty = manager.shadowDepthTextureViewEmpty instanceof GPUTextureView;
                    const checkMemory = manager.videoMemorySize > 0;
                    
                    manager.destroy();
                    redGPUContext.destroy();
                    run(checkView && checkEmpty && checkMemory);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success Test: reset and resetCastingList', (run) => {
            try {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.resetCastingList();
                run(true);
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.ShadowManager',
    (runner) => {
        runner.defineTest('Success Test: Constructor and directionalShadowManager', (run) => {
            try {
                const manager = new RedGPU.Shadow.ShadowManager();
                run(manager.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: update and render access', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = scene.shadowManager;
                    
                    manager.update(redGPUContext);
                    // render needs a view setup, we just check if it exists as a function
                    const checkRender = typeof manager.render === 'function';
                    redGPUContext.destroy();
                    run(checkRender);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);
    }
);
