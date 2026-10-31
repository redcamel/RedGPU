import * as RedGPU from "../../../../dist/index.js?t=1793006500000";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1793006500000";

/**
 * [KO] Depth of Field (DOF) 예제
 * [EN] Depth of Field (DOF) example
 *
 * [KO] 35mm 풀프레임 Thin-Lens 착란원(CoC)과 전·배경 분리 다각형 조리개 보케 기반의 피사계 심도(DOF) 포스트 이펙트 및 카메라 렌즈 프리셋을 시연합니다.
 * [EN] Demonstrates the Depth of Field (DOF) post effect and camera lens presets based on 35mm full-frame Thin-Lens CoC and foreground/background separated polygonal aperture bokeh.
 */

const PRESET_CAMERA_TARGETS = {
    setGameDefault: {x: 0.0, y: -0.45, z: 0.35, distance: 10.0, pan: 0, tilt: -10},
    setCinematic: {x: 0.0, y: -0.42, z: 0.35, distance: 10.0, pan: -9, tilt: -2},
    setPortrait: {x: 1.15, y: -0.52, z: 3.0, distance: 7.5, pan: 14, tilt: -3},
    setLandscape: {x: 0.0, y: -0.50, z: -3.5, distance: 13.5, pan: -16, tilt: -18},
    setMacro: {x: -1.15, y: -0.65, z: 6.3, distance: 4.2, pan: -12, tilt: 1},
    setSports: {x: -1.45, y: -0.22, z: -7.45, distance: 18.0, pan: 6, tilt: -4},
    setNightMode: {x: -1.25, y: -0.45, z: 1.5, distance: 9.0, pan: -11, tilt: 3}
};

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const defaultTarget = PRESET_CAMERA_TARGETS.setGameDefault;
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.centerX = defaultTarget.x;
        controller.centerY = defaultTarget.y;
        controller.centerZ = defaultTarget.z;
        controller.distance = defaultTarget.distance;
        controller.speedDistance = 0.4;
        controller.distanceInterpolation = 0.01;
        controller.rotationInterpolation = 0.01;
        controller.pan = defaultTarget.pan;
        controller.tilt = defaultTarget.tilt;

        const cameraTransition = {
            x: defaultTarget.x,
            y: defaultTarget.y,
            z: defaultTarget.z,
            targetFocusDistance: 10.0,
            active: false,
            onUpdate: null
        };

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // [KO] 물리 보케 DOF(피사계 심도) 활성화 및 렌즈 파라미터 제어용 인스턴스 참조 획득
        //      - focusDistance: 초점이 맺히는 피사체 거리 (단위: m, 기본값: 10.0)
        //      - focalLength: 렌즈 초점 거리 (단위: mm, 망원일수록 배경 압축 및 착란원 확대, 기본값: 65.0)
        //      - aperture: 조리개 F-값 (낮을수록 심도가 얕아지고 보케 확대, 기본값: 2.0)
        //      - bladeCount: 조리개 날 개수 (0~2: 원형 보케, 3~9: 정다각형 보케, 기본값: 6)
        //      - bokehBrightness: 고휘도 하이라이트 보케 디스크 강조 강도 (기본값: 1.5)
        // [EN] Enable Physical Bokeh DOF and obtain the effect instance to control lens parameters
        //      - focusDistance: In-focus subject distance (in meters, default: 10.0)
        //      - focalLength: Lens focal length (in mm; longer telephoto increases bokeh size, default: 65.0)
        //      - aperture: Aperture F-number (lower values yield shallower depth of field, default: 2.0)
        //      - bladeCount: Aperture blade count (0~2: circular bokeh, 3~9: polygonal bokeh, default: 6)
        //      - bokehBrightness: High-luminance highlight bokeh disc boost intensity (default: 1.5)
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.builtInEffectManager.useDOF = true;
        const effect = viewEffect.builtInEffectManager.dof;
        redGPUContext.addView(viewEffect);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        setupOpticalBenchScene(redGPUContext, scene);

        const cancelTransition = () => {
            if (cameraTransition.active) {
                effect.focusDistance = cameraTransition.targetFocusDistance;
                cameraTransition.active = false;
                cameraTransition.onUpdate?.();
            }
        };
        canvas.addEventListener('pointerdown', cancelTransition);
        canvas.addEventListener('wheel', cancelTransition, {passive: true});

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

        let prevTime = -1;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const rawDt = prevTime < 0 ? (1 / 60) : (time - prevTime) / 1000;
            prevTime = time;
            const dt = Math.min(Math.max(rawDt, 1 / 240), 0.05);

            if (cameraTransition.active) {
                const alpha = 1.0 - Math.pow(0.0001, dt);
                const dx = cameraTransition.x - controller.centerX;
                const dy = cameraTransition.y - controller.centerY;
                const dz = cameraTransition.z - controller.centerZ;
                const df = cameraTransition.targetFocusDistance - effect.focusDistance;
                if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) + Math.abs(df) > 0.002) {
                    controller.centerX += dx * alpha;
                    controller.centerY += dy * alpha;
                    controller.centerZ += dz * alpha;
                    effect.focusDistance += df * alpha;
                    cameraTransition.onUpdate?.();
                } else {
                    controller.centerX = cameraTransition.x;
                    controller.centerY = cameraTransition.y;
                    controller.centerZ = cameraTransition.z;
                    effect.focusDistance = cameraTransition.targetFocusDistance;
                    cameraTransition.active = false;
                    cameraTransition.onUpdate?.();
                }
            }
        });

        renderTestPane(redGPUContext, viewEffect, effect, controller, cameraTransition, container);
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

    // [KO] 1. 광학 심도 눈금자(Optical Depth Ruler): 카메라 거리 3.0m ~ 25.0m 구간에 0.5m 간격으로 눈금 슬래브를 배치하여
    //         focusDistance 및 aperture 변화에 따른 합초 구간(In-Focus Band)과 전·배경 착란원 전이를 바닥에서 직관적으로 확인
    // [EN] 1. Optical Depth Ruler: Places floor scale bars every 0.5m from 3.0m to 25.0m camera depth to visually inspect
    //         the in-focus band and foreground/background CoC transition as focusDistance and aperture change
    const majorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 3.8, 0.035, 0.1);
    const minorBarGeo = new RedGPU.Primitive.Box(redGPUContext, 2.2, 0.02, 0.055);
    const minorBarMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    minorBarMat.color.setColorByHEX('#4a5260');
    const zoneColors = ['#e62e00', '#f07800', '#e6b800', '#00a844', '#0055e6'];

    for (let step = 0; step <= 44; step++) {
        const depthFromCam = 3.0 + step * 0.5;
        const z = 10.0 - depthFromCam;
        if (step % 2 === 0) {
            const colorIdx = Math.floor(step / 8) % zoneColors.length;
            const majorMat = new RedGPU.Material.PhongMaterial(redGPUContext);
            majorMat.color.setColorByHEX(zoneColors[colorIdx]);
            const bar = new RedGPU.Display.Mesh(redGPUContext, majorBarGeo, majorMat);
            bar.setPosition(0, -1.58, z);
            scene.addChild(bar);
        } else {
            const minorBar = new RedGPU.Display.Mesh(redGPUContext, minorBarGeo, minorBarMat);
            minorBar.setPosition(0, -1.585, z);
            scene.addChild(minorBar);
        }
    }

    // [KO] 2. 렌즈 프리셋별 목표 초점 거리(Macro 4.2m / Portrait 7.5m / NightMode 9.0m / Default·Cinematic 10.0m / Sports 18.0m)에 맞춘 피사체 배치
    // [EN] 2. Subject placement calibrated to each lens preset's target focusDistance (Macro 4.2m / Portrait 7.5m / NightMode 9.0m / Default·Cinematic 10.0m / Sports 18.0m)
    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    const helmetStages = [
        {x: -1.15, y: -0.65, z: 5.8, scale: 0.74, rotY: 26},   // 4.2m (Macro)
        {x: 1.15, y: -0.52, z: 2.5, scale: 0.78, rotY: -24},   // 7.5m (Portrait)
        {x: -1.25, y: -0.45, z: 1.0, scale: 0.82, rotY: 18},   // 9.0m (Night Mode)
        {x: 1.30, y: -0.35, z: -3.5, scale: 0.86, rotY: -20},  // 13.5m (Mid-Far)
        {x: -1.45, y: -0.22, z: -8.0, scale: 0.92, rotY: 16}   // 18.0m (Sports)
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
        heroMesh.setPosition(0.0, -1.6, 0.0); // 10.0m (Game Default / Cinematic)
        heroMesh.setScale(1.85);
    });

    // [KO] 3. 후방 다중 깊이 보케 아치(Bokeh Archway): bladeCount(원형/정다각형)와 bokehBrightness에 따른 하이라이트 보케 디스크 시각화
    // [EN] 3. Multi-depth Bokeh Archway: Visualizes circular/polygonal highlight bokeh discs driven by bladeCount and bokehBrightness
    const bokehOrbGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.22, 16, 16);
    const bokehPalette = ['#e65c00', '#d91400', '#e6a800', '#0055e6', '#00a838'];

    for (let archIdx = 0; archIdx < 4; archIdx++) {
        const archZ = -5.5 - archIdx * 5.0;
        const archRadius = 3.2 + archIdx * 0.85;
        const orbCount = 11;

        for (let j = 0; j < orbCount; j++) {
            const t = j / (orbCount - 1);
            const theta = Math.PI * (0.08 + t * 0.84);
            const posX = Math.cos(theta) * archRadius;
            const posY = -1.2 + Math.sin(theta) * (archRadius * 0.82);

            const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
            mat.color.setColorByHEX(bokehPalette[(archIdx * 3 + j) % bokehPalette.length]);
            mat.specularStrength = 0.9;
            mat.shininess = 128;

            const orb = new RedGPU.Display.Mesh(redGPUContext, bokehOrbGeo, mat);
            orb.setPosition(posX, posY, archZ);
            orb.setScale(0.65 + (archIdx % 3) * 0.22);
            scene.addChild(orb);
        }
    }
};

