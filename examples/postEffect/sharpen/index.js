import * as RedGPU from "../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1781141623471";

/**
 * [KO] Sharpen 예제
 * [EN] Sharpen example
 *
 * [KO] 샤픈(Sharpen) 포스트 이펙트를 시연합니다.
 * [EN] Demonstrates sharpen post effect.
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

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
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
            const TEST_STATE = {
                Sharpen: true,
            }
            const folder = pane.addFolder({title: 'PostEffect', expanded: true})
            folder.addBinding(TEST_STATE, 'Sharpen').on('change', (v) => {
                if (v.value) targetView.postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext))
                else targetView.postEffectManager.removeAllEffect()
            });
        }
    });


};
