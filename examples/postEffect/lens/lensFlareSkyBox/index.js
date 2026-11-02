import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] LensFlare (IBL SkyBox) 예제
 * [EN] LensFlare (IBL SkyBox) example
 *
 * [KO] SkyAtmosphere 없이 일반 HDR IBL SkyBox 및 DirectionalLight/PBR 메쉬 환경에서 화면 공간 HDR 하이라이트와 주광원 경로 해석으로 동작하는 렌즈 플레어(Lens Flare) 후처리 효과를 시연합니다.
 * [EN] Demonstrates the Lens Flare post-processing effect operating via screen-space HDR highlights and directional light optical path evaluation in a standard HDR IBL SkyBox and PBR mesh environment without SkyAtmosphere.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3.8;
        controller.tilt = -2;
        controller.pan = 38;
        controller.speedDistance = 0.15;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 14.5;
        directionalLight.azimuth = -142.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] SkyAtmosphere 없이 IBL SkyBox + DirectionalLight 환경에서 HDR LensFlare 빌트인 이펙트 활성화
        // [EN] Enable HDR LensFlare built-in effect in an IBL SkyBox + DirectionalLight environment without SkyAtmosphere
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.builtInEffectManager.useLensFlare = true;
        const effect = viewEffect.builtInEffectManager.lensFlare;
        redGPUContext.addView(viewEffect);

        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
            (v) => {
                scene.addChild(v.resultMesh);
            }
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

        renderTestPane(redGPUContext, viewEffect, effect, directionalLight, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, targetView, effect, directionalLight, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.builtInEffectManager, 'useLensFlare').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                presetFolder.disabled = !v.value;
            });

            const controls = [
                folder.addBinding(effect, 'intensity', {min: 0.0, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'threshold', {min: 0.1, max: 20.0, step: 0.1}),
                folder.addBinding(effect, 'ghostCount', {min: 0, max: 12, step: 1}),
                folder.addBinding(effect, 'ghostSpacing', {min: 0.05, max: 1.0, step: 0.01}),
                folder.addBinding(effect, 'ghostIntensity', {min: 0.0, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'haloRadius', {min: 0.1, max: 0.9, step: 0.01}),
                folder.addBinding(effect, 'haloThickness', {min: 0.02, max: 0.5, step: 0.01}),
                folder.addBinding(effect, 'haloIntensity', {min: 0.0, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'chromaticAberration', {min: 0.0, max: 0.1, step: 0.001}),
                folder.addBinding(effect, 'bladeCount', {min: 4, max: 12, step: 1}),
                folder.addBinding(effect, 'starburstIntensity', {min: 0.0, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'anamorphicIntensity', {min: 0.0, max: 5.0, step: 0.01}),
                folder.addBinding(effect, 'lensDirtIntensity', {min: 0.0, max: 2.0, step: 0.01}),
                folder.addBinding(effect, 'blurSize', {min: 1, max: 64, step: 1})
            ];

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    pane.refresh();
                });
            };

            addPresetButton('Cinematic', 'setCinematic');
            addPresetButton('Natural', 'setNatural');
            addPresetButton('Anamorphic', 'setAnamorphic');
            addPresetButton('Solar Max', 'setSolarMax');
            addPresetButton('Subtle', 'setSubtle');

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: true});
            lightFolder.addBinding(directionalLight, 'elevation', {min: -10, max: 90, step: 0.1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: -180, max: 180, step: 0.1});
        }
    });
};
