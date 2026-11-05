import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] USD Shader Ball 예제
 * [EN] USD Shader Ball example
 *
 * [KO] 투과(Transmission)와 볼륨(Volume) 등 고급 PBR 재질 속성을 검증하기 위한 표준 USD 셰이더 볼 모델을 렌더링합니다.
 * [EN] Renders the standard USD Shader Ball model designed to showcase and test advanced PBR material properties including transmission and volume.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        view.builtInEffectManager.useBloom = true;

        // [KO] USDShaderBallForGltf 모델 로드
        // [EN] Load USDShaderBallForGltf model
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/USDShaderBallForGltf/glTF-Binary/USDShaderBallForGltf.glb';
        loadGLTF(view, MODEL_URL);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadGLTF = (view, url) => {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh;
            scene.addChild(mesh);
            RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
        },
        RedGPUExampleHelper.loadingProgressInfoHandler
    );
};

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};
