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
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.baseColor.setColorByHEX('#4a7c59');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        scene.addLandscape(landscape);

        // [KO] GUI 패널 및 인터랙션(카메라 모드, 캐릭터) 초기화
        // [EN] Initialize GUI panel and interactions (camera modes, character)
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            directionalLight
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
 * [KO] GUI 컨트롤 패널 및 테스트 인터랙션(카메라 모드, 캐릭터 연동)을 구성합니다.
 * [EN] Sets up the GUI control panel and test interactions (camera modes, character sync).
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            landscape,
                            directionalLight
                        }) {
    // [KO] 자유 비행 카메라 (Free Flight)
    // [EN] Free Flight camera
    const freeController = new RedGPU.Camera.FreeController(redGPUContext);
    freeController.x = 0;
    freeController.y = 1350;
    freeController.z = 2800;
    freeController.tilt = -18;
    freeController.pan = 0;
    freeController.moveSpeed = 4000;

    // [KO] 캐릭터 추종 궤도 카메라 (Character)
    // [EN] Character orbit follow camera
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 5.5;
    characterOrbitController.tilt = -12;
    characterOrbitController.pan = 0;
    characterOrbitController.speedDistance = 0.5;

    // [KO] 캐릭터 상태 관리
    // [EN] Character state management
    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Orbit',
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
        }
    });

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] Camera 설정
            // [EN] Camera settings
            const cameraFolder = pane.addFolder({title: 'Camera', expanded: true});

            cameraFolder.addBinding(params, 'cameraMode', {
                options: {
                    'Orbit': 'Orbit',
                    'Free Flight': 'Free Flight',
                    'Character': 'Character'
                }
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
                } else if (mode === 'Free Flight') {
                    view.camera = freeController;
                    if (characterController) characterController.useKeyboard = false;
                } else {
                    view.camera = orbitController;
                    if (characterController) characterController.useKeyboard = false;
                }
            });

            // [KO] Landscape 설정
            // [EN] Landscape settings
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: true});

            landscapeFolder.addBinding(params, 'baseColor')
                .on('change', (ev) => {
                    landscape.baseColor.setColorByHEX(ev.value);
                });

            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});

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

            // [KO] Heightmap Shadow 설정
            // [EN] Heightmap shadow settings
            const shadowFolder = landscapeFolder.addFolder({title: 'Heightmap Shadow', expanded: false});

            shadowFolder.addBinding(landscape, 'enableHeightmapShadow');
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
            const debugFolder = landscapeFolder.addFolder({title: 'Debug', expanded: true});
            debugFolder.addBinding(landscape, 'wireframe');
            debugFolder.addBinding(landscape, 'lodColoration');

            // [KO] Light 설정
            // [EN] Light settings
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 1000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
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
            characterMesh.x = 0;
            characterMesh.z = 0;
            // [KO] 지형 고도에 맞춰 초기 위치 배치 및 그림자 설정
            // [EN] Place at terrain height and configure shadows
            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 0);

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
