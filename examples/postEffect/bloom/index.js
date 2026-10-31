import * as RedGPU from "../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Bloom 예제
 * [EN] Bloom example
 *
 * [KO] 물리 기반 HDR 다단 Mip-Chain 블룸(Bloom) 포스트 이펙트를 사용하여 빛 번짐 효과를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply physically-based HDR multi-stage Mip-Chain Bloom glow effects using post effects.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;
        controller.speedDistance = 0.2;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] HDR Bloom 포스트 이펙트 활성화 및 인스턴스 참조 획득
        // [EN] Enable HDR Bloom post effect and obtain instance reference
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.builtInEffectManager.useBloom = true;
        const effect = viewEffect.builtInEffectManager.bloom;
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/EmissiveStrengthTest/glTF-Binary/EmissiveStrengthTest.glb',
            (v) => {
                const mesh = v.resultMesh;
                scene.addChild(mesh);
                RedGPUExampleHelper.fitMeshToScreenCenter(mesh, viewNormal);
            }
        );

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

const renderTestPane = (redGPUContext, targetView, effect, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const config = {
                tint: {r: effect.tint.r, g: effect.tint.g, b: effect.tint.b}
            };

            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.builtInEffectManager, 'useBloom').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                presetFolder.disabled = !v.value;
            });

            const controls = [
                folder.addBinding(effect, 'threshold', {min: 0, max: 5, step: 0.01}),
                folder.addBinding(effect, 'softKnee', {min: 0, max: 1, step: 0.01}),
                folder.addBinding(effect, 'intensity', {min: 0, max: 3, step: 0.01}),
                folder.addBinding(effect, 'radius', {min: 0, max: 1, step: 0.01}),
                folder.addBinding(effect, 'maxBrightness', {min: 0, max: 50, step: 0.5}),
                folder.addBinding(config, 'tint', {picker: 'inline', view: 'color'}).on('change', (ev) => {
                    const {r, g, b} = ev.value;
                    effect.tint.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                })
            ];

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    config.tint.r = effect.tint.r;
                    config.tint.g = effect.tint.g;
                    config.tint.b = effect.tint.b;
                    pane.refresh();
                });
            };

            addPresetButton('Natural', 'setNatural');
            addPresetButton('Cinematic', 'setCinematic');
            addPresetButton('Neon Glow', 'setNeonGlow');
            addPresetButton('Dreamy', 'setDreamy');
            addPresetButton('Subtle', 'setSubtle');
        }
    });
};
