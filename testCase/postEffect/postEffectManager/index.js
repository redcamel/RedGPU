import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectManager');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectManager',
    (runner) => {
        const setup = (callback) => {
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
                    throw e;
                }
            }, (error) => { throw error; });
        };

        runner.defineTest('Success Test: Initial state and Getters', (run) => {
            setup((ctx, manager, view) => {
                const checkView = manager.view === view;
                const checkPool = manager.texturePool instanceof RedGPU.PostEffect.PostEffectTexturePool;
                const checkUniform = manager.postEffectSystemUniformBuffer instanceof RedGPU.Resource.UniformBuffer;
                const checkList = Array.isArray(manager.effectList) && manager.effectList.length === 0;
                run(checkView && checkPool && checkUniform && checkList);
            });
        }, true);

        runner.defineTest('Success Test: Effect Management (add, get, remove)', (run) => {
            setup((ctx, manager) => {
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

        runner.defineTest('Success Test: Lazy Loaded Effects (SSAO, SSR, AutoExposure)', (run) => {
            setup((ctx, manager) => {
                const ssao = manager.ssao;
                const checkSSAO = ssao instanceof RedGPU.PostEffect.SSAO;
                
                const ssr = manager.ssr;
                const checkSSR = ssr instanceof RedGPU.PostEffect.SSR;
                
                const ae = manager.autoExposure;
                const checkAE = ae instanceof RedGPU.Camera.AutoExposure;
                
                manager.useSSAO = true;
                manager.useSSR = true;
                const checkToggles = manager.useSSAO === true && manager.useSSR === true;
                
                run(checkSSAO && checkSSR && checkAE && checkToggles);
            });
        }, true);

        runner.defineTest('Success Test: G-Buffer resources', (run) => {
            setup((ctx, manager) => {
                const layout = manager.gbufferBindGroupLayout;
                const bg = manager.gbufferBindGroup;
                // These might be null initially if not rendered, but should be accessible
                run(layout instanceof GPUBindGroupLayout);
            });
        }, true);

        runner.defineTest('Success Test: videoMemorySize', (run) => {
            setup((ctx, manager) => {
                run(typeof manager.videoMemorySize === 'number');
            });
        }, true);

        runner.defineTest('Success Test: clear() and render() basic access', (run) => {
            setup((ctx, manager) => {
                try {
                    manager.clear();
                    // render() requires a full frame setup, but we check if it's a function
                    run(typeof manager.render === 'function');
                } catch (e) { run(false, e); }
            });
        }, true);
    }
);
