import * as RedGPU from "../../../../dist/index.js?t=1781133866175";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781133866175";

/**
 * [KO] Color Balance 예제
 * [EN] Color Balance example
 *
 * [KO] 포스트 이펙트를 사용하여 화면의 색상 균형(Shadow, Midtone, Highlight)을 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to adjust the screen's color balance (Shadow, Midtone, Highlight) using post effects.
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
        const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
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
                ColorBalance: true,
                shadowCyanRed: effect.shadowCyanRed,
                shadowMagentaGreen: effect.shadowMagentaGreen,
                shadowYellowBlue: effect.shadowYellowBlue,
                midtoneCyanRed: effect.midtoneCyanRed,
                midtoneMagentaGreen: effect.midtoneMagentaGreen,
                midtoneYellowBlue: effect.midtoneYellowBlue,
                highlightCyanRed: effect.highlightCyanRed,
                highlightMagentaGreen: effect.highlightMagentaGreen,
                highlightYellowBlue: effect.highlightYellowBlue,
                preserveLuminosity: effect.preserveLuminosity,
            }
            const folder = pane.addFolder({title: 'PostEffect', expanded: true})

            folder.addBinding(TEST_STATE, 'ColorBalance').on('change', (v) => {
                if (v.value) {
                    const newEffect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
                    Object.assign(newEffect, TEST_STATE);
                    targetView.postEffectManager.addEffect(newEffect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                controls.forEach(c => c.disabled = !v.value);
            });

            const controls = [];
            const fields = [
                'shadowCyanRed', 'shadowMagentaGreen', 'shadowYellowBlue',
                'midtoneCyanRed', 'midtoneMagentaGreen', 'midtoneYellowBlue',
                'highlightCyanRed', 'highlightMagentaGreen', 'highlightYellowBlue'
            ];

            fields.forEach(field => {
                controls.push(folder.addBinding(TEST_STATE, field, {min: -100, max: 100}).on('change', (v) => {
                    const currentEffect = targetView.postEffectManager.getEffectAt(0);
                    if (currentEffect) currentEffect[field] = v.value;
                }));
            });

            controls.push(folder.addBinding(TEST_STATE, 'preserveLuminosity').on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.preserveLuminosity = v.value;
            }));
        }
    });

};
