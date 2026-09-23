import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 5: Foliage & Impostors (대규모 수목 식생 및 옥타헤드럴 임포스터)
 * [EN] Step 5: Foliage & Impostors (Large-Scale Foliage & Octahedral Impostors)
 *
 * [KO] 8km x 8km 광역 지형에 소나무 및 바위 식생을 대규모 배치하고, 3단계 메시 LOD와 최대 6,000m 원거리 옥타헤드럴 임포스터를 결합한 예제입니다.
 * [EN] Large-scale foliage example placing pine trees and rocks across an 8km x 8km terrain with 6,000m Octahedral Impostors.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 구성 (Orbit 조망 카메라)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 7000;
        orbitController.tilt = -25;
        orbitController.pan = 40;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 35000;
        orbitController.speedDistance = 80.0;

        // 2. 씬 & 뷰 생성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 및 스카이박스
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 & 그림자
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 400;

        // 5. 8km x 8km 랜드스케이프 지형 및 256 타일 스트리밍
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.loadingRadius = 2500.0;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
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

        // 6. 스플랫 레이어 4종
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';
        const layerConfigs = [
            {name: 'Grass', key: 'grass', weightChannel: 'R', uvScale: [50, 50], roughness: 0.85},
            {name: 'Rock', key: 'rock', weightChannel: 'G', uvScale: [15, 15], roughness: 0.7},
            {name: 'Gravel', key: 'gravel', weightChannel: 'B', uvScale: [40, 40], roughness: 0.9},
            {name: 'Leave', key: 'leave', weightChannel: 'A', uvScale: [50, 50], roughness: 0.8}
        ];

        const layers = layerConfigs.map(cfg => {
            const layer = new RedGPU.Display.Landscape.LandscapeLayer(redGPUContext, {
                name: cfg.name,
                baseColorTexture: `${assetPath}${cfg.key}.jpg`,
                normalTexture: `${assetPath}${cfg.key}_normal.jpg`,
                ormTexture: `${assetPath}${cfg.key}_orm.jpg`,
                weightTexture: weightTexturePath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness
            });
            landscape.addLayer(layer);
            return layer;
        });

        scene.addLandscape(landscape);

        // 7. 수목 식생 매니저
        const foliageManager = landscape.foliageManager;
        foliageManager.subCellSize = 100;
        foliageManager.streamingRadius = 800;

        let onFoliageTypeAdded = null;

        // 8. GUI 컨트롤 패널 생성
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            directionalLight,
            directionalShadowManager,
            foliageManager,
            layers
        });

        onFoliageTypeAdded = (type) => {
            testPane.addFoliageTypeToUI(type);
        };

        // 9. 식생 에셋 로딩
        initFoliageAssets({
            redGPUContext,
            foliageManager,
            onFoliageTypeAdded: (type) => {
                onFoliageTypeAdded?.(type);
            }
        });

        // 10. 렌더 루프 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (timestamp) => {
            testPane.update(timestamp);
        });
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] GUI 컨트롤 패널 (컨트롤러, 식생, 지형, 조명, 레이어)
 * [EN] GUI control panel (Controller, Foliage, Landscape, Light, Layers)
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            landscape,
                            directionalLight,
                            directionalShadowManager,
                            foliageManager,
                            layers
                        }) {
    // 3인칭 캐릭터 추종 카메라
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 5.5;
    characterOrbitController.tilt = -12;
    characterOrbitController.pan = 35;
    characterOrbitController.speedDistance = 0.5;
    characterOrbitController.centerX = -500;
    characterOrbitController.centerY = 302.5 + 1.2;
    characterOrbitController.centerZ = -2750;

    view.camera = characterOrbitController;
    landscape.nearDetailDistance = 120;
    landscape.nearDetailFade = 80;

    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Character'
    };

    initCharacter({
        redGPUContext,
        scene,
        landscape,
        characterOrbitController,
        onLoaded: (handle) => {
            characterMesh = handle.characterMesh;
            characterController = handle.characterController;
            setCharacterState = handle.setState;
            if (params.cameraMode === 'Character') {
                characterController.useKeyboard = true;
            }
        }
    });

    let foliageFolder = null;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // 1. Controller 설정 (Orbit / Character)
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
                const isChar = ev.value === 'Character';
                view.camera = isChar ? characterOrbitController : orbitController;
                if (characterController) characterController.useKeyboard = isChar;
                if (isChar && characterMesh) {
                    characterOrbitController.centerX = characterMesh.x;
                    characterOrbitController.centerY = characterMesh.y + 1.2;
                    characterOrbitController.centerZ = characterMesh.z;
                }
                landscape.nearDetailDistance = isChar ? 120 : 1000;
                landscape.nearDetailFade = isChar ? 80 : 300;
                pane.refresh();
            });

            controllerFolder.addButton({title: 'Reset Camera'}).on('click', () => {
                if (params.cameraMode === 'Character' && characterMesh) {
                    characterOrbitController.centerX = characterMesh.x;
                    characterOrbitController.centerY = characterMesh.y + 1.2;
                    characterOrbitController.centerZ = characterMesh.z;
                    characterOrbitController.distance = 5.5;
                    characterOrbitController.tilt = -12;
                    characterOrbitController.pan = 35;
                } else {
                    orbitController.centerX = 0;
                    orbitController.centerY = 0;
                    orbitController.centerZ = 0;
                    orbitController.distance = 7000;
                    orbitController.tilt = -25;
                    orbitController.pan = 40;
                }
            });

            // 2. 수목 식생 매니저 (Foliage)
            foliageFolder = pane.addFolder({title: 'Foliage', expanded: true});
            foliageFolder.addBinding(foliageManager, 'streamingRadius', {min: 200, max: 2000, step: 50});
            foliageFolder.addBinding(foliageManager, 'subCellSize', {min: 50, max: 200, step: 10});
            foliageFolder.addBinding(foliageManager, 'debugSubCellColoration');

            // 3. 지형 설정 (Landscape) - 핵심 설정만 심플하게 유지
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            landscapeFolder.addBinding(landscape, 'wireframe');
            landscapeFolder.addBinding(landscape, 'lodColoration');

            // 4. 조명 및 그림자 (Light)
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            lightFolder.addBinding(directionalShadowManager, 'strength', {min: 0.0, max: 1.0, step: 0.05});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 50, max: 800, step: 25});

            // 5. 스플랫 레이어 (Layers) - 표시 토글만 간결하게 유지
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
            layers.forEach((layer) => {
                splatFolder.addBinding(layer, 'enabled', {label: layer.name});
            });
        }
    });

    /**
     * [KO] 등록된 식생 타입(FoliageType) 개별 컨트롤러 추가
     * [EN] Adds individual controls for a registered FoliageType
     */
    const addFoliageTypeToUI = (type) => {
        if (!foliageFolder) return;
        const typeFolder = foliageFolder.addFolder({title: type.name, expanded: true});

        // 1. Placement & Density (배치 및 밀도)
        const placementFolder = typeFolder.addFolder({title: 'Placement & Density', expanded: true});
        const layerOptions = {'(All / None)': ''};
        if (landscape?.layers) {
            landscape.layers.forEach((l) => {
                layerOptions[l.name] = l.name;
            });
        }
        placementFolder.addBinding(type, 'targetLayer', {options: layerOptions});
        placementFolder.addBinding(type, 'densityPerHectare', {
            min: 1.0,
            max: 500.0,
            step: 1.0,
            label: 'Density (/ha)'
        });
        placementFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1, label: 'Density Mul'});
        placementFolder.addBinding(type, 'minWeightThreshold', {
            min: 0.0,
            max: 0.5,
            step: 0.01,
            label: 'Weight Cutoff'
        });
        placementFolder.addBinding(type, 'activeInstanceCount', {readonly: true, label: 'Active Count'});

        // 2. Transform & Slope (스케일 및 경사각)
        const transformFolder = typeFolder.addFolder({title: 'Transform & Slope', expanded: true});
        transformFolder.addBinding(type, 'bottomOffset', {min: -3.0, max: 2.0, step: 0.05, label: 'Bottom Offset'});
        transformFolder.addBinding(type, 'maxSlope', {min: 10.0, max: 90.0, step: 1.0, label: 'Max Slope'});
        transformFolder.addBinding(type, 'alignToNormal', {label: 'Align Normal'});
        transformFolder.addBinding(type, 'alignFactor', {min: 0.0, max: 1.0, step: 0.05, label: 'Align Factor'});

        // 3. LOD & Impostor (컬링 거리 및 임포스터)
        const lodFolder = typeFolder.addFolder({title: 'LOD & Impostor', expanded: true});
        lodFolder.addBinding(type, 'cullingDistance', {min: 500, max: 8000, step: 100, label: 'Cull Dist'});
        lodFolder.addBinding(type, 'fadeStartDistance', {min: 300, max: 6000, step: 100, label: 'Fade Start'});

        // 바람 파라미터는 수목(Tree)에만 배치
        if (type.name.includes('Tree')) {
            const windFolder = typeFolder.addFolder({title: 'Wind & Motion', expanded: true});
            windFolder.addBinding(type, 'windMultiplier', {min: 0.0, max: 3.0, step: 0.1, label: 'Wind Mul'});
        }
    };

    // 렌더 프레임 업데이트
    const update = (timestamp) => {
        if (characterMesh && characterController) {
            characterController.update(view, timestamp);

            if (params.cameraMode === 'Character') {
                characterOrbitController.centerX = characterMesh.x;
                characterOrbitController.centerY = characterMesh.y + 1.2;
                characterOrbitController.centerZ = characterMesh.z;
            }

            if (setCharacterState) {
                if (characterController.isRunning) setCharacterState('Run');
                else if (characterController.isMoving) setCharacterState('Walk');
                else setCharacterState('Idle');
            }
        }
    };

    return {
        addFoliageTypeToUI,
        update
    };
}

