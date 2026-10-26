import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Depth of Field (DOF) 예제
 * [EN] Depth of Field (DOF) example
 *
 * [KO] 포스트 이펙트를 사용하여 피사계 심도(Depth of Field) 아웃포커싱 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply Depth of Field (DOF) out-of-focus effects using post effects.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 0.5;
        controller.tilt = -15;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] DOF 포스트 이펙트 생성 및 뷰에 추가
        // [EN] Create DOF post effect and add it to the view
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
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, viewEffect, effect, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const setupDOFScene = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );
    const zLineObjects = 15;
    const zStart = -30;
    const zEnd = 40;
    const zInterval = (zEnd - zStart) / (zLineObjects - 1);

    for (let i = 0; i < zLineObjects; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
        mesh.setPosition(0, 0, zStart + i * zInterval);
        const normalizedDistance = i / (zLineObjects - 1);
        mesh.setScale(2 + normalizedDistance * 3);
        mesh.rotationY = i * 20;
        scene.addChild(mesh);
    }
};

const renderTestPane = (redGPUContext, targetView, effect, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const config = {DOF: true};
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(config, 'DOF').on('change', (v) => {
                if (v.value) {
                    targetView.postEffectManager.addEffect(effect);
                } else {
                    targetView.postEffectManager.removeAllEffect();
                }
                controls.forEach((c) => c.disabled = !v.value);
                presetFolder.disabled = !v.value;
            });

            const controls = [
                folder.addBinding(effect, 'focusDistance', {min: 0, max: 100}),
                folder.addBinding(effect, 'aperture', {min: 0.1, max: 22.0}),
                folder.addBinding(effect, 'maxCoC', {min: 0, max: 100}),
                folder.addBinding(effect, 'nearPlane', {min: 0, max: 10}),
                folder.addBinding(effect, 'farPlane', {min: 10, max: 2000}),
                folder.addBinding(effect, 'nearBlurSize', {min: 0, max: 100}),
                folder.addBinding(effect, 'farBlurSize', {min: 0, max: 100}),
                folder.addBinding(effect, 'nearStrength', {min: 0, max: 3.0}),
                folder.addBinding(effect, 'farStrength', {min: 0, max: 3.0})
            ];

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    pane.refresh();
                });
            };

            addPresetButton('Game Default', 'setGameDefault');
            addPresetButton('Cinematic', 'setCinematic');
            addPresetButton('Portrait', 'setPortrait');
            addPresetButton('Landscape', 'setLandscape');
            addPresetButton('Macro', 'setMacro');
            addPresetButton('Sports', 'setSports');
            addPresetButton('Night Mode', 'setNightMode');
        }
    });
};
