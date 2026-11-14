import * as RedGPU from "../../../../../dist/index.js?t=1794645384845";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794645384845";

/**
 * [KO] Chromatic Aberration 예제
 * [EN] Chromatic Aberration example
 *
 * [KO] 렌즈 색수차(Chromatic Aberration) 이펙트를 사용하여 외곽 색상 번짐 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply a lens chromatic aberration effect.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.y = 1;
        controller.tilt = 15;
        controller.pan = 90;
        controller.moveSpeed = 5;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr', 60000);

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, ibl.luminance);
        viewNormal.builtInEffectManager.useBloom = true;
        redGPUContext.addView(viewNormal);

        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, ibl.luminance);
        viewEffect.builtInEffectManager.useBloom = true;
        redGPUContext.addView(viewEffect);

        // [KO] ChromaticAberration 이펙트 활성화 및 인스턴스 참조
        // [EN] Enable ChromaticAberration effect and reference instance
        viewEffect.builtInEffectManager.useChromaticAberration = true;
        const effect = viewEffect.builtInEffectManager.chromaticAberration;

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Sponza/glTF/Sponza.gltf',
            (result) => {
                scene.addChild(result.resultMesh);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const updateLayout = () => {
            const isPortrait = window.innerWidth < window.innerHeight;
            if (isPortrait) {
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, 0);
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, '50%');
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

const renderTestPane = (redGPUContext, targetView, effect, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.builtInEffectManager, 'useChromaticAberration').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
            });

            const controls = [
                folder.addBinding(effect, 'intensity', {min: 0, max: 3, step: 0.01}),
                folder.addBinding(effect, 'startOffset', {min: 0, max: 1, step: 0.01})
            ];
        }
    });
};