/**
 * [KO] 3D 캐릭터 로딩 및 물리 컨트롤러 구성
 * [EN] Loads 3D character and configures physics controller
 */
function initCharacter({redGPUContext, scene, landscape, characterOrbitController, onLoaded}) {
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://threejs.org/examples/models/gltf/Soldier.glb',
        (loader) => {
            const characterMesh = loader.resultMesh;
            characterMesh.x = -500;
            characterMesh.z = -2750;

            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 302.5);

            characterMesh.setCastShadowRecursively(true);
            characterMesh.setReceiveShadowRecursively(true);
            scene.addChild(characterMesh);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;

            const characterController = new RedGPU.Charactor.SimpleCharacterController(
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
                    useKeyboard: false,
                    getFloorHeight: (x, z) => landscape.getHeightAt(x, z),
                }
            );

            let targetState = 'Idle';
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

                const BLEND = 0.25;
                const pairs = [
                    ['Idle', 'Walk'], ['Idle', 'Run'],
                    ['Walk', 'Idle'], ['Walk', 'Run'],
                    ['Run', 'Idle'], ['Run', 'Walk'],
                ];
                pairs.forEach(([from, to]) => {
                    stateMachine.addTransition({
                        fromState: from,
                        toState: to,
                        duration: BLEND,
                        conditions: () => targetState === to,
                    });
                });

                loader.stopAnimation();
                loader.playAnimation(idleState);
                if (loader.activeAnimations.length > 0) {
                    loader.activeAnimations[0].animStateMachine = stateMachine;
                }
            }

            onLoaded?.({
                characterMesh,
                characterController,
                setState: (state) => {
                    targetState = state;
                }
            });
        }
    );
}

