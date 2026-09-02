import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] CSM (Cascaded Shadow Maps) & PCSS 센트럴 파크 종합 예제
 * [EN] CSM (Cascaded Shadow Maps) & PCSS Radial Central Park Comprehensive Example
 *
 * [KO] 360도 방사형 다층 구조(0m~150m)와 언리얼 엔진 5 스타일 캐스케이드 디버그 뷰를 통해 4단 CSM과 PCSS의 퀄리티를 완벽하게 검증합니다.
 * [EN] Comprehensively verifies 4-cascade CSM and PCSS quality with a 360-degree radial multi-tier layout (0m~150m) and UE5-style cascade color debug view.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = -22;
        controller.pan = 35;
        controller.distance = 28;
        controller.minDistance = 2;
        controller.maxDistance = 300;
        controller.speedDistance = 2.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. 조명 설정 (방향성 태양광)
        const directionalLight = new RedGPU.Light.DirectionalLight(
            [-0.6, -1.0, -0.5],
            "#fff8eb",
            120000
        );
        directionalLight.azimuth = 45;
        directionalLight.elevation = 38;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3. IBL 및 HDR 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            "../../../assets/hdr/2k/furstenstein_2k.hdr"
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        // 4. 방사형 센트럴 파크 씬 구축 (0m ~ 150m 다층 구조)
        const animatedMeshes = buildRadialParkScene(redGPUContext, scene);

        // 5. 애니메이션 렌더 루프
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            const t = time / 1000;
            // 중앙 조각상 및 부유 오브젝트들의 부드러운 회전
            for (let i = 0; i < animatedMeshes.length; i++) {
                const mesh = animatedMeshes[i];
                mesh.rotationY += 1.0;
                mesh.rotationX += 0.5;
            }
        });

        // 6. 리사이즈 이벤트 처리
        /**
         * @param {RedGPU.RedResizeEvent} event [KO] 리사이즈 이벤트 객체 [EN] Resize event object
         */
        redGPUContext.onResize = (event) => {
            console.log("Canvas resized:", event.width, event.height);
        };

        // 7. GUI 설정 (CSM 실시간 조작 + UE5 캐스케이드 디버그 뷰 토글)
        renderTestPane(redGPUContext, controller, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 360도 방사형 다층 센트럴 파크 씬을 구성합니다.
 * [EN] Constructs a 360-degree radial multi-tier Central Park scene.
 */
const buildRadialParkScene = (redGPUContext, scene) => {
    const animatedMeshes = [];

    // 1. 초대형 원형 지면 (350m x 350m)
    const groundMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, "#334155");
    groundMaterial.shininess = 16;
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 350, 350, 48, 48),
        groundMaterial
    );
    ground.receiveShadow = true;
    scene.addChild(ground);

    // 머티리얼 정의
    const goldMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, "#f59e0b");
    goldMaterial.shininess = 64;

    const marbleMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, "#cbd5e1");
    marbleMaterial.shininess = 32;

    const darkMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, "#1e293b");
    darkMaterial.shininess = 48;

    const accentMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, "#ef4444");
    accentMaterial.shininess = 48;

    // 기하 구조 재사용
    const torusKnotGeo = new RedGPU.Primitive.TorusKnot(redGPUContext, 1.4, 0.4, 128, 64, 2, 3);
    const centerPedestalGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 4.0, 4.5, 1.2, 32);
    const thinBarGeo = new RedGPU.Primitive.Box(redGPUContext, 0.15, 3.5, 0.15);
    const smallCubeGeo = new RedGPU.Primitive.Box(redGPUContext, 0.8, 0.8, 0.8);

    const tier1PillarGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 0.45, 7.0, 24);
    const sphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.9, 24, 24);

    const tier2TowerGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 1.2, 1.6, 16.0, 24);
    const archBeamGeo = new RedGPU.Primitive.Box(redGPUContext, 16.0, 1.2, 2.0);

    const tier3GiantTowerGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 2.5, 3.5, 28.0, 32);
    const giantSphereGeo = new RedGPU.Primitive.Sphere(redGPUContext, 3.0, 32, 32);

    // =========================================================================
    // 🏛️ [Tier 0: Central Hub - Cascade 0 (0m ~ 3.5m)] 초근접 초선명 디테일 검증 구역
    // =========================================================================
    // 중앙 대좌
    const pedestal = new RedGPU.Display.Mesh(redGPUContext, centerPedestalGeo, marbleMaterial);
    pedestal.y = 0.6;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.addChild(pedestal);

    // 중앙 황금 조각상 (TorusKnot)
    const centerKnot = new RedGPU.Display.Mesh(redGPUContext, torusKnotGeo, goldMaterial);
    centerKnot.y = 3.6;
    centerKnot.castShadow = true;
    centerKnot.receiveShadow = true;
    scene.addChild(centerKnot);
    animatedMeshes.push(centerKnot);

    // 중앙 대좌 주변의 촘촘한 미세 와이어/철창 격자 기둥 12개 (초미세 섀도우 디테일 검증)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const bar = new RedGPU.Display.Mesh(redGPUContext, thinBarGeo, darkMaterial);
        bar.x = Math.cos(angle) * 3.2;
        bar.y = 2.95;
        bar.z = Math.sin(angle) * 3.2;
        bar.castShadow = true;
        bar.receiveShadow = true;
        scene.addChild(bar);
    }

    // 대좌 주변 미니 큐브 4개
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const cube = new RedGPU.Display.Mesh(redGPUContext, smallCubeGeo, accentMaterial);
        cube.x = Math.cos(angle) * 2.2;
        cube.y = 1.6;
        cube.z = Math.sin(angle) * 2.2;
        cube.rotationY = 45;
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.addChild(cube);
    }

    // =========================================================================
    // 🏛️ [Tier 1: Inner Ring - Cascade 1 (10m ~ 15m)] Contact Hardening & PBR 섀도우 구역
    // =========================================================================
    const tier1Count = 8;
    const tier1Radius = 13.0;
    for (let i = 0; i < tier1Count; i++) {
        const angle = (i / tier1Count) * Math.PI * 2;
        const x = Math.cos(angle) * tier1Radius;
        const z = Math.sin(angle) * tier1Radius;

        // 7m 신전 기둥
        const pillar = new RedGPU.Display.Mesh(redGPUContext, tier1PillarGeo, marbleMaterial);
        pillar.x = x;
        pillar.y = 3.5;
        pillar.z = z;
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);

        // 기둥 상단 금빛 구체 (높이에 따른 부드러운 PCSS Penumbra 검증)
        const sphere = new RedGPU.Display.Mesh(redGPUContext, sphereGeo, goldMaterial);
        sphere.x = x;
        sphere.y = 7.9;
        sphere.z = z;
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        scene.addChild(sphere);
    }

    // =========================================================================
    // 🏛️ [Tier 2: Mid Ring - Cascade 2 (35m ~ 50m)] 중원거리 랜드마크 & 아치 관문 구역
    // =========================================================================
    const tier2Count = 8;
    const tier2Radius = 42.0;
    for (let i = 0; i < tier2Count; i++) {
        const angle = (i / tier2Count) * Math.PI * 2 + Math.PI / 8;
        const x = Math.cos(angle) * tier2Radius;
        const z = Math.sin(angle) * tier2Radius;

        // 16m 오벨리스크 타워
        const tower = new RedGPU.Display.Mesh(redGPUContext, tier2TowerGeo, marbleMaterial);
        tower.x = x;
        tower.y = 8.0;
        tower.z = z;
        tower.castShadow = true;
        tower.receiveShadow = true;
        scene.addChild(tower);
    }

    // 4방향 웅장한 아치 관문
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 32.0;
        const z = Math.sin(angle) * 32.0;

        const archBeam = new RedGPU.Display.Mesh(redGPUContext, archBeamGeo, darkMaterial);
        archBeam.x = x;
        archBeam.y = 11.0;
        archBeam.z = z;
        archBeam.rotationY = -(angle * 180 / Math.PI) + 90;
        archBeam.castShadow = true;
        archBeam.receiveShadow = true;
        scene.addChild(archBeam);
    }

    // =========================================================================
    // 🏛️ [Tier 3: Outer Ring - Cascade 3 (80m ~ 130m)] 원경 거대 타워 구역
    // =========================================================================
    const tier3Count = 8;
    const tier3Radius = 95.0;
    for (let i = 0; i < tier3Count; i++) {
        const angle = (i / tier3Count) * Math.PI * 2;
        const x = Math.cos(angle) * tier3Radius;
        const z = Math.sin(angle) * tier3Radius;

        // 28m 거대 랜드마크 기둥
        const giantTower = new RedGPU.Display.Mesh(redGPUContext, tier3GiantTowerGeo, marbleMaterial);
        giantTower.x = x;
        giantTower.y = 14.0;
        giantTower.z = z;
        giantTower.castShadow = true;
        giantTower.receiveShadow = true;
        scene.addChild(giantTower);

        // 상단 거대 구체
        const giantSphere = new RedGPU.Display.Mesh(redGPUContext, giantSphereGeo, goldMaterial);
        giantSphere.x = x;
        giantSphere.y = 31.0;
        giantSphere.z = z;
        giantSphere.castShadow = true;
        giantSphere.receiveShadow = true;
        scene.addChild(giantSphere);
    }

    return animatedMeshes;
};

/**
 * [KO] 테스트용 GUI 패널을 렌더링합니다.
 * [EN] Renders the GUI panel for testing.
 */
const renderTestPane = (redGPUContext, controller, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        directionalShadow: true,
        skybox: true,
        ibl: true,
    });
};
