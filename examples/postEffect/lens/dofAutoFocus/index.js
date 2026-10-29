import * as RedGPU from "../../../../dist/index.js?t=1792989250000";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792989250000";

/**
 * [KO] Depth of Field - Auto Focus (DOF 자동 초점) 예제
 * [EN] Depth of Field - Auto Focus (DOF Auto-Focus) example
 *
 * [KO] 화면 중앙(9-Point Zone) 깊이 버퍼를 GPU에서 실시간 측거하여 근경(3.6m) · 중경(9.0m) · 원경(16.5m) 피사체로 시선이 이동하거나 타겟 스테이지를 고정(Lock Stage)할 때 피사체 전면 표면에 정확히 초점을 맞추는 `dof.useAutoFocus` 기능을 시연합니다.
 * [EN] Demonstrates `dof.useAutoFocus`, which meters the center screen (9-Point Zone) depth buffer on the GPU in real time to accurately focus on the front surface of Near (3.6m), Mid (9.0m), and Far (16.5m) subjects during camera panning or stage locking.
 */

const DEG_TO_RAD = Math.PI / 180;
const CAMERA_DISTANCE = 9.0;
const CAMERA_TILT_DEG = -2;
const TAN_CAMERA_TILT = Math.tan(CAMERA_TILT_DEG * DEG_TO_RAD);

// [KO] 각 스테이지의 목표 초점 거리(3.6m / 9.0m / 16.5m)에 해당하는 월드 전면 표면 Z 좌표(z = CAMERA_DISTANCE - focusDist) 및
//      카메라 틸트(-2도) 광축이 피사체 정중앙(aimY)을 정확히 관통하도록 보정된 OrbitController 목표 centerY(aimY + zFront * tan(tilt))
// [EN] World front-surface Z coordinates (z = CAMERA_DISTANCE - focusDist) for each stage's target focus distance (3.6m / 9.0m / 16.5m),
//      and tilt-compensated OrbitController target centerY (aimY + zFront * tan(tilt)) so the optical axis passes dead-center through aimY
const STAGE_TARGETS = [
    {
        x: -1.65,
        aimY: -0.12,
        zFront: CAMERA_DISTANCE - 3.6,
        targetY: -0.12 + (CAMERA_DISTANCE - 3.6) * TAN_CAMERA_TILT,
        focusDist: 3.6,
        label: 'AF-C : NEAR 3.6m'
    },
    {
        x: 0.0,
        aimY: 0.05,
        zFront: CAMERA_DISTANCE - 9.0,
        targetY: 0.05 + (CAMERA_DISTANCE - 9.0) * TAN_CAMERA_TILT,
        focusDist: 9.0,
        label: 'AF-C : MID 9.0m'
    },
    {
        x: 1.65,
        aimY: -0.15,
        zFront: CAMERA_DISTANCE - 16.5,
        targetY: -0.15 + (CAMERA_DISTANCE - 16.5) * TAN_CAMERA_TILT,
        focusDist: 16.5,
        label: 'AF-C : FAR 16.5m'
    }
];

const DIRECTOR_SEQUENCE = [
    STAGE_TARGETS[0],
    STAGE_TARGETS[1],
    STAGE_TARGETS[2],
    STAGE_TARGETS[1]
];

/**
 * [KO] 로드된 glTF 모델의 로컬 TRS 및 지오메트리 볼륨으로부터 카메라 방향(+Z) 전면 표면 돌출 반경(maxZ)과 하단(minY) 경계를 산출합니다.
 * [EN] Computes the camera-facing (+Z) front-surface protrusion radius (maxZ) and bottom (minY) bound from a loaded glTF model's local TRS and geometry volumes.
 */
