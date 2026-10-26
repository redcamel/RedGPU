import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Landscape & Water 예제
 * [EN] Landscape & Water Example
 *
 * [KO] 타일 스트리밍 지형(Landscape)의 계곡 분지와 호수 수체(Lake)를 결합하여 수위 조절, 듀얼 노멀 물결, 수중 굴절·코스틱스 및 캐릭터 보행 파동(Ripple) 상호작용을 시연하는 예제입니다.
 * [EN] Demonstrates combining tile-streaming terrain (Landscape) valleys with a Lake water body, featuring water level control, dual-normal waves, underwater refraction/caustics, and character walking ripple interactions.
 */

const SPAWN_X = -271.5;
const SPAWN_Z = -1416.25;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = SPAWN_X;
        orbitController.centerY = 139.2;
        orbitController.centerZ = SPAWN_Z;
        orbitController.distance = 600;
        orbitController.minDistance = 10;
        orbitController.maxDistance = 6000;
        orbitController.tilt = -22;
        orbitController.pan = 35;
        orbitController.speedDistance = 15;

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

        // [KO] 지형 분지 수역에 호수(Lake) 수체 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body in the terrain basin and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 1500, 1500, 96, 96);
        lake.x = SPAWN_X;
        lake.z = SPAWN_Z;
        lake.y = 139.2;
        lake.material.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.material.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            lake,
            directionalLight,
            layers
        });

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
                            lake,
                            directionalLight,
                            layers
                        }) => {
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 6.5;
    characterOrbitController.tilt = -15;
    characterOrbitController.pan = 35;
    characterOrbitController.speedDistance = 0.5;
    characterOrbitController.centerX = SPAWN_X;
    characterOrbitController.centerY = landscape.getHeightAt(SPAWN_X, SPAWN_Z) + 1.2;
    characterOrbitController.centerZ = SPAWN_Z;

    const character = initCharacter(redGPUContext, scene, landscape, lake, characterOrbitController);

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

            const lakeFolder = pane.addFolder({title: 'Lake', expanded: true});
            lakeFolder.addBinding(lake, 'y', {min: 135.0, max: 150.0, step: 0.1});
            lakeFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.3, step: 0.005});
            lakeFolder.addBinding(lake, 'waveWavelength', {min: 2.0, max: 40.0, step: 0.5});
            lakeFolder.addBinding(lake, 'interactionEnabled');
            lakeFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});

            const materialFolder = lakeFolder.addFolder({title: 'material', expanded: true});
            materialFolder.addBinding(lake.material, 'flowRateScale', {min: 0.0, max: 0.1, step: 0.002});
            materialFolder.addBinding(lake.material, 'refractionStrength', {min: 0.0, max: 1.0, step: 0.02});
            materialFolder.addBinding(lake.material, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            materialFolder.addBinding(lake.material, 'causticsScale', {min: 0.1, max: 5.0, step: 0.1});
            materialFolder.addBinding(lake.material, 'depthFadeDistance', {min: 0.1, max: 10.0, step: 0.1});
            materialFolder.addBinding(lake.material, 'extinctionFactor', {min: 0.01, max: 1.0, step: 0.01});
            materialFolder.addBinding(lake.material, 'turbidity', {min: 0.0, max: 1.0, step: 0.02});
            materialFolder.addBinding(lake.material, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            materialFolder.addBinding(lake.material, 'normalScale', {min: 0.0, max: 1.0, step: 0.05});
            materialFolder.addBinding(lake.material, 'normalDetailScale', {min: 0.0, max: 1.0, step: 0.05});
            materialFolder.addBinding(lake.material, 'enableSSR');

            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 600, step: 5});
            landscapeFolder.addBinding(landscape, 'receiveShadow');
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 1500, step: 10});

            const lightFolder = pane.addFolder({title: 'Light', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});
                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });

    return {
        update: (time) => character.update(view, time)
    };
};

const initCharacter = (redGPUContext, scene, landscape, lake, characterOrbitController) => {
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

            // [KO] 캐릭터 메시의 수체 상호작용을 활성화하고 호수의 파동 추적 타겟으로 등록
            // [EN] Enable water interaction on the character mesh and register it as the lake's ripple follow target
            characterMesh.enableWaterInteraction = true;
            lake.interactionFollowTarget = characterMesh;

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
