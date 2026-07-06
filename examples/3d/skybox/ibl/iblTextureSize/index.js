import * as RedGPU from "../../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] IBL Texture Size 예제
 * [EN] IBL Texture Size example
 *
 * [KO] IBL 생성 시 텍스처 크기에 따른 시각적 렌더링 품질과 성능의 차이를 비교 시연합니다.
 * [EN] Compares visual rendering quality and performance based on IBL texture size.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;
        controller.tilt = 0;

        // 2. [KO] 두 개의 개별 씬 생성 (비교용)
        // [EN] Create two separate scenes (for comparison)
        const sceneNormal = new RedGPU.Display.Scene();
        const sceneLowRes = new RedGPU.Display.Scene();

        // 3. [KO] 첫 번째 뷰 설정 (일반 해상도 IBL)
        // [EN] Configure first view (Normal resolution IBL)
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, sceneNormal, controller);
        const iblNormal = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        )
        viewNormal.ibl = iblNormal;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, iblNormal.environmentTexture);
        redGPUContext.addView(viewNormal);

        // 4. [KO] 두 번째 뷰 설정 (저해상도 IBL: 16x16)
        // [EN] Configure second view (Low resolution IBL: 16x16)
        const viewLowRes = new RedGPU.Display.View3D(redGPUContext, sceneLowRes, controller);
        const iblLowRes = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            25000, 1024, 16 // [KO] diffuseSize: 1024, specularSize: 16 [EN] diffuseSize: 1024, specularSize: 16
        )
        viewLowRes.ibl = iblLowRes;
        viewLowRes.skybox = new RedGPU.Display.SkyBox(redGPUContext, iblLowRes.environmentTexture);
        redGPUContext.addView(viewLowRes);

        // 5. [KO] 비교용 조명 및 모델 로드
        // [EN] Load lighting and models for comparison
        const directionalLight1 = new RedGPU.Light.DirectionalLight();
        const directionalLight2 = new RedGPU.Light.DirectionalLight();
        sceneNormal.lightManager.addDirectionalLight(directionalLight1);
        sceneLowRes.lightManager.addDirectionalLight(directionalLight2);

        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareMetallic/glTF-Binary/CompareMetallic.glb';
        loadGLTF(redGPUContext, sceneNormal, modelUrl);
        loadGLTF(redGPUContext, sceneLowRes, modelUrl);

        // 6. [KO] 레이아웃 업데이트 (화면 분할)
        // [EN] Update Layout (Split Screen)
        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                // [KO] 모바일: 위/아래 분할 [EN] Mobile: Top/Bottom split
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, 0);
                viewLowRes.setSize('100%', '50%');
                viewLowRes.setPosition(0, '50%');
            } else {
                // [KO] 데스크톱: 좌/우 분할 [EN] Desktop: Left/Right split
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);
                viewLowRes.setSize('50%', '100%');
                viewLowRes.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        // 7. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 8. [KO] 비교 라벨을 포함한 테스트용 GUI 렌더링
        // [EN] Render Test GUI with comparison labels
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
 * [KO] GLTF 모델을 로드하여 장면에 추가합니다.
 * [EN] Loads a GLTF model and adds it to the scene.
 */
function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
        scene.addChild(v.resultMesh);
    });
}

/**
 * [KO] 화면 분할 비교를 위한 전용 GUI를 구성합니다.
 * [EN] Configures a specialized GUI for split-screen comparison.
 */
const renderTestPane = (redGPUContext, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'Custom IBL Texture Size 16 * 16',
            normalTitle: 'Basic IBL Texture Size 512 * 512',
            targetContainer: container
        }
    });
};
