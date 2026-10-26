import * as RedGPU from "../../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Skybox Transition With Noise Texture 예제
 * [EN] Skybox Transition With Noise Texture example
 *
 * [KO] 노이즈 텍스처(SimplexTexture)를 마스크로 사용하여 유기적이고 부드러운 스카이박스 전환 효과를 시연합니다.
 * [EN] Demonstrates organic and smooth skybox transition effects using a noise texture (SimplexTexture) as a mask.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 초기 스카이박스 생성 및 적용
        // [EN] Create and apply initial skybox
        const initialOption = textureOptions[0];
        const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, initialOption.paths);
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, initialOption.luminance);

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

const createTexture = (redGPUContext, option) => {
    if (option.type === 'cube') {
        return new RedGPU.Resource.CubeTexture(redGPUContext, option.paths);
    }
    const ibl = new RedGPU.Resource.IBL(redGPUContext, option.path);
    return ibl.environmentTexture;
};

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            if (!skybox) return;

            const transitionFolder = pane.addFolder({title: 'Skybox Transition', expanded: true});
            const transitionState = {
                current: textureOptions[0].name,
                duration: 300,
                useNoiseMask: true
            };

            transitionFolder.addBinding(transitionState, 'duration', {min: 100, max: 3000, step: 100});
            transitionFolder.addBinding(transitionState, 'current', {readonly: true});

            // [KO] 전환 마스크용 SimplexTexture 생성 및 파라미터 바인딩
            // [EN] Create SimplexTexture for transition mask and bind parameters
            const noiseTexture = new RedGPU.Resource.SimplexTexture(redGPUContext);
            const startTime = performance.now();
            const updateNoisePattern = () => {
                if (transitionState.useNoiseMask) {
                    noiseTexture.render(performance.now() - startTime);
                }
            };

            const noiseFolder = transitionFolder.addFolder({title: 'SimplexTexture Mask', expanded: true});
            const noiseControls = [];

            const useNoiseBinding = noiseFolder.addBinding(transitionState, 'useNoiseMask');
            noiseControls.push(
                noiseFolder.addBinding(noiseTexture, 'frequency', {
                    min: 0.1,
                    max: 10,
                    step: 0.1
                }).on('change', updateNoisePattern),
                noiseFolder.addBinding(noiseTexture, 'amplitude', {
                    min: 0.1,
                    max: 2,
                    step: 0.1
                }).on('change', updateNoisePattern),
                noiseFolder.addBinding(noiseTexture, 'octaves', {
                    min: 1,
                    max: 8,
                    step: 1
                }).on('change', updateNoisePattern),
                noiseFolder.addBinding(noiseTexture, 'persistence', {
                    min: 0.1,
                    max: 1,
                    step: 0.1
                }).on('change', updateNoisePattern),
                noiseFolder.addBinding(noiseTexture, 'lacunarity', {
                    min: 1,
                    max: 4,
                    step: 0.1
                }).on('change', updateNoisePattern),
                noiseFolder.addButton({title: 'Randomize Seed'}).on('click', () => {
                    noiseTexture.randomizeSeed();
                    updateNoisePattern();
                })
            );

            const presetFolder = noiseFolder.addFolder({title: 'Presets'});
            const presets = [
                {name: 'Smooth Waves', frequency: 2.0, amplitude: 1.0, octaves: 3, persistence: 0.5, lacunarity: 2.0},
                {name: 'Fire Pattern', frequency: 5.0, amplitude: 1.5, octaves: 6, persistence: 0.7, lacunarity: 2.5},
                {name: 'Clouds', frequency: 1.0, amplitude: 0.8, octaves: 4, persistence: 0.4, lacunarity: 1.8},
            ];
            presets.forEach((preset) => {
                noiseControls.push(
                    presetFolder.addButton({title: preset.name}).on('click', () => {
                        noiseTexture.frequency = preset.frequency;
                        noiseTexture.amplitude = preset.amplitude;
                        noiseTexture.octaves = preset.octaves;
                        noiseTexture.persistence = preset.persistence;
                        noiseTexture.lacunarity = preset.lacunarity;
                        updateNoisePattern();
                        pane.refresh();
                    })
                );
            });

            useNoiseBinding.on('change', (ev) => {
                noiseControls.forEach((ctrl) => {
                    ctrl.disabled = !ev.value;
                });
            });

            const transitionButtons = [];
            const updateButtonStates = (currentName) => {
                transitionButtons.forEach(({button, option}) => {
                    button.disabled = option.name === currentName;
                });
                pane.refresh();
            };

            textureOptions.forEach((option) => {
                const button = transitionFolder.addButton({
                    title: `→ ${option.name}`,
                    disabled: transitionState.current === option.name
                }).on('click', () => {
                    const newTexture = createTexture(redGPUContext, option);
                    const duration = transitionState.duration;

                    // [KO] 노이즈 마스크 사용 여부에 따라 스카이박스 전환 실행
                    // [EN] Execute skybox transition with or without noise mask
                    if (transitionState.useNoiseMask) {
                        updateNoisePattern();
                        skybox.transition(newTexture, duration, noiseTexture);
                    } else {
                        skybox.transition(newTexture, duration);
                    }

                    const startLuminance = skybox.luminance;
                    const targetLuminance = option.luminance;
                    const startTimeAnimate = performance.now();

                    const animateLuminance = (currentTime) => {
                        const progress = Math.min((currentTime - startTimeAnimate) / duration, 1);
                        skybox.luminance = startLuminance + (targetLuminance - startLuminance) * progress;
                        pane.refresh();
                        if (progress < 1) requestAnimationFrame(animateLuminance);
                    };
                    requestAnimationFrame(animateLuminance);

                    transitionState.current = option.name;
                    updateButtonStates(option.name);
                });

                transitionButtons.push({button, option});
            });
        }
    });
};
