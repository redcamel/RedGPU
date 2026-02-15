import * as RedGPU from "../../../dist/index.js?t=1770713934910";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

/**
 * [KO] Film Grain 예제 (Cinematic Version)
 * [EN] Film Grain example (Cinematic Version)
 */

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        
        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        // 일반 뷰 (비교용)
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // 시네마틱 뷰 (이펙트 적용)
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        
        const filmGrain = new RedGPU.PostEffect.FilmGrain(redGPUContext);
        viewEffect.postEffectManager.addEffect(filmGrain);
        redGPUContext.addView(viewEffect);

        // 조명 및 모델
        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        // 레이아웃
        if (redGPUContext.detector.isMobile) {
            viewNormal.setSize('100%', '50%'); viewNormal.setPosition(0, 0);
            viewEffect.setSize('100%', '50%'); viewEffect.setPosition(0, '50%');
        } else {
            viewNormal.setSize('50%', '100%'); viewNormal.setPosition(0, 0);
            viewEffect.setSize('50%', '100%'); viewEffect.setPosition('50%', 0);
        }

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, viewEffect, filmGrain);
    },
    (failReason) => console.error(failReason)
);

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => scene.addChild(v['resultMesh']));
}

/**
 * [KO] 시네마틱 컨트롤 패널 렌더링
 */
const renderTestPane = async (redGPUContext, targetView, effect) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const {createPostEffectLabel} = await import('../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js?t=1770713934910');
    const {setDebugButtons} = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    
    createPostEffectLabel('Cinematic Film Grain', redGPUContext.detector.isMobile);
    setDebugButtons(RedGPU, redGPUContext);
    
    const pane = new Pane();
    const TEST_STATE = {
        enabled: true,
        intensity: effect.filmGrainIntensity,
        response: effect.filmGrainResponse,
        scale: effect.filmGrainScale,
        chroma: effect.coloredGrain,
        saturation: effect.grainSaturation
    };

    const update = () => {
        effect.filmGrainIntensity = TEST_STATE.intensity;
        effect.filmGrainResponse = TEST_STATE.response;
        effect.filmGrainScale = TEST_STATE.scale;
        effect.coloredGrain = TEST_STATE.chroma;
        effect.grainSaturation = TEST_STATE.saturation;
    };

    const applyPreset = (p) => {
        effect.applyPreset(p);
        TEST_STATE.intensity = effect.filmGrainIntensity;
        TEST_STATE.response = effect.filmGrainResponse;
        TEST_STATE.scale = effect.filmGrainScale;
        TEST_STATE.chroma = effect.coloredGrain;
        TEST_STATE.saturation = effect.grainSaturation;
        pane.refresh();
    };

    const f = pane.addFolder({title: '🎞️ Cinematic Grain Settings', expanded: true});

    f.addBinding(TEST_STATE, 'enabled', {label: 'Effect Enabled'}).on('change', (v) => {
        v.value ? targetView.postEffectManager.addEffect(effect) : targetView.postEffectManager.removeAllEffect();
    });

    f.addBinding(TEST_STATE, 'intensity', {min: 0, max: 0.5, step: 0.001, label: 'Grain Intensity (강도)'}).on('change', update);
    f.addBinding(TEST_STATE, 'response', {min: 0, max: 5, step: 0.1, label: 'Shadow Masking (암부 반응)'}).on('change', update);
    f.addBinding(TEST_STATE, 'scale', {min: 0.1, max: 10, step: 0.1, label: 'Particle Scale (크기)'}).on('change', update);
    f.addBinding(TEST_STATE, 'chroma', {min: 0, max: 1, step: 0.01, label: 'Chroma Noise (색상 노이즈)'}).on('change', update);
    f.addBinding(TEST_STATE, 'saturation', {min: 0, max: 2, step: 0.01, label: 'Grain Saturation (채도)'}).on('change', update);

    const pf = pane.addFolder({title: '🎬 Presets', expanded: false});
    pf.addButton({title: 'Subtle (미세한)'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.SUBTLE));
    pf.addButton({title: 'Medium (표준)'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.MEDIUM));
    pf.addButton({title: 'Heavy (강한)'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.HEAVY));
    pf.addButton({title: 'Vintage (고전 영화)'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE));
};
