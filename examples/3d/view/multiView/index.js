import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

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
        // [KO] 3개의 독립된 View3D 생성 및 씬별 배경 색상 구분
        // [EN] Create 3 independent View3D instances with distinct scene background colors
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#1a1f2c');
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const controller2 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene2 = new RedGPU.Display.Scene();
        scene2.useBackgroundColor = true;
        scene2.backgroundColor.setColorByHEX('#2c1a24');
        const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);
        view2.axis = true;
        view2.grid = true;
        redGPUContext.addView(view2);

        const controller3 = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene3 = new RedGPU.Display.Scene();
        scene3.useBackgroundColor = true;
        scene3.backgroundColor.setColorByHEX('#1a2c24');
        const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);
        view3.axis = true;
        view3.grid = true;
        redGPUContext.addView(view3);

        // [KO] 방식 1: setSize / setPosition 메서드로 크기·위치 일괄 지정 ('%' 및 숫자 혼합 가능)
        // [EN] Method 1: Batch-configure size and position via setSize / setPosition ('%' and numbers)
        view.setSize('50%', '100%');
        view.setPosition(0, 0);

        // [KO] 방식 2: width, height, x, y 개별 프로퍼티로 퍼센트('%') 지정
        // [EN] Method 2: Assign individual width, height, x, y properties using percentage ('%')
        view2.width = '50%';
        view2.height = '100%';
        view2.x = '50%';
        view2.y = '0%';

        // [KO] 방식 3: 픽셀 문자열('px') 또는 숫자(px)로 고정 크기 지정
        // [EN] Method 3: Specify fixed size using pixel string ('px') or number (px)
        view3.setSize('200px', 200);

        addMeshesToScene(redGPUContext, scene);
        addMeshesToScene(redGPUContext, scene2);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 세 번째 뷰의 화면 위치를 퍼센트('%') 단위로 동적 회전 이동
            // [EN] Dynamically move the third view's position in a circular path using percentage ('%')
            view3.setPosition(
                `${Math.sin(time / 1000) * 25 + 50}%`,
                `${Math.cos(time / 1000) * 25 + 50}%`
            );
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
