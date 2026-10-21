import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Open World Integration 예제
 * [EN] Open World Integration Example
 *
 * [KO] 타일 스트리밍 지형(Landscape), 4채널 멀티레이어 PBR 스플랫, GPU 절차적 잔디(grassManager), 다단계 메쉬 LOD 및 옥타헤드럴 임포스터 기반 수목 식생(foliageManager), 그리고 3D 캐릭터 컨트롤러를 하나로 결합한 오픈월드 통합 예제입니다.
 * [EN] Demonstrates a unified open-world environment combining tile-streaming terrain (Landscape), 4-channel multi-layer PBR splatting, GPU procedural grass (grassManager), multi-stage mesh LOD and Octahedral Impostor tree foliage (foliageManager), and a 3D character controller.
 */

const SPAWN_X = -271.5;
const SPAWN_Z = -1416.25;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        characterOrbitController.distance = 5.5;
        characterOrbitController.tilt = -12;
        characterOrbitController.pan = 35;
        characterOrbitController.speedDistance = 0.5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, characterOrbitController);
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
        landscape.nearDetailDistance = 250;
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

        layerConfigs.forEach(({name, weightChannel, uvScale, roughness}) => {
            const key = name.toLowerCase();
            landscape.addLayer({
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

        characterOrbitController.centerX = SPAWN_X;
        characterOrbitController.centerY = landscape.getHeightAt(SPAWN_X, SPAWN_Z) + 1.2;
        characterOrbitController.centerZ = SPAWN_Z;

        const character = initCharacter(redGPUContext, scene, landscape, characterOrbitController);

        // [KO] 지형에 내장된 절차적 잔디 매니저(grassManager) 및 수목 식생 매니저(foliageManager) 참조 획득
        // [EN] Acquire references to the terrain's built-in procedural grass manager (grassManager) and foliage manager (foliageManager)
        const grassManager = landscape.grassManager;
        const foliageManager = landscape.foliageManager;

        // [KO] 1. 절차적 잔디(grass.glb) 로드 및 등록
        // [EN] 1. Load and register procedural grass (grass.glb)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/grass.glb',
            (loader) => {
                grassManager.addType({
                    name: 'Lawn Clump',
                    mesh: loader.resultMesh,
                    densityPerHectare: 20000,
                    targetLayer: 'Grass',
                    cullingDistance: 110,
                    minScale: [12.0, 8.0, 12.0],
                    maxScale: [18.0, 12.0, 18.0]
                });
            }
        );

        // [KO] 2. 다단계 LOD 수목 식생(test.glb) 로드 및 등록
        // [EN] 2. Load and register multi-stage LOD tree foliage (test.glb)
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
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

                    const lodConfigs = [{mesh: lod0, lodDistance: 50}];
                    if (lods.lod1 && lods.lod1 !== lod0) {
                        lodConfigs.push({mesh: lods.lod1, lodDistance: 100});
                    }
                    if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                        lodConfigs.push({mesh: lods.lod2, lodDistance: 180});
                    }

                    foliageManager.addType({
                        name: `Tree_${baseName}`,
                        lods: lodConfigs,
                        densityPerHectare: 120,
                        minScale: [0.4, 0.4, 0.4],
                        maxScale: [0.7, 0.75, 0.7],
                        cullingDistance: 4000,
                        targetLayer: 'Grass',
                    });
                });
            }
        );

        new RedGPUExampleHelper(redGPUContext);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            character.update(view, time);
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const initCharacter = (redGPUContext, scene, landscape, characterOrbitController) => {
    let characterMesh = null;
    let characterController = null;
    let targetState = 'Idle';

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
                    useKeyboard: true,
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
        update: (view, time) => {
            if (!characterMesh || !characterController) return;
            characterController.update(view, time);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;

            if (characterController.isRunning) targetState = 'Run';
            else if (characterController.isMoving) targetState = 'Walk';
            else targetState = 'Idle';
        }
    };
};
