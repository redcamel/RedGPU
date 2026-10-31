import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Color Balance 예제
 * [EN] Color Balance example
 *
 * [KO] 포스트 이펙트를 사용하여 화면의 색상 균형(Shadow, Midtone, Highlight)을 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to adjust the screen's color balance (Shadow, Midtone, Highlight) using post effects.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] ColorBalance 포스트 이펙트 생성 및 뷰에 추가
        // [EN] Create ColorBalance post effect and add it to the view
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

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
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, 0);
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, '50%');
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
            const config = {ColorBalance: true};
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(config, 'ColorBalance').on('change', (v) => {
                if (v.value) {
                    targetView.postEffectManager.addEffect(effect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(effect, 'shadowCyanRed', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'shadowMagentaGreen', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'shadowYellowBlue', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'midtoneCyanRed', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'midtoneMagentaGreen', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'midtoneYellowBlue', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'highlightCyanRed', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'highlightMagentaGreen', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'highlightYellowBlue', {min: -100, max: 100, step: 1}),
                folder.addBinding(effect, 'preserveLuminosity')
            ];
        }
    });
};
