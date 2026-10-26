import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Skybox 예제
 * [EN] Skybox example
 *
 * [KO] 6개의 이미지를 사용하는 큐브 텍스처(CubeTexture)를 통해 배경 스카이박스를 생성하고 제어하는 방법을 시연합니다.
 * [EN] Demonstrates how to create and control a background skybox using a CubeTexture with 6 images.
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

        // [KO] 6면 큐브 텍스처 기반 스카이박스 생성 및 적용
        // [EN] Create and apply a skybox based on a 6-face CubeTexture
        view.skybox = createSkybox(redGPUContext);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSkybox = (redGPUContext) => {
    const skyboxImagePaths = [
        "../../../assets/skybox/px.jpg",
        "../../../assets/skybox/nx.jpg",
        "../../../assets/skybox/py.jpg",
        "../../../assets/skybox/ny.jpg",
        "../../../assets/skybox/pz.jpg",
        "../../../assets/skybox/nz.jpg",
    ];

    createImagePreview(skyboxImagePaths);

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

const createImagePreview = (imagePaths) => {
    const container = document.createElement("div");
    container.className = "skybox-preview";
    document.body.appendChild(container);

    imagePaths.forEach((path) => {
        const img = document.createElement("img");
        img.src = path;
        img.alt = path;
        container.appendChild(img);
    });
};

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            const folder = pane.addFolder({title: 'SkyBox', expanded: true});
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};
