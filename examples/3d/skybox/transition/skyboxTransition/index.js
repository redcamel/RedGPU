import * as RedGPU from "../../../../../dist/index.js?t=1769835266959";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Skybox Transition 예제
 * [EN] Skybox Transition example
 *
 * [KO] 스카이박스 간의 부드러운 전환 효과를 시연합니다.
 * [EN] Demonstrates smooth transitions between skyboxes.
 */

// 🎨 여러 텍스처 옵션 정의
const textureOptions = [
    {
        name: 'Cube Texture',
        type: 'cube',
        paths: [
            "../../../../assets/skybox/px.jpg",
            "../../../../assets/skybox/nx.jpg",
            "../../../../assets/skybox/py.jpg",
            "../../../../assets/skybox/ny.jpg",
            "../../../../assets/skybox/pz.jpg",
            "../../../../assets/skybox/nz.jpg",
        ]
    },
    {
        name: 'HDR - Cannon Exterior',
        type: 'hdr',
        path: '../../../../assets/hdr/Cannon_Exterior.hdr'
    },
    {
        name: 'HDR - Field',
        type: 'hdr',
        path: '../../../../assets/hdr/field.hdr'
    },
    {
        name: 'HDR - Pisa',
        type: 'hdr',
        path: '../../../../assets/hdr/pisa.hdr'
    }
];

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

        renderTestPane(view, redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 초기 스카이박스를 생성합니다.
 * [EN] Creates the initial skybox.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @returns {RedGPU.Display.SkyBox}
 */
const createSkybox = (redGPUContext) => {
    // 기본 큐브 텍스처로 시작
    const initialOption = textureOptions[0];
    const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, initialOption.paths);
    return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

// 📦 텍스처 생성 헬퍼 함수
const createTexture = (redGPUContext, option) => {
    if (option.type === 'cube') {
        return new RedGPU.Resource.CubeTexture(redGPUContext, option.paths);
    } else {
        const ibl = new RedGPU.Resource.IBL(redGPUContext, option.path);
        return ibl.environmentTexture;
    }
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} targetView
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (targetView, redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959");
    const pane = new Pane();
    const {
        createFieldOfView,
        createSkyBoxHelper
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1769835266959");

    createFieldOfView(pane, targetView.camera);
    createSkyBoxHelper(pane, targetView);

    // 🚀 트랜지션 폴더
    const transitionFolder = pane.addFolder({
        title: 'Skybox Transition',
        expanded: true
    });

    // 현재 텍스처 표시
    const currentTextureData = {
        current: textureOptions[0].name,
        transitionDuration: 300
    };
    transitionFolder.addBinding(currentTextureData, 'transitionDuration', {
        min: 100,
        max: 3000,
        step: 100
    });
    transitionFolder.addBinding(currentTextureData, 'current', {
        readonly: true,
        label: 'Current'
    });

    // 🎯 각 텍스처별 트랜지션 버튼
    const transitionButtons = []; // 버튼 참조 저장용 배열

    textureOptions.forEach((option, index) => {
        if (index === 0) return; // 첫 번째는 이미 로드된 상태

        const button = transitionFolder.addButton({
            title: `→ ${option.name}`,
            disabled: currentTextureData.current === option.name // 현재 텍스처와 같으면 비활성화
        }).on('click', () => {
            const newTexture = createTexture(redGPUContext, option);

            // 🎬 트랜지션 실행
            targetView.skybox.transition(newTexture, currentTextureData.transitionDuration);

            // 이전 버튼 활성화
            updateTransitionButtonStates(currentTextureData.current);

            // UI 업데이트
            setTimeout(() => {
                currentTextureData.current = option.name;
                // 새로운 현재 텍스처에 해당하는 버튼 비활성화
                updateTransitionButtonStates(option.name);
            }, currentTextureData.transitionDuration);

            console.log(`Transitioning to: ${option.name} (${currentTextureData.transitionDuration}ms)`);
        });

        // 버튼과 옵션 정보를 함께 저장
        transitionButtons.push({
            button: button,
            option: option
        });
    });

    function updateTransitionButtonStates(currentTextureName) {
        transitionButtons.forEach(({button, option}) => {
            button.disabled = (option.name === currentTextureName);
        });
    }

};