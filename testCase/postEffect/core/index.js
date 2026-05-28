import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffect Core');

redUnit.testGroup(
    'RedGPU.PostEffect.Core.createBasicPostEffectCode',
    (runner) => {
        runner.defineTest('Success Test: Basic code generation', (run) => {
            try {
                const mockEffect = { WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1 };
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;');
                run(typeof codes.msaa === 'string' && typeof codes.nonMsaa === 'string');
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Workgroup size reflection', (run) => {
            try {
                const mockEffect = { WORK_SIZE_X: 8, WORK_SIZE_Y: 4, WORK_SIZE_Z: 2 };
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;');
                run(codes.msaa.includes('@workgroup_size(8, 4, 2)'));
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Custom texture configs', (run) => {
            try {
                const mockEffect = { WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1 };
                const configs = [
                    { name: 'tex1', isSampled: true },
                    { name: 'tex2', isSampled: false }
                ];
                const codes = RedGPU.PostEffect.Core.createBasicPostEffectCode(mockEffect, 'return;', '', configs);
                const hasTex1 = codes.nonMsaa.includes('var tex1 : texture_2d<f32>;');
                const hasTex2 = codes.nonMsaa.includes('var tex2 : texture_storage_2d<rgba16float, read>;');
                run(hasTex1 && hasTex2);
            } catch (e) { run(false, e); }
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.Core.ASinglePassPostEffect',
    (runner) => {
        class MockSinglePass extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
            constructor(ctx, workSize) { super(ctx, workSize); }
        }

        runner.defineTest('Success Test: WORK_SIZE defaults', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const effect = new MockSinglePass(redGPUContext);
                    const check = effect.WORK_SIZE_X === 16 && effect.WORK_SIZE_Y === 16 && effect.WORK_SIZE_Z === 1;
                    redGPUContext.destroy();
                    run(check);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success Test: Custom WORK_SIZE', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const effect = new MockSinglePass(redGPUContext, {x: 8, y: 4, z: 2});
                    const check = effect.WORK_SIZE_X === 8 && effect.WORK_SIZE_Y === 4 && effect.WORK_SIZE_Z === 2;
                    redGPUContext.destroy();
                    run(check);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success Test: videoMemorySize initial check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const effect = new MockSinglePass(redGPUContext);
                    run(effect.videoMemorySize);
                    redGPUContext.destroy();
                } catch (e) { redGPUContext.destroy(); run(null, e); }
            }, (error) => run(null, error));
        }, 0);

        runner.defineTest('Success Test: isInstanceofPostEffect property', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const effect = new MockSinglePass(redGPUContext);
                    run(effect.isInstanceofPostEffect);
                    redGPUContext.destroy();
                } catch (e) { redGPUContext.destroy(); run(null, e); }
            }, (error) => run(null, error));
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.Core.AMultiPassPostEffect',
    (runner) => {
        class Single extends RedGPU.PostEffect.Core.ASinglePassPostEffect {
            constructor(ctx) { super(ctx); }
        }
        class Multi extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
            constructor(ctx, passes) { super(ctx, passes); }
        }

        runner.defineTest('Success Test: Chaining passes', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const p1 = new Single(redGPUContext);
                    const p2 = new Single(redGPUContext);
                    const multi = new Multi(redGPUContext, [p1, p2]);
                    run(multi.passList.length === 2 && multi.passList[0] === p1 && multi.passList[1] === p2);
                    redGPUContext.destroy();
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Failure Test: constructor - null passList', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    new Multi(redGPUContext, null);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) { redGPUContext.destroy(); run(false, e); }
            }, (error) => run(false, error));
        }, false);
    }
);
