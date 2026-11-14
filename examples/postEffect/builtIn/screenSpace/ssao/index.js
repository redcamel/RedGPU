import * as RedGPU from "../../../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] SSAO 예제
 * [EN] SSAO example
 *
 * [KO] 화면 공간 앰비언트 오클루전(SSAO) 이펙트를 사용하여 구석이나 틈새의 입체적인 음영을 표현하는 방법을 보여줍니다.
 * [EN] Demonstrates how to add depth and contact shadows to crevices using Screen Space Ambient Occlusion (SSAO).
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
        controller.moveSpeed = 5;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', 60000);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, ibl.luminance);
        redGPUContext.addView(view);

        // [KO] SSAO 이펙트 활성화 및 인스턴스 참조
        // [EN] Enable SSAO effect and reference instance
        view.builtInEffectManager.useSSAO = true;
        const effect = view.builtInEffectManager.ssao;

        redGPUContext.antialiasingManager.useTAA = true;

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf',
            (result) => {
                scene.addChild(result.resultMesh);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, effect);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, view, effect) => {
    new RedGPUExampleHelper(redGPUContext, {
        topBar: {
            ssao: false
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});
            folder.addBinding(view.builtInEffectManager, 'useSSAO').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(effect, 'useBlur'),
                folder.addBinding(effect, 'useMultiBounce'),
                folder.addBinding(effect, 'radius', {min: 0.01, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'intensity', {min: 0.0, max: 10.0, step: 0.1}),
                folder.addBinding(effect, 'bias', {min: 0.0, max: 0.1, step: 0.001}),
                folder.addBinding(effect, 'biasDistanceScale', {min: 0.0, max: 0.5, step: 0.01}),
                folder.addBinding(effect, 'fadeDistanceStart', {min: 1.0, max: 200.0, step: 0.1}),
                folder.addBinding(effect, 'fadeDistanceRange', {min: 1.0, max: 100.0, step: 0.1}),
                folder.addBinding(effect, 'contrast', {min: 0.5, max: 4.0, step: 0.1})
            ];
        }
    });
};
