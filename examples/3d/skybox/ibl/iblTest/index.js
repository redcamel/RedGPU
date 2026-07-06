import * as RedGPU from "../../../../../dist/index.js?t=1783324689986";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783324689986";

/**
 * [KO] IBL Test 예제
 * [EN] IBL Test example
 *
 * [KO] HDR 이미지를 사용한 이미지 기반 조명(Image-Based Lighting) 효과를 다양한 복잡한 모델을 통해 테스트합니다.
 * [EN] Tests Image-Based Lighting (IBL) effects using HDR images across various complex models.
 */

// [KO] 로드할 모델 리스트 정의
// [EN] List of models to load
const MODEL_LIST = [
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EnvironmentTest/glTF/EnvironmentTest.gltf'
    },
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TransmissionTest/glTF-Binary/TransmissionTest.glb',
        scale: 5
    },
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlassHurricaneCandleHolder/glTF-Binary/GlassHurricaneCandleHolder.glb',
        scale: 10,
        position: [4, -1.5, 0.5]
    },
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb',
        scale: 20,
        position: [7, 0, 0]
    },
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF-Binary/ClearcoatWicker.glb',
        scale: 3,
        position: [-6, -1.5, 0]
    },
    {
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF-Binary/Corset.glb',
        scale: 40,
        position: [0, -2, 2]
    }
];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 4. [KO] 정의된 모델 리스트 로드 시작
        // [EN] Start loading defined model list
        MODEL_LIST.forEach(config => loadModel(view, config));

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] GLTF/GLB 모델을 로드하고 설정을 적용합니다.
 * [EN] Loads a GLTF/GLB model and applies its settings.
 */
function loadModel(view, config) {
    const {redGPUContext, scene} = view;

    new RedGPU.GLTFLoader(
        redGPUContext,
        config.url,
        (loaderResult) => {
            const mesh = scene.addChild(loaderResult.resultMesh);

            // [KO] 설정된 스케일 및 위치 적용
            // [EN] Apply scale and position settings
            if (config.scale) mesh.setScale(config.scale);
            if (config.position) {
                const [x, y, z] = config.position;
                mesh.setPosition(x, y, z);
            }
        },
        (progressInfo) => {
            // [KO] 로딩 진행 상태 헬퍼 호출
            // [EN] Call loading progress helper
            RedGPUExampleHelper.loadingProgressInfoHandler(progressInfo);
        }
    );
}

/**
 * [KO] 실시간 IBL 및 스카이박스 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time IBL and SkyBox control.
 */
function renderTestPane(redGPUContext) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true
    });
}
