import * as RedGPU from "../../../../../dist/index.js?t=1778922031603";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778922031603";

/**
 * [KO] BRDF LUT 테스트 예제
 * [EN] BRDF LUT Test Example
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    async (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        // [KO] BRDF LUT 전용 텍스처 생성
        // [EN] Create a texture dedicated to BRDF LUT
        const texture = new RedGPU.Resource.CoreIBL.BRDFLUTTexture(redGPUContext);

        // [KO] 획득한 GPUTexture를 화면에 표시하기 위해 Mesh 생성
        // [EN] Create Mesh to display the acquired GPUTexture on the screen
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Plane(redGPUContext),
            new RedGPU.Material.BitmapMaterial(redGPUContext)
        );
        mesh.scaleX = 5;
        mesh.scaleY = 5;

        mesh.material.diffuseTexture = texture;
        scene.addChild(mesh);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
