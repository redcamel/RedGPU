import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Multi Lake (다중 수체) 테스트 예제
 * [EN] Multi Lake test example
 *
 * [KO] 단일 씬 내에 서로 다른 고도(waterLevel), 위치, 크기 및 광학 물성을 지닌 5개의 WaterLake 수체를 동시에 렌더링하고,
 *      각각의 수영장 벽체 내경에 물의 크기를 완벽하게 일치시켜 수영장 풀 구조를 정밀 테스트합니다.
 * [EN] Simultaneously renders 5 independent WaterLake bodies with distinct elevations (waterLevel), locations,
 *      sizes, and optical properties within a single scene, snuggly fitted inside pool boundary walls.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (5개의 다단 수영장 풀을 파노라마로 조망할 수 있는 시점)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 75;
        controller.tilt = -20;
        controller.pan = 22;
        controller.minDistance = 6;
        controller.maxDistance = 250;
        controller.speedDistance = 0.5;

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

        // 4. 태양 방향성 라이트 추가
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 32;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffbf0');
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 공용 노멀 맵 텍스처 (GPU 리소스 효율 공유, 선형 포맷 rgba8unorm 지정)
        const sharedNormalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        const sharedNormalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );

        // 6. 5개의 독립된 수영장(WaterLake) 규격 정의 (수영장 내경과 물 크기 1:1 일치)
        const poolConfigs = [
            {
                name: 'Pool 1 (Top Alpine)',
                x: 0,
                y: 4.0,
                z: -32,
                poolWidth: 32,
                poolHeight: 32,
                baseColor: '#18d8b6',
                deepColor: '#065279',
                waveAmplitude: 0.02,
                waveSpeed: 0.9,
                roughness: 0.06,
                opacity: 0.95,
                refractionStrength: 0.85,
                causticsStrength: 0.9,
            },
            {
                name: 'Pool 2 (Mid-Left Deep)',
                x: -24,
                y: 2.0,
                z: -8,
                poolWidth: 24,
                poolHeight: 24,
                baseColor: '#00a8ff',
                deepColor: '#001845',
                waveAmplitude: 0.025,
                waveSpeed: 1.2,
                roughness: 0.04,
                opacity: 1.0,
                refractionStrength: 0.7,
                causticsStrength: 0.6,
            },
            {
                name: 'Pool 3 (Mid-Right Lagoon)',
                x: 24,
                y: 2.0,
                z: -8,
                poolWidth: 24,
                poolHeight: 24,
                baseColor: '#48dbfb',
                deepColor: '#0abde3',
                waveAmplitude: 0.015,
                waveSpeed: 0.8,
                roughness: 0.08,
                opacity: 0.88,
                refractionStrength: 1.1,
                causticsStrength: 1.2,
            },
            {
                name: 'Pool 4 (Lower-Center Golden)',
                x: 0,
                y: 0.0,
                z: 16,
                poolWidth: 38,
                poolHeight: 28,
                baseColor: '#ff9f43',
                deepColor: '#ee5253',
                waveAmplitude: 0.022,
                waveSpeed: 1.0,
                roughness: 0.05,
                opacity: 0.96,
                refractionStrength: 0.9,
                causticsStrength: 0.8,
            },
            {
                name: 'Pool 5 (Bottom-Left Mystic)',
                x: -22,
                y: -2.0,
                z: 38,
                poolWidth: 22,
                poolHeight: 22,
                baseColor: '#9b59b6',
                deepColor: '#2c003e',
                waveAmplitude: 0.018,
                waveSpeed: 0.7,
                roughness: 0.03,
                opacity: 1.0,
                refractionStrength: 1.0,
                causticsStrength: 0.7,
            },
        ];

        const lakes = [];
        for (let i = 0; i < poolConfigs.length; i++) {
            const cfg = poolConfigs[i];
            // 수영장 벽 내경에 딱 맞는 크기로 WaterLake 생성 (수영장 내경 = 물 크기)
            const lake = new RedGPU.Display.Water.WaterLake(
                redGPUContext,
                cfg.poolWidth,
                cfg.poolHeight,
                64,
                64,
                cfg.name
            );
            lake.x = cfg.x;
            lake.waterLevel = cfg.y;
            lake.z = cfg.z;

            // 파도 물성
            lake.waveAmplitude = cfg.waveAmplitude;
            lake.waveSpeed = cfg.waveSpeed;

            // 광학 및 재질 물성
            const mat = lake.waterMaterial;
            mat.normalTexture = sharedNormalTexture;
            mat.normalDetailTexture = sharedNormalDetailTexture;
            mat.baseColor.setColorByHEX(cfg.baseColor);
            mat.deepColor.setColorByHEX(cfg.deepColor);
            mat.roughness = cfg.roughness;
            mat.opacity = cfg.opacity;
            mat.refractionStrength = cfg.refractionStrength;
            mat.causticsStrength = cfg.causticsStrength;
            mat.enableSSR = true;

            scene.addWater(lake);
            lakes.push(lake);
        }

        // 7. 각 수영장 벽 내경에 물이 딱 맞물리는 정밀 벽체 및 테라스 지형 구축
        const animatedObjects = createPrecisePoolEnvironment(redGPUContext, scene, poolConfigs);

        // 8. 렌더 루프 시작 (Zero-GC 애니메이션 업데이트)
        const renderer = new RedGPU.Renderer();
        const animCount = animatedObjects.length;
        renderer.start(redGPUContext, (time) => {
            const sec = time * 0.001;
            for (let i = 0; i < animCount; i++) {
                const item = animatedObjects[i];
                if (item.rotSpeed) {
                    item.mesh.rotationY += item.rotSpeed;
                }
                if (item.bobAmp) {
                    item.mesh.y = item.baseY + Math.sin(sec * item.bobFreq + item.phase) * item.bobAmp;
                }
            }
        });

        // 9. 인터랙티브 컨트롤 패널 바인딩
        renderTestPane(redGPUContext, lakes, directionalLight);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 물 크기(poolWidth x poolHeight)와 수영장 내경이 100% 일치하도록 정밀한 수영장 벽 및 바닥 지형을 생성합니다.
 */
