import * as RedGPU from "../../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] IBL Test 예제
 * [EN] IBL Test example
 *
 * [KO] HDR 이미지를 사용한 이미지 기반 조명(IBL)을 테스트하는 예제입니다.
 * [EN] Example testing Image Based Lighting (IBL) using HDR images.
 */

/* [KO] 로드할 모델 리스트 및 설정 [EN] List of models to load and their settings */
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
        // [KO] 카메라 컨트롤러 설정 [EN] Setup camera controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // [KO] 씬 및 뷰 생성 [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 렌더러 시작 [EN] Start renderer
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {});

        // [KO] 모델 로드 실행 [EN] Execute model loading
        MODEL_LIST.forEach(config => loadModel(view, config));

        // [KO] 테스트용 GUI 렌더링 [EN] Render GUI for testing
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
 * [KO] 모델을 로드하고 설정을 적용합니다.
 * [EN] Loads a model and applies its settings.
 * @param {RedGPU.Display.View3D} view
 * @param {object} config
 */
function loadModel(view, config) {
    const {redGPUContext, scene} = view;

    new RedGPU.GLTFLoader(
        redGPUContext,
        config.url,
        (v) => {
            const mesh = scene.addChild(v.resultMesh);

            // [KO] 설정값 적용 [EN] Apply settings
            if (config.scale) mesh.setScale(config.scale);
            if (config.position) {
                const [x, y, z] = config.position;
                mesh.x = x;
                mesh.y = y;
                mesh.z = z;
            }
        },
        (info) => {
            RedGPUExampleHelper.loadingProgressInfoHandler(info);
        }
    );
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} view
 */
function renderTestPane(redGPUContext) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true
    });
}
