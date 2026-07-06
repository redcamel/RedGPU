import * as RedGPU from "../../../../dist/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783322366074";

/**
 * [KO] Vignetting 예제
 * [EN] Vignetting example
 *
 * [KO] 비네팅(Vignetting) 포스트 이펙트를 시연합니다.
 * [EN] Demonstrates the vignetting post effect.
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
        const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                viewNormal.setSize('100%', '50%'); viewNormal.setPosition(0, 0);
                viewEffect.setSize('100%', '50%'); viewEffect.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%'); viewNormal.setPosition(0, 0);
                viewEffect.setSize('50%', '100%'); viewEffect.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, viewEffect, container);
    },
    (failReason) => console.error(failReason)
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
                Vignetting: true,
                smoothness: effect.smoothness,
                size: effect.size,
                centerX: effect.centerX,
                centerY: effect.centerY,
            }
            const folder = pane.addFolder({title: 'PostEffect', expanded: true})

            folder.addBinding(TEST_STATE, 'Vignetting').on('change', (v) => {
                if (v.value) {
                    const newEffect = new RedGPU.PostEffect.Vignetting(redGPUContext);
                    newEffect.smoothness = TEST_STATE.smoothness;
                    newEffect.size = TEST_STATE.size;
                    newEffect.centerX = TEST_STATE.centerX;
                    newEffect.centerY = TEST_STATE.centerY;
                    targetView.postEffectManager.addEffect(newEffect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                controls.forEach(c => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(TEST_STATE, 'smoothness', {min: 0, max: 1}),
                folder.addBinding(TEST_STATE, 'size', {min: 0, max: 1}),
                folder.addBinding(TEST_STATE, 'centerX', {min: -500, max: 500, step: 1}),
                folder.addBinding(TEST_STATE, 'centerY', {min: -500, max: 500, step: 1}),
            ];

            pane.on('change', () => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) {
                    currentEffect.smoothness = TEST_STATE.smoothness;
                    currentEffect.size = TEST_STATE.size;
                    currentEffect.centerX = TEST_STATE.centerX;
                    currentEffect.centerY = TEST_STATE.centerY;
                }
            });
        }
    });


};
