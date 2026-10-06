import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Step 5: Foliage & Impostors (대규모 수목 식생 및 옥타헤드럴 임포스터)
 * [EN] Step 5: Foliage & Impostors (Large-Scale Foliage & Octahedral Impostors)
 *
 * [KO] 8km x 8km 광역 지형에 소나무 식생을 대규모 배치하고, 3단계 메시 LOD와 최대 6,000m 원거리 옥타헤드럴 임포스터를 결합한 예제입니다.
 * [EN] Large-scale foliage example placing pine trees across an 8km x 8km terrain with 6,000m Octahedral Impostors.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 구성 (Orbit 조망 카메라)
        const orbitController = new RedGPU.Camera.OrbitController(redGPUContext);
        orbitController.distance = 7000;
        orbitController.tilt = -25;
        orbitController.pan = 40;
        orbitController.minDistance = 300;
        orbitController.maxDistance = 35000;
        orbitController.speedDistance = 80.0;

        // 2. 씬 & 뷰 생성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, orbitController);
        redGPUContext.addView(view);

        // 3. IBL 및 스카이박스
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            30000
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 35000);

        // 4. 태양광 & 그림자
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 400;

        // 5. 8km x 8km 랜드스케이프 지형 및 256 타일 스트리밍
        const landscape = new RedGPU.Landscape.Landscape(redGPUContext, [8000, 8000]);
        landscape.heightScale = 650;
        landscape.tileLoadingRadius = 2500.0;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
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

        // 6. 스플랫 레이어 4종
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../assets/terrain/terrainTest_001/weightTexture.jpg';
        const layerConfigs = [
            {name: 'Grass', key: 'grass', weightChannel: 'R', uvScale: [50, 50], roughness: 0.85},
            {name: 'Rock', key: 'rock', weightChannel: 'G', uvScale: [15, 15], roughness: 0.7},
            {name: 'Gravel', key: 'gravel', weightChannel: 'B', uvScale: [40, 40], roughness: 0.9},
            {name: 'Leave', key: 'leave', weightChannel: 'A', uvScale: [50, 50], roughness: 0.8}
        ];

        const layers = layerConfigs.map(cfg => {
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

        scene.landscape = landscape;

        // 7. 수목 식생 매니저
        const foliageManager = landscape.foliageManager;
        foliageManager.subCellSize = 100;

        let onFoliageTypeAdded = null;

        // 8. GUI 컨트롤 패널 생성
        const testPane = renderTestPane({
            redGPUContext,
            scene,
            view,
            orbitController,
            landscape,
            directionalLight,
            directionalShadowManager,
            foliageManager,
            layers
        });

        onFoliageTypeAdded = (type) => {
            testPane.addFoliageTypeToUI(type);
        };

        // 9. 식생 에셋 로딩
        initFoliageAssets({
            redGPUContext,
            foliageManager,
            onFoliageTypeAdded: (type) => {
                onFoliageTypeAdded?.(type);
            }
        });

        // 10. 렌더 루프 시작
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
 * [KO] GUI 컨트롤 패널 (컨트롤러, 식생, 지형, 조명, 레이어)
 * [EN] GUI control panel (Controller, Foliage, Landscape, Light, Layers)
 */
function renderTestPane({
                            redGPUContext,
                            scene,
                            view,
                            orbitController,
                            landscape,
                            directionalLight,
                            directionalShadowManager,
                            foliageManager,
                            layers
                        }) {
    // 3인칭 캐릭터 추종 카메라
    const characterOrbitController = new RedGPU.Camera.OrbitController(redGPUContext);
    characterOrbitController.distance = 5.5;
    characterOrbitController.tilt = -12;
    characterOrbitController.pan = 35;
    characterOrbitController.speedDistance = 0.5;
    characterOrbitController.centerX = -543;
    characterOrbitController.centerY = 300.8 + 1.2;
    characterOrbitController.centerZ = -2832.5;

    view.camera = characterOrbitController;
    landscape.nearDetailDistance = 250;

    let characterMesh = null;
    let characterController = null;
    let setCharacterState = null;

    const params = {
        cameraMode: 'Character',
        lodMetric: landscape.lodMetric
    };

    let paneInstance = null;
    let foliageFolder = null;
    let characterFolder = null;
    const pendingFoliageTypes = [];

    const bindCharacterFolder = (pane, cc) => {
        if (!pane || !cc || characterFolder) return;
        characterFolder = pane.addFolder({title: 'Character', expanded: false});
        characterFolder.addBinding(cc, 'floorOffset', {min: -0.2, max: 0.5, step: 0.01});
        characterFolder.addBinding(cc, 'speed', {min: 1.0, max: 15.0, step: 0.5});
        characterFolder.addBinding(cc, 'runSpeed', {min: 2.0, max: 25.0, step: 0.5});
        characterFolder.addBinding(cc, 'jumpForce', {min: 2.0, max: 20.0, step: 0.5});
        characterFolder.addBinding(cc, 'gravity', {min: 5.0, max: 60.0, step: 1.0});
    };

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

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            paneInstance = pane;
            setInterval(() => {
                paneInstance?.refresh();
            }, 500);

            // 1. Controller 설정 (Orbit / Character)
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
                const isChar = ev.value === 'Character';
                view.camera = isChar ? characterOrbitController : orbitController;
                if (characterController) characterController.useKeyboard = isChar;
                if (isChar && characterMesh) {
                    characterOrbitController.centerX = characterMesh.x;
                    characterOrbitController.centerY = characterMesh.y + 1.2;
                    characterOrbitController.centerZ = characterMesh.z;
                }
                landscape.nearDetailDistance = isChar ? 250 : 1000;
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

            // 2. 수목 식생 매니저 (Foliage)
            foliageFolder = pane.addFolder({title: 'Foliage', expanded: true});

            const managerFolder = foliageFolder.addFolder({title: 'foliageManager', expanded: true});
            managerFolder.addBinding(foliageManager, 'enabled');
            managerFolder.addBinding(foliageManager, 'useDepthPrepass');
            managerFolder.addBinding(foliageManager, 'subCellSize', {min: 20, max: 200, step: 5});
            managerFolder.addBinding(foliageManager, 'mountBudget', {min: 1, max: 64, step: 1});
            managerFolder.addBinding(foliageManager, 'unmountBudget', {min: 1, max: 128, step: 1});
            managerFolder.addBinding(foliageManager, 'debugSubCellColoration');

            managerFolder.addBinding(foliageManager, 'foliageCount', {readonly: true});
            managerFolder.addBinding(foliageManager, 'totalDrawCalls', {readonly: true});
            managerFolder.addBinding(foliageManager, 'depthPrepassDrawCalls', {readonly: true});
            managerFolder.addBinding(foliageManager, 'mainPassDrawCalls', {readonly: true});
            managerFolder.addBinding(foliageManager, 'shadowDrawCalls', {readonly: true});

            // 전역 바람 시뮬레이션 설정 (씬 레벨 WindManager)
            const windManager = scene.windManager;
            const windGlobalFolder = foliageFolder.addFolder({title: 'Global Wind (Scene)', expanded: true});
            windGlobalFolder.addBinding(windManager, 'enabled');
            windGlobalFolder.addBinding(windManager, 'strength', {min: 0.0, max: 3.0, step: 0.05});
            windGlobalFolder.addBinding(windManager, 'speed', {min: 0.0, max: 10.0, step: 0.1});
            windGlobalFolder.addBinding(windManager, 'frequency', {min: 0.01, max: 1.0, step: 0.01});
            windGlobalFolder.addBinding(windManager, 'flutterStrength', {min: 0.0, max: 2.0, step: 0.05});
            windGlobalFolder.addBinding(windManager, 'directionAngle', {min: 0, max: 360, step: 1});

            // 대기 중이던 식생 타입들 일괄 등록
            while (pendingFoliageTypes.length > 0) {
                addFoliageTypeToUI(pendingFoliageTypes.shift());
            }

            // 3. 지형 설정 (Landscape)
            const landscapeFolder = pane.addFolder({title: 'Landscape', expanded: false});
            landscapeFolder.addBinding(landscape, 'heightScale', {min: 0, max: 1500, step: 10});
            landscapeFolder.addBinding(landscape, 'receiveShadow');
            landscapeFolder.addBinding(landscape, 'nearDetailDistance', {min: 0, max: 2000, step: 10});

            // 타일 스트리밍 설정
            const streamFolder = landscapeFolder.addFolder({title: 'Tile Streaming', expanded: false});
            streamFolder.addBinding(landscape, 'tileLoadingRadius', {min: 1000, max: 8000, step: 250});
            streamFolder.addBinding(landscape, 'tileMaxLoadsPerFrame', {min: 1, max: 8, step: 1});
            streamFolder.addBinding(landscape.debuggerManager, 'spatialGrid');

            // LOD 설정
            const lodFolder = landscapeFolder.addFolder({title: 'LOD', expanded: false});
            lodFolder.addBinding(params, 'lodMetric', {
                options: {
                    'screenSize': 'screenSize',
                    'distance': 'distance'
                }
            }).on('change', (ev) => {
                landscape.lodMetric = ev.value;
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

            // Heightmap Shadow 설정
            const shadowFolder = landscapeFolder.addFolder({title: 'Heightmap Shadow', expanded: false});
            shadowFolder.addBinding(landscape, 'castHeightmapShadow');
            shadowFolder.addBinding(landscape, 'heightmapShadowSteps', {min: 4, max: 32, step: 1});
            shadowFolder.addBinding(landscape, 'heightmapShadowSoftness', {min: 1, max: 20, step: 0.5});
            shadowFolder.addBinding(landscape, 'heightmapShadowDistance', {min: 500, max: 6000, step: 100});

            // Debug 설정
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

            // 4. 조명 및 그림자 (Light & Shadow)
            const lightFolder = pane.addFolder({title: 'Light & Shadow', expanded: false});
            lightFolder.addBinding(directionalLight, 'lux', {min: 0, max: 200000, step: 2000});
            lightFolder.addBinding(directionalLight, 'elevation', {min: 5, max: 90, step: 1});
            lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            lightFolder.addBinding(directionalShadowManager, 'strength', {min: 0.0, max: 1.0, step: 0.05});
            lightFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {min: 50, max: 800, step: 25});

            // 5. 스플랫 레이어 (Layers)
            const splatFolder = pane.addFolder({title: 'Layers', expanded: false});
            layers.forEach((layer) => {
                const layerSubFolder = splatFolder.addFolder({title: layer.name, expanded: false});
                layerSubFolder.addBinding(layer, 'enabled');
                layerSubFolder.addBinding(layer, 'stochasticTiling');
                layerSubFolder.addBinding(layer, 'stochasticScale', {min: 0.1, max: 5.0, step: 0.1});
                const uvProxy = {uvScale: layer.uvScale[0]};
                layerSubFolder.addBinding(uvProxy, 'uvScale', {min: 5, max: 150, step: 1})
                    .on('change', (ev) => {
                        layer.uvScale = [ev.value, ev.value];
                    });
                layerSubFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.05});
            });
        }
    });

    /**
     * [KO] 등록된 식생 타입(FoliageType) 개별 컨트롤러 추가
     * [EN] Adds individual controls for a registered FoliageType
     */
    const addFoliageTypeToUI = (type) => {
        if (!foliageFolder) {
            pendingFoliageTypes.push(type);
            return;
        }
        const typeFolder = foliageFolder.addFolder({title: type.name, expanded: true});

        // 1. Streaming & Stats (스트리밍 및 인스턴스 현황)
        const streamingStatsFolder = typeFolder.addFolder({title: 'Streaming & Stats', expanded: true});
        streamingStatsFolder.addBinding(type, 'streamingRadius', {min: 100, max: 5000, step: 50});
        streamingStatsFolder.addBinding(type, 'activeInstanceCount', {readonly: true});
        streamingStatsFolder.addBinding(type, 'mountedSubCellCount', {readonly: true});
        streamingStatsFolder.addBinding(type, 'maxInstances', {readonly: true});
        streamingStatsFolder.addBinding(type, 'lastMountedCount', {readonly: true});
        streamingStatsFolder.addBinding(type, 'lastUnmountedCount', {readonly: true});
        streamingStatsFolder.addButton({title: 'clearSubCellCache'}).on('click', () => {
            type.clearSubCellCache();
        });

        // 2. Placement & Density (배치 및 밀도)
        const placementFolder = typeFolder.addFolder({title: 'Placement & Density', expanded: true});
        const layerOptions = {'(All / None)': ''};
        if (landscape?.layers) {
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
        placementFolder.addBinding(type, 'densityScaleByWeight');
        placementFolder.addBinding(type, 'subMeshCount', {readonly: true});
        placementFolder.addBinding(type, 'drawCallCount', {readonly: true});
        placementFolder.addButton({title: 'rebake'}).on('click', () => {
            type.rebake();
        });

        // 3. Transform & Slope (스케일 및 경사각)
        const transformFolder = typeFolder.addFolder({title: 'Transform & Slope', expanded: true});
        transformFolder.addBinding(type, 'bottomOffset', {min: -5.0, max: 5.0, step: 0.05});
        transformFolder.addBinding(type, 'minSlope', {min: 0.0, max: 89.0, step: 1.0});
        transformFolder.addBinding(type, 'maxSlope', {min: 1.0, max: 90.0, step: 1.0});
        const alignBinding = transformFolder.addBinding(type, 'alignToNormal');
        const alignFactorBinding = transformFolder.addBinding(type, 'alignFactor', {min: 0.0, max: 1.0, step: 0.05});
        alignFactorBinding.disabled = !type.alignToNormal;
        alignBinding.on('change', (ev) => {
            alignFactorBinding.disabled = !ev.value;
        });

        // 4. Ground Blend (지형 컬러 블렌딩)
        const groundBlendFolder = typeFolder.addFolder({title: 'Ground Blend', expanded: true});
        groundBlendFolder.addBinding(type, 'groundBlendStrength', {min: 0.0, max: 1.0, step: 0.05});
        groundBlendFolder.addBinding(type, 'groundBlendRange', {min: 0.1, max: 10.0, step: 0.1});

        // 5. LOD & Impostor (컬링 거리 및 임포스터)
        const lodFolder = typeFolder.addFolder({title: 'LOD & Impostor', expanded: true});
        lodFolder.addBinding(type, 'useDepthPrepass');
        lodFolder.addBinding(type, 'fadeStartDistance', {min: 50, max: 8000, step: 50});
        lodFolder.addBinding(type, 'cullingDistance', {min: 100, max: 10000, step: 50});
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
                const lodProxy = {lodDistance: lodInfo.lodDistance};
                subFolder.addBinding(lodProxy, 'lodDistance', {
                    min: 10,
                    max: 1000,
                    step: 5
                }).on('change', (ev) => {
                    type.setLODDistance(idx, ev.value);
                });
            }
            subFolder.addBinding(lodInfo, 'subMeshCount', {readonly: true});
        });

        // 6. Shadow (그림자)
        const shadowFolder = typeFolder.addFolder({title: 'Shadow', expanded: true});
        shadowFolder.addBinding(type, 'castShadow');
        shadowFolder.addBinding(type, 'shadowCullDistance', {min: 50, max: 3000, step: 25});

        // 7. Wind & Motion
        const windFolder = typeFolder.addFolder({title: 'Wind & Motion', expanded: true});
        windFolder.addBinding(type, 'windMultiplier', {min: 0.0, max: 3.0, step: 0.05});
        windFolder.addBinding(type, 'windFlutterMultiplier', {min: 0.0, max: 3.0, step: 0.05});
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
        addFoliageTypeToUI,
        update
    };
}