function createPrecisePoolEnvironment(redGPUContext, scene, poolConfigs) {
    const animatedList = [];

    // 수영장 외벽/상단 림(Coping) 재질: 고급스러운 밝은 대리석 스톤
    const poolRimMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    poolRimMaterial.baseColorFactor = [0.82, 0.82, 0.85, 1.0];
    poolRimMaterial.roughnessFactor = 0.35;
    poolRimMaterial.metallicFactor = 0.05;

    // 수영장 바닥 및 내벽 타일 재질: 은은한 쿨 그레이 타일
    const poolTileMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    poolTileMaterial.baseColorFactor = [0.65, 0.72, 0.78, 1.0];
    poolTileMaterial.roughnessFactor = 0.45;
    poolTileMaterial.metallicFactor = 0.0;

    // 주변 전체 지형 기저 바닥 (Base Ground)
    const cliffMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    cliffMaterial.baseColorFactor = [0.30, 0.28, 0.25, 1.0];
    cliffMaterial.roughnessFactor = 0.9;
    cliffMaterial.metallicFactor = 0.02;

    const goldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    goldMaterial.baseColorFactor = [1.0, 0.78, 0.28, 1.0];
    goldMaterial.roughnessFactor = 0.15;
    goldMaterial.metallicFactor = 0.95;

    const chromeMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    chromeMaterial.baseColorFactor = [0.95, 0.95, 0.98, 1.0];
    chromeMaterial.roughnessFactor = 0.05;
    chromeMaterial.metallicFactor = 1.0;

    const copperMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    copperMaterial.baseColorFactor = [0.9, 0.45, 0.28, 1.0];
    copperMaterial.roughnessFactor = 0.2;
    copperMaterial.metallicFactor = 0.9;

    const rubyMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rubyMaterial.baseColorFactor = [0.85, 0.15, 0.25, 1.0];
    rubyMaterial.roughnessFactor = 0.25;
    rubyMaterial.metallicFactor = 0.7;

    const emeraldMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    emeraldMaterial.baseColorFactor = [0.15, 0.85, 0.45, 1.0];
    emeraldMaterial.roughnessFactor = 0.2;
    emeraldMaterial.metallicFactor = 0.8;

    // 광활한 월드 기저 지형
    const worldBaseGeom = new RedGPU.Primitive.Ground(redGPUContext, 160, 160, 16, 16);
    const worldBaseMesh = new RedGPU.Display.Mesh(redGPUContext, worldBaseGeom, cliffMaterial);
    worldBaseMesh.y = -6.0;
    scene.addChild(worldBaseMesh);

    // 각 수영장 풀 생성
    for (let i = 0; i < poolConfigs.length; i++) {
        const cfg = poolConfigs[i];
        const pw = cfg.poolWidth;
        const ph = cfg.poolHeight;
        const basinDepth = 2.5; // 수심 (수면 아래 2.5m)
        const wallThickness = 1.5; // 수영장 벽 두께
        const curbHeight = 0.6; // 수면 위로 솟아오른 수영장 턱(Rim) 높이
        const totalWallHeight = basinDepth + curbHeight; // 전체 벽 높이 (바닥 ~ 수면 위)
        const wallCenterY = cfg.y - basinDepth + totalWallHeight / 2;

        // 1) 수영장 바닥 (Pool Floor): 내경 면적에 딱 맞게 배치
        const floorGeom = new RedGPU.Primitive.Ground(redGPUContext, pw, ph, 8, 8);
        const floorMesh = new RedGPU.Display.Mesh(redGPUContext, floorGeom, poolTileMaterial);
        floorMesh.x = cfg.x;
        floorMesh.y = cfg.y - basinDepth;
        floorMesh.z = cfg.z;
        scene.addChild(floorMesh);

        // 2) 4면 수영장 벽 (North, South, East, West)
        // 물의 경계(pw x ph)와 내벽면이 완벽하게 맞물리도록 정확한 센터 오프셋 적용
        // 북쪽 벽 (North Wall: X 전체 커버)
        createWall(
            redGPUContext,
            scene,
            poolRimMaterial,
            pw + wallThickness * 2,
            totalWallHeight,
            wallThickness,
            cfg.x,
            wallCenterY,
            cfg.z - ph / 2 - wallThickness / 2
        );

        // 남쪽 벽 (South Wall: X 전체 커버)
        createWall(
            redGPUContext,
            scene,
            poolRimMaterial,
            pw + wallThickness * 2,
            totalWallHeight,
            wallThickness,
            cfg.x,
            wallCenterY,
            cfg.z + ph / 2 + wallThickness / 2
        );

        // 서쪽 벽 (West Wall: 북/남 벽 사이 완벽 결합)
        createWall(
            redGPUContext,
            scene,
            poolRimMaterial,
            wallThickness,
            totalWallHeight,
            ph,
            cfg.x - pw / 2 - wallThickness / 2,
            wallCenterY,
            cfg.z
        );

        // 동쪽 벽 (East Wall: 북/남 벽 사이 완벽 결합)
        createWall(
            redGPUContext,
            scene,
            poolRimMaterial,
            wallThickness,
            totalWallHeight,
            ph,
            cfg.x + pw / 2 + wallThickness / 2,
            wallCenterY,
            cfg.z
        );

        // 3) 수면 바로 위 SSR 반사 검증 랜드마크 오브젝트 (각 풀 테마에 맞춤)
        if (i === 0) {
            // Pool 1: 황금 토러스 링 + 크롬 기둥
            const ringGeom = new RedGPU.Primitive.Torus(redGPUContext, 3.2, 0.7, 32, 32);
            const ring = new RedGPU.Display.Mesh(redGPUContext, ringGeom, goldMaterial);
            ring.x = cfg.x;
            ring.y = cfg.y + 1.6;
            ring.z = cfg.z;
            ring.castShadow = true;
            scene.addChild(ring);
            animatedList.push({mesh: ring, rotSpeed: 0.6, baseY: cfg.y + 1.6, bobAmp: 0.35, bobFreq: 1.5, phase: 0});

            createPillar(redGPUContext, scene, chromeMaterial, cfg.x - 7, cfg.y - basinDepth, cfg.z - 7, 6.5);
            createPillar(redGPUContext, scene, chromeMaterial, cfg.x + 7, cfg.y - basinDepth, cfg.z - 7, 6.5);
        } else if (i === 1) {
            // Pool 2: 크롬 구체 + 골드 기둥
            const sphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 2.0, 32, 32);
            const sphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, chromeMaterial);
            sphere.x = cfg.x;
            sphere.y = cfg.y + 1.3;
            sphere.z = cfg.z;
            sphere.castShadow = true;
            scene.addChild(sphere);
            animatedList.push({
                mesh: sphere,
                rotSpeed: 0.3,
                baseY: cfg.y + 1.3,
                bobAmp: 0.35,
                bobFreq: 1.8,
                phase: 1.2
            });

            createPillar(redGPUContext, scene, goldMaterial, cfg.x - 5, cfg.y - basinDepth, cfg.z + 5, 5.0);
            createPillar(redGPUContext, scene, goldMaterial, cfg.x + 5, cfg.y - basinDepth, cfg.z + 5, 5.0);
        } else if (i === 2) {
            // Pool 3: 구리 토러스 링 + 에메랄드 구체
            const torusGeom = new RedGPU.Primitive.Torus(redGPUContext, 2.4, 0.5, 32, 32);
            const torus = new RedGPU.Display.Mesh(redGPUContext, torusGeom, copperMaterial);
            torus.x = cfg.x;
            torus.y = cfg.y + 1.3;
            torus.z = cfg.z;
            torus.castShadow = true;
            scene.addChild(torus);
            animatedList.push({
                mesh: torus,
                rotSpeed: -0.7,
                baseY: cfg.y + 1.3,
                bobAmp: 0.25,
                bobFreq: 1.2,
                phase: 2.1
            });

            const sphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.4, 24, 24);
            const sphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeom, emeraldMaterial);
            sphere.x = cfg.x + 4.0;
            sphere.y = cfg.y + 1.1;
            sphere.z = cfg.z - 4.0;
            sphere.castShadow = true;
            scene.addChild(sphere);
            animatedList.push({mesh: sphere, rotSpeed: 0.5, baseY: cfg.y + 1.1, bobAmp: 0.2, bobFreq: 2.0, phase: 0.8});
        } else if (i === 3) {
            // Pool 4: 대형 황금 링 + 루비/크롬 듀얼 구체
            const bigRingGeom = new RedGPU.Primitive.Torus(redGPUContext, 3.8, 0.75, 36, 36);
            const bigRing = new RedGPU.Display.Mesh(redGPUContext, bigRingGeom, goldMaterial);
            bigRing.x = cfg.x;
            bigRing.y = cfg.y + 1.8;
            bigRing.z = cfg.z;
            bigRing.castShadow = true;
            scene.addChild(bigRing);
            animatedList.push({
                mesh: bigRing,
                rotSpeed: 0.45,
                baseY: cfg.y + 1.8,
                bobAmp: 0.35,
                bobFreq: 1.0,
                phase: 3.0
            });

            const rubySphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 28, 28);
            const rubySphere = new RedGPU.Display.Mesh(redGPUContext, rubySphereGeom, rubyMaterial);
            rubySphere.x = cfg.x - 8.0;
            rubySphere.y = cfg.y + 1.4;
            rubySphere.z = cfg.z + 3.0;
            rubySphere.castShadow = true;
            scene.addChild(rubySphere);
            animatedList.push({
                mesh: rubySphere,
                rotSpeed: 0.6,
                baseY: cfg.y + 1.4,
                bobAmp: 0.25,
                bobFreq: 1.6,
                phase: 1.9
            });

            const chromeSphereGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.6, 28, 28);
            const chromeSphere = new RedGPU.Display.Mesh(redGPUContext, chromeSphereGeom, chromeMaterial);
            chromeSphere.x = cfg.x + 8.0;
            chromeSphere.y = cfg.y + 1.4;
            chromeSphere.z = cfg.z + 3.0;
            chromeSphere.castShadow = true;
            scene.addChild(chromeSphere);
            animatedList.push({
                mesh: chromeSphere,
                rotSpeed: -0.6,
                baseY: cfg.y + 1.4,
                bobAmp: 0.25,
                bobFreq: 1.6,
                phase: 0.4
            });
        } else if (i === 4) {
            // Pool 5: 퍼플 토러스 + 코퍼 기둥
            const purpleRingGeom = new RedGPU.Primitive.Torus(redGPUContext, 2.2, 0.45, 32, 32);
            const purpleRing = new RedGPU.Display.Mesh(redGPUContext, purpleRingGeom, rubyMaterial);
            purpleRing.x = cfg.x;
            purpleRing.y = cfg.y + 1.2;
            purpleRing.z = cfg.z;
            purpleRing.castShadow = true;
            scene.addChild(purpleRing);
            animatedList.push({
                mesh: purpleRing,
                rotSpeed: 0.8,
                baseY: cfg.y + 1.2,
                bobAmp: 0.3,
                bobFreq: 1.4,
                phase: 2.7
            });

            createPillar(redGPUContext, scene, copperMaterial, cfg.x - 4.0, cfg.y - basinDepth, cfg.z - 4.0, 4.5);
            createPillar(redGPUContext, scene, copperMaterial, cfg.x + 4.0, cfg.y - basinDepth, cfg.z + 4.0, 4.5);
        }
    }

    return animatedList;
}

