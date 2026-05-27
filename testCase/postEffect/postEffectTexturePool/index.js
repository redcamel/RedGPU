import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectTexturePool');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool - Allocation',
    (runner) => {
        runner.defineTest('Success: Initial allocation increases allocationCount', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    pool.allocResult(256, 256);
                    const actual = pool.allocationCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1);

        runner.defineTest('Success: Allocation increases activeCount', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    pool.allocResult(256, 256);
                    const actual = pool.activeCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool - Reusability',
    (runner) => {
        runner.defineTest('Success: Releasing increases idleCount', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    const res = pool.allocResult(256, 256);
                    pool.release(res.texture);
                    const actual = pool.idleCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1);

        runner.defineTest('Success: Releasing decreases activeCount', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    const res = pool.allocResult(256, 256);
                    pool.release(res.texture);
                    const actual = pool.activeCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 0);

        runner.defineTest('Success: Reallocating same params reuses texture (allocationCount check)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    const res1 = pool.allocResult(256, 256);
                    pool.release(res1.texture);
                    pool.allocResult(256, 256);
                    
                    const actual = pool.allocationCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool - Bulk Operations',
    (runner) => {
        runner.defineTest('Success: releaseAll() idleCount check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    pool.allocResult(128, 128);
                    pool.allocResult(256, 256);
                    pool.releaseAll();
                    
                    const actual = pool.idleCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 2);

        runner.defineTest('Success: clear() resets videoMemorySize', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    pool.allocResult(128, 128);
                    pool.clear();
                    
                    const actual = pool.videoMemorySize;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 0);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool - Statistics',
    (runner) => {
        runner.defineTest('Success: hitRate calculation', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    const res1 = pool.allocResult(64, 64);
                    pool.release(res1.texture);
                    pool.allocResult(64, 64); // Hit
                    pool.allocResult(128, 128); // Miss
                    
                    // 3 requests, 2 allocations -> (3-2)/3 = 0.3333333333333333
                    const actual = pool.hitRate;
                    redGPUContext.destroy();
                    // Use a small epsilon for floating point comparison in actual run logic if needed,
                    // but RedUnit usually does simple equality. For hitRate, let's round or check.
                    run(parseFloat(actual.toFixed(4)));
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 0.3333);

        runner.defineTest('Success: peakActiveCount tracking', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const pool = view.postEffectManager.texturePool;

                    const res1 = pool.allocResult(64, 64);
                    const res2 = pool.allocResult(64, 64);
                    pool.release(res1.texture);
                    pool.release(res2.texture);
                    
                    const actual = pool.peakActiveCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 2);
    }
);