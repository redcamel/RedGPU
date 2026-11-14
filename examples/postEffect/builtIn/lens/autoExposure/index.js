import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] AutoExposure (자동 노출 및 눈 적응) 예제
 * [EN] AutoExposure (Auto-Exposure & Eye Adaptation) example
 *
 * [KO] 256-bin 로그 휘도 히스토그램 분석, 백분위 절삭, 측광 모드, 노출 보정 및 디버그 히스토그램 HUD를 시연합니다.
 * [EN] Demonstrates 256-bin log-luminance histogram analysis, percentile trimming, metering modes, exposure compensation, and the debug histogram HUD.
 */

const VIEWPOINT_STAGES = [
    {
        title: 'Midday Courtyard (100k lux)',
        centerX: 0.0,
        centerY: -0.2,
        centerZ: 3.6,
        distance: 6.4,
        pan: -28,
        tilt: -11,
        sunLux: 100000,
        sunElevation: 42,
        sunAzimuth: 45
    },
    {
        title: 'Window Backlight (Interior -> Sky)',
        centerX: 0.0,
        centerY: -0.25,
        centerZ: -1.6,
        distance: 4.8,
        pan: 180,
        tilt: 2,
        sunLux: 85000,
        sunElevation: 20,
        sunAzimuth: -162
    },
    {
        title: 'Golden Sunset (12k lux)',
        centerX: 0.0,
        centerY: -0.15,
        centerZ: 2.8,
        distance: 6.8,
        pan: 22,
        tilt: -7,
        sunLux: 12000,
        sunElevation: 3.2,
        sunAzimuth: -148
    },
    {
        title: 'Night Gallery Vault (PointLights)',
        centerX: 0.0,
        centerY: -0.35,
        centerZ: -5.4,
        distance: 4.2,
        pan: 18,
        tilt: -9,
        sunLux: 0,
        sunElevation: -12,
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

        const autoExposure = view.builtInEffectManager.autoExposure;
        autoExposure.useDebugOverlay = true;

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

const setupColonnadeGalleryScene = (redGPUContext, scene) => {
    // [KO] 물리적 18~32% 선형 반사율 범위로 교정된 석재·콘크리트·현무암 PBR 재질
    // [EN] Physically calibrated stone, concrete, and basalt PBR materials in the 18~32% linear reflectance range
    const plazaFloorMat = createPBR(redGPUContext, [0.21, 0.20, 0.185, 1.0], 0.0, 0.85);
    const limestoneMat = createPBR(redGPUContext, [0.34, 0.31, 0.27, 1.0], 0.0, 0.72);
    const vaultWallMat = createPBR(redGPUContext, [0.14, 0.145, 0.16, 1.0], 0.0, 0.78);
    const basaltPlinthMat = createPBR(redGPUContext, [0.075, 0.08, 0.09, 1.0], 0.05, 0.52);

    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 120, 120),
        plazaFloorMat
    );
    floor.y = -1.6;
    floor.receiveShadow = true;
    scene.addChild(floor);

    // [KO] 1. 실내 암실 갤러리 볼트 (Z: -9.2 ~ -2.8)
    // [EN] 1. Enclosed inner gallery vault (Z: -9.2 to -2.8)
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 10.4, 0.5, 6.8), vaultWallMat, 0, 2.55, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.55, 4.4, 6.8), vaultWallMat, -4.92, 0.5, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.55, 4.4, 6.8), vaultWallMat, 4.92, 0.5, -6.0);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 10.4, 4.4, 0.55), vaultWallMat, 0, 0.5, -9.15);

    // [KO] 2. 채광 루버 열주 회랑 (Z: -2.6 ~ +2.4) — 직사광과 그림자 줄무늬 교차
    // [EN] 2. Skylight louver colonnade (Z: -2.6 to +2.4) — alternating sun shafts and shadow bands
    const columnGeo = new RedGPU.Primitive.Box(redGPUContext, 0.65, 4.3, 0.65);
    const columnZList = [-2.2, -0.4, 1.4, 3.2];
    columnZList.forEach((zPos) => {
        addArchitecturePiece(redGPUContext, scene, columnGeo, limestoneMat, -4.6, 0.55, zPos);
        addArchitecturePiece(redGPUContext, scene, columnGeo, limestoneMat, 4.6, 0.55, zPos);
    });

    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.65, 0.45, 6.4), limestoneMat, -4.6, 2.55, 0.5);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.65, 0.45, 6.4), limestoneMat, 4.6, 2.55, 0.5);

    const louverGeo = new RedGPU.Primitive.Box(redGPUContext, 9.8, 0.32, 0.55);
    for (let i = 0; i < 5; i++) {
        addArchitecturePiece(redGPUContext, scene, louverGeo, limestoneMat, 0, 2.6, -2.0 + i * 1.3);
    }

    // [KO] 회랑 입구 프레임 게이트
    // [EN] Portal archway frame
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 2.6, 4.3, 0.55), limestoneMat, -3.6, 0.55, -2.6);
    addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 2.6, 4.3, 0.55), limestoneMat, 3.6, 0.55, -2.6);

    // [KO] 3. 전시 좌대 및 광학 레퍼런스 구체 (18% 미들 그레이 / 크롬 / 브러시드 골드 / 화이트 세라믹)
    // [EN] 3. Plinths and optical calibration spheres (18% Middle-Gray / Chrome / Brushed Gold / White Ceramic)
    const plinthGeo = new RedGPU.Primitive.Box(redGPUContext, 1.5, 0.42, 1.5);
    addArchitecturePiece(redGPUContext, scene, plinthGeo, basaltPlinthMat, 0, -1.39, 3.8);
    addArchitecturePiece(redGPUContext, scene, plinthGeo, basaltPlinthMat, 0, -1.39, -1.2);
    addArchitecturePiece(redGPUContext, scene, plinthGeo, basaltPlinthMat, 0, -1.39, -5.6);

    const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.42, 32, 32);
    const refSpheres = [
        {x: -2.2, z: 4.2, mat: createPBR(redGPUContext, [0.18, 0.18, 0.18, 1.0], 0.0, 0.65)},
        {x: 2.2, z: 4.2, mat: createPBR(redGPUContext, [0.95, 0.96, 0.98, 1.0], 1.0, 0.06)},
        {x: -2.2, z: 2.2, mat: createPBR(redGPUContext, [1.0, 0.78, 0.34, 1.0], 1.0, 0.22)},
        {x: 2.2, z: 2.2, mat: createPBR(redGPUContext, [0.80, 0.80, 0.78, 1.0], 0.0, 0.35)}
    ];
    refSpheres.forEach((item) => {
        addArchitecturePiece(redGPUContext, scene, new RedGPU.Primitive.Box(redGPUContext, 0.9, 0.36, 0.9), basaltPlinthMat, item.x, -1.42, item.z);
        addArchitecturePiece(redGPUContext, scene, sphereGeo, item.mat, item.x, -0.82, item.z);
    });

    // [KO] 4. 암실 갤러리 내부 점광원 배치
    // [EN] 4. Interior gallery point lights
    const warmVaultLight = new RedGPU.Light.PointLight('#ffaa55', 2600);
    warmVaultLight.setPosition(-2.6, 1.6, -5.4);
    warmVaultLight.radius = 10.0;
    scene.lightManager.addPointLight(warmVaultLight);

    const coolVaultLight = new RedGPU.Light.PointLight('#66aaff', 1800);
    coolVaultLight.setPosition(2.6, 1.5, -6.2);
    coolVaultLight.radius = 9.5;
    scene.lightManager.addPointLight(coolVaultLight);

    // [KO] 5. 야외 광장 / 채광 회랑 / 심층 암실 3개 조도 구역 피사체 배치
    // [EN] 5. Hero subjects across outdoor plaza, skylight colonnade, and dark vault
    const helmetUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    const placements = [
        {x: 0.0, y: -0.22, z: 3.8, scale: 1.05, rotY: -24},
        {x: 0.0, y: -0.22, z: -1.2, scale: 0.98, rotY: 180},
        {x: 0.0, y: -0.22, z: -5.6, scale: 1.02, rotY: 20}
    ];

    placements.forEach((item, idx) => {
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
                exposureFolder.addBinding(autoExposure, 'useDebugOverlay'),
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
