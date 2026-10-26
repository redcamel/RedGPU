import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Multi-Layer Splatting 예제
 * [EN] Multi-Layer Splatting Example
 *
 * [KO] RGBA 4채널 스플랫맵 가중치(weightTexture, weightChannel)를 기반으로 4종의 PBR 재질 레이어를 등록(addLayer)하고 스토캐스틱 타일링과 높이 블렌딩을 제어하는 예제입니다.
 * [EN] Demonstrates registering (addLayer) and blending 4 PBR material layers driven by RGBA splatmap weights (weightTexture, weightChannel) with stochastic tiling and height blending.
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
        directionalLight.azimuth = 135;
        scene.lightManager.addDirectionalLight(directionalLight);

        const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
        landscape.heightScale = 300;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // [KO] 지형 전체에 걸쳐 각 레이어의 혼합 비율을 정의하는 RGBA 4채널 스플랫 가중치 맵(weightTexture)과 레이어 텍스처 경로
        // [EN] RGBA 4-channel splat weight map (weightTexture) defining the blend ratio of each layer across the terrain and the layer texture directory path
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexture = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';

        // [KO] 스플랫맵의 R/G/B/A 각 채널(weightChannel)에 매핑할 4종 PBR 재질 레이어의 타일링 배율(uvScale) 및 거칠기(roughness) 정의
        // [EN] Define tiling scale (uvScale) and roughness for 4 PBR material layers mapped to each R/G/B/A channel (weightChannel) of the splatmap
        // [KO] 0번 레이어(Grass)는 가중치 합이 0인 구역의 기본 바탕(Base Fallback) 레이어를 겸하며, 상위 레이어들은 채널 가중치와 높이 맵(Height Blend)을 기반으로 합성됩니다.
        // [EN] Layer 0 (Grass) also serves as the base fallback layer for zero-weight areas, while upper layers blend based on channel weights and height-modulated blending.
        const layerConfigs = [
            {name: 'Grass', weightChannel: 'R', uvScale: [25, 25], roughness: 0.85},
            {name: 'Rock', weightChannel: 'G', uvScale: [7.5, 7.5], roughness: 0.7},
            {name: 'Gravel', weightChannel: 'B', uvScale: [20, 20], roughness: 0.9},
            {name: 'Leave', weightChannel: 'A', uvScale: [25, 25], roughness: 0.8}
        ];

        // [KO] landscape.addLayer()를 통해 각 레이어의 PBR 텍스처 세트(baseColor, normal, orm)와 스플랫 가중치 채널을 등록합니다.
        // [EN] Register each layer's PBR texture set (baseColor, normal, orm) and splat weight channel via landscape.addLayer().
        // [KO] 등록된 레이어들은 카메라 근경(nearDetailDistance 이내)에서는 스토캐스틱 타일링 및 높이 블렌딩으로 실시간 합성되고, 원경에서는 VBT(가상 블렌드 텍스처) 아틀라스로 베이크되어 렌더링됩니다.
        // [EN] Registered layers are composited in real time with stochastic tiling and height blending within nearDetailDistance, and baked into VBT (Virtual Blend Texture) atlases for distant rendering.
        const layers = layerConfigs.map(({name, weightChannel, uvScale, roughness}) => {
            const key = name.toLowerCase();
            return landscape.addLayer({
                name,
                // [KO] 표면 기본 색상(Albedo) 텍스처
                // [EN] Surface base color (Albedo) texture
                baseColorTexture: `${assetPath}${key}.jpg`,
                // [KO] 탄젠트 공간 디테일 노멀 맵 텍스처 (지형 매크로 노멀과 합성)
                // [EN] Tangent-space detail normal map texture (perturbed over macro terrain normal)
                normalTexture: `${assetPath}${key}_normal.jpg`,
                // [KO] 채널 패킹된 ORM 텍스처 (R: Ambient Occlusion, G: Roughness, B: Metallic, A: Height)
                // [EN] Channel-packed ORM texture (R: Ambient Occlusion, G: Roughness, B: Metallic, A: Height)
                ormTexture: `${assetPath}${key}_orm.jpg`,
                // [KO] 스플랫 가중치 텍스처 및 참조할 색상 채널('R' | 'G' | 'B' | 'A')
                // [EN] Splat weight texture and target color channel ('R' | 'G' | 'B' | 'A')
                weightTexture,
                weightChannel,
                // [KO] 타일 당 텍스처 반복 횟수 [u, v] 및 표면 거칠기 계수
                // [EN] Texture repetition count per tile [u, v] and surface roughness factor
                uvScale,
                roughness
            });
        });

        scene.landscape = landscape;

        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
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
                            directionalLight,
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

            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: true});
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

            const splatFolder = pane.addFolder({title: 'Layers', expanded: true});
            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: layer.name === 'Grass'});
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
