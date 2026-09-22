import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 설정 (3인칭 추적 OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 8.5;
        controller.tilt = -10;
        controller.pan = 180;
        controller.speedDistance = 0.2;
        controller.minDistance = 3;
        controller.maxDistance = 25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 2. 환경 맵(IBL) 및 스카이박스 설정
        const currentHdrPath = '../../../../assets/hdr/field.hdr';
        const currentIbl = new RedGPU.Resource.IBL(redGPUContext, currentHdrPath, 35000);
        view.ibl = currentIbl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, currentIbl.environmentTexture, 35000);

        // 3. 태양광(DirectionalLight) 및 지형 스케일 섀도우 매니저 (field.hdr 스카이박스 태양 위치 정밀 동기화)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 61.6; // [field.hdr 분석 고도각 61.6도]
        directionalLight.azimuth = 98.0;   // [field.hdr 분석 방위각 98.0도]
        directionalLight.lux = 105000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 350;

        // 4. 10m 높이 랜드스케이프 지형 (Landscape)
        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [400, 400];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 10.0; // [지형 최대 높이 10m]
        landscape.maxLODLevel = 4;
        landscape.loadingRadius = 300;
        landscape.globalHeightmapUrl = '../../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        // 4-1. PBR 멀티 텍스처링 레이어 (Grass, Gravel, Rock, Leave)
        const assetPath = '../../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../../assets/terrain/terrainTest_001/weightTexture.jpg';

        const layersConfig = [
            {
                name: 'Grass',
                key: 'grass',
                weightChannel: 'R',
                uvScale: [8, 8],
                roughness: 0.85,
                metallic: 0.0,
                normalIntensity: 1.5,
                aoIntensity: 1.0
            },
            {
                name: 'Gravel',
                key: 'gravel',
                weightChannel: 'B',
                uvScale: [8, 8],
                roughness: 0.9,
                metallic: 0.0,
                normalIntensity: 1.8,
                aoIntensity: 1.2
            },
            {
                name: 'Rock',
                key: 'rock',
                weightChannel: 'G',
                uvScale: [4, 4],
                roughness: 0.7,
                metallic: 0.05,
                normalIntensity: 2.2,
                aoIntensity: 1.5
            },
            {
                name: 'Leave',
                key: 'leave',
                weightChannel: 'A',
                uvScale: [8, 8],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ];

        layersConfig.forEach((cfg) => {
            const layer = new RedGPU.Display.Landscape.LandscapeLayer({
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
                aoIntensity: cfg.aoIntensity,
                tintColor: '#ffffff'
            });
            landscape.addLayer(layer);
        });

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

        scene.addLandscape(landscape);

        // 5. WaterLake (산악 분지와 맞닿는 고품질 호수 수체)
        const lake = new RedGPU.Display.WaterLake(
            redGPUContext,
            300,
            300,
            96,
            96
        );
        lake.y = 6.5; // 지형의 계곡 분지와 맞물리는 수면 고도 (지형 높이 0~10m의 약 65% 수위)

        lake.waveAmplitude = 0.045;
        lake.waveWavelength = 16.0;
        lake.waveSpeed = 1.0;
        lake.interactionDomainSize = 35.0;
        lake.maxPenetration = 0.35;

        // 5-1. 수면 광학 머티리얼 및 듀얼 노멀 텍스처
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
        // [중요] 노멀 맵은 색상이 아닌 방향 벡터(X,Y,Z) 데이터이므로, sRGB 감마 보정으로 인한 왜곡을 방지하기 위해 선형 포맷인 'rgba8unorm'을 명시합니다.
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm' // [포맷 명시] sRGB 감마 변환 방지 (Linear Color Space 유지)
        );

        scene.addChild(lake);

        // 6. 호숫가 및 산기슭 소나무(Pine Trees) Multi-LOD 식생 시스템 구성
        const foliageManager = landscape.foliageManager;
        foliageManager.debugSubCellColoration = false;
        foliageManager.subCellSize = 50; // 400x400 월드에 최적화된 서브셀 크기
        foliageManager.streamingRadius = 400;

        // 스플랫맵 픽셀 캐시 비동기 로딩 완료 시 식생 전체 재배치(repopulate) 보장
        const splatImg = new Image();
        splatImg.onload = () => {
            foliageManager.repopulateAll();
        };
        splatImg.src = weightTexturePath;

        const TREE_MODEL_URL = '../../../../assets/terrain/test.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            TREE_MODEL_URL,
            (treeLoader) => {
                const root = treeLoader.resultMesh;
                const treeGroups = new Map();

                // Multi-LOD 노드(LOD0, LOD1, LOD2) 재귀적 탐색 및 그룹화
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

                if (treeGroups.size > 0) {
                    treeGroups.forEach((lods, baseName) => {
                        const lodConfigs = [];
                        const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                        if (!lod0) return;

                        // [LOD 설정] 근거리: LOD0 (45m), 중거리: LOD1 (110m), 원거리: LOD2 (220m)
                        lodConfigs.push({mesh: lod0, lodDistance: 45, receiveShadow: true});
                        if (lods.lod1 && lods.lod1 !== lod0) {
                            lodConfigs.push({mesh: lods.lod1, lodDistance: 110, receiveShadow: true});
                        }
                        if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                            lodConfigs.push({mesh: lods.lod2, lodDistance: 220, receiveShadow: false});
                        }

                        // RedGPU GPU 인스턴스 기반 Multi-LOD 식생 등록 (현실적인 소나무 성목 크기: 8m ~ 17m)
                        foliageManager.addFoliageType({
                            name: `Tree_${baseName}`,
                            type: RedGPU.Display.Landscape.FOLIAGE_TYPE.FOLIAGE,
                            lods: lodConfigs,
                            densityPerHectare: 1200.0, // 400x400 (16헥타르) 분지 지형을 아우르는 빽빽한 소나무 숲
                            densityMultiplier: 1.0,
                            minWeightThreshold: 0.01,
                            minScale: [0.25, 0.25, 0.25], // 높이 약 7.9m (캐릭터 키 1.8m 대비 4.4배)
                            maxScale: [0.52, 0.56, 0.52], // 높이 약 16.4m~17.6m (캐릭터 키 1.8m 대비 9~10배)
                            randomRotationY: true,
                            useImpostor: false,
                            cullingDistance: 600,
                            fadeStartDistance: 450,
                            targetLayer: 'Grass',
                            bottomOffset: -0.85,
                            alignToNormal: true,
                            alignFactor: 0.2, // 산기슭에서도 나무의 수직 직립성을 자연스럽게 보존
                            minSlope: 0.0,
                            maxSlope: 35.0
                        });
                    });
                }
            }
        );

        // 7. GLTF 스킨드 메시 캐릭터(Soldier) 로딩 및 컨트롤러 초기화
        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';


        const MODEL_URL = '../../../../assets/gltf/Soldier.glb';

        new RedGPU.GLTFLoader(
            redGPUContext,
            MODEL_URL,
            (loader) => {
                characterMesh = loader.resultMesh;

                // 호숫가 물 밖 언덕 위에서 스폰
                characterMesh.x = 0;
                characterMesh.z = 32;
                characterMesh.y = landscape.getHeightAt(characterMesh.x, characterMesh.z);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                // 스킨드 메시를 물 상호작용 대상으로 재귀 등록
                characterMesh.setEnableWaterInteractionRecursively(true, 1.4);

                // 카메라 추적 중심점 정렬
                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.2;
                controller.centerZ = characterMesh.z;

                // 캐릭터 이동 컨트롤러 (지형 실시간 높이 바인딩)
                characterController = new RedGPU.Charactor.SimpleCharacterController(
                    redGPUContext,
                    characterMesh,
                    view.camera,
                    {
                        speed: 3.5,
                        runSpeed: 7.0,
                        gravity: 24.0,
                        jumpForce: 8.0,
                        getFloorHeight: (x, z) => landscape.getHeightAt(x, z)
                    }
                );

                // 애니메이션 클립 바인딩 및 상태 머신(AnimStateMachine) 구성
                const clips = loader.parsingResult?.animations;
                if (clips && clips.length > 0) {
                    const idleState = clips[0];
                    const runState = clips[1];
                    const walkState = clips[3] || clips[2];

                    idleState.name = 'Idle';
                    walkState.name = 'Walk';
                    runState.name = 'Run';

                    stateMachine = new RedGPU.AnimStateMachine(idleState);
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
                            conditions: () => targetStateName === to,
                        });
                    });

                    loader.stopAnimation();
                    loader.playAnimation(idleState);
                    if (loader.activeAnimations.length > 0) {
                        loader.activeAnimations[0].animStateMachine = stateMachine;
                    }
                }

                // GUI 구성
                renderTestPane(redGPUContext, lake, landscape, directionalLight, characterController);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        // 7. 렌더 루프 및 리사이즈 등록
        const renderer = new RedGPU.Renderer();
        let lastTime = null;

        renderer.start(redGPUContext, (time) => {
            const dt = lastTime !== null ? (time - lastTime) * 0.001 : 0;
            lastTime = time;

            // 캐릭터 물리 이동, 카메라 추적, 애니메이션 갱신
            if (characterController && characterMesh) {
                characterController.update(view, time);

                // 카메라가 캐릭터 위치를 부드럽게 추적 (Zero-GC lerp)
                controller.centerX += (characterMesh.x - controller.centerX) * 0.1;
                controller.centerY += (characterMesh.y + 1.2 - controller.centerY) * 0.1;
                controller.centerZ += (characterMesh.z - controller.centerZ) * 0.1;

                // 이동 및 달리기 상태 판정 -> 애니메이션 크로스페이드 전이
                if (characterController.isRunning) {
                    targetStateName = 'Run';
                } else if (characterController.isMoving) {
                    targetStateName = 'Walk';
                } else {
                    targetStateName = 'Idle';
                }

            }
        });

        /**
         * @param {RedGPU.RedResizeEvent} event [KO] 리사이즈 이벤트 객체 [EN] Resize event object
         */
        redGPUContext.onResize = (event) => {
            console.log("Canvas resized:", event.width, event.height);
        };
    }
);

