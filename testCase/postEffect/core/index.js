import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffect Core');

redUnit.testGroup(
    'RedGPU.PostEffect.Core.createBasicPostEffectCode',
    (runner) => {
        runner.defineTest('Success: Returns msaa and nonMsaa codes', (run) => {
            try {
                // Mock object that satisfies the interface used by createBasicPostEffectCode
                const mockEffect = { WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1 };
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;');
                const hasMSAA = typeof codes.msaa === 'string';
                const hasNonMSAA = typeof codes.nonMsaa === 'string';
                run(hasMSAA && hasNonMSAA);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success: Code contains workgroup size', (run) => {
            try {
                const mockEffect = { WORK_SIZE_X: 8, WORK_SIZE_Y: 8, WORK_SIZE_Z: 2 };
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;');
                const pass = codes.msaa.includes('@workgroup_size(8, 8, 2)');
                run(pass);
            } catch (e) {
                run(false, e);
            }
        }, true);

        runner.defineTest('Success: Handles custom source texture configs', (run) => {
            try {
                const mockEffect = { WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1 };
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;', '', [
                    { name: 'customTex1', isSampled: true },
                    { name: 'customTex2', isSampled: false }
                ]);
                const hasTex1 = codes.nonMsaa.includes('var customTex1 : texture_2d<f32>;');
                const hasTex2 = codes.nonMsaa.includes('var customTex2 : texture_storage_2d<rgba16float, read>;');
                run(hasTex1 && hasTex2);
            } catch (e) {
                run(false, e);
            }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.Core.ASinglePassPostEffect',
    (runner) => {
        runner.defineTest('Success: WORK_SIZE defaults', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class TestEffect extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    const effect = new TestEffect(redGPUContext);
                    const checkX = effect.WORK_SIZE_X === 16;
                    const checkY = effect.WORK_SIZE_Y === 16;
                    const checkZ = effect.WORK_SIZE_Z === 1;
                    const checkInstance = effect.isInstanceofPostEffect === true;
                    redGPUContext.destroy();
                    run(checkX && checkY && checkZ && checkInstance);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: Custom WORK_SIZE', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class TestEffect extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx, {x: 8, y: 4, z: 2}); }
                    }
                    const effect = new TestEffect(redGPUContext);
                    const checkX = effect.WORK_SIZE_X === 8;
                    const checkY = effect.WORK_SIZE_Y === 4;
                    const checkZ = effect.WORK_SIZE_Z === 2;
                    redGPUContext.destroy();
                    run(checkX && checkY && checkZ);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: videoMemorySize default (0)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class TestEffect extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    const effect = new TestEffect(redGPUContext);
                    const mem = effect.videoMemorySize === 0;
                    redGPUContext.destroy();
                    run(mem);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.Core.AMultiPassPostEffect',
    (runner) => {
        runner.defineTest('Success: passList management', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class SinglePass extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    class MultiPass extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
                        constructor(ctx) {
                            super(ctx, [
                                new SinglePass(ctx),
                                new SinglePass(ctx)
                            ]);
                        }
                    }

                    const multi = new MultiPass(redGPUContext);

                    const checkLength = multi.passList.length === 2;
                    const checkInstance = multi.isInstanceofPostEffect === true;

                    redGPUContext.destroy();
                    run(checkLength && checkInstance);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: videoMemorySize reflects passes', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class SinglePass extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    class MultiPass extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
                        constructor(ctx) {
                            super(ctx, [new SinglePass(ctx)]);
                        }
                    }

                    const multi = new MultiPass(redGPUContext);

                    // Initially memory should be 0 because p1's memory is 0
                    const mem = multi.videoMemorySize === 0;
                    redGPUContext.destroy();
                    run(mem);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);
    }
);