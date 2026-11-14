import * as RedGPU from "../../../dist/index.js?t=1794640510497";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794640510497";

/**
 * [KO] Sharpen 예제
 * [EN] Sharpen example
 *
 * [KO] Sharpen 이펙트를 사용하여 화면의 윤곽선 선명도를 높이는 방법을 보여줍니다.
 * [EN] Demonstrates how to enhance screen edge sharpness using the Sharpen effect.
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
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

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

        // [KO] Sharpen 이펙트 생성 및 뷰에 추가
        // [EN] Create Sharpen effect and add to view
        const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
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
            const config = {Sharpen: true};
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(config, 'Sharpen').on('change', (v) => {
                if (v.value) {
                    targetView.postEffectManager.addEffect(effect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
            });
        }
    });
};
