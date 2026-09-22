import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 3: Tile Streaming & Continuous LOD (대규모 타일 스트리밍 및 연속 LOD)
 * [EN] Step 3: Tile Streaming & Continuous LOD (Large-Scale Tile Streaming & Continuous LOD)
 *
 * [KO] 16km x 16km 대규모 지형을 256개 타일 그리드로 분할하여, 카메라 위치에 따라 16비트 고해상도 타일을 실시간 비동기 스트리밍 로딩/언로딩하는 대규모 최적화 예제입니다.
 *      • 공간 분할 미니맵: 좌측 하단의 Spatial Grid 디버거에서 카메라 이동에 따른 실시간 타일 로딩/언로딩 반경을 관찰하세요.
 *      • 스트리밍 반경 조절: Streaming 폴더의 loadingRadius와 maxLoadsPerFrame을 조절하여 프레임 드랍 없는 비동기 로딩 성능을 체감해보세요.
 * [EN] Large-scale terrain optimization dividing a 16km x 16km world into 256 tiles, asynchronously streaming 16-bit tiles based on camera position.
 *      • Spatial Grid Minimap: Watch dynamic tile streaming and unloading around the camera via the bottom-left Spatial Grid mini-map.
 *      • Streaming Tuning: Adjust loadingRadius and maxLoadsPerFrame to fine-tune asynchronous background loading.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 전체 궤도 회전 카메라 + 자유 비행 카메라 준비)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 7000;
        orbitController.tilt = -25;
        orbitController.pan = 40;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 35000;
        orbitController.speedDistance = 80.0;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 1200;
        freeController.z = 2500;
        freeController.tilt = -18;
        freeController.pan = 0;
        freeController.moveSpeed = 5000;

        // 2. 씬 및 뷰3D 생성 (기본: 전체 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 (DirectionalLight) 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 16km x 16km 대규모 랜드스케이프 지형 및 256개 타일 스트리머 구성
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 1500;
        landscape.loadingRadius = 2500.0;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 256개 분할 16-bit 타일 스트리밍 경로 해석기 (URL Resolver)
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
                uvScale: [50, 50],
                roughness: 0.85,
                metallic: 0.0,
                normalIntensity: 1.5,
                aoIntensity: 1.0
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
                name: 'Gravel',
                key: 'gravel',
                weightChannel: 'B',
                uvScale: [40, 40],
                roughness: 0.9,
                metallic: 0.0,
                normalIntensity: 1.8,
                aoIntensity: 1.2
            },
            {
                name: 'Leave',
                key: 'leave',
                weightChannel: 'A',
                uvScale: [50, 50],
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

        // 타일 스트리밍 공간 분할 그리드 미니맵 활성화
        landscape.debuggerManager.spatialGrid = true;

        scene.addLandscape(landscape);

        // 7. GUI 컨트롤 패널 생성
        renderTestPane(redGPUContext, view, freeController, orbitController, landscape, directionalLight, layers);

        // 8. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 타일 스트리밍, 지형 물리 속성 및 스플랫 레이어를 실시간 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, tile streaming, terrain physical properties, and splat layers in real time.
 */
function renderTestPane(redGPUContext, view, freeController, orbitController, landscape, directionalLight, layers) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetView = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = 0;
            freeController.y = 1200;
            freeController.z = 2500;
            freeController.tilt = -18;
            freeController.pan = 0;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 0;
            orbitController.centerZ = 0;
            orbitController.distance = 7000;
            orbitController.tilt = -25;
            orbitController.pan = 40;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. 컨트롤러 폴더
            const controllerFolder = pane.addFolder({title: 'Controller', expanded: true});

            const cameraModeBinding = controllerFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Free Flight': 'Free Flight',
                    'Orbit': 'Orbit'
                }
            });

            const speedBinding = controllerFolder.addBinding(freeController, 'moveSpeed', {
                min: 1000,
                max: 12000,
                step: 200
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = controllerFolder.addBinding(orbitController, 'speedDistance', {
                min: 10,
                max: 300,
                step: 10
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            controllerFolder.addButton({title: 'Reset Camera'}).on('click', resetView);

            // 2. 스트리밍 폴더
            const streamFolder = pane.addFolder({title: 'Streaming', expanded: true});

            streamFolder.addBinding(landscape, 'loadingRadius', {min: 1000, max: 8000, step: 250});
            streamFolder.addBinding(landscape, 'maxLoadsPerFrame', {min: 1, max: 5, step: 1});
            streamFolder.addBinding(landscape.debuggerManager, 'spatialGrid');

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: true});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 2500, step: 20});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');

            // 하이트맵 그림자 제어
            terrainFolder.addBinding(landscape, 'enableHeightmapShadow');
            terrainFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            terrainFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 500, max: 6000, step: 100});

            // 4. 조명 폴더
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            // 5. 레이어 폴더
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});

            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});

                layerSubFolder.addBinding(layer, 'enabled');

                const uvProxy = {uvScale: layer.uvScale[0]};
                layerSubFolder.addBinding(uvProxy, 'uvScale', {min: 5, max: 100, step: 1})
                    .on('change', (ev) => {
                        layer.uvScale = [ev.value, ev.value];
                    });

                layerSubFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 4, step: 0.1});
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
                layerSubFolder.addBinding(layer, 'aoIntensity', {min: 0, max: 3, step: 0.1});
            });
        }
    });
}
