import * as RedGPU from "../../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] Alpha Blend Mode Test 예제
 * [EN] Alpha Blend Mode Test example
 *
 * [KO] GLTF 알파 블렌드 모드(Alpha Blend Mode) 테스트 모델을 로드하고 렌더링합니다.
 * [EN] Loads and renders the GLTF Alpha Blend Mode Test model.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        // [KO] GLTF 모델 로드 및 화면 중앙 맞춤
        // [EN] Load GLTF model and fit to screen center
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AlphaBlendModeTest/glTF-Binary/AlphaBlendModeTest.glb',
            (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, view);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};
