import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 1: Basic Lake 예제
 * [EN] Step 1: Basic Lake example
 *
 * [KO] 최소 코드로 WaterLake 수체를 생성하고, 수위(waterLevel) 및 기본 PBR 물성을 실시간 제어하는 입문 예제입니다.
 * [EN] Introductory example creating a WaterLake with minimal code and controlling waterLevel and PBR properties in real time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (SSR이 화면에 가득 차도록 최적 조망각 설정)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.tilt = -12;
        controller.pan = 8;
        controller.speedDistance = 0.3;

        // 2. 씬 및 뷰 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 3. IBL 환경 맵 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        // 4. 태양 방향성 라이트 추가 (조도 75,000 Lux 지정)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 28;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 수위 비교용 바닥 지형 및 랜드마크 오브젝트 생성
        createEnvironment(redGPUContext, scene);

        // 6. 기본 호수(WaterLake) 수체 생성 및 추가 (기본 물성 자동 적용)
        const lake = new RedGPU.Water.WaterLake(redGPUContext, 60, 60, 80, 80);

        // 기본 노멀 텍스처 바인딩
        // [중요] 노멀 맵은 색상이 아닌 방향 벡터(X,Y,Z) 데이터이므로, sRGB 감마 변환으로 인한 벡터 왜곡을 방지하기 위해 선형 포맷인 'rgba8unorm'을 명시합니다.
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );

        scene.addWater(lake);

        // 7. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 8. Tweakpane 컨트롤 패널 바인딩
        renderTestPane(redGPUContext, lake, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 수위(waterLevel)와 굴절/투명도를 비교 체감할 수 있는 기준 환경 오브젝트들을 생성합니다.
 */
function createEnvironment(redGPUContext, scene) {
    // 1. 호수 바닥 지형 (수면 아래 y = -2.5)
    const groundMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    groundMaterial.baseColorFactor = [0.32, 0.28, 0.24, 1.0];
    groundMaterial.roughnessFactor = 0.9;
    groundMaterial.metallicFactor = 0.0;

    const groundGeom = new RedGPU.Primitive.Ground(redGPUContext, 80, 80, 16, 16);
    const groundMesh = new RedGPU.Display.Mesh(redGPUContext, groundGeom, groundMaterial);
    groundMesh.y = -2.5;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    // 2. 수위 기준 기둥 (하단은 물속, 상단은 물 밖)
    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.85, 0.82, 0.78, 1.0];
    pillarMaterial.roughnessFactor = 0.3;
    pillarMaterial.metallicFactor = 0.1;

    const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.7, 0.7, 7.0, 24);
    const pillarPositions = [
        {x: -8.0, z: -1.0},
        {x: 8.0, z: -1.0},
        {x: 0, z: -8.0},
    ];

    pillarPositions.forEach(pos => {
        const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, pillarMaterial);
        pillar.x = pos.x;
        pillar.y = 1.0; // -2.5 ~ 4.5 범위 (수면 y=0 기준 하단 잠김)
        pillar.z = pos.z;
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);
    });

    // 3. 비교용 기하체 (구체 및 큐브 - 좌우로 넓게 분산 배치)
    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [0.95, 0.75, 0.25, 1.0];
    goldMaterial.roughnessFactor = 0.2;
    goldMaterial.metallicFactor = 0.8;

    const sphereMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 24, 24),
        goldMaterial
    );
    sphereMesh.x = -5.0;
    sphereMesh.y = 0.4;
    sphereMesh.z = 1.0;
    sphereMesh.castShadow = true;
    scene.addChild(sphereMesh);

    const tealMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    tealMaterial.baseColorFactor = [0.15, 0.65, 0.65, 1.0];
    tealMaterial.roughnessFactor = 0.35;
    tealMaterial.metallicFactor = 0.05;

    const boxMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2.8, 2.8, 2.8),
        tealMaterial
    );
    boxMesh.x = 5.0;
    boxMesh.y = 0.2;
    boxMesh.z = 1.0;
    boxMesh.rotationY = 25;
    boxMesh.castShadow = true;
    scene.addChild(boxMesh);

    // 4. 수면 공간 반사(SSR) 관찰용 고대 신전 아치 게이트 및 공중 황금 링 (넓은 폭과 수면 근접 배치)
    const marbleWhite = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleWhite.baseColorFactor = [0.92, 0.90, 0.88, 1.0];
    marbleWhite.roughnessFactor = 0.25;
    marbleWhite.metallicFactor = 0.1;

    const gatePillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 8.5, 24);
    const leftGatePillar = new RedGPU.Display.Mesh(redGPUContext, gatePillarGeom, marbleWhite);
    leftGatePillar.x = -6.8;
    leftGatePillar.y = 1.2;
    leftGatePillar.z = -4.5;
    leftGatePillar.castShadow = true;
    scene.addChild(leftGatePillar);

    const rightGatePillar = new RedGPU.Display.Mesh(redGPUContext, gatePillarGeom, marbleWhite);
    rightGatePillar.x = 6.8;
    rightGatePillar.y = 1.2;
    rightGatePillar.z = -4.5;
    rightGatePillar.castShadow = true;
    scene.addChild(rightGatePillar);

    // 기둥 위를 가로지르는 대들보 빔 (확장된 16m 빔)
    const beamMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 16.0, 1.0, 1.4),
        marbleWhite
    );
    beamMesh.x = 0;
    beamMesh.y = 5.2;
    beamMesh.z = -4.5;
    beamMesh.castShadow = true;
    scene.addChild(beamMesh);

    // 신전 게이트 중앙 수면에 가깝게 배치된 메탈릭 황금 링 (수면 맞닿음으로 선명한 SSR 반사상 형성)
    const ringMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    ringMaterial.baseColorFactor = [1.0, 0.78, 0.28, 1.0];
    ringMaterial.roughnessFactor = 0.15;
    ringMaterial.metallicFactor = 0.95;

    const ringMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 2.5, 0.65, 32, 32),
        ringMaterial
    );
    ringMesh.x = 0;
    ringMesh.y = 1.4;
    ringMesh.z = -4.5;
    ringMesh.castShadow = true;
    scene.addChild(ringMesh);
}

