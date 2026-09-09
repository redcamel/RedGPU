import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";
import FoliageImpostorDebugViewer from "./FoliageImpostorDebugViewer.js";


const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 1005;
        controller.z = 0;
        controller.tilt = -10;
        controller.moveSpeed = 1500;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 1. IBL & SkyBox 리소스 목록 및 초기화
        const iblList = [
            {
                name: '2K - the sky is on fire',
                path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
                luminance: 30000
            },
            {name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr', luminance: 35000},
            {name: 'field', path: '../../../assets/hdr/field.hdr', luminance: 30000},
            {name: 'neutral', path: '../../../assets/hdr/neutral.37290948.hdr', luminance: 30000},
            {name: 'pisa', path: '../../../assets/hdr/pisa.hdr', luminance: 25000}
        ];

        let currentHdr = iblList[2];
        let currentIbl = new RedGPU.Resource.IBL(redGPUContext, currentHdr.path, currentHdr.luminance);
        view.ibl = currentIbl;

        let currentSkybox = new RedGPU.Display.SkyBox(redGPUContext, currentIbl.environmentTexture, currentHdr.luminance);
        view.skybox = currentSkybox;

        // view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext)

        // 2. Directional Light 및 Shadow 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 그림자 설정 (산악 스케일에 맞춘 600m 가시거리)
        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 600;




        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 1500;
        landscape.maxLODLevel = 5;
        landscape.loadingRadius = 4000;
        landscape.baseColor.setColorByHEX('#387d42');
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';

        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        const layers = [
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
                name: 'Leave',
                key: 'leave',
                weightChannel: 'A',
                uvScale: [300, 300],
                roughness: 0.8,
                metallic: 0.0,
                normalIntensity: 1.4,
                aoIntensity: 1.0
            }
        ].map(cfg => {
            const layer = new RedGPU.Display.Landscape.LandscapeLayer({
                name: cfg.name,
                baseColorTexture: `${assetPath}${cfg.key}.jpg`,
                normalTexture: `${assetPath}${cfg.key}_normal.jpg`,
                ormTexture: `${assetPath}${cfg.key}_orm.jpg`,
                weightTexture: splatMapPath,
                weightChannel: cfg.weightChannel,
                uvScale: cfg.uvScale,
                roughness: cfg.roughness,
                metallic: cfg.metallic,
                normalIntensity: cfg.normalIntensity,
                aoIntensity: cfg.aoIntensity,
                tintColor: '#ffffff'
            });
            landscape.addLayer(layer);
            return layer;
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

        const foliageManager = landscape.foliageManager;
        foliageManager.debugSubCellColoration = true;
        foliageManager.subCellSize = 100;
        foliageManager.streamingRadius = 600;

        // 1. Pine Tree (Multi-LOD) 로드
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/test.glb',
            (loader) => {
                const root = loader.resultMesh;
                console.log('🌲 [test.glb] Loaded Root:', root);
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

                console.log(`🌲 [test.glb] Discovered ${treeGroups.size} tree variants:`, Array.from(treeGroups.keys()));

                if (treeGroups.size > 0) {
                    console.log('treeGroups', treeGroups);
                    treeGroups.forEach((lods, baseName) => {
                        const lodConfigs = [];
                        const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                        if (!lod0) return;

                        lodConfigs.push({mesh: lod0, lodDistance: 50, receiveShadow: true});
                        if (lods.lod1 && lods.lod1 !== lod0) lodConfigs.push({
                            mesh: lods.lod1,
                            lodDistance: 100,
                            receiveShadow: true
                        });
                        if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) lodConfigs.push({
                            mesh: lods.lod2,
                            lodDistance: 180,
                            receiveShadow: false // 100m 밖 로우폴리는 CSM 샘플링 스킵하여 프레임 최적화
                        });

                        foliageManager.addFoliageType({
                            name: `Tree_${baseName}`,
                            type: RedGPU.Display.Landscape.FOLIAGE_TYPE.FOLIAGE,
                            lods: lodConfigs,
                            densityPerHectare: 120.0,
                            densityMultiplier: 1.0,
                            minWeightThreshold: 0.02,
                            minScale: [0.4, 0.4, 0.4],
                            maxScale: [0.7, 0.75, 0.7],
                            randomRotationY: true,
                            useImpostor: true,
                            cullingDistance: 6000,
                            fadeStartDistance: 4500,
                            targetLayer: 'Grass',
                            bottomOffset: 0.0
                        });
                    });
                }
            }
        );

        // 2. River Rock (Static Rock Models) 로드
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/river_rock.glb',
            (loader) => {
                const root = loader.resultMesh;
                console.log('🪨 [river_rock.glb] Loaded Root:', root);
                const rockNodes = [];

                const findRocks = (node) => {
                    if (!node) return;
                    if (node.name && node.name.startsWith('RiverRock') && !node.name.includes('lambert')) {
                        rockNodes.push(node);
                        return;
                    }
                    const children = node.children || [];
                    for (let i = 0; i < children.length; i++) {
                        findRocks(children[i]);
                    }
                };

                findRocks(root);

                console.log(`🪨 [river_rock.glb] Discovered ${rockNodes.length} rock variants:`, rockNodes.map(n => n.name));

                if (rockNodes.length > 0) {
                    const rockMesh = rockNodes[0];
                    foliageManager.addFoliageType({
                        name: 'Rock_RiverRock',
                        type: RedGPU.Display.Landscape.FOLIAGE_TYPE.BASIC,
                        lods: [
                            {
                                mesh: rockMesh,
                                lodDistance: 350,
                                receiveShadow: true
                            }
                        ],
                        densityPerHectare: 25.0,
                        densityMultiplier: 1.0,
                        minWeightThreshold: 0.03,
                        minScale: [0.3, 0.3, 0.3],
                        maxScale: [0.8, 0.8, 0.8],
                        randomRotationY: true,
                        useImpostor: false,
                        cullingDistance: 3500,
                        fadeStartDistance: 2800,
                        targetLayer: 'Rock',
                        bottomOffset: 0.1
                    });
                }
            }
        );


        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 리사이즈 이벤트 처리
        /**
         * @param {RedGPU.RedResizeEvent} event [KO] 리사이즈 이벤트 객체 [EN] Resize event object
         */
        redGPUContext.onResize = (event) => {
            console.log("Canvas resized:", event.width, event.height);
        };

        new RedGPUExampleHelper(redGPUContext, {
            RedGPU,
            directionalShadow: true,
            ibl: false,
            skybox: false,
            gui: (pane) => {
                const folderCam = pane.addFolder({title: 'Camera', expanded: true});
                folderCam.addBinding(controller, 'moveSpeed', {min: 500, max: 20000, step: 500});

                const lightFolder = pane.addFolder({title: '☀️ Directional Light', expanded: false});
                lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
                lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
                lightFolder.addBinding(directionalLight, 'lux', {
                    min: 0,
                    max: 200000,
                    step: 1000
                });

                const folderLandscape = pane.addFolder({title: 'Landscape', expanded: false});
                folderLandscape.addBinding(landscape, 'enableHeightmapShadow');
                folderLandscape.addBinding(landscape, 'heightmapShadowSteps', {min: 4, max: 48, step: 1});
                folderLandscape.addBinding(landscape, 'heightmapShadowDistance', {min: 500, max: 8000, step: 100});
                folderLandscape.addBinding(landscape, 'heightmapShadowSoftness', {min: 0.1, max: 20.0, step: 0.5});
                folderLandscape.addBinding(landscape, 'receiveShadow');

                const folderFoliage = pane.addFolder({title: 'foliageManager', expanded: true});

                const subCellFolder = folderFoliage.addFolder({title: 'subCell', expanded: true});
                subCellFolder.addBinding(foliageManager, 'debugSubCellColoration');
                subCellFolder.addBinding(foliageManager, 'subCellSize', {
                    options: {
                        '50': 50,
                        '100': 100,
                        '200': 200,
                        '250': 250,
                        '500': 500,
                    }
                });
                subCellFolder.addBinding(foliageManager, 'streamingRadius', {
                    min: 100,
                    max: 3000,
                    step: 50
                });

                const subCellStats = {
                    get activeSubCellCount() {
                        return foliageManager.spatialGrid?.activeSubCellCount ?? 0;
                    }
                };
                subCellFolder.addBinding(subCellStats, 'activeSubCellCount', {readonly: true});

                const globalStats = {
                    get totalTypes() {
                        return foliageManager.typeList.length;
                    },
                    get totalInstances() {
                        return foliageManager.megaBuffer?.totalActiveInstances ?? 0;
                    },
                    get maxCapacity() {
                        return foliageManager.megaBuffer?.maxTotalInstances ?? 0;
                    }
                };

                const statsFolder = folderFoliage.addFolder({title: 'Global Buffer Stats', expanded: true});
                statsFolder.addBinding(globalStats, 'totalTypes', {readonly: true});
                statsFolder.addBinding(globalStats, 'totalInstances', {readonly: true});
                statsFolder.addBinding(globalStats, 'maxCapacity', {readonly: true});

                const createdTypeFolders = new Set();
                const updateFoliageTypeGUI = () => {
                    const types = foliageManager.typeList;
                    for (let i = 0; i < types.length; i++) {
                        const type = types[i];
                        const typeName = type.name;
                        if (createdTypeFolders.has(typeName)) continue;
                        createdTypeFolders.add(typeName);

                        const typeFolder = folderFoliage.addFolder({
                            title: `Type: ${typeName}`,
                            expanded: true
                        });

                        typeFolder.addBinding(type, 'activeInstanceCount', {readonly: true});
                        typeFolder.addBinding(type, 'bufferCapacity', {readonly: true});
                        typeFolder.addBinding(type, 'totalInstanceCount', {readonly: true});
                        typeFolder.addBinding(type, 'enableStreaming');
                        typeFolder.addBinding(type, 'streamingRadius', {
                            min: 100,
                            max: 3000,
                            step: 50
                        });
                        typeFolder.addBinding(type, 'useDepthPrepass');
                        typeFolder.addBinding(type, 'castShadow');
                        typeFolder.addBinding(type, 'maxShadowDistance', {
                            min: 0,
                            max: 1000,
                            step: 1
                        });
                        typeFolder.addBinding(type, 'densityPerHectare', {
                            min: 0,
                            max: 300,
                            step: 0.5,
                            label: 'Density (/ha)'
                        });
                        typeFolder.addBinding(type, 'densityMultiplier', {
                            min: 0,
                            max: 5.0,
                            step: 0.1,
                            label: 'Density Multiplier'
                        });
                        typeFolder.addBinding(type, 'bottomOffset', {
                            min: -2.0,
                            max: 2.0,
                            step: 0.01
                        });
                        typeFolder.addBinding(type, 'cullingDistance', {
                            min: 200,
                            max: 8000,
                            step: 50
                        });
                        typeFolder.addBinding(type, 'fadeStartDistance', {
                            min: 200,
                            max: 8000,
                            step: 50
                        });

                        const splatFolder = typeFolder.addFolder({
                            title: 'SplatMap & Slope',
                            expanded: true
                        });

                        const layerBinding = {
                            get targetLayer() {
                                return type.targetLayer ?? 'None';
                            },
                            set targetLayer(val) {
                                type.targetLayer = val === 'None' ? undefined : val;
                            }
                        };
                        splatFolder.addBinding(layerBinding, 'targetLayer', {
                            options: {
                                'None': 'None',
                                'Grass': 'Grass',
                                'Rock': 'Rock',
                                'Gravel': 'Gravel',
                                'Leave': 'Leave'
                            }
                        });

                        splatFolder.addBinding(type, 'minWeightThreshold', {
                            min: 0.0,
                            max: 0.95,
                            step: 0.05
                        }).on('change', () => {
                            foliageManager.repopulateFoliageType(type);
                        });

                        splatFolder.addBinding(type, 'densityScaleByWeight')
                            .on('change', () => {
                                foliageManager.repopulateFoliageType(type);
                            });

                        splatFolder.addBinding(type, 'minSlope', {
                            min: 0,
                            max: 90,
                            step: 1
                        }).on('change', () => {
                            foliageManager.repopulateFoliageType(type);
                        });

                        splatFolder.addBinding(type, 'maxSlope', {
                            min: 0,
                            max: 90,
                            step: 1
                        }).on('change', () => {
                            foliageManager.repopulateFoliageType(type);
                        });

                        const lodInfo = {
                            get lodsSummary() {
                                const list = type.lodInfoList;
                                if (!list || list.length === 0) return 'None';
                                const parts = [];
                                let prevDist = 0;
                                for (let j = 0; j < list.length; j++) {
                                    const info = list[j];
                                    const dist = Math.round(info.lodDistance);
                                    if (dist >= 100000) {
                                        parts.push(`Impostor(${prevDist}m+)`);
                                    } else {
                                        parts.push(`LOD${j}(${prevDist}~${dist}m)`);
                                        prevDist = dist;
                                    }
                                }
                                return parts.join(' | ');
                            }
                        };
                        typeFolder.addBinding(lodInfo, 'lodsSummary', {readonly: true});

                        const lodList = type.lodInfoList || [];
                        const numMeshLODs = (type.hasImpostor && lodList.length > 1) ? lodList.length - 1 : lodList.length;
                        if (numMeshLODs > 0) {
                            const lodFolder = typeFolder.addFolder({title: 'LOD Settings & Shadows', expanded: true});
                            for (let l = 0; l < numMeshLODs; l++) {
                                const lodIdx = l;
                                const subFolder = lodFolder.addFolder({title: `LOD ${lodIdx}`, expanded: true});
                                const subMeshesForLOD = (type.subMeshes || []).filter(s => s.lodIndex === lodIdx);
                                let totalVerts = 0;
                                let totalIndices = 0;
                                for (let s = 0; s < subMeshesForLOD.length; s++) {
                                    totalVerts += subMeshesForLOD[s].vertexCount || 0;
                                    totalIndices += subMeshesForLOD[s].indexCount || 0;
                                }

                                const lodBinding = {
                                    get distance() {
                                        return type.getLODDistance(lodIdx);
                                    },
                                    set distance(v) {
                                        type.setLODDistance(lodIdx, v);
                                    },
                                    get receiveShadow() {
                                        return type.getLODReceiveShadow(lodIdx);
                                    },
                                    set receiveShadow(v) {
                                        type.setLODReceiveShadow(lodIdx, v);
                                    },
                                    get subMeshCount() {
                                        return subMeshesForLOD.length;
                                    },
                                    get vertexCount() {
                                        return totalVerts;
                                    },
                                    get indexCount() {
                                        return totalIndices;
                                    }
                                };
                                const initDist = type.getLODDistance(lodIdx);
                                const maxVal = Math.max(800, Math.ceil(initDist * 2.5 / 50) * 50);
                                subFolder.addBinding(lodBinding, 'distance', {
                                    min: 10,
                                    max: maxVal,
                                    step: 5
                                });
                                subFolder.addBinding(lodBinding, 'receiveShadow');
                                subFolder.addBinding(lodBinding, 'subMeshCount', {readonly: true});
                                subFolder.addBinding(lodBinding, 'vertexCount', {readonly: true});
                                subFolder.addBinding(lodBinding, 'indexCount', {readonly: true});
                            }
                        }

                        if (type.hasImpostor) {
                            const impostorFolder = typeFolder.addFolder({
                                title: 'Octahedral Impostor',
                                expanded: true
                            });
                            impostorFolder.addBinding(type, 'useImpostor');
                            const impostorLODIndex = lodList.length - 1;
                            const impostorBinding = {
                                get receiveShadow() {
                                    return type.getLODReceiveShadow(impostorLODIndex);
                                },
                                set receiveShadow(v) {
                                    type.setLODReceiveShadow(impostorLODIndex, v);
                                }
                            };
                            impostorFolder.addBinding(impostorBinding, 'receiveShadow');
                            impostorFolder.addButton({title: 'Inspect Impostor Atlas'}).on('click', () => {
                                FoliageImpostorDebugViewer.open(redGPUContext, foliageManager, typeName);
                            });
                        }
                    }
                };

                setInterval(() => {
                    updateFoliageTypeGUI();
                    pane.refresh();
                }, 200);
                updateFoliageTypeGUI();
            }
        });
    }
);
