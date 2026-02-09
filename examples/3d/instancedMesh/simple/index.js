import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Instanced Mesh (Simple) 예제
 * [EN] Instanced Mesh (Simple) example
 *
 * [KO] 기본적인 인스턴싱 메시 생성 및 렌더링 방법을 보여줍니다.
 * [EN] Demonstrates basic instanced mesh creation and rendering.
 */

// 2. Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const light = new RedGPU.Light.DirectionalLight()
        scene.lightManager.addDirectionalLight(light)

        const texture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        const skyboxTexture = new RedGPU.Resource.CubeTexture(
            redGPUContext,
            [
                "../../../assets/skybox/px.jpg", // Positive X
                "../../../assets/skybox/nx.jpg", // Negative X
                "../../../assets/skybox/py.jpg", // Positive Y
                "../../../assets/skybox/ny.jpg", // Negative Y
                "../../../assets/skybox/pz.jpg", // Positive Z
                "../../../assets/skybox/nz.jpg", // Negative Z
            ]
        );
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, skyboxTexture);
        view.grid = true

        createTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // Logic for every frame goes here
            // 매 프레임마다 실행될 로직 추가
            if (scene.children[0]) {
                // scene.children[0].rotationY += 0.001;
            }
        };
        renderer.start(redGPUContext, render);

    },
    (failReason) => {
        // Show the error if initialization fails
        // 초기화 실패 시 에러 표시
        console.error('초기화 실패:', failReason);

        // Create an element for the error message
        // 에러 메시지 표시용 요소 생성
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;

        // Append the error message to the document body
        // 문서 본문에 에러 메시지 추가
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트 씬을 생성하고 GUI를 설정합니다.
 * [EN] Creates the test scene and sets up the GUI.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {RedGPU.Material.PhongMaterial} material
 */
async function createTest(redGPUContext, scene, material) {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985');

    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770625511985");
    setDebugButtons(RedGPU, redGPUContext);

    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : RedGPU.Display.InstancingMesh.getLimitSize();
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;
    const mesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Plane(redGPUContext),
        material
    );

    // mesh.primitiveState.cullMode = 'none';

    scene.addChild(mesh);

    const initializeInstances = () => {
        for (let i = 0; i < mesh.instanceCount; i++) {
            if (mesh.instanceChildren[i].x === 0) {
                mesh.instanceChildren[i].setPosition(
                    Math.random() * 900 - 450,
                    Math.random() * 900 - 450,
                    Math.random() * 900 - 450
                );
                mesh.instanceChildren[i].setScale(Math.random() * 2 + 1);
                mesh.instanceChildren[i].setRotation(
                    Math.random() * 360,
                    Math.random() * 360,
                    Math.random() * 360
                );
            }

            // mesh.instanceChildren[i].opacity = Math.random();

        }
    };

    initializeInstances();

    const pane = new Pane();
    pane.addBinding(mesh, 'instanceCount', {min: 100, max: maxInstanceCount, step: 1})
        .on('change', initializeInstances);
    pane.addBinding({maxInstanceCount: maxInstanceCount}, 'maxInstanceCount', {
        readonly: true,
        format: (v) => `${Math.floor(v).toLocaleString()}`
    });
}