import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

/**
 * [KO] Directional Shadow 예제
 * [EN] Directional Shadow example
 *
 * [KO] Directional Light에 의한 그림자 생성 및 설정을 보여줍니다.
 * [EN] Demonstrates shadow generation and configuration by Directional Light.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -15;
        controller.distance = 30;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        view.skybox = createSkybox(redGPUContext);

        addRandomMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            redGPUContext.viewList.forEach(view => {
                const {scene} = view;
                let i = scene.numChildren;
                while (i--) {
                    if (i === 0) continue;
                    let testObj = scene.children[i];
                    testObj.rotationX += 1.5;
                    testObj.rotationY += 1.5;
                    testObj.y += Math.sin(time / 1000 + i * 10) / 10;
                    testObj.rotationZ += 1.5;
                }
            });
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 스카이박스를 생성합니다.
 * [EN] Creates a skybox.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @returns {RedGPU.Display.SkyBox}
 */
const createSkybox = (redGPUContext) => {
    const skyboxImagePaths = [
        "../../../assets/skybox/px.jpg",
        "../../../assets/skybox/nx.jpg",
        "../../../assets/skybox/py.jpg",
        "../../../assets/skybox/ny.jpg",
        "../../../assets/skybox/pz.jpg",
        "../../../assets/skybox/nz.jpg",
    ];

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
    return skybox;
};

/**
 * [KO] 무작위 메시들을 씬에 추가합니다.
 * [EN] Adds random meshes to the scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const addRandomMeshes = (redGPUContext, scene) => {
    const geometries = [
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 16, 16),
        new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),
        new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 6, 16),
        new RedGPU.Primitive.Torus(redGPUContext, ` 1.5, 0.5, 16, 32`),
        new RedGPU.Primitive.TorusKnot(redGPUContext, 0.5, 0.2, 128, 64, 2, 3)
    ];
//tt
    const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000'));
    ground.setScale(200);
    ground.receiveShadow = true;
    scene.addChild(ground);

    for (let i = 0; i < 500; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];

        const x = Math.random() * 150 - 75;
        const y = Math.random() * 3 - 1.5;
        const z = Math.random() * 150 - 75;

        const material = new RedGPU.Material.PhongMaterial(redGPUContext, getRandomHexValue());

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setScale(Math.max(Math.random() * 1.5, 0.5));
        mesh.setPosition(x, y, z);
        mesh.rotationX = Math.random() * 360;
        mesh.rotationY = Math.random() * 360;
        mesh.rotationZ = Math.random() * 360;
        mesh.castShadow = true;

        scene.addChild(mesh);
    }

    renderTestPane(redGPUContext, scene);
};

/**
 * [KO] 무작위 16진수 색상 값을 반환합니다.
 * [EN] Returns a random hex color value.
 * @returns {string}
 */
const getRandomHexValue = () => {
    const randomColor = Math.floor(Math.random() * 0xffffff);
    return `#${randomColor.toString(16).padStart(6, "0")}`;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770625511985");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    const {shadowManager} = scene;
    const {directionalShadowManager} = shadowManager;

    pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
        min: 128,
        max: 2048,
        step: 1
    }).on("change", (ev) => {
        directionalShadowManager.shadowDepthTextureSize = ev.value;
    });
};