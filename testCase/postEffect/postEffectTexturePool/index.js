import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectTexturePool');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectTexturePool',
    (runner) => {
        const setup = (callback) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const pool = new RedGPU.PostEffect.PostEffectTexturePool(redGPUContext);
                    callback(redGPUContext, pool);
                    redGPUContext.destroy();
                } catch (e) {
                    redGPUContext.destroy();
                    throw e;
                }
            }, (error) => { throw error; });
        };

        runner.defineTest('Success Test: Initial state and Getters', (run) => {
            setup((ctx, pool) => {
                const checkInitial = pool.videoMemorySize === 0 &&
                                    pool.activeCount === 0 &&
                                    pool.idleCount === 0 &&
                                    pool.totalCount === 0 &&
                                    pool.allocationCount === 0 &&
                                    pool.peakActiveCount === 0 &&
                                    pool.hitRate === 0;
                run(checkInitial);
            });
        }, true);

        runner.defineTest('Success Test: Allocation and Release', (run) => {
            setup((ctx, pool) => {
                const res1 = pool.allocResult(256, 256);
                const checkAlloc = pool.activeCount === 1 && pool.allocationCount === 1;
                
                pool.release(res1.texture);
                const checkRelease = pool.activeCount === 0 && pool.idleCount === 1;
                
                const res2 = pool.allocResult(256, 256);
                const checkReuse = pool.activeCount === 1 && pool.idleCount === 0 && pool.allocationCount === 1;
                
                run(checkAlloc && checkRelease && checkReuse);
            });
        }, true);

        runner.defineTest('Success Test: hitRate and peakActiveCount', (run) => {
            setup((ctx, pool) => {
                pool.allocResult(64, 64); // Request 1, Alloc 1
                const res = pool.allocResult(64, 64); // Request 2, Alloc 2
                pool.release(res.texture);
                pool.allocResult(64, 64); // Request 3, Alloc 2 (Reuse)
                
                const checkHitRate = Math.abs(pool.hitRate - (3-2)/3) < 0.0001;
                const checkPeak = pool.peakActiveCount === 2;
                run(checkHitRate && checkPeak);
            });
        }, true);

        runner.defineTest('Success Test: releaseAll()', (run) => {
            setup((ctx, pool) => {
                pool.allocResult(128, 128);
                pool.allocResult(128, 128);
                pool.releaseAll();
                run(pool.activeCount === 0 && pool.idleCount === 2);
            });
        }, true);

        runner.defineTest('Success Test: clear()', (run) => {
            setup((ctx, pool) => {
                pool.allocResult(128, 128);
                pool.clear();
                const check = pool.videoMemorySize === 0 &&
                              pool.activeCount === 0 &&
                              pool.idleCount === 0 &&
                              pool.allocationCount === 0;
                run(check);
            });
        }, true);

        runner.defineTest('Success Test: getDetails()', (run) => {
            setup((ctx, pool) => {
                pool.allocResult(100, 100, 'rgba8unorm');
                const details = pool.getDetails();
                run(Array.isArray(details) && details.length === 1 && details[0].key === '100x100_rgba8unorm');
            });
        }, true);

        runner.defineTest('Failure Test: allocResult - negative dimensions', (run) => {
            setup((ctx, pool) => {
                try {
                    pool.allocResult(-1, 100);
                    run(true);
                } catch (e) { run(false, e); }
            });
        }, false);
    }
);
