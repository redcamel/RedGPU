import * as RedGPU from "../../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] IBL Test 예제
 * [EN] IBL Test example
 *
 * [KO] HDR 이미지를 사용한 이미지 기반 조명(Image-Based Lighting) 효과를 다양한 복잡한 모델을 통해 테스트합니다.
 * [EN] Tests Image-Based Lighting (IBL) effects using HDR images across various complex models.
 */

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] PBR 재질 특성 확인을 위한 다중 glTF 모델 로드
        // [EN] Load multiple glTF models to verify PBR material characteristics under IBL
        MODEL_LIST.forEach(config => loadModel(view, config));

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadModel = (view, config) => {
    const {redGPUContext, scene} = view;

    new RedGPU.GLTFLoader(
        redGPUContext,
        config.url,
        (loaderResult) => {
            const mesh = scene.addChild(loaderResult.resultMesh);
            if (config.scale) mesh.setScale(config.scale);
            if (config.position) {
                const [x, y, z] = config.position;
                mesh.setPosition(x, y, z);
            }
        },
        (progressInfo) => {
            RedGPUExampleHelper.loadingProgressInfoHandler(progressInfo);
        }
    );
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true
    });
};
