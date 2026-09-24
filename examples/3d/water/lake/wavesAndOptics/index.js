import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 2: Waves & Optics 예제
 * [EN] Step 2: Waves & Optics example
 *
 * [KO] 듀얼 노멀 맵(Layer 1 + Detail Layer 2), 바람 시뮬레이션, 수중 굴절, 코스틱스 및 PBR 광학 제어를 시연합니다.
 * [EN] Demonstrates dual normal map blending (Layer 1 + Detail Layer 2), wind simulation, refraction, caustics, and PBR optics control.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (SSR 파도 반사가 선명하게 보이도록 근접 조망각 설정)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.tilt = -13;
        controller.pan = 10;
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
        directionalLight.elevation = 30;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 굴절 및 수심/코스틱스 관찰용 수중 계단/지형 오브젝트 생성
        createUnderwaterEnvironment(redGPUContext, scene);

        // 6. 호수(WaterLake) 수체 생성 (기본 물성 자동 적용)
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 70, 70, 80, 80);

        // 듀얼 노멀 텍스처 바인딩 (Layer 1: 기본 파도, Layer 2: 잔물결 디테일)
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
 * [KO] 수중 굴절(Refraction), 수심별 빛 감쇄(Extinction), 코스틱스(Caustics)를 명확히 관찰할 수 있는 수중 환경을 구성합니다.
 */
function createUnderwaterEnvironment(redGPUContext, scene) {
    // 1. 호수 바닥 지형 (수면 아래 y = -3.5)
    const sandMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    sandMaterial.baseColorFactor = [0.45, 0.40, 0.32, 1.0];
    sandMaterial.roughnessFactor = 0.85;
    sandMaterial.metallicFactor = 0.0;

    const floorGeom = new RedGPU.Primitive.Ground(redGPUContext, 80, 80, 20, 20);
    const floorMesh = new RedGPU.Display.Mesh(redGPUContext, floorGeom, sandMaterial);
    floorMesh.y = -3.5;
    floorMesh.receiveShadow = true;
    scene.addChild(floorMesh);

    // 2. 수심별 계단 플랫폼 (수심: -0.5m, -1.2m, -2.0m, -2.8m 단계적 하강)
    const marbleMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleMaterial.baseColorFactor = [0.88, 0.85, 0.80, 1.0];
    marbleMaterial.roughnessFactor = 0.25;
    marbleMaterial.metallicFactor = 0.05;

    const steps = [
        {w: 6, h: 1.0, d: 6, x: -6, y: -0.5, z: -2},
        {w: 6, h: 1.0, d: 6, x: 0, y: -1.2, z: -2},
        {w: 6, h: 1.0, d: 6, x: 6, y: -2.0, z: -2},
        {w: 6, h: 1.0, d: 6, x: 12, y: -2.8, z: -2},
    ];

    steps.forEach(step => {
        const box = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, step.w, step.h, step.d),
            marbleMaterial
        );
        box.x = step.x;
        box.y = step.y;
        box.z = step.z;
        box.castShadow = true;
        box.receiveShadow = true;
        scene.addChild(box);
    });

    // 3. 굴절 및 SSR 관찰용 수중/수면 랜드마크 기둥 및 구체 (카메라 전면 배치)
    const columnMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    columnMaterial.baseColorFactor = [0.75, 0.25, 0.25, 1.0];
    columnMaterial.roughnessFactor = 0.3;
    columnMaterial.metallicFactor = 0.1;

    const columnGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.6, 0.6, 6.0, 24);
    const colMesh = new RedGPU.Display.Mesh(redGPUContext, columnGeom, columnMaterial);
    colMesh.x = -5.2;
    colMesh.y = 0.5;
    colMesh.z = 1.0;
    colMesh.castShadow = true;
    scene.addChild(colMesh);

    const metalMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    metalMaterial.baseColorFactor = [0.95, 0.80, 0.30, 1.0];
    metalMaterial.roughnessFactor = 0.15;
    metalMaterial.metallicFactor = 0.9;

    const sphereMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 1.5, 24, 24),
        metalMaterial
    );
    sphereMesh.x = 5.2;
    sphereMesh.y = 0.3;
    sphereMesh.z = 1.0;
    sphereMesh.castShadow = true;
    scene.addChild(sphereMesh);

    // 4. 수면 공간 반사(SSR) 관찰용 키 큰 오벨리스크 타워 및 메탈릭 기둥군 (넓은 간격과 수면 근접 배치)
    // 파도가 출렁일 때 수면에 맺힌 반사상이 실시간으로 일렁이고 왜곡되는 모습을 극적으로 관찰 가능
    const darkObsidian = new RedGPU.Material.PBRMaterial(redGPUContext);
    darkObsidian.baseColorFactor = [0.12, 0.14, 0.18, 1.0];
    darkObsidian.roughnessFactor = 0.18;
    darkObsidian.metallicFactor = 0.85;

    // 중앙 12m 오벨리스크 타워
    const towerMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.8, 11.0, 1.8),
        darkObsidian
    );
    towerMesh.x = 0.0;
    towerMesh.y = 3.5;
    towerMesh.z = -5.5;
    towerMesh.castShadow = true;
    scene.addChild(towerMesh);

    // 타워 하단 수면에 가깝게 걸린 비취색 메탈릭 링 (수면 맞닿음으로 선명한 SSR 반사상 형성)
    const cyanMetal = new RedGPU.Material.PBRMaterial(redGPUContext);
    cyanMetal.baseColorFactor = [0.10, 0.85, 0.85, 1.0];
    cyanMetal.roughnessFactor = 0.12;
    cyanMetal.metallicFactor = 0.95;

    const towerRing = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 2.5, 0.65, 32, 32),
        cyanMetal
    );
    towerRing.x = 0.0;
    towerRing.y = 1.5;
    towerRing.z = -5.5;
    towerRing.castShadow = true;
    scene.addChild(towerRing);

    // 좌/우측 대비용 10m 루비/오렌지색 기둥 타워 (폭넓게 배치)
    const rubyMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rubyMaterial.baseColorFactor = [0.95, 0.25, 0.20, 1.0];
    rubyMaterial.roughnessFactor = 0.2;
    rubyMaterial.metallicFactor = 0.7;

    const rubyPillar = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 9.0, 24),
        rubyMaterial
    );
    rubyPillar.x = -7.5;
    rubyPillar.y = 1.5;
    rubyPillar.z = -5.5;
    rubyPillar.castShadow = true;
    scene.addChild(rubyPillar);

    const amberMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    amberMaterial.baseColorFactor = [0.95, 0.65, 0.15, 1.0];
    amberMaterial.roughnessFactor = 0.2;
    amberMaterial.metallicFactor = 0.7;

    const amberPillar = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 9.0, 24),
        amberMaterial
    );
    amberPillar.x = 7.5;
    amberPillar.y = 1.5;
    amberPillar.z = -5.5;
    amberPillar.castShadow = true;
    scene.addChild(amberPillar);
}

