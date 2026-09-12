import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 & 뷰 설정 (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5.5;
        controller.tilt = -12;
        controller.minDistance = 2.0;
        controller.maxDistance = 25.0;
        controller.centerX = -120;
        controller.centerY = 205;
        controller.centerZ = 120;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 2. IBL & SkyBox
        const currentIbl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/field.hdr',
            30000
        );
        view.ibl = currentIbl;

        const currentSkybox = new RedGPU.Display.SkyBox(
            redGPUContext,
            currentIbl.environmentTexture,
            30000
        );
        view.skybox = currentSkybox;

        // 3. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 38;
        directionalLight.azimuth = 55;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 150;
        directionalShadowManager.strength = 0.95;
        directionalShadowManager.pcssLightSize = 1.2;

        // 4. 지형 (Landscape)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 300;
        landscape.loadingRadius = 3000;
        landscape.baseColor.setColorByHEX('#2f6834');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

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
                uvScale: [300, 300],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ];

        layerConfigs.forEach((cfg) => {
            landscape.addLayer(new RedGPU.Display.Landscape.LandscapeLayer({
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
            }));
        });
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

        // 5. 배경 나무 식생 (Landscape Foliage Subsystem - test.glb)
        const foliageManager = landscape.foliageManager;
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
                const treeGroups = new Map();

                const traverse = (node) => {
                    if (!node) return;
                    if (node.name) {
                        const match = node.name.match(/(.*?)(?:_?LOD([0-9]))$/i);
                        if (match) {
                            const baseName = match[1] || node.name;
                            const lodLevel = parseInt(match[2], 10);
                            if (!treeGroups.has(baseName)) treeGroups.set(baseName, {});
                            treeGroups.get(baseName)[`lod${lodLevel}`] = node;
                            return;
                        }
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        traverse(children[i]);
                    }
                };
                traverse(loader.resultMesh);

                treeGroups.forEach((lods, baseName) => {
                    const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                    if (!lod0) return;

                    const lodConfigs = [
                        {mesh: lod0, lodDistance: 50, receiveShadow: true}
                    ];
                    if (lods.lod1 && lods.lod1 !== lod0) {
                        lodConfigs.push({mesh: lods.lod1, lodDistance: 100, receiveShadow: true});
                    }
                    if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                        lodConfigs.push({mesh: lods.lod2, lodDistance: 180, receiveShadow: false});
                    }

                    foliageManager.addFoliageType({
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
                });
            }
        );

        // 6. 잔디 서브시스템 (LandscapeGrassManager) 설정
        const grassManager = landscape.grassManager;
        grassManager.enabled = true;
        grassManager.streamingRadius = 120;

        // 7. GUI 테스트 패널 생성
        const testPane = renderTestPane({
            redGPUContext,
            controller,
            grassManager,
            landscape,
            directionalLight,
            directionalShadowManager
        });

        // 8-1. 🌿 기본 뗏장 잔디 (grass.glb - Base Clump)
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
                        name: '🌱 Ground Lawn Clump (Base)',
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
                        subsurfaceStrength: 1.40,
                        exposureBoost: 1,
                        bottomOffset: -0.25
                    });

                    grassManager.addGrassType(baseClumpType);
                    testPane.addTypeToUI(baseClumpType, true);
                    grassManager.populateInstances([controller.centerX, controller.centerY, controller.centerZ]);
                    console.log('🌿 [Layer 1] Base Ground Clump registered successfully.');
                }
            }
        );

        // 8-2. 🌾 키 큰 야생 들풀 3종 (grassList.glb - Multi-LOD Tall Grass)
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
                    console.error('❌ [grassList.glb] No valid grass LOD meshes found in GLTF model!', allMeshes);
                    return;
                }

                const displayNames = {
                    'grass_medium_01_tall_a': '🌾 Wild Tall Grass A',
                    'grass_medium_01_tall_b': '🌾 Wild Tall Grass B',
                    'grass_medium_01_tall_c': '🌾 Wild Tall Grass C'
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

                    // 🌿 현실적인 실측 스케일 (높이 약 50~80cm의 자연스러운 들풀 비례)
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
                        subsurfaceStrength: 1.50,
                        exposureBoost: 1,
                        bottomOffset: -0.18
                    });

                    grassManager.addGrassType(grassType);
                    testPane.addTypeToUI(grassType);
                });

                grassManager.populateInstances([controller.centerX, controller.centerY, controller.centerZ]);
                console.log('🌾 [Layer 2] Tall Grass variants registered successfully.');
            }
        );

        // 9. 🚶 3D 캐릭터 로드 및 애니메이션 상태 머신 (Soldier.glb)
        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            MODEL_URL,
            (loader) => {
                characterMesh = loader.resultMesh;
                characterMesh.x = -120;
                characterMesh.z = 120;
                const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
                characterMesh.y = startH > 0 ? startH : 200;

                // 🌟 캐릭터 및 모든 하위 부위의 그림자 생성 및 수신 활성화
                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);

                scene.addChild(characterMesh);

                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.2;
                controller.centerZ = characterMesh.z;

                // 캐릭터 컨트롤러 생성
                characterController = new RedGPU.Charactor.SimpleCharacterController(
                    redGPUContext,
                    characterMesh,
                    view.camera,
                    {
                        speed: 4.5,
                        runSpeed: 9.5,
                        rotationSpeed: 10.0,
                        gravity: 24.0,
                        jumpForce: 9.0,
                        floorHeight: 200.0,
                    }
                );

                // 애니메이션 클립 매핑 (0=Idle, 1=Run, 2=TPose, 3=Walk)
                const clips = loader.parsingResult.animations;
                if (clips && clips.length > 0) {
                    const idleState = clips[0];
                    const runState = clips[1];
                    const walkState = clips[3] || clips[2];

                    idleState.name = 'Idle';
                    walkState.name = 'Walk';
                    runState.name = 'Run';

                    stateMachine = new RedGPU.AnimStateMachine(idleState);
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
                            conditions: () => targetStateName === to,
                        });
                    });

                    loader.stopAnimation();
                    loader.playAnimation(idleState);
                    if (loader.activeAnimations.length > 0) {
                        loader.activeAnimations[0].animStateMachine = stateMachine;
                    }
                }
                console.log('🚶 [Character] Soldier loaded and ready for keyboard control on grass terrain.');
            }
        );

        // 10. 렌더 루프 및 실시간 캐릭터-지형 상호작용
        let initialSnapped = false;
        let lastDisplayState = '';
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (timestamp) => {
            if (characterMesh && characterController) {
                const dt = lastTime !== null ? timestamp - lastTime : 0;
                lastTime = timestamp;
                if (dt > 0) {
                    // 1. 현재 캐릭터 위치의 지형 고도 실시간 취득
                    const terrainH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
                    if (terrainH > 0) {
                        characterController.floorHeight = terrainH;
                        if (!initialSnapped) {
                            characterMesh.y = terrainH;
                            initialSnapped = true;
                        }
                    }

                    // 2. 캐릭터 이동 및 물리 시뮬레이션
                    characterController.update(view, timestamp);

                    // 3. OrbitController 3인칭 카메라가 캐릭터를 부드럽게 추적
                    controller.centerX = characterMesh.x;
                    controller.centerY = characterMesh.y + 1.2;
                    controller.centerZ = characterMesh.z;

                    // 4. 애니메이션 상태 전이 판단
                    if (characterController.isRunning) targetStateName = 'Run';
                    else if (characterController.isMoving) targetStateName = 'Walk';
                    else targetStateName = 'Idle';

                    // 5. GUI 상태 텍스트 갱신 (상태 변경 시에만 문자열 포맷팅하여 GC 부하 방지)
                    if (testPane) {
                        const curName = stateMachine?.currentState?.name || targetStateName;
                        const targetName = stateMachine?.targetState?.name;
                        const nextState = targetName ? `${curName} ➔ ${targetName}` : curName;
                        if (nextState !== lastDisplayState) {
                            lastDisplayState = nextState;
                            testPane.updateStateUI(nextState);
                        }
                    }
                }
            }
        });
    }
);

