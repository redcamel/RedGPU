import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 3: Tile Streaming & Continuous LOD (대규모 타일 스트리밍 및 연속 LOD)
 * [EN] Step 3: Tile Streaming & Continuous LOD (Large-Scale Tile Streaming & Continuous LOD)
 *
 * [KO] 16km x 16km 대규모 지형을 256개 타일 그리드로 분할하여, 카메라 위치에 따라 16비트 고해상도 타일을 실시간 비동기 스트리밍 로딩/언로딩하는 대규모 최적화 예제입니다.
 *      • 공간 분할 미니맵: 좌측 하단의 Spatial Grid 디버거에서 카메라 이동에 따른 실시간 타일 로딩/언로딩 반경을 관찰하세요.
 *      • 스트리밍 반경 조절: Streaming 폴더의 loadingRadius와 maxLoadsPerFrame을 조절하여 프레임 드랍 없는 비동기 로딩 성능을 체감해보세요.
 * [EN] Large-scale terrain optimization dividing a 16km x 16km world into 256 tiles, asynchronously streaming 16-bit tiles based on camera position.
 *      • Spatial Grid Minimap: Watch dynamic tile streaming and unloading around the camera via the bottom-left Spatial Grid mini-map.
 *      • Streaming Tuning: Adjust loadingRadius and maxLoadsPerFrame to fine-tune asynchronous background loading.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 전체 궤도 회전 카메라 + 자유 비행 카메라 준비)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 7000;
        orbitController.tilt = -25;
        orbitController.pan = 40;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 35000;
        orbitController.speedDistance = 80.0;

        const freeController = new RedGPU.Camera.FreeController(redGPUContext);
        freeController.x = 0;
        freeController.y = 1200;
        freeController.z = 2500;
        freeController.tilt = -18;
        freeController.pan = 0;
        freeController.moveSpeed = 5000;

        // 2. 씬 및 뷰3D 생성 (기본: 전체 궤도 회전 카메라)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 (DirectionalLight) 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 5. 16km x 16km 대규모 랜드스케이프 지형 및 256개 타일 스트리머 구성
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.heightScale = 1500;
        landscape.loadingRadius = 2500.0;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 256개 분할 16-bit 타일 스트리밍 경로 해석기 (URL Resolver)
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

        // 타일 스트리밍 공간 분할 그리드 미니맵 활성화
        landscape.debuggerManager.spatialGrid = true;

        scene.addLandscape(landscape);

        // [KO] GUI 패널 및 인터랙션(카메라 모드, 캐릭터) 초기화
        // [EN] Initialize GUI panel and interactions (camera modes, character)
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            freeController,
            landscape,
            directionalLight,
            layers
        });

        // [KO] 렌더 루프 시작
        // [EN] Start render loop
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
 * [KO] GUI 컨트롤 패널 및 테스트 인터랙션(카메라 모드, 캐릭터 연동, 스플랫 레이어)을 구성합니다.
 * [EN] Sets up GUI control panel and test interactions (camera modes, character sync, splat layers).
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            freeController,
                            landscape,
                            directionalLight,
                            layers
                        }) {
    // [KO] 캐릭터 추종 궤도 카메라 (Character)
    // [EN] Character orbit follow camera
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 5.5;
    characterOrbitController.tilt = -12;
    characterOrbitController.pan = 35;
    characterOrbitController.speedDistance = 0.5;

    // [KO] 기본 카메라를 캐릭터 시점으로 설정
    // [EN] Set default camera to character follow view
    view.camera = characterOrbitController;

    // [KO] 캐릭터 상태 관리
    // [EN] Character state management
    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Character',
        baseColor: landscape.baseColor.hex,
        lodMetric: landscape.lodMetric
    };

    // [KO] 3D 캐릭터 로딩 및 바인딩
    // [EN] Load and bind 3D character
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

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] Controller 설정 (토글 버튼 방식)
            // [EN] Controller settings (Toggle button style)
            const controllerFolder = pane.addFolder({title: 'Controller', expanded: true});

            const cameraModeBinding = controllerFolder.addBinding(params, 'cameraMode', {
                view: 'radiogrid',
                groupName: 'cameraMode',
                size: [3, 1],
                cells: (x, y) => {
                    const modes = ['Character', 'Orbit', 'Free Flight'];
                    return {
                        title: modes[x],
                        value: modes[x]
                    };
                }
            });

            const speedBinding = controllerFolder.addBinding(freeController, 'moveSpeed', {
                min: 1000,
                max: 15000,
                step: 200
            });
            speedBinding.hidden = true;

            const zoomSpeedBinding = controllerFolder.addBinding(orbitController, 'speedDistance', {
                min: 10,
                max: 300,
                step: 10
            });
            zoomSpeedBinding.hidden = true;

            cameraModeBinding.on('change', (ev) => {
                const mode = ev.value;

                if (mode === 'Character') {
                    view.camera = characterOrbitController;
                    if (characterController) characterController.useKeyboard = true;
                    if (characterMesh) {
                        characterOrbitController.centerX = characterMesh.x;
                        characterOrbitController.centerY = characterMesh.y + 1.2;
                        characterOrbitController.centerZ = characterMesh.z;
                    }
                    speedBinding.hidden = true;
                    zoomSpeedBinding.hidden = true;
                } else if (mode === 'Orbit') {
                    view.camera = orbitController;
                    if (characterController) characterController.useKeyboard = false;
                    speedBinding.hidden = true;
                    zoomSpeedBinding.hidden = false;
                } else if (mode === 'Free Flight') {
                    view.camera = freeController;
                    if (characterController) characterController.useKeyboard = false;
                    speedBinding.hidden = false;
                    zoomSpeedBinding.hidden = true;
                }
            });

            // [KO] Landscape 설정
            // [EN] Landscape settings
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});

            landscapeFolder.addBinding(params, 'baseColor')
                .on('change', (ev) => {
                    landscape.baseColor.setColorByHEX(ev.value);
                });

            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 2500, step: 20});
            landscapeFolder.addBinding(landscape, 'receiveShadow');

            // [KO] Streaming 설정 (타일 스트리밍 전용)
            // [EN] Streaming settings (Tile streaming controls)
            const streamFolder = landscapeFolder.addFolder({title: 'Streaming', expanded: false});
            streamFolder.addBinding(landscape, 'loadingRadius', {min: 1000, max: 8000, step: 250});
            streamFolder.addBinding(landscape, 'maxLoadsPerFrame', {min: 1, max: 5, step: 1});
            streamFolder.addBinding(landscape.debuggerManager, 'spatialGrid');

            // [KO] LOD 설정
            // [EN] LOD settings
            const lodFolder = landscapeFolder.addFolder({title: 'LOD', expanded: false});
            lodFolder.addBinding(params, 'lodMetric', {
                options: {
                    'screenSize': 'screenSize',
                    'distance': 'distance'
                }
            }).on('change', (ev) => {
                landscape.lodMetric = ev.value;
            });
            lodFolder.addBinding(landscape, 'lodGeomorphStartRatio', {
                min: 0.0,
                max: 0.99,
                step: 0.01
            });
            lodFolder.addBinding(landscape, 'lodFadeStartRatio', {
                min: 0.0,
                max: 0.99,
                step: 0.01
            });
            const quadOptions = {
                '16': 16,
                '32': 32,
                '64': 64,
                '128': 128,
                '256': 256,
                '512': 512
            };
            lodFolder.addBinding(landscape, 'componentSizeQuads', {
                options: quadOptions
            });
            lodFolder.addBinding(landscape, 'lod0SizeQuads', {
                options: quadOptions
            });

            // [KO] Heightmap Shadow 설정
            // [EN] Heightmap shadow settings
            const shadowFolder = landscapeFolder.addFolder({title: 'Heightmap Shadow', expanded: false});
            shadowFolder.addBinding(landscape, 'castHeightmapShadow');
            shadowFolder.addBinding(landscape, 'heightmapShadowSteps', {
                min: 4,
                max: 32,
                step: 1
            });
            shadowFolder.addBinding(landscape, 'heightmapShadowSoftness', {
                min: 1,
                max: 20,
                step: 0.5
            });
            shadowFolder.addBinding(landscape, 'heightmapShadowDistance', {
                min: 500,
                max: 6000,
                step: 100
            });

            // [KO] Debug 설정
            // [EN] Debug settings
            const debugFolder = landscapeFolder.addFolder({title: 'Debug', expanded: false});
            debugFolder.addBinding(landscape, 'debugMode', {
                options: {
                    'None (Full PBR)': RedGPU.LANDSCAPE_DEBUG_MODE.NONE,
                    'Final Normal': RedGPU.LANDSCAPE_DEBUG_MODE.FINAL_NORMAL,
                    'Macro Normal': RedGPU.LANDSCAPE_DEBUG_MODE.MACRO_NORMAL,
                    'Albedo': RedGPU.LANDSCAPE_DEBUG_MODE.ALBEDO,
                    'Splat Weights': RedGPU.LANDSCAPE_DEBUG_MODE.SPLAT_WEIGHTS,
                    'Roughness': RedGPU.LANDSCAPE_DEBUG_MODE.ROUGHNESS,
                    'Ambient Occlusion': RedGPU.LANDSCAPE_DEBUG_MODE.AMBIENT_OCCLUSION,
                    'Heightmap Shadow Mask': RedGPU.LANDSCAPE_DEBUG_MODE.HEIGHTMAP_SHADOW_MASK,
                    'CSM Shadow Mask': RedGPU.LANDSCAPE_DEBUG_MODE.CSM_SHADOW_MASK,
                    'Total Shadow Visibility': RedGPU.LANDSCAPE_DEBUG_MODE.TOTAL_SHADOW_VISIBILITY,
                    'Elevation Heatmap': RedGPU.LANDSCAPE_DEBUG_MODE.ELEVATION_HEATMAP,
                    'LOD Level': RedGPU.LANDSCAPE_DEBUG_MODE.LOD_LEVEL
                }
            });
            debugFolder.addBinding(landscape, 'wireframe');
            debugFolder.addBinding(landscape, 'lodColoration');

            // [KO] Light 설정
            // [EN] Light settings
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            // [KO] Layers 설정 (4종 스플랫 재질)
            // [EN] Layers settings (4 splat materials)
            const splatFolder = pane.addFolder({title: 'Layers', expanded: true});

            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});

                layerSubFolder.addBinding(layer, 'enabled');

                const uvProxy = {uvScale: layer.uvScale[0]};
                layerSubFolder.addBinding(uvProxy, 'uvScale', {min: 5, max: 150, step: 1})
                    .on('change', (ev) => {
                        layer.uvScale = [ev.value, ev.value];
                    });

                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });

    // [KO] 매 프레임 캐릭터 및 카메라 업데이트
    // [EN] Update character and camera per frame
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
        update
    };
}

