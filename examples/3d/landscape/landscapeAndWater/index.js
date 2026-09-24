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
        // 1. 카메라 컨트롤러 구성 (기본: 캐릭터 3인칭 추종 카메라 & 호수 전체 조망 궤도 회전 카메라)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.centerX = 0;
        orbitController.centerY = 6.5;
        orbitController.centerZ = 0;
        orbitController.distance = 110.0;
        orbitController.tilt = -20;
        orbitController.pan = 40;
        orbitController.minDistance = 5.0;
        orbitController.maxDistance = 350.0;
        orbitController.speedDistance = 1.0;

        const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        characterOrbitController.distance = 5.5;
        characterOrbitController.tilt = -12;
        characterOrbitController.pan = 180;
        characterOrbitController.minDistance = 2.0;
        characterOrbitController.maxDistance = 25.0;
        characterOrbitController.speedDistance = 0.5;
        characterOrbitController.centerX = 0;
        characterOrbitController.centerY = 6.8 + 1.2;
        characterOrbitController.centerZ = 60;

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

        // 5. 랜드스케이프 지형 설정 (수체 연동을 고려한 분지 지형)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [400, 400];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 12.0;
        landscape.maxLODLevel = 4;
        landscape.loadingRadius = 300;
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
            {name: 'Grass', key: 'grass', weightChannel: 'R', uvScale: [10, 10], roughness: 0.85},
            {name: 'Rock', key: 'rock', weightChannel: 'G', uvScale: [5, 5], roughness: 0.7},
            {name: 'Gravel', key: 'gravel', weightChannel: 'B', uvScale: [10, 10], roughness: 0.9},
            {name: 'Leave', key: 'leave', weightChannel: 'A', uvScale: [10, 10], roughness: 0.8}
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
                roughness: cfg.roughness
            });
            landscape.addLayer(layer);
            return layer;
        });

        scene.addLandscape(landscape);

        // 7. 물리 기반 호수 수체 (WaterLake) 생성 및 광학 파라미터 구성
        const lake = new RedGPU.Display.WaterLake(
            redGPUContext,
            300,
            300,
            96,
            96
        );
        lake.y = 6.5; // 지형 계곡 분지와 맞물리는 수면 고도

        lake.waveAmplitude = 0.045;
        lake.waveWavelength = 16.0;
        lake.waveSpeed = 1.0;
        lake.interactionDomainSize = 35.0;
        lake.maxPenetration = 0.35;

        // 수면 광학 재질 및 듀얼 노멀 텍스처
        lake.waterMaterial.baseColor.setColorByHEX('#179fa0');
        lake.waterMaterial.deepColor.setColorByHEX('#042436');
        lake.waterMaterial.opacity = 1.0;
        lake.waterMaterial.refractionStrength = 0.85;
        lake.waterMaterial.causticsStrength = 1.2;
        lake.waterMaterial.causticsScale = 1.0;
        lake.waterMaterial.causticsSpeed = 1.0;
        lake.waterMaterial.depthFadeDistance = 1.0;
        lake.waterMaterial.roughness = 0.04;
        lake.waterMaterial.specularFactor = 1.0;
        lake.waterMaterial.windSpeed = 0.025;
        lake.waterMaterial.normalTiling = 18.0;
        lake.waterMaterial.normalDetailTiling = 36.0;

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

        scene.addChild(lake);

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
            characterOrbitController.distance = 5.5;
            characterOrbitController.tilt = -12;
            characterOrbitController.pan = 180;
        } else {
            orbitController.centerX = 0;
            orbitController.centerY = 6.5;
            orbitController.centerZ = 0;
            orbitController.distance = 110.0;
            orbitController.tilt = -20;
            orbitController.pan = 40;
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

            waterFolder.addBinding(lake, 'y', {min: 0.0, max: 12.0, step: 0.1});
            waterFolder.addBinding(lake, 'waveAmplitude', {min: 0.0, max: 0.2, step: 0.005});
            waterFolder.addBinding(lake, 'waveSpeed', {min: 0.0, max: 5.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});
            waterFolder.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.1, max: 10.0, step: 0.1});
            waterFolder.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            waterFolder.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.1, step: 0.005});

            // 3. 지형 설정 폴더
            const terrainFolder = pane.addFolder({title: 'Terrain', expanded: false});

            terrainFolder.addBinding(landscape, 'heightScale', {min: 0, max: 30, step: 0.5});
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
            // 호수 수변 앞쪽 완만한 육지 좌표로 배치
            characterMesh.x = 0;
            characterMesh.z = 60;

            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 6.8);

            characterMesh.setCastShadowRecursively(true);
            characterMesh.setReceiveShadowRecursively(true);
            scene.addChild(characterMesh);

            characterOrbitController.centerX = characterMesh.x;
            characterOrbitController.centerY = characterMesh.y + 1.2;
            characterOrbitController.centerZ = characterMesh.z;

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
