import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Foliage & Impostors 예제
 * [EN] Foliage & Impostors Example
 *
 * [KO] 지형의 스플랫 레이어 가중치를 기반으로 대규모 수목 식생을 절차적 배치(foliageManager.addType)하고, 3단계 메쉬 LOD(LOD0~LOD2)와 원거리 옥타헤드럴 임포스터(Octahedral Impostor) 및 전역 바람(windManager)을 연동하는 예제입니다.
 * [EN] Demonstrates procedurally scattering large-scale tree foliage based on terrain splat layer weights (foliageManager.addType), combining 3-stage mesh LODs (LOD0–LOD2), distant Octahedral Impostors, and global wind (windManager).
 */

const SPAWN_X = -271.5;
const SPAWN_Z = -1416.25;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 3500;
        orbitController.minDistance = 400;
        orbitController.maxDistance = 6000;
        orbitController.tilt = -25;
        orbitController.pan = 35;
        orbitController.speedDistance = 50;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 36;
        directionalLight.azimuth = 325;
        scene.lightManager.addDirectionalLight(directionalLight);

        const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
        landscape.heightScale = 300;
        landscape.tileLoadingRadius = 1250;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        landscape.tileUrlResolver = (row, col) => {
            const host = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const r = String(row).padStart(2, '0');
            const c = String(col).padStart(2, '0');
            const size = (row === 15 && col === 15) ? '449_449'
                : (col === 15) ? '449_512'
                    : (row === 15) ? '512_449'
                        : '512_512';
            return `${host}28_134_86_730_13_${size}_16bit_tile_${r}_${c}.png`;
        };

        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexture = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';

        const layerConfigs = [
            {name: 'Grass', weightChannel: 'R', uvScale: [25, 25], roughness: 0.85},
            {name: 'Rock', weightChannel: 'G', uvScale: [7.5, 7.5], roughness: 0.7},
            {name: 'Gravel', weightChannel: 'B', uvScale: [20, 20], roughness: 0.9},
            {name: 'Leave', weightChannel: 'A', uvScale: [25, 25], roughness: 0.8}
        ];

        const layers = layerConfigs.map(({name, weightChannel, uvScale, roughness}) => {
            const key = name.toLowerCase();
            return landscape.addLayer({
                name,
                baseColorTexture: `${assetPath}${key}.jpg`,
                normalTexture: `${assetPath}${key}_normal.jpg`,
                ormTexture: `${assetPath}${key}_orm.jpg`,
                weightTexture,
                weightChannel,
                uvScale,
                roughness
            });
        });

        scene.landscape = landscape;

        // [KO] 지형에 내장된 대규모 수목 식생 매니저(foliageManager) 참조 획득
        // [EN] Acquire reference to the terrain's built-in large-scale foliage manager (foliageManager)
        const foliageManager = landscape.foliageManager;

        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            directionalLight,
            foliageManager,
            layers
        });

        // [KO] 다단계 LOD 메쉬(LOD0~LOD2)가 포함된 소나무 GLB(test.glb)를 로드하여 수목 식생 타입(Foliage)으로 등록합니다.
        // [EN] Load the pine tree GLB (test.glb) containing multi-stage LOD meshes (LOD0–LOD2) and register it as a foliage type (Foliage).
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
                // [KO] GLTF 씬 계층을 순회하며 노드 이름의 '_LOD0', '_LOD1', '_LOD2' 접미사를 기준으로 메쉬 단계를 그룹화합니다.
                // [EN] Traverse the GLTF scene hierarchy and group mesh stages by '_LOD0', '_LOD1', and '_LOD2' node name suffixes.
                const treeGroups = new Map();
                const traverse = (node) => {
                    if (!node) return;
                    if (node.name) {
                        const lodMatch = node.name.match(/(.*?)(?:_?LOD([0-9]))$/i);
                        if (lodMatch) {
                            const baseName = lodMatch[1] || node.name;
                            const lodLevel = parseInt(lodMatch[2], 10);
                            if (!treeGroups.has(baseName)) treeGroups.set(baseName, {});
                            treeGroups.get(baseName)[`lod${lodLevel}`] = node;
                            return;
                        }
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) traverse(children[i]);
                };
                traverse(loader.resultMesh);

                treeGroups.forEach((lods, baseName) => {
                    const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                    if (!lod0) return;

                    // [KO] 카메라 거리에 따라 전환될 메쉬 LOD 단계(LOD0: 50m, LOD1: 100m, LOD2: 180m) 배열을 구성합니다.
                    // [EN] Configure the mesh LOD stage array (LOD0: 50m, LOD1: 100m, LOD2: 180m) switched by camera distance.
                    // [KO] 마지막 메쉬 LOD(180m) 이후부터 최대 가시거리(cullingDistance) 구간까지는 엔진이 자동으로 베이킹한 옥타헤드럴 임포스터(Octahedral Impostor) 빌보드로 전환됩니다.
                    // [EN] Beyond the last mesh LOD distance (180m) up to cullingDistance, instances automatically transition to engine-baked Octahedral Impostor billboards.
                    const lodConfigs = [{mesh: lod0, lodDistance: 50}];
                    if (lods.lod1 && lods.lod1 !== lod0) {
                        lodConfigs.push({mesh: lods.lod1, lodDistance: 100});
                    }
                    if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                        lodConfigs.push({mesh: lods.lod2, lodDistance: 180});
                    }

                    // [KO] GPU 서브셀(Sub-Cell) 스트리밍 및 절두체 컬링 기반의 수목 식생 타입 등록
                    // [EN] Register GPU sub-cell streaming and frustum-culled foliage type
                    const foliage = foliageManager.addType({
                        // [KO] 식생 타입 식별 이름
                        // [EN] Identifier name of the foliage type
                        name: `Tree_${baseName}`,
                        // [KO] 거리별 메쉬 LOD 구성 배열
                        // [EN] Distance-based mesh LOD configuration array
                        lods: lodConfigs,
                        // [KO] 헥타르(10,000㎡) 당 생성할 목표 수목 인스턴스 밀도
                        // [EN] Target tree instance density per hectare (10,000㎡)
                        densityPerHectare: 120,
                        // [KO] 인스턴스별 무작위 스케일 최소/최대 범위 [scaleX, scaleY, scaleZ]
                        // [EN] Per-instance random scale minimum/maximum range [scaleX, scaleY, scaleZ]
                        minScale: [0.4, 0.4, 0.4],
                        maxScale: [0.7, 0.75, 0.7],
                        // [KO] 옥타헤드럴 임포스터를 포함한 최대 렌더링 가시거리 (월드 단위)
                        // [EN] Maximum rendering culling distance including Octahedral Impostors (in world units)
                        cullingDistance: 4000,
                        // [KO] 수목이 배치될 대상 지형 스플랫 레이어 이름 ('Grass' 레이어 영역에 스폰)
                        // [EN] Target terrain splat layer name where trees spawn (spawns on the 'Grass' layer region)
                        targetLayer: 'Grass',
                    });

                    testPane.addFoliageTypeToUI(foliage);
                });
            }
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            testPane.update(time);
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = ({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            landscape,
                            directionalLight,
                            foliageManager,
                            layers
                        }) => {
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 5.5;
    characterOrbitController.tilt = -12;
    characterOrbitController.pan = 35;
    characterOrbitController.speedDistance = 0.5;
    characterOrbitController.centerX = SPAWN_X;
    characterOrbitController.centerY = landscape.getHeightAt(SPAWN_X, SPAWN_Z) + 1.2;
    characterOrbitController.centerZ = SPAWN_Z;

    const character = initCharacter(redGPUContext, scene, landscape, characterOrbitController);

    const setCameraMode = (mode) => {
        const isCharacter = mode === 'Character';
        view.camera = isCharacter ? characterOrbitController : orbitController;
        landscape.nearDetailDistance = isCharacter ? 250 : 800;
        character.setMode(mode);
    };
    setCameraMode('Character');

    const params = {
        cameraMode: 'Character',
    };

    const quadOptions = {
        '16': 16,
        '32': 32,
        '64': 64,
        '128': 128,
        '256': 256,
        '512': 512
    };

    let foliageFolder = null;
    const pendingFoliageTypes = [];

    const addFoliageTypeToUI = (type) => {
        if (!foliageFolder) {
            pendingFoliageTypes.push(type);
            return;
        }
        const typeFolder = foliageFolder.addFolder({title: type.name, expanded: true});

        const streamingStatsFolder = typeFolder.addFolder({title: 'Streaming & Culling', expanded: false});
        streamingStatsFolder.addBinding(type, 'cullingDistance', {min: 100, max: 6000, step: 50}).on('change', () => {
            streamingStatsFolder.refresh();
        });
        streamingStatsFolder.addBinding(type, 'streamingRadius', {readonly: true, interval: 200});
        streamingStatsFolder.addBinding(type, 'activeInstanceCount', {readonly: true, interval: 200});
        streamingStatsFolder.addBinding(type, 'mountedSubCellCount', {readonly: true, interval: 200});
        streamingStatsFolder.addBinding(type, 'maxInstances', {readonly: true, interval: 200});
        streamingStatsFolder.addBinding(type, 'lastMountedCount', {readonly: true, interval: 200});
        streamingStatsFolder.addBinding(type, 'lastUnmountedCount', {readonly: true, interval: 200});
        streamingStatsFolder.addButton({title: 'clearSubCellCache'}).on('click', () => {
            type.clearSubCellCache();
        });

        const placementFolder = typeFolder.addFolder({title: 'Placement & Density', expanded: true});
        const layerOptions = {'(All / None)': ''};
        if (landscape?.layers) {
            landscape.layers.forEach((l) => {
                layerOptions[l.name] = l.name;
            });
        }
        placementFolder.addBinding(type, 'targetLayer', {options: layerOptions});
        placementFolder.addBinding(type, 'densityPerHectare', {min: 1.0, max: 500.0, step: 1.0}).on('change', () => {
            placementFolder.refresh();
        });
        placementFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1}).on('change', () => {
            placementFolder.refresh();
        });
        placementFolder.addBinding(type, 'densityScaleByWeight');
        placementFolder.addBinding(type, 'renderUnitCount', {readonly: true});
        placementFolder.addBinding(type, 'drawCallCount', {readonly: true, interval: 200});
        placementFolder.addButton({title: 'rebake'}).on('click', () => {
            type.rebake();
        });

        const transformFolder = typeFolder.addFolder({title: 'Transform & Slope', expanded: false});
        transformFolder.addBinding(type, 'bottomOffset', {min: -5.0, max: 5.0, step: 0.05});
        transformFolder.addBinding(type, 'minSlope', {min: 0.0, max: 89.0, step: 1.0});
        transformFolder.addBinding(type, 'maxSlope', {min: 1.0, max: 90.0, step: 1.0});
        const alignBinding = transformFolder.addBinding(type, 'alignToNormal');
        const alignFactorBinding = transformFolder.addBinding(type, 'alignFactor', {min: 0.0, max: 1.0, step: 0.05});
        alignFactorBinding.disabled = !type.alignToNormal;
        alignBinding.on('change', (ev) => {
            alignFactorBinding.disabled = !ev.value;
        });

        const groundBlendFolder = typeFolder.addFolder({title: 'Ground Blend', expanded: true});
        groundBlendFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        groundBlendFolder.addBinding(type, 'groundBlendRange', {min: 0.1, max: 10.0, step: 0.1});

        const lodFolder = typeFolder.addFolder({title: 'LOD & Impostor', expanded: false});
        lodFolder.addBinding(type, 'useDepthPrepass');
        if (type.hasImpostor) {
            lodFolder.addBinding(type, 'useImpostor');
        }

        const lodList = type.lodInfoList || [];
        const hasImp = type.hasImpostor;
        lodList.forEach((lodInfo, idx) => {
            const isImpostorLOD = hasImp && idx === lodList.length - 1;
            const subTitle = isImpostorLOD ? `Impostor (LOD ${idx})` : `LOD ${idx}`;
            const subFolder = lodFolder.addFolder({title: subTitle, expanded: false});

            if (!isImpostorLOD) {
                const lodProxy = {lodDistance: lodInfo.lodDistance};
                subFolder.addBinding(lodProxy, 'lodDistance', {min: 10, max: 1000, step: 5}).on('change', (ev) => {
                    type.setLODDistance(idx, ev.value);
                });
            }
            subFolder.addBinding(lodInfo, 'renderUnitCount', {readonly: true});
        });

        const shadowFolder = typeFolder.addFolder({title: 'Shadow', expanded: true});
        shadowFolder.addBinding(type, 'castShadow');
        shadowFolder.addBinding(type, 'receiveShadow');
        shadowFolder.addBinding(type, 'shadowCullDistance', {min: 50, max: 3000, step: 25});

        const windFolder = typeFolder.addFolder({title: 'Wind & Motion', expanded: false});
        windFolder.addBinding(type, 'trunkBendScale', {min: 0.0, max: 3.0, step: 0.05});
        windFolder.addBinding(type, 'leafFlutterScale', {min: 0.0, max: 3.0, step: 0.05});
    };

    new RedGPUExampleHelper(redGPUContext, {
        globalWind: true,
        gui: (pane) => {
            const controllerFolder = pane.addFolder({title: 'Controller', expanded: true});
            controllerFolder.addBinding(params, 'cameraMode', {
                view: 'radiogrid',
                groupName: 'cameraMode',
                size: [2, 1],
                cells: (x) => ({
                    title: x === 0 ? 'Orbit' : 'Character',
                    value: x === 0 ? 'Orbit' : 'Character'
                })
            }).on('change', (ev) => {
                setCameraMode(ev.value);
                pane.refresh();
            });

            foliageFolder = pane.addFolder({title: 'Foliage', expanded: true});

            const managerFolder = foliageFolder.addFolder({title: 'foliageManager', expanded: false});
            managerFolder.addBinding(foliageManager, 'enabled');
            managerFolder.addBinding(foliageManager, 'useDepthPrepass');
            managerFolder.addBinding(foliageManager, 'subCellSize', {readonly: true});
            managerFolder.addBinding(foliageManager, 'typeCount', {readonly: true, interval: 200});
            managerFolder.addBinding(foliageManager, 'totalDrawCalls', {readonly: true, interval: 200});
            managerFolder.addBinding(foliageManager, 'depthPrepassDrawCalls', {readonly: true, interval: 200});
            managerFolder.addBinding(foliageManager, 'mainPassDrawCalls', {readonly: true, interval: 200});
            managerFolder.addBinding(foliageManager, 'shadowDrawCalls', {readonly: true, interval: 200});

            while (pendingFoliageTypes.length > 0) {
                addFoliageTypeToUI(pendingFoliageTypes.shift());
            }

            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 600, step: 5});
            landscapeFolder.addBinding(landscape, 'receiveShadow');
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 1500, step: 10});

            const streamFolder = landscapeFolder.addFolder({title: 'Tile Streaming', expanded: false});
            streamFolder.addBinding(landscape, 'tileLoadingRadius', {min: 500, max: 4000, step: 100});
            streamFolder.addBinding(landscape, 'tileMaxLoadsPerFrame', {min: 1, max: 8, step: 1});

            const lodFolder = landscapeFolder.addFolder({title: 'LOD', expanded: false});
            lodFolder.addBinding(landscape, 'lodMetric', {
                options: {
                    screenSize: 'screenSize',
                    distance: 'distance'
                }
            });
            lodFolder.addBinding(landscape, 'componentSizeQuads', {options: quadOptions});
            lodFolder.addBinding(landscape, 'lod0SizeQuads', {options: quadOptions});

            const shadowFolder = landscapeFolder.addFolder({title: 'Heightmap Shadow', expanded: false});
            shadowFolder.addBinding(landscape, 'castHeightmapShadow');
            shadowFolder.addBinding(landscape, 'heightmapShadowSteps', {min: 4, max: 32, step: 1});
            shadowFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            shadowFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 200, max: 3000, step: 50});

            const debugFolder = landscapeFolder.addFolder({title: 'Debug', expanded: false});
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeDebugMode', {
                options: {
                    'None (Full PBR)': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.NONE,
                    'Final Normal': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.FINAL_NORMAL,
                    'Macro Normal': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.MACRO_NORMAL,
                    'Albedo': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ALBEDO,
                    'Splat Weights': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.SPLAT_WEIGHTS,
                    'Roughness': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ROUGHNESS,
                    'Ambient Occlusion': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.AMBIENT_OCCLUSION,
                    'Heightmap Shadow Mask': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.HEIGHTMAP_SHADOW_MASK,
                    'CSM Shadow Mask': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.CSM_SHADOW_MASK,
                    'Total Shadow Visibility': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.TOTAL_SHADOW_VISIBILITY,
                    'Elevation Heatmap': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.ELEVATION_HEATMAP,
                    'LOD Level': RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.LOD_LEVEL
                }
            });
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeWireframe');
            debugFolder.addBinding(landscape.debuggerManager, 'landscapeLodColoration');

            const lightFolder = pane.addFolder({title: 'Light', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});
                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'stochasticTiling');
                layerSubFolder.addBinding(layer, 'stochasticScale', {min: 0.1, max: 5.0, step: 0.1});

                const uvProxy = {uvScale: layer.uvScale[0]};
                layerSubFolder.addBinding(uvProxy, 'uvScale', {min: 1, max: 100, step: 0.5}).on('change', (ev) => {
                    layer.uvScale = [ev.value, ev.value];
                });

                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
                layerSubFolder.addBinding(layer, 'heightBlendFactor', {min: 0.0, max: 3.0, step: 0.05});
            });
        }
    });

    return {
        addFoliageTypeToUI,
        update: (time) => character.update(view, time)
    };
};