/**
 * [KO] 3D 캐릭터 모델을 로드하고 물리 컨트롤러 및 애니메이션 상태 머신을 구성합니다.
 * [EN] Loads 3D character model and configures physics controller and animation state machine.
 */
function initCharacter({
                           redGPUContext,
                           scene,
                           landscape,
                           characterOrbitController,
                           onLoaded
                       }) {
    const CHARACTER_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

    new RedGPU.GLTFLoader(
        redGPUContext,
        CHARACTER_URL,
        (loader) => {
            const characterMesh = loader.resultMesh;
            // [KO] 언덕 기슭과 인접한 안정적인 평지 좌표로 배치
            // [EN] Spawn at flat ground adjacent to the hill base
            characterMesh.x = -500;
            characterMesh.z = -2750;
            // [KO] 지형 고도에 맞춰 초기 위치 배치 및 그림자 설정
            // [EN] Place at terrain height and configure shadows
            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 302);

            // characterMesh.setCastShadowRecursively(true);
            // characterMesh.setReceiveShadowRecursively(true);
            scene.addChild(characterMesh);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;

            // [KO] 캐릭터 물리 컨트롤러 생성
            // [EN] Create character physics controller
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
                    floorOffset: 0.025,
                    useKeyboard: false,
                    getFloorHeight: (x, z) => landscape.getHeightAt(x, z),
                }
            );

            // [KO] 애니메이션 상태 머신 구성
            // [EN] Configure animation state machine
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
