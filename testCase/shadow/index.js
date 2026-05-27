import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Shadow');

redUnit.testGroup(
    'RedGPU.Shadow.DirectionalShadowManager',
    (runner) => {
        runner.defineTest('Initial State', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            const checkSize = manager.shadowDepthTextureSize === 2048;
            const checkBias = manager.bias === 0.005;
            const checkList = Array.isArray(manager.castingList) && manager.castingList.length === 0;
            run(checkSize && checkBias && checkList);
        }, true);

        runner.defineTest('Property Validation - bias', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try {
                manager.bias = 0.5; // Valid
                const check1 = manager.bias === 0.5;
                
                manager.bias = -0.1; // Invalid
                run(false, 'Should throw error for negative bias');
            } catch (e) {
                run(manager.bias === 0.5);
            }
        }, true);

        runner.defineTest('Property Validation - shadowDepthTextureSize', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            try {
                manager.shadowDepthTextureSize = 1024; // Valid
                const check1 = manager.shadowDepthTextureSize === 1024;
                
                manager.shadowDepthTextureSize = 0; // Invalid
                run(false, 'Should throw error for size 0');
            } catch (e) {
                run(manager.shadowDepthTextureSize === 1024);
            }
        }, true);

        runner.defineTest('Texture Creation & Memory Calculation', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                
                // Update triggers texture creation
                manager.update(redGPUContext);
                
                const checkTexture = manager.shadowDepthTextureView instanceof GPUTextureView;
                const checkEmptyTexture = manager.shadowDepthTextureViewEmpty instanceof GPUTextureView;
                const checkMemory = manager.videoMemorySize > 0;
                
                manager.destroy();
                redGPUContext.destroy();
                run(checkTexture && checkEmptyTexture && checkMemory);
            });
        }, true);

        runner.defineTest('Texture Regeneration on Size Change', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.Shadow.DirectionalShadowManager();
                manager.update(redGPUContext);
                const oldView = manager.shadowDepthTextureView;
                
                manager.shadowDepthTextureSize = 512;
                manager.update(redGPUContext);
                const newView = manager.shadowDepthTextureView;
                
                const checkChange = oldView !== newView;
                const checkMemory = manager.videoMemorySize === 512 * 512 * 4; // depth32float = 4 bytes
                
                manager.destroy();
                redGPUContext.destroy();
                run(checkChange && checkMemory);
            });
        }, true);

        runner.defineTest('resetCastingList()', (run) => {
            const manager = new RedGPU.Shadow.DirectionalShadowManager();
            // Mock object
            manager.castingList.push({});
            manager.resetCastingList();
            run(manager.castingList.length === 0);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Shadow.ShadowManager',
    (runner) => {
        runner.defineTest('Composition check', (run) => {
            const manager = new RedGPU.Shadow.ShadowManager();
            run(manager.directionalShadowManager instanceof RedGPU.Shadow.DirectionalShadowManager);
        }, true);

        runner.defineTest('update() delegation', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.Shadow.ShadowManager();
                manager.update(redGPUContext);
                
                const checkTexture = manager.directionalShadowManager.shadowDepthTextureView instanceof GPUTextureView;
                
                redGPUContext.destroy();
                run(checkTexture);
            });
        }, true);
    }
);