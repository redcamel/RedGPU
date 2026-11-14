import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] AutoExposure (자동 노출 및 눈 적응) 예제
 * [EN] AutoExposure (Auto-Exposure & Eye Adaptation) example
 *
 * [KO] 256-bin 로그 휘도 히스토그램 분석, 백분위 절삭, 측광 모드 및 노출 보정을 시연합니다.
 * [EN] Demonstrates 256-bin log-luminance histogram analysis, percentile trimming, metering modes, and exposure compensation.
 */

const VIEWPOINT_STAGES = [
    {
        title: 'Midday Courtyard (100k lux)',
        centerX: 0.0,
        centerY: -0.15,
        centerZ: 3.4,
        distance: 5.2,
        pan: -24,
        tilt: -12,
        sunLux: 100000,
        sunElevation: 44,
        sunAzimuth: 38
    },
    {
        title: 'Window Backlight (Interior -> Sky)',
        centerX: 0.0,
        centerY: -0.05,
        centerZ: -0.6,
        distance: 4.2,
        pan: 168,
        tilt: 4,
        sunLux: 85000,
        sunElevation: 18,
        sunAzimuth: -165
    },
    {
        title: 'Golden Sunset (12k lux)',
        centerX: 0.0,
        centerY: -0.1,
        centerZ: 2.6,
        distance: 5.8,
        pan: 26,
        tilt: -6,
        sunLux: 12000,
        sunElevation: 3.5,
        sunAzimuth: -145
    },
    {
        title: 'Night Gallery Vault (PointLights)',
        centerX: 0.0,
        centerY: -0.15,
        centerZ: -6.0,
        distance: 3.4,
        pan: 16,
        tilt: -10,
        sunLux: 650,
        sunElevation: 2.0,
        sunAzimuth: 45
    }
];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const initialStage = VIEWPOINT_STAGES[0];
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.centerX = initialStage.centerX;
        controller.centerY = initialStage.centerY;
        controller.centerZ = initialStage.centerZ;
        controller.distance = initialStage.distance;
        controller.pan = initialStage.pan;
        controller.tilt = initialStage.tilt;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = initialStage.sunElevation;
        directionalLight.azimuth = initialStage.sunAzimuth;
        directionalLight.lux = initialStage.sunLux;
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere.cloudCoverage = 0.32;
        view.skyAtmosphere.cloudDensity = 0.65;
        redGPUContext.addView(view);

        view.builtInEffectManager.useBloom = true;
        const autoExposure = view.builtInEffectManager.autoExposure;

        setupColonnadeGalleryScene(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, view, autoExposure, controller, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createPBR = (redGPUContext, baseColor, metallic, roughness) => {
    const mat = new RedGPU.Material.PBRMaterial(redGPUContext);
    mat.baseColorFactor = baseColor;
    mat.metallicFactor = metallic;
    mat.roughnessFactor = roughness;
    return mat;
};

const addArchitecturePiece = (redGPUContext, parent, geo, mat, x, y, z) => {
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geo, mat);
    mesh.setPosition(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.addChild(mesh);
    return mesh;
};

const addPedestal = (redGPUContext, parent, baseGeo, columnGeo, capGeo, plinthMat, trimMat, x, z) => {
    // [KO] 지면(y = -1.6) 기준 3단 갤러리 좌대 (상단 표면 y = -0.92)
    // [EN] 3-tier gallery pedestal grounded at y = -1.6 (top surface at y = -0.92)
    addArchitecturePiece(redGPUContext, parent, baseGeo, plinthMat, x, -1.52, z);
    addArchitecturePiece(redGPUContext, parent, columnGeo, plinthMat, x, -1.20, z);
    addArchitecturePiece(redGPUContext, parent, capGeo, trimMat, x, -0.95, z);
};

const setupColonnadeGalleryScene = (redGPUContext, scene) => {
    // [KO] 물리적 18~34% 선형 반사율 범위로 교정된 석재·콘크리트·현무암 PBR 재질
    // [EN] Physically calibrated stone, concrete, and basalt PBR materials in the 18~34% linear reflectance range
    const plazaFloorMat = createPBR(redGPUContext, [0.21, 0.20, 0.185, 1.0], 0.0, 0.85);
    const limestoneMat = createPBR(redGPUContext, [0.34, 0.31, 0.27, 1.0], 0.0, 0.72);
    const vaultWallMat = createPBR(redGPUContext, [0.14, 0.145, 0.16, 1.0], 0.0, 0.78);
    const basaltPlinthMat = createPBR(redGPUContext, [0.075, 0.08, 0.09, 1.0], 0.08, 0.48);
    const bronzeTrimMat = createPBR(redGPUContext, [0.55, 0.43, 0.28, 1.0], 0.85, 0.32);

    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 120, 120),
        plazaFloorMat
    );
    floor.y = -1.6;
    floor.receiveShadow = true;
    scene.addChild(floor);

    // [KO] 광장 중앙 석재 카펫 런웨이 (시선 유도선)
    // [EN] Central stone runway runner guiding sightlines from plaza to vault
    addArchitecturePiece(
        redGPUContext,
        scene,
        new RedGPU.Primitive.Box(redGPUContext, 3.6, 0.04, 15.6),
        limestoneMat,
        0, -1.58, -1.2
    );

    // [KO] 1. 실내 암실 갤러리 볼트 (Z: -9.4 ~ -2.6, 개방형 아치 입구 폭 5.6m)
    // [EN] 1. Enclosed inner gallery vault (Z: -9.4 to -2.6, wide 5.6m portal opening)
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 11.2, 0.5, 7.0), vaultWallMat, 0, 2.85, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.55, 4.7, 7.0), vaultWallMat, -5.32, 0.65, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.55, 4.7, 7.0), vaultWallMat, 5.32, 0.65, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 11.2, 4.7, 0.55), vaultWallMat, 0, 0.65, -9.25);

    // [KO] 회랑-볼트 경계 포털 게이트 (중앙 5.6m 개방으로 카메라 가림 방지)
    // [EN] Portal archway frame with wide 5.6m central opening to prevent camera occlusion
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 2.2, 4.7, 0.55), limestoneMat, -3.95, 0.65, -2.6);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 2.2, 4.7, 0.55), limestoneMat, 3.95, 0.65, -2.6);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 10.1, 0.65, 0.65), limestoneMat, 0, 2.68, -2.6);

    // [KO] 2. 채광 루버 열주 회랑 (Z: -2.6 ~ +2.2)
    // [EN] 2. Skylight louver colonnade (Z: -2.6 to +2.2)
    const columnGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.32, 0.36, 4.5, 24);
    const columnCapGeo = new RedGPU.Primitive.Box(redGPUContext, 0.86, 0.22, 0.86);
    const columnZList = [-1.0, 0.6, 2.2];
    columnZList.forEach((zPos) => {
        addArchitecturePiece(redGPUContext, scene, columnCapGeo, basaltPlinthMat, -4.4, -1.49, zPos);
        addArchitecturePiece(redGPUContext, scene, columnGeo, limestoneMat, -4.4, 0.65, zPos);
        addArchitecturePiece(redGPUContext, scene, columnCapGeo, basaltPlinthMat, 4.4, -1.49, zPos);
        addArchitecturePiece(redGPUContext, scene, columnGeo, limestoneMat, 4.4, 0.65, zPos);
    });

    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.75, 0.45, 5.4), limestoneMat, -4.4, 2.85, -0.2);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.75, 0.45, 5.4), limestoneMat, 4.4, 2.85, -0.2);

    const louverGeo = new RedGPU.Primitive.Box(redGPUContext, 9.5, 0.28, 0.42);
    for (let i = 0; i < 4; i++) {
        addArchitecturePiece(redGPUContext, scene, louverGeo, limestoneMat, 0, 2.9, -1.6 + i * 1.15);
    }

    // [KO] 3. 메인 피사체용 3단 좌대 (야외 광장 / 채광 회랑 / 암실 갤러리)
    // [EN] 3. 3-tier hero pedestals across outdoor plaza, skylight colonnade, and dark vault
    const heroBaseGeo = new RedGPU.Primitive.Box(redGPUContext, 1.55, 0.16, 1.55);
    const heroColGeo = new RedGPU.Primitive.Box(redGPUContext, 1.18, 0.48, 1.18);
    const heroCapGeo = new RedGPU.Primitive.Box(redGPUContext, 1.32, 0.06, 1.32);

    const heroPlacements = [
        {x: 0.0, y: 0.02, z: 3.4, scale: 0.96, rotY: -22},
        {x: -1.15, y: 0.02, z: -0.6, scale: 0.92, rotY: 155},
        {x: 0.0, y: 0.02, z: -6.0, scale: 0.96, rotY: 18}
    ];

    heroPlacements.forEach((p) => {
        addPedestal(redGPUContext, scene, heroBaseGeo, heroColGeo, heroCapGeo, basaltPlinthMat, bronzeTrimMat, p.x, p.z);
    });

    // [KO] 4. 광학 교정 구체 4종 — 야외 피사체 좌우에 반원형 아치 배치로 한 화면에서 동시 비교
    // [EN] 4. 4 optical calibration spheres arranged in a semi-circular arc flanking the courtyard subject
    const orbBaseGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.42, 0.46, 0.56, 24);
    const orbCapGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.45, 0.45, 0.05, 24);
    const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.36, 32, 32);

    const refSpheres = [
        // 18% Middle-Gray (측광 기준점)
        {x: -2.35, z: 3.85, mat: createPBR(redGPUContext, [0.18, 0.18, 0.18, 1.0], 0.0, 0.55)},
        // Brushed Gold (웜 스페큘러 하이라이트)
        {x: -1.65, z: 2.15, mat: createPBR(redGPUContext, [1.0, 0.78, 0.34, 1.0], 1.0, 0.20)},
        // Matte Ceramic White (80% 고반사 디퓨즈 클리핑 검증)
        {x: 1.65, z: 2.15, mat: createPBR(redGPUContext, [0.82, 0.81, 0.78, 1.0], 0.0, 0.32)},
        // Chrome Mirror (태양 및 하늘 정반사 피크 휘도 검증)
        {x: 2.35, z: 3.85, mat: createPBR(redGPUContext, [0.96, 0.97, 0.99, 1.0], 1.0, 0.05)}
    ];

    refSpheres.forEach((item) => {
        addArchitecturePiece(redGPUContext, scene, orbBaseGeo, basaltPlinthMat, item.x, -1.32, item.z);
        addArchitecturePiece(redGPUContext, scene, orbCapGeo, bronzeTrimMat, item.x, -1.02, item.z);
        addArchitecturePiece(redGPUContext, scene, sphereGeo, item.mat, item.x, -0.64, item.z);
    });

    // [KO] 암실 갤러리 내부에도 보조 레퍼런스 구체 2기 배치 (야간 점광원 반사 확인용)
    // [EN] 2 secondary reference spheres inside the dark vault for night point-light evaluation
    const vaultSpheres = [
        {x: -1.85, z: -6.3, mat: createPBR(redGPUContext, [1.0, 0.78, 0.34, 1.0], 1.0, 0.18)},
        {x: 1.85, z: -6.3, mat: createPBR(redGPUContext, [0.82, 0.83, 0.86, 1.0], 0.15, 0.28)}
    ];
    vaultSpheres.forEach((item) => {
        addArchitecturePiece(redGPUContext, scene, orbBaseGeo, basaltPlinthMat, item.x, -1.32, item.z);
        addArchitecturePiece(redGPUContext, scene, orbCapGeo, bronzeTrimMat, item.x, -1.02, item.z);
        addArchitecturePiece(redGPUContext, scene, sphereGeo, item.mat, item.x, -0.64, item.z);
    });

    // [KO] 5. 암실 갤러리 내부 점광원 배치
    // [EN] 5. Interior gallery point lights
    const warmVaultLight = new RedGPU.Light.PointLight('#ffaa55', 2600);
    warmVaultLight.setPosition(-2.4, 1.8, -5.2);
    warmVaultLight.radius = 10.0;
    scene.lightManager.addPointLight(warmVaultLight);

    const coolVaultLight = new RedGPU.Light.PointLight('#66aaff', 1900);
    coolVaultLight.setPosition(2.4, 1.7, -6.4);
    coolVaultLight.radius = 9.5;
    scene.lightManager.addPointLight(coolVaultLight);

    // [KO] 6. 3개 조도 구역 메인 피사체(DamagedHelmet) 로드 및 좌대 상단 정위치 안착
    // [EN] 6. Load hero subjects (DamagedHelmet) seated cleanly on the 3-tier pedestals
    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

    heroPlacements.forEach((item, idx) => {
        new RedGPU.GLTFLoader(
            redGPUContext,
            helmetUrl,
            (result) => {
                const mesh = scene.addChild(result.resultMesh);
                mesh.setPosition(item.x, item.y, item.z);
                mesh.setScale(item.scale);
                mesh.rotationY = item.rotY;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            },
            idx === 0 ? (e) => RedGPUExampleHelper.loadingProgressInfoHandler(e) : undefined
        );
    });
};

