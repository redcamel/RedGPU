import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Color Temperature & Tint 예제
 * [EN] Color Temperature & Tint example
 *
 * [KO] 포스트 이펙트를 사용하여 화면의 색온도(Color Temperature)와 틴트(Tint)를 조절하는 방법을 보여줍니다.
 * [EN] Demonstrates how to adjust screen color temperature and tint using post effects.
 */

// 1. Create and append a container and canvas
const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, 0);
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);
                viewEffect.setSize('50%', '100%');
                viewEffect.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, viewEffect, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => scene.addChild(v['resultMesh']));
}

const renderTestPane = async (redGPUContext, targetView, container) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        }
    });

    const pane = new Pane();
    const effect = targetView.postEffectManager.getEffectAt(0);

    const TEST_STATE = {
        ColorTemperatureTint: true,
        temperature: effect.temperature,
        tint: effect.tint,
        strength: effect.strength
    }

    const folder = pane.addFolder({title: 'Color Temperature & Tint', expanded: true})

    folder.addBinding(TEST_STATE, 'ColorTemperatureTint').on('change', (v) => {
        if (v.value) {
            const newEffect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
            newEffect.temperature = TEST_STATE.temperature;
            newEffect.tint = TEST_STATE.tint;
            newEffect.strength = TEST_STATE.strength;
            targetView.postEffectManager.addEffect(newEffect);
        } else {
            targetView.postEffectManager.removeAllEffect();
        }
        controls.forEach(c => c.disabled = !v.value);
    });

    const controls = [];
    controls.push(folder.addBinding(TEST_STATE, 'temperature', {min: 1000, max: 20000, step: 100}).on('change', (v) => {
        const currentEffect = targetView.postEffectManager.getEffectAt(0);
        if (currentEffect) {
            currentEffect.temperature = v.value;
            updateTemperatureInfo(v.value);
        }
    }));

    controls.push(folder.addBinding(TEST_STATE, 'tint', {min: -100, max: 100}).on('change', (v) => {
        const currentEffect = targetView.postEffectManager.getEffectAt(0);
        if (currentEffect) currentEffect.tint = v.value;
    }));

    controls.push(folder.addBinding(TEST_STATE, 'strength', {min: 0, max: 100}).on('change', (v) => {
        const currentEffect = targetView.postEffectManager.getEffectAt(0);
        if (currentEffect) currentEffect.strength = v.value;
    }));

    const infoFolder = pane.addFolder({title: 'Information', expanded: false});
    const temperatureInfo = {
        kelvinValue: `${TEST_STATE.temperature}K`,
        description: getTemperatureDescription(TEST_STATE.temperature)
    };
    const kelvinDisplay = infoFolder.addBinding(temperatureInfo, 'kelvinValue', {readonly: true});
    const descDisplay = infoFolder.addBinding(temperatureInfo, 'description', {readonly: true});

    function updateTemperatureInfo(temperature) {
        temperatureInfo.kelvinValue = `${temperature}K`;
        temperatureInfo.description = getTemperatureDescription(temperature);
        kelvinDisplay.refresh();
        descDisplay.refresh();
    }

    const actionFolder = pane.addFolder({title: 'Quick Actions & Presets', expanded: true});
    const presets = [
        {title: '🌅 Sunrise', temp: 3200, tint: -10},
        {title: '☀️ Noon', temp: 6500, tint: 0},
        {title: '🌆 Sunset', temp: 2800, tint: 5},
        {title: '🌙 Moonlight', temp: 4000, tint: 15}
    ];

    presets.forEach(p => {
        actionFolder.addButton({title: p.title}).on('click', () => {
            const currentEffect = targetView.postEffectManager.getEffectAt(0);
            if (currentEffect) {
                currentEffect.temperature = p.temp;
                currentEffect.tint = p.tint;
                updateUI(currentEffect);
            }
        });
    });

    function updateUI(effect) {
        TEST_STATE.temperature = effect.temperature;
        TEST_STATE.tint = effect.tint;
        pane.refresh();
        updateTemperatureInfo(effect.temperature);
    }
};

function getTemperatureDescription(temperature) {
    if (temperature < 2000) return "매우 따뜻함 (촛불)";
    if (temperature < 3000) return "따뜻함 (백열등)";
    if (temperature < 4000) return "약간 따뜻함 (할로겐)";
    if (temperature < 5000) return "중성 (형광등)";
    if (temperature < 6000) return "약간 차가움 (플래시)";
    if (temperature < 7000) return "자연광 (태양)";
    if (temperature < 8000) return "차가움 (흐린 하늘)";
    if (temperature < 10000) return "매우 차가움 (그늘)";
    return "극도로 차가움 (파란 하늘)";
}
