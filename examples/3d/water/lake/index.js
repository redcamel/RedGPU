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
        // 1. 카메라 컨트롤러 설정 (호수의 전경: 얕은 여울, 신전 열주 SSR, Broken Straw 석주, 윤슬 동시 조망)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 28;
        controller.tilt = -13;
        controller.pan = 28;
        controller.speedDistance = 0.25;

        // 2. 씬 및 View3D 구성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false; // 자연스러운 자연 경관을 위해 그리드 비활성화
        redGPUContext.addView(view);

        // 3. 열대 일광 (Directional Light) 및 부드러운 천공 환경광 (Ambient Light)
        // 수면과 암초 상단에 풍부한 햇살을 공급하고 윤슬 기둥(Glitter Column)을 호수 중앙에 형성하는 태양각
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 26;
        directionalLight.azimuth = 148;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. PBR 기반 해변 환경 (해저 모래/자갈 바닥, 백사장 경사면, 해안 암초 군락)
        const beachEnvironment = createBeachEnvironment(redGPUContext, scene);

        // 5. WaterLake 수체 생성 (240x240 대형 에메랄드 라군 수면)
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 240, 240, 120, 120);
        lake.waterLevel = 0.5;

        // 파도 노멀 텍스처 장착 (Tessendorf FFT 호수 전용 트로코이드 파도 텍스처)
        // 노멀 맵은 물리 벡터 데이터이므로 sRGB 자동 감마 변환을 방지하기 위해 'rgba8unorm' (Linear) 포맷으로 로딩
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

        // 최상의 호수 쇼케이스 기본 튜닝값 적용
        lake.waterMaterial.refractionStrength = 0.025; // 물리 스넬 굴절 및 Broken Straw 꺾임
        lake.waterMaterial.roughness = 0.05;         // 선명하고 아름다운 수면 거울 반사 & 다이아몬드 윤슬
        lake.waterMaterial.causticsStrength = 0.85;   // 얕은 바닥에 춤추는 눈부신 카우스틱스 햇살망
        lake.waterMaterial.enableSSR = true;          // 실시간 스크린 공간 반사(SSR) 기본 활성화
        lake.waterMaterial.ssrStepCount = 48;         // 정밀 레이마칭 스텝수
        lake.waterMaterial.ssrMaxDistance = 50.0;     // 최대 추적 거리
        lake.waterMaterial.ssrThickness = 0.6;        // 교차 허용 두께

        // Phase 1: 기본 WaterLake 사각 평면 생성 및 씬 추가
        scene.addChild(lake);

        window.__testController = controller;
        window.__testLake = lake;
        window.__testLight = directionalLight;

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
 * [KO] PBRMaterial을 활용한 에메랄드 호수 풍경 (해저 지형, 백사장, 기암괴석, 고대 신전 열주 군락)
 *      모든 수체 특성(Depth Fade, 비어-람베르트, 카우스틱스, Broken Straw 굴절, SSR 실시간 반사)을
 *      한눈에 완벽히 감상할 수 있는 이상적인 환경을 구성합니다.
 * [EN] Scenic Lake Environment using PBRMaterial (Seabed Basin, Sand Beach, Sea Stacks, Ancient Temple Colonnade)
 */
