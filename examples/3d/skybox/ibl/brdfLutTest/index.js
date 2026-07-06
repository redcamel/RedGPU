import * as RedGPU from "../../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] BRDF LUT 테스트 예제
 * [EN] BRDF LUT Test Example
 *
 * [KO] IBL 시스템의 핵심인 BRDF LUT(Look-Up Table) 텍스처 생성을 테스트하고 시각화합니다.
 * [EN] Tests and visualizes the generation of the BRDF LUT (Look-Up Table) texture, a core component of the IBL system.
 */

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

        // 3. [KO] BRDF LUT 전용 텍스처 생성
        // [EN] Create a texture dedicated to BRDF LUT
        const texture = new RedGPU.Resource.CoreIBL.BRDFLUTTexture(redGPUContext);

        // 4. [KO] 텍스처 확인용 메시 생성
        // [EN] Create Mesh to display the texture
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Plane(redGPUContext),
            new RedGPU.Material.BitmapMaterial(redGPUContext, texture)
        );
        mesh.setScale(5);
        scene.addChild(mesh);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