// ============================================================================
// 테스트 & 디버깅 Tweakpane GUI 패널 분리 정의
// ============================================================================
const renderTestPane = ({
                            redGPUContext,
                            controller,
                            grassManager,
                            landscape,
                            directionalLight,
                            directionalShadowManager
                        }) => {
    let grassFolder = null;
    let updateStateUI = null;

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        directionalShadow: true,
        ibl: false,
        skybox: false,
        gui: (pane) => {
            // 1. 조작 안내 폴더
            const helpFolder = pane.addFolder({title: '⌨️ Character Controls', expanded: false});
            const config = {
                move: 'W / A / S / D (Camera-relative)',
                run: 'Hold  Shift  to Run',
                jump: 'Space (Jump)',
                camera: 'Drag Mouse (Orbit / Zoom)',
                state: 'Idle',
            };
            helpFolder.addBinding(config, 'move', {readonly: true, label: 'Move'});
            helpFolder.addBinding(config, 'run', {readonly: true, label: 'Sprint'});
            helpFolder.addBinding(config, 'jump', {readonly: true, label: 'Jump'});
            helpFolder.addBinding(config, 'camera', {readonly: true, label: 'Camera'});

            const stateBinding = helpFolder.addBinding(config, 'state', {
                readonly: true,
                label: 'Anim State'
            });

            updateStateUI = (currentStateStr) => {
                if (config.state !== currentStateStr) {
                    config.state = currentStateStr;
                    stateBinding.refresh();
                }
            };

            // 2. 3인칭 카메라 폴더
            const camFolder = pane.addFolder({title: '📷 3rd Person Camera', expanded: false});
            camFolder.addBinding(controller, 'distance', {min: 2.0, max: 25.0, step: 0.5, label: 'Distance'});
            camFolder.addBinding(controller, 'tilt', {min: -60, max: 20, step: 1, label: 'Tilt'});

            // 3. 잔디 서브시스템 폴더
            grassFolder = pane.addFolder({title: '🌿 Grass Subsystem (GLB)', expanded: true});
            grassFolder.addBinding(grassManager, 'enabled', {label: 'Enabled'});
            grassFolder.addBinding(grassManager, 'streamingRadius', {
                min: 30,
                max: 250,
                step: 5,
                label: 'Streaming Radius (m)'
            }).on('change', () => {
                grassManager.populateInstances([controller.centerX, controller.centerY, controller.centerZ]);
            });

            // 실시간 잔디 버퍼 통계
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
            const statsFolder = grassFolder.addFolder({title: '📊 Buffer Stats', expanded: true});
            statsFolder.addBinding(grassStats, 'activeInstances', {readonly: true, label: 'Active Instances'});
            statsFolder.addBinding(grassStats, 'totalCapacity', {readonly: true, label: 'Buffer Capacity'});

            // 4. 지형 설정
            const folderTerrain = pane.addFolder({title: 'Landscape Settings', expanded: false});
            folderTerrain.addBinding(landscape, 'enableHeightmapShadow', {label: 'Shadow Raymarching'});
            folderTerrain.addBinding(landscape, 'heightmapShadowSteps', {
                min: 4,
                max: 24,
                step: 1,
                label: 'Shadow Steps'
            });
            folderTerrain.addBinding(landscape, 'receiveShadow', {label: 'Receive Shadow'});

            // 5. ☀️ 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
            const shadowFolder = pane.addFolder({title: '☀️ Sun & Shadow Settings', expanded: false});
            shadowFolder.addBinding(directionalLight, 'elevation', {
                min: 5,
                max: 85,
                step: 1,
                label: 'Sun Elevation (°)'
            });
            shadowFolder.addBinding(directionalLight, 'azimuth', {
                min: 0,
                max: 360,
                step: 1,
                label: 'Sun Azimuth (°)'
            });
            shadowFolder.addBinding(directionalLight, 'lux', {
                min: 10000,
                max: 200000,
                step: 5000,
                label: 'Sun Lux'
            });
            shadowFolder.addBinding(directionalShadowManager, 'strength', {
                min: 0.0,
                max: 1.0,
                step: 0.05,
                label: 'Shadow Strength'
            });
            shadowFolder.addBinding(directionalShadowManager, 'bias', {
                min: 0.00001,
                max: 0.002,
                step: 0.00005,
                label: 'Shadow Bias'
            });
            shadowFolder.addBinding(directionalShadowManager, 'pcssLightSize', {
                min: 0.0,
                max: 5.0,
                step: 0.1,
                label: 'Shadow Softness'
            });
            shadowFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {
                min: 30,
                max: 300,
                step: 10,
                label: 'Max Shadow Dist (m)'
            });
        }
    });

    const addTypeToUI = (type, isDefaultExpanded = false) => {
        if (!grassFolder) return;
        const typeFolder = grassFolder.addFolder({title: `${type.name}`, expanded: isDefaultExpanded});

        // 1. 스케일 및 스폰 배치 (Placement & Density)
        const placementFolder = typeFolder.addFolder({title: '🌱 Placement & Density', expanded: true});
        const baseMin = [...type.minScale];
        const baseMax = [...type.maxScale];
        const scaleState = {
            scale: 1.0,
            scaleY: 1.0
        };

        const updateScale = () => {
            type.minScale = [
                baseMin[0] * scaleState.scale,
                baseMin[1] * scaleState.scale * scaleState.scaleY,
                baseMin[2] * scaleState.scale
            ];
            type.maxScale = [
                baseMax[0] * scaleState.scale,
                baseMax[1] * scaleState.scale * scaleState.scaleY,
                baseMax[2] * scaleState.scale
            ];
        };

        placementFolder.addBinding(scaleState, 'scale', {
            min: 0.5,
            max: 4.0,
            step: 0.1,
            label: 'Scale (XZ)'
        }).on('change', updateScale);
        placementFolder.addBinding(scaleState, 'scaleY', {
            min: 0.5,
            max: 4.0,
            step: 0.1,
            label: 'Height (Y)'
        }).on('change', updateScale);
        placementFolder.addBinding(type, 'densityMultiplier', {
            min: 0.0,
            max: 3.0,
            step: 0.1,
            label: 'Density Mult'
        });
        placementFolder.addBinding(type, 'maxSlope', {min: 10.0, max: 80.0, step: 1.0, label: 'Max Slope (°)'});
        placementFolder.addBinding(type, 'minWeightThreshold', {
            min: 0.0,
            max: 0.9,
            step: 0.05,
            label: 'Min Weight'
        });
        placementFolder.addBinding(type, 'densityScaleByWeight', {label: 'Weight Modulate'});
        placementFolder.addBinding(type, 'bottomOffset', {
            min: -0.8,
            max: 0.3,
            step: 0.01,
            label: 'Bottom Offset (m)'
        });

        // 2. 머티리얼 및 라이팅 (Material & Shading)
        const matFolder = typeFolder.addFolder({title: '🎨 Material & Shading', expanded: false});
        matFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05, label: 'Ground Blend'});
        matFolder.addBinding(type, 'alphaCutoff', {min: 0.05, max: 0.9, step: 0.05, label: 'Alpha Cutoff'});
        matFolder.addBinding(type, 'exposureBoost', {min: 0.5, max: 3.5, step: 0.05, label: 'Exposure Boost'});
        matFolder.addBinding(type, 'roughness', {min: 0.04, max: 1.0, step: 0.02, label: 'Roughness'});
        matFolder.addBinding(type, 'subsurfaceStrength', {
            min: 0.0,
            max: 3.0,
            step: 0.05,
            label: 'Subsurface SSS'
        });

        // 3. LOD 및 그림자 (LOD & Shadow)
        const lodFolder = typeFolder.addFolder({title: '👁️ LOD & Shadow', expanded: false});
        lodFolder.addBinding(type, 'cullingDistance', {min: 20, max: 200, step: 5, label: 'Cull Dist (m)'});
        lodFolder.addBinding(type, 'shrinkStartDistance', {min: 10, max: 150, step: 5, label: 'Shrink Dist (m)'});
        lodFolder.addBinding(type, 'castShadow', {label: 'Cast Shadow'});
        lodFolder.addBinding(type, 'receiveShadow', {label: 'Receive Shadow'});
        lodFolder.addBinding(type, 'shadowStrength', {min: 0.0, max: 1.0, step: 0.05, label: 'Shadow Strength'});
    };

    return {
        addTypeToUI,
        updateStateUI: (state) => updateStateUI?.(state)
    };
};
