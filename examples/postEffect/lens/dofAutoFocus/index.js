import * as RedGPU from "../../../../dist/index.js?t=1793006500000";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1793006500000";

/**
 * [KO] Depth of Field - Auto Focus (DOF 자동 초점) 예제
 * [EN] Depth of Field - Auto Focus (DOF Auto-Focus) example
 *
 * [KO] 화면 정중앙(9-Point Zone) 깊이 버퍼를 GPU에서 실시간 측거하여 시선 이동 및 카메라 줌·회전에 따라 뷰파인더 중앙 피사체에 자동으로 초점을 맞추는 `dof.useAutoFocus` 기능을 시연합니다.
 * [EN] Demonstrates `dof.useAutoFocus`, which meters the center screen (9-Point Zone) depth buffer on the GPU in real time to automatically track focus on whatever subject is inside the center viewfinder reticle during camera panning, orbiting, and zooming.
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
        controller.distanceInterpolation = 0.0001;
        controller.rotationInterpolation = 0.0001;
        controller.pan = initialStage.pan;
        controller.tilt = initialStage.tilt;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] 물리 보케 DOF 및 GPU 기반 화면 중앙 9-Point Zone 연속 자동 초점(useAutoFocus = true) 활성화
        //      - useAutoFocus = true: 매 프레임 화면 정중앙(UV 0.5, 0.5 주변 9개 측거점)의 깊이 버퍼를 GPU에서 실시간 계측하여
        //        카메라 회전·줌·이동 시 별도의 focusDistance 수동 계산 없이 중앙 레티클 내 피사체에 자동으로 초점을 추종합니다.
        // [EN] Enable Physical Bokeh DOF and GPU-driven screen-center 9-Point Zone continuous auto-focus (useAutoFocus = true)
        //      - useAutoFocus = true: Meters the depth buffer at 9 points around screen center (UV 0.5, 0.5) on the GPU every frame,
        //        automatically tracking focus on the subject inside the center reticle during camera rotation, zoom, or panning.
        view.builtInEffectManager.useDOF = true;
        const effect = view.builtInEffectManager.dof;
        effect.setCinematic();
        effect.aperture = 1.4;
        effect.useAutoFocus = true;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const sceneState = setupAutoFocusScene(redGPUContext, scene);

        const updateReticleUI = () => {
            if (!view.builtInEffectManager.useDOF) {
                viewfinder.style.display = 'none';
                return;
            }
            viewfinder.style.display = 'block';
            if (effect.useAutoFocus) {
                viewfinder.className = 'af-viewfinder is-af';
                viewfinderLabel.textContent = sceneState.activeLabel;
            } else {
                viewfinder.className = 'af-viewfinder is-mf';
                viewfinderLabel.textContent = 'MF [MANUAL FOCUS]';
            }
        };

        const aimAtStage = (stage, applyCameraPose) => {
            sceneState.targetX = stage.x;
            sceneState.targetY = stage.y;
            sceneState.targetZ = stage.z;
            sceneState.transitionActive = true;
            sceneState.activeLabel = stage.label;
            if (applyCameraPose) {
                controller.distance = stage.distance;
                const angleDiff = ((stage.pan - controller.pan + 540) % 360) - 180;
                controller.pan = controller.pan + angleDiff;
                controller.tilt = stage.tilt;
            }
            updateReticleUI();
        };

        // [KO] 사용자가 마우스 드래그나 휠로 카메라를 직접 조작하면 자동 순회(Auto Tour) 및 프리셋 이동 보간을 멈추고 자유 조작 모드로 즉시 전환
        // [EN] Immediately stop Auto Tour and preset transition interpolation and switch to free control when the user drags or scrolls
        const onUserInteract = () => {
            sceneState.transitionActive = false;
            if (sceneState.mode === 'tour') {
                sceneState.mode = 'manualAim';
                sceneState.activeLabel = 'AF-C [9-POINT ZONE] : FREE AIM';
                updateReticleUI();
            }
        };
        canvas.addEventListener('pointerdown', onUserInteract);
        canvas.addEventListener('wheel', onUserInteract, {passive: true});

        let lastStageIndex = -1;
        let prevTime = -1;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const rawDt = prevTime < 0 ? (1 / 60) : (time - prevTime) / 1000;
            prevTime = time;
            const dt = Math.min(Math.max(rawDt, 1 / 240), 0.05);

            if (sceneState.mode === 'tour') {
                const stageIndex = Math.floor(time / 2400) % STAGE_TARGETS.length;
                if (stageIndex !== lastStageIndex) {
                    lastStageIndex = stageIndex;
                    aimAtStage(STAGE_TARGETS[stageIndex], true);
                }
            } else {
                lastStageIndex = -1;
            }

            if (sceneState.transitionActive) {
                const alpha = 1.0 - Math.pow(0.0001, dt);
                const dx = sceneState.targetX - controller.centerX;
                const dy = sceneState.targetY - controller.centerY;
                const dz = sceneState.targetZ - controller.centerZ;
                if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 0.002) {
                    controller.centerX += dx * alpha;
                    controller.centerY += dy * alpha;
                    controller.centerZ += dz * alpha;
                } else {
                    controller.centerX = sceneState.targetX;
                    controller.centerY = sceneState.targetY;
                    controller.centerZ = sceneState.targetZ;
                    sceneState.transitionActive = false;
                }
            }
        });

        renderTestPane(redGPUContext, view, effect, sceneState, aimAtStage, updateReticleUI);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const setupAutoFocusScene = (redGPUContext, scene) => {
    const state = {
        mode: 'tour',
        targetX: STAGE_TARGETS[0].x,
        targetY: STAGE_TARGETS[0].y,
        targetZ: STAGE_TARGETS[0].z,
        transitionActive: false,
        activeLabel: STAGE_TARGETS[0].label
    };

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

    return state;
};

const renderTestPane = (redGPUContext, targetView, effect, sceneState, aimAtStage, updateReticleUI) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const folder = pane.addFolder({title: 'PostEffect', expanded: true});

            folder.addBinding(targetView.builtInEffectManager, 'useDOF').on('change', (v) => {
                controls.forEach((c) => c.disabled = !v.value);
                focusDistanceControl.disabled = !v.value || effect.useAutoFocus;
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

            const targetFolder = pane.addFolder({title: 'Viewfinder Aim Target', expanded: true});

            targetFolder.addButton({title: 'Auto Focus Tour (Cycle 5 Stages)'}).on('click', () => {
                sceneState.mode = 'tour';
                aimAtStage(STAGE_TARGETS[0], true);
            });

            const addTargetButton = (title, stage) => {
                targetFolder.addButton({title}).on('click', () => {
                    sceneState.mode = 'manualAim';
                    aimAtStage(stage, true);
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
