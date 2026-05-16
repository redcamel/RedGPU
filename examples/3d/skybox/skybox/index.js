import * as RedGPU from "../../../../dist/index.js?t=1778920968741";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778920968741";

/**
 * [KO] Skybox 예제
 * [EN] Skybox example
 *
 * [KO] 큐브 텍스처를 사용하여 기본 스카이박스를 생성하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a basic skybox using a cube texture.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 스카이박스 생성
        const skybox = createSkybox(redGPUContext);
        view.skybox = skybox;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
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

    createImagePreview(skyboxImagePaths);

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 10000);
};

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            const folder = pane.addFolder({title: 'SkyBox Control', expanded: true});

            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};

/**
 * [KO] 이미지 미리보기를 생성합니다.
 * [EN] Creates image previews.
 * @param {string[]} imagePaths
 */
const createImagePreview = (imagePaths) => {
    const container = document.createElement("div");

    const updatePosition = () => {
        const isNarrow = window.innerWidth <= 768;
        container.style.bottom = isNarrow ? "150px" : "60px";
    };

    Object.assign(container.style, {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "10001",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        gap: "8px",
        padding: "8px",
        borderRadius: "8px",
        pointerEvents: "none",
        alignItems: "center",
        transition: "bottom 0.2s ease-in-out"
    });

    updatePosition();
    window.addEventListener('resize', updatePosition);

    document.body.appendChild(container);

    imagePaths.forEach((path) => {
        const img = document.createElement("img");
        img.src = path;
        img.alt = path;

        Object.assign(img.style, {
            maxWidth: "60px",
            maxHeight: "60px",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
        });

        container.appendChild(img);
    });
};
