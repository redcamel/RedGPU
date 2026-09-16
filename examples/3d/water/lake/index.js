import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] WaterLake & SingleLayerWaterMaterial: 아름다운 에메랄드 해변(Emerald Beach) 쇼케이스
 * [EN] WaterLake & SingleLayerWaterMaterial: Beautiful Emerald Beach Showcase
 *
 * [KO] PBRMaterial을 활용한 자연스러운 백사장, 해저 자갈 분지, 해안 암초 군락 위에
 *      SingleLayerWater PBR 광학 수체(WaterLake)를 결합한 몰디브/카리브해 스타일의 에메랄드 해변 데모입니다:
 *  - 모든 지형 및 암석에 PBRMaterial (Albedo, Normal, ORM) 적용
 *  - 맑고 청명한 에메랄드 터콰이즈(#18d8b6) ➔ 깊은 라군 사파이어(#023d58) 비어-람베르트 광학 흡수
 *  - 백사장과 만나는 비단결 같은 부드러운 해안선(Depth Fade)
 *  - 눈부신 태양광 직사각 아래 쏟아지는 찬란한 다이아몬드 윤슬 기둥(Sun Glitter Column)
 *  - 수중 암초와 모래바닥의 아지랑이 같은 스넬의 굴절 왜곡(Snell Refraction)
 *  - 2.0cm 미세 너울(Micro Swell)과 듀얼 노멀(RNM 블렌딩) 찰랑이는 파도
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (해변 전경 및 윤슬 최적 각도)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;
        controller.tilt = -22;
        controller.pan = 35;
        controller.speedDistance = 0.25;

        // 2. 씬 및 View3D 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false; // 자연스러운 자연 경관을 위해 그리드 비활성화
        redGPUContext.addView(view);

        // 3. 열대 일광 (Directional Light) 및 맑은 하늘 환경광 (Ambient Light)
        // 수면과 암초 상단에 풍부한 햇살을 공급하고 윤슬 기둥을 형성하는 태양각
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 85;
        directionalLight.azimuth = 145;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);



        // 4. PBR 기반 해변 환경 (해저 모래/자갈 바닥, 백사장 경사면, 해안 암초 군락)
        const beachEnvironment = createBeachEnvironment(redGPUContext, scene);

        // 5. WaterLake 수체 생성 (신규 코어 기본값 '에메랄드 호수' 자동 적용)
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 96, 96, 80, 80);
        lake.waterLevel = 0.5;

        // Phase 1: 기본 WaterLake 사각 평면 생성 및 씬 추가
        scene.addChild(lake);

        // 6. 렌더러 생성 및 렌더 루프
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // 수중 암초 일부의 미세한 파도 흔들림
            const floatingRocks = beachEnvironment.floatingRocks;
            const count = floatingRocks.length;
            const t = time * 0.001;
            for (let i = 0; i < count; i++) {
                const rock = floatingRocks[i];
                rock.y = rock.originalY + Math.sin(t * 1.5 + i) * 0.04;
            }
        };
        renderer.start(redGPUContext, render);

        // 7. 실시간 튜닝 GUI 패널
        renderTestPane(redGPUContext, lake, directionalLight, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] PBRMaterial을 활용한 자연스러운 해변 지형 및 암초/바위 환경을 구축합니다.
 * [EN] Creates a natural beach terrain and coastal rock environment using PBRMaterial.
 */
