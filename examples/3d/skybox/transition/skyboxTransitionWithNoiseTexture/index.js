import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper2/dist/index.js";

/**
 * [KO] Skybox Transition With Noise Texture 예제
 * [EN] Skybox Transition With Noise Texture example
 *
 * [KO] 노이즈 텍스처를 사용하여 부드러운 스카이박스 전환 효과를 시연합니다.
 * [EN] Demonstrates smooth skybox transition effects using noise textures.
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
                transitionDuration: 300,
                useTransitionAlphaTexture: true
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

            // 🌀 노이즈 설정 폴더
            const noiseFolder = transitionFolder.addFolder({
                title: 'Noise Settings',
                expanded: true
            });

            // ✨ 노이즈 트랜지션 토글
            const noiseToggle = noiseFolder.addBinding(currentTextureData, 'useTransitionAlphaTexture', {
                label: 'useTransitionAlphaTexture'
            }).on('change', (ev) => {
                if (!ev.value) {
                    view.skybox.transitionAlphaTexture = null;
                }
            });

            // 🎲 노이즈 텍스처 생성 (한 번만)
            const noiseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);

            // ⏰ 애니메이션 관련 변수
            let startTime = performance.now();

            // 🎨 노이즈 패턴 업데이트 함수
            const updateNoisePattern = () => {
                if (currentTextureData.useTransitionAlphaTexture) {
                    const currentTime = performance.now();
                    noiseTexture.render(currentTime - startTime);
                }
            };

            // 노이즈 파라미터 컨트롤
            const noiseSettings = {
                frequency: noiseTexture.frequency,
                amplitude: noiseTexture.amplitude,
                octaves: noiseTexture.octaves,
                persistence: noiseTexture.persistence,
                lacunarity: noiseTexture.lacunarity,
                regenerate: () => {
                    noiseTexture.randomizeSeed();
                    updateNoisePattern();
                    console.log('🎲 Noise pattern regenerated!');
                }
            };

            const frequencyBinding = noiseFolder.addBinding(noiseSettings, 'frequency', {
                min: 0.1, max: 10, step: 0.1,
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.frequency = ev.value;
                updateNoisePattern();
            });

            const amplitudeBinding = noiseFolder.addBinding(noiseSettings, 'amplitude', {
                min: 0.1, max: 2, step: 0.1,
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.amplitude = ev.value;
                updateNoisePattern();
            });

            const octavesBinding = noiseFolder.addBinding(noiseSettings, 'octaves', {
                min: 1, max: 8, step: 1,
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.octaves = ev.value;
                updateNoisePattern();
            });

            const persistenceBinding = noiseFolder.addBinding(noiseSettings, 'persistence', {
                min: 0.1, max: 1, step: 0.1,
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.persistence = ev.value;
                updateNoisePattern();
            });

            const lacunarityBinding = noiseFolder.addBinding(noiseSettings, 'lacunarity', {
                min: 1, max: 4, step: 0.1,
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('change', (ev) => {
                noiseTexture.lacunarity = ev.value;
                updateNoisePattern();
            });

            const regenerateButton = noiseFolder.addButton({
                title: '🎲 Regenerate Pattern',
                disabled: !currentTextureData.useTransitionAlphaTexture
            }).on('click', noiseSettings.regenerate);

            // 🌟 프리셋 노이즈 패턴들
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
                    noiseTexture.frequency = preset.frequency;
                    noiseTexture.amplitude = preset.amplitude;
                    noiseTexture.octaves = preset.octaves;
                    noiseTexture.persistence = preset.persistence;
                    noiseTexture.lacunarity = preset.lacunarity;

                    noiseSettings.frequency = preset.frequency;
                    noiseSettings.amplitude = preset.amplitude;
                    noiseSettings.octaves = preset.octaves;
                    noiseSettings.persistence = preset.persistence;
                    noiseSettings.lacunarity = preset.lacunarity;

                    updateNoisePattern();
                    pane.refresh();
                });
                presetButtons.push(button);
            });

            noiseToggle.on('change', (ev) => {
                const isEnabled = ev.value;
                [frequencyBinding, amplitudeBinding, octavesBinding, persistenceBinding, lacunarityBinding, regenerateButton, ...presetButtons].forEach(b => b.disabled = !isEnabled);
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
                    if (currentTextureData.useTransitionAlphaTexture) {
                        updateNoisePattern();
                        view.skybox.transition(newTexture, duration, noiseTexture);
                    } else {
                        view.skybox.transition(newTexture, duration);
                    }

                    // 💡 휘도(Luminance) 애니메이션
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

                    // UI 업데이트
                    currentTextureData.current = option.name;
                    updateTransitionButtonStates(option.name);
                });

                transitionButtons.push({button: button, option: option});
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