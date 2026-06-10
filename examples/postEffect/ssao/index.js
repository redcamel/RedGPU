import * as RedGPU from "../../../dist/index.js?t=1781134103100";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1781134103100";

/**
 * [KO] SSAO 예제
 * [EN] SSAO example
 *
 * [KO] Screen Space Ambient Occlusion (SSAO) 효과를 시연합니다.
 * [EN] Demonstrates the Screen Space Ambient Occlusion (SSAO) effect.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);

        controller.y = 1;
        controller.tilt = 15;
        controller.pan = 90;
        controller.moveSpeed = 20;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        view.postEffectManager.useSSAO = true;

        redGPUContext.antialiasingManager.useTAA = true;

        new RedGPU.GLTFLoader(redGPUContext, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf', (result) => {
            const mesh = result.resultMesh;
            scene.addChild(mesh);
        });
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        // view.ibl = ibl;
        // view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // [KO] RedGPUExampleHelper 초기화
        // [EN] Initialize RedGPUExampleHelper
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

/**
 * [KO] RedGPUExampleHelper 초기화
 * [EN] Initialize RedGPUExampleHelper
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
function renderTestPane(redGPUContext) {
    const view = redGPUContext.viewList[0];
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const ssaoFolder = pane.addFolder({title: 'SSAO Parameters', expanded: true});
            const ssao = view.postEffectManager.ssao;

            ssaoFolder.addBinding(view.postEffectManager, 'useSSAO', {label: 'Enable SSAO'});
            ssaoFolder.addBinding(view.postEffectManager, 'useSSR', {label: 'Enable SSR'});

            ssaoFolder.addBinding(ssao, 'useBlur');
            ssaoFolder.addBinding(ssao, 'radius', {
                min: 0.01,
                max: 5.0,
                step: 0.01,
                label: 'Radius'
            });

            ssaoFolder.addBinding(ssao, 'intensity', {
                min: 0.0,
                max: 10.0,
                step: 0.1,
                label: 'Intensity'
            });

            ssaoFolder.addBinding(ssao, 'bias', {
                min: 0.0,
                max: 0.1,
                step: 0.001,
                label: 'Bias'
            });

            ssaoFolder.addBinding(ssao, 'biasDistanceScale', {
                min: 0.0,
                max: 0.5,
                step: 0.01,
                label: 'Bias Distance Scale'
            });

            ssaoFolder.addBinding(ssao, 'fadeDistanceStart', {
                min: 1.0,
                max: 200.0,
                step: 0.01,
                label: 'Fade Distance Start'
            });

            ssaoFolder.addBinding(ssao, 'fadeDistanceRange', {
                min: 1.0,
                max: 100.0,
                step: 0.01,
                label: 'Fade Distance Range'
            });

            ssaoFolder.addBinding(ssao, 'contrast', {
                min: 0.5,
                max: 4.0,
                step: 0.1,
                label: 'Contrast'
            });
        }
    });
}