function createBeachEnvironment(redGPUContext, scene) {
    const floatingRocks = [];

    // --- 1. PBR 텍스처 로딩 ---
    const gravelAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel.jpg');
    const gravelNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg');
    const gravelOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg');

    const rockAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock.jpg');
    const rockNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg');
    const rockOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg');

    // --- 1-1. 지형/해변/암석 UV 타일링을 위한 고화질 반복 샘플러 (Repeat + Anisotropy 16) ---
    // PBRMaterial의 기본 샘플러는 'clamp-to-edge'이므로, textureScale 타일링 시 텍스처 늘어남/뭉개짐을 방지하고
    // 원경 경사면에서도 극상의 디테일을 유지하도록 16x 이방성 필터링과 무한 반복 샘플러를 명시 장착합니다.
    const terrainRepeatSampler = new RedGPU.Resource.Sampler(redGPUContext, {
        addressModeU: 'repeat',
        addressModeV: 'repeat',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear',
        maxAnisotropy: 16
    });

    // --- 2. 해저 모래/자갈 분지 지반 (PBR Seabed Basin: 0m 연안 -> 5.5m 깊은 라군) ---
    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorTexture = gravelAlbedo;
    seabedMaterial.normalTexture = gravelNormal;
    seabedMaterial.metallicRoughnessTexture = gravelOrm;
    seabedMaterial.occlusionTexture = gravelOrm;
    seabedMaterial.baseColorTextureSampler = terrainRepeatSampler;
    seabedMaterial.normalTextureSampler = terrainRepeatSampler;
    seabedMaterial.textureScale = [16, 16];
    seabedMaterial.baseColorFactor = [1.1, 1.05, 0.95, 1.0]; // 화사한 산호 모래/자갈 톤
    seabedMaterial.roughnessFactor = 0.92;
    seabedMaterial.metallicFactor = 0.0;

    const seabedGeometry = new RedGPU.Primitive.Box(redGPUContext, 128, 1.2, 128);
    const seabedMesh = new RedGPU.Display.Mesh(redGPUContext, seabedGeometry, seabedMaterial);
    seabedMesh.x = 0;
    seabedMesh.y = -2.3;
    seabedMesh.z = 0;
    seabedMesh.rotationX = 9.5; // 북쪽(z=-14)은 얕은 여울, 남쪽(z=+14)은 깊은 라군으로 완만히 하강
    scene.addChild(seabedMesh);

    // --- 3. 백사장 해변 경사면 (PBR White Sand Beach Slope) ---
    // 물과 만나는 경계선에서 부드러운 해안선 감쇄(Depth Fade)를 연출하는 완경사 모래사장
    const beachMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    beachMaterial.baseColorTexture = gravelAlbedo;
    beachMaterial.normalTexture = gravelNormal;
    beachMaterial.metallicRoughnessTexture = gravelOrm;
    beachMaterial.occlusionTexture = gravelOrm;
    beachMaterial.baseColorTextureSampler = terrainRepeatSampler;
    beachMaterial.normalTextureSampler = terrainRepeatSampler;
    beachMaterial.textureScale = [24, 4];
    beachMaterial.baseColorFactor = [1.28, 1.22, 1.12, 1.0]; // 밝고 따뜻한 백사장 색조
    beachMaterial.roughnessFactor = 0.95;
    beachMaterial.metallicFactor = 0.0;

    const beachGeometry = new RedGPU.Primitive.Box(redGPUContext, 128, 1.5, 22);
    const beachMesh = new RedGPU.Display.Mesh(redGPUContext, beachGeometry, beachMaterial);
    beachMesh.x = 0;
    beachMesh.y = 0.3;
    beachMesh.z = -12;
    beachMesh.rotationX = 14;
    scene.addChild(beachMesh);

    // --- 4. 해안 암초 & 기암괴석 군락 (PBR Coastal Reefs & Rocks) ---
    const rockMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rockMaterial.baseColorTexture = rockAlbedo;
    rockMaterial.normalTexture = rockNormal;
    rockMaterial.metallicRoughnessTexture = rockOrm;
    rockMaterial.occlusionTexture = rockOrm;
    rockMaterial.baseColorTextureSampler = terrainRepeatSampler;
    rockMaterial.normalTextureSampler = terrainRepeatSampler;
    rockMaterial.textureScale = [1.2, 1.2]; // 자연스러운 암석 디테일 스케일
    rockMaterial.baseColorFactor = [1.18, 1.15, 1.1, 1.0]; // 어두운 그늘에서도 자연스러운 채도 유지
    rockMaterial.roughnessFactor = 0.82;
    rockMaterial.metallicFactor = 0.04;

    // (A) 수면 밖으로 웅장하게 솟아오른 주상절리 암초 섬 (Piercing Reef Island)
    const mainReefGeometry = new RedGPU.Primitive.Box(redGPUContext, 6.5, 7.0, 5.5);
    const mainReef = new RedGPU.Display.Mesh(redGPUContext, mainReefGeometry, rockMaterial);
    mainReef.x = 9;
    mainReef.y = 1.2;
    mainReef.z = -3;
    mainReef.rotationY = 32;
    mainReef.rotationZ = 6;
    scene.addChild(mainReef);

    const subReefGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 2.8, 24, 24);
    const subReef = new RedGPU.Display.Mesh(redGPUContext, subReefGeometry, rockMaterial);
    subReef.x = 6.5;
    subReef.y = 0.6;
    subReef.z = -5.5;
    subReef.scaleX = 1.3;
    subReef.scaleY = 0.9;
    subReef.scaleZ = 1.2;
    subReef.rotationX = 45; // 극점 UV 왜곡 분산
    subReef.rotationY = -20;
    scene.addChild(subReef);

    // (B) 맑은 에메랄드 물밑에 잠긴 수중 암초들 (Submerged Coral Reefs)
    // 수심에 따른 굴절 왜곡(Refraction)과 비어-람베르트 수심 흡수를 입증
    const submergedReefs = [
        {x: -8, y: -1.0, z: -3, scale: [3.0, 1.2, 2.6], rotX: 35, rotY: 15},   // 얕은 연안 암초 (수심 0.3m, 에메랄드 굴절)
        {x: -9.5, y: -1.7, z: 3, scale: [3.6, 1.4, 3.2], rotX: -25, rotY: 45},  // 중간 수심 암초 (수심 0.8m, 청록 전이)
        {x: -7, y: -2.8, z: 9, scale: [4.2, 1.8, 3.8], rotX: 40, rotY: -30},   // 깊은 라군 암초 (수심 1.5m, 사파이어 흡수)
        {x: 4, y: -1.3, z: 2, scale: [2.5, 1.1, 2.5], rotX: 20, rotY: 60},     // 중앙 얕은 암초 (수심 0.7m)
        {x: 1, y: -2.5, z: 8, scale: [3.4, 1.6, 2.8], rotX: -30, rotY: -15},    // 중앙 깊은 암초 (수심 1.4m)
    ];

    submergedReefs.forEach((info) => {
        const reefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
        const reefMesh = new RedGPU.Display.Mesh(redGPUContext, reefGeom, rockMaterial);
        reefMesh.x = info.x;
        reefMesh.y = info.y;
        reefMesh.z = info.z;
        reefMesh.scaleX = info.scale[0];
        reefMesh.scaleY = info.scale[1];
        reefMesh.scaleZ = info.scale[2];
        reefMesh.rotationX = info.rotX;
        reefMesh.rotationY = info.rotY;
        scene.addChild(reefMesh);
    });

    // (C) 백사장 물가에 걸쳐 파도가 찰랑이는 바위들 (Shoreline Boulders)
    const shorelineBoulders = [
        {x: -12, y: 0.5, z: -7, scale: [2.2, 1.8, 2.0], rotX: 30, rotY: 25},
        {x: -5, y: 0.35, z: -7.5, scale: [1.6, 1.2, 1.5], rotX: -35, rotY: -40},
        {x: 12, y: 0.45, z: -8, scale: [2.5, 1.6, 2.2], rotX: 45, rotY: 10},
        {x: 2, y: 0.25, z: -6, scale: [1.8, 1.1, 1.6], rotX: -20, rotY: 55},
    ];

    shorelineBoulders.forEach((info) => {
        const boulderGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 20, 20);
        const boulderMesh = new RedGPU.Display.Mesh(redGPUContext, boulderGeom, rockMaterial);
        boulderMesh.x = info.x;
        boulderMesh.y = info.y;
        boulderMesh.z = info.z;
        boulderMesh.scaleX = info.scale[0];
        boulderMesh.scaleY = info.scale[1];
        boulderMesh.scaleZ = info.scale[2];
        boulderMesh.rotationX = info.rotX;
        boulderMesh.rotationY = info.rotY;
        scene.addChild(boulderMesh);
    });

    // (D) 수면을 비스듬히 관통하는 천연 해안 석주 (Natural Seastack - Broken Straw 굴절 꺾임 시연)
    const seastackGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 0.7, 13, 20);
    const seastackMesh = new RedGPU.Display.Mesh(redGPUContext, seastackGeom, rockMaterial);
    seastackMesh.x = 3;
    seastackMesh.y = 0.2;
    seastackMesh.z = -1;
    seastackMesh.rotationZ = 30;
    seastackMesh.rotationX = 22;
    scene.addChild(seastackMesh);

    // (E) 물결에 가볍게 호흡하는 수면 암초 (Floating Coral Heads)
    const floatReefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 16, 16);
    const floatReef1 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef1.x = -1;
    floatReef1.y = 0.45;
    floatReef1.originalY = 0.45;
    floatReef1.z = 4;
    scene.addChild(floatReef1);
    floatingRocks.push(floatReef1);

    const floatReef2 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef2.x = 6;
    floatReef2.y = 0.35;
    floatReef2.originalY = 0.35;
    floatReef2.z = 7;
    floatReef2.scaleX = 0.8;
    floatReef2.scaleZ = 0.8;
    scene.addChild(floatReef2);
    floatingRocks.push(floatReef2);

    return {floatingRocks};
}

