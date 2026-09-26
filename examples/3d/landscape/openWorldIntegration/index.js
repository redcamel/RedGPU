import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 6: Open World Integration (오픈월드 통합 및 캐릭터 인터랙션)
 * [EN] Step 6: Open World Integration (Open World Integration & Character Interaction)
 *
 * [KO] 8km x 8km 타일 스트리밍 지형, 4채널 멀티레이어 PBR 스플랫, 대규모 절차적 잔디 필드, 수목 식생 및 옥타헤드럴 임포스터와
 *      물리 기반 3D 캐릭터(Soldier)를 유기적으로 결합한 완성형 오픈월드 시뮬레이션 예제입니다.
 *      • 캐릭터 조작: WASD(이동), Shift(달리기), Space(점프)로 캐릭터를 제어하여 실시간 지형 높이 동기화(getHeightAt)를 체험하세요.
 *      • 카메라 전환: Tweakpane의 Controller 메뉴에서 [Character] 3인칭 추종 카메라와 [Orbit] 광역 조망 카메라를 자유롭게 전환할 수 있습니다.
 *      • 식생 및 잔디: 바람 시뮬레이션(Global Wind)과 거리별 LOD·임포스터 컬링을 종합 제어할 수 있습니다.
 * [EN] A complete open-world integration simulation uniting 8km tiled terrain, 4-layer PBR splatting,
 *      procedural grass fields, foliage with octahedral impostors, and a 3D character controller (Soldier).
 *      • Character Controls: Use WASD (move), Shift (run), and Space (jump) to experience dynamic ground alignment (getHeightAt).
 *      • Camera Switch: Toggle between [Character] 3rd-person follow and [Orbit] global overview in the Controller panel.
 *      • Vegetation: Full control over global wind, distance LODs, octahedral impostors, and procedural grass.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // -----------------------------------------------------------------
        // 1. 카메라 컨트롤러 구성 (기본: 캐릭터 3인칭 추종 + 조망용 궤도 카메라)
        // -----------------------------------------------------------------
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 7000;
        orbitController.tilt = -25;
        orbitController.pan = 40;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 35000;
        orbitController.speedDistance = 80.0;

        const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        characterOrbitController.distance = 5.5;
        characterOrbitController.tilt = -12;
        characterOrbitController.pan = 35;
        characterOrbitController.minDistance = 2.0;
        characterOrbitController.maxDistance = 25.0;
        characterOrbitController.speedDistance = 0.5;
        characterOrbitController.centerX = -543;
        characterOrbitController.centerY = 300.8 + 1.2;
        characterOrbitController.centerZ = -2832.5;

        // -----------------------------------------------------------------
        // 2. 씬 및 뷰3D 생성 (기본: 캐릭터 3인칭 추종 카메라)
        // -----------------------------------------------------------------
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, characterOrbitController);
        redGPUContext.addView(view);

        // -----------------------------------------------------------------
        // 3. IBL 환경광 및 스카이박스 설정
        // -----------------------------------------------------------------
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/field.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // -----------------------------------------------------------------
        // 4. 태양광 & 그림자 설정 (Directional Light & CSM Shadow)
        // -----------------------------------------------------------------
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 55;
        directionalLight.color.setColorByHEX('#fff8ea');
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 250;

        // -----------------------------------------------------------------
        // 5. 8km x 8km 랜드스케이프 지형 및 256개 타일 스트리밍 설정
        // -----------------------------------------------------------------
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

        // -----------------------------------------------------------------
        // 6. RGBA 4채널 스플랫맵 기반 멀티레이어 구성
        // -----------------------------------------------------------------
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';

        const layerConfigs = [
            {name: 'Grass', key: 'grass', weightChannel: 'R', uvScale: [50, 50], roughness: 0.85},
            {name: 'Rock', key: 'rock', weightChannel: 'G', uvScale: [15, 15], roughness: 0.7},
            {name: 'Gravel', key: 'gravel', weightChannel: 'B', uvScale: [40, 40], roughness: 0.9},
            {name: 'Leave', key: 'leave', weightChannel: 'A', uvScale: [50, 50], roughness: 0.8}
        ];

        const layers = layerConfigs.map((cfg) => {
            return landscape.addLayer({
                name: cfg.name,
                baseColorTexture: `${assetPath}${cfg.key}.jpg`,
                normalTexture: `${assetPath}${cfg.key}_normal.jpg`,
                ormTexture: `${assetPath}${cfg.key}_orm.jpg`,
                weightTexture: weightTexturePath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness
            });
        });

        scene.addLandscape(landscape);

        // -----------------------------------------------------------------
        // 7. 잔디 서브시스템 및 수목 식생 매니저
        // -----------------------------------------------------------------
        const grassManager = landscape.grassManager;
        const foliageManager = landscape.foliageManager;

        // -----------------------------------------------------------------
        // 8. GUI 컨트롤 패널 및 인터랙션 초기화
        // -----------------------------------------------------------------
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            characterOrbitController,
            landscape,
            directionalLight,
            directionalShadowManager,
            grassManager,
            foliageManager,
            layers
        });

        // 절차적 잔디 에셋 로딩 및 등록
        initGrassField({
            redGPUContext,
            grassManager,
            onGrassTypeAdded: (type, isDefaultExpanded) => {
                testPane.addGrassTypeToUI(type, isDefaultExpanded);
            }
        });

        // 수목 식생 에셋 로딩 및 등록
        initFoliageField({
            redGPUContext,
            foliageManager,
            onFoliageTypeAdded: (type) => {
                testPane.addFoliageTypeToUI(type);
            }
        });

        // -----------------------------------------------------------------
        // 9. 렌더 루프 및 실시간 캐릭터-지형 상호작용
        // -----------------------------------------------------------------
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
 * [KO] Tweakpane GUI를 구성하여 카메라 모드, 3D 캐릭터, 잔디/수목 식생, 지형 및 광원을 종합 제어합니다.
 * [EN] Configures the Tweakpane GUI to control camera modes, 3D character, grass/foliage, terrain, and lighting.
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            characterOrbitController,
                            landscape,
                            directionalLight,
                            directionalShadowManager,
                            grassManager,
                            foliageManager,
                            layers
                        }) {
    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Character'
    };

    let paneInstance = null;
    let grassFolder = null;
    let foliageFolder = null;

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

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            paneInstance = pane;

            // 1. Controller 설정 (Character / Orbit 전환)
            const controllerFolder = pane.addFolder({title: 'Controller', expanded: true});

            controllerFolder.addBinding(params, 'cameraMode', {
                view: 'radiogrid',
                groupName: 'cameraMode',
                size: [2, 1],
                cells: (x) => ({
                    title: x === 0 ? 'Character' : 'Orbit',
                    value: x === 0 ? 'Character' : 'Orbit'
                })
            }).on('change', (ev) => {
                const isChar = ev.value === 'Character';
                view.camera = isChar ? characterOrbitController : orbitController;
                if (characterController) {
                    characterController.useKeyboard = isChar;
                }
                if (isChar && characterMesh) {
                    characterOrbitController.centerX = characterMesh.x;
                    characterOrbitController.centerY = characterMesh.y + 1.2;
                    characterOrbitController.centerZ = characterMesh.z;
                }
                landscape.nearDetailDistance = isChar ? 120 : 1000;
                landscape.nearDetailFade = isChar ? 80 : 300;
                pane.refresh();
            });

            controllerFolder.addButton({title: 'Reset Camera'}).on('click', () => {
                if (params.cameraMode === 'Character' && characterMesh) {
                    characterOrbitController.centerX = characterMesh.x;
                    characterOrbitController.centerY = characterMesh.y + 1.2;
                    characterOrbitController.centerZ = characterMesh.z;
                    characterOrbitController.distance = 5.5;
                    characterOrbitController.tilt = -12;
                    characterOrbitController.pan = 35;
                } else {
                    orbitController.centerX = 0;
                    orbitController.centerY = 0;
                    orbitController.centerZ = 0;
                    orbitController.distance = 7000;
                    orbitController.tilt = -25;
                    orbitController.pan = 40;
                }
            });

            if (characterController) {
                bindCharacterFolder(pane, characterController);
            }

            // 2. 절차적 잔디 매니저 (Grass)
            grassFolder = pane.addFolder({title: 'Grass', expanded: false});
            grassFolder.addBinding(grassManager, 'enabled');
            grassFolder.addBinding(grassManager, 'streamingRadius', {min: 30, max: 250, step: 5});

            // 3. 수목 식생 매니저 (Foliage)
            foliageFolder = pane.addFolder({title: 'Foliage', expanded: false});

            const managerFolder = foliageFolder.addFolder({title: 'foliageManager', expanded: true});
            managerFolder.addBinding(foliageManager, 'streamingRadius', {min: 200, max: 2000, step: 50});
            managerFolder.addBinding(foliageManager, 'subCellSize', {min: 50, max: 200, step: 10});
            managerFolder.addBinding(foliageManager, 'debugSubCellColoration');

            // 전역 바람 시뮬레이션 설정 (Global Wind)
            const windGlobalFolder = foliageFolder.addFolder({title: 'Global Wind', expanded: true});
            windGlobalFolder.addBinding(foliageManager, 'windEnabled');
            windGlobalFolder.addBinding(foliageManager, 'windStrength', {min: 0.0, max: 3.0, step: 0.05});
            windGlobalFolder.addBinding(foliageManager, 'windSpeed', {min: 0.0, max: 10.0, step: 0.1});
            windGlobalFolder.addBinding(foliageManager, 'windFrequency', {min: 0.1, max: 5.0, step: 0.1});
            windGlobalFolder.addBinding(foliageManager, 'windFlutterStrength', {min: 0.0, max: 2.0, step: 0.05});
            windGlobalFolder.addBinding(foliageManager, 'windDirectionAngle', {min: 0, max: 360, step: 1});

            // 4. 지형 설정 (Landscape)
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});
            landscapeFolder.addBinding(landscape, 'nearDetailFade', {min: 10, max: 1000, step: 10});
            landscapeFolder.addBinding(landscape, 'wireframe');
            landscapeFolder.addBinding(landscape, 'lodColoration');
            landscapeFolder.addBinding(landscape, 'enableHeightmapShadow');

            // 5. 조명 및 그림자 (Light & Shadow)
            const lightFolder = pane.addFolder({title: 'Light & Shadow', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            lightFolder.addBinding(directionalShadowManager, 'strength', {min: 0.0, max: 1.0, step: 0.05});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 30, max: 500, step: 10});

            // 6. 스플랫 레이어 (Layers)
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
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

    const addGrassTypeToUI = (type, isDefaultExpanded = false) => {
        if (!grassFolder) return;
        const typeFolder = grassFolder.addFolder({title: type.name || 'GrassType', expanded: isDefaultExpanded});
        typeFolder.addBinding(type, 'densityPerHectare', {min: 1000, max: 50000, step: 1000});
        typeFolder.addBinding(type, 'cullingDistance', {min: 20, max: 250, step: 5});
        typeFolder.addBinding(type, 'bottomOffset', {min: -0.8, max: 0.3, step: 0.01});
        typeFolder.addBinding(type, 'minSlope', {min: 0, max: 89, step: 1});
        typeFolder.addBinding(type, 'maxSlope', {min: 1, max: 90, step: 1});
        typeFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        typeFolder.addBinding(type, 'alphaCutoff', {min: 0.05, max: 0.9, step: 0.05});
        typeFolder.addBinding(type, 'roughness', {min: 0.04, max: 1.0, step: 0.05});
        typeFolder.addBinding(type, 'castShadow');
        typeFolder.addBinding(type, 'receiveShadow');
    };

    const addFoliageTypeToUI = (type) => {
        if (!foliageFolder) return;
        const typeFolder = foliageFolder.addFolder({title: type.name || 'FoliageType', expanded: false});

        // 1. Placement (배치 및 밀도)
        const placementFolder = typeFolder.addFolder({title: 'Placement', expanded: true});
        const layerOptions = {'(None / All)': ''};
        if (landscape) {
            landscape.layers.forEach((l) => {
                layerOptions[l.name] = l.name;
            });
        }
        placementFolder.addBinding(type, 'targetLayer', {options: layerOptions});
        placementFolder.addBinding(type, 'densityPerHectare', {
            min: 1.0,
            max: 500.0,
            step: 1.0
        }).on('change', () => placementFolder.refresh());
        placementFolder.addBinding(type, 'densityMultiplier', {min: 0.0, max: 3.0, step: 0.1})
            .on('change', () => placementFolder.refresh());
        placementFolder.addBinding(type, 'instancesPerCell', {readonly: true});
        placementFolder.addBinding(type, 'densityScaleByWeight');
        placementFolder.addBinding(type, 'activeInstanceCount', {readonly: true});
        placementFolder.addBinding(type, 'totalInstanceCount', {readonly: true});

        // 2. Transform & Slope (스케일 및 경사각)
        const transformFolder = typeFolder.addFolder({title: 'Transform & Slope', expanded: true});
        transformFolder.addBinding(type, 'bottomOffset', {min: -3.0, max: 2.0, step: 0.05});
        transformFolder.addBinding(type, 'minSlope', {min: 0.0, max: 89.0, step: 1.0});
        transformFolder.addBinding(type, 'maxSlope', {min: 1.0, max: 90.0, step: 1.0});
        const alignBinding = transformFolder.addBinding(type, 'alignToNormal');
        const alignFactorBinding = transformFolder.addBinding(type, 'alignFactor', {min: 0.0, max: 1.0, step: 0.05});
        alignFactorBinding.disabled = !type.alignToNormal;
        alignBinding.on('change', (ev) => {
            alignFactorBinding.disabled = !ev.value;
        });

        // 3. Ground Blend (지형 컬러 블렌딩)
        const groundBlendFolder = typeFolder.addFolder({title: 'Ground Blend', expanded: true});
        groundBlendFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        groundBlendFolder.addBinding(type, 'groundBlendRange', {min: 0.1, max: 10.0, step: 0.1});

        // 4. LOD & Impostor (컬링 거리 및 임포스터)
        const lodFolder = typeFolder.addFolder({title: 'LOD & Impostor', expanded: true});
        lodFolder.addBinding(type, 'cullingDistance', {min: 500, max: 8000, step: 100});
        if (type.hasImpostor) {
            lodFolder.addBinding(type, 'useImpostor');
        }

        const lodList = type.lodInfoList || [];
        const hasImp = type.hasImpostor;
        lodList.forEach((lodInfo, idx) => {
            const isImpostorLOD = hasImp && idx === lodList.length - 1;
            const subTitle = isImpostorLOD ? `Impostor (LOD ${idx})` : `LOD ${idx}`;
            const subFolder = lodFolder.addFolder({title: subTitle, expanded: false});

            if (!isImpostorLOD) {
                const proxy = {
                    lodDistance: type.getLODDistance(idx),
                    receiveShadow: type.getLODReceiveShadow(idx)
                };
                subFolder.addBinding(proxy, 'lodDistance', {min: 10, max: 2000, step: 5})
                    .on('change', (ev) => type.setLODDistance(idx, ev.value));
                subFolder.addBinding(proxy, 'receiveShadow')
                    .on('change', (ev) => type.setLODReceiveShadow(idx, ev.value));
            } else {
                const proxy = {
                    receiveShadow: type.getLODReceiveShadow(idx)
                };
                subFolder.addBinding(proxy, 'receiveShadow')
                    .on('change', (ev) => type.setLODReceiveShadow(idx, ev.value));
            }
            subFolder.addBinding(lodInfo, 'subMeshCount', {readonly: true});
        });

        // 5. Shadow (그림자)
        const shadowFolder = typeFolder.addFolder({title: 'Shadow', expanded: true});
        shadowFolder.addBinding(type, 'castShadow');
        shadowFolder.addBinding(type, 'maxShadowDistance', {min: 50, max: 1000, step: 25});

        // 6. Wind & Motion
        const windFolder = typeFolder.addFolder({title: 'Wind & Motion', expanded: true});
        windFolder.addBinding(type, 'windMultiplier', {min: 0.0, max: 3.0, step: 0.1});
        windFolder.addBinding(type, 'windFlutterMultiplier', {min: 0.0, max: 3.0, step: 0.1});
    };

    // 렌더 프레임 업데이트
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
        addGrassTypeToUI,
        addFoliageTypeToUI,
        update
    };
}

