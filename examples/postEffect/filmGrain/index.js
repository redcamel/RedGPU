import * as RedGPU from "../../../dist/index.js?t=1781144235516";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1781144235516";

/**
 * [KO] Film Grain 예제
 * [EN] Film Grain example
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
        controller.tilt = 0
        
        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const filmGrain = new RedGPU.PostEffect.FilmGrain(redGPUContext);
        viewEffect.postEffectManager.addEffect(filmGrain);
        redGPUContext.addView(viewEffect);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                viewNormal.setSize('100%', '50%'); viewNormal.setPosition(0, 0);
                viewEffect.setSize('100%', '50%'); viewEffect.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%'); viewNormal.setPosition(0, 0);
                viewEffect.setSize('50%', '100%'); viewEffect.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext, viewEffect, filmGrain, container);
    },
    (failReason) => console.error(failReason)
);

function loadGLTF(redGPUContext, scene, url) {
    new RedGPU.GLTFLoader(redGPUContext, url, (v) => scene.addChild(v['resultMesh']));
}

const renderTestPane = async (redGPUContext, targetView, effect, container) => {

    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui:pane=>{
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
                Object.assign(TEST_STATE, {
                    intensity: effect.filmGrainIntensity,
                    response: effect.filmGrainResponse,
                    scale: effect.filmGrainScale,
                    chroma: effect.coloredGrain,
                    saturation: effect.grainSaturation
                });
                pane.refresh();
            };

            const f = pane.addFolder({title: '🎞️ Cinematic Grain Settings', expanded: true});

            f.addBinding(TEST_STATE, 'enabled', {label: 'Effect Enabled'}).on('change', (v) => {
                v.value ? targetView.postEffectManager.addEffect(effect) : targetView.postEffectManager.removeAllEffect();
            });

            f.addBinding(TEST_STATE, 'intensity', {min: 0, max: 0.5, step: 0.001, label: 'Grain Intensity'}).on('change', update);
            f.addBinding(TEST_STATE, 'response', {min: 0, max: 5, step: 0.1, label: 'Shadow Masking'}).on('change', update);
            f.addBinding(TEST_STATE, 'scale', {min: 0.1, max: 10, step: 0.1, label: 'Particle Scale'}).on('change', update);
            f.addBinding(TEST_STATE, 'chroma', {min: 0, max: 1, step: 0.01, label: 'Chroma Noise'}).on('change', update);
            f.addBinding(TEST_STATE, 'saturation', {min: 0, max: 2, step: 0.01, label: 'Grain Saturation'}).on('change', update);

            const pf = pane.addFolder({title: '🎬 Presets', expanded: false});
            pf.addButton({title: 'Subtle'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.SUBTLE));
            pf.addButton({title: 'Medium'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.MEDIUM));
            pf.addButton({title: 'Heavy'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.HEAVY));
            pf.addButton({title: 'Vintage'}).on('click', () => applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE));
        }
    });

};