/**
 * [KO] Tweakpane GUI를 구성하여 수체 속성을 실시간 제어합니다.
 */
function renderTestPane(redGPUContext, lake, directionalLight) {
    const mat = lake.waterMaterial;

    const params = {
        // WaterLake 속성
        waterLevel: lake.waterLevel,
        waveAmplitude: lake.waveAmplitude,
        waveWavelength: lake.waveWavelength,
        waveSpeed: lake.waveSpeed,

        // Material PBR 속성
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex,
        roughness: mat.roughness,
        opacity: mat.opacity,

        // 조명
        elevation: directionalLight.elevation,
        azimuth: directionalLight.azimuth,
        lux: directionalLight.lux,
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. WaterLake 설정 폴더
            const lakeFolder = pane.addFolder({title: 'WaterLake (수체)', expanded: true});

            lakeFolder.addBinding(params, 'waterLevel', {min: -2.0, max: 2.0, step: 0.02})
                .on('change', (ev) => {
                    lake.waterLevel = ev.value;
                });

            lakeFolder.addBinding(params, 'waveAmplitude', {min: 0.0, max: 0.08, step: 0.001})
                .on('change', (ev) => {
                    lake.waveAmplitude = ev.value;
                });

            lakeFolder.addBinding(params, 'waveWavelength', {min: 4.0, max: 30.0, step: 0.5})
                .on('change', (ev) => {
                    lake.waveWavelength = ev.value;
                });

            lakeFolder.addBinding(params, 'waveSpeed', {min: 0.0, max: 4.0, step: 0.05})
                .on('change', (ev) => {
                    lake.waveSpeed = ev.value;
                });

            // 2. Material PBR 재질 폴더
            const matFolder = pane.addFolder({title: 'SingleLayerWaterMaterial (수면 재질)', expanded: true});

            matFolder.addBinding(params, 'baseColor', {view: 'color'})
                .on('change', (ev) => {
                    mat.baseColor.setColorByHEX(ev.value);
                });

            matFolder.addBinding(params, 'deepColor', {view: 'color'})
                .on('change', (ev) => {
                    mat.deepColor.setColorByHEX(ev.value);
                });

            matFolder.addBinding(params, 'roughness', {min: 0.0, max: 1.0, step: 0.01})
                .on('change', (ev) => {
                    mat.roughness = ev.value;
                });

            matFolder.addBinding(params, 'opacity', {min: 0.0, max: 1.0, step: 0.01})
                .on('change', (ev) => {
                    mat.opacity = ev.value;
                });

            // 3. DirectionalLight 조명 폴더
            const lightFolder = pane.addFolder({title: 'DirectionalLight (직사광)', expanded: false});

            lightFolder.addBinding(params, 'lux', {min: 0, max: 150000, step: 1000})
                .on('change', (ev) => {
                    directionalLight.lux = ev.value;
                });

            lightFolder.addBinding(params, 'elevation', {min: 0, max: 90, step: 1})
                .on('change', (ev) => {
                    directionalLight.elevation = ev.value;
                });

            lightFolder.addBinding(params, 'azimuth', {min: 0, max: 360, step: 1})
                .on('change', (ev) => {
                    directionalLight.azimuth = ev.value;
                });
        }
    });
}

