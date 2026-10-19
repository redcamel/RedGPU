import * as RedGPU from "../../../dist/index.js";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js";

/**
 * [KO] Convolution 예제
 * [EN] Convolution example
 *
 * [KO] 컨볼루션(Convolution) 필터를 사용하여 다양한 이미지 처리 효과(Sharpen, Blur, Edge, Emboss 등)를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply various image processing effects (Sharpen, Blur, Edge, Emboss, etc.) using a convolution filter.
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
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] Convolution 포스트 이펙트 생성 및 뷰에 추가
        // [EN] Create Convolution post effect and add it to the view
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
        effect.kernel = RedGPU.PostEffect.Convolution.EDGE;
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

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
        scene.addChild(v['resultMesh']);
    });
}

const renderTestPane = (redGPUContext, targetView, effect, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const convolutionMatrices = {
                NORMAL: RedGPU.PostEffect.Convolution.NORMAL,
                SHARPEN: RedGPU.PostEffect.Convolution.SHARPEN,
                BLUR: RedGPU.PostEffect.Convolution.BLUR,
                EDGE: RedGPU.PostEffect.Convolution.EDGE,
                EMBOSS: RedGPU.PostEffect.Convolution.EMBOSS
            };

            const config = {
                Convolution: true,
                kernel: 'EDGE'
            };

            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(config, 'Convolution').on('change', (v) => {
                if (v.value) {
                    targetView.postEffectManager.addEffect(effect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                kernelControl.disabled = !v.value;
            });

            const kernelControl = folder.addBinding(config, 'kernel', {
                options: {
                    NORMAL: 'NORMAL',
                    SHARPEN: 'SHARPEN',
                    BLUR: 'BLUR',
                    EDGE: 'EDGE',
                    EMBOSS: 'EMBOSS'
                }
            }).on('change', (v) => {
                effect.kernel = convolutionMatrices[v.value];
            });
        }
    });
};