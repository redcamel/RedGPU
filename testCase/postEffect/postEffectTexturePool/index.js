import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectTexturePool');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool - Allocation',
    (runner) => {
        runner.defineTest('Success: Initial allocationCount check', (run) => {
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

        runner.defineTest('Success: Initial activeCount check', (run) => {
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
        runner.defineTest('Success: idleCount check after release', (run) => {
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

        runner.defineTest('Success: activeCount check after release', (run) => {
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

        runner.defineTest('Success: allocationCount should not increase on reuse', (run) => {
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
        runner.defineTest('Success: releaseAll() results in 0 active textures', (run) => {
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
                    
                    const actual = pool.activeCount;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 0);

        runner.defineTest('Success: clear() results in 0 videoMemorySize', (run) => {
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
        runner.defineTest('Success: hitRate precision check', (run) => {
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
                    
                    const actual = parseFloat(pool.hitRate.toFixed(4));
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 0.3333);

        runner.defineTest('Success: peakActiveCount check', (run) => {
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