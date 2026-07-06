import * as RedGPU from "../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] Convolution 예제
 * [EN] Convolution example
 *
 * [KO] 컨볼루션(Convolution) 필터를 사용하여 다양한 이미지 처리 효과(Sharpen, Blur, Edge Detection 등) 적용 방법을 보여줍니다.
 * [EN] Demonstrates how to apply various image processing effects (Sharpen, Blur, Edge Detection, etc.) using a convolution filter.
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

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        // 일반 뷰 생성 (Top/Left)
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // 이펙트 뷰 생성 (Bottom/Right)
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.Convolution(redGPUContext));
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
                // 세로형 분할
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, 0);         // 상단 (Normal)
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, '50%');     // 하단 (Effect)
            } else {
                // 가로형 분할
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);         // 좌측 (Normal)
                viewEffect.setSize('50%', '100%');
                viewEffect.setPosition('50%', 0);     // 우측 (Effect)
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

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 */
function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            scene.addChild(v['resultMesh'])
        }
    )
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = async (redGPUContext, targetView, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const effect = targetView.postEffectManager.getEffectAt(0);
            const TEST_STATE = {
                Convolution: true,
                kernel: 'BLUR',
                useCustomKernel: false,
                customMatrix: [...effect.kernel]
            };

            const convolutionMatrices = {
                NORMAL: RedGPU.PostEffect.Convolution.NORMAL,
                SHARPEN: RedGPU.PostEffect.Convolution.SHARPEN,
                BLUR: RedGPU.PostEffect.Convolution.BLUR,
                EDGE: RedGPU.PostEffect.Convolution.EDGE,
                EMBOSS: RedGPU.PostEffect.Convolution.EMBOSS,
            };

            const updateEffectKernel = () => {
                const effect = targetView.postEffectManager.getEffectAt(0);
                if (!effect) return;
                effect.kernel = TEST_STATE.useCustomKernel
                    ? TEST_STATE.customMatrix
                    : convolutionMatrices[TEST_STATE.kernel];
            };

            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            // Convolution 활성화/비활성화
            folder.addBinding(TEST_STATE, 'Convolution').on('change', (v) => {
                if (v.value) {
                    const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
                    targetView.postEffectManager.addEffect(effect);
                    updateEffectKernel();
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }

                typeControl.disabled = !v.value || TEST_STATE.useCustomKernel;
                useCustomBinding.disabled = !v.value;
                customMatrixFolder.hidden = !v.value || !TEST_STATE.useCustomKernel;
            });

            // 필터 타입 선택
            const typeControl = folder.addBinding(TEST_STATE, 'kernel', {
                label: 'Kernel Preset',
                options: {
                    Normal: 'NORMAL',
                    Sharpen: 'SHARPEN',
                    Blur: 'BLUR',
                    Edge: 'EDGE',
                    Emboss: 'EMBOSS',
                },
            }).on('change', (v) => {
                const preset = convolutionMatrices[v.value];
                for (let i = 0; i < 12; i++) {
                    TEST_STATE.customMatrix[i] = preset[i];
                }
                updateEffectKernel();
                pane.refresh();
            });

            // Custom Kernel 활성화
            const useCustomBinding = folder.addBinding(TEST_STATE, 'useCustomKernel', {label: 'Use Custom Kernel'}).on('change', (v) => {
                typeControl.disabled = v.value;
                customMatrixFolder.hidden = !v.value;
                updateEffectKernel();
            });

            // Custom Kernel Matrix 설정
            const customMatrixFolder = folder.addFolder({title: 'Custom Kernel (3x3)', expanded: true, hidden: true});
            for (let i = 0; i < 3; i++) {
                const rowFolder = customMatrixFolder.addFolder({title: `Row ${i + 1}`, expanded: true});
                for (let j = 0; j < 3; j++) {
                    const idx = i * 4 + j;
                    rowFolder.addBinding(TEST_STATE.customMatrix, idx, {
                        label: `Col ${j + 1}`,
                        min: -5,
                        max: 5,
                        step: 0.01,
                    }).on('change', updateEffectKernel);
                }
            }

            // 초기 상태 동기화
            updateEffectKernel();
        }
    });
};