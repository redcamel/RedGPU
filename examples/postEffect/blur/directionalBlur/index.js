import * as RedGPU from "../../../../dist/index.js?t=1781132303147";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781132303147";

/**
 * [KO] Directional Blur 예제
 * [EN] Directional Blur example
 *
 * [KO] 방향성 블러(Directional Blur) 포스트 이펙트를 시연합니다.
 * [EN] Demonstrates directional blur post effect.
 */

// 1. Create and append a container and canvas
const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
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
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, viewEffect, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => scene.addChild(v['resultMesh']));
}

const renderTestPane = async (redGPUContext, targetView, container) => {

    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui:pane=>{
            const effect = targetView.postEffectManager.getEffectAt(0);

            const TEST_STATE = {
                DirectionalBlur: true,
                amount: effect.amount,
                angle: effect.angle,
                sampleCount: effect.sampleCount,
            }
            const folder = pane.addFolder({title: 'PostEffect', expanded: true})

            folder.addBinding(TEST_STATE, 'DirectionalBlur').on('change', (v) => {
                if (v.value) {
                    const newEffect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
                    newEffect.amount = TEST_STATE.amount;
                    newEffect.angle = TEST_STATE.angle;
                    targetView.postEffectManager.addEffect(newEffect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                amountControl.disabled = !v.value;
                angleControl.disabled = !v.value;
                sampleCountControl.disabled = !v.value;
            });

            const amountControl = folder.addBinding(TEST_STATE, 'amount', {min: 0, max: 100}).on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.amount = v.value
            })
            const angleControl = folder.addBinding(TEST_STATE, 'angle', {min: 0, max: 360}).on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.angle = v.value
            })
            const sampleCountControl = folder.addBinding(TEST_STATE, 'sampleCount', {
                min: 1,
                max: 100,
                step: 1
            }).on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.sampleCount = v.value
            })
        }
    });
};
