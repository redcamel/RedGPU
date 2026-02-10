import * as RedGPU from "../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Spot Light Performance 예제
 * [EN] Spot Light Performance example
 *
 * [KO] 다수의 Spot Light를 렌더링하여 성능을 테스트하는 예제입니다.
 * [EN] Example testing performance by rendering multiple Spot Lights.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 25;
        controller.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.skybox = createSkybox(redGPUContext);
        redGPUContext.addView(view);

        const lights = createSpotLight(scene);
        const mesh = createSampleMeshes(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        let time = 0;
        const render = () => {
            time += 0.016;

            lights.forEach((lightData) => {
                const {light, originalPos, rotationSpeed, orbitRadius} = lightData;
                const angle = time * rotationSpeed;
                const centerX = originalPos.x + Math.sin(angle * 0.3) * 2;
                const centerZ = originalPos.z + Math.cos(angle * 0.5) * 2;
                light.lookAt(centerX, 0, centerZ);
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
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext);
};

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
 * [KO] 다수의 Spot Light를 생성합니다.
 * [EN] Creates multiple Spot Lights.
 * @param {RedGPU.Display.Scene} scene
 * @returns {Array<{light: RedGPU.Light.SpotLight, originalPos: object, rotationSpeed: number, orbitRadius: number}>}
 */
const createSpotLight = (scene) => {
    const intensity = 2;
    const gridSize = 32;
    const spacing = 4;
    const height = 3;
    const lights = [];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const light = new RedGPU.Light.SpotLight('#fff', intensity);
            light.intensity = intensity;

            const x = col * spacing - ((gridSize - 1) * spacing) / 2;
            const z = row * spacing - ((gridSize - 1) * spacing) / 2;
            const y = height;

            light.x = x;
            light.y = y;
            light.z = z;
            light.radius = 5;
            light.innerCutoff = 10;
            light.outerCutoff = Math.random() * 30 + 11;
            light.color.r = Math.floor(Math.random() * 255);
            light.color.g = Math.floor(Math.random() * 255);
            light.color.b = Math.floor(Math.random() * 255);

            light.lookAt(x, 0, z);
            scene.lightManager.addSpotLight(light);

            lights.push({
                light: light,
                originalPos: {x, y, z},
                rotationSpeed: 0.5 + Math.random() * 1.0,
                orbitRadius: 1.0 + Math.random() * 2.0
            });
        }
    }

    return lights;
};

/**
 * [KO] 샘플 메시들을 생성합니다.
 * [EN] Creates sample meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleMeshes = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../../assets/UV_Grid_Sm.jpg'
    );

    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#fff')
    );
    ground.setScale(200);
    ground.y = -0.01;
    scene.addChild(ground);

    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 32);
    const gridSize = 4;
    const spacing = 5;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            const x = col * spacing - ((gridSize - 1) * spacing) / 2;
            const z = row * spacing - ((gridSize - 1) * spacing) / 2;
            const y = 0;

            mesh.setPosition(x, y, z);
            scene.addChild(mesh);
        }
    }
};