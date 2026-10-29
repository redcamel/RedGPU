import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Depth of Field (DOF) 예제
 * [EN] Depth of Field (DOF) example
 *
 * [KO] 35mm 풀프레임 Thin-Lens 착란원(CoC), 전/배경 분리 다각형 조리개 보케, 및 화면 깊이 기반 9-Point Zone 자동 초점(`useAutoFocus`)을 적용하는 피사계 심도(DOF) 후처리 예제입니다.
 * [EN] Demonstrates physically-based Depth of Field (DOF) post-processing with 35mm full-frame Thin-Lens CoC, foreground/background separated polygonal aperture bokeh, and screen-depth 9-Point Zone auto-focus (`useAutoFocus`).
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.5;
        controller.tilt = -10;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] 물리 보케 DOF 포스트 이펙트 활성화 및 인스턴스 참조 획득
        // [EN] Enable Physical Bokeh DOF post effect and obtain instance reference
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.postEffectManager.useDOF = true;
        const effect = viewEffect.postEffectManager.dof;
        controller.distance = effect.focusDistance;
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

        renderTestPane(redGPUContext, viewEffect, effect, controller, container);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const setupDOFScene = (redGPUContext, scene) => {
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    groundMaterial.color.setColorByHEX('#1a1d24');
    groundMaterial.specularStrength = 0.5;
    groundMaterial.shininess = 80;
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100),
        groundMaterial
    );
    ground.y = -1.6;
    scene.addChild(ground);

    const cesiumManUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf';
    new RedGPU.GLTFLoader(
        redGPUContext,
        cesiumManUrl,
        (result) => {
            const heroMesh = scene.addChild(result.resultMesh);
            heroMesh.setPosition(0, -1.6, 0);
            heroMesh.setScale(2.0);
        },
        (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e)
    );

    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    const helmetPlacements = [
        {x: -1.6, y: -0.2, z: 2.5, scale: 1.4, rotY: 28},
        {x: 2.1, y: 0.0, z: -3.5, scale: 1.7, rotY: -22},
        {x: -2.2, y: 0.1, z: -7.5, scale: 1.7, rotY: 18},
        {x: 2.5, y: 0.1, z: -12.0, scale: 1.8, rotY: -15},
        {x: -2.8, y: 0.2, z: -17.0, scale: 1.8, rotY: 12}
    ];

    helmetPlacements.forEach((pos) => {
        new RedGPU.GLTFLoader(redGPUContext, helmetUrl, (result) => {
            const mesh = scene.addChild(result.resultMesh);
            mesh.setPosition(pos.x, pos.y, pos.z);
            mesh.setScale(pos.scale);
            mesh.rotationY = pos.rotY;
        });
    });

    const bokehLightGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.22, 16, 16);
    const bokehColors = ['#ffaa22', '#22ddff', '#ff3388', '#ffeeaa', '#66ff44'];

    for (let i = 0; i < 32; i++) {
        const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
        const hex = bokehColors[i % bokehColors.length];
        mat.color.setColorByHEX(hex);
        mat.emissiveColor.setColorByHEX(hex);
        mat.emissiveStrength = 10.0;

        const lightOrb = new RedGPU.Display.Mesh(redGPUContext, bokehLightGeometry, mat);
        const angle = i * 2.39996;
        const radiusX = 1.8 + (i % 7) * 1.4;
        const posX = Math.cos(angle) * radiusX;
        const posY = -0.6 + ((i * 37) % 100) / 100 * 5.5;
        const posZ = -6.0 - (i / 32) * 24.0;
        const orbScale = 0.65 + (i % 4) * 0.3;

        lightOrb.setPosition(posX, posY, posZ);
        lightOrb.setScale(orbScale);
        scene.addChild(lightOrb);
    }
};

const renderTestPane = (redGPUContext, targetView, effect, controller, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.postEffectManager, 'useDOF').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                focusDistanceControl.disabled = !v.value || effect.useAutoFocus;
                presetFolder.disabled = !v.value;
            });

            const useAutoFocusControl = folder.addBinding(effect, 'useAutoFocus').on('change', (v) => {
                focusDistanceControl.disabled = !targetView.postEffectManager.useDOF || v.value;
            });
            const focusDistanceControl = folder.addBinding(effect, 'focusDistance', {min: 0.5, max: 50, step: 0.1});
            const controls = [
                useAutoFocusControl,
                folder.addBinding(effect, 'focalLength', {min: 12, max: 200, step: 1}),
                folder.addBinding(effect, 'aperture', {min: 0.7, max: 22.0, step: 0.1}),
                folder.addBinding(effect, 'sensorSize', {min: 12, max: 48, step: 1}),
                folder.addBinding(effect, 'maxCoC', {min: 8, max: 64, step: 1}),
                folder.addBinding(effect, 'bladeCount', {min: 0, max: 9, step: 1}),
                folder.addBinding(effect, 'bokehBrightness', {min: 0, max: 5.0, step: 0.1})
            ];

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method, speedDistance) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    if (!effect.useAutoFocus) {
                        controller.distance = effect.focusDistance;
                    }
                    controller.speedDistance = speedDistance;
                    pane.refresh();
                });
            };

            addPresetButton('Game Default', 'setGameDefault', 0.5);
            addPresetButton('Cinematic', 'setCinematic', 0.35);
            addPresetButton('Portrait', 'setPortrait', 0.25);
            addPresetButton('Landscape', 'setLandscape', 1.0);
            addPresetButton('Macro', 'setMacro', 0.15);
            addPresetButton('Sports', 'setSports', 0.7);
            addPresetButton('Night Mode', 'setNightMode', 0.3);
        }
    });
};
