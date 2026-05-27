import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - PostEffectManager');

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectManager - List Management',
    (runner) => {
        runner.defineTest('Success: Initial effectList length is 0', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    const actual = manager.effectList.length;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 0);

        runner.defineTest('Success: addEffect() increases list length', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;

                    // Use a dummy effect for management test
                    // Since ASinglePassPostEffect is abstract, we can't 'new' it directly.
                    // But we can check if the list handles objects.
                    const dummyEffect = { clear: () => {} };
                    manager.addEffect(dummyEffect);
                    
                    const actual = manager.effectList.length;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 1);

        runner.defineTest('Success: getEffectAt() returns correct effect', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;

                    const dummyEffect = { clear: () => {} };
                    manager.addEffect(dummyEffect);
                    
                    const actual = manager.getEffectAt(0);
                    redGPUContext.destroy();
                    run(actual === dummyEffect);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: removeEffectAt() decreases list length', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;

                    manager.addEffect({ clear: () => {} });
                    manager.removeEffectAt(0);
                    
                    const actual = manager.effectList.length;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 0);

        runner.defineTest('Success: removeAllEffect() clears the list', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;

                    manager.addEffect({ clear: () => {} });
                    manager.addEffect({ clear: () => {} });
                    manager.removeAllEffect();
                    
                    const actual = manager.effectList.length;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 0);
    }
);

redUnit.testGroup(
    'RedGPU.PostEffect.PostEffectManager - Properties & Sub-Managers',
    (runner) => {
        runner.defineTest('Success: texturePool existence', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    
                    const actual = manager.texturePool instanceof RedGPU.PostEffect.PostEffectTexturePool;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: autoExposure existence (Lazy loading)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    
                    const actual = manager.autoExposure !== undefined;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: SSAO toggle', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    
                    manager.useSSAO = true;
                    const actual = manager.useSSAO;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Success: SSR toggle', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const scene = new RedGPU.Display.Scene();
                    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                    const manager = view.postEffectManager;
                    
                    manager.useSSR = true;
                    const actual = manager.useSSR;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            }, (error) => run(false, error));
        }, true);
    }
);