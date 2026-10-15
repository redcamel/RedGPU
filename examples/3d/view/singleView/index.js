import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Single View3D 예제
 * [EN] Single View3D example
 *
 * [KO] 단일 View3D 객체를 생성하고 기본 옵션을 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a single View3D object and control its basic options.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();

        // [KO] 단일 3D 뷰(View3D) 생성 및 컨텍스트 등록
        // [EN] Create a single 3D view (View3D) and register to context
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        addMeshesToScene(redGPUContext, scene, 1000);

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

const addMeshesToScene = (redGPUContext, scene, count = 500) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext);

    for (let i = 0; i < count; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(
            Math.random() * 500 - 250,
            Math.random() * 500 - 250,
            Math.random() * 500 - 250
        );
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        viewList: true
    });
};
