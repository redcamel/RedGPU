import * as RedGPU from "../../../../dist/index.js?t=1781141623471";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781141623471";

/**
 * [KO] Depth of Field (DOF) 예제
 * [EN] Depth of Field (DOF) example
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
        controller.distance = 15;
        controller.speedDistance = 0.5;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        const effect = new RedGPU.PostEffect.DOF(redGPUContext);
        viewEffect.postEffectManager.addEffect(effect);
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        setupDOFScene(redGPUContext, scene);

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

        renderTestPane(redGPUContext, viewEffect, container);
    },
    (failReason) => console.error(failReason)
);

function setupDOFScene(redGPUContext, scene) {
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))
    const zLineObjects = 15;
    const zStart = -30;
    const zEnd = 40;
    const zInterval = (zEnd - zStart) / (zLineObjects - 1);

    for (let i = 0; i < zLineObjects; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
        mesh.x = 0; mesh.y = 0; mesh.z = zStart + (i * zInterval);
        const normalizedDistance = i / (zLineObjects - 1);
        mesh.setScale(2 + normalizedDistance * 3);
        mesh.rotationY = i * 20;
        scene.addChild(mesh);
    }
}

const renderTestPane = async (redGPUContext, targetView, container) => {

    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect Applied',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui:pane=>{
            const effect = targetView.postEffectManager.getEffectAt(0);

            const TEST_STATE = {
                DOF: true,
                focusDistance: effect.focusDistance,
                aperture: effect.aperture,
                maxCoC: effect.maxCoC,
                nearPlane: effect.nearPlane,
                farPlane: effect.farPlane,
                nearBlurSize: effect.nearBlurSize,
                farBlurSize: effect.farBlurSize,
                nearStrength: effect.nearStrength,
                farStrength: effect.farStrength,
            }

            const folder = pane.addFolder({title: 'DOF Settings', expanded: true})
            folder.addBinding(TEST_STATE, 'DOF').on('change', (v) => {
                if (v.value) {
                    const newEffect = new RedGPU.PostEffect.DOF(redGPUContext);
                    Object.assign(newEffect, TEST_STATE);
                    targetView.postEffectManager.addEffect(newEffect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
            });

            const controls = [
                folder.addBinding(TEST_STATE, 'focusDistance', {min: 0, max: 100}),
                folder.addBinding(TEST_STATE, 'aperture', {min: 0.1, max: 22.0}),
                folder.addBinding(TEST_STATE, 'maxCoC', {min: 0, max: 100}),
                folder.addBinding(TEST_STATE, 'nearPlane', {min: 0, max: 10}),
                folder.addBinding(TEST_STATE, 'farPlane', {min: 10, max: 2000}),
                folder.addBinding(TEST_STATE, 'nearBlurSize', {min: 0, max: 100}),
                folder.addBinding(TEST_STATE, 'farBlurSize', {min: 0, max: 100}),
                folder.addBinding(TEST_STATE, 'nearStrength', {min: 0, max: 3.0}),
                folder.addBinding(TEST_STATE, 'farStrength', {min: 0, max: 3.0}),
            ];

            pane.on('change', () => {
                const currentEffect = targetView.postEffectManager.getEffectAt(0);
                if (currentEffect) {
                    Object.assign(currentEffect, TEST_STATE);
                }
            });

            const presetFolder = folder.addFolder({title: 'Presets', expanded: false});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    const currentEffect = targetView.postEffectManager.getEffectAt(0);
                    if (currentEffect) {
                        currentEffect[method]();
                        updateUI(currentEffect);
                    }
                });
            };

            addPresetButton('Game Default', 'setGameDefault');
            addPresetButton('Cinematic', 'setCinematic');
            addPresetButton('Portrait', 'setPortrait');
            addPresetButton('Landscape', 'setLandscape');
            addPresetButton('Macro', 'setMacro');
            addPresetButton('Sports', 'setSports');
            addPresetButton('Night Mode', 'setNightMode');

            function updateUI(effect) {
                Object.assign(TEST_STATE, {
                    focusDistance: effect.focusDistance,
                    aperture: effect.aperture,
                    maxCoC: effect.maxCoC,
                    nearPlane: effect.nearPlane,
                    farPlane: effect.farPlane,
                    nearBlurSize: effect.nearBlurSize,
                    farBlurSize: effect.farBlurSize,
                    nearStrength: effect.nearStrength,
                    farStrength: effect.farStrength,
                });
                pane.refresh();
            }
        }
    });


};