/**
 * [KO] Tweakpane GUI를 구성하여 파도 노멀, 바람 및 광학 속성을 실시간 제어합니다.
 */
function renderTestPane(redGPUContext, lake, directionalLight) {
    const mat = lake.waterMaterial;

    const radToDeg = (rad) => (rad * 180 / Math.PI + 360) % 360;
    const degToRad = (deg) => deg * Math.PI / 180;

    const params = {
        // Normal Layer 1 (기본 파도)
        normalScale: mat.normalScale,
        normalTiling: mat.normalTiling,
        windSpeed: mat.windSpeed,
        windAngle: radToDeg(Math.atan2(mat.windDirection[1], mat.windDirection[0])),

        // Normal Layer 2 (잔물결 디테일)
        normalDetailScale: mat.normalDetailScale,
        normalDetailTiling: mat.normalDetailTiling,
        normalDetailWindSpeed: mat.normalDetailWindSpeed,
        normalDetailWindAngle: radToDeg(Math.atan2(mat.normalDetailWindDirection[1], mat.normalDetailWindDirection[0])),

        // 광학 및 굴절
        roughness: mat.roughness,
        specularFactor: mat.specularFactor,
        refractionStrength: mat.refractionStrength,
        extinctionFactor: mat.extinctionFactor,
        depthFadeDistance: mat.depthFadeDistance,
        turbidity: mat.turbidity,
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex,

        // 코스틱스 (Caustics)
        causticsStrength: mat.causticsStrength,
        causticsScale: mat.causticsScale,
        causticsSpeed: mat.causticsSpeed,

        // 태양 조명
        lux: directionalLight.lux,
        elevation: directionalLight.elevation,
        azimuth: directionalLight.azimuth,
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. Normal Layer 1 (기본 파도 노멀 및 풍향)
            const layer1Folder = pane.addFolder({title: 'Wave Layer 1 (기본 파도)', expanded: true});

            layer1Folder.addBinding(params, 'normalScale', {min: 0.0, max: 2.0, step: 0.05})
                .on('change', (ev) => {
                    mat.normalScale = ev.value;
                });

            layer1Folder.addBinding(params, 'normalTiling', {min: 2.0, max: 50.0, step: 1.0})
                .on('change', (ev) => {
                    mat.normalTiling = ev.value;
                });

            layer1Folder.addBinding(params, 'windSpeed', {min: 0.0, max: 0.15, step: 0.005})
                .on('change', (ev) => {
                    mat.windSpeed = ev.value;
                });

            layer1Folder.addBinding(params, 'windAngle', {min: 0, max: 360, step: 1})
                .on('change', (ev) => {
                    const r = degToRad(ev.value);
                    mat.windDirection = [Math.cos(r), Math.sin(r)];
                });

            // 2. Normal Layer 2 (잔물결 디테일 노멀 및 풍향)
            const layer2Folder = pane.addFolder({title: 'Wave Layer 2 (디테일 잔물결)', expanded: true});

            layer2Folder.addBinding(params, 'normalDetailScale', {min: 0.0, max: 2.0, step: 0.05})
                .on('change', (ev) => {
                    mat.normalDetailScale = ev.value;
                });

            layer2Folder.addBinding(params, 'normalDetailTiling', {min: 5.0, max: 80.0, step: 1.0})
                .on('change', (ev) => {
                    mat.normalDetailTiling = ev.value;
                });

            layer2Folder.addBinding(params, 'normalDetailWindSpeed', {min: 0.0, max: 0.20, step: 0.005})
                .on('change', (ev) => {
                    mat.normalDetailWindSpeed = ev.value;
                });

            layer2Folder.addBinding(params, 'normalDetailWindAngle', {min: 0, max: 360, step: 1})
                .on('change', (ev) => {
                    const r = degToRad(ev.value);
                    mat.normalDetailWindDirection = [Math.cos(r), Math.sin(r)];
                });

            // 3. Optics & Refraction (광학 / 굴절 / 반사)
            const opticsFolder = pane.addFolder({title: 'Optics & Refraction (광학 및 굴절)', expanded: false});

            opticsFolder.addBinding(params, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05})
                .on('change', (ev) => {
                    mat.refractionStrength = ev.value;
                });

            opticsFolder.addBinding(params, 'extinctionFactor', {min: 0.0, max: 1.0, step: 0.01})
                .on('change', (ev) => {
                    mat.extinctionFactor = ev.value;
                });

            opticsFolder.addBinding(params, 'depthFadeDistance', {min: 0.1, max: 5.0, step: 0.1})
                .on('change', (ev) => {
                    mat.depthFadeDistance = ev.value;
                });

            opticsFolder.addBinding(params, 'turbidity', {min: 0.0, max: 1.0, step: 0.02})
                .on('change', (ev) => {
                    mat.turbidity = ev.value;
                });

            opticsFolder.addBinding(params, 'specularFactor', {min: 0.0, max: 3.0, step: 0.1})
                .on('change', (ev) => {
                    mat.specularFactor = ev.value;
                });

            opticsFolder.addBinding(params, 'roughness', {min: 0.0, max: 1.0, step: 0.01})
                .on('change', (ev) => {
                    mat.roughness = ev.value;
                });

            opticsFolder.addBinding(params, 'baseColor', {view: 'color'})
                .on('change', (ev) => {
                    mat.baseColor.setColorByHEX(ev.value);
                });

            opticsFolder.addBinding(params, 'deepColor', {view: 'color'})
                .on('change', (ev) => {
                    mat.deepColor.setColorByHEX(ev.value);
                });

            // 4. Caustics (수중 빛 일렁임)
            const causticsFolder = pane.addFolder({title: 'Caustics (코스틱스)', expanded: false});

            causticsFolder.addBinding(params, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.1})
                .on('change', (ev) => {
                    mat.causticsStrength = ev.value;
                });

            causticsFolder.addBinding(params, 'causticsScale', {min: 0.2, max: 5.0, step: 0.1})
                .on('change', (ev) => {
                    mat.causticsScale = ev.value;
                });

            causticsFolder.addBinding(params, 'causticsSpeed', {min: 0.0, max: 3.0, step: 0.1})
                .on('change', (ev) => {
                    mat.causticsSpeed = ev.value;
                });

            // 5. DirectionalLight 조명 폴더
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