const measureModelFrontAndBottom = (rootMesh) => {
    let minY = Infinity;
    let maxZ = -Infinity;
    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    const traverse = (node, parentM, isRoot) => {
        let m = parentM;
        if (!isRoot) {
            const rx = (node.rotationX || 0) * DEG_TO_RAD;
            const ry = (node.rotationY || 0) * DEG_TO_RAD;
            const rz = (node.rotationZ || 0) * DEG_TO_RAD;
            const cx = Math.cos(rx), sx = Math.sin(rx);
            const cy = Math.cos(ry), sy = Math.sin(ry);
            const cz = Math.cos(rz), sz = Math.sin(rz);
            const sxS = node.scaleX ?? 1, syS = node.scaleY ?? 1, szS = node.scaleZ ?? 1;

            const l0 = (cy * cz) * sxS, l1 = (cx * sz + sx * sy * cz) * sxS, l2 = (sx * sz - cx * sy * cz) * sxS;
            const l4 = (-cy * sz) * syS, l5 = (cx * cz - sx * sy * sz) * syS, l6 = (sx * cz + cx * sy * sz) * syS;
            const l8 = sy * szS, l9 = (-sx * cy) * szS, l10 = (cx * cy) * szS;
            const l12 = node.x || 0, l13 = node.y || 0, l14 = node.z || 0;

            m = [
                l0 * parentM[0] + l1 * parentM[4] + l2 * parentM[8],
                l0 * parentM[1] + l1 * parentM[5] + l2 * parentM[9],
                l0 * parentM[2] + l1 * parentM[6] + l2 * parentM[10],
                0,
                l4 * parentM[0] + l5 * parentM[4] + l6 * parentM[8],
                l4 * parentM[1] + l5 * parentM[5] + l6 * parentM[9],
                l4 * parentM[2] + l5 * parentM[6] + l6 * parentM[10],
                0,
                l8 * parentM[0] + l9 * parentM[4] + l10 * parentM[8],
                l8 * parentM[1] + l9 * parentM[5] + l10 * parentM[9],
                l8 * parentM[2] + l9 * parentM[6] + l10 * parentM[10],
                0,
                l12 * parentM[0] + l13 * parentM[4] + l14 * parentM[8] + parentM[12],
                l12 * parentM[1] + l13 * parentM[5] + l14 * parentM[9] + parentM[13],
                l12 * parentM[2] + l13 * parentM[6] + l14 * parentM[10] + parentM[14],
                1
            ];
        }

        const vol = node.geometry?.volume;
        if (vol) {
            for (let i = 0; i < 8; i++) {
                const vx = (i & 1) ? vol.maxX : vol.minX;
                const vy = (i & 2) ? vol.maxY : vol.minY;
                const vz = (i & 4) ? vol.maxZ : vol.minZ;
                const wy = m[1] * vx + m[5] * vy + m[9] * vz + m[13];
                const wz = m[2] * vx + m[6] * vy + m[10] * vz + m[14];
                if (wy < minY) minY = wy;
                if (wz > maxZ) maxZ = wz;
            }
        }

        const children = node.children;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                traverse(children[i], m, false);
            }
        }
    };

    traverse(rootMesh, identity, true);
    return {
        minY: Number.isFinite(minY) ? minY : -1.0,
        maxZ: Number.isFinite(maxZ) ? maxZ : 1.0
    };
};

const container = document.createElement('div');
document.body.appendChild(container);

const canvas = document.createElement('canvas');
container.appendChild(canvas);

const mfReticle = document.createElement('div');
mfReticle.className = 'vf-reticle vf-reticle-mf';
const mfReticleLabel = document.createElement('div');
mfReticleLabel.className = 'vf-reticle-label';
mfReticleLabel.textContent = 'MF FIXED : 9.0m';
mfReticle.appendChild(mfReticleLabel);
container.appendChild(mfReticle);

