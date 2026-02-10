import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Point Light Performance 예제
 * [EN] Point Light Performance example
 *
 * [KO] 다수의 Point Light를 렌더링하여 성능을 테스트하는 예제입니다.
 * [EN] Example testing performance by rendering multiple Point Lights.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const light = new RedGPU.Light.DirectionalLight();
        light.intensity = 0.1;
        scene.lightManager.addDirectionalLight(light);

        const {lights, initialPositions} = createPointLights(scene, 500);
        createSphereMeshes(redGPUContext, scene, 500);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            animateLights(lights, initialPositions);
        };
        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext);

    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
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
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);
};

/**
 * [KO] 다수의 Point Light를 생성합니다.
 * [EN] Creates multiple Point Lights.
 * @param {RedGPU.Display.Scene} scene
 * @param {number} count
 * @returns {{lights: Array<RedGPU.Light.PointLight>, initialPositions: Array<{x: number, y: number, z: number}>}}
 */
const createPointLights = (scene, count) => {
    const lights = [];
    const initialPositions = [];

    for (let i = 0; i < count; i++) {
        const radius = Math.random() * 7.5 + 1;
        const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

        const light = new RedGPU.Light.PointLight();
        light.color.setColorByRGBString(color);
        light.radius = radius;

        const x = Math.random() * 70 - 35;
        const y = Math.random() * 70 - 35;
        const z = Math.random() * 70 - 35;
        light.x = x;
        light.y = y;
        light.z = z;

        initialPositions.push({x, y, z});
        scene.lightManager.addPointLight(light);
        lights.push(light);
    }
    return {lights, initialPositions};
};

/**
 * [KO] 구체 메시들을 생성합니다.
 * [EN] Creates sphere meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {number} count
 */
const createSphereMeshes = (redGPUContext, scene, count) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        "../../../assets/UV_Grid_Sm.jpg"
    );

    const gridSize = 70;
    const cubeSize = 1;
    const perRow = Math.cbrt(count);
    const spacing = gridSize / perRow;
    const halfGrid = gridSize / 2;
    const halfCube = cubeSize / 2;

    for (let x = 0; x < perRow; x++) {
        for (let y = 0; y < perRow; y++) {
            for (let z = 0; z < perRow; z++) {
                let cubePosX = x * spacing - halfGrid + halfCube;
                let cubePosY = y * spacing - halfGrid + halfCube;
                let cubePosZ = z * spacing - halfGrid + halfCube;
                const segment = Math.floor(Math.random() * 28 + 4);
                let geometry = new RedGPU.Primitive.Sphere(redGPUContext, Math.random() * 3, segment, segment, segment);

                let mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
                mesh.x = cubePosX;
                mesh.y = cubePosY;
                mesh.z = cubePosZ;
                mesh.setRotation(Math.random() * 360);

                scene.addChild(mesh);
            }
        }
    }
};

/**
 * [KO] 라이트들을 애니메이션합니다.
 * [EN] Animates the lights.
 * @param {Array<RedGPU.Light.PointLight>} lights
 * @param {Array<{x: number, y: number, z: number}>} initialPositions
 */
const animateLights = (lights, initialPositions) => {
    const time = performance.now() * 0.001;

    lights.forEach((light, index) => {
        const basePosition = initialPositions[index];
        light.x = basePosition.x + Math.sin(time + index) * 10;
        light.y = basePosition.y + Math.cos(time + index) * 10;
        light.z = basePosition.z + Math.sin(time + 2 * index) * 10;
    });
};