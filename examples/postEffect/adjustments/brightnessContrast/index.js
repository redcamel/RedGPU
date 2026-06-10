import * as RedGPU from "../../../../dist/index.js?t=1781131404967";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781131404967";

/**
 * [KO] Brightness & Contrast 예제
 * [EN] Brightness & Contrast example
 *
 * [KO] 포스트 이펙트를 사용하여 화면의 밝기와 대비를 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to adjust screen brightness and contrast using post effects.
 */

// 1. Create and append a container and canvas
// 1. 컨테이너와 캔버스를 생성하고 문서에 추가
const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // ============================================
        // 기본 설정
        // ============================================

        // 궤도형 카메라 컨트롤러 생성
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;
        controller.tilt = 0;

        // 씬 생성
        const scene = new RedGPU.Display.Scene();

        // ============================================
        // 뷰 생성 및 설정
        // ============================================

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        // 일반 뷰 생성 (Top/Left)
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // 이펙트 뷰 생성 (Bottom/Right)
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

        // ============================================
        // 씬 설정
        // ============================================

        // 조명 추가
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3D 모델 로드
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        // ============================================
        // 레이아웃 설정
        // ============================================

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

        // ============================================
        // 렌더링 시작
        // ============================================

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 컨트롤 패널 생성
        renderTestPane(redGPUContext, viewEffect, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            scene.addChild(v['resultMesh'])
        }
    )
}

const renderTestPane = async (redGPUContext, targetView, container) => {

    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane)=>{
            const effect = targetView.postEffectManager.getEffectAt(0);
            const TEST_STATE = {
                BrightnessContrast: true,
                brightness: effect.brightness,
                contrast: effect.contrast,
            }
            const folder = pane.addFolder({title: 'PostEffect', expanded: true})

            folder.addBinding(TEST_STATE, 'BrightnessContrast').on('change', (v) => {
                if (v.value) {
                    const newEffect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
                    newEffect.brightness = TEST_STATE.brightness;
                    newEffect.contrast = TEST_STATE.contrast;
                    targetView.postEffectManager.addEffect(newEffect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                brightnessControl.disabled = !v.value;
                contrastControl.disabled = !v.value;
            });

            const brightnessControl = folder.addBinding(TEST_STATE, 'brightness', {min: -150, max: 150}).on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.brightness = v.value
            })
            const contrastControl = folder.addBinding(TEST_STATE, 'contrast', {min: -50, max: 100}).on('change', (v) => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) currentEffect.contrast = v.value
            })
        }
    });


};
