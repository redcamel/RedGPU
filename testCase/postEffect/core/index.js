import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffect Core');

redUnit.testGroup(
    'RedGPU.PostEffect.Core.createBasicPostEffectCode',
    (runner) => {
        runner.defineTest('Success: Returns msaa and nonMsaa codes', (run) => {
            try {
                // Mock effect for workSize
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
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.ASinglePassPostEffect (Logic via Concrete Subclass)',
    (runner) => {
        runner.defineTest('Success: WORK_SIZE defaults', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    // We need a concrete class to test the abstract base logic.
                    // Since the user asked for core tests, we'll define a minimal one if possible or use a simple one.
                    // But rule 1 says "Real objects over mocks". Let's assume we can subclass in JS for the test.
                    class TestEffect extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    const effect = new TestEffect(redGPUContext);
                    const checkX = effect.WORK_SIZE_X === 16;
                    const checkY = effect.WORK_SIZE_Y === 16;
                    const checkZ = effect.WORK_SIZE_Z === 1;
                    redGPUContext.destroy();
                    run(checkX && checkY && checkZ);
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
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.AMultiPassPostEffect (Logic via Concrete Subclass)',
    (runner) => {
        runner.defineTest('Success: passList management', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    class SinglePass extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
                        constructor(ctx) { super(ctx); }
                    }
                    class MultiPass extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
                        constructor(ctx, list) { super(ctx, list); }
                    }
                    
                    const p1 = new SinglePass(redGPUContext);
                    const p2 = new SinglePass(redGPUContext);
                    const multi = new MultiPass(redGPUContext, [p1, p2]);
                    
                    const actual = multi.passList.length;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 2);
    }
);