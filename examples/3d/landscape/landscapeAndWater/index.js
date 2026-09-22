import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 7: Landscape & Water System (랜드스케이프와 호수 수체 통합 시스템)
 * [EN] Step 7: Landscape & Water System (Landscape & Lake Water System Integration)
 *
 * [KO] 랜드스케이프 지형의 계곡 분지와 물리 기반 호수 수체(WaterLake)를 결합하여 수위, 듀얼 노멀 파도, 수중 굴절 및 심도 기반 흡수·코스틱스 광학 효과를 종합 제어하는 예제입니다.
 *      • 수위(Water Level) 조절: Water 폴더의 y 값을 조절하여 지형의 골짜기가 호수로 채워지거나 말라붙는 수변 경계를 실시간으로 확인하세요.
 *      • 수중 광학 효과: causticsStrength, refractionStrength, depthFadeDistance를 조절하여 얕은 여울과 깊은 호수 바닥의 빛 투과를 관찰하세요.
 * [EN] An integrated simulation uniting landscape terrain valleys with physical lake water (WaterLake), controlling water level, dual normal waves, refraction, and depth caustics.
 *      • Water Level Control: Adjust lake y in the Water folder to watch terrain valleys flood or drain dynamically.
 *      • Underwater Optics: Tune causticsStrength, refractionStrength, and depthFadeDistance to inspect light absorption and caustics.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 호수와 수변 조망 궤도 회전 카메라 + 자유 비행 카메라)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = 0;
        orbitController.centerY = 6.5;
        orbitController.centerZ = 0;
        orbitController.distance = 55.0;
        orbitController.tilt = -18;
        orbitController.pan = 45;
        orbitController.minDistance = 3.0;
        orbitController.maxDistance = 250.0;
        orbitController.speedDistance = 0.5;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 20;
        freeController.z = 45;
        freeController.tilt = -18;
        freeController.pan = 45;
        freeController.moveSpeed = 15.0;

        // 2. 씬 및 뷰3D 생성 (기본: 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/field.hdr',
            35000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 55;
        directionalLight.azimuth = 90;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 100000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 250;
        directionalShadowManager.strength = 0.95;
        directionalShadowManager.pcssLightSize = 1.2;

        // 5. 랜드스케이프 지형 설정 (수체 연동을 고려한 분지 지형)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [400, 400];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 12.0;
        landscape.maxLODLevel = 4;
        landscape.loadingRadius = 300;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 256개 분할 16비트 타일 스트리밍 경로 해석기
        landscape.tileUrlResolver = (row, col) => {
            const BASE_HOST = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const rStr = String(row).padStart(2, '0');
            const cStr = String(col).padStart(2, '0');

            let sizeStr = '512_512';
            if (row === 15 && col === 15) sizeStr = '449_449';
            else if (col === 15) sizeStr = '449_512';
            else if (row === 15) sizeStr = '512_449';

            return `${BASE_HOST}28_134_86_730_13_${sizeStr}_16bit_tile_${rStr}_${cStr}.png`;
        };

        // 6. RGBA 4채널 스플랫맵 기반 멀티레이어 구성
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const layerConfigs = [
            {
                name: 'Grass',
                key: 'grass',
                weightChannel: 'R',
                uvScale: [10, 10],
                roughness: 0.85,
                metallic: 0.0,
                normalIntensity: 1.5,
                aoIntensity: 1.0
            },
            {
                name: 'Rock',
                key: 'rock',
                weightChannel: 'G',
                uvScale: [5, 5],
                roughness: 0.7,
                metallic: 0.05,
                normalIntensity: 2.2,
                aoIntensity: 1.5
            },
            {
                name: 'Gravel',
                key: 'gravel',
                weightChannel: 'B',
                uvScale: [10, 10],
                roughness: 0.9,
                metallic: 0.0,
                normalIntensity: 1.8,
                aoIntensity: 1.2
            },
            {
                name: 'Leave',
                key: 'leave',
                weightChannel: 'A',
                uvScale: [10, 10],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ];

        const layers = layerConfigs.map(cfg => {
            const layer = new RedGPU.Display.Landscape.LandscapeLayer(redGPUContext, {
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
                aoIntensity: cfg.aoIntensity
            });
            landscape.addLayer(layer);
            return layer;
        });

        scene.addLandscape(landscape);

        // 7. 물리 기반 호수 수체 (WaterLake) 생성 및 광학 파라미터 구성
        const lake = new RedGPU.Display.WaterLake(
            redGPUContext,
            300,
            300,
            96,
            96
        );
        lake.y = 6.5; // 지형 계곡 분지와 맞물리는 수면 고도

        lake.waveAmplitude = 0.045;
        lake.waveWavelength = 16.0;
        lake.waveSpeed = 1.0;
        lake.interactionDomainSize = 35.0;
        lake.maxPenetration = 0.35;

        // 수면 광학 재질 및 듀얼 노멀 텍스처
        lake.waterMaterial.baseColor.setColorByHEX('#179fa0');
        lake.waterMaterial.deepColor.setColorByHEX('#042436');
        lake.waterMaterial.opacity = 1.0;
        lake.waterMaterial.refractionStrength = 0.85;
        lake.waterMaterial.causticsStrength = 1.2;
        lake.waterMaterial.causticsScale = 1.0;
        lake.waterMaterial.causticsSpeed = 1.0;
        lake.waterMaterial.depthFadeDistance = 1.0;
        lake.waterMaterial.roughness = 0.04;
        lake.waterMaterial.specularFactor = 1.0;
        lake.waterMaterial.windSpeed = 0.025;
        lake.waterMaterial.normalTiling = 18.0;
        lake.waterMaterial.normalDetailTiling = 36.0;

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

        scene.addChild(lake);

        // 8. GUI 컨트롤 패널 생성
        renderTestPane({
            redGPUContext,
            view,
            freeController,
            orbitController,
            landscape,
            lake,
            directionalLight,
            directionalShadowManager,
            layers
        });

        // 9. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] Tweakpane GUI를 구성하여 카메라, 호수 수체, 지형 및 광원을 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera, lake water, terrain, and lighting.
 */
function renderTestPane({
                            redGPUContext,
                            view,
                            freeController,
                            orbitController,
                            landscape,
                            lake,
                            directionalLight,
                            directionalShadowManager,
                            layers
                        }) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetCamera = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = 0;
            freeController.y = 20;
            freeController.z = 45;
            freeController.tilt = -18;
            freeController.pan = 45;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 6.5;
            orbitController.centerZ = 0;
            orbitController.distance = 55.0;
            orbitController.tilt = -18;
            orbitController.pan = 45;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. 카메라 폴더
            const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});

            const cameraModeBinding = cameraFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Orbit': 'Orbit',
                    'Free Flight': 'Free Flight'
                }
            });

            const speedBinding = cameraFolder.addBinding(freeController, 'moveSpeed', {
                min: 2.0,
                max: 50.0,
                step: 1.0
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = cameraFolder.addBinding(orbitController, 'speedDistance', {
                min: 0.1,
                max: 3.0,
                step: 0.1
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera'}).on('click', resetCamera);

            // 2. 호수 수체 폴더
            const waterFolder = pane.addFolder({title: 'Water', expanded: true});

            waterFolder.addBinding(lake, 'y', {min: 0.0, max: 12.0, step: 0.1});
            waterFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.2, step: 0.005});
            waterFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});
            waterFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.1, max: 10.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            waterFolder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.1, step: 0.005});

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: false});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 30, step: 0.5});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 500, step: 5});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 5, max: 200, step: 5});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');

            // 4. 조명 및 그림자 폴더
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            lightFolder.addBinding(directionalShadowManager, 'strength', {min: 0.0, max: 1.0, step: 0.05});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 30, max: 500, step: 10});

            // 5. 스플랫 레이어 폴더
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});

            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});

                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 4, step: 0.1});
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });
}
