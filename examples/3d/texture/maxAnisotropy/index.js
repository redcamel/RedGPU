import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

/**
 * [KO] Max Anisotropy 예제
 * [EN] Max Anisotropy example
 *
 * [KO] 이방성 필터링(Anisotropic Filtering)의 효과를 시연합니다.
 * [EN] Demonstrates the effect of Anisotropic Filtering.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 100;
        controller.tilt = 75;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        renderTestPane(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
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
 * [KO] 테스트용 GUI와 씬을 구성합니다.
 * [EN] Configures the test GUI and scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const renderTestPane = async (redGPUContext, scene) => {
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770625511985");
    setDebugButtons(RedGPU, redGPUContext);
    const maxAnisotropyValues = [1, 8, 16];
    const spacing = 105;
    const yOffset = 55;

    for (let i = 0; i < maxAnisotropyValues.length; i++) {
        const anisotropy = maxAnisotropyValues[i];
        const x = -((maxAnisotropyValues.length - 1) * spacing) / 2 + spacing * i;

        const createMesh = (texturePath, yPosition) => {
            const geometry = new RedGPU.Primitive.Plane(redGPUContext, 100, 100, 32, 32, 2);
            const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, texturePath);
            const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
            material.diffuseTexture = texture;
            material.diffuseTextureSampler.maxAnisotropy = anisotropy;

            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            mesh.primitiveState.cullMode = 'none';
            mesh.setPosition(x, yPosition, 0);
            scene.addChild(mesh);

            return mesh;
        };

        createMesh("../../../assets/maxAnisotropy/maxAnisotropy.jpg", yOffset);

        const bottomMesh = createMesh("../../../assets/UV_Grid_Sm.jpg", -yOffset);

        const textLabel = new RedGPU.Display.TextField3D(redGPUContext);
        textLabel.text = `maxAnisotropy: ${anisotropy}`;
        textLabel.useBillboardPerspective = false;
        textLabel.useBillboard = true;
        textLabel.worldSize = 4
        textLabel.depthStencilState.depthCompare = 'always';
        textLabel.setPosition(bottomMesh.x, 0, bottomMesh.z);
        scene.addChild(textLabel);
    }
};