const afReticle = document.createElement('div');
afReticle.className = 'vf-reticle vf-reticle-af';
const afReticleLabel = document.createElement('div');
afReticleLabel.className = 'vf-reticle-label';
afReticleLabel.textContent = STAGE_TARGETS[0].label;
afReticle.appendChild(afReticleLabel);
container.appendChild(afReticle);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = CAMERA_DISTANCE;
        controller.speedDistance = 0.4;
        controller.tilt = CAMERA_TILT_DEG;
        controller.centerX = STAGE_TARGETS[0].x;
        controller.centerY = STAGE_TARGETS[0].targetY;

        const scene = new RedGPU.Display.Scene();
        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');

        // [KO] 좌측 비교 뷰: 수동 고정 초점 (useAutoFocus = false, focusDistance = 9.0m 고정)
        //         카메라가 근경(3.6m)이나 원경(16.5m)을 조준할 때 초점이 맞지 않아 흐려지는 대조군 역할
        // [EN] Left comparison view: Manual Fixed Focus (useAutoFocus = false, locked at focusDistance = 9.0m)
        //         Serves as a baseline that goes out of focus when the camera aims at Near (3.6m) or Far (16.5m)
        const viewManual = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewManual.ibl = ibl;
        viewManual.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewManual.postEffectManager.useDOF = true;
        const manualEffect = viewManual.postEffectManager.dof;
        manualEffect.setCinematic();
        manualEffect.aperture = 1.2;
        manualEffect.focusDistance = 9.0;
        manualEffect.useAutoFocus = false;
        redGPUContext.addView(viewManual);

        // [KO] 우측 메인 뷰: 화면 중앙 9-Point Zone 연속 자동 초점 활성화 (useAutoFocus = true)
        //         뷰파인더 중앙 레티클이 가리키는 피사체 전면 표면 깊이(3.6m / 9.0m / 16.5m)로 렌즈 초점을 실시간 자동 추적
        // [EN] Right main view: Screen-center 9-Point Zone continuous auto-focus enabled (useAutoFocus = true)
        //         Automatically racks focus in real time to the front-surface depth (3.6m / 9.0m / 16.5m) under the center reticle
        const viewAuto = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewAuto.ibl = ibl;
        viewAuto.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewAuto.postEffectManager.useDOF = true;
        const autoEffect = viewAuto.postEffectManager.dof;
        autoEffect.setCinematic();
        autoEffect.aperture = 1.2;
        autoEffect.focusDistance = 9.0;
        autoEffect.useAutoFocus = true;
        redGPUContext.addView(viewAuto);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const sceneState = setupAutoFocusTheaterScene(redGPUContext, scene);

        const updateLayout = () => {
            const isNarrow = window.innerWidth <= 768;
            if (isNarrow) {
                viewManual.setSize('100%', '50%');
                viewManual.setPosition(0, 0);
                viewAuto.setSize('100%', '50%');
                viewAuto.setPosition(0, '50%');
            } else {
                viewManual.setSize('50%', '100%');
                viewManual.setPosition(0, 0);
                viewAuto.setSize('50%', '100%');
                viewAuto.setPosition('50%', 0);
            }
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);

        let lastStageIndex = -1;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (sceneState.mode === 'director') {
                const stageIndex = Math.floor(time / 3200) % 4;
                const activeStage = DIRECTOR_SEQUENCE[stageIndex];
                sceneState.targetX = activeStage.x;
                sceneState.targetY = activeStage.targetY;

                if (stageIndex !== lastStageIndex) {
                    lastStageIndex = stageIndex;
                    if (autoEffect.useAutoFocus) {
                        afReticleLabel.textContent = activeStage.label;
                    }
                }
            } else {
                lastStageIndex = -1;
            }

            if (sceneState.nearHelmet) {
                sceneState.nearHelmet.rotationY = 22 + Math.sin(time * 0.0015) * 14;
            }

            const dx = sceneState.targetX - controller.centerX;
            const dy = sceneState.targetY - controller.centerY;
            controller.centerX = Math.abs(dx) > 0.0005 ? controller.centerX + dx * 0.06 : sceneState.targetX;
            controller.centerY = Math.abs(dy) > 0.0005 ? controller.centerY + dy * 0.06 : sceneState.targetY;

            if (sceneState.farHelmet) {
                sceneState.farHelmet.rotationY = -18 + Math.cos(time * 0.0012) * 12;
            }
        });

        renderTestPane(
            redGPUContext,
            viewManual,
            viewAuto,
            manualEffect,
            autoEffect,
            controller,
            sceneState,
            mfReticle,
            afReticle,
            afReticleLabel,
            container
        );
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const setupAutoFocusTheaterScene = (redGPUContext, scene) => {
    const state = {
        mode: 'director',
        targetX: STAGE_TARGETS[0].x,
        targetY: STAGE_TARGETS[0].targetY,
        nearHelmet: null,
        nearPedestal: null,
        farHelmet: null
    };

    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
    groundMaterial.color.setColorByHEX('#0a0b0e');
    groundMaterial.specularStrength = 0.65;
    groundMaterial.shininess = 96;
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 120, 120),
        groundMaterial
    );
    ground.y = -1.6;
    scene.addChild(ground);

    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

    // [KO] 1. Stage 1 - 근경(Near 3.6m, 좌측 레인 x = -1.65): 모델의 전면 바이저 표면이 정확히 3.6m(z = 5.4)에 위치하도록 모델 반경만큼 보정
    // [EN] 1. Stage 1 - Near (3.6m, left lane x = -1.65): offset by model front radius so the front visor surface sits at exact 3.6m (z = 5.4)
    const nearPedestalMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    nearPedestalMat.color.setColorByHEX('#22262e');
    const nearPedestal = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.36, 0.42, 0.9, 24, 1),
        nearPedestalMat
    );
    nearPedestal.setPosition(STAGE_TARGETS[0].x, -1.15, STAGE_TARGETS[0].zFront - 0.72);
    scene.addChild(nearPedestal);
    state.nearPedestal = nearPedestal;

    new RedGPU.GLTFLoader(
        redGPUContext,
        helmetUrl,
        (result) => {
            const nearMesh = scene.addChild(result.resultMesh);
            const nearScale = 0.75;
            const bounds = measureModelFrontAndBottom(nearMesh);
            const frontRadius = bounds.maxZ * nearScale * 0.9;
            const nearZ = STAGE_TARGETS[0].zFront - frontRadius;

            nearMesh.setScale(nearScale);
            nearMesh.setPosition(STAGE_TARGETS[0].x, STAGE_TARGETS[0].aimY, nearZ);
            nearMesh.rotationY = 22;
            nearPedestal.setPosition(STAGE_TARGETS[0].x, -1.15, nearZ);
            state.nearHelmet = nearMesh;
        },
        (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e)
    );

    // [KO] 2. Stage 2 - 중경(Mid 9.0m, 중앙 레인 x = 0.0): 캐릭터와 서브 헬멧의 전면 표면이 정확히 9.0m(z = 0.0)에 위치하도록 모델 두께만큼 보정
    // [EN] 2. Stage 2 - Midground (9.0m, center lane x = 0.0): offset by model thickness so the front surfaces sit at exact 9.0m (z = 0.0)
    const cesiumManUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf';
    new RedGPU.GLTFLoader(redGPUContext, cesiumManUrl, (result) => {
        const heroMesh = scene.addChild(result.resultMesh);
        const heroScale = 1.85;
        const bounds = measureModelFrontAndBottom(heroMesh);
        const frontOffset = bounds.maxZ * heroScale * 0.85;

        heroMesh.setScale(heroScale);
        heroMesh.setPosition(STAGE_TARGETS[1].x, -1.6, STAGE_TARGETS[1].zFront - frontOffset);
    });

    new RedGPU.GLTFLoader(redGPUContext, helmetUrl, (result) => {
        const midSubMesh = scene.addChild(result.resultMesh);
        const midSubScale = 0.78;
        const bounds = measureModelFrontAndBottom(midSubMesh);
        const frontRadius = bounds.maxZ * midSubScale * 0.9;

        midSubMesh.setScale(midSubScale);
        midSubMesh.setPosition(-0.82, -0.35, STAGE_TARGETS[1].zFront - frontRadius);
        midSubMesh.rotationY = 16;
    });

    // [KO] 3. Stage 3 - 원경(Far 16.5m, 우측 레인 x = 1.65): 원경 헬멧 전면 표면이 정확히 16.5m(z = -7.5)에 위치하도록 모델 반경만큼 보정
    // [EN] 3. Stage 3 - Far (16.5m, right lane x = 1.65): offset by model front radius so the far helmet's front surface sits at exact 16.5m (z = -7.5)
    const farMonumentMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    farMonumentMat.color.setColorByHEX('#1e222a');
    farMonumentMat.specularStrength = 0.8;
    const farMonument = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.75, 2.7, 0.45),
        farMonumentMat
    );
    farMonument.setPosition(STAGE_TARGETS[2].x, -0.25, -9.45);
    scene.addChild(farMonument);

    const farTrimMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    farTrimMat.color.setColorByHEX('#e67300');
    const farTrim = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.85, 0.12, 0.52),
        farTrimMat
    );
    farTrim.setPosition(STAGE_TARGETS[2].x, 1.12, -9.45);
    scene.addChild(farTrim);

    new RedGPU.GLTFLoader(redGPUContext, helmetUrl, (result) => {
        const farMesh = scene.addChild(result.resultMesh);
        const farScale = 0.92;
        const bounds = measureModelFrontAndBottom(farMesh);
        const frontRadius = bounds.maxZ * farScale * 0.9;
        const farZ = STAGE_TARGETS[2].zFront - frontRadius;

        farMesh.setScale(farScale);
        farMesh.setPosition(STAGE_TARGETS[2].x, STAGE_TARGETS[2].aimY, farZ);
        farMesh.rotationY = -18;
        farMonument.setPosition(STAGE_TARGETS[2].x, -0.25, farZ - frontRadius - 0.35);
        farTrim.setPosition(STAGE_TARGETS[2].x, 1.12, farZ - frontRadius - 0.35);
        state.farHelmet = farMesh;
    });

    // [KO] 4. 후방 다각형 보케 구체 월: 근경/중경 합초 시 배경에서 다각형 보케를 형성하는 컬러 구체 배치
    // [EN] 4. Rear polygonal bokeh sphere wall: Colored spheres that form polygonal bokeh discs when focused at Near or Mid stages
    const bokehLightGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.22, 16, 16);
    const bokehColors = ['#e65c00', '#d91400', '#e6a800', '#0055e6', '#00a838'];

    for (let i = 0; i < 38; i++) {
        const mat = new RedGPU.Material.PhongMaterial(redGPUContext);
        const hex = bokehColors[i % bokehColors.length];
        mat.color.setColorByHEX(hex);
        mat.specularStrength = 0.9;
        mat.shininess = 128;

        const lightOrb = new RedGPU.Display.Mesh(redGPUContext, bokehLightGeometry, mat);
        const angle = i * 2.39996;
        const radiusX = 1.5 + (i % 7) * 1.3;
        const posX = Math.cos(angle) * radiusX;
        const posY = -0.6 + ((i * 37) % 100) / 100 * 5.6;
        const posZ = -10.2 - (i / 38) * 20.0;
        const orbScale = 0.65 + (i % 4) * 0.28;

        lightOrb.setPosition(posX, posY, posZ);
        lightOrb.setScale(orbScale);
        scene.addChild(lightOrb);
    }

    return state;
};

