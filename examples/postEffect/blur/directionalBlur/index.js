import * as RedGPU from "../../../../dist/index.js?t=1794645384845";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794645384845";

/**
 * [KO] Directional Blur 예제
 * [EN] Directional Blur example
 *
 * [KO] DirectionalBlur 이펙트를 사용하여 지정한 각도 방향으로 블러 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply a directional blur effect along a specified angle using the DirectionalBlur effect.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 2.9;
        controller.tilt = 0;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewNormal.builtInEffectManager.useBloom = true;
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.builtInEffectManager.useBloom = true;
        redGPUContext.addView(viewEffect);

        // [KO] DirectionalBlur 이펙트 생성 및 뷰에 추가
        // [EN] Create DirectionalBlur effect and add to view
        const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
            (v) => {
                scene.addChild(v.resultMesh);
            }
        );

        const updateLayout = () => {
            const isPortrait = window.innerWidth < window.innerHeight;
            if (isPortrait) {
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, 0);
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);
                viewEffect.setSize('50%', '100%');
                viewEffect.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, viewEffect, effect, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, targetView, effect, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const config = {DirectionalBlur: true};
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(config, 'DirectionalBlur').on('change', (v) => {
                if (v.value) {
                    targetView.postEffectManager.addEffect(effect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(effect, 'amount', {min: 0, max: 100}),
                folder.addBinding(effect, 'angle', {min: 0, max: 360}),
                folder.addBinding(effect, 'sampleCount', {min: 1, max: 100, step: 1})
            ];
        }
    });
};
