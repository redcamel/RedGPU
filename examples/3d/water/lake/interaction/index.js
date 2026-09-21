import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 컨트롤러 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 18;
        controller.tilt = -22;
        controller.pan = 35;
        controller.minDistance = 4;
        controller.maxDistance = 60;
        controller.speedDistance = 0.2;

        // 2. 씬 및 뷰 생성
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

        // 4. 직사광 (DirectionalLight) 설정 - 75000 Lux 단일 제어
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 38;
        directionalLight.azimuth = 135;
        directionalLight.lux = 75000;
        directionalLight.color.setColorByHEX('#fffcf0');
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 수중 바닥 지형 (수심 및 굴절, 침수 대비용)
        createUnderwaterEnvironment(redGPUContext, scene);

        // 6. WaterLake 수체 생성 (기본값 활용 및 듀얼 노멀 바인딩)
        // [중요] 노멀 맵은 색상이 아닌 방향 벡터(X,Y,Z) 데이터이므로, sRGB 감마 보정으로 인한 벡터 왜곡을 방지하기 위해 반드시 선형 포맷인 'rgba8unorm'을 명시합니다.
        const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 80, 80, 80, 80);
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

        // 7. 실시간 물 상호작용 객체 생성
        // 7-1. 주 상호작용 객체 (골드 메탈릭 구체)
        const sphereMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        sphereMaterial.baseColorFactor = [0.95, 0.61, 0.07, 1.0];
        sphereMaterial.roughnessFactor = 0.15;
        sphereMaterial.metallicFactor = 0.85;

        const sphere = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.0, 32, 32),
            sphereMaterial
        );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.enableWaterInteraction = true;
        sphere.waterWaveStrength = 1.5;
        sphere.x = 0;
        sphere.y = 0;
        sphere.z = 0;
        scene.addChild(sphere);

        // 8. 모션 애니메이션 및 인터랙션 상태 관리 (Zero-GC 변수)
        const motionState = {
            autoMove: true,
            moveSpeed: 1.2,
            moveRadius: 4.5,
            bobbingAmplitude: 0.25,
            time: 0,
        };

        // 9. 매 프레임 렌더 콜백 및 렌더러 시작 (Zero-GC 철저 준수)
        let lastTimestamp = performance.now();

        const onFrame = (currentTimestamp) => {
            const dt = Math.min((currentTimestamp - lastTimestamp) * 0.001, 0.1);
            lastTimestamp = currentTimestamp;

            if (motionState.autoMove) {
                // 자동 궤도 순환 및 수면 부유 모션
                motionState.time += dt * motionState.moveSpeed;
                sphere.x = Math.sin(motionState.time) * motionState.moveRadius;
                sphere.z = Math.cos(motionState.time * 0.8) * (motionState.moveRadius * 0.7);
                sphere.y = Math.sin(motionState.time * 2.2) * motionState.bobbingAmplitude;
            }
        };

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, onFrame);

        // 10. Tweakpane GUI 연동
        renderTestPane(redGPUContext, lake, sphere, directionalLight, motionState);
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] 수심 판정 및 굴절 비교를 위한 바닥 수중 지형을 생성합니다.
 */
function createUnderwaterEnvironment(redGPUContext, scene) {
    // 바닥 타일 지면
    const groundMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    groundMaterial.baseColorFactor = [0.17, 0.24, 0.31, 1.0];
    groundMaterial.roughnessFactor = 0.8;
    groundMaterial.metallicFactor = 0.1;

    const groundMesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 60, 60, 32, 32),
        groundMaterial
    );
    groundMesh.y = -3.0;
    groundMesh.receiveShadow = true;
    scene.addChild(groundMesh);

    // 수심 비교용 원형 기둥들
    const pillarMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
    pillarMaterial.baseColorFactor = [0.74, 0.76, 0.78, 1.0];
    pillarMaterial.roughnessFactor = 0.4;
    pillarMaterial.metallicFactor = 0.2;

    const pillarCoords = [
        [-6, -6], [6, -6], [-6, 6], [6, 6]
    ];
    for (let i = 0; i < pillarCoords.length; i++) {
        const coord = pillarCoords[i];
        const pillar = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Cylinder(redGPUContext, 0.6, 0.6, 3.5, 24),
            pillarMaterial
        );
        pillar.x = coord[0];
        pillar.y = -1.25;
        pillar.z = coord[1];
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.addChild(pillar);
    }
}

/**
 * [KO] Tweakpane GUI를 구성하여 파동 시뮬레이션, 메쉬 상호작용 및 광학 속성을 실시간 제어합니다.
 */
function renderTestPane(redGPUContext, lake, sphere, directionalLight, motionState) {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. WaterLake (수체 파동 시뮬레이션)
            const lakeFolder = pane.addFolder({title: 'WaterLake (수체 파동 시뮬레이션)', expanded: true});

            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleWaveSpeed', {min: 0.05, max: 0.8, step: 0.01});
            lakeFolder.addBinding(lake, 'rippleDamping', {min: 0.001, max: 0.05, step: 0.001});
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});
            lakeFolder.addBinding(lake, 'interactionDomainSize', {min: 4.0, max: 32.0, step: 1.0});
            if (typeof lake.maxPenetration === 'number') {
                lakeFolder.addBinding(lake, 'maxPenetration', {min: 0.05, max: 1.0, step: 0.05});
            }
            lakeFolder.addBinding(lake, 'waterLevel', {min: -2.0, max: 2.0, step: 0.05});

            // 2. Interactive Sphere (상호작용 구체 & 모션)
            const sphereFolder = pane.addFolder({title: 'Interactive Sphere (상호작용 구체 & 모션)', expanded: true});

            sphereFolder.addBinding(sphere, 'enableWaterInteraction');
            sphereFolder.addBinding(sphere, 'waterWaveStrength', {min: 0.0, max: 4.0, step: 0.1});

            sphereFolder.addBinding(motionState, 'autoMove');
            sphereFolder.addBinding(motionState, 'moveSpeed', {min: 0.1, max: 3.0, step: 0.1});
            sphereFolder.addBinding(motionState, 'moveRadius', {min: 1.0, max: 8.0, step: 0.2});

            sphereFolder.addBinding(sphere, 'y', {min: -2.0, max: 4.0, step: 0.05})
                .on('change', () => {
                    motionState.autoMove = false;
                });
            sphereFolder.addBinding(sphere, 'x', {min: -10.0, max: 10.0, step: 0.1})
                .on('change', () => {
                    motionState.autoMove = false;
                });
            sphereFolder.addBinding(sphere, 'z', {min: -10.0, max: 10.0, step: 0.1})
                .on('change', () => {
                    motionState.autoMove = false;
                });

            // 3. DirectionalLight (직사광)
            const lightFolder = pane.addFolder({title: 'DirectionalLight (직사광)', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
        }
    });
}
