import * as RedGPU from "../../../../../dist/index.js?t=1794640510497";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794640510497";

/**
 * [KO] Depth of Field - Auto Focus (DOF 자동 초점) 예제
 * [EN] Depth of Field - Auto Focus (DOF Auto-Focus) example
 *
 * [KO] 화면 중앙의 피사체 거리를 실시간 감지하여 자동으로 초점을 맞추는 `dof.useAutoFocus` 기능을 시연합니다.
 * [EN] Demonstrates `dof.useAutoFocus`, which automatically tracks focus on the subject at the center of the screen in real time.
 */

const STAGE_TARGETS = [
    {
        x: -2.8,
        y: -0.55,
        z: 4.8,
        distance: 5.0,
        pan: -14,
        tilt: -4,
        label: 'AF-C [9-POINT ZONE] : NEAR LEFT'
    },
    {
        x: 2.6,
        y: -0.48,
        z: 2.2,
        distance: 6.8,
        pan: 14,
        tilt: -5,
        label: 'AF-C [9-POINT ZONE] : NEAR-MID RIGHT'
    },
    {
        x: 0.0,
        y: -0.45,
        z: -0.5,
        distance: 8.5,
        pan: 0,
        tilt: -6,
        label: 'AF-C [9-POINT ZONE] : CENTER CHARACTER'
    },
    {
        x: -3.2,
        y: -0.32,
        z: -4.5,
        distance: 11.0,
        pan: -12,
        tilt: -5,
        label: 'AF-C [9-POINT ZONE] : MID-FAR LEFT'
    },
    {
        x: 3.4,
        y: -0.18,
        z: -9.0,
        distance: 14.5,
        pan: 10,
        tilt: -4,
        label: 'AF-C [9-POINT ZONE] : FAR RIGHT'
    }
];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const viewfinder = document.createElement('div');
viewfinder.className = 'af-viewfinder is-af';
const zoneDots = document.createElement('div');
zoneDots.className = 'af-zone-dots';
viewfinder.appendChild(zoneDots);
const viewfinderLabel = document.createElement('div');
viewfinderLabel.className = 'af-viewfinder-label';
viewfinderLabel.textContent = STAGE_TARGETS[0].label;
viewfinder.appendChild(viewfinderLabel);
document.body.appendChild(viewfinder);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const initialStage = STAGE_TARGETS[0];
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.centerX = initialStage.x;
        controller.centerY = initialStage.y;
        controller.centerZ = initialStage.z;
        controller.distance = initialStage.distance;
        controller.speedDistance = 0.4;
        controller.pan = initialStage.pan;
        controller.tilt = initialStage.tilt;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] DOF 및 자동 초점(useAutoFocus) 활성화
        // [EN] Enable DOF and auto-focus (useAutoFocus)
        view.builtInEffectManager.useDOF = true;
        const effect = view.builtInEffectManager.dof;
        effect.useAutoFocus = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        setupAutoFocusScene(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view, effect, controller);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const setupAutoFocusScene = (redGPUContext, scene) => {
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    groundMaterial.color.setColorByHEX('#0a0b0e');
    groundMaterial.specularStrength = 0.65;
    groundMaterial.shininess = 96;
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 160, 160),
        groundMaterial
    );
    ground.y = -1.6;
    scene.addChild(ground);

    // [KO] 1. 광폭 바닥 심도 가이드 라인: 와이드스크린 단일 뷰에 맞춰 좌우 폭(11m)을 넓게 확장하여 초점면 이동을 표시
    // [EN] 1. Wide floor depth guide bars: Expanded to 11m width for the widescreen single view to clearly show focal plane movement
    const majorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 11.0, 0.035, 0.11);
    const minorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 7.2, 0.02, 0.06);
    const minorBarMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    minorBarMat.color.setColorByHEX('#4a5260');
    const zoneColors = ['#e62e00', '#f07800', '#e6b800', '#00a844', '#0055e6'];

    for (let step = 0; step <= 44; step++) {
        const z = 7.0 - step * 0.5;
        if (step % 2 === 0) {
            const majorMat = new RedGPU.Material.PhongMaterial(redGPUContext);
            majorMat.color.setColorByHEX(zoneColors[Math.floor(step / 8) % zoneColors.length]);
            const bar = new RedGPU.Display.Mesh(redGPUContext, majorBarGeo, majorMat);
            bar.setPosition(0, -1.58, z);
            scene.addChild(bar);
        } else {
            const minorBar = new RedGPU.Display.Mesh(redGPUContext, minorBarGeo, minorBarMat);
            minorBar.setPosition(0, -1.585, z);
            scene.addChild(minorBar);
        }
    }

    // [KO] 2. 좌우 파노라마(X: -3.2 ~ +3.4) 및 전·중·원경 깊이(Z: +4.8 ~ -9.0)로 넓게 펼친 피사체 배치
    // [EN] 2. Wide panoramic subject placement spread across horizontal (X: -3.2 ~ +3.4) and depth (Z: +4.8 ~ -9.0) stages
    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    const helmetPlacements = [
        {x: STAGE_TARGETS[0].x, y: -0.58, z: STAGE_TARGETS[0].z, scale: 0.78, rotY: 26},
        {x: STAGE_TARGETS[1].x, y: -0.48, z: STAGE_TARGETS[1].z, scale: 0.82, rotY: -24},
        {x: STAGE_TARGETS[3].x, y: -0.32, z: STAGE_TARGETS[3].z, scale: 0.88, rotY: 20},
        {x: STAGE_TARGETS[4].x, y: -0.18, z: STAGE_TARGETS[4].z, scale: 0.95, rotY: -18}
    ];

    helmetPlacements.forEach((item, idx) => {
        new RedGPU.GLTFLoader(
            redGPUContext,
            helmetUrl,
            (result) => {
                const mesh = scene.addChild(result.resultMesh);
                mesh.setPosition(item.x, item.y, item.z);
                mesh.setScale(item.scale);
                mesh.rotationY = item.rotY;
            },
            idx === 0 ? (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e) : undefined
        );
    });

    const cesiumManUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf';
    new RedGPU.GLTFLoader(redGPUContext, cesiumManUrl, (result) => {
        const heroMesh = scene.addChild(result.resultMesh);
        heroMesh.setPosition(STAGE_TARGETS[2].x, -1.6, STAGE_TARGETS[2].z);
        heroMesh.setScale(1.85);
    });

    // [KO] 3. 광폭 후방 보케 아치(Wide Bokeh Archway): 반경 5.6m ~ 9.6m의 넓은 아치로 화면 전체에 다각형 보케 형성
    // [EN] 3. Wide Rear Bokeh Archway: 5.6m ~ 9.6m radius arches spanning the full widescreen field
    const bokehOrbGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.24, 16, 16);
    const bokehPalette = ['#e65c00', '#d91400', '#e6a800', '#0055e6', '#00a838'];

    for (let archIdx = 0; archIdx < 4; archIdx++) {
        const archZ = -6.5 - archIdx * 5.2;
        const archRadius = 5.6 + archIdx * 1.35;
        const orbCount = 15;

        for (let j = 0; j < orbCount; j++) {
            const t = j / (orbCount - 1);
            const theta = Math.PI * (0.06 + t * 0.88);
            const posX = Math.cos(theta) * archRadius;
            const posY = -1.2 + Math.sin(theta) * (archRadius * 0.62);

            const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
            mat.color.setColorByHEX(bokehPalette[(archIdx * 3 + j) % bokehPalette.length]);
            mat.specularStrength = 0.9;
            mat.shininess = 128;

            const orb = new RedGPU.Display.Mesh(redGPUContext, bokehOrbGeo, mat);
            orb.setPosition(posX, posY, archZ);
            orb.setScale(0.7 + (archIdx % 3) * 0.25);
            scene.addChild(orb);
        }
    }
};

