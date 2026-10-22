import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Tile Streaming & Continuous LOD 예제
 * [EN] Tile Streaming & Continuous LOD Example
 *
 * [KO] 대규모 지형을 16x16(256개) 타일로 분할하여 카메라 이동에 따라 16비트 고해상도 하이트맵 타일을 실시간 비동기 스트리밍(tileUrlResolver, tileLoadingRadius)하고 가상 텍스처 아틀라스(VHT/VNT/VBT) 및 연속 LOD를 제어하는 예제입니다.
 * [EN] Demonstrates partitioning a large-scale terrain into 16x16 (256) tiles, streaming 16-bit high-resolution heightmap tiles asynchronously based on camera proximity (tileUrlResolver, tileLoadingRadius), and controlling virtual texture atlases (VHT/VNT/VBT) and continuous LOD.
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

        // [KO] 미로드 원거리 영역의 기본 윤곽(Macro Base)을 담당하는 저해상도 글로벌 하이트맵과 카메라 기준 고해상도 타일 로딩 반경 설정
        // [EN] Configure the low-resolution global heightmap for unloaded distant regions (Macro Base) and the camera-based high-resolution tile loading radius
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        landscape.tileLoadingRadius = 1250;

        // [KO] 16x16(256개) 그리드 좌표(row: 0~15, col: 0~15)에 대응하는 16비트 PNG 하이트맵 타일 URL 해석 콜백 등록
        // [EN] Register the callback that resolves 16-bit PNG heightmap tile URLs for each 16x16 (256) grid coordinate (row: 0–15, col: 0–15)
        // [KO] 카메라가 tileLoadingRadius 반경에 진입할 때 필요한 타일만 온디맨드로 비동기 로드하여 VHT/VNT 아틀라스 슬롯에 부분 베이크합니다.
        // [EN] Streams required tiles asynchronously on-demand when the camera enters tileLoadingRadius and partially bakes them into VHT/VNT atlas slots.
        landscape.tileUrlResolver = (row, col) => {
            const host = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const r = String(row).padStart(2, '0');
            const c = String(col).padStart(2, '0');

            // [KO] 전체 하이트맵(8129x8129)을 512 단위로 분할할 때 마지막 경계 행/열(row=15, col=15)의 잔여 해상도(449) 파일명을 매핑하며, 로드 시 타일 규격(512x512)으로 자동 리샘플링됩니다.
            // [EN] Maps the remaining edge resolution (449) filenames on the last row/column (row=15, col=15) of the 8129x8129 source heightmap; the engine automatically resamples edge tiles to 512x512 upon load.
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

            const streamFolder = landscapeFolder.addFolder({title: 'Tile Streaming', expanded: true});
            streamFolder.addBinding(landscape, 'tileLoadedCount', {readonly: true, interval: 200});
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