/**
 * [KO] 3D 캐릭터 로딩 및 물리 컨트롤러/애니메이션 상태 머신 구성
 * [EN] Loads 3D character and configures physics controller and animation state machine
 */
function initCharacter({redGPUContext, scene, landscape, characterOrbitController, onLoaded}) {
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://threejs.org/examples/models/gltf/Soldier.glb',
        (loader) => {
            const characterMesh = loader.resultMesh;
            characterMesh.x = -543;
            characterMesh.z = -2832.5;

            const startH = landscape.getHeightAt(characterMesh.x, characterMesh.z);
            characterMesh.y = (startH > 0 ? startH : 300.8);

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
                    rotationSpeed: 10.0,
                    gravity: 24.0,
                    jumpForce: 9.0,
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

/**
 * [KO] 절차적 잔디 에셋(grass.glb)을 로드하고 잔디 타입을 등록합니다.
 * [EN] Loads procedural grass assets (grass.glb) and registers grass types.
 */
function initGrassField({redGPUContext, grassManager, onGrassTypeAdded}) {
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
                const grassType = grassManager.addGrassType({
                    name: 'Lawn Clump',
                    lods: [
                        {mesh: baseMesh, lodDistance: 110}
                    ],
                    densityPerHectare: 20000,
                    targetLayer: 'Grass',
                    cullingDistance: 110,
                    minScale: [12.0, 8.0, 12.0],
                    maxScale: [18.0, 12.0, 18.0],
                    bottomOffset: -0.25
                });

                onGrassTypeAdded?.(grassType, true);
            }
        }
    );
}

/**
 * [KO] 수목 식생 에셋(test.glb)을 로드하고 LOD 단계별 임포스터를 구성하여 등록합니다.
 * [EN] Loads foliage assets (test.glb) and registers types with multi-LODs and octahedral impostors.
 */
function initFoliageField({redGPUContext, foliageManager, onFoliageTypeAdded}) {
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

                const foliageType = foliageManager.addFoliageType({
                    name: `Tree_${baseName}`,
                    lods: lodConfigs,
                    densityPerHectare: 90.0,
                    minScale: [0.4, 0.4, 0.4],
                    maxScale: [0.7, 0.75, 0.7],
                    randomRotationY: true,
                    cullingDistance: 5000,
                    targetLayer: 'Grass',
                    maxSlope: 32.0
                });

                onFoliageTypeAdded?.(foliageType);
            });
        }
    );
}

