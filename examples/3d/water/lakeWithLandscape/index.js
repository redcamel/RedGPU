import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정 (대규모 풍경 조망에 최적화된 FreeController)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 520;
        controller.z = 1200;
        controller.tilt = -16;
        controller.moveSpeed = 1600;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 2. 환경 맵(IBL) 및 스카이박스 설정
        const currentHdrPath = '../../../assets/hdr/field.hdr';
        const currentIbl = new RedGPU.Resource.IBL(redGPUContext, currentHdrPath, 35000);
        view.ibl = currentIbl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, currentIbl.environmentTexture, 35000);

        // 3. 태양광(DirectionalLight) 및 지형 스케일 섀도우 매니저
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 38;
        directionalLight.azimuth = 45;
        directionalLight.lux = 75000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 1500;

        // 4. 대규모 오픈월드 랜드스케이프 지형 (Landscape)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 750;
        landscape.maxLODLevel = 5;
        landscape.loadingRadius = 4000;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 4-1. PBR 멀티 텍스처링 레이어 (Grass, Gravel, Rock, Leave)
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const layersConfig = [
            {
                name: 'Grass',
                key: 'grass',
                weightChannel: 'R',
                uvScale: [40, 40],
                roughness: 0.85,
                metallic: 0.0,
                normalIntensity: 1.5,
                aoIntensity: 1.0
            },
            {
                name: 'Gravel',
                key: 'gravel',
                weightChannel: 'B',
                uvScale: [35, 35],
                roughness: 0.9,
                metallic: 0.0,
                normalIntensity: 1.8,
                aoIntensity: 1.2
            },
            {
                name: 'Rock',
                key: 'rock',
                weightChannel: 'G',
                uvScale: [15, 15],
                roughness: 0.7,
                metallic: 0.05,
                normalIntensity: 2.2,
                aoIntensity: 1.5
            },
            {
                name: 'Leave',
                key: 'leave',
                weightChannel: 'A',
                uvScale: [40, 40],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ];

        layersConfig.forEach((cfg) => {
            const layer = new RedGPU.Display.Landscape.LandscapeLayer({
                name: cfg.name,
                baseColorTexture: `${assetPath}${cfg.key}.jpg`,
                normalTexture: `${assetPath}${cfg.key}_normal.jpg`,
                ormTexture: `${assetPath}${cfg.key}_orm.jpg`,
                weightTexture: splatMapPath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness,
                metallic: cfg.metallic,
                normalIntensity: cfg.normalIntensity,
                aoIntensity: cfg.aoIntensity,
                tintColor: '#ffffff'
            });
            landscape.addLayer(layer);
        });

        scene.addLandscape(landscape);

        // 5. WaterLake (산악 분지와 맞닿는 고품질 호수 수체)
        const lake = new RedGPU.Display.WaterLake(
            redGPUContext,
            5000,
            5000,
            128,
            128
        );
        lake.y = 260; // 지형의 계곡 분지와 맞물리는 수면 고도

        lake.waveAmplitude = 0.07;
        lake.waveWavelength = 30.0;
        lake.waveSpeed = 1.0;
        lake.interactionDomainSize = 80.0;
        lake.maxPenetration = 0.45;

        // 5-1. 수면 광학 머티리얼 및 듀얼 노멀 텍스처
        lake.waterMaterial.baseColor.setColorByHEX('#179fa0');
        lake.waterMaterial.deepColor.setColorByHEX('#042436');
        lake.waterMaterial.opacity = 1.0;
        lake.waterMaterial.refractionStrength = 0.85;
        lake.waterMaterial.causticsStrength = 1.2;
        lake.waterMaterial.causticsScale = 1.0;
        lake.waterMaterial.causticsSpeed = 1.0;
        lake.waterMaterial.depthFadeDistance = 2.2;
        lake.waterMaterial.roughness = 0.04;
        lake.waterMaterial.specularFactor = 1.0;
        lake.waterMaterial.windSpeed = 0.025;
        lake.waterMaterial.normalTiling = 28.0;
        lake.waterMaterial.normalDetailTiling = 56.0;

        // [중요] 노멀 맵은 색상이 아닌 방향 벡터(X,Y,Z) 데이터이므로, sRGB 감마 보정으로 인한 왜곡을 방지하기 위해 선형 포맷인 'rgba8unorm'을 명시합니다.
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/Water_1_M_Normal.jpg',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/Water_2_M_Normal.png',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );

        scene.addChild(lake);

        // 6. 호수 위 인터랙티브 부표 (Interactive Floating Beacon)
        const beacon = new RedGPU.Display.Mesh(redGPUContext);
        beacon.x = 0;
        beacon.z = 400;
        beacon.y = lake.y;

        // 6-1. 부표 베이스 (금빛 실린더)
        const baseMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        baseMaterial.baseColorFactor = [0.95, 0.75, 0.2, 1.0];
        baseMaterial.metallicFactor = 0.9;
        baseMaterial.roughnessFactor = 0.25;

        const baseMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Cylinder(redGPUContext, 2.2, 2.2, 0.8, 32),
            baseMaterial
        );
        beacon.addChild(baseMesh);

        // 6-2. 상단 발광 마커 구체 (루비 레드 구체)
        const markerMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        markerMaterial.baseColorFactor = [0.95, 0.15, 0.15, 1.0];
        markerMaterial.metallicFactor = 0.2;
        markerMaterial.roughnessFactor = 0.2;

        const markerMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Sphere(redGPUContext, 1.1, 32, 32),
            markerMaterial
        );
        markerMesh.y = 1.2;
        beacon.addChild(markerMesh);

        beacon.setCastShadowRecursively(true);
        beacon.setReceiveShadowRecursively(true);

        // 부표가 호수 수면에 리플을 발생시키도록 상호작용 등록
        beacon.setEnableWaterInteractionRecursively(true, 1.2);
        scene.addChild(beacon);

        // 7. Zero-GC 애니메이션 및 부유 상태
        const beaconState = {
            time: 0,
            autoMove: true,
            orbitSpeed: 0.35,
            orbitRadius: 70,
            bobbingSpeed: 2.2,
            bobbingAmp: 0.18,
            centerZ: 400
        };

        // 8. 렌더 루프 및 리사이즈 등록
        const renderer = new RedGPU.Renderer();
        let lastTimestamp = 0;

        renderer.start(redGPUContext, (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = (timestamp - lastTimestamp) * 0.001;
            lastTimestamp = timestamp;

            // 부표 궤도 순항 및 상하 부유(Bobbing) 파동 애니메이션 (Zero-GC)
            if (beaconState.autoMove) {
                beaconState.time += delta;

                beacon.x = Math.cos(beaconState.time * beaconState.orbitSpeed) * beaconState.orbitRadius;
                beacon.z = beaconState.centerZ + Math.sin(beaconState.time * beaconState.orbitSpeed) * beaconState.orbitRadius;
                beacon.y = lake.y + Math.sin(beaconState.time * beaconState.bobbingSpeed) * beaconState.bobbingAmp;
                beacon.rotationY += 12.0 * delta;
            }
        });

        /**
         * @param {RedGPU.RedResizeEvent} event [KO] 리사이즈 이벤트 객체 [EN] Resize event object
         */
        redGPUContext.onResize = (event) => {
            console.log("Canvas resized:", event.width, event.height);
        };

        // 9. GUI 컨트롤 패널 구성
        new RedGPUExampleHelper(redGPUContext, {
            RedGPU,
            gui: (pane) => {
                // 9-1. Camera (카메라)
                const folderCam = pane.addFolder({title: 'Camera (카메라)', expanded: true});
                folderCam.addBinding(controller, 'moveSpeed', {min: 500, max: 6000, step: 100});

                // 9-2. WaterLake (호수 설정)
                const folderLake = pane.addFolder({title: 'WaterLake (호수 설정)', expanded: true});
                folderLake.addBinding(lake, 'y', {min: 180, max: 350, step: 1});
                folderLake.addBinding(lake, 'waveAmplitude', {min: 0, max: 0.25, step: 0.005});
                folderLake.addBinding(lake, 'waveWavelength', {min: 5, max: 80, step: 1});
                folderLake.addBinding(lake, 'waveSpeed', {min: 0, max: 4, step: 0.1});
                folderLake.addBinding(lake, 'maxPenetration', {min: 0.05, max: 1.2, step: 0.05});
                folderLake.addBinding(lake, 'interactionDomainSize', {min: 20, max: 150, step: 5});

                // 9-3. Water Material (수면 광학)
                const folderMat = pane.addFolder({title: 'Water Material (수면 광학)', expanded: false});
                folderMat.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
                folderMat.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});
                folderMat.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.05});
                folderMat.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.2, max: 3.0, step: 0.1});
                folderMat.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.2, max: 5.0, step: 0.1});
                folderMat.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.1, step: 0.005});
                folderMat.addBinding(lake.waterMaterial, 'normalTiling', {min: 5.0, max: 80.0, step: 1.0});
                folderMat.addBinding(lake.waterMaterial, 'normalDetailTiling', {min: 10.0, max: 120.0, step: 2.0});

                // 9-4. Interactive Beacon (인터랙티브 부표)
                const folderBeacon = pane.addFolder({title: 'Interactive Beacon (인터랙티브 부표)', expanded: false});
                folderBeacon.addBinding(beaconState, 'autoMove');
                folderBeacon.addBinding(beaconState, 'orbitSpeed', {min: 0.1, max: 1.5, step: 0.05});
                folderBeacon.addBinding(beaconState, 'bobbingAmp', {min: 0.05, max: 0.6, step: 0.01});

                // 9-5. Landscape (지형 설정)
                const folderLandscape = pane.addFolder({title: 'Landscape (지형 설정)', expanded: false});
                folderLandscape.addBinding(landscape, 'heightScale', {min: 300, max: 1500, step: 25});

                // 9-6. DirectionalLight (태양광)
                const folderSun = pane.addFolder({title: 'DirectionalLight (태양광)', expanded: false});
                folderSun.addBinding(directionalLight, 'elevation', {min: 5, max: 89, step: 1});
                folderSun.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
                folderSun.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 2000});
            }
        });
    }
);
