import * as RedGPU from "../../../../dist/index.js?t=1770625511985";

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
        view.skybox = createSkybox(redGPUContext);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(view);
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
        "../../../../assets/skybox/px.jpg",
        "../../../../assets/skybox/nx.jpg",
        "../../../../assets/skybox/py.jpg",
        "../../../../assets/skybox/ny.jpg",
        "../../../../assets/skybox/pz.jpg",
        "../../../../assets/skybox/nz.jpg",
    ];

    createImagePreview(skyboxImagePaths);

    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (targetView) => {
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985" );
    const pane = new Pane();
    const {
        createFieldOfView,
        createSkyBoxHelper,
        setDebugButtons
    } = await import( "../../../exampleHelper/createExample/panes/index.js?t=1770625511985" );
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera)
    createSkyBoxHelper(pane, targetView)
};

/**
 * [KO] 이미지 미리보기를 생성합니다.
 * [EN] Creates image previews.
 * @param {string[]} imagePaths
 */
const createImagePreview = (imagePaths) => {
    const container = document.createElement("div");

    Object.assign(container.style, {
        position: "absolute",
        left: "10px",
        top: "100px",
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.16)",
        gap: "8px",
        padding: "4px",
        borderRadius: "8px"
    });

    document.body.appendChild(container);

    imagePaths.forEach((path) => {
        const img = document.createElement("img");
        img.src = path;
        img.alt = path;

        Object.assign(img.style, {
            maxWidth: "100px",
            maxHeight: "100px",
            borderRadius: "8px"
        });

        container.appendChild(img);
    });
};