function createWall(redGPUContext, scene, material, sx, sy, sz, x, y, z) {
    const wallGeom = new RedGPU.Primitive.Box(redGPUContext, sx, sy, sz);
    const wallMesh = new RedGPU.Display.Mesh(redGPUContext, wallGeom, material);
    wallMesh.x = x;
    wallMesh.y = y;
    wallMesh.z = z;
    wallMesh.castShadow = true;
    scene.addChild(wallMesh);
}

function createPillar(redGPUContext, scene, material, x, baseY, z, height) {
    const pillarGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.55, 0.55, height, 16);
    const pillar = new RedGPU.Display.Mesh(redGPUContext, pillarGeom, material);
    pillar.x = x;
    pillar.y = baseY + height / 2;
    pillar.z = z;
    pillar.castShadow = true;
    scene.addChild(pillar);
}

/**
 * [KO] 5개의 수영장 풀을 편리하게 실시간 제어할 수 있는 Tweakpane GUI 패널을 구성합니다.
 */
function renderTestPane(redGPUContext, lakes, directionalLight) {
    const lakeNames = ['Pool 1 (Top Alpine)', 'Pool 2 (Mid-Left Deep)', 'Pool 3 (Mid-Right Lagoon)', 'Pool 4 (Lower-Center)', 'Pool 5 (Bottom Mystic)'];

    const masterParams = {
        masterSSR: true,
        masterWaveScale: 1.0,
        activeLakeIndex: 0,
        elevation: directionalLight.elevation,
        azimuth: directionalLight.azimuth,
        lux: directionalLight.lux,
    };

    const currentParams = {
        name: lakeNames[0],
        waterLevel: lakes[0].waterLevel,
        waveAmplitude: lakes[0].waveAmplitude,
        waveSpeed: lakes[0].waveSpeed,
        baseColor: lakes[0].waterMaterial.baseColor.hex,
        deepColor: lakes[0].waterMaterial.deepColor.hex,
        roughness: lakes[0].waterMaterial.roughness,
        opacity: lakes[0].waterMaterial.opacity,
        refractionStrength: lakes[0].waterMaterial.refractionStrength,
        causticsStrength: lakes[0].waterMaterial.causticsStrength,
        enableSSR: lakes[0].waterMaterial.enableSSR,
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. 전역 마스터 제어 폴더
            const masterFolder = pane.addFolder({title: 'Master Controls (전역 제어)', expanded: true});

            masterFolder.addBinding(masterParams, 'masterSSR', {label: 'All SSR On/Off'})
                .on('change', (ev) => {
                    for (let i = 0; i < lakes.length; i++) {
                        lakes[i].waterMaterial.enableSSR = ev.value;
                    }
                    currentParams.enableSSR = ev.value;
                    pane.refresh();
                });

            masterFolder.addBinding(masterParams, 'masterWaveScale', {
                min: 0.0,
                max: 3.0,
                step: 0.1,
                label: 'Wave Scale'
            })
                .on('change', (ev) => {
                    const scale = ev.value;
                    const baseAmps = [0.02, 0.025, 0.015, 0.022, 0.018];
                    for (let i = 0; i < lakes.length; i++) {
                        lakes[i].waveAmplitude = baseAmps[i] * scale;
                    }
                    currentParams.waveAmplitude = lakes[masterParams.activeLakeIndex].waveAmplitude;
                    pane.refresh();
                });

            // 2. 수영장별 세부 선택 및 튜닝 폴더
            const lakeFolder = pane.addFolder({title: 'Selected Pool Tuning (수영장별 세부 제어)', expanded: true});

            lakeFolder.addBinding(masterParams, 'activeLakeIndex', {
                label: 'Select Pool',
                options: {
                    'Pool 1 (Top Alpine)': 0,
                    'Pool 2 (Mid-Left Deep)': 1,
                    'Pool 3 (Mid-Right Lagoon)': 2,
                    'Pool 4 (Lower-Center)': 3,
                    'Pool 5 (Bottom Mystic)': 4,
                }
            }).on('change', (ev) => {
                const lake = lakes[ev.value];
                const mat = lake.waterMaterial;
                currentParams.name = lakeNames[ev.value];
                currentParams.waterLevel = lake.waterLevel;
                currentParams.waveAmplitude = lake.waveAmplitude;
                currentParams.waveSpeed = lake.waveSpeed;
                currentParams.baseColor = mat.baseColor.hex;
                currentParams.deepColor = mat.deepColor.hex;
                currentParams.roughness = mat.roughness;
                currentParams.opacity = mat.opacity;
                currentParams.refractionStrength = mat.refractionStrength;
                currentParams.causticsStrength = mat.causticsStrength;
                currentParams.enableSSR = mat.enableSSR;
                pane.refresh();
            });

            lakeFolder.addBinding(currentParams, 'waterLevel', {
                min: -6.0,
                max: 8.0,
                step: 0.05,
                label: 'waterLevel (y)'
            })
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterLevel = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'waveAmplitude', {
                min: 0.0,
                max: 0.06,
                step: 0.001,
                label: 'waveAmplitude'
            })
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waveAmplitude = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'waveSpeed', {min: 0.0, max: 3.0, step: 0.1, label: 'waveSpeed'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waveSpeed = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'baseColor', {label: 'baseColor'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.baseColor.setColorByHEX(ev.value);
                });

            lakeFolder.addBinding(currentParams, 'deepColor', {label: 'deepColor'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.deepColor.setColorByHEX(ev.value);
                });

            lakeFolder.addBinding(currentParams, 'roughness', {min: 0.0, max: 1.0, step: 0.01, label: 'roughness'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.roughness = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'opacity', {min: 0.0, max: 1.0, step: 0.01, label: 'opacity'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.opacity = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'refractionStrength', {
                min: 0.0,
                max: 3.0,
                step: 0.05,
                label: 'refraction'
            })
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.refractionStrength = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'causticsStrength', {
                min: 0.0,
                max: 3.0,
                step: 0.05,
                label: 'caustics'
            })
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.causticsStrength = ev.value;
                });

            lakeFolder.addBinding(currentParams, 'enableSSR', {label: 'enableSSR'})
                .on('change', (ev) => {
                    lakes[masterParams.activeLakeIndex].waterMaterial.enableSSR = ev.value;
                });

            // 3. 태양광 환경 폴더
            const lightFolder = pane.addFolder({title: 'Directional Light (태양광)', expanded: false});

            lightFolder.addBinding(masterParams, 'elevation', {min: 5, max: 85, step: 1, label: 'elevation'})
                .on('change', (ev) => {
                    directionalLight.elevation = ev.value;
                });

            lightFolder.addBinding(masterParams, 'azimuth', {min: 0, max: 360, step: 1, label: 'azimuth'})
                .on('change', (ev) => {
                    directionalLight.azimuth = ev.value;
                });

            lightFolder.addBinding(masterParams, 'lux', {min: 10000, max: 150000, step: 5000, label: 'lux'})
                .on('change', (ev) => {
                    directionalLight.lux = ev.value;
                });
        }
    });
}
