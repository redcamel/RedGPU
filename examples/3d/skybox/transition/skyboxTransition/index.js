import * as RedGPU from "../../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Skybox Transition 예제
 * [EN] Skybox Transition example
 *
 * [KO] 스카이박스 간의 부드러운 페이드 전환 효과를 시연합니다.
 * [EN] Demonstrates smooth fade transition effects between skyboxes.
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
                duration: 300
            };

            transitionFolder.addBinding(transitionState, 'duration', {min: 100, max: 3000, step: 100});
            transitionFolder.addBinding(transitionState, 'current', {readonly: true});

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

                    // [KO] 스카이박스 전환 애니메이션 실행
                    // [EN] Execute skybox transition animation
                    skybox.transition(newTexture, duration);

                    const startLuminance = skybox.luminance;
                    const targetLuminance = option.luminance;
                    const startTime = performance.now();

                    const animateLuminance = (currentTime) => {
                        const progress = Math.min((currentTime - startTime) / duration, 1);
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

            const skyboxFolder = pane.addFolder({title: 'SkyBox', expanded: true});
            skyboxFolder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            skyboxFolder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1});
            skyboxFolder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            skyboxFolder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100});
        }
    });
};
