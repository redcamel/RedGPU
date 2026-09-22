import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 5: Foliage & Impostors (대규모 수목 식생 및 옥타헤드럴 임포스터)
 * [EN] Step 5: Foliage & Impostors (Large-Scale Foliage & Octahedral Impostors)
 *
 * [KO] 16km 광역 지형에 소나무 및 바위 식생을 대규모 배치하고, 3단계 메시 LOD와 최대 6,000m 원거리 옥타헤드럴 임포스터(Octahedral Impostor)를 결합하여 렌더링 부하를 극적으로 낮추는 예제입니다.
 *      • 임포스터 블렌딩: 자유 비행(Free Flight) 모드로 원거리 숲에서 근거리 소나무로 급접근할 때 3D 메시와 2D 임포스터 간의 무결점 전환을 관찰하세요.
 *      • 경사각 식생 제어: minSlope와 maxSlope를 조절하여 급경사 절벽에는 나무가 자라지 않고 바위만 분포하도록 제어할 수 있습니다.
 * [EN] Large-scale foliage example placing pine trees and rocks across a 16km terrain, combining 3-stage mesh LODs with 6,000m far-field Octahedral Impostors.
 *      • Impostor Blending: Fly toward distant forests in Free Flight mode to observe seamless transitions between 3D meshes and 2D impostors.
 *      • Slope-Aware Foliage: Tweak minSlope and maxSlope to restrict tree growth on steep cliffs while allowing rocks.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 수목 조망 궤도 회전 카메라 + 자유 비행 카메라 준비)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = 0;
        orbitController.centerY = 200;
        orbitController.centerZ = 0;
        orbitController.distance = 250.0;
        orbitController.tilt = -15;
        orbitController.pan = 45;
        orbitController.minDistance = 10.0;
        orbitController.maxDistance = 4000.0;
        orbitController.speedDistance = 2.0;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 250;
        freeController.z = 250;
        freeController.tilt = -15;
        freeController.pan = 45;
        freeController.moveSpeed = 100.0;

        // 2. 씬 및 뷰3D 생성 (기본: 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 400;
        directionalShadowManager.strength = 0.95;
        directionalShadowManager.pcssLightSize = 1.2;

        // 5. 16km 대규모 랜드스케이프 지형 설정
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 1500;
        landscape.loadingRadius = 3500;
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

        scene.addLandscape(landscape);

        // 7. 대규모 수목 및 식생 서브시스템 (LandscapeFoliageManager) 설정
        const foliageManager = landscape.foliageManager;
        foliageManager.subCellSize = 100;
        foliageManager.streamingRadius = 800;

        const registeredFoliageTypes = [];
        let onFoliageTypeAdded = null;

        // 7-1. 소나무 (test.glb - Multi-LOD Tree + Octahedral Impostor)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
                const root = loader.resultMesh;
                const treeGroups = new Map();

                const traverse = (node) => {
                    if (!node) return;
                    if (node.name) {
                        const lodMatch = node.name.match(/(.*?)(?:_?LOD([0-9]))$/i);
                        if (lodMatch) {
                            const baseName = lodMatch[1] || node.name;
                            const lodLevel = parseInt(lodMatch[2], 10);
                            if (!treeGroups.has(baseName)) {
                                treeGroups.set(baseName, {});
                            }
                            treeGroups.get(baseName)[`lod${lodLevel}`] = node;
                            return;
                        }
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        traverse(children[i]);
                    }
                };
                traverse(root);

                treeGroups.forEach((lods, baseName) => {
                    const lodConfigs = [];
                    const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                    if (!lod0) return;

                    lodConfigs.push({mesh: lod0, lodDistance: 50, receiveShadow: true});
                    if (lods.lod1 && lods.lod1 !== lod0) {
                        lodConfigs.push({mesh: lods.lod1, lodDistance: 100, receiveShadow: true});
                    }
                    if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                        lodConfigs.push({mesh: lods.lod2, lodDistance: 180, receiveShadow: false});
                    }

                    const foliageType = foliageManager.addFoliageType({
                        name: `Tree_${baseName}`,
                        type: RedGPU.Display.Landscape.FOLIAGE_TYPE.FOLIAGE,
                        lods: lodConfigs,
                        densityPerHectare: 120.0,
                        densityMultiplier: 1.0,
                        minWeightThreshold: 0.02,
                        minScale: [0.4, 0.4, 0.4],
                        maxScale: [0.7, 0.75, 0.7],
                        randomRotationY: true,
                        useImpostor: true,
                        cullingDistance: 6000,
                        fadeStartDistance: 4500,
                        targetLayer: 'Grass',
                        bottomOffset: -0.85,
                        alignToNormal: true,
                        alignFactor: 0.4,
                        minSlope: 0.0,
                        maxSlope: 32.0
                    });

                    registeredFoliageTypes.push(foliageType);
                    onFoliageTypeAdded?.(foliageType);
                });
            }
        );

        // 7-2. 하천 바위 식생 (river_rock.glb - Static Rock)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/river_rock.glb',
            (loader) => {
                const root = loader.resultMesh;
                const rockNodes = [];

                const findRocks = (node) => {
                    if (!node) return;
                    if (node.name && node.name.startsWith('RiverRock') && !node.name.includes('lambert')) {
                        rockNodes.push(node);
                        return;
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        findRocks(children[i]);
                    }
                };
                findRocks(root);

                if (rockNodes.length > 0) {
                    const rockMesh = rockNodes[0];
                    const rockType = foliageManager.addFoliageType({
                        name: 'Rock_RiverRock',
                        type: RedGPU.Display.Landscape.FOLIAGE_TYPE.BASIC,
                        lods: [
                            {mesh: rockMesh, lodDistance: 150, receiveShadow: true}
                        ],
                        densityPerHectare: 35.0,
                        densityMultiplier: 1.0,
                        minWeightThreshold: 0.03,
                        minScale: [1.2, 1.0, 1.2],
                        maxScale: [2.5, 2.0, 2.5],
                        randomRotationY: true,
                        useImpostor: false,
                        cullingDistance: 1200,
                        fadeStartDistance: 900,
                        targetLayer: 'Rock',
                        bottomOffset: -0.2,
                        alignToNormal: true,
                        alignFactor: 0.6,
                        minSlope: 0.0,
                        maxSlope: 60.0
                    });

                    registeredFoliageTypes.push(rockType);
                    onFoliageTypeAdded?.(rockType);
                }
            }
        );

        // 8. GUI 컨트롤 패널 생성
        const guiCallbacks = renderTestPane({
            redGPUContext,
            view,
            freeController,
            orbitController,
            landscape,
            directionalLight,
            directionalShadowManager,
            foliageManager,
            layers
        });

        onFoliageTypeAdded = (type) => {
            guiCallbacks.addFoliageTypeToUI(type);
        };

        // 9. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] Tweakpane GUI를 구성하여 카메라, 수목 식생, 임포스터, 지형 및 광원을 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera, foliage, impostors, terrain, and lighting.
 */
