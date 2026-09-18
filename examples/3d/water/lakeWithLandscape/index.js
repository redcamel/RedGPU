import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] RedGPU 16km 오픈월드 랜드스케이프 지형 & 듀얼 노멀 알프스 호수 쇼케이스
 * [EN] RedGPU 16km Open World Landscape Terrain & Dual Normal Alpine Lake Showcase
 *
 * [KO] 16km x 16km 대형 랜드스케이프 지형(Landscape) 분지 위에 듀얼 노멀 수체 시스템을 완벽히 결합한 데모입니다:
 *  - 4채널 RGBA SplatMap 멀티 텍스처링 지형 (Grass, Gravel, Rock, Leave)
 *  - 16비트 타일 스트리밍 및 1024 글로벌 하이트맵
 *  - 듀얼 노멀 맵(Dual Normal Mapping): Texture 1(대형 너울) + Texture 2(마이크로 잔물결)
 *  - 도메인 워핑(Domain Warping): 격자 타일링 반복감 100% 파괴 및 유기적 수류 형성
 *  - 원거리 노멀 페이드(Distance Normal Fade): 수평선 스펙큘러 노이즈 억제 및 거울 반사 극대화
 *  - 지형과 수면이 만나는 해안선의 부드러운 감쇄 (Depth Fade / Soft Shoreline)
 *  - 비어-람베르트(Beer-Lambert) 물리적 수심 흡수 (에메랄드 옥색 -> 심해 남색)
 *  - 스넬 굴절 왜곡, Schlick 프레넬 거울 반사, 256x256 미세 장파장 너울 정점 변위
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 오픈월드 비행 탐색용 FreeController 설정 (초대형 16km 스케일 최적화)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 1750;
        controller.z = -3200;
        controller.tilt = -18;
        controller.pan = 0;
        controller.moveSpeed = 4500;
        // 16km 오픈월드 환경에서 Z-버퍼 정밀도를 20배 향상시켜 원거리 해안선 뎁스파이팅 원천 차단 (0.1m -> 2.0m)
        controller.camera.nearClipping = 2.0;

        // 2. 씬 및 View3D 설정
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 3. 알프스 일광 조명 (Directional Light) 및 환경광 (Ambient Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.color.setColorByHEX('#fff8ee');
        scene.lightManager.addDirectionalLight(directionalLight);

        const ambientLight = new RedGPU.Light.AmbientLight('#b8dcfa', 1200);
        scene.lightManager.ambientLight = ambientLight;

        // 4. [지형 이식] 16km x 16km 대형 랜드스케이프 지형 Core 구축
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 1500;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 4개 SplatMap 텍스처 레이어 (Grass, Gravel, Rock, Leave)
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const layers = [
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
                uvScale: [50, 50],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ].map(cfg => {
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
            return layer;
        });

        // 16-bit 타일 스트리머 URL 해석기
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

        scene.addLandscape(landscape);
        landscape.debuggerManager.spatialGrid = false;

        // 5. [호수 안착] 16km 지형 전역을 덮는 초대형 알프스 내해 (16000m x 16000m, 256x256 분할)
        const lake = new RedGPU.Display.Water.WaterLake(
            redGPUContext,
            16000, // waterWidth (16km 초대형 수체)
            16000, // waterHeight
            256,   // widthSegments (고밀도 65,536 쿼드)
            256    // heightSegments
        );
        lake.x = 0;
        lake.z = 0;
        lake.waterLevel = 720; // 산맥과 넓은 호수가 완벽히 조화되는 황금 밸런스 수위

        // 파도 노멀 텍스처 장착 (물리 벡터 데이터이므로 'rgba8unorm' Linear 포맷으로 로딩)
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

        // 16km 초대형 지형 스케일 및 알프스 고산 호수에 맞춘 정밀 물리 광학 튜닝
        lake.waterMaterial.baseColor.setColorByHEX('#1d5366'); // 차분하고 투명한 알프스 빙하수 톤 (형광 발광 방지)
        lake.waterMaterial.deepColor.setColorByHEX('#021422'); // 깊은 알프스 심연 코발트 네이비
        lake.waterMaterial.refractionStrength = 0.025;         // 물리 스넬 굴절 왜곡
        lake.waterMaterial.extinctionFactor = 0.008;          // 16km 대형 분지 수심에 최적화된 맑고 투명한 빛 감쇄
        lake.waterMaterial.turbidity = 0.04;                  // 청정 고산 빙하수 특유의 투명한 수질 (페인트 포그 제거)
        lake.waterMaterial.depthFadeDistance = 18.0;          // 해안선 완충 페이드 (18m, 맑고 투명한 모래/자갈 노출)
        lake.waterMaterial.roughness = 0.05;                  // 고요하고 매끄러운 수면 거울 반사 & 윤슬
        lake.waterMaterial.specularFactor = 1.0;
        lake.waterMaterial.fresnelF0 = 0.02;

        // 듀얼 노멀 시스템 (대형 너울 + 잔물결)
        lake.waterMaterial.useNormalTexture2 = true;
        lake.waterMaterial.normalTiling = 120.0;               // 16,000m / 120 ≈ 133m 너울 파도
        lake.waterMaterial.normalTiling2 = 260.0;              // 16,000m / 260 ≈ 61m 잔물결
        lake.waterMaterial.normalScale = 0.45;
        lake.waterMaterial.normalScale2 = 0.25;
        lake.waterMaterial.windSpeed = 0.015;
        lake.waterMaterial.windSpeed2 = 0.025;

        // 수중 바닥 카우스틱스 (16km 광활한 호수에서는 기본 0.0으로 빛 찌꺼기 얼룩 원천 방지)
        lake.waterMaterial.causticsStrength = 0.0;
        lake.waterMaterial.causticsScale = 1.0;
        lake.waterMaterial.causticsSpeed = 0.8;

        // 스크린 공간 반사 (SSR) - 16km 대형 지형 산맥 반사를 위해 추적 거리 확장
        lake.waterMaterial.enableSSR = true;
        lake.waterMaterial.ssrMaxDistance = 1200.0;
        lake.waterMaterial.ssrStepCount = 48;
        lake.waterMaterial.ssrThickness = 2.5;

        // 디버그 수심 최대값 (16km 지형 스케일에 맞춤)
        lake.waterMaterial.debugMaxDepth = 150.0;

        // 초대형 수체 스케일에 맞춘 버텍스 장파장 너울 (60cm 파고, 350m 파장)
        lake.waveAmplitude = 0.6;
        lake.waveWavelength = 350.0;
        lake.waveSpeed = 1.0;

        scene.addChild(lake);

        // 6. 렌더러 가동 (Zero-GC 렌더 루프)
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 7. 리사이즈 이벤트 핸들러
        redGPUContext.onResize = (event) => {
            console.log("Canvas resized:", event.width, event.height);
        };

        // 8. 랜드스케이프 & 듀얼 노멀 호수 통합 Tweakpane GUI 패널
        renderIntegratedLandscapeLakeGUI(redGPUContext, landscape, lake, controller, directionalLight, layers, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 랜드스케이프 지형 및 알프스 호수 통합 Tweakpane GUI 패널을 구성합니다.
 * [EN] Configures integrated Tweakpane GUI panel for Landscape terrain and Alpine Lake.
 */
function renderIntegratedLandscapeLakeGUI(redGPUContext, landscape, lake, controller, directionalLight, layers, view) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        skybox: true,
        ibl: true,
        gui: (pane) => {
            // [폴더 1] 알프스 대표 시점 프리셋 (Signature Presets)
            const presetFolder = pane.addFolder({title: '🏔️ Signature Camera Presets', expanded: true});
            presetFolder.addButton({title: '1. Alpine Vista (산맥 & 호수 황금 밸런스 전경)'}).on('click', () => {
                controller.x = 0;
                controller.y = 1750;
                controller.z = -3200;
                controller.tilt = -18;
                controller.pan = 0;
            });
            presetFolder.addButton({title: '2. Shoreline Beach (해안선 Depth Fade 근접)'}).on('click', () => {
                controller.x = -280;
                controller.y = 740;
                controller.z = -750;
                controller.tilt = -10;
                controller.pan = 25;
            });
            presetFolder.addButton({title: '3. Mountain Ridge Overlook (산맥 정상 조망)'}).on('click', () => {
                controller.x = 1800;
                controller.y = 1450;
                controller.z = 1500;
                controller.tilt = -20;
                controller.pan = -135;
            });
            presetFolder.addButton({title: '4. Low-Altitude Cruise (수면 저공 비행)'}).on('click', () => {
                controller.x = 80;
                controller.y = 732;
                controller.z = -200;
                controller.tilt = -3;
                controller.pan = 45;
            });
            presetFolder.addButton({title: '5. Underwater Dive (수중 잠수 올려다보기)'}).on('click', () => {
                controller.x = 0;
                controller.y = 705;
                controller.z = 0;
                controller.tilt = 35;
                controller.pan = 20;
            });

            // [폴더 2] 카메라 비행 속도 (FreeController)
            const camFolder = pane.addFolder({title: '📷 Flight Camera', expanded: false});
            camFolder.addBinding(controller, 'moveSpeed', {min: 500, max: 30000, step: 500});

            // [폴더 3] 호수 위치 및 수위 (Water Position & Level)
            const waterPosFolder = pane.addFolder({title: '🌊 Water Position & Level', expanded: true});
            waterPosFolder.addBinding(lake, 'waterLevel', {min: 100, max: 1400, step: 2});
            waterPosFolder.addBinding(lake, 'x', {min: -8000, max: 8000, step: 100});
            waterPosFolder.addBinding(lake, 'z', {min: -8000, max: 8000, step: 100});
            waterPosFolder.addBinding(lake.waterMaterial, 'debugMode', {
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
            waterPosFolder.addBinding(lake.waterMaterial, 'debugMaxDepth', {
                min: 10.0,
                max: 500.0,
                step: 10.0
            });

            // [폴더 4] 듀얼 노멀 & 파도 (Dual Normal Waves & Swell)
            const waveFolder = pane.addFolder({title: '〰️ Dual Normal Waves (RNM & Swell)', expanded: true});
            waveFolder.addBinding(lake.waterMaterial, 'useNormalTexture2');
            waveFolder.addBinding(lake.waterMaterial, 'normalScale', {min: 0.0, max: 2.0, step: 0.02});
            waveFolder.addBinding(lake.waterMaterial, 'normalTiling', {min: 10.0, max: 500.0, step: 10.0});
            waveFolder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.1, step: 0.002});
            waveFolder.addBinding(lake.waterMaterial, 'invertNormalY1');

            waveFolder.addBinding(lake.waterMaterial, 'normalScale2', {min: 0.0, max: 2.0, step: 0.02});
            waveFolder.addBinding(lake.waterMaterial, 'normalTiling2', {min: 20.0, max: 1000.0, step: 20.0});
            waveFolder.addBinding(lake.waterMaterial, 'windSpeed2', {min: 0.0, max: 0.1, step: 0.002});
            waveFolder.addBinding(lake.waterMaterial, 'invertNormalY2');

            waveFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 3.0, step: 0.05});
            waveFolder.addBinding(lake, 'waveWavelength', {min: 50.0, max: 1000.0, step: 20.0});
            waveFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});

            // [폴더 5] 수체 광학 및 물리 색채 (Water Optics & Colors)
            const colorFolder = pane.addFolder({title: '🎨 Water Optics & Colors', expanded: false});
            colorFolder.addBinding(lake.waterMaterial, 'opacity', {min: 0.0, max: 1.0, step: 0.02});

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

            colorFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.0, max: 200.0, step: 2.0});
            colorFolder.addBinding(lake.waterMaterial, 'extinctionFactor', {min: 0.001, max: 0.1, step: 0.001});
            colorFolder.addBinding(lake.waterMaterial, 'turbidity', {min: 0.0, max: 1.0, step: 0.01});
            colorFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 0.5, step: 0.005});

            // [폴더 6] 수중 바닥 카우스틱스 (Underwater Caustics)
            const causticsFolder = pane.addFolder({title: '✨ Underwater Caustics', expanded: false});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.1, max: 5.0, step: 0.1});
            causticsFolder.addBinding(lake.waterMaterial, 'causticsSpeed', {min: 0.0, max: 3.0, step: 0.1});

            // [폴더 7] Cook-Torrance PBR 조명 & 프레넬 반사
            const specFolder = pane.addFolder({title: '🪞 Cook-Torrance PBR & Lighting', expanded: false});
            specFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 1.0, step: 0.01});
            specFolder.addBinding(lake.waterMaterial, 'specularFactor', {min: 0.0, max: 3.0, step: 0.05});
            specFolder.addBinding(lake.waterMaterial, 'fresnelF0', {min: 0.0, max: 0.1, step: 0.005});
            specFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            specFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            // [폴더 8] 스크린 공간 반사 (Screen Space Reflection - SSR)
            const ssrFolder = pane.addFolder({title: '🏙️ Screen Space Reflection (SSR)', expanded: true});
            ssrFolder.addBinding(lake.waterMaterial, 'enableSSR');
            ssrFolder.addBinding(lake.waterMaterial, 'ssrMaxDistance', {min: 50.0, max: 3000.0, step: 50.0});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrStepCount', {min: 16, max: 96, step: 8});
            ssrFolder.addBinding(lake.waterMaterial, 'ssrThickness', {min: 0.2, max: 10.0, step: 0.2});

            // [폴더 9] 랜드스케이프 지형 제어 (Landscape Settings)
            const landscapeFolder = pane.addFolder({title: '🌄 Landscape Terrain Settings', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 500, max: 3000, step: 50});
            landscapeFolder.addBinding(landscape, 'wireframe');
            landscapeFolder.addBinding(landscape, 'lodColoration');

            if (layers?.length) {
                const layerSubFolder = landscapeFolder.addFolder({title: 'Terrain Splat Layers', expanded: false});
                layers.forEach((layer) => {
                    const lf = layerSubFolder.addFolder({title: layer.name, expanded: false});
                    lf.addBinding(layer, 'enabled');
                    lf.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
                    lf.addBinding(layer, 'normalIntensity', {min: 0, max: 3, step: 0.1});
                });
            }

            // [폴더 10] 대기 및 환경광 (Sky Atmosphere)
            const envFolder = pane.addFolder({title: '🌤️ Sky Atmosphere', expanded: false});
            let skyAtmosphereInstance = null;
            const envState = {skyAtmosphere: false};
            envFolder.addBinding(envState, 'skyAtmosphere').on('change', (ev) => {
                if (ev.value) {
                    if (!skyAtmosphereInstance) {
                        skyAtmosphereInstance = new RedGPU.Display.SkyAtmosphere(redGPUContext);
                    }
                    view.skyAtmosphere = skyAtmosphereInstance;
                } else {
                    view.skyAtmosphere = null;
                }
            });
        }
    });
}