const renderTestPane = (
    redGPUContext,
    viewManual,
    viewAuto,
    manualEffect,
    autoEffect,
    controller,
    sceneState,
    mfReticle,
    afReticle,
    afReticleLabel,
    container
) => {
    new RedGPUExampleHelper(redGPUContext, {
        compareLabel: {
            title: 'Auto Focus (AF-C 9-Point Zone)',
            normalTitle: 'Manual Focus (Fixed 9.0m)',
            targetContainer: container
        },
        gui: (pane) => {
            const folder = pane.addFolder({title: 'Auto Focus DOF', expanded: true});

            folder.addBinding(viewAuto.postEffectManager, 'useDOF').on('change', (v) => {
                viewManual.postEffectManager.useDOF = v.value;
                controls.forEach((c) => c.disabled = !v.value);
                directorFolder.disabled = !v.value;
                mfReticle.style.display = v.value ? 'block' : 'none';
                afReticle.style.display = v.value ? 'block' : 'none';
            });

            const useAutoFocusControl = folder.addBinding(autoEffect, 'useAutoFocus').on('change', (v) => {
                afReticleLabel.textContent = v.value ? 'AF-C : ACTIVE' : 'MF : PAUSED';
            });

            const syncLensProperty = (prop, min, max, step) => {
                return folder.addBinding(autoEffect, prop, {min, max, step}).on('change', (v) => {
                    manualEffect[prop] = v.value;
                });
            };

            const controls = [
                useAutoFocusControl,
                syncLensProperty('focalLength', 12, 200, 1),
                syncLensProperty('aperture', 0.7, 22.0, 0.1),
                syncLensProperty('maxCoC', 8, 64, 1),
                syncLensProperty('bladeCount', 0, 9, 1),
                syncLensProperty('bokehBrightness', 0, 5.0, 0.1)
            ];

            const directorFolder = pane.addFolder({title: 'AF-C Camera Director & Targets', expanded: true});

            directorFolder.addButton({title: 'Auto-Director (3-Depth Tour: 3.6m / 9.0m / 16.5m)'}).on('click', () => {
                sceneState.mode = 'director';
                controller.distance = CAMERA_DISTANCE;
                controller.pan = 0;
                controller.tilt = CAMERA_TILT_DEG;
            });

            const lockTargetStage = (stage) => {
                sceneState.mode = 'manualAim';
                sceneState.targetX = stage.x;
                sceneState.targetY = stage.targetY;
                controller.distance = CAMERA_DISTANCE;
                controller.pan = 0;
                controller.tilt = CAMERA_TILT_DEG;
                autoEffect.focusDistance = stage.focusDist;
                if (autoEffect.useAutoFocus) {
                    afReticleLabel.textContent = stage.label;
                }
            };

            directorFolder.addButton({title: 'Lock Stage 1 : Near Subject (3.6m)'}).on('click', () => {
                lockTargetStage(STAGE_TARGETS[0]);
            });

            directorFolder.addButton({title: 'Lock Stage 2 : Mid Subject (9.0m)'}).on('click', () => {
                lockTargetStage(STAGE_TARGETS[1]);
            });

            directorFolder.addButton({title: 'Lock Stage 3 : Far Subject (16.5m)'}).on('click', () => {
                lockTargetStage(STAGE_TARGETS[2]);
            });
        }
    });
};