const renderTestPane = (redGPUContext, targetView, effect, controller, cameraTransition, container) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'PostEffect',
            normalTitle: 'Original',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.builtInEffectManager, 'useDOF').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                presetFolder.disabled = !v.value;
            });

            let isRefreshingUI = false;
            const focusDistanceControl = folder.addBinding(effect, 'focusDistance', {min: 2.0, max: 30.0, step: 0.1});
            focusDistanceControl.on('change', (ev) => {
                if (!isRefreshingUI) {
                    cameraTransition.targetFocusDistance = ev.value;
                    cameraTransition.active = false;
                }
            });

            const controls = [
                focusDistanceControl,
                folder.addBinding(effect, 'focalLength', {min: 12, max: 200, step: 1}),
                folder.addBinding(effect, 'aperture', {min: 0.7, max: 22.0, step: 0.1}),
                folder.addBinding(effect, 'bladeCount', {min: 0, max: 9, step: 1}),
                folder.addBinding(effect, 'bokehBrightness', {min: 0, max: 5.0, step: 0.1})
            ];

            cameraTransition.onUpdate = () => {
                isRefreshingUI = true;
                focusDistanceControl.refresh();
                isRefreshingUI = false;
            };

            const presetFolder = folder.addFolder({title: 'Presets', expanded: true});
            const addPresetButton = (title, method) => {
                presetFolder.addButton({title}).on('click', () => {
                    const prevFocusDist = effect.focusDistance;
                    effect[method]();
                    const targetFocusDist = effect.focusDistance;
                    const camTarget = PRESET_CAMERA_TARGETS[method];
                    if (camTarget) {
                        effect.focusDistance = prevFocusDist;
                        cameraTransition.targetFocusDistance = targetFocusDist;
                        cameraTransition.x = camTarget.x;
                        cameraTransition.y = camTarget.y;
                        cameraTransition.z = camTarget.z;
                        cameraTransition.active = true;
                        controller.distance = camTarget.distance;
                        const angleDiff = ((camTarget.pan - controller.pan + 540) % 360) - 180;
                        controller.pan = controller.pan + angleDiff;
                        controller.tilt = camTarget.tilt;
                    }
                    isRefreshingUI = true;
                    pane.refresh();
                    isRefreshingUI = false;
                });
            };

            addPresetButton('Game Default (65mm f/2.0, 10m)', 'setGameDefault');
            addPresetButton('Cinematic (85mm f/1.4, 10m)', 'setCinematic');
            addPresetButton('Portrait (85mm f/1.4, 7.5m)', 'setPortrait');
            addPresetButton('Landscape (24mm f/8.0, 25m)', 'setLandscape');
            addPresetButton('Macro (105mm f/2.0, 4.2m)', 'setMacro');
            addPresetButton('Sports (135mm f/2.8, 18m)', 'setSports');
            addPresetButton('Night Mode (75mm f/1.2, 9m)', 'setNightMode');
        }
    });
};
