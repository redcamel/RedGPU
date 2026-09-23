import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 6: Open World Integration (오픈월드 통합 및 캐릭터 인터랙션)
 * [EN] Step 6: Open World Integration (Open World Integration & Character Interaction)
 *
 * [KO] 16km 타일 스트리밍 지형, 멀티레이어 PBR 스플랫, 절차적 잔디, 수목 임포스터와 물리 기반 3D 캐릭터(Soldier)를 유기적으로 결합한 완성형 오픈월드 시뮬레이션입니다.
 *      • 캐릭터 조작: WASD(이동), Shift(달리기), Space(점프)로 캐릭터를 움직여 지형 굴곡에 맞춘 실시간 높이 동기화(getHeightAt)를 체험하세요.
 *      • 3인칭 추적 카메라: 마우스 우클릭 드래그로 캐릭터를 중심으로 360도 궤도 시점을 회전하며 광활한 필드를 감상하세요.
 * [EN] A complete open-world integration simulation uniting 16km tiled terrain, multi-layer PBR splatting, procedural grass, foliage impostors, and a 3D character controller (Soldier).
 *      • Character Controls: Use WASD (move), Shift (run), and Space (jump) to experience dynamic ground alignment (getHeightAt).
 *      • Third-Person Orbit: Orbit around the character with mouse drag to view the seamless 16km open world.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 3인칭 추적 궤도 회전 카메라 + 자유 비행 카메라 준비)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 5.5;
        orbitController.tilt = -12;
        orbitController.minDistance = 2.0;
        orbitController.maxDistance = 30.0;
        orbitController.speedDistance = 0.5;
        orbitController.centerX = -120;
        orbitController.centerY = 205;
        orbitController.centerZ = 120;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = -120;
        freeController.y = 208;
        freeController.z = 125;
        freeController.tilt = -12;
        freeController.moveSpeed = 15.0;

        // 2. 씬 및 뷰3D 생성 (기본: 3인칭 추적 카메라)
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

        // 4. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 40;
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
        landscape.loadingRadius = 3000;
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
        const weightTexturePath = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';

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
                weightTexture: weightTexturePath,
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

        // 7. 절차적 잔디 서브시스템 (LandscapeGrassManager) 설정
        const grassManager = landscape.grassManager;
        grassManager.enabled = true;
        grassManager.streamingRadius = 120;

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
                        densityPerHectare: 20000,
                        targetLayer: 'Grass',
                        minWeightThreshold: 0.02,
                        cullingDistance: 110,
                        minScale: [7.0, 4.5, 7.0],
                        maxScale: [11.0, 6.5, 11.0],
                        groundBlendStrength: 1.0,
                        subsurfaceStrength: 0.40,
                        exposureBoost: 1.0,
                        bottomOffset: -0.25
                    });
                    grassManager.addGrassType(baseClumpType);
                }
            }
        );

        // 8. 수목 식생 서브시스템 (LandscapeFoliageManager) 설정
        const foliageManager = landscape.foliageManager;
        foliageManager.subCellSize = 100;
        foliageManager.streamingRadius = 600;

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

                    foliageManager.addFoliageType({
                        name: `Tree_${baseName}`,
                        type: RedGPU.Display.Landscape.FOLIAGE_TYPE.FOLIAGE,
                        lods: lodConfigs,
                        densityPerHectare: 90.0,
                        densityMultiplier: 1.0,
                        minWeightThreshold: 0.02,
                        minScale: [0.4, 0.4, 0.4],
                        maxScale: [0.7, 0.75, 0.7],
                        randomRotationY: true,
                        useImpostor: true,
                        cullingDistance: 5000,
                        fadeStartDistance: 3500,
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

        // 9. 3D 캐릭터 로드 및 애니메이션 상태 머신 (Soldier.glb)
        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        const CHARACTER_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            CHARACTER_URL,
            (loader) => {
                characterMesh = loader.resultMesh;
                characterMesh.x = -120;
                characterMesh.z = 120;
                const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
                characterMesh.y = (startH > 0 ? startH : 200);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                orbitController.centerX = characterMesh.x;
                orbitController.centerY = characterMesh.y + 1.2;
                orbitController.centerZ = characterMesh.z;

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
                        floorOffset: 0.0,
                        getFloorHeight: (x, z) => landscape.getHeightAt(x, z),
                    }
                );

                if (guiCallbacks?.bindCharacter) {
                    guiCallbacks.bindCharacter(characterController);
                }

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
            }
        );

        // 10. GUI 컨트롤 패널 생성
        const guiCallbacks = renderTestPane({
            redGPUContext,
            view,
            freeController,
            orbitController,
            landscape,
            directionalLight,
            directionalShadowManager,
            grassManager,
            foliageManager,
            layers
        });

        // 11. 렌더 루프 및 실시간 캐릭터-지형 상호작용
        let initialSnapped = false;
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (timestamp) => {
            if (characterMesh && characterController) {
                const dt = lastTime !== null ? timestamp - lastTime : 0;
                lastTime = timestamp;

                if (dt > 0) {
                    characterController.update(view, timestamp);

                    if (!initialSnapped) {
                        const h = characterController.floorHeight;
                        if (h > 0) {
                            characterMesh.y = h;
                            initialSnapped = true;
                        }
                    }

                    // 3인칭 궤도 카메라 추종
                    if (view.camera === orbitController) {
                        orbitController.centerX = characterMesh.x;
                        orbitController.centerY = characterMesh.y + 1.2;
                        orbitController.centerZ = characterMesh.z;
                    }

                    // 애니메이션 상태 전이 판단
                    if (characterController.isRunning) targetStateName = 'Run';
                    else if (characterController.isMoving) targetStateName = 'Walk';
                    else targetStateName = 'Idle';
                }
            }
        });
    },
    (error) => {
        console.error('RedGPU 초기화 실패:', error);
    }
);