/**
 * [KO] 3D 캐릭터 로딩 및 물리 컨트롤러 구성
 * [EN] Loads 3D character and configures physics controller
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

/**
 * [KO] 소나무 식생 에셋 로딩 (Multi-LOD Tree + Octahedral Impostor)
 * [EN] Loads pine tree foliage asset (Multi-LOD Tree + Octahedral Impostor)
 */
function initFoliageAssets({redGPUContext, foliageManager, onFoliageTypeAdded}) {
    // 소나무 (test.glb - Multi-LOD Tree + Octahedral Impostor)
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
                        if (!treeGroups.has(baseName)) treeGroups.set(baseName, {});
                        treeGroups.get(baseName)[`lod${lodLevel}`] = node;
                        return;
                    }
                }
                const children = node.children || [];
                for (let i = 0; i < children.length; i++) traverse(children[i]);
            };
            traverse(root);

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

                const foliage = foliageManager.addFoliage({
                    name: `Tree_${baseName}`,
                    lods: lodConfigs,
                    densityPerHectare: 120.0,
                    streamingRadius: 1000,
                    minScale: [0.4, 0.4, 0.4],
                    maxScale: [0.7, 0.75, 0.7],
                    cullingDistance: 6000,
                    targetLayer: 'Grass',
                });

                onFoliageTypeAdded?.(foliage);
            });
        }
    );
}