/**
 * [KO] WaterLake 실시간 속성 제어를 위한 Tweakpane GUI를 구성합니다.
 * [EN] Configures Tweakpane GUI for real-time control of WaterLake properties.
 */
function renderTestPane(redGPUContext, lake, directionalLight, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        skybox: true,
        ibl: false,
        gui: (pane) => {
            // [Phase 1~3] WaterLake 기본 및 디버그 제어 패널
            const basicFolder = pane.addFolder({title: 'WaterLake Controller', expanded: true});
            basicFolder.addBinding(lake, 'waterLevel', {min: -3, max: 4, step: 0.05});

            // lake.waterMaterial에 직접 연결 (Direct Binding)
            basicFolder.addBinding(lake.waterMaterial, 'debugMode', {
                options: {
                    'Soft Surface with Scene Passthrough (0)': 0,
                    'Scene Passthrough (6)': 6,
                    'Depth Fade Mask (5)': 5,
                    'Delta Depth Water Mask (4)': 4,
                    'Linear Water Depth (3)': 3,
                    'Linear Scene Depth (2)': 2,
                    'Raw Scene Depth (1)': 1
                }
            });
            basicFolder.addBinding(lake.waterMaterial, 'opacity', {
                min: 0.0,
                max: 1.0,
                step: 0.05
            });
            basicFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {
                min: 0.05,
                max: 10.0,
                step: 0.05
            });
            basicFolder.addBinding(lake.waterMaterial, 'debugMaxDepth', {
                min: 0.5,
                max: 30.0,
                step: 0.5
            });

            // [환경 조명] 직사광 태양 제어 패널
            const sunFolder = pane.addFolder({title: 'Directional Light', expanded: false});
            sunFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            sunFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            sunFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
        }
    });
}

