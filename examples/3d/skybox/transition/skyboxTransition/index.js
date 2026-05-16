import * as RedGPU from "../../../../../dist/index.js?t=1778920968741";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1778920968741";

/**
 * [KO] Skybox Transition 예제
 * [EN] Skybox Transition example
 *
 * [KO] 스카이박스 간의 부드러운 전환 효과를 시연합니다.
 * [EN] Demonstrates smooth transitions between skyboxes.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 🎨 여러 텍스처 옵션 정의
const textureOptions = [
    {
        name: 'Cube Texture',
        type: 'cube',
        luminance: 100,
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
        luminance: 25000,
        path: '../../../../assets/hdr/Cannon_Exterior.hdr'
    },
    {
        name: 'HDR - Field',
        type: 'hdr',
        luminance: 30000,
        path: '../../../../assets/hdr/field.hdr'
    },
    {
        name: 'HDR - Pisa',
        type: 'hdr',
        luminance: 25000,
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

        // [KO] 초기 스카이박스 생성
        const initialOption = textureOptions[0];
        const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, initialOption.paths);
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
        view.skybox.luminance = initialOption.luminance;

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
 * [KO] 텍스처 생성 헬퍼 함수
 * [EN] Texture creation helper function
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
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 */
const renderTestPane = async (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            // 🚀 트랜지션 폴더
            const transitionFolder = pane.addFolder({
                title: 'Skybox Transition',
                expanded: true
            });

            // 현재 상태 데이터
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
            const transitionButtons = [];

            textureOptions.forEach((option) => {
                const button = transitionFolder.addButton({
                    title: `→ ${option.name}`,
                    disabled: currentTextureData.current === option.name
                }).on('click', () => {
                    const newTexture = createTexture(redGPUContext, option);
                    const duration = currentTextureData.transitionDuration;

                    // 🎬 트랜지션 실행
                    view.skybox.transition(newTexture, duration);

                    // 💡 휘도(Luminance) 애니메이션 추가
                    const startLuminance = view.skybox.luminance;
                    const targetLuminance = option.luminance;
                    const startTime = performance.now();

                    const animateLuminance = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // 선형 보간 (Lerp)
                        view.skybox.luminance = startLuminance + (targetLuminance - startLuminance) * progress;
                        
                        // GUI 실시간 업데이트
                        pane.refresh();

                        if (progress < 1) {
                            requestAnimationFrame(animateLuminance);
                        }
                    };
                    requestAnimationFrame(animateLuminance);

                    // UI 업데이트
                    currentTextureData.current = option.name;
                    updateTransitionButtonStates(option.name);

                    console.log(`Transitioning to: ${option.name} (${duration}ms, Luminance: ${option.luminance})`);
                });

                transitionButtons.push({
                    button: button,
                    option: option
                });
            });

            function updateTransitionButtonStates(currentTextureName) {
                transitionButtons.forEach(({button, option}) => {
                    button.disabled = (option.name === currentTextureName);
                });
                pane.refresh();
            }

            // 기본 스카이박스 컨트롤
            const folder = pane.addFolder({title: 'SkyBox Control', expanded: true});
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};