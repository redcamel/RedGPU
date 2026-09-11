import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5.5;
        controller.tilt = -12;
        controller.pan = 0;
        controller.minDistance = 2.0;
        controller.maxDistance = 25.0;
        controller.centerX = -120;
        controller.centerY = 205;
        controller.centerZ = 120;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 1. IBL & SkyBox
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

        // 2. 태양광 (Directional Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 55;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3. 지형 (Landscape)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 300;
        landscape.maxLODLevel = 5;
        landscape.lod0SizeQuads = RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_256;
        landscape.loadingRadius = 3000;

        landscape.baseColor.setColorByHEX('#2f6834');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const foliageManager = landscape.foliageManager;

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
                uvScale: [300, 300],
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
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
                const root = loader.resultMesh;
                console.log('🌲 [test.glb] Loaded Root:', root);
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

                console.log(`🌲 [test.glb] Discovered ${treeGroups.size} tree variants:`, Array.from(treeGroups.keys()));

                if (treeGroups.size > 0) {
                    console.log('treeGroups', treeGroups);
                    treeGroups.forEach((lods, baseName) => {
                        const lodConfigs = [];
                        const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                        if (!lod0) return;

                        lodConfigs.push({mesh: lod0, lodDistance: 50, receiveShadow: true});
                        if (lods.lod1 && lods.lod1 !== lod0) lodConfigs.push({
                            mesh: lods.lod1,
                            lodDistance: 100,
                            receiveShadow: true
                        });
                        if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) lodConfigs.push({
                            mesh: lods.lod2,
                            lodDistance: 180,
                            receiveShadow: false // 100m 밖 로우폴리는 CSM 샘플링 스킵하여 프레임 최적화
                        });

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
            }
        );
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

        // 4. 잔디 서브시스템 (LandscapeGrassManager) 설정
        const grassManager = landscape.grassManager;
        grassManager.enabled = true;
        grassManager.streamingRadius = 120;

        // 5. 그림자 설정 (3인칭 캐릭터 시점에 최적화된 근거리 고해상도 CSM)
        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 150;
        directionalShadowManager.shadowDepthTextureSize = 2048;
        directionalShadowManager.strength = 0.95;
        directionalShadowManager.bias = 0.00015;
        directionalShadowManager.pcssLightSize = 1.2;

        // 6. Tweakpane 설정 패널 구성 헬퍼
        let grassFolder = null;
        let updateStateUI = null;

        new RedGPUExampleHelper(redGPUContext, {
            RedGPU,
            directionalShadow: true,
            ibl: false,
            skybox: false,
            gui: (pane) => {
                // 조작 안내 폴더
                const helpFolder = pane.addFolder({title: '⌨️ Character Controls', expanded: true});
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

                // 3인칭 카메라 폴더
                const camFolder = pane.addFolder({title: '📷 3rd Person Camera', expanded: false});
                camFolder.addBinding(controller, 'distance', {min: 2.0, max: 25.0, step: 0.5, label: 'Distance'});
                camFolder.addBinding(controller, 'tilt', {min: -60, max: 20, step: 1, label: 'Tilt'});

                // 잔디 서브시스템 폴더
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

                // 지형 설정
                const folderTerrain = pane.addFolder({title: 'Landscape Settings', expanded: false});
                folderTerrain.addBinding(landscape, 'enableHeightmapShadow', {label: 'Shadow Raymarching'});
                folderTerrain.addBinding(landscape, 'heightmapShadowSteps', {
                    min: 4,
                    max: 24,
                    step: 1,
                    label: 'Shadow Steps'
                });
                folderTerrain.addBinding(landscape, 'receiveShadow', {label: 'Receive Shadow'});
            }
        });

        // 7. 잔디 모델 로딩 헬퍼 함수
        const addTypeToUI = (type) => {
            if (!grassFolder) return;
            const typeFolder = grassFolder.addFolder({title: `${type.name}`, expanded: true});

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

            typeFolder.addBinding(scaleState, 'scale', {
                min: 0.5,
                max: 4.0,
                step: 0.1,
                label: 'Grass Scale'
            }).on('change', updateScale);
            typeFolder.addBinding(scaleState, 'scaleY', {
                min: 0.5,
                max: 4.0,
                step: 0.1,
                label: 'Height Scale'
            }).on('change', updateScale);
            typeFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1, label: 'Density Mult'});
            typeFolder.addBinding(type, 'maxSlope', {min: 10.0, max: 80.0, step: 1.0, label: 'Max Slope (°)'});
            typeFolder.addBinding(type, 'minWeightThreshold', {min: 0.0, max: 0.9, step: 0.05, label: 'Min Weight'});
            typeFolder.addBinding(type, 'densityScaleByWeight', {label: 'Weight Modulate'});

            typeFolder.addBinding(type, 'castShadow', {label: 'Cast Shadow'});
            typeFolder.addBinding(type, 'receiveShadow', {label: 'Receive Shadow'});
            typeFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05, label: 'Ground Blend'});
            typeFolder.addBinding(type, 'alphaCutoff', {min: 0.05, max: 0.9, step: 0.05, label: 'Alpha Cutoff'});
            typeFolder.addBinding(type, 'exposureBoost', {min: 0.5, max: 3.5, step: 0.05, label: 'Exposure Boost'});
            typeFolder.addBinding(type, 'roughness', {min: 0.04, max: 1.0, step: 0.02, label: 'Roughness'});
            typeFolder.addBinding(type, 'subsurfaceStrength', {
                min: 0.0,
                max: 3.0,
                step: 0.05,
                label: 'Subsurface Light'
            });
            typeFolder.addBinding(type, 'bottomOffset', {min: -0.8, max: 0.3, step: 0.01, label: 'Bottom Offset (m)'});
            typeFolder.addBinding(type, 'cullingDistance', {min: 20, max: 200, step: 5, label: 'Cull Dist (m)'});
            typeFolder.addBinding(type, 'shrinkStartDistance', {min: 10, max: 150, step: 5, label: 'Shrink Dist (m)'});
        };

        // 8. 🌿 [Layer 1] 기본 뗏장 덤불 잔디 (grass.glb - 바닥을 빽빽하고 푸르게 메워주는 Base Clump)
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
                        densityMultiplier: 1.0,
                        targetLayer: 'Grass',
                        minWeightThreshold: 0.02,
                        densityScaleByWeight: true,
                        minSlope: 0.0,
                        maxSlope: 35.0,
                        cullingDistance: 110,
                        fadeStartDistance: 95,
                        shrinkStartDistance: 80,
                        minScale: [10.0, 9.0, 10.0],
                        maxScale: [15.0, 13.0, 15.0],
                        groundBlendStrength: 0.55,
                        roughness: 0.55,
                        subsurfaceStrength: 1.40,
                        exposureBoost: 1,
                        receiveShadow: true,
                        bottomOffset: -0.45
                    });

                    grassManager.addGrassType(baseClumpType);
                    addTypeToUI(baseClumpType);
                    grassManager.populateInstances([controller.centerX, controller.centerY, controller.centerZ]);
                    console.log('🌿 [Layer 1] Base Ground Clump registered successfully.');
                }
            }
        );

        // 9. 🌾 [Layer 2] 키 큰 야생 들풀 3종 (grassList.glb - 덤불 위로 살랑살랑 피어나는 Tall Grass 포인트)
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
                        densityMultiplier: 1.0,
                        targetLayer: 'Grass',
                        minWeightThreshold: 0.02,
                        densityScaleByWeight: true,
                        minSlope: 0.0,
                        maxSlope: 35.0,
                        cullingDistance: 110,
                        fadeStartDistance: 95,
                        shrinkStartDistance: 80,
                        minScale: [8.0, 11.0, 8.0],
                        maxScale: [13.0, 17.0, 13.0],
                        groundBlendStrength: 0.45,
                        roughness: 0.55,
                        subsurfaceStrength: 1.50,
                        exposureBoost: 1,
                        receiveShadow: true,
                        bottomOffset: -0.55
                    });

                    grassManager.addGrassType(grassType);
                    addTypeToUI(grassType);
                });

                grassManager.populateInstances([controller.centerX, controller.centerY, controller.centerZ]);
                console.log('🌾 [Layer 2] Tall Grass variants registered successfully.');
            }
        );

        // 10. 🚶 3D 캐릭터 로드 및 애니메이션 상태 머신 (Soldier.glb)
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

        // 11. 렌더 루프 및 실시간 캐릭터-지형 상호작용
        let initialSnapped = false;
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

                    // 5. GUI 상태 텍스트 갱신
                    if (updateStateUI) {
                        const nextState = stateMachine?.targetState
                            ? `${stateMachine.currentState.name} ➔ ${stateMachine.targetState.name}`
                            : (stateMachine?.currentState?.name || targetStateName);
                        updateStateUI(nextState);
                    }
                }
            }
        });
    }
);