function createBeachEnvironment(redGPUContext, scene) {
    const floatingRocks = [];

    // --- 1. PBR 텍스처 로딩 (Albedo는 sRGB, Normal/ORM은 Linear 'rgba8unorm') ---
    const gravelAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel.jpg');
    const gravelNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg', true, null, null, 'rgba8unorm');
    const gravelOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg', true, null, null, 'rgba8unorm');

    const rockAlbedo = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock.jpg');
    const rockNormal = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg', true, null, null, 'rgba8unorm');
    const rockOrm = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg', true, null, null, 'rgba8unorm');

    // 고화질 반복 샘플러 (Repeat + Anisotropy 16)
    const terrainRepeatSampler = new RedGPU.Resource.Sampler(redGPUContext, {
        addressModeU: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        addressModeV: RedGPU.GPU_ADDRESS_MODE.REPEAT,
        magFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        minFilter: RedGPU.GPU_FILTER_MODE.LINEAR,
        mipmapFilter: RedGPU.GPU_MIPMAP_FILTER_MODE.LINEAR,
        maxAnisotropy: 16
    });

    // --- 2. 해저 모래/자갈 분지 지반 (PBR Seabed Basin: 얕은 연안 -> 깊은 라군) ---
    // 수심에 따른 틴트 변화(비어-람베르트 광학 흡수)와 바닥 카우스틱스를 가장 잘 보여주는 완경사 지반
    const seabedMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    seabedMaterial.baseColorTexture = gravelAlbedo;
    seabedMaterial.normalTexture = gravelNormal;
    seabedMaterial.metallicRoughnessTexture = gravelOrm;
    seabedMaterial.occlusionTexture = gravelOrm;
    seabedMaterial.baseColorTextureSampler = terrainRepeatSampler;
    seabedMaterial.normalTextureSampler = terrainRepeatSampler;
    seabedMaterial.textureScale = [18, 18];
    seabedMaterial.baseColorFactor = [1.15, 1.1, 1.0, 1.0]; // 화사하고 밝은 산호 자갈 톤
    seabedMaterial.roughnessFactor = 0.92;
    seabedMaterial.metallicFactor = 0.0;

    const seabedGeometry = new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 280);
    const seabedMesh = new RedGPU.Display.Mesh(redGPUContext, seabedGeometry, seabedMaterial);
    seabedMesh.x = 0;
    seabedMesh.y = -2.2;
    seabedMesh.z = 0;
    seabedMesh.rotationX = 9.0; // 북쪽(z=-16)은 얕은 여울, 남쪽(z=+16)은 깊은 라군으로 완만히 하강
    scene.addChild(seabedMesh);

    // --- 3. 백사장 해변 경사면 (PBR White Sand Beach Slope) ---
    // 수면과 교차하며 비단결 같은 부드러운 해안선(Depth Fade)을 연출하는 완경사 모래사장
    const beachMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    beachMaterial.baseColorTexture = gravelAlbedo;
    beachMaterial.normalTexture = gravelNormal;
    beachMaterial.metallicRoughnessTexture = gravelOrm;
    beachMaterial.occlusionTexture = gravelOrm;
    beachMaterial.baseColorTextureSampler = terrainRepeatSampler;
    beachMaterial.normalTextureSampler = terrainRepeatSampler;
    beachMaterial.textureScale = [36, 6];
    beachMaterial.baseColorFactor = [1.32, 1.25, 1.15, 1.0]; // 햇빛을 가득 머금은 백사장
    beachMaterial.roughnessFactor = 0.95;
    beachMaterial.metallicFactor = 0.0;

    const beachGeometry = new RedGPU.Primitive.Box(redGPUContext, 280, 2.0, 40);
    const beachMesh = new RedGPU.Display.Mesh(redGPUContext, beachGeometry, beachMaterial);
    beachMesh.x = 0;
    beachMesh.y = 0.35;
    beachMesh.z = -30;
    beachMesh.rotationX = 13.5;
    scene.addChild(beachMesh);

    // --- 4. 기암괴석 및 해안 암초 군락 (PBR Coastal Rocks & Cliffs) ---
    const rockMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    rockMaterial.baseColorTexture = rockAlbedo;
    rockMaterial.normalTexture = rockNormal;
    rockMaterial.metallicRoughnessTexture = rockOrm;
    rockMaterial.occlusionTexture = rockOrm;
    rockMaterial.baseColorTextureSampler = terrainRepeatSampler;
    rockMaterial.normalTextureSampler = terrainRepeatSampler;
    rockMaterial.textureScale = [1.4, 1.4];
    rockMaterial.baseColorFactor = [1.2, 1.16, 1.12, 1.0];
    rockMaterial.roughnessFactor = 0.82;
    rockMaterial.metallicFactor = 0.04;

    // (A) 우측 전경: 웅장한 주상절리 기암절벽 섬 (Seastack Rock Island)
    // 수면 위 웅장한 바위의 모습과 수면에 비친 바위 질감의 SSR 실시간 반사를 동시 제공
    const rockStackGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 2.2, 3.0, 8.5, 18);
    const rockStack = new RedGPU.Display.Mesh(redGPUContext, rockStackGeom, rockMaterial);
    rockStack.x = 11.5;
    rockStack.y = 2.2;
    rockStack.z = -0.5;
    rockStack.rotationY = 25;
    rockStack.rotationZ = -4;
    scene.addChild(rockStack);

    const rockStackSubGeom = new RedGPU.Primitive.Sphere(redGPUContext, 2.6, 24, 24);
    const rockStackSub = new RedGPU.Display.Mesh(redGPUContext, rockStackSubGeom, rockMaterial);
    rockStackSub.x = 7.8;
    rockStackSub.y = 1.0;
    rockStackSub.z = -4.2;
    rockStackSub.scaleX = 1.3;
    rockStackSub.scaleY = 0.9;
    rockStackSub.scaleZ = 1.2;
    rockStackSub.rotationX = 40;
    rockStackSub.rotationY = -25;
    scene.addChild(rockStackSub);

    // (B) 맑은 에메랄드 물밑에 잠긴 수중 암초들 (Submerged Coral Reefs)
    // 수심에 따른 굴절 왜곡(Refraction)과 비어-람베르트 수심 흡수, 수중 카우스틱스 투영 시연
    const submergedReefs = [
        {x: -11, y: -0.9, z: -4, scale: [3.2, 1.3, 2.8], rotX: 35, rotY: 15},   // 얕은 연안 암초 (수심 0.3m, 선명한 카우스틱스 춤)
        {x: -9.5, y: -1.7, z: 4, scale: [3.8, 1.5, 3.4], rotX: -25, rotY: 45},   // 중간 수심 암초 (수심 0.9m, 청록 전이)
        {x: -6.5, y: -2.8, z: 11, scale: [4.4, 2.0, 4.0], rotX: 40, rotY: -30},  // 깊은 라군 암초 (수심 1.6m, 사파이어 흡수)
        {x: 5.5, y: -1.4, z: 4, scale: [2.6, 1.2, 2.6], rotX: 20, rotY: 60},     // 중앙 얕은 암초 (수심 0.7m)
        {x: 1.5, y: -2.6, z: 10, scale: [3.6, 1.7, 3.0], rotX: -30, rotY: -15},   // 중앙 깊은 암초 (수심 1.5m)
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

    // (C) 백사장 물가에 걸쳐 파도가 찰랑이는 해안 조약돌/바위 (Shoreline Boulders)
    const shorelineBoulders = [
        {x: -14, y: 0.5, z: -8, scale: [2.4, 1.8, 2.2], rotX: 30, rotY: 25},
        {x: -6, y: 0.38, z: -8.5, scale: [1.8, 1.3, 1.6], rotX: -35, rotY: -40},
        {x: 13, y: 0.48, z: -7, scale: [2.6, 1.7, 2.4], rotX: 45, rotY: 10},
        {x: 2.5, y: 0.28, z: -7.5, scale: [2.0, 1.2, 1.8], rotX: -20, rotY: 55},
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

    // (D) 물결에 가볍게 호흡하는 부유 산호 바위 (Floating Coral Heads)
    const floatReefGeom = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 16, 16);
    const floatReef1 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef1.x = -2.5;
    floatReef1.y = 0.46;
    floatReef1.originalY = 0.46;
    floatReef1.z = 6;
    scene.addChild(floatReef1);
    floatingRocks.push(floatReef1);

    const floatReef2 = new RedGPU.Display.Mesh(redGPUContext, floatReefGeom, rockMaterial);
    floatReef2.x = 7.5;
    floatReef2.y = 0.38;
    floatReef2.originalY = 0.38;
    floatReef2.z = 8;
    floatReef2.scaleX = 0.85;
    floatReef2.scaleZ = 0.85;
    scene.addChild(floatReef2);
    floatingRocks.push(floatReef2);

    // --- 5. 고대 신전 유적 군락 (Ancient Temple Sanctuary) ---
    // [SSR 반사] + [스넬 굴절 Broken Straw] + [수중 틴트]를 극대화하는 신전 열주와 관통 석주

    // 5-1. 순백의 고대 신전 대리석 기둥 재질 (White Marble Material)
    const marbleMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    marbleMaterial.baseColorFactor = [1.7, 1.68, 1.62, 1.0]; // 화사하고 눈부신 백색 대리석
    marbleMaterial.roughnessFactor = 0.18; // 매끄러운 표면 질감
    marbleMaterial.metallicFactor = 0.05;

    // 5-2. 고대 테라코타 오벨리스크/포털 재질 (Warm Terracotta Material)
    // 수면의 에메랄드 그린과 환상적인 보색 대비를 이루어 물에 비친 SSR 반사상을 극명하게 부각
    const terracottaMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    terracottaMaterial.baseColorFactor = [1.75, 0.52, 0.32, 1.0]; // 따뜻하고 짙은 테라코타 주황/적갈색
    terracottaMaterial.roughnessFactor = 0.28;
    terracottaMaterial.metallicFactor = 0.05;

    // (A) 신전 기단 (Temple Dais Base) - 물가 바로 위에 위치하여 안정감 있는 건축미 선사
    const platformGeom = new RedGPU.Primitive.Box(redGPUContext, 8.5, 0.8, 6.0);
    const platformMesh = new RedGPU.Display.Mesh(redGPUContext, platformGeom, marbleMaterial);
    platformMesh.x = -3.2;
    platformMesh.y = 0.7; // 수면(0.5m) 살짝 위로 0.2m 노출
    platformMesh.z = 2.0;
    platformMesh.rotationY = 22;
    scene.addChild(platformMesh);

    // (B) 웅장한 중앙 테라코타 오벨리스크 (Central Terracotta Obelisk)
    // 수면 위 약 12m 높이로 치솟아 화면 중앙에서 선명한 붉은빛 수면 SSR 반사 기둥을 형성
    const obeliskGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.65, 1.1, 13.5, 16);
    const obeliskMesh = new RedGPU.Display.Mesh(redGPUContext, obeliskGeom, terracottaMaterial);
    obeliskMesh.x = -3.2;
    obeliskMesh.y = 6.8;
    obeliskMesh.z = 2.0;
    obeliskMesh.rotationY = 22;
    scene.addChild(obeliskMesh);

    // (C) 신전 대리석 열주 군락 (Temple Marble Colonnade - 4개의 기둥과 상단 엔타블러처)
    // 에메랄드 수면에 새하얗게 데칼코마니처럼 비치는 실시간 SSR 반사 시연
    const columnGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 0.5, 9.0, 24);
    const colonnadeCoords = [
        {x: -5.8, z: 0.6, h: 9.0},
        {x: -1.0, z: 3.2, h: 9.0},
        {x: 3.8, z: 1.2, h: 8.5},
        {x: 6.8, z: 3.5, h: 8.5},
    ];

    colonnadeCoords.forEach((p, idx) => {
        const column = new RedGPU.Display.Mesh(redGPUContext, columnGeom, marbleMaterial);
        column.x = p.x;
        column.y = 4.3;
        column.z = p.z;
        scene.addChild(column);

        // 상단 주두 (Capital)
        const capGeom = new RedGPU.Primitive.Box(redGPUContext, 1.3, 0.45, 1.3);
        const cap = new RedGPU.Display.Mesh(redGPUContext, capGeom, marbleMaterial);
        cap.x = p.x;
        cap.y = 8.8;
        cap.z = p.z;
        scene.addChild(cap);
    });

    // 대리석 기둥 상단을 연결하는 엔타블러처 보 (Entablature Beam)
    const beamGeom = new RedGPU.Primitive.Box(redGPUContext, 5.5, 0.6, 1.2);
    const beam = new RedGPU.Display.Mesh(redGPUContext, beamGeom, marbleMaterial);
    beam.x = -3.4;
    beam.y = 9.3;
    beam.z = 1.9;
    beam.rotationY = 28;
    scene.addChild(beam);

    // (D) 수면 관통 경사 대리석 석주 (The Broken Straw Colonnade Pillar)
    // ★★★ 핵심 시연: 수면을 35도 각도로 시원하게 관통!
    //  1) 수면 밖: 위로 뻗은 대리석 기둥 본체
    //  2) 수면 표면: 수면에 비치는 실시간 SSR 파도 반사
    //  3) 수면 아래: 스넬의 법칙에 의해 굴절되어 꺾여 보이는 완벽한 'Broken Straw' 현상
    const strawGeom = new RedGPU.Primitive.Cylinder(redGPUContext, 0.45, 0.55, 12.0, 20);
    const strawMesh = new RedGPU.Display.Mesh(redGPUContext, strawGeom, marbleMaterial);
    strawMesh.x = 0.5;
    strawMesh.y = 1.2;
    strawMesh.z = -1.2;
    strawMesh.rotationZ = 34; // 수면을 비스듬히 관통
    strawMesh.rotationX = 18;
    scene.addChild(strawMesh);

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
        ibl: true,
        gui: (pane) => {
            // [Phase 1~3] WaterLake 기본 및 디버그 제어 패널
            const basicFolder = pane.addFolder({title: 'WaterLake Controller', expanded: true});
            basicFolder.addBinding(lake, 'waterLevel', {min: -3, max: 4, step: 0.05});

            // lake.waterMaterial에 직접 연결 (Direct Binding)
            basicFolder.addBinding(lake.waterMaterial, 'debugMode', {
                options: {
                    'PBR Water (Full Phase 17) (0)': 0,
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
            basicFolder.addBinding(lake.waterMaterial, 'debugMaxDepth', {
                min: 0.5,
                max: 30.0,
                step: 0.5
            });

            // [Phase 14] 수중 바닥 햇살 일렁임 카우스틱스 (Underwater Caustics) 제어 패널
            const causticsFolder = pane.addFolder({title: 'Underwater Caustics (Phase 14)', expanded: true});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.2, max: 3.0, step: 0.05});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsSpeed', {min: 0.0, max: 3.0, step: 0.05});

            // [Phase 12] 버텍스 셰이더 미세 장파장 너울 (Micro Swell) 제어 패널
            const swellFolder = pane.addFolder({title: 'Micro Swell (Phase 12)', expanded: false});
            swellFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.15, step: 0.005});
            swellFolder.addBinding(lake, 'waveWavelength', {min: 2.0, max: 60.0, step: 1.0});
            swellFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});

            // [Phase 7, 8, 9] 파도 노멀 및 굴절 왜곡 제어 패널
            const waveFolder = pane.addFolder({title: 'Waves & Refraction (Phase 7~9)', expanded: true});
            waveFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});

            // 주 파도 (Layer 1: Base Swell)
            const layer1Folder = waveFolder.addFolder({title: 'Layer 1: Base Swell', expanded: false});
            layer1Folder.addBinding(lake.waterMaterial, 'normalScale', {min: 0.0, max: 1.5, step: 0.01});
            layer1Folder.addBinding(lake.waterMaterial, 'normalTiling', {min: 1.0, max: 120.0, step: 1.0});
            layer1Folder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.2, step: 0.005});
            layer1Folder.addBinding(lake.waterMaterial, 'invertNormalY1');

            // 제2 파도 (Layer 2: Micro Ripple with RNM)
            const layer2Folder = waveFolder.addFolder({title: 'Layer 2: Micro Ripple (RNM)', expanded: true});
            layer2Folder.addBinding(lake.waterMaterial, 'useNormalTexture2');
            layer2Folder.addBinding(lake.waterMaterial, 'normalScale2', {min: 0.0, max: 1.5, step: 0.01});
            layer2Folder.addBinding(lake.waterMaterial, 'normalTiling2', {min: 1.0, max: 200.0, step: 1.0});
            layer2Folder.addBinding(lake.waterMaterial, 'windSpeed2', {min: 0.0, max: 0.2, step: 0.005});
            layer2Folder.addBinding(lake.waterMaterial, 'invertNormalY2');

            // [Phase 6] 수체 물리 광학 및 이중 알베도 제어 패널
            const colorFolder = pane.addFolder({title: 'Water Color & Optics (Phase 6)', expanded: false});
            const colorParams = {
                baseColor: {
                    r: lake.waterMaterial.baseColor.r,
                    g: lake.waterMaterial.baseColor.g,
                    b: lake.waterMaterial.baseColor.b
                },
                deepColor: {
                    r: lake.waterMaterial.deepColor.r,
                    g: lake.waterMaterial.deepColor.g,
                    b: lake.waterMaterial.deepColor.b
                }
            };
            colorFolder.addBinding(colorParams, 'baseColor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.baseColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(colorParams, 'deepColor', {view: 'color'}).on('change', (ev) => {
                const {r, g, b} = ev.value;
                lake.waterMaterial.deepColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
            });
            colorFolder.addBinding(lake.waterMaterial, 'extinctionFactor', {min: 0.01, max: 2.0, step: 0.01});
            colorFolder.addBinding(lake.waterMaterial, 'turbidity', {min: 0.0, max: 1.0, step: 0.01});
            colorFolder.addBinding(lake.waterMaterial, 'opacity', {min: 0.0, max: 1.0, step: 0.05});
            colorFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.05, max: 10.0, step: 0.05});

            // [Phase 10] Schlick Fresnel & 환경 거울 반사 제어 패널
            const reflectionFolder = pane.addFolder({title: 'Sky Reflection & Fresnel (Phase 10)', expanded: true});
            reflectionFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.0, max: 1.0, step: 0.01});
            reflectionFolder.addBinding(lake.waterMaterial, 'specularFactor', {min: 0.0, max: 2.0, step: 0.05});
            reflectionFolder.addBinding(lake.waterMaterial, 'fresnelF0', {min: 0.0, max: 0.1, step: 0.005});

            // [Phase 17] 스크린 공간 반사 (SSR - Screen Space Reflection) 제어 패널
            const ssrFolder = pane.addFolder({title: 'Screen Space Reflection (Phase 17)', expanded: true});
            ssrFolder.addBinding(lake.waterMaterial, 'enableSSR');
            ssrFolder.addBinding(lake.waterMaterial, 'ssrMaxDistance', {min: 5.0, max: 60.0, step: 1.0});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrStepCount', {min: 8, max: 64, step: 8});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrThickness', {min: 0.1, max: 2.0, step: 0.05});

            // [환경 조명] 직사광(태양) 및 천공 환경광 제어 패널
            const sunFolder = pane.addFolder({title: 'Lighting & Sun (Phase 11)', expanded: false});
            sunFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            sunFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            sunFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});

        }
    });
}