const renderTestPane = (redGPUContext, targetView, autoExposure, controller, directionalLight) => {
    let stageToggleIndex = 0;

    const applyStage = (stage, instantCut = false) => {
        controller.centerX = stage.centerX;
        controller.centerY = stage.centerY;
        controller.centerZ = stage.centerZ;
        controller.distance = stage.distance;
        controller.pan = stage.pan;
        controller.tilt = stage.tilt;
        directionalLight.lux = stage.sunLux;
        directionalLight.elevation = stage.sunElevation;
        directionalLight.azimuth = stage.sunAzimuth;
        if (instantCut) {
            autoExposure.resetAdaptation();
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const exposureFolder = pane.addFolder({title: 'AutoExposure', expanded: true});
            exposureFolder.addBinding(targetView.rawCamera, 'useAutoExposure').on('change', (ev) => {
                const disabled = !ev.value;
                controls.forEach((c) => c.disabled = disabled);
            });

            const meteringOptions = {
                AVERAGE: RedGPU.PostEffect.BuiltIn.METERING_MODE.AVERAGE,
                CENTER_WEIGHTED: RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED,
                SPOT: RedGPU.PostEffect.BuiltIn.METERING_MODE.SPOT
            };

            const controls = [
                exposureFolder.addBinding(autoExposure, 'meteringMode', {options: meteringOptions}),
                exposureFolder.addBinding(autoExposure, 'exposureCompensation', {min: -4, max: 4, step: 0.05}),
                exposureFolder.addBinding(autoExposure, 'targetLuminance', {min: 0.01, max: 1.0, step: 0.01}),
                exposureFolder.addBinding(autoExposure, 'minEV100', {min: -10, max: 20, step: 0.1}),
                exposureFolder.addBinding(autoExposure, 'maxEV100', {min: -4, max: 22, step: 0.1}),
                exposureFolder.addBinding(autoExposure, 'adaptationSpeedUp', {min: 0.1, max: 10, step: 0.1}),
                exposureFolder.addBinding(autoExposure, 'adaptationSpeedDown', {min: 0.1, max: 10, step: 0.1}),
                exposureFolder.addBinding(autoExposure, 'lowPercentile', {min: 0, max: 0.99, step: 0.01}),
                exposureFolder.addBinding(autoExposure, 'highPercentile', {min: 0.01, max: 1.0, step: 0.01}),
                exposureFolder.addBinding(autoExposure, 'maxExposureMultiplier', {min: 1, max: 256, step: 1})
            ];

            const telemetryFolder = pane.addFolder({title: 'GPU Exposure Telemetry', expanded: true});
            telemetryFolder.addBinding(autoExposure, 'sceneAvgEV100', {readonly: true, interval: 100});
            telemetryFolder.addBinding(autoExposure, 'targetEV100', {readonly: true, interval: 100});
            telemetryFolder.addBinding(autoExposure, 'currentAdaptedEV100', {readonly: true, interval: 100});
            telemetryFolder.addBinding(autoExposure, 'effectiveEV100', {readonly: true, interval: 100});

            const stageFolder = pane.addFolder({title: 'Lighting & Camera Stages', expanded: true});
            VIEWPOINT_STAGES.forEach((stage) => {
                stageFolder.addButton({title: stage.title}).on('click', () => {
                    applyStage(stage, false);
                });
            });
            stageFolder.addButton({title: 'Camera Cut (Instant Reset)'}).on('click', () => {
                stageToggleIndex = (stageToggleIndex + 1) % VIEWPOINT_STAGES.length;
                applyStage(VIEWPOINT_STAGES[stageToggleIndex], true);
            });
        }
    });
};
