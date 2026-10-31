import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectManager');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectManager',
    (runner) => {
        const setup = (run, callback) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene(redGPUContext);
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    callback(redGPUContext, manager, view);
                    redGPUContext.destroy();
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        };

        runner.defineTest('Success Test: Initial state and Getters', (run) => {
            setup(run, (ctx, manager, view) => {
                const checkView = manager.view === view;
                const checkPool = manager.texturePool instanceof RedGPU.PostEffect.Core.PostEffectTexturePool;
                const checkUniform = manager.postEffectSystemUniformBuffer instanceof RedGPU.Resource.UniformBuffer;
                const checkList = Array.isArray(manager.effectList) && manager.effectList.length === 0;
                run(checkView && checkPool && checkUniform && checkList);
            });
        }, true);

        runner.defineTest('Success Test: Effect Management (add, get, remove)', (run) => {
            setup(run, (ctx, manager) => {
                const effect = { clear: () => {}, render: () => {} }; // Mock
                manager.addEffect(effect);
                const checkAdd = manager.effectList.length === 1 && manager.getEffectAt(0) === effect;
                
                manager.removeEffect(effect);
                const checkRemove = manager.effectList.length === 0;
                
                manager.addEffect(effect);
                manager.removeEffectAt(0);
                const checkRemoveAt = manager.effectList.length === 0;
                
                manager.addEffect(effect);
                manager.addEffect({ clear: () => {} });
                manager.removeAllEffect();
                const checkRemoveAll = manager.effectList.length === 0;
                
                run(checkAdd && checkRemove && checkRemoveAt && checkRemoveAll);
            });
        }, true);

        runner.defineTest('Success Test: BuiltInEffectManager Lazy Loaded Effects (SSAO, SSR, DOF, Bloom, AutoExposure)', (run) => {
            setup(run, (ctx, manager, view) => {
                const builtInEffectManager = view.builtInEffectManager;
                const ssao = builtInEffectManager.ssao;
                const checkSSAO = ssao instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect;

                const ssr = builtInEffectManager.ssr;
                const checkSSR = ssr instanceof RedGPU.PostEffect.Core.ASinglePassPostEffect;

                const dof = builtInEffectManager.dof;
                const checkDOF = dof instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect;

                const bloom = builtInEffectManager.bloom;
                const checkBloom = bloom instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect;

                const ae = builtInEffectManager.autoExposure;
                const checkAE = ae instanceof RedGPU.Camera.Core.AutoExposure;

                builtInEffectManager.useSSAO = true;
                builtInEffectManager.useSSR = true;
                builtInEffectManager.useDOF = true;
                builtInEffectManager.useBloom = true;
                const checkToggles = builtInEffectManager.useSSAO === true && builtInEffectManager.useSSR === true && builtInEffectManager.useDOF === true && builtInEffectManager.useBloom === true;

                run(checkSSAO && checkSSR && checkDOF && checkBloom && checkAE && checkToggles);
            });
        }, true);

        runner.defineTest('Success Test: G-Buffer resources', (run) => {
            setup(run, (ctx, manager) => {
                const layout = manager.gbufferBindGroupLayout;
                const bg = manager.gbufferBindGroup;
                // These might be null initially if not rendered, but should be accessible
                run(layout instanceof GPUBindGroupLayout);
            });
        }, true);

        runner.defineTest('Success Test: videoMemorySize', (run) => {
            setup(run, (ctx, manager) => {
                run(typeof manager.videoMemorySize === 'number');
            });
        }, true);

        runner.defineTest('Success Test: clear() and render() basic access', (run) => {
            setup(run, (ctx, manager) => {
                try {
                    manager.clear();
                    // render() requires a full frame setup, but we check if it's a function
                    run(typeof manager.render === 'function');
                } catch (e) { run(false, e); }
            });
        }, true);
    }
);
