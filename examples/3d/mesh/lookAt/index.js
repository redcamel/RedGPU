import * as RedGPU from "../../../../dist/index.js?t=1770637396475";

/**
 * [KO] Mesh LookAt 예제
 * [EN] Mesh LookAt example
 *
 * [KO] 메시가 특정 목표 지점을 바라보도록 하는 LookAt 기능을 보여줍니다.
 * [EN] Demonstrates the LookAt function that makes a mesh face a specific target point.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const targetPosition = [0, 0, 0];
        const targetObject = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 0.2),
            new RedGPU.Material.ColorMaterial(redGPUContext, 0xff0000)
        );
        scene.addChild(targetObject);

        const render = (time) => {
            scene.children.forEach(v => {
                targetPosition[0] = Math.sin(time / 1000) * 5;
                targetPosition[1] = Math.cos(time / 1000) * 5;
                targetPosition[2] = Math.sin(time / 1000) * 5;
                targetObject.setPosition(...targetPosition);
                v.lookAt(...targetPosition);
            });
        };
        renderer.start(redGPUContext, render);
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
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770637396475");
    setDebugButtons(RedGPU, redGPUContext);
};

/**
 * [KO] 샘플 메시들을 생성합니다.
 * [EN] Creates sample meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleMesh = (redGPUContext, scene) => {
    let i = 200;
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png')
    );
    const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00');

    while (i--) {
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 2);

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        const mesh2 = new RedGPU.Display.Mesh(redGPUContext, geometry, material2);

        mesh2.setScale(0.25);
        mesh2.setPosition(0, 0.75, 0);
        mesh.addChild(mesh2);
        mesh.setPosition(Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
        scene.addChild(mesh);
    }
};