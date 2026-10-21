import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

/**
 * [KO] Lake with Landscape 예제
 * [EN] Lake with Landscape Example
 *
 * [KO] 대규모 랜드스케이프 지형과 결합된 호수 수체(Lake)를 구성하여, 자연스러운 해안선 웻니스, 수중 굴절/코스틱스, 캐릭터 파동 인터랙션을 종합 시연합니다.
 * [EN] A showcase combining large-scale terrain landscape with an interactive Lake, highlighting shoreline wetness, underwater optics, caustics, and character wave ripples.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 8.5;
        controller.tilt = -10;
        controller.pan = 180;
        controller.speedDistance = 0.2;
        controller.minDistance = 3;
        controller.maxDistance = 25;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const currentIbl = new RedGPU.Resource.IBL(redGPUContext, '../../../../assets/hdr/field.hdr', 35000);
        view.ibl = currentIbl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, currentIbl.environmentTexture, 35000);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 61.6;
        directionalLight.azimuth = 98.0;
        directionalLight.lux = 105000;
        scene.lightManager.addDirectionalLight(directionalLight);

        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 350;

        // [KO] 랜드스케이프 지형(400x400, 높이 10m) 및 4채널 스플랫 레이어 구성
        // [EN] Configure Landscape terrain (400x400, height 10m) and 4-channel splat layers
        const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [400, 400];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 10.0;
        landscape.lodMaxLevel = 4;
        landscape.tileLoadingRadius = 300;
        landscape.globalHeightmapUrl = '../../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        const assetPath = '../../../../assets/terrain/terrainTest_001/layer/';
        const weightTexturePath = '../../../../assets/terrain/terrainTest_001/weightTexture.jpg';
        [
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
        ].forEach((cfg) => {
            landscape.addLayer({
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
            });
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
        scene.landscape = landscape;

        // [KO] 산악 분지와 맞닿는 호수 수체(Lake) 생성 및 선형('rgba8unorm') 듀얼 노멀 텍스처 바인딩
        // [EN] Create Lake water body matching the mountain basin and bind linear ('rgba8unorm') dual normal textures
        const lake = new RedGPU.Water.Lake(redGPUContext, 300, 300, 96, 96);
        lake.y = 6.5;
        lake.waveAmplitude = 0.045;

        lake.waterMaterial.baseColor.setColorByHEX('#179fa0');
        lake.waterMaterial.deepColor.setColorByHEX('#042436');
        lake.waterMaterial.refractionStrength = 0.85;
        lake.waterMaterial.causticsStrength = 1.2;
        lake.waterMaterial.depthFadeDistance = 1.0;
        lake.waterMaterial.roughness = 0.04;
        lake.waterMaterial.normalTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        lake.waterMaterial.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../../assets/water/lake_normal_detail.png',
            true,
            null,
            null,
            'rgba8unorm'
        );
        scene.addWater(lake);

        // [KO] 호숫가 및 산기슭 소나무(Pine Trees) Multi-LOD 식생 시스템 구성
        // [EN] Configure Multi-LOD pine tree foliage system along the shoreline and foothills
        const foliageManager = landscape.foliageManager;
        foliageManager.debugSubCellColoration = false;

        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../../assets/terrain/test.glb',
            (treeLoader) => {
                const root = treeLoader.resultMesh;
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

                if (treeGroups.size > 0) {
                    treeGroups.forEach((lods, baseName) => {
                        const lodConfigs = [];
                        const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                        if (!lod0) return;

                        lodConfigs.push({mesh: lod0, lodDistance: 45, receiveShadow: true});
                        if (lods.lod1 && lods.lod1 !== lod0) {
                            lodConfigs.push({mesh: lods.lod1, lodDistance: 110, receiveShadow: true});
                        }
                        if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) {
                            lodConfigs.push({mesh: lods.lod2, lodDistance: 220, receiveShadow: false});
                        }

                        foliageManager.addType({
                            name: `Tree_${baseName}`,
                            lods: lodConfigs,
                            densityPerHectare: 1200.0,
                            densityMultiplier: 1.0,
                            minWeightThreshold: 0.01,
                            minScale: [0.25, 0.25, 0.25],
                            maxScale: [0.52, 0.56, 0.52],
                            randomRotationY: true,
                            useImpostor: false,
                            cullingDistance: 600,
                            targetLayer: 'Grass',
                            bottomOffset: -0.85,
                            alignToNormal: true,
                            alignFactor: 0.2,
                            minSlope: 0.0,
                            maxSlope: 35.0
                        });
                    });
                }
            }
        );

        let characterMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';

        // [KO] 로컬 스킨드 메시(Soldier.glb) 로드 및 수체 상호작용 재귀 등록
        // [EN] Load local skinned mesh (Soldier.glb) and recursively register for water interaction
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../../assets/gltf/Soldier.glb',
            (loader) => {
                characterMesh = loader.resultMesh;
                characterMesh.x = 0;
                characterMesh.z = 32;
                characterMesh.y = landscape.getHeightAt(characterMesh.x, characterMesh.z);

                characterMesh.setCastShadowRecursively(true);
                characterMesh.setReceiveShadowRecursively(true);
                scene.addChild(characterMesh);

                characterMesh.enableWaterInteraction = true;
                lake.interactionFollowTarget = characterMesh;

                controller.centerX = characterMesh.x;
                controller.centerY = characterMesh.y + 1.2;
                controller.centerZ = characterMesh.z;

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
                    [
                        ['Idle', 'Walk'], ['Idle', 'Run'],
                        ['Walk', 'Idle'], ['Walk', 'Run'],
                        ['Run', 'Idle'], ['Run', 'Walk'],
                    ].forEach(([from, to]) => {
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

                renderTestPane(redGPUContext, lake, landscape, directionalLight, characterController);
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (characterController && characterMesh) {
                characterController.update(view, time);

                controller.centerX += (characterMesh.x - controller.centerX) * 0.1;
                controller.centerY += (characterMesh.y + 1.2 - controller.centerY) * 0.1;
                controller.centerZ += (characterMesh.z - controller.centerZ) * 0.1;

                if (characterController.isRunning) {
                    targetStateName = 'Run';
                } else if (characterController.isMoving) {
                    targetStateName = 'Walk';
                } else {
                    targetStateName = 'Idle';
                }
            }
        });
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, lake, landscape, directionalLight, characterController) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        gui: (pane) => {
            if (characterController) {
                const folderChar = pane.addFolder({title: 'SimpleCharacterController', expanded: true});
                folderChar.addBinding(characterController, 'speed', {min: 1.0, max: 8.0, step: 0.2});
                folderChar.addBinding(characterController, 'runSpeed', {min: 3.0, max: 15.0, step: 0.5});
                folderChar.addBinding(characterController, 'jumpForce', {min: 4.0, max: 16.0, step: 0.5});
            }

            const folderLake = pane.addFolder({title: 'Lake', expanded: true});
            folderLake.addBinding(lake, 'y', {min: -1.0, max: 12.0, step: 0.1});
            folderLake.addBinding(lake, 'waveAmplitude', {min: 0, max: 0.15, step: 0.002});
            folderLake.addBinding(lake, 'waveWavelength', {min: 2, max: 40, step: 0.5});
            folderLake.addBinding(lake, 'maxPenetration', {min: 0.05, max: 0.8, step: 0.02});
            folderLake.addBinding(lake, 'interactionDomainSize', {min: 5, max: 60, step: 1});

            const folderMat = pane.addFolder({title: 'LakeMaterial', expanded: false});
            folderMat.addBinding(lake.waterMaterial, 'flowRateScale', {min: 0.0, max: 0.1, step: 0.002});
            folderMat.addBinding(lake.waterMaterial, 'roughness', {min: 0.01, max: 0.5, step: 0.01});
            folderMat.addBinding(lake.waterMaterial, 'refractionStrength', {min: 0.0, max: 1.0, step: 0.02});
            folderMat.addBinding(lake.waterMaterial, 'causticsStrength', {min: 0.0, max: 2.0, step: 0.05});
            folderMat.addBinding(lake.waterMaterial, 'causticsScale', {min: 0.2, max: 3.0, step: 0.1});
            folderMat.addBinding(lake.waterMaterial, 'depthFadeDistance', {min: 0.1, max: 3.0, step: 0.1});
            folderMat.addBinding(lake.waterMaterial, 'normalTiling', {min: 2.0, max: 60.0, step: 1.0});
            folderMat.addBinding(lake.waterMaterial, 'normalDetailTiling', {min: 5.0, max: 100.0, step: 1.0});

            const folderLandscape = pane.addFolder({title: 'Landscape', expanded: false});
            folderLandscape.addBinding(landscape, 'heightScale', {min: 1.0, max: 30.0, step: 0.5});

            const foliageManager = landscape?.foliageManager;
            if (foliageManager) {
                const folderFoliage = pane.addFolder({title: 'Foliage', expanded: false});
                folderFoliage.addBinding(foliageManager, 'enabled');
            }

            const folderSun = pane.addFolder({title: 'DirectionalLight', expanded: false});
            folderSun.addBinding(directionalLight, 'elevation', {min: 5, max: 89, step: 1});
            folderSun.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            folderSun.addBinding(directionalLight, 'lux', {min: 0, max: 150000, step: 2000});
        }
    });
};