function renderTestPane({
                            redGPUContext,
                            view,
                            freeController,
                            orbitController,
                            landscape,
                            directionalLight,
                            directionalShadowManager,
                            foliageManager,
                            layers
                        }) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetCamera = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = 0;
            freeController.y = 250;
            freeController.z = 250;
            freeController.tilt = -15;
            freeController.pan = 45;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 200;
            orbitController.centerZ = 0;
            orbitController.distance = 250.0;
            orbitController.tilt = -15;
            orbitController.pan = 45;
        }
    };

    let foliageFolder = null;

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
                min: 10.0,
                max: 500.0,
                step: 10.0
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = cameraFolder.addBinding(orbitController, 'speedDistance', {
                min: 0.5,
                max: 10.0,
                step: 0.5
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera'}).on('click', resetCamera);

            // 2. 수목 식생 및 임포스터 폴더
            foliageFolder = pane.addFolder({title: 'Foliage', expanded: true});

            foliageFolder.addBinding(foliageManager, 'streamingRadius', {
                min: 200,
                max: 2000,
                step: 50
            });
            foliageFolder.addBinding(foliageManager, 'subCellSize', {
                min: 50,
                max: 200,
                step: 10
            });
            foliageFolder.addBinding(foliageManager, 'debugSubCellColoration');

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: false});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 2500, step: 20});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');
            terrainFolder.addBinding(landscape, 'enableHeightmapShadow');

            // 4. 조명 및 그림자 폴더
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            lightFolder.addBinding(directionalShadowManager, 'strength', {min: 0.0, max: 1.0, step: 0.05});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 50, max: 800, step: 25});

            // 5. 스플랫 레이어 폴더
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

    const addFoliageTypeToUI = (type) => {
        if (!foliageFolder) return;
        const typeFolder = foliageFolder.addFolder({title: type.name, expanded: false});

        typeFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1});
        typeFolder.addBinding(type, 'cullingDistance', {min: 500, max: 8000, step: 100});
        typeFolder.addBinding(type, 'fadeStartDistance', {min: 300, max: 6000, step: 100});
        typeFolder.addBinding(type, 'minSlope', {min: 0.0, max: 45.0, step: 1.0});
        typeFolder.addBinding(type, 'maxSlope', {min: 10.0, max: 90.0, step: 1.0});
        typeFolder.addBinding(type, 'alignToNormal');
        typeFolder.addBinding(type, 'alignFactor', {min: 0.0, max: 1.0, step: 0.05});
    };

    return {
        addFoliageTypeToUI
    };
}