/**
 * [KO] 소나무 및 바위 식생 에셋 로딩
 * [EN] Loads tree and rock foliage assets
 */
function initFoliageAssets({redGPUContext, foliageManager, onFoliageTypeAdded}) {
    // 1. 소나무 (test.glb - Multi-LOD Tree + Octahedral Impostor)
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
                        if (!treeGroups.has(baseName)) treeGroups.set(baseName, {});
                        treeGroups.get(baseName)[`lod${lodLevel}`] = node;
                        return;
                    }
                }
                const children = node.children || [];
                for (let i = 0; i < children.length; i++) traverse(children[i]);
            };
            traverse(root);

            treeGroups.forEach((lods, baseName) => {
                const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                if (!lod0) return;

                const lodConfigs = [{mesh: lod0, lodDistance: 50, receiveShadow: true}];
                if (lods.lod1 && lods.lod1 !== lod0) {
                    lodConfigs.push({mesh: lods.lod1, lodDistance: 100, receiveShadow: true});
                }
                if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                    lodConfigs.push({mesh: lods.lod2, lodDistance: 180, receiveShadow: false});
                }

                const foliageType = foliageManager.addFoliageType({
                    name: `Tree_${baseName}`,
                    lods: lodConfigs,
                    densityPerHectare: 120.0,
                    minWeightThreshold: 0.02,
                    minScale: [0.4, 0.4, 0.4],
                    maxScale: [0.7, 0.75, 0.7],
                    cullingDistance: 6000,
                    fadeStartDistance: 4500,
                    targetLayer: 'Grass',
                    bottomOffset: -0.85,
                    alignToNormal: true,
                    alignFactor: 0.4,
                    maxSlope: 32.0
                });

                onFoliageTypeAdded?.(foliageType);
            });
        }
    );

    // 2. 하천 바위 (river_rock.glb - Static Rock)
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
                for (let i = 0; i < children.length; i++) findRocks(children[i]);
            };
            findRocks(root);

            if (rockNodes.length > 0) {
                const rockType = foliageManager.addFoliageType({
                    name: 'Rock_RiverRock',
                    type: RedGPU.Display.Landscape.FOLIAGE_TYPE.BASIC,
                    lods: [{mesh: rockNodes[0], lodDistance: 150, receiveShadow: true}],
                    densityPerHectare: 35.0,
                    minWeightThreshold: 0.03,
                    minScale: [1.2, 1.0, 1.2],
                    maxScale: [2.5, 2.0, 2.5],
                    useImpostor: false,
                    cullingDistance: 1200,
                    fadeStartDistance: 900,
                    targetLayer: 'Rock',
                    bottomOffset: -0.2,
                    alignToNormal: true,
                    alignFactor: 0.6,
                    maxSlope: 60.0
                });

                onFoliageTypeAdded?.(rockType);
            }
        }
    );
}