const renderTestPane = (redGPUContext, targetView, effect, controller) => {
    let activeLabel = STAGE_TARGETS[0].label;
    const updateReticleUI = () => {
        if (!targetView.builtInEffectManager.useDOF) {
            viewfinder.style.display = 'none';
            return;
        }
        viewfinder.style.display = 'block';
        if (effect.useAutoFocus) {
            viewfinder.className = 'af-viewfinder is-af';
            viewfinderLabel.textContent = activeLabel;
        } else {
            viewfinder.className = 'af-viewfinder is-mf';
            viewfinderLabel.textContent = 'MF [MANUAL FOCUS]';
        }
    };

    const aimAtStage = (stage) => {
        activeLabel = stage.label;
        controller.centerX = stage.x;
        controller.centerY = stage.y;
        controller.centerZ = stage.z;
        controller.distance = stage.distance;
        controller.pan = stage.pan;
        controller.tilt = stage.tilt;
        updateReticleUI();
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});
            folder.addBinding(targetView.builtInEffectManager, 'useDOF').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                focusDistanceControl.disabled = !v.value || effect.useAutoFocus;
                presetFolder.disabled = !v.value;
                targetFolder.disabled = !v.value;
                updateReticleUI();
            });

            const useAutoFocusControl = folder.addBinding(effect, 'useAutoFocus').on('change', (v) => {
                focusDistanceControl.disabled = !targetView.builtInEffectManager.useDOF || v.value;
                updateReticleUI();
            });
            const focusDistanceControl = folder.addBinding(effect, 'focusDistance', {
                min: 2.0,
                max: 30.0,
                step: 0.1,
                disabled: effect.useAutoFocus
            });

            const controls = [
                useAutoFocusControl,
                folder.addBinding(effect, 'focalLength', {min: 12, max: 200, step: 1}),
                folder.addBinding(effect, 'aperture', {min: 0.7, max: 22.0, step: 0.1}),
                folder.addBinding(effect, 'bladeCount', {min: 0, max: 9, step: 1}),
                folder.addBinding(effect, 'bokehBrightness', {min: 0, max: 5.0, step: 0.1})
            ];

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    effect[method]();
                    pane.refresh();
                });
            };
            addPresetButton('Game Default (65mm f/2.0, 10m)', 'setGameDefault');
            addPresetButton('Cinematic (85mm f/1.4, 10m)', 'setCinematic');
            addPresetButton('Portrait (85mm f/1.4, 7.5m)', 'setPortrait');
            addPresetButton('Landscape (24mm f/8.0, 25m)', 'setLandscape');
            addPresetButton('Macro (105mm f/2.0, 4.2m)', 'setMacro');
            addPresetButton('Sports (135mm f/2.8, 18m)', 'setSports');
            addPresetButton('Night Mode (75mm f/1.2, 9m)', 'setNightMode');

            const targetFolder = pane.addFolder({title: 'Viewfinder Aim Target', expanded: true});
            const addTargetButton = (title, stage) => {
                targetFolder.addButton({title}).on('click', () => {
                    aimAtStage(stage);
                });
            };
            addTargetButton('Aim : Near Left', STAGE_TARGETS[0]);
            addTargetButton('Aim : Near-Mid Right', STAGE_TARGETS[1]);
            addTargetButton('Aim : Center Character', STAGE_TARGETS[2]);
            addTargetButton('Aim : Mid-Far Left', STAGE_TARGETS[3]);
            addTargetButton('Aim : Far Right', STAGE_TARGETS[4]);
        }
    });
};
