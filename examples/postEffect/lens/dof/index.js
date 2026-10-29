import * as RedGPU from "../../../../dist/index.js?t=1792988560000";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792988560000";

/**
 * [KO] Depth of Field (DOF) 예제
 * [EN] Depth of Field (DOF) example
 *
 * [KO] 35mm 풀프레임 Thin-Lens 착란원(CoC)과 전/배경 분리 다각형 조리개 보케 기반의 수동 피사계 심도(Manual DOF), 바닥 광학 심도 눈금자(Optical Depth Ruler), 및 렌즈 프리셋을 시연합니다.
 * [EN] Demonstrates manual Depth of Field (DOF), an optical depth ruler corridor, and lens presets based on 35mm full-frame Thin-Lens CoC and foreground/background separated polygonal aperture bokeh.
 */

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 9.0;
        controller.speedDistance = 0.4;
        controller.tilt = -9;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] 물리 보케 DOF 포스트 이펙트 활성화 및 시네마틱 기본 렌즈 설정
        // [EN] Enable Physical Bokeh DOF post effect and configure default cinematic lens
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.postEffectManager.useDOF = true;
        const effect = viewEffect.postEffectManager.dof;
        effect.setCinematic();
        controller.distance = effect.focusDistance;
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        setupOpticalBenchScene(redGPUContext, scene);

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

const setupOpticalBenchScene = (redGPUContext, scene) => {
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    groundMaterial.color.setColorByHEX('#0a0b0e');
    groundMaterial.specularStrength = 0.7;
    groundMaterial.shininess = 100;
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 120, 120),
        groundMaterial
    );
    ground.y = -1.6;
    scene.addChild(ground);

    // [KO] 1. 광학 심도 눈금자(Optical Depth Ruler): 카메라 거리 3.0m ~ 22.0m 구간에 0.5m 간격으로 바닥 눈금 슬래브를 배치하여,
    //         focusDistance와 aperture(조리개) 변화에 따른 합초 구간(In-Focus Band)의 위치와 심도 두께를 바닥에서 즉시 판독 가능하게 구성
    // [EN] 1. Optical Depth Ruler: Places floor scale bars every 0.5m from 3.0m to 22.0m camera depth so the exact position
    //         and thickness of the in-focus band can be visually read across focusDistance and aperture changes
    const majorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 3.6, 0.035, 0.1);
    const minorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 2.1, 0.02, 0.055);
    const sidePostGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.06, 0.06, 1.05, 16, 1);
    const sideCapGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.13, 16, 16);

    const minorBarMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    minorBarMat.color.setColorByHEX('#4a5260');

    const postBaseMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    postBaseMat.color.setColorByHEX('#22262e');

    const zoneColors = ['#e62e00', '#f07800', '#e6b800', '#00a844', '#0055e6'];

    for (let step = 0; step <= 38; step++) {
        const depthFromCam = 3.0 + step * 0.5;
        const z = 9.0 - depthFromCam;
        const isMajor = step % 2 === 0;

        if (isMajor) {
            const colorIdx = Math.floor(step / 8) % zoneColors.length;
            const hex = zoneColors[colorIdx];

            const majorMat = new RedGPU.Material.PhongMaterial(redGPUContext);
            majorMat.color.setColorByHEX(hex);

            const bar = new RedGPU.Display.Mesh(redGPUContext, majorBarGeo, majorMat);
            bar.setPosition(0, -1.58, z);
            scene.addChild(bar);

            const capMat = new RedGPU.Material.PhongMaterial(redGPUContext);
            capMat.color.setColorByHEX(hex);

            [-2.4, 2.4].forEach((xSide) => {
                const post = new RedGPU.Display.Mesh(redGPUContext, sidePostGeo, postBaseMat);
                post.setPosition(xSide, -1.07, z);
                scene.addChild(post);

                const cap = new RedGPU.Display.Mesh(redGPUContext, sideCapGeo, capMat);
                cap.setPosition(xSide, -0.45, z);
                scene.addChild(cap);
            });
        } else {
            const minorBar = new RedGPU.Display.Mesh(redGPUContext, minorBarGeo, minorBarMat);
            minorBar.setPosition(0, -1.585, z);
            scene.addChild(minorBar);
        }
    }

    // [KO] 2. 근경(3.5m) -> 근중경(5.8m) -> 중심(9.0m) -> 원중경(12.5m) -> 원경(16.2m, 20.0m) 6단계 깊이의 PBR 헬멧 및 캐릭터 배치
    // [EN] 2. 6-stage depth placement of PBR helmets and character at Near (3.5m), Near-Mid (5.8m), Center (9.0m), Mid-Far (12.5m), and Far (16.2m, 20.0m)
    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    const helmetStages = [
        {x: -0.9, y: -0.68, z: 5.5, scale: 0.72, rotY: 28},
        {x: 0.92, y: -0.58, z: 3.2, scale: 0.76, rotY: -25},
        {x: -0.55, y: -0.48, z: 0.0, scale: 0.80, rotY: 18},
        {x: 1.15, y: -0.38, z: -3.5, scale: 0.84, rotY: -20},
        {x: -1.35, y: -0.28, z: -7.2, scale: 0.88, rotY: 18},
        {x: 1.55, y: -0.18, z: -11.0, scale: 0.92, rotY: -15}
    ];

    helmetStages.forEach((stage, idx) => {
        new RedGPU.GLTFLoader(
            redGPUContext,
            helmetUrl,
            (result) => {
                const mesh = scene.addChild(result.resultMesh);
                mesh.setPosition(stage.x, stage.y, stage.z);
                mesh.setScale(stage.scale);
                mesh.rotationY = stage.rotY;
            },
            idx === 0 ? (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e) : undefined
        );
    });

    const cesiumManUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf';
    new RedGPU.GLTFLoader(redGPUContext, cesiumManUrl, (result) => {
        const heroMesh = scene.addChild(result.resultMesh);
        heroMesh.setPosition(0.68, -1.6, 0.0);
        heroMesh.setScale(1.85);
    });

    // [KO] 3. 다중 깊이 아치형 보케 게이트(Bokeh Archway Gates): 조리개 날 개수(bladeCount)와 구경(aperture)에 따른 다각형 보케 형태를 입체적으로 시각화
    // [EN] 3. Multi-depth Bokeh Archway Gates: Visualizes polygonal bokeh shapes driven by bladeCount and aperture across multiple background depths
    const bokehOrbGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.21, 16, 16);
    const bokehPalette = ['#e65c00', '#d91400', '#e6a800', '#0055e6', '#00a838'];

    for (let archIdx = 0; archIdx < 4; archIdx++) {
        const archZ = -5.5 - archIdx * 5.2;
        const archRadius = 3.2 + archIdx * 0.85;
        const orbCount = 11;

        for (let j = 0; j < orbCount; j++) {
            const t = j / (orbCount - 1);
            const theta = Math.PI * (0.08 + t * 0.84);
            const posX = Math.cos(theta) * archRadius;
            const posY = -1.2 + Math.sin(theta) * (archRadius * 0.82);

            const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
            const hex = bokehPalette[(archIdx * 3 + j) % bokehPalette.length];
            mat.color.setColorByHEX(hex);
            mat.specularStrength = 0.9;
            mat.shininess = 128;

            const orb = new RedGPU.Display.Mesh(redGPUContext, bokehOrbGeo, mat);
            orb.setPosition(posX, posY, archZ);
            orb.setScale(0.65 + (archIdx % 3) * 0.22);
            scene.addChild(orb);
        }
    }
};