/**
 * [KO] Tweakpane GUI 패널 구성 함수
 */
function renderTestPane(redGPUContext, lake, landscape, directionalLight, characterController) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        gui: (pane) => {
            // 1. SimpleCharacterController (캐릭터 조작)
            if (characterController) {
                const folderChar = pane.addFolder({title: 'SimpleCharacterController (캐릭터 조작)', expanded: true});
                folderChar.addBinding(characterController, 'speed', {min: 1.0, max: 8.0, step: 0.2});
                folderChar.addBinding(characterController, 'runSpeed', {min: 3.0, max: 15.0, step: 0.5});
                folderChar.addBinding(characterController, 'jumpForce', {min: 4.0, max: 16.0, step: 0.5});
            }

            // 2. WaterLake (호수 설정)
            const folderLake = pane.addFolder({title: 'WaterLake (호수 설정)', expanded: true});
            folderLake.addBinding(lake, 'y', {min: -1.0, max: 12.0, step: 0.1});
            folderLake.addBinding(lake, 'waveAmplitude', {min: 0, max: 0.15, step: 0.002});
            folderLake.addBinding(lake, 'waveWavelength', {min: 2, max: 40, step: 0.5});
            folderLake.addBinding(lake, 'waveSpeed', {min: 0, max: 4, step: 0.1});
            folderLake.addBinding(lake, 'maxPenetration', {min: 0.05, max: 0.8, step: 0.02});
            folderLake.addBinding(lake, 'interactionDomainSize', {min: 5, max: 60, step: 1});

            // 3. Water Material (수면 광학)
            const folderMat = pane.addFolder({title: 'Water Material (수면 광학)', expanded: false});
            folderMat.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            folderMat.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 2.0, step: 0.05});
            folderMat.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 3.0, step: 0.05});
            folderMat.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.2, max: 3.0, step: 0.1});
            folderMat.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.1, max: 3.0, step: 0.1});
            folderMat.addBinding(lake.waterMaterial, 'windSpeed', {min: 0.0, max: 0.1, step: 0.005});
            folderMat.addBinding(lake.waterMaterial, 'normalTiling', {min: 2.0, max: 60.0, step: 1.0});
            folderMat.addBinding(lake.waterMaterial, 'normalDetailTiling', {min: 5.0, max: 100.0, step: 1.0});

            // 4. Landscape (지형 설정)
            const folderLandscape = pane.addFolder({title: 'Landscape (지형 설정)', expanded: false});
            folderLandscape.addBinding(landscape, 'heightScale', {min: 1.0, max: 30.0, step: 0.5});

            // 5. DirectionalLight (태양광)
            const folderSun = pane.addFolder({title: 'DirectionalLight (태양광)', expanded: false});
            folderSun.addBinding(directionalLight, 'elevation', {min: 5, max: 89, step: 1});
            folderSun.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            folderSun.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 2000});
        }
    });
}
