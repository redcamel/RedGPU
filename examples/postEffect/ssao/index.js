import * as RedGPU from "../../../dist/index.js";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js";

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

        // [KO] SSAO 활성화
        // [EN] Enable SSAO
        view.postEffectManager.useSSAO = true;
        redGPUContext.antialiasingManager.useTAA = true;

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf',
            (result) => {
                scene.addChild(result.resultMesh);
            }
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const ssaoFolder = pane.addFolder({title: 'PostEffect', expanded: true});
            const ssao = view.postEffectManager.ssao;

            ssaoFolder.addBinding(view.postEffectManager, 'useSSAO').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                ssaoFolder.addBinding(ssao, 'useBlur'),
                ssaoFolder.addBinding(ssao, 'radius', {min: 0.01, max: 5.0, step: 0.01}),
                ssaoFolder.addBinding(ssao, 'intensity', {min: 0.0, max: 10.0, step: 0.1}),
                ssaoFolder.addBinding(ssao, 'bias', {min: 0.0, max: 0.1, step: 0.001}),
                ssaoFolder.addBinding(ssao, 'biasDistanceScale', {min: 0.0, max: 0.5, step: 0.01}),
                ssaoFolder.addBinding(ssao, 'fadeDistanceStart', {min: 1.0, max: 200.0, step: 0.1}),
                ssaoFolder.addBinding(ssao, 'fadeDistanceRange', {min: 1.0, max: 100.0, step: 0.1}),
                ssaoFolder.addBinding(ssao, 'contrast', {min: 0.5, max: 4.0, step: 0.1})
            ];
        }
    });
};
