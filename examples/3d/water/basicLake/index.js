import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

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
        // 1. 카메라 컨트롤러 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 32;
        controller.tilt = -18;
        controller.pan = 35;
        controller.speedDistance = 0.3;

        // 2. 씬 및 뷰 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 3. IBL 환경 맵 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
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
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 60, 60, 80, 80);

        // 기본 노멀 텍스처 바인딩
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
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
        {x: -6, z: -4},
        {x: 6, z: -4},
        {x: 0, z: 6},
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

    // 3. 비교용 기하체 (구체 및 큐브)
    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [0.95, 0.75, 0.25, 1.0];
    goldMaterial.roughnessFactor = 0.2;
    goldMaterial.metallicFactor = 0.8;

    const sphereMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.8, 24, 24),
        goldMaterial
    );
    sphereMesh.x = -4.0;
    sphereMesh.y = 0.0;
    sphereMesh.z = 2.0;
    sphereMesh.castShadow = true;
    scene.addChild(sphereMesh);

    const tealMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    tealMaterial.baseColorFactor = [0.15, 0.65, 0.65, 1.0];
    tealMaterial.roughnessFactor = 0.35;
    tealMaterial.metallicFactor = 0.05;

    const boxMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 3.5, 3.5, 3.5),
        tealMaterial
    );
    boxMesh.x = 4.5;
    boxMesh.y = -0.5;
    boxMesh.z = 1.5;
    boxMesh.rotationY = 25;
    boxMesh.castShadow = true;
    scene.addChild(boxMesh);
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
            // 1. Water Lake 설정 폴더
            const lakeFolder = pane.addFolder({title: 'Water Lake (수면 속성)', expanded: true});

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
            const matFolder = pane.addFolder({title: 'Material PBR (수면 재질)', expanded: true});

            matFolder.addBinding(params, 'baseColor', {view: 'color', label: 'baseColor (천해색)'})
                .on('change', (ev) => {
                    mat.baseColor.setColorByHEX(ev.value);
                });

            matFolder.addBinding(params, 'deepColor', {view: 'color', label: 'deepColor (심해색)'})
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

            // 3. Directional Light 조명 폴더
            const lightFolder = pane.addFolder({title: 'Directional Light (태양 조명)', expanded: false});

            lightFolder.addBinding(params, 'lux', {min: 0, max: 150000, step: 1000, label: '조도 (Lux)'})
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
