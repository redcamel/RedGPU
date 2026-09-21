import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 2: Multi-Layer Splatting (멀티레이어 텍스처 블렌딩)
 * [EN] Step 2: Multi-Layer Splatting (Multi-Layer Texture Blending)
 *
 * [KO] 단일 하이트맵으로 초기화된 랜드스케이프 지형 위에, RGBA 4채널 스플랫맵(Splatmap)의 가중치를 기반으로 잔디·암석·자갈·낙엽 등 복수의 PBR 레이어(알베도, 노멀, ORM)를 지표면에 합성/블렌딩하는 멀티레이어 지형 텍스처링 예제입니다.
 * [EN] An example demonstrating multi-layer terrain texturing by blending multiple PBR layers (Grass, Rock, Gravel, Leave) with Albedo, Normal, and ORM maps onto the initialized landscape terrain based on RGBA 4-channel Splatmap weights.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (자유 비행 카메라 기본 + 궤도 회전 카메라 준비)
        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 1350;
        freeController.z = 2800;
        freeController.tilt = -18;
        freeController.pan = 0;
        freeController.moveSpeed = 5000;

        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 6000;
        orbitController.tilt = -22;
        orbitController.pan = 35;
        orbitController.speedDistance = 80.0;

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
        directionalLight.elevation = 36;
        directionalLight.azimuth = 135;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 85000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 랜드스케이프 지형 생성 및 글로벌 하이트맵 베이스 초기화
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 6. RGBA 4채널 스플랫맵 기반 멀티레이어 구성
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const layerConfigs = [
            {
                name: 'Grass (R)',
                key: 'grass',
                weightChannel: 'R',
                uvScale: [50, 50],
                roughness: 0.85,
                metallic: 0.0,
                normalIntensity: 1.5,
                aoIntensity: 1.0
            },
            {
                name: 'Rock (G)',
                key: 'rock',
                weightChannel: 'G',
                uvScale: [15, 15],
                roughness: 0.7,
                metallic: 0.05,
                normalIntensity: 2.2,
                aoIntensity: 1.5
            },
            {
                name: 'Gravel (B)',
                key: 'gravel',
                weightChannel: 'B',
                uvScale: [40, 40],
                roughness: 0.9,
                metallic: 0.0,
                normalIntensity: 1.8,
                aoIntensity: 1.2
            },
            {
                name: 'Leave (A)',
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
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 지형, 조명 및 스플랫 레이어 PBR 속성을 실시간 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, landscape, lighting, and splat layer PBR properties in real time.
 */
function renderTestPane(redGPUContext, view, freeController, orbitController, landscape, directionalLight, layers) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetView = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = 0;
            freeController.y = 1350;
            freeController.z = 2800;
            freeController.tilt = -18;
            freeController.pan = 0;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 0;
            orbitController.centerZ = 0;
            orbitController.distance = 6000;
            orbitController.tilt = -22;
            orbitController.pan = 35;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. 카메라 제어 폴더
            const cameraFolder = pane.addFolder({title: 'Camera Controls', expanded: true});

            const cameraModeBinding = cameraFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Free Flight': 'Free Flight',
                    'Orbit': 'Orbit'
                }
            });

            const speedBinding = cameraFolder.addBinding(freeController, 'moveSpeed', {
                min: 1000,
                max: 12000,
                step: 200
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = cameraFolder.addBinding(orbitController, 'speedDistance', {
                min: 10,
                max: 300,
                step: 5
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera View'}).on('click', resetView);

            // 2. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain Settings', expanded: true});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');

            // 하이트맵 그림자 세부 제어
            terrainFolder.addBinding(landscape, 'enableHeightmapShadow');
            terrainFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            terrainFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 500, max: 6000, step: 100});

            // 3. 태양광 제어 폴더
            const lightFolder = pane.addFolder({title: 'Sun Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            // 4. 스플랫 레이어 제어 폴더 (Step 2 핵심!)
            const splatFolder = pane.addFolder({title: 'Splat Layers (PBR)', expanded: true});

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