/**
 * [KO] Tweakpane GUI를 구성하여 카메라, 캐릭터 물리, 잔디/수목 식생, 지형 및 광원을 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera, character physics, grass/foliage, terrain, and lighting.
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
                            foliageManager,
                            layers
                        }) {
    const params = {
        cameraMode: 'Orbit'
    };

    let paneInstance = null;

    const resetCamera = () => {
        if (params.cameraMode === 'Free Flight') {
            freeController.x = -120;
            freeController.y = 208;
            freeController.z = 125;
            freeController.tilt = -12;
            freeController.pan = 0;
        } else {
            orbitController.distance = 5.5;
            orbitController.tilt = -12;
            orbitController.pan = 0;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            paneInstance = pane;

            // 1. 카메라 폴더
            const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});

            const cameraModeBinding = cameraFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Orbit': 'Orbit',
                    'Free Flight': 'Free Flight'
                }
            });

            cameraFolder.addBinding(orbitController, 'distance', {min: 2.0, max: 25.0, step: 0.5});
            cameraFolder.addBinding(orbitController, 'tilt', {min: -60, max: 20, step: 1});

            const freeSpeedBinding = cameraFolder.addBinding(freeController, 'moveSpeed', {
                min: 2.0,
                max: 50.0,
                step: 1.0
            });
            freeSpeedBinding.hidden = true;

            cameraModeBinding.on('change', (ev) => {
                const isFree = ev.value === 'Free Flight';
                view.camera = isFree ? freeController : orbitController;
                freeSpeedBinding.hidden = !isFree;
            });

            cameraFolder.addButton({title: 'Reset Camera'}).on('click', resetCamera);

            // 2. 절차적 잔디 및 수목 폴더
            const grassFolder = pane.addFolder({title: 'Grass', expanded: false});
            grassFolder.addBinding(grassManager, 'enabled');
            grassFolder.addBinding(grassManager, 'streamingRadius', {min: 30, max: 250, step: 5});

            const foliageFolder = pane.addFolder({title: 'Foliage', expanded: false});
            foliageFolder.addBinding(foliageManager, 'streamingRadius', {min: 200, max: 1500, step: 50});

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
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 30, max: 300, step: 10});

            // 5. 스플랫 레이어 폴더
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});
                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 4, step: 0.1});
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });

    const bindCharacter = (cc) => {
        if (!paneInstance || !cc) return;
        const charFolder = paneInstance.addFolder({title: 'Character', expanded: true});
        charFolder.addBinding(cc, 'floorOffset', {min: -0.1, max: 0.3, step: 0.01});
        charFolder.addBinding(cc, 'speed', {min: 1.0, max: 10.0, step: 0.5});
        charFolder.addBinding(cc, 'runSpeed', {min: 2.0, max: 20.0, step: 0.5});
        charFolder.addBinding(cc, 'jumpForce', {min: 2.0, max: 15.0, step: 0.5});
        charFolder.addBinding(cc, 'gravity', {min: 5.0, max: 50.0, step: 1.0});
    };

    return {
        bindCharacter
    };
}
