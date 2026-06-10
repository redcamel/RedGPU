import * as RedGPU from "../../../../../dist/index.js?t=1781132303147";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781132303147";

/**
 * [KO] Skybox Transition With Noise Texture 예제
 * [EN] Skybox Transition With Noise Texture example
 *
 * [KO] 노이즈 텍스처(SimplexTexture)를 마스크로 사용하여 유기적이고 부드러운 스카이박스 전환 효과를 시연합니다.
 * [EN] Demonstrates organic and smooth skybox transition effects using a noise texture (SimplexTexture) as a mask.
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
 * [KO] 실시간 전환 및 노이즈 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time transition and noise control.
 */
const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            // [KO] 트랜지션 기본 설정 폴더
            // [EN] Basic Transition Settings Folder
            const transitionFolder = pane.addFolder({
                title: 'Skybox Transition',
                expanded: true
            });

            const currentTextureData = {
                current: textureOptions[0].name,
                transitionDuration: 300,
                useTransitionAlphaTexture: true
            };

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

            // [KO] 🌀 노이즈 설정 폴더 (전환 마스크용)
            // [EN] 🌀 Noise Settings Folder (for transition mask)
            const noiseFolder = transitionFolder.addFolder({
                title: 'Noise (Alpha Mask) Settings',
                expanded: true
            });

            // [KO] 노이즈 텍스처 사용 여부 토글
            // [EN] Toggle whether to use noise texture
            const noiseToggle = noiseFolder.addBinding(currentTextureData, 'useTransitionAlphaTexture', {
                label: 'Use Noise Mask'
            }).on('change', (ev) => {
                if (!ev.value) {
                    view.skybox.transitionAlphaTexture = null;
                }
            });

            // [KO] 🎲 노이즈 텍스처 생성 (SimplexTexture)
            // [EN] 🎲 Create Noise Texture (SimplexTexture)
            const noiseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);
            let startTime = performance.now();

            /**
             * [KO] 노이즈 패턴을 현재 시간/설정에 맞춰 렌더링합니다.
             * [EN] Renders noise pattern based on current time/settings.
             */
            const updateNoisePattern = () => {
                if (currentTextureData.useTransitionAlphaTexture) {
                    const currentTime = performance.now();
                    noiseTexture.render(currentTime - startTime);
                }
            };

            // [KO] 노이즈 파라미터 제어 객체
            // [EN] Noise parameters control object
            const noiseSettings = {
                frequency: noiseTexture.frequency,
                amplitude: noiseTexture.amplitude,
                octaves: noiseTexture.octaves,
                persistence: noiseTexture.persistence,
                lacunarity: noiseTexture.lacunarity,
                regenerate: () => {
                    noiseTexture.randomizeSeed();
                    updateNoisePattern();
                }
            };

            const frequencyBinding = noiseFolder.addBinding(noiseSettings, 'frequency', {
                min: 0.1, max: 10, step: 0.1,
                label: 'Frequency',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.frequency = ev.value;
                updateNoisePattern();
            });

            const amplitudeBinding = noiseFolder.addBinding(noiseSettings, 'amplitude', {
                min: 0.1, max: 2, step: 0.1,
                label: 'Amplitude',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.amplitude = ev.value;
                updateNoisePattern();
            });

            const octavesBinding = noiseFolder.addBinding(noiseSettings, 'octaves', {
                min: 1, max: 8, step: 1,
                label: 'Octaves',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.octaves = ev.value;
                updateNoisePattern();
            });

            const persistenceBinding = noiseFolder.addBinding(noiseSettings, 'persistence', {
                min: 0.1, max: 1, step: 0.1,
                label: 'Persistence',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.persistence = ev.value;
                updateNoisePattern();
            });

            const lacunarityBinding = noiseFolder.addBinding(noiseSettings, 'lacunarity', {
                min: 1, max: 4, step: 0.1,
                label: 'Lacunarity',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.lacunarity = ev.value;
                updateNoisePattern();
            });

            const regenerateButton = noiseFolder.addButton({
                title: '🎲 Regenerate Pattern',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('click', noiseSettings.regenerate);

            // [KO] 🌟 노이즈 패턴 프리셋
            // [EN] 🌟 Noise Pattern Presets
            const presetFolder = noiseFolder.addFolder({title: 'Preset Patterns'});
            const presets = [
                {name: '🌊 Smooth Waves', frequency: 2.0, amplitude: 1.0, octaves: 3, persistence: 0.5, lacunarity: 2.0},
                {name: '🔥 Fire Pattern', frequency: 5.0, amplitude: 1.5, octaves: 6, persistence: 0.7, lacunarity: 2.5},
                {name: '☁️ Clouds', frequency: 1.0, amplitude: 0.8, octaves: 4, persistence: 0.4, lacunarity: 1.8},
            ];

            const presetButtons = [];
            presets.forEach(preset => {
                const button = presetFolder.addButton({
                    title: preset.name,
                    disabled: !currentTextureData.useTransitionAlphaTexture
                }).on('click', () => {
                    Object.assign(noiseTexture, preset);
                    Object.assign(noiseSettings, preset);
                    updateNoisePattern();
                    pane.refresh();
                });
                presetButtons.push(button);
            });

            noiseToggle.on('change', (ev) => {
                const isEnabled = ev.value;
                [frequencyBinding, amplitudeBinding, octavesBinding, persistenceBinding, lacunarityBinding, regenerateButton, ...presetButtons].forEach(b => b.disabled = !isEnabled);
            });

            // [KO] 🎯 각 텍스처별 트랜지션 버튼 생성
            // [EN] Create transition buttons for each texture
            const transitionButtons = [];
            textureOptions.forEach((option) => {
                const button = transitionFolder.addButton({
                    title: `→ ${option.name}`,
                    disabled: currentTextureData.current === option.name
                }).on('click', () => {
                    const newTexture = createTexture(redGPUContext, option);
                    const duration = currentTextureData.transitionDuration;

                    // [KO] 🎬 트랜지션 실행 (노이즈 마스크 여부에 따라 다르게 호출)
                    // [EN] 🎬 Execute Transition (Called differently based on noise mask usage)
                    if (currentTextureData.useTransitionAlphaTexture) {
                        updateNoisePattern();
                        view.skybox.transition(newTexture, duration, noiseTexture);
                    } else {
                        view.skybox.transition(newTexture, duration);
                    }

                    // [KO] 💡 휘도(Luminance) 애니메이션
                    // [EN] 💡 Luminance Animation
                    const startLuminance = view.skybox.luminance;
                    const targetLuminance = option.luminance;
                    const startTimeAnimate = performance.now();

                    const animateLuminance = (currentTime) => {
                        const elapsed = currentTime - startTimeAnimate;
                        const progress = Math.min(elapsed / duration, 1);
                        view.skybox.luminance = startLuminance + (targetLuminance - startLuminance) * progress;
                        pane.refresh();
                        if (progress < 1) requestAnimationFrame(animateLuminance);
                    };
                    requestAnimationFrame(animateLuminance);

                    currentTextureData.current = option.name;
                    updateTransitionButtonStates(option.name);
                });

                transitionButtons.push({button, option});
            });

            function updateTransitionButtonStates(currentTextureName) {
                transitionButtons.forEach(({button, option}) => {
                    button.disabled = (option.name === currentTextureName);
                });
                pane.refresh();
            }
        }
    });
};
