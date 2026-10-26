import * as RedGPU from "../../../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1792993380695";

/**
 * [KO] LakeMaterial 예제
 * [EN] LakeMaterial Example
 *
 * [KO] LakeMaterial의 듀얼 노멀 맵, 수중 굴절, 감쇠, 코스틱스, SSR 및 디버그 뷰 등 모든 재질 속성을 실시간으로 제어합니다.
 * [EN] Controls all LakeMaterial properties in real time, including dual normal maps, refraction, extinction, caustics, SSR, and debug views.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 21;
        controller.tilt = -16;
        controller.pan = 10;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 30;
        directionalLight.azimuth = 145;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 대칭형 침수 테라스 계단(수심 감쇠·커스틱), 사선 관통 바(굴절), 후면 타워(SSR) 환경 생성
        // [EN] Create symmetrical submerged terrace steps (extinction/caustics), diagonal bars (refraction), and rear towers (SSR)
        createUnderwaterEnvironment(redGPUContext, scene);

        // [KO] 호수(Lake) 수체 생성 및 듀얼 노멀 텍스처('rgba8unorm') 바인딩
        // [EN] Create Lake water body and bind dual normal textures ('rgba8unorm')
        const lake = new RedGPU.Water.Lake(redGPUContext);
        lake.material.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.material.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, lake, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createUnderwaterEnvironment = (redGPUContext, scene) => {
    const floorY = -3.6;

    const sandMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    sandMaterial.baseColorFactor = [0.45, 0.40, 0.32, 1.0];
    sandMaterial.roughnessFactor = 0.85;

    const floorMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 100, 100),
        sandMaterial
    );
    floorMesh.y = floorY;
    floorMesh.receiveShadow = true;
    scene.addChild(floorMesh);

    const marbleMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleMaterial.baseColorFactor = [0.90, 0.87, 0.82, 1.0];
    marbleMaterial.roughnessFactor = 0.25;
    marbleMaterial.metallicFactor = 0.05;

    // 1. 중앙 대칭 침수형 석조 테라스 계단 (수면 위 +0.55m ➔ 심해 -2.95m, 바닥까지 연결된 솔리드 기단)
    const addSolidStep = (x, z, w, d, topY) => {
        const h = topY - floorY;
        const stepMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, w, h, d),
            marbleMaterial
        );
        stepMesh.setPosition(x, floorY + h * 0.5, z);
        stepMesh.castShadow = true;
        stepMesh.receiveShadow = true;
        scene.addChild(stepMesh);
    };

    const wingSteps = [
        {offsetX: 10.5, w: 2.4, d: 10.0, topY: 0.55},
        {offsetX: 8.3, w: 2.2, d: 9.2, topY: -0.15},
        {offsetX: 6.3, w: 2.0, d: 8.4, topY: -0.75},
        {offsetX: 4.5, w: 1.8, d: 7.6, topY: -1.45},
        {offsetX: 2.9, w: 1.6, d: 6.8, topY: -2.20},
    ];

    wingSteps.forEach((s) => {
        addSolidStep(-s.offsetX, -1.0, s.w, s.d, s.topY);
        addSolidStep(s.offsetX, -1.0, s.w, s.d, s.topY);
    });
    addSolidStep(0.0, -1.0, 4.2, 6.0, -2.95);

    // 2. 수면 관통 사선 굴절 테스트 바 & 구체 (수면 경계 굴절 꺾임 확인용)
    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [0.95, 0.80, 0.30, 1.0];
    goldMaterial.roughnessFactor = 0.15;
    goldMaterial.metallicFactor = 0.9;

    const refractionBarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.28, 0.28, 6.2, 24);
    [-4.2, 4.2].forEach((xPos) => {
        const sign = xPos < 0 ? 1 : -1;
        const barMesh = new RedGPU.Display.Mesh(redGPUContext, refractionBarGeom, goldMaterial);
        barMesh.setPosition(xPos, -0.3, 2.6);
        barMesh.rotationZ = sign * 38;
        barMesh.castShadow = true;
        barMesh.receiveShadow = true;
        scene.addChild(barMesh);
    });

    const sphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.1, 24, 24);
    [
        {x: -6.3, y: 0.2, z: 2.2},
        {x: 0.0, y: -1.1, z: -1.0},
        {x: 6.3, y: 0.2, z: 2.2},
    ].forEach((pos) => {
        const sphereMesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, goldMaterial);
        sphereMesh.setPosition(pos.x, pos.y, pos.z);
        sphereMesh.castShadow = true;
        sphereMesh.receiveShadow = true;
        scene.addChild(sphereMesh);
    });

    // 3. 후면 대칭 SSR 반사 랜드마크 (중앙 타워 + 시안 토러스 + 좌우 루비/앰버 기둥)
    const darkObsidian = new RedGPU.Material.PBRMaterial(redGPUContext);
    darkObsidian.baseColorFactor = [0.12, 0.14, 0.18, 1.0];
    darkObsidian.roughnessFactor = 0.18;
    darkObsidian.metallicFactor = 0.85;

    const towerMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 1.8, 11.0, 1.8),
        darkObsidian
    );
    towerMesh.setPosition(0.0, 3.5, -6.5);
    towerMesh.castShadow = true;
    scene.addChild(towerMesh);

    const cyanMetal = new RedGPU.Material.PBRMaterial(redGPUContext);
    cyanMetal.baseColorFactor = [0.10, 0.85, 0.85, 1.0];
    cyanMetal.roughnessFactor = 0.12;
    cyanMetal.metallicFactor = 0.95;

    const towerRing = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 2.5, 0.65, 32, 32),
        cyanMetal
    );
    towerRing.setPosition(0.0, 1.8, -6.5);
    towerRing.castShadow = true;
    scene.addChild(towerRing);

    const rubyMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rubyMaterial.baseColorFactor = [0.95, 0.25, 0.20, 1.0];
    rubyMaterial.roughnessFactor = 0.2;
    rubyMaterial.metallicFactor = 0.7;

    const rubyPillar = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Cylinder(redGPUContext, 0.75, 0.75, 9.0, 24),
        rubyMaterial
    );
    rubyPillar.setPosition(-7.5, 1.5, -6.5);
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
    amberPillar.setPosition(7.5, 1.5, -6.5);
    amberPillar.castShadow = true;
    scene.addChild(amberPillar);
};

const renderTestPane = (redGPUContext, lake, directionalLight) => {
    const mat = lake.material;
    const colors = {
        baseColor: mat.baseColor.hex,
        deepColor: mat.deepColor.hex
    };

    new RedGPUExampleHelper(redGPUContext, {
        globalWind: true,
        gui: (pane) => {
            const lakeFolder = pane.addFolder({title: 'Lake (Vertex Swell)', expanded: true});
            lakeFolder.addBinding(lake, 'waterLevel', {min: -2.0, max: 2.0, step: 0.02});
            lakeFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.15, step: 0.002});
            lakeFolder.addBinding(lake, 'waveWavelength', {min: 2.0, max: 60.0, step: 0.5});

            const normalFolder = pane.addFolder({title: 'Normal & Flow', expanded: true});
            normalFolder.addBinding(mat, 'flowRateScale', {min: 0.0, max: 0.1, step: 0.002});
            normalFolder.addBinding(mat, 'normalScale', {min: 0.0, max: 1.0, step: 0.01});
            normalFolder.addBinding(mat, 'normalTiling', {min: 1.0, max: 120.0, step: 1.0});
            normalFolder.addBinding(mat, 'invertNormalY');
            normalFolder.addBinding(mat, 'normalDetailScale', {min: 0.0, max: 1.0, step: 0.01});
            normalFolder.addBinding(mat, 'normalDetailTiling', {min: 1.0, max: 200.0, step: 1.0});
            normalFolder.addBinding(mat, 'invertNormalDetailY');

            const opticsFolder = pane.addFolder({title: 'Color & Optics', expanded: true});
            opticsFolder.addBinding(colors, 'baseColor').on('change', (ev) => mat.baseColor.setColorByHEX(ev.value));
            opticsFolder.addBinding(colors, 'deepColor').on('change', (ev) => mat.deepColor.setColorByHEX(ev.value));
            opticsFolder.addBinding(mat, 'opacity', {min: 0.0, max: 1.0, step: 0.01});
            opticsFolder.addBinding(mat, 'roughness', {min: 0.0, max: 1.0, step: 0.01});
            opticsFolder.addBinding(mat, 'specularFactor', {min: 0.0, max: 2.0, step: 0.05});
            opticsFolder.addBinding(mat, 'refractionStrength', {min: 0.0, max: 1.0, step: 0.01});
            opticsFolder.addBinding(mat, 'extinctionFactor', {min: 0.01, max: 2.0, step: 0.01});
            opticsFolder.addBinding(mat, 'depthFadeDistance', {min: 0.05, max: 10.0, step: 0.05});
            opticsFolder.addBinding(mat, 'turbidity', {min: 0.0, max: 1.0, step: 0.01});

            const causticsFolder = pane.addFolder({title: 'Underwater Caustics', expanded: true});
            causticsFolder.addBinding(mat, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            causticsFolder.addBinding(mat, 'causticsScale', {min: 0.1, max: 5.0, step: 0.1});
            causticsFolder.addBinding(mat, 'causticsSpeed', {min: 0.0, max: 5.0, step: 0.1});

            const ssrFolder = pane.addFolder({title: 'Screen Space Reflection (SSR)', expanded: true});
            ssrFolder.addBinding(mat, 'enableSSR');
            ssrFolder.addBinding(mat, 'ssrMaxDistance', {min: 2.0, max: 300.0, step: 1.0});
            ssrFolder.addBinding(mat, 'ssrStepCount', {min: 8, max: 128, step: 8});
            ssrFolder.addBinding(mat, 'ssrThickness', {min: 0.05, max: 5.0, step: 0.05});

            const debugFolder = pane.addFolder({title: 'Debug View', expanded: false});
            debugFolder.addBinding(mat, 'debugMode', {
                options: {
                    'PBR Water (Full) (0)': 0,
                    'Screen Space Reflection Only (15)': 15,
                    'Underwater Caustics Only (14)': 14,
                    'Sun Specular Glitter Only (13)': 13,
                    'Sky Reflection Color Only (12)': 12,
                    'Fresnel Factor Mask (11)': 11,
                    'Refraction Offset View (10)': 10,
                    'Wave Normal Map View (9)': 9,
                    'Water Albedo Only (8)': 8,
                    'Extinction Absorption Mask (7)': 7,
                    'Scene Passthrough (6)': 6,
                    'Depth Fade Mask (5)': 5,
                    'Delta Depth Water Mask (4)': 4,
                    'Linear Water Depth (3)': 3,
                    'Linear Scene Depth (2)': 2,
                    'Raw Scene Depth (1)': 1
                }
            });
            debugFolder.addBinding(mat, 'debugMaxDepth', {min: 0.5, max: 30.0, step: 0.5});

            const lightFolder = pane.addFolder({title: 'DirectionalLight', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
};
