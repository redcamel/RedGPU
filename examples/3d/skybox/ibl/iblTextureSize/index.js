import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] IBL Texture Size 예제
 * [EN] IBL Texture Size example
 *
 * [KO] IBL 텍스처 크기에 따른 렌더링 품질 차이를 비교합니다.
 * [EN] Compares rendering quality based on IBL texture size.
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
        const scene2 = new RedGPU.Display.Scene();

        // ============================================
        // 뷰 생성 및 설정
        // ============================================

        // 일반 뷰 생성 (Top/Left)
        const viewBasic = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        )
        viewBasic.ibl = ibl;
        viewBasic.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewBasic);

        // 커스텀 뷰 생성 (Bottom/Right, 저해상도 IBL)
        const viewCustom = new RedGPU.Display.View3D(redGPUContext, scene2, controller);
        const ibl_adjustSize = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            1024, 16
        )
        viewCustom.ibl = ibl_adjustSize;
        viewCustom.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl_adjustSize.environmentTexture);
        redGPUContext.addView(viewCustom);

        // ============================================
        // 씬 설정
        // ============================================

        // 조명 추가 (각 씬에 별도 추가)
        const light1 = new RedGPU.Light.DirectionalLight();
        const light2 = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(light1);
        scene2.lightManager.addDirectionalLight(light2);

        // 3D 모델 로드
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareMetallic/glTF-Binary/CompareMetallic.glb';
        loadGLTF(redGPUContext, scene, modelUrl);
        loadGLTF(redGPUContext, scene2, modelUrl);

        // ============================================
        // 레이아웃 설정
        // ============================================

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768; // Helper의 기준과 동일하게 설정
            if (isNarrow) {
                // 세로형 분할
                viewBasic.setSize('100%', '50%');
                viewBasic.setPosition(0, 0);         // 상단 (Basic)
                viewCustom.setSize('100%', '50%');
                viewCustom.setPosition(0, '50%');     // 하단 (Custom)
            } else {
                // 가로형 분할
                viewBasic.setSize('50%', '100%');
                viewBasic.setPosition(0, 0);         // 좌측 (Basic)
                viewCustom.setSize('50%', '100%');
                viewCustom.setPosition('50%', 0);     // 우측 (Custom)
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
        renderTestPane(redGPUContext, container);
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
const renderTestPane = async (redGPUContext, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'Custom IBL Texture Size 16 * 16',
            normalTitle: 'Basic IBL Texture Size 512 * 512',
            targetContainer: container
        }
    });
};
