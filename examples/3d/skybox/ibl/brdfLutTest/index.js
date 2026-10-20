import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] BRDF LUT 전용 텍스처 생성 및 확인용 평면 메시 배치
        // [EN] Create BRDF LUT texture and place a plane mesh for visualization
        const texture = new RedGPU.Resource.CoreIBL.BRDFLUTTexture(redGPUContext);
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Plane(redGPUContext),
            new RedGPU.Material.BitmapMaterial(redGPUContext, texture)
        );
        mesh.setScale(5);
        scene.addChild(mesh);

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
    new RedGPUExampleHelper(redGPUContext);
};
