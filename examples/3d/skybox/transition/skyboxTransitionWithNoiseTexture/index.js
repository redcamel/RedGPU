import * as RedGPU from "../../../../../dist/index.js?t=1769512187569";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

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
        return new RedGPU.Resource.HDRTexture(redGPUContext, option.path);
    }
};

const renderTestPane = async (targetView, redGPUContext) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512187569");
    const pane = new Pane();
    const {
        createFieldOfView,
        setSeparator,
        createSkyBoxHelper
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1769512187569");

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
            targetView.skybox.useTransitionAlphaTexture = null
        }
    });

    // 🎲 노이즈 텍스처 생성 (한 번만)
    const noiseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);

    // ⏰ 애니메이션 관련 변수
    let animationId = null;
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
        animated: false, // ✨ 애니메이션 토글
        regenerate: () => {
            noiseTexture.randomizeSeed();
            updateNoisePattern(); // 🔄 즉시 업데이트
            console.log('🎲 Noise pattern regenerated!');
        }
    };

    // 🎚️ 노이즈 파라미터 바인딩들 (초기에는 비활성화)
    const frequencyBinding = noiseFolder.addBinding(noiseSettings, 'frequency', {
        min: 0.1,
        max: 10,
        step: 0.1,
        disabled: !currentTextureData.useTransitionAlphaTexture
    }).on('change', (ev) => {
        noiseTexture.frequency = ev.value;
        updateNoisePattern();
    });

    const amplitudeBinding = noiseFolder.addBinding(noiseSettings, 'amplitude', {
        min: 0.1,
        max: 2,
        step: 0.1,
        disabled: !currentTextureData.useTransitionAlphaTexture
    }).on('change', (ev) => {
        noiseTexture.amplitude = ev.value;
        updateNoisePattern();
    });

    const octavesBinding = noiseFolder.addBinding(noiseSettings, 'octaves', {
        min: 1,
        max: 8,
        step: 1,
        disabled: !currentTextureData.useTransitionAlphaTexture
    }).on('change', (ev) => {
        noiseTexture.octaves = ev.value;
        updateNoisePattern();
    });

    const persistenceBinding = noiseFolder.addBinding(noiseSettings, 'persistence', {
        min: 0.1,
        max: 1,
        step: 0.1,
        disabled: !currentTextureData.useTransitionAlphaTexture
    }).on('change', (ev) => {
        noiseTexture.persistence = ev.value;
        updateNoisePattern();
    });

    const lacunarityBinding = noiseFolder.addBinding(noiseSettings, 'lacunarity', {
        min: 1,
        max: 4,
        step: 0.1,
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
    const presetFolder = noiseFolder.addFolder({
        title: 'Preset Patterns',
        expanded: true
    });

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
            // 프리셋 적용
            noiseTexture.frequency = preset.frequency;
            noiseTexture.amplitude = preset.amplitude;
            noiseTexture.octaves = preset.octaves;
            noiseTexture.persistence = preset.persistence;
            noiseTexture.lacunarity = preset.lacunarity;

            // UI 업데이트
            noiseSettings.frequency = preset.frequency;
            noiseSettings.amplitude = preset.amplitude;
            noiseSettings.octaves = preset.octaves;
            noiseSettings.persistence = preset.persistence;
            noiseSettings.lacunarity = preset.lacunarity;

            updateNoisePattern();
            pane.refresh();

            console.log(`🌟 Applied preset: ${preset.name}`);
        });
        presetButtons.push(button);
    });

    // 🎛️ 노이즈 토글 변경 시 모든 노이즈 컨트롤 활성화/비활성화
    noiseToggle.on('change', (ev) => {
        const isEnabled = ev.value;

        // 모든 노이즈 파라미터 바인딩 활성화/비활성화
        frequencyBinding.disabled = !isEnabled;
        amplitudeBinding.disabled = !isEnabled;
        octavesBinding.disabled = !isEnabled;
        persistenceBinding.disabled = !isEnabled;
        lacunarityBinding.disabled = !isEnabled;
        regenerateButton.disabled = !isEnabled;

        // 프리셋 버튼들 활성화/비활성화
        presetButtons.forEach(button => {
            button.disabled = !isEnabled;
        });

        console.log(`🌀 Noise transition ${isEnabled ? 'enabled' : 'disabled'}`);
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

            // 🎬 트랜지션 실행 (노이즈 사용 여부에 따라)
            if (currentTextureData.useTransitionAlphaTexture) {
                // ✨ 노이즈 기반 트랜지션
                updateNoisePattern(); // 🔄 트랜지션 전 노이즈 업데이트
                targetView.skybox.transition(
                    newTexture,
                    currentTextureData.transitionDuration,
                    noiseTexture
                );
                console.log(`🌀 Noise transition to: ${option.name} (${currentTextureData.transitionDuration}ms)`);
            } else {
                // 🌊 기본 선형 트랜지션
                targetView.skybox.transition(
                    newTexture,
                    currentTextureData.transitionDuration
                );
                console.log(`🌊 Linear transition to: ${option.name} (${currentTextureData.transitionDuration}ms)`);
            }

            // 이전 버튼 활성화
            updateTransitionButtonStates(currentTextureData.current);

            // UI 업데이트
            setTimeout(() => {
                currentTextureData.current = option.name;
                // 새로운 현재 텍스처에 해당하는 버튼 비활성화
                updateTransitionButtonStates(option.name);
            }, currentTextureData.transitionDuration);
        });

        // 버튼과 옵션 정보를 함께 저장
        transitionButtons.push({
            button: button,
            option: option
        });
    });

// 🔄 트랜지션 버튼 상태 업데이트 함수
    function updateTransitionButtonStates(currentTextureName) {
        transitionButtons.forEach(({button, option}) => {
            button.disabled = (option.name === currentTextureName);
        });
    }

    setSeparator(pane);
};