const renderTestPane = (redGPUContext, targetView, effect, controller, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'Manual DOF (Optical Bench)',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.postEffectManager, 'useDOF').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                presetFolder.disabled = !v.value;
            });

            const controls = [
                folder.addBinding(effect, 'focusDistance', {min: 2.0, max: 30.0, step: 0.1}),
                folder.addBinding(effect, 'focalLength', {min: 12, max: 200, step: 1}),
                folder.addBinding(effect, 'aperture', {min: 0.7, max: 22.0, step: 0.1}),
                folder.addBinding(effect, 'sensorSize', {min: 12, max: 48, step: 1}),
                folder.addBinding(effect, 'maxCoC', {min: 8, max: 64, step: 1}),
                folder.addBinding(effect, 'bladeCount', {min: 0, max: 9, step: 1}),
                folder.addBinding(effect, 'bokehBrightness', {min: 0, max: 5.0, step: 0.1})
            ];

            const presetFolder = folder.addFolder({title: 'Lens Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    controller.distance = effect.focusDistance;
                    pane.refresh();
                });
            };

            addPresetButton('Game Default (65mm f/2.0)', 'setGameDefault');
            addPresetButton('Cinematic (85mm f/1.4)', 'setCinematic');
            addPresetButton('Portrait (85mm f/1.4)', 'setPortrait');
            addPresetButton('Landscape (24mm f/8.0)', 'setLandscape');
            addPresetButton('Macro (105mm f/2.8)', 'setMacro');
            addPresetButton('Sports (135mm f/2.8)', 'setSports');
            addPresetButton('Night Mode (75mm f/1.2 Hex)', 'setNightMode');
        }
    });
};
