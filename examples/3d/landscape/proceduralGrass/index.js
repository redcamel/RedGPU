import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Procedural Grass 예제
 * [EN] Procedural Grass Example
 *
 * [KO] 지형의 특정 스플랫 레이어(targetLayer) 가중치와 경사도를 기반으로 GPU 컴퓨트 셰이더에서 수만 개의 절차적 잔디 인스턴스를 실시간 배치·컬링(grassManager.addType)하는 예제입니다.
 * [EN] Demonstrates procedurally scattering and culling tens of thousands of grass instances on the GPU based on terrain splat layer weights (targetLayer) and slope via grassManager.addType.
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

        // [KO] 지형에 내장된 절차적 잔디 매니저(grassManager) 참조 획득
        // [EN] Acquire reference to the terrain's built-in procedural grass manager (grassManager)
        const grassManager = landscape.grassManager;

        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            directionalLight,
            grassManager,
            layers
        });

        // [KO] 잔디 클럼프 3D 모델(grass.glb)을 비동기 로드하여 절차적 잔디 타입(Grass)으로 등록합니다.
        // [EN] Asynchronously load the grass clump 3D model (grass.glb) and register it as a procedural grass type (Grass).
        // [KO] 복수 종류의 잔디나 들꽃을 함께 배치하려면 동일한 방식으로 grassManager.addType()을 추가 호출합니다.
        // [EN] To scatter multiple grass varieties or wildflowers together, call grassManager.addType() additionally in the same way.
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/grass.glb',
            (loader) => {
                // [KO] GPU 기반 절차적 잔디 타입 등록 (계층 구조의 GLTF 메쉬를 전달하면 내부에서 단일 렌더 유닛으로 자동 병합하여 드로우콜을 최소화합니다)
                // [EN] Register GPU-driven procedural grass type (passing a hierarchical GLTF mesh automatically merges it into a unified render unit to minimize draw calls)
                const grass = grassManager.addType({
                    // [KO] 잔디 타입 식별 이름
                    // [EN] Identifier name of the grass type
                    name: 'Lawn Clump',
                    // [KO] 인스턴싱할 원본 잔디 메쉬 (loader.resultMesh)
                    // [EN] Source grass mesh to instance (loader.resultMesh)
                    mesh: loader.resultMesh,
                    // [KO] 헥타르(100m x 100m = 10,000㎡) 당 생성할 목표 잔디 인스턴스 밀도
                    // [EN] Target grass instance density per hectare (100m x 100m = 10,000㎡)
                    densityPerHectare: 20000,
                    // [KO] 잔디가 자라날 대상 지형 스플랫 레이어 이름 ('Grass' 레이어의 R 채널 가중치에 비례하여 스폰)
                    // [EN] Target terrain splat layer name where grass spawns (proportional to the 'Grass' layer's R-channel weight)
                    targetLayer: 'Grass',
                    // [KO] 카메라로부터 잔디가 렌더링될 최대 가시거리 및 GPU 셀 베이킹 반경 기준값 (월드 단위)
                    // [EN] Maximum rendering culling distance from the camera and GPU cell baking radius reference (in world units)
                    cullingDistance: 110,
                    // [KO] 인스턴스별 무작위 스케일 최소/최대 범위 [scaleX, scaleY, scaleZ]
                    // [EN] Per-instance random scale minimum/maximum range [scaleX, scaleY, scaleZ]
                    minScale: [12.0, 8.0, 12.0],
                    maxScale: [18.0, 12.0, 18.0]
                });

                testPane.addGrassTypeToUI(grass, true);
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
                            grassManager,
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

    let grassFolder = null;
    const pendingGrassTypes = [];

    const addGrassTypeToUI = (type, isDefaultExpanded = false) => {
        if (!grassFolder) {
            pendingGrassTypes.push({type, isDefaultExpanded});
            return;
        }
        const typeFolder = grassFolder.addFolder({title: type.name, expanded: isDefaultExpanded});

        const cullingFolder = typeFolder.addFolder({title: 'Culling & Distance', expanded: true});
        cullingFolder.addBinding(type, 'cullingDistance', {min: 20, max: 250, step: 5}).on('change', () => {
            cullingFolder.refresh();
        });
        cullingFolder.addBinding(type, 'bakeRadius', {readonly: true});
        cullingFolder.addBinding(type, 'farDistance', {readonly: true});

        const placementFolder = typeFolder.addFolder({title: 'Placement & Density', expanded: true});
        const layerOptions = {'(All / None)': ''};
        if (landscape?.layers) {
            landscape.layers.forEach((layer) => {
                layerOptions[layer.name] = layer.name;
            });
        }
        placementFolder.addBinding(type, 'targetLayer', {options: layerOptions});
        placementFolder.addBinding(type, 'densityPerHectare', {min: 1000, max: 60000, step: 1000}).on('change', () => {
            placementFolder.refresh();
        });
        placementFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1}).on('change', () => {
            placementFolder.refresh();
        });
        placementFolder.addBinding(type, 'instancesPerCell', {readonly: true});
        placementFolder.addBinding(type, 'densityScaleByWeight');

        const transformFolder = typeFolder.addFolder({title: 'Transform & Slope', expanded: false});
        const scaleProxy = {
            minScaleXZ: type.minScale[0],
            minScaleY: type.minScale[1],
            maxScaleXZ: type.maxScale[0],
            maxScaleY: type.maxScale[1]
        };
        transformFolder.addBinding(scaleProxy, 'minScaleXZ', {min: 0.1, max: 30.0, step: 0.1}).on('change', (ev) => {
            type.minScale = [ev.value, type.minScale[1], ev.value];
        });
        transformFolder.addBinding(scaleProxy, 'minScaleY', {min: 0.1, max: 30.0, step: 0.1}).on('change', (ev) => {
            type.minScale = [type.minScale[0], ev.value, type.minScale[2]];
        });
        transformFolder.addBinding(scaleProxy, 'maxScaleXZ', {min: 0.1, max: 30.0, step: 0.1}).on('change', (ev) => {
            type.maxScale = [ev.value, type.maxScale[1], ev.value];
        });
        transformFolder.addBinding(scaleProxy, 'maxScaleY', {min: 0.1, max: 30.0, step: 0.1}).on('change', (ev) => {
            type.maxScale = [type.maxScale[0], ev.value, type.maxScale[2]];
        });
        transformFolder.addBinding(type, 'minSlope', {min: 0, max: 90, step: 1});
        transformFolder.addBinding(type, 'maxSlope', {min: 0, max: 90, step: 1});
        transformFolder.addBinding(type, 'bottomOffset', {min: -0.8, max: 0.3, step: 0.01});

        const materialFolder = typeFolder.addFolder({title: 'Material & PBR', expanded: true});
        materialFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        materialFolder.addBinding(type, 'alphaCutoff', {min: 0.05, max: 0.9, step: 0.05});
        materialFolder.addBinding(type, 'roughness', {min: 0.04, max: 1.0, step: 0.05});
        materialFolder.addBinding(type, 'exposureBoost', {min: 0.5, max: 3.0, step: 0.1});
        materialFolder.addBinding(type, 'subsurfaceStrength', {min: 0.0, max: 3.0, step: 0.05});

        const shadowFolder = typeFolder.addFolder({title: 'Shadow', expanded: true});
        shadowFolder.addBinding(type, 'castShadow');
        shadowFolder.addBinding(type, 'receiveShadow');
        shadowFolder.addBinding(type, 'shadowStrength', {min: 0.0, max: 1.0, step: 0.05});
    };

    new RedGPUExampleHelper(redGPUContext, {
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

            grassFolder = pane.addFolder({title: 'GrassManager', expanded: true});
            grassFolder.addBinding(grassManager, 'enabled');
            grassFolder.addBinding(grassManager, 'totalInstanceCount', {readonly: true, interval: 200});
            grassFolder.addBinding(grassManager, 'instanceCapacity', {readonly: true, interval: 200});
            grassFolder.addBinding(grassManager, 'totalDrawCalls', {readonly: true, interval: 200});
            grassFolder.addBinding(grassManager, 'shadowDrawCalls', {readonly: true, interval: 200});

            while (pendingGrassTypes.length > 0) {
                const item = pendingGrassTypes.shift();
                addGrassTypeToUI(item.type, item.isDefaultExpanded);
            }

            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 600, step: 5});
            landscapeFolder.addBinding(landscape, 'receiveShadow');
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 1500, step: 10});

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
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
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
        addGrassTypeToUI,
        update: (time) => character.update(view, time)
    };
};

const initCharacter = (redGPUContext, scene, landscape, characterOrbitController) => {
    let characterMesh = null;
    let characterController = null;
    let targetState = 'Idle';
    let isCharacterMode = true;

    // [KO] 캐릭터 모델 로드 (출처: https://threejs.org/examples/models/gltf/Soldier.glb)
    // [EN] Load character model (Source: https://threejs.org/examples/models/gltf/Soldier.glb)
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
