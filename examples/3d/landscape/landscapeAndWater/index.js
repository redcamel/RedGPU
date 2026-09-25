import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 7: Landscape & Water System (랜드스케이프와 호수 수체 통합 시스템)
 * [EN] Step 7: Landscape & Water System (Landscape & Lake Water System Integration)
 *
 * [KO] 랜드스케이프 지형의 계곡 분지와 물리 기반 호수 수체(WaterLake)를 결합하여 수위, 듀얼 노멀 파도, 수중 굴절 및 심도 기반 흡수·코스틱스 광학 효과를 종합 제어하는 예제입니다.
 *      • 수위(Water Level) 조절: Water 폴더의 y 값을 조절하여 지형의 골짜기가 호수로 채워지거나 말라붙는 수변 경계를 실시간으로 확인하세요.
 *      • 수중 광학 효과: causticsStrength, refractionStrength, depthFadeDistance를 조절하여 얕은 여울과 깊은 호수 바닥의 빛 투과를 관찰하세요.
 * [EN] An integrated simulation uniting landscape terrain valleys with physical lake water (WaterLake), controlling water level, dual normal waves, refraction, and depth caustics.
 *      • Water Level Control: Adjust lake y in the Water folder to watch terrain valleys flood or drain dynamically.
 *      • Underwater Optics: Tune causticsStrength, refractionStrength, and depthFadeDistance to inspect light absorption and caustics.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 구성 (기본: 캐릭터 3인칭 추종 카메라 & 호수 조망 궤도 회전 카메라)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = -543;
        orbitController.centerY = 301.2;
        orbitController.centerZ = -2832.5;
        orbitController.distance = 600.0;
        orbitController.tilt = -22;
        orbitController.pan = 75;
        orbitController.minDistance = 10.0;
        orbitController.maxDistance = 6000.0;
        orbitController.speedDistance = 10.0;

        const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        characterOrbitController.distance = 7.0;
        characterOrbitController.tilt = -16;
        characterOrbitController.pan = 75;
        characterOrbitController.minDistance = 2.0;
        characterOrbitController.maxDistance = 25.0;
        characterOrbitController.speedDistance = 0.5;
        characterOrbitController.centerX = -543;
        characterOrbitController.centerY = 300.8 + 1.2;
        characterOrbitController.centerZ = -2832.5;

        // 2. 씬 및 뷰3D 생성 (기본: 캐릭터 3인칭 시점)
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, characterOrbitController);
        redGPUContext.addView(view);

        // 3. IBL 환경광 및 스카이박스 설정
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/field.hdr',
            35000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 55;
        directionalLight.azimuth = 90;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 100000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 350;

        // 5. 8km x 8km 랜드스케이프 지형 및 256개 타일 스트리밍 설정
        const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [8000, 8000];
        landscape.heightScale = 650;
        landscape.loadingRadius = 2500.0;
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
            {name: 'Grass', key: 'grass', weightChannel: 'R', uvScale: [50, 50], roughness: 0.85},
            {name: 'Rock', key: 'rock', weightChannel: 'G', uvScale: [15, 15], roughness: 0.7},
            {name: 'Gravel', key: 'gravel', weightChannel: 'B', uvScale: [40, 40], roughness: 0.9},
            {name: 'Leave', key: 'leave', weightChannel: 'A', uvScale: [50, 50], roughness: 0.8}
        ];

        const layers = layerConfigs.map(cfg => {
            const layer = new RedGPU.Landscape.LandscapeLayer(redGPUContext, {
                name: cfg.name,
                baseColorTexture: `${assetPath}${cfg.key}.jpg`,
                normalTexture: `${assetPath}${cfg.key}_normal.jpg`,
                ormTexture: `${assetPath}${cfg.key}_orm.jpg`,
                weightTexture: weightTexturePath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness
            });
            landscape.addLayer(layer);
            return layer;
        });

        scene.addLandscape(landscape);

        // 7. 물리 기반 산중 호수 수체 (WaterLake) 생성
        const lake = new RedGPU.Water.WaterLake(
            redGPUContext,
            1500,
            1500,
            96,
            96
        );
        lake.x = -543;
        lake.z = -2832.5;
        lake.y = 301.2; // 캐릭터 발목(수심 약 40cm)이 찰랑거리는 완만한 수변 수위


        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );

        scene.addWater(lake);

        // 8. GUI 컨트롤 패널 및 캐릭터 상호작용 초기화
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            characterOrbitController,
            orbitController,
            landscape,
            lake,
            directionalLight,
            directionalShadowManager,
            layers
        });

        // 9. 렌더러 시작
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
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 3D 캐릭터, 호수 수체, 지형 및 광원을 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, 3D character, lake water, terrain, and lighting.
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            characterOrbitController,
                            orbitController,
                            landscape,
                            lake,
                            directionalLight,
                            directionalShadowManager,
                            layers
                        }) {
    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Character'
    };

    let paneInstance = null;

    // 3D 캐릭터 로딩 및 상태 머신 구성
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
            if (paneInstance) {
                bindCharacterFolder(paneInstance, characterController);
            }
        }
    });

    const bindCharacterFolder = (pane, cc) => {
        if (!pane || !cc) return;
        const charFolder = pane.addFolder({title: 'Character', expanded: false});
        charFolder.addBinding(cc, 'floorOffset', {min: -0.2, max: 0.5, step: 0.01});
        charFolder.addBinding(cc, 'speed', {min: 1.0, max: 15.0, step: 0.5});
        charFolder.addBinding(cc, 'runSpeed', {min: 2.0, max: 25.0, step: 0.5});
        charFolder.addBinding(cc, 'jumpForce', {min: 2.0, max: 20.0, step: 0.5});
        charFolder.addBinding(cc, 'gravity', {min: 5.0, max: 60.0, step: 1.0});
    };

    const resetCamera = () => {
        if (params.cameraMode === 'Character') {
            if (characterMesh) {
                characterOrbitController.centerX = characterMesh.x;
                characterOrbitController.centerY = characterMesh.y + 1.2;
                characterOrbitController.centerZ = characterMesh.z;
            }
            characterOrbitController.distance = 7.0;
            characterOrbitController.tilt = -16;
            characterOrbitController.pan = 75;
        } else {
            orbitController.centerX = -543;
            orbitController.centerY = 301.2;
            orbitController.centerZ = -2832.5;
            orbitController.distance = 600.0;
            orbitController.tilt = -22;
            orbitController.pan = 75;
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            paneInstance = pane;

            // 1. Controller 설정 (Character / Orbit 전환)
            const controllerFolder = pane.addFolder({title: 'Controller', expanded: true});

            controllerFolder.addBinding(params, 'cameraMode', {
                view: 'radiogrid',
                groupName: 'cameraMode',
                size: [2, 1],
                cells: (x, y) => ({
                    title: x === 0 ? 'Character' : 'Orbit',
                    value: x === 0 ? 'Character' : 'Orbit'
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
                } else {
                    view.camera = orbitController;
                    if (characterController) characterController.useKeyboard = false;
                }
            });

            controllerFolder.addButton({title: 'Reset Camera'}).on('click', resetCamera);

            if (characterController) {
                bindCharacterFolder(pane, characterController);
            }

            // 2. 호수 수체 폴더
            const waterFolder = pane.addFolder({title: 'Water', expanded: true});

            waterFolder.addBinding(lake, 'y', {min: 295.0, max: 310.0, step: 0.1});
            waterFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.5, step: 0.01});
            waterFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});
            waterFolder.addBinding(lake, 'rippleNormalStrength', {min: 0.0, max: 3.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});
            waterFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.1, max: 10.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            waterFolder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.15, step: 0.005});
            waterFolder.addBinding(lake.waterMaterial, 'normalScale', {min: 0.1, max: 3.0, step: 0.1});

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: false});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 100, max: 1200, step: 10});
            terrainFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 500, step: 5});
            terrainFolder.addBinding(landscape, 'nearDetailFade', {min: 5, max: 200, step: 5});
            terrainFolder.addBinding(landscape, 'wireframe');
            terrainFolder.addBinding(landscape, 'lodColoration');

            // 4. 조명 및 그림자 폴더
            const lightFolder = pane.addFolder({title: 'Light', expanded: false});

            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 30, max: 500, step: 10});

            // 5. 스플랫 레이어 폴더
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});

            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});

                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });

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
 * [KO] 3D 캐릭터 로딩 및 물리 컨트롤러/애니메이션 상태 머신 구성
 * [EN] Loads 3D character and configures physics controller and animation state machine
 */
function initCharacter({redGPUContext, scene, landscape, characterOrbitController, onLoaded}) {
    const CHARACTER_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';

    new RedGPU.GLTFLoader(
        redGPUContext,
        CHARACTER_URL,
        (loader) => {
            const characterMesh = loader.resultMesh;
            characterMesh.x = -543;
            characterMesh.z = -2832.5;

            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 300.8);

            characterMesh.setCastShadowRecursively(true);
            characterMesh.setReceiveShadowRecursively(true);
            scene.addChild(characterMesh);

            // [핵심] 캐릭터 메시를 수체 상호작용 객체로 재귀 등록하여 이동/발걸음 시 동심원 물결(Ripple) 시뮬레이션 활성화
            characterMesh.setEnableWaterInteractionRecursively(true, 1.8);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;
            characterOrbitController.distance = 7.0;
            characterOrbitController.tilt = -16;
            characterOrbitController.pan = 75;

            const characterController = new RedGPU.Charactor.SimpleCharacterController(
                redGPUContext,
                characterMesh,
                characterOrbitController,
                {
                    gravity: 24.0,
                    jumpForce: 9.0,
                    getFloorHeight: (x, z) => landscape.getHeightAt(x, z),
                }
            );

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

