import * as RedGPU from "../../../../../dist/index.js?t=1781143364605";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781143364605";

/**
 * [KO] Skybox Transition 예제
 * [EN] Skybox Transition example
 *
 * [KO] 스카이박스 간의 부드러운 페이드 전환 효과를 시연합니다.
 * [EN] Demonstrates smooth fade transition effects between skyboxes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] 테스트를 위한 다양한 텍스처 옵션 정의
// [EN] Define various texture options for testing
const textureOptions = [
    {
        name: 'Cube Texture',
        type: 'cube',
        luminance: 25000,
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
        luminance: 30000,
        path: '../../../../assets/hdr/Cannon_Exterior.hdr'
    },
    {
        name: 'HDR - Field',
        type: 'hdr',
        luminance: 35000,
        path: '../../../../assets/hdr/field.hdr'
    },
    {
        name: 'HDR - Pisa',
        type: 'hdr',
        luminance: 35000,
        path: '../../../../assets/hdr/pisa.hdr'
    }
];

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

        // 3. [KO] 초기 스카이박스 생성 및 적용
        // [EN] Create and Apply Initial Skybox
        const initialOption = textureOptions[0];
        const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, initialOption.paths);
        const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
        skybox.luminance = initialOption.luminance;
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
 * [KO] 텍스처 옵션에 따라 적절한 텍스처 리소스를 생성합니다.
 * [EN] Creates appropriate texture resources based on texture options.
 */
const createTexture = (redGPUContext, option) => {
    if (option.type === 'cube') {
        return new RedGPU.Resource.CubeTexture(redGPUContext, option.paths);
    } else {
        const ibl = new RedGPU.Resource.IBL(redGPUContext, option.path);
        return ibl.environmentTexture;
    }
};

/**
 * [KO] 실시간 전환 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time transition control.
 */
const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            // [KO] 트랜지션 설정 폴더
            // [EN] Transition Settings Folder
            const transitionFolder = pane.addFolder({
                title: 'Skybox Transition',
                expanded: true
            });

            const currentTextureData = {
                current: textureOptions[0].name,
                transitionDuration: 300
            };

            // [KO] 전환 지속 시간 조절
            // [EN] Transition Duration Control
            transitionFolder.addBinding(currentTextureData, 'transitionDuration', {
                min: 100,
                max: 3000,
                step: 100,
                label: 'Duration (ms)'
            });

            transitionFolder.addBinding(currentTextureData, 'current', {
                readonly: true,
                label: 'Current Asset'
            });

            // [KO] 각 텍스처별 트랜지션 버튼 생성
            // [EN] Create transition buttons for each texture
            const transitionButtons = [];

            textureOptions.forEach((option) => {
                const button = transitionFolder.addButton({
                    title: `→ ${option.name}`,
                    disabled: currentTextureData.current === option.name
                }).on('click', () => {
                    const newTexture = createTexture(redGPUContext, option);
                    const duration = currentTextureData.transitionDuration;

                    // [KO] 🎬 스카이박스 전환 실행
                    // [EN] 🎬 Execute Skybox Transition
                    view.skybox.transition(newTexture, duration);

                    // [KO] 💡 휘도(Luminance) 애니메이션 (전환 시간에 맞춰 보간)
                    // [EN] 💡 Luminance Animation (Interpolate according to transition time)
                    const startLuminance = view.skybox.luminance;
                    const targetLuminance = option.luminance;
                    const startTime = performance.now();

                    const animateLuminance = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // [KO] 선형 보간 적용
                        // [EN] Apply linear interpolation
                        view.skybox.luminance = startLuminance + (targetLuminance - startLuminance) * progress;
                        
                        // [KO] GUI 수치 실시간 갱신
                        // [EN] Refresh GUI values in real-time
                        pane.refresh();

                        if (progress < 1) {
                            requestAnimationFrame(animateLuminance);
                        }
                    };
                    requestAnimationFrame(animateLuminance);

                    currentTextureData.current = option.name;
                    updateTransitionButtonStates(option.name);
                });

                transitionButtons.push({ button, option });
            });

            /**
             * [KO] 현재 선택된 옵션에 따라 버튼 활성화 상태를 업데이트합니다.
             * [EN] Updates button enabled states based on the currently selected option.
             */
            function updateTransitionButtonStates(currentTextureName) {
                transitionButtons.forEach(({button, option}) => {
                    button.disabled = (option.name === currentTextureName);
                });
                pane.refresh();
            }

            // [KO] 기본 스카이박스 속성 제어 폴더
            // [EN] Basic SkyBox Properties Control Folder
            const folder = pane.addFolder({title: 'SkyBox Control', expanded: true});
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};
