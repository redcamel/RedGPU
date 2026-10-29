import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Depth of Field - Auto Focus (DOF 자동 초점) 예제
 * [EN] Depth of Field - Auto Focus (DOF Auto-Focus) example
 *
 * [KO] 화면 중앙(9-Point Zone) 깊이 버퍼를 GPU에서 실시간 측거하여 근경(3.6m) · 중경(9.0m) · 원경(16.5m) 피사체로 시선이 이동하거나 전경 물체가 교차할 때 초점을 자동 추적(Rack Focus)하는 `dof.useAutoFocus` 기능을 시연합니다.
 * [EN] Demonstrates `dof.useAutoFocus`, which meters the center screen (9-Point Zone) depth buffer on the GPU in real time to automatically track focus (Rack Focus) across Near (3.6m), Mid (9.0m), and Far (16.5m) subjects.
 */

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
afReticleLabel.textContent = 'AF-C : NEAR 3.6m';
afReticle.appendChild(afReticleLabel);
container.appendChild(afReticle);

const DIRECTOR_TARGET_X = [-1.65, 0.0, 1.65, 0.0];
const DIRECTOR_TARGET_Y = [-0.12, 0.05, -0.15, 0.05];
const DIRECTOR_LABELS = [
    'AF-C : NEAR 3.6m',
    'AF-C : MID 9.0m',
    'AF-C : FAR 16.5m',
    'AF-C : MID 9.0m'
];

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 9.0;
        controller.speedDistance = 0.4;
        controller.tilt = -2;
        controller.centerX = -1.65;
        controller.centerY = -0.15;

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
        //         뷰파인더 중앙 레티클이 가리키는 피사체 깊이(3.6m / 9.0m / 16.5m)로 렌즈 초점을 실시간 자동 추적
        // [EN] Right main view: Screen-center 9-Point Zone continuous auto-focus enabled (useAutoFocus = true)
        //         Automatically racks focus in real time to whatever subject depth (3.6m / 9.0m / 16.5m) is under the center reticle
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
                sceneState.targetX = DIRECTOR_TARGET_X[stageIndex];
                sceneState.targetY = DIRECTOR_TARGET_Y[stageIndex];

                if (stageIndex !== lastStageIndex) {
                    lastStageIndex = stageIndex;
                    if (autoEffect.useAutoFocus) {
                        afReticleLabel.textContent = DIRECTOR_LABELS[stageIndex];
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
        targetX: -1.65,
        targetY: -0.15,
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

    // [KO] 1. Stage 1 - 근경(Near 3.6m, 좌측 레인 x = -1.65, z = 5.4) 피사체 및 페데스탈
    // [EN] 1. Stage 1 - Near (3.6m, left lane x = -1.65, z = 5.4) subject and pedestal
    const nearPedestalMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    nearPedestalMat.color.setColorByHEX('#22262e');
    const nearPedestal = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.36, 0.42, 0.9, 24, 1),
        nearPedestalMat
    );
    nearPedestal.setPosition(-1.65, -1.15, 5.4);
    scene.addChild(nearPedestal);
    state.nearPedestal = nearPedestal;

    new RedGPU.GLTFLoader(
        redGPUContext,
        helmetUrl,
        (result) => {
            const nearMesh = scene.addChild(result.resultMesh);
            nearMesh.setPosition(-1.65, -0.12, 5.4);
            nearMesh.setScale(0.75);
            nearMesh.rotationY = 22;
            state.nearHelmet = nearMesh;
        },
        (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e)
    );

    // [KO] 2. Stage 2 - 중경(Mid 9.0m, 중앙 레인 x = 0.0, z = 0.0) 메인 캐릭터 및 서브 헬멧
    // [EN] 2. Stage 2 - Midground (9.0m, center lane x = 0.0, z = 0.0) main character and companion helmet
    const cesiumManUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf';
    new RedGPU.GLTFLoader(redGPUContext, cesiumManUrl, (result) => {
        const heroMesh = scene.addChild(result.resultMesh);
        heroMesh.setPosition(0.0, -1.6, 0.0);
        heroMesh.setScale(1.85);
    });

    new RedGPU.GLTFLoader(redGPUContext, helmetUrl, (result) => {
        const midSubMesh = scene.addChild(result.resultMesh);
        midSubMesh.setPosition(-0.82, -0.35, -0.2);
        midSubMesh.setScale(0.78);
        midSubMesh.rotationY = 16;
    });

    // [KO] 3. Stage 3 - 원경(Far 16.5m, 우측 레인 x = 1.65, z = -7.5) 타겟 헬멧 및 백드롭 모뉴먼트
    //         9-Point AF 샘플링 영역이 배경 하늘(1000m)로 빠지지 않고 16.5m 타겟에 정확히 락온되도록 모뉴먼트 기둥 배치
    // [EN] 3. Stage 3 - Far (16.5m, right lane x = 1.65, z = -7.5) target helmet and backdrop monument
    //         Includes a solid monument pillar so all 9-Point AF rays lock precisely onto the 16.5m stage
    const farMonumentMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    farMonumentMat.color.setColorByHEX('#1e222a');
    farMonumentMat.specularStrength = 0.8;
    const farMonument = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.75, 2.7, 0.45),
        farMonumentMat
    );
    farMonument.setPosition(1.65, -0.25, -8.15);
    scene.addChild(farMonument);

    const farTrimMat = new RedGPU.Material.PhongMaterial(redGPUContext);
    farTrimMat.color.setColorByHEX('#e67300');
    const farTrim = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.85, 0.12, 0.52),
        farTrimMat
    );
    farTrim.setPosition(1.65, 1.12, -8.15);
    scene.addChild(farTrim);

    new RedGPU.GLTFLoader(redGPUContext, helmetUrl, (result) => {
        const farMesh = scene.addChild(result.resultMesh);
        farMesh.setPosition(1.65, -0.15, -7.5);
        farMesh.setScale(0.92);
        farMesh.rotationY = -18;
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
        const posZ = -8.6 - (i / 38) * 20.0;
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
                controller.distance = 9.0;
                controller.pan = 0;
                controller.tilt = -2;
            });

            const lockTargetStage = (x, y, labelText) => {
                sceneState.mode = 'manualAim';
                sceneState.targetX = x;
                sceneState.targetY = y;
                controller.distance = 9.0;
                controller.pan = 0;
                controller.tilt = -2;
                if (autoEffect.useAutoFocus) {
                    afReticleLabel.textContent = labelText;
                }
            };

            directorFolder.addButton({title: 'Lock Stage 1 : Near Subject (3.6m)'}).on('click', () => {
                lockTargetStage(-1.65, -0.12, 'AF-C : NEAR 3.6m');
            });

            directorFolder.addButton({title: 'Lock Stage 2 : Mid Subject (9.0m)'}).on('click', () => {
                lockTargetStage(0.0, 0.05, 'AF-C : MID 9.0m');
            });

            directorFolder.addButton({title: 'Lock Stage 3 : Far Subject (16.5m)'}).on('click', () => {
                lockTargetStage(1.65, -0.15, 'AF-C : FAR 16.5m');
            });
        }
    });
};
