import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 4: Procedural Grass Field (절차적 잔디 및 바람 시뮬레이션)
 * [EN] Step 4: Procedural Grass Field (Procedural Grass Field & Wind Simulation)
 *
 * [KO] 지형 스플랫맵 가중치와 연동하여 GPU 인스턴싱 기반 대규모 절차적 잔디(Grass)를 필드에 배치하고, 버텍스 셰이더 기반 바람 애니메이션과 거리별 LOD·컬링·수축(Shrink) 시뮬레이션을 구현하는 예제입니다.
 * [EN] An example demonstrating GPU-instanced procedural grass field placement driven by terrain splatmap weights, with vertex shader wind animation and distance-based LOD, culling, and shrink simulation.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 지표면 근접 궤도 회전 카메라 + 자유 비행 카메라 준비)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = -120;
        orbitController.centerY = 205;
        orbitController.centerZ = 120;
        orbitController.distance = 6.0;
        orbitController.tilt = -12;
        orbitController.pan = 35;
        orbitController.minDistance = 1.0;
        orbitController.maxDistance = 150.0;
        orbitController.speedDistance = 0.5;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = -120;
        freeController.y = 206;
        freeController.z = 125;
        freeController.tilt = -12;
        freeController.pan = 35;
        freeController.moveSpeed = 15.0;

        // 2. 씬 및 뷰3D 생성 (기본: 근접 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/field.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 30000);

        // 4. 태양광 & 직사광 그림자 (DirectionalLight & CSM Shadow) 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 38;
        directionalLight.azimuth = 55;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 150;
        directionalShadowManager.strength = 0.95;
        directionalShadowManager.pcssLightSize = 1.2;

        // 5. 16km 대규모 랜드스케이프 지형 설정
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 300;
        landscape.loadingRadius = 2500;
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

        // 7. 절차적 잔디 서브시스템 (LandscapeGrassManager) 구성
        const grassManager = landscape.grassManager;
        grassManager.enabled = true;
        grassManager.streamingRadius = 120;

        const registeredGrassTypes = [];
        let onGrassTypeAdded = null;

        // 7-1. 지면 기본 뗏장 잔디 (grass.glb - Ground Lawn Clump)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/grass.glb',
            (loader) => {
                let baseMesh = null;
                const findMesh = (node) => {
                    if (!node) return;
                    if (node.geometry) {
                        baseMesh = node;
                        return;
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        findMesh(children[i]);
                        if (baseMesh) return;
                    }
                };
                findMesh(loader.resultMesh);

                if (baseMesh) {
                    const baseClumpType = new RedGPU.Display.Landscape.GrassType(redGPUContext, {
                        name: 'Lawn Clump',
                        lods: [
                            {mesh: baseMesh, lodDistance: 110}
                        ],
                        densityPerHectare: 24000,
                        targetLayer: 'Grass',
                        minWeightThreshold: 0.02,
                        cullingDistance: 110,
                        fadeStartDistance: 95,
                        shrinkStartDistance: 80,
                        minScale: [7.0, 4.5, 7.0],
                        maxScale: [11.0, 6.5, 11.0],
                        groundBlendStrength: 0.55,
                        subsurfaceStrength: 0.40,
                        exposureBoost: 1.0,
                        bottomOffset: -0.25
                    });

                    grassManager.addGrassType(baseClumpType);
                    registeredGrassTypes.push(baseClumpType);
                    onGrassTypeAdded?.(baseClumpType, true);
                    grassManager.populateInstances([orbitController.centerX, orbitController.centerY, orbitController.centerZ]);
                }
            }
        );

        // 7-2. 키 큰 야생 들풀 3종 멀티 LOD (grassList.glb - Multi-LOD Wild Tall Grass)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/grassList.glb',
            (loader) => {
                const grassGroups = new Map();
                const allMeshes = [];

                const planeMeshMap = {
                    'Plane.043': {type: 'grass_medium_01_tall_a', lod: 0},
                    'Plane.068': {type: 'grass_medium_01_tall_a', lod: 1},
                    'Plane.086': {type: 'grass_medium_01_tall_a', lod: 2},
                    'Plane.042': {type: 'grass_medium_01_tall_b', lod: 0},
                    'Plane.067': {type: 'grass_medium_01_tall_b', lod: 1},
                    'Plane.085': {type: 'grass_medium_01_tall_b', lod: 2},
                    'Plane.045': {type: 'grass_medium_01_tall_c', lod: 0},
                    'Plane.069': {type: 'grass_medium_01_tall_c', lod: 1},
                    'Plane.087': {type: 'grass_medium_01_tall_c', lod: 2},
                };

                const traverse = (node) => {
                    if (!node) return;
                    if (node.geometry) {
                        allMeshes.push(node);
                        const nodeName = node.name || '';
                        const match = nodeName.match(/(grass_medium_01_tall_[a-z0-9]+).*?LOD([0-2])/i);
                        if (match) {
                            const typeKey = match[1].toLowerCase();
                            const lodLevel = parseInt(match[2], 10);
                            if (!grassGroups.has(typeKey)) grassGroups.set(typeKey, []);
                            grassGroups.get(typeKey)[lodLevel] = node;
                        } else if (planeMeshMap[nodeName]) {
                            const info = planeMeshMap[nodeName];
                            if (!grassGroups.has(info.type)) grassGroups.set(info.type, []);
                            grassGroups.get(info.type)[info.lod] = node;
                        }
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        traverse(children[i]);
                    }
                };
                traverse(loader.resultMesh);

                if (grassGroups.size === 0 && allMeshes.length >= 9) {
                    const orderedTypes = ['grass_medium_01_tall_b', 'grass_medium_01_tall_a', 'grass_medium_01_tall_c'];
                    for (let lod = 0; lod < 3; lod++) {
                        for (let t = 0; t < 3; t++) {
                            const meshIdx = lod * 3 + t;
                            const typeKey = orderedTypes[t];
                            if (!grassGroups.has(typeKey)) grassGroups.set(typeKey, []);
                            grassGroups.get(typeKey)[lod] = allMeshes[meshIdx];
                        }
                    }
                }

                if (grassGroups.size === 0) {
                    console.warn('No valid grass LOD meshes found in grassList.glb');
                    return;
                }

                const displayNames = {
                    'grass_medium_01_tall_a': 'Wild Tall Grass A',
                    'grass_medium_01_tall_b': 'Wild Tall Grass B',
                    'grass_medium_01_tall_c': 'Wild Tall Grass C'
                };

                const densities = {
                    'grass_medium_01_tall_a': 4000,
                    'grass_medium_01_tall_b': 3500,
                    'grass_medium_01_tall_c': 3500
                };

                const sortedKeys = Array.from(grassGroups.keys()).sort();

                sortedKeys.forEach((key) => {
                    const lods = grassGroups.get(key);
                    const lod0 = lods[0] || lods[1] || lods[2];
                    if (!lod0) return;

                    const lodConfigs = [
                        {mesh: lod0, lodDistance: 35}
                    ];
                    if (lods[1] && lods[1] !== lod0) {
                        lodConfigs.push({mesh: lods[1], lodDistance: 70});
                    }
                    if (lods[2] && lods[2] !== lod0 && lods[2] !== lods[1]) {
                        lodConfigs.push({mesh: lods[2], lodDistance: 110});
                    }

                    const grassType = new RedGPU.Display.Landscape.GrassType(redGPUContext, {
                        name: displayNames[key] || key,
                        lods: lodConfigs,
                        densityPerHectare: densities[key] || 3500,
                        targetLayer: 'Grass',
                        minWeightThreshold: 0.02,
                        cullingDistance: 110,
                        fadeStartDistance: 95,
                        shrinkStartDistance: 80,
                        minScale: [3.0, 3.8, 3.0],
                        maxScale: [4.8, 6.0, 4.8],
                        groundBlendStrength: 0.45,
                        subsurfaceStrength: 0.45,
                        exposureBoost: 1.0,
                        bottomOffset: -0.18
                    });

                    grassManager.addGrassType(grassType);
                    registeredGrassTypes.push(grassType);
                    onGrassTypeAdded?.(grassType, false);
                });

                grassManager.populateInstances([orbitController.centerX, orbitController.centerY, orbitController.centerZ]);
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
            grassManager,
            layers
        });

        onGrassTypeAdded = (type, isDefaultExpanded) => {
            guiCallbacks.addGrassTypeToUI(type, isDefaultExpanded);
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
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 절차적 잔디 파라미터, 버퍼 상태, 지형 및 광원을 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, procedural grass parameters, buffer statistics, terrain, and lighting.
 */
function renderTestPane({
                            redGPUContext,
                            view,
                            freeController,
                            orbitController,
                            landscape,
                            directionalLight,
                            directionalShadowManager,
                            grassManager,
                            layers
                        }) {
    const params = {
        cameraMode: 'Orbit'
    };

    const resetCamera = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = -120;
            freeController.y = 206;
            freeController.z = 125;
            freeController.tilt = -12;
            freeController.pan = 35;
        } else {
            orbitController.centerX = -120;
            orbitController.centerY = 205;
            orbitController.centerZ = 120;
            orbitController.distance = 6.0;
            orbitController.tilt = -12;
            orbitController.pan = 35;
        }
    };

    let grassFolder = null;

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
                min: 1.0,
                max: 50.0,
                step: 1.0
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = cameraFolder.addBinding(orbitController, 'speedDistance', {
                min: 0.1,
                max: 2.0,
                step: 0.1
            });

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                speedBinding.hidden = !isFree;
                zoomSpeedBinding.hidden = isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera'}).on('click', resetCamera);

            // 2. 절차적 잔디 폴더
            grassFolder = pane.addFolder({title: 'Grass', expanded: true});

            grassFolder.addBinding(grassManager, 'enabled');
            grassFolder.addBinding(grassManager, 'streamingRadius', {
                min: 30,
                max: 250,
                step: 5
            }).on('change', () => {
                const cam = view.camera;
                const posX = cam.x ?? cam.centerX ?? 0;
                const posY = cam.y ?? cam.centerY ?? 0;
                const posZ = cam.z ?? cam.centerZ ?? 0;
                grassManager.populateInstances([posX, posY, posZ]);
            });

            // 잔디 버퍼 통계
            const grassStats = {
                get activeInstances() {
                    let count = 0;
                    for (let i = 0; i < grassManager.grassTypes.length; i++) {
                        const alloc = grassManager.megaBuffer?.getAllocation(grassManager.grassTypes[i].typeId);
                        if (alloc) count += alloc.activeCount;
                    }
                    return count.toLocaleString();
                },
                get totalCapacity() {
                    return (grassManager.megaBuffer?.totalAllocatedInstances ?? 0).toLocaleString();
                }
            };
            const statsFolder = grassFolder.addFolder({title: 'Buffer Stats', expanded: true});
            statsFolder.addBinding(grassStats, 'activeInstances', {readonly: true});
            statsFolder.addBinding(grassStats, 'totalCapacity', {readonly: true});

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: false});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1000, step: 10});
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
            lightFolder.addBinding(directionalShadowManager, 'bias', {min: 0.00001, max: 0.002, step: 0.00005});
            lightFolder.addBinding(directionalShadowManager, 'pcssLightSize', {min: 0.0, max: 5.0, step: 0.1});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 30, max: 300, step: 10});

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

    const addGrassTypeToUI = (type, isDefaultExpanded = false) => {
        if (!grassFolder) return;
        const typeFolder = grassFolder.addFolder({title: type.name, expanded: isDefaultExpanded});

        typeFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1});
        typeFolder.addBinding(type, 'cullingDistance', {min: 20, max: 200, step: 5});
        typeFolder.addBinding(type, 'shrinkStartDistance', {min: 10, max: 150, step: 5});
        typeFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        typeFolder.addBinding(type, 'subsurfaceStrength', {min: 0.0, max: 3.0, step: 0.05});
        typeFolder.addBinding(type, 'exposureBoost', {min: 0.5, max: 3.0, step: 0.1});
        typeFolder.addBinding(type, 'alphaCutoff', {min: 0.05, max: 0.9, step: 0.05});
        typeFolder.addBinding(type, 'bottomOffset', {min: -0.8, max: 0.3, step: 0.01});
        typeFolder.addBinding(type, 'castShadow');
        typeFolder.addBinding(type, 'receiveShadow');
        typeFolder.addBinding(type, 'shadowStrength', {min: 0.0, max: 1.0, step: 0.05});
    };

    return {
        addGrassTypeToUI
    };
}
