import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Multi View3D 예제
 * [EN] Multi View3D example
 *
 * [KO] 하나의 캔버스에 여러 개의 View3D를 배치하고 독립적으로 제어하는 방법을 보여줍니다.
 * [EN] Demonstrates how to arrange and independently control multiple View3D instances on a single canvas.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 3개의 독립된 View3D 생성 및 컨텍스트 등록
        // [EN] Create 3 independent View3D instances and register to context
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene2 = new RedGPU.Display.Scene();
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);
        view2.axis = true;
        view2.grid = true;
        redGPUContext.addView(view2);

        const controller3 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene3 = new RedGPU.Display.Scene();
        const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);
        view3.axis = true;
        view3.grid = true;
        redGPUContext.addView(view3);

        // [KO] 각 뷰의 화면 분할 레이아웃 설정 (퍼센트 단위 지원)
        // [EN] Configure split-screen layout for each view (supports percentage units)
        view.width = '50%';
        view.x = '0%';
        view2.width = '50%';
        view2.x = '50%';
        view3.width = '10%';
        view3.height = '10%';

        addMeshesToScene(redGPUContext, scene);
        addMeshesToScene(redGPUContext, scene2);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 세 번째 뷰의 화면 위치를 동적으로 회전 이동
            // [EN] Dynamically move the third view's position in a circular path
            view3.x = `${Math.sin(time / 1000) * 25 + 50}%`;
            view3.y = `${Math.cos(time / 1000) * 25 + 50}%`;
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

const addMeshesToScene = (redGPUContext, scene, count = 200) => {
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext);

    for (let i = 0; i < count; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setScale(Math.random() * 3 + 1);
        mesh.setPosition(
            Math.random() * 300 - 150,
            Math.random() * 300 - 150,
            Math.random() * 300 - 150
        );
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        viewList: true
    });
};
