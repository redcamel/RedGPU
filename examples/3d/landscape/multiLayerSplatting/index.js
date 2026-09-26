import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 기본 궤도 카메라 (지형 전체 조망)
        // [EN] Default orbit camera (overview of the entire terrain)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 6000;
        orbitController.tilt = -22;
        orbitController.pan = 35;
        orbitController.speedDistance = 80.0;

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // [KO] 환경광(IBL) 및 스카이박스
        // [EN] Environment light (IBL) and skybox
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // [KO] 태양광 (DirectionalLight)
        // [EN] Sunlight (DirectionalLight)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 36;
        directionalLight.azimuth = 135;
        directionalLight.lux = 85000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 랜드스케이프 지형 생성
        // [EN] Create landscape terrain
        const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.baseColor.setColorByHEX('#4a7c59');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // [KO] RGBA 4채널 스플랫맵 기반 멀티레이어 구성
        // [EN] Multi-layer setup based on RGBA 4-channel splatmap
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';

        const layerConfigs = [
            {
                name: 'Grass',
                weightChannel: 'R',
                uvScale: [50, 50],
                roughness: 0.85
            },
            {
                name: 'Rock',
                weightChannel: 'G',
                uvScale: [15, 15],
                roughness: 0.7
            },
            {
                name: 'Gravel',
                weightChannel: 'B',
                uvScale: [40, 40],
                roughness: 0.9
            },
            {
                name: 'Leave',
                weightChannel: 'A',
                uvScale: [50, 50],
                roughness: 0.8
            }
        ];

        const layers = layerConfigs.map(cfg => {
            const fileKey = cfg.name.toLowerCase();
            return landscape.addLayer({
                name: cfg.name,
                baseColorTexture: `${assetPath}${fileKey}.jpg`,
                normalTexture: `${assetPath}${fileKey}_normal.jpg`,
                ormTexture: `${assetPath}${fileKey}_orm.jpg`,
                weightTexture: weightTexturePath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness
            });
        });

        scene.addLandscape(landscape);

        // [KO] GUI 패널 및 인터랙션(카메라 모드, 캐릭터) 초기화
        // [EN] Initialize GUI panel and interactions (camera modes, character)
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
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
        console.error('RedGPU 초기화 실패 / Initialization failed:', error);
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
    characterOrbitController.centerX = -543;
    characterOrbitController.centerY = 300.8 + 1.2;
    characterOrbitController.centerZ = -2832.5;

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

            controllerFolder.addBinding(params, 'cameraMode', {
                view: 'radiogrid',
                groupName: 'cameraMode',
                size: [2, 1],
                cells: (x, y) => ({
                    title: x === 0 ? 'Orbit' : 'Character',
                    value: x === 0 ? 'Orbit' : 'Character'
                })
            }).on('change', (ev) => {
                const mode = ev.value;

                if (mode === 'Character') {
                    view.camera = characterOrbitController;
                    if (characterController) characterController.useKeyboard = true;
                    if (characterMesh) {
                        characterOrbitController.centerX = characterMesh.x;
                        characterOrbitController.centerY = characterMesh.y + 1.2;
                        characterOrbitController.centerZ = characterMesh.z;
                    }
                    // [KO] 캐릭터 근접 시점에 최적화된 근경 디테일 거리 및 페이드 설정
                    // [EN] Optimized detail distance and fade for character close-up view
                    landscape.nearDetailDistance = 120;
                    landscape.nearDetailFade = 80;
                } else {
                    view.camera = orbitController;
                    if (characterController) characterController.useKeyboard = false;
                    // [KO] 광범위 지형 조망(오빗) 시점에 맞춘 넓은 디테일 거리 및 페이드 설정
                    // [EN] Extended detail distance and fade for orbit overview
                    landscape.nearDetailDistance = 1000;
                    landscape.nearDetailFade = 300;
                }

                // [KO] UI 슬라이더 값 동기화
                // [EN] Refresh UI sliders
                pane.refresh();
            });

            // [KO] Landscape 설정
            // [EN] Landscape settings
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: true});

            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            landscapeFolder.addBinding(landscape, 'receiveShadow');
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {
                min: 0,
                max: 1500,
                step: 1
            });
            landscapeFolder.addBinding(landscape, 'nearDetailFade', {
                min: 10,
                max: 1000,
                step: 1
            });

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
            characterMesh.x = -543;
            characterMesh.z = -2832.5;
            // [KO] 지형 고도에 맞춰 초기 위치 배치 및 그림자 설정
            // [EN] Place at terrain height and configure shadows
            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 300.8);

            characterMesh.setCastShadowRecursively(true);
            characterMesh.setReceiveShadowRecursively(true);
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
                    floorOffset: 0.0,
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

