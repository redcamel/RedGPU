import * as RedGPU from "../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781143364605";

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
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 스카이박스 생성 및 적용
        // [EN] Create and Apply Skybox
        const skybox = createSkybox(redGPUContext);
        view.skybox = skybox;

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
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
 * [KO] 6개의 자산을 사용하여 스카이박스를 생성합니다.
 * [EN] Creates a skybox using 6 assets.
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

    // [KO] 소스 이미지 미리보기 UI 생성
    // [EN] Create source image preview UI
    createImagePreview(skyboxImagePaths);

    // [KO] 큐브 텍스처 생성 및 스카이박스 초기화
    // [EN] Create CubeTexture and initialize SkyBox
    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 25000);
};

/**
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            const folder = pane.addFolder({title: 'SkyBox Control', expanded: true});

            // [KO] 블러 효과 조절
            // [EN] Blur Control
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            
            // [KO] 강도 배율 조절
            // [EN] Intensity Multiplier Control
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            
            // [KO] 투명도 조절
            // [EN] Opacity Control
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            
            // [KO] 루미넌스(밝기) 조절
            // [EN] Luminance Control
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};

/**
 * [KO] 사용된 소스 이미지들을 화면 중앙 하단에 미리보기로 표시합니다.
 * [EN] Displays the source images used as previews at the bottom center of the screen.
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