const initCharacter = (redGPUContext, scene, landscape, characterOrbitController) => {
    let characterMesh = null;
    let characterController = null;
    let targetState = 'Idle';
    let isCharacterMode = true;

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://threejs.org/examples/models/gltf/Soldier.glb',
        (loader) => {
            characterMesh = loader.resultMesh;
            characterMesh.x = SPAWN_X;
            characterMesh.z = SPAWN_Z;
            characterMesh.y = landscape.getHeightAt(SPAWN_X, SPAWN_Z);

            characterMesh.setCastShadowRecursively(true);
            characterMesh.setReceiveShadowRecursively(true);
            scene.addChild(characterMesh);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;

            characterController = new RedGPU.Charactor.SimpleCharacterController(
                redGPUContext,
                characterMesh,
                characterOrbitController,
                {
                    speed: 5.0,
                    runSpeed: 10.0,
                    rotationSpeed: 10.0,
                    gravity: 24.0,
                    jumpForce: 9.0,
                    floorHeight: 0.0,
                    floorOffset: 0.0,
                    useKeyboard: isCharacterMode,
                    getFloorHeight: (x, z) => landscape.getHeightAt(x, z),
                }
            );

            const clips = loader.parsingResult.animations;
            if (clips && clips.length > 0) {
                const idleState = clips[0];
                const runState = clips[1];
                const walkState = clips[3] || clips[2];

                idleState.name = 'Idle';
                walkState.name = 'Walk';
                runState.name = 'Run';

                const stateMachine = new RedGPU.AnimStateMachine(idleState);
                stateMachine.addState(walkState);
                stateMachine.addState(runState);

                [
                    ['Idle', 'Walk'], ['Idle', 'Run'],
                    ['Walk', 'Idle'], ['Walk', 'Run'],
                    ['Run', 'Idle'], ['Run', 'Walk'],
                ].forEach(([fromState, toState]) => {
                    stateMachine.addTransition({
                        fromState,
                        toState,
                        duration: 0.25,
                        conditions: () => targetState === toState,
                    });
                });

                loader.stopAnimation();
                loader.playAnimation(idleState);
                if (loader.activeAnimations.length > 0) {
                    loader.activeAnimations[0].animStateMachine = stateMachine;
                }
            }
        }
    );

    return {
        setMode: (mode) => {
            isCharacterMode = mode === 'Character';
            if (characterController) characterController.useKeyboard = isCharacterMode;
            if (isCharacterMode && characterMesh) {
                characterOrbitController.centerX = characterMesh.x;
                characterOrbitController.centerY = characterMesh.y + 1.2;
                characterOrbitController.centerZ = characterMesh.z;
            }
        },
        update: (view, time) => {
            if (!characterMesh || !characterController) return;
            characterController.update(view, time);

            if (isCharacterMode) {
                characterOrbitController.centerX = characterMesh.x;
                characterOrbitController.centerY = characterMesh.y + 1.2;
                characterOrbitController.centerZ = characterMesh.z;
            }

            if (characterController.isRunning) targetState = 'Run';
            else if (characterController.isMoving) targetState = 'Walk';
            else targetState = 'Idle';
        }
    };
};
