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
        controller.y = 1150;
        controller.z = 0;
        controller.moveSpeed = 1200;

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

        let currentHdr = iblList[0];
        let currentIbl = new RedGPU.Resource.IBL(redGPUContext, currentHdr.path, currentHdr.luminance);
        view.ibl = currentIbl;

        let currentSkybox = new RedGPU.Display.SkyBox(redGPUContext, currentIbl.environmentTexture, currentHdr.luminance);
        view.skybox = currentSkybox;

        // 2. Directional Light 및 Shadow 설정
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.lux = 90000;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 그림자 설정 (16km 오픈월드 지형 및 대규모 식생에 최적화)
        const directionalShadowManager = scene.shadowManager.directionalShadowManager;
        directionalShadowManager.maxShadowDistance = 1000;



        const landscape = new RedGPU.Display.Landscape.Landscape(redGPUContext);
        landscape.worldSize = [16000, 16000];
        landscape.componentCount = [16, 16];
        landscape.heightScale = 1500;
        landscape.maxLODLevel = 5;
        landscape.loadingRadius = 4000;
        landscape.baseColor.setColorByHEX('#387d42');

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
                uvScale: [50, 50],
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
                    console.log('treeGroups', treeGroups)
                    treeGroups.forEach((lods, baseName) => {
                        const lodConfigs = [];
                        const lod0 = lods.lod0 || lods.lod1 || lods.lod2;
                        if (!lod0) return;

                        lodConfigs.push({mesh: lod0, lodDistance: 80});
                        if (lods.lod1 && lods.lod1 !== lod0) lodConfigs.push({mesh: lods.lod1, lodDistance: 180});
                        if (lods.lod2 && lods.lod2 !== lod0 && lods.lod2 !== lods.lod1) lodConfigs.push({
                            mesh: lods.lod2,
                            lodDistance: 320
                        });

                        foliageManager.addFoliageType({
                            name: `Tree_${baseName}`,
                            lods: lodConfigs,
                            maxInstances: 100000,
                            minScale: [0.85, 0.85, 0.85],
                            maxScale: [1.35, 1.35, 1.35],
                            randomRotationY: true,
                            isFoliage: true,
                            useImpostor: true
                        });
                    });
                }
            }
        );
        //
        // // 2. Frangipani Tree (HD Realistic Tree + Octahedral Impostor) 로드
        // new RedGPU.GLTFLoader(
        //     redGPUContext,
        //     '../../../assets/terrain/realistic_hd_frangipani_tree_950.glb',
        //     (loader) => {
        //         const root = loader.resultMesh;
        //         console.log('🌸 [realistic_hd_frangipani_tree_950.glb] Loaded Root:', root);
        //
        //         foliageManager.addFoliageType({
        //             name: 'FrangipaniTree',
        //             lods: [{mesh: root, lodDistance: 120}],
        //             maxInstances: 50000,
        //             minScale: [4.2, 4.2, 4.2],
        //             maxScale: [6.2, 6.2, 6.2],
        //             randomRotationY: true,
        //             cullingDistance: 3500,
        //             fadeStartDistance: 2800,
        //             isFoliage: true,
        //             useImpostor: true
        //         });
        //     }
        // );
        // new RedGPU.GLTFLoader(
        //     redGPUContext,
        //     '../../../assets/terrain/realistic_hd_frangipani_tree_950.glb',
        //     (loader) => {
        //         const root = loader.resultMesh;
        //       root.setScale(10)
        //         root.y = 1000
        //         scene.addChild(root)
        //     }
        // );
        // landscape.debuggerManager.spatialGrid = true;

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
                const lightFolder = pane.addFolder({title: '☀️ Directional Light', expanded: false});
                lightFolder.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1, label: 'Azimuth'});
                lightFolder.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1, label: 'Elevation'});
                lightFolder.addBinding(directionalLight, 'lux', {
                    min: 0,
                    max: 200000,
                    step: 1000,
                    label: 'Intensity (Lux)'
                });

                const folderFoliage = pane.addFolder({title: '🌲 Foliage System', expanded: true});

                const globalStats = {
                    get totalTypes() {
                        return foliageManager.types.length;
                    },
                    get totalInstances() {
                        return foliageManager.megaBuffer?.totalActiveInstances ?? 0;
                    },
                    get maxCapacity() {
                        return foliageManager.megaBuffer?.maxTotalInstances ?? 0;
                    }
                };

                const statsFolder = folderFoliage.addFolder({title: 'Global Buffer Stats', expanded: true});
                statsFolder.addBinding(globalStats, 'totalTypes', {label: 'Active Types', readonly: true});
                statsFolder.addBinding(globalStats, 'totalInstances', {label: 'Rendered Trees', readonly: true});
                statsFolder.addBinding(globalStats, 'maxCapacity', {label: 'Max Capacity', readonly: true});

                const createdTypeFolders = new Set();
                const updateFoliageTypeGUI = () => {
                    const types = foliageManager.types;
                    for (let i = 0; i < types.length; i++) {
                        const type = types[i];
                        const typeName = type.name;
                        if (createdTypeFolders.has(typeName)) continue;
                        createdTypeFolders.add(typeName);

                        const typeFolder = folderFoliage.addFolder({
                            title: `Type: ${typeName}`,
                            expanded: true
                        });

                        typeFolder.addBinding(type, 'activeInstanceCount', {label: 'Instances', readonly: true});
                        typeFolder.addBinding(type, 'castShadow', {label: 'Cast Shadow'});
                        typeFolder.addBinding(type, 'receiveShadow', {label: 'Receive Shadow'});
                        typeFolder.addBinding(type, 'maxShadowCascadeIndex', {
                            options: {
                                'Cascade 0 (Near Only)': 0,
                                'Cascade 1 (~50m)': 1,
                                'Cascade 2 (~112m)': 2,
                                'Cascade 3 (Full Far)': 3,
                            },
                            label: 'Max Shadow Cascade'
                        });
                        typeFolder.addBinding(type, 'groundOffset', {
                            min: -5.0,
                            max: 5.0,
                            step: 0.05,
                            label: 'Ground Offset'
                        });
                        typeFolder.addBinding(type, 'cullingDistance', {
                            min: 200,
                            max: 8000,
                            step: 50,
                            label: 'Culling Distance'
                        });

                        const lodInfo = {
                            get lodsSummary() {
                                const list = type.lodInfoList;
                                if (!list || list.length === 0) return 'None';
                                const parts = [];
                                let prevDist = 0;
                                for (let i = 0; i < list.length; i++) {
                                    const info = list[i];
                                    const dist = Math.round(info.lodDistance);
                                    if (dist >= 100000) {
                                        parts.push(`Impostor(${prevDist}m+)`);
                                    } else {
                                        parts.push(`LOD${i}(${prevDist}~${dist}m)`);
                                        prevDist = dist;
                                    }
                                }
                                return parts.join(' | ');
                            }
                        };
                        typeFolder.addBinding(lodInfo, 'lodsSummary', {label: 'LOD Ranges', readonly: true});

                        const lodList = type.lodInfoList || [];
                        const numMeshLODs = (type.useImpostor && lodList.length > 1) ? lodList.length - 1 : lodList.length;
                        if (numMeshLODs > 0) {
                            const lodFolder = typeFolder.addFolder({title: '📐 LOD Distances', expanded: true});
                            for (let l = 0; l < numMeshLODs; l++) {
                                const lodIdx = l;
                                const lodBinding = {
                                    get distance() {
                                        if (typeof type.getLODDistance === 'function') {
                                            return type.getLODDistance(lodIdx);
                                        }
                                        return type.lodInfoList?.[lodIdx]?.lodDistance ?? 0;
                                    },
                                    set distance(v) {
                                        if (typeof type.setLODDistance === 'function') {
                                            type.setLODDistance(lodIdx, v);
                                        } else if (type.lodInfoList && type.lodInfoList[lodIdx]) {
                                            type.lodInfoList[lodIdx].lodDistance = Math.max(0, v);
                                            if (type.useImpostor) {
                                                type.impostorDistance = type.impostorDistance;
                                            }
                                        }
                                    }
                                };
                                const initDist = typeof type.getLODDistance === 'function'
                                    ? type.getLODDistance(lodIdx)
                                    : (type.lodInfoList?.[lodIdx]?.lodDistance ?? 80);
                                const maxVal = Math.max(800, Math.ceil(initDist * 2.5 / 50) * 50);
                                lodFolder.addBinding(lodBinding, 'distance', {
                                    min: 10,
                                    max: maxVal,
                                    step: 5,
                                    label: `LOD ${lodIdx} Dist`
                                });
                            }
                        }

                        if (type.useImpostor) {
                            const impostorFolder = typeFolder.addFolder({
                                title: '🎭 Octahedral Impostor',
                                expanded: true
                            });
                            impostorFolder.addBinding(type, 'useImpostor', {label: 'Enable Impostor'});
                            impostorFolder.addBinding(type, 'impostorDistance', {
                                min: 30,
                                max: 800,
                                step: 10,
                                label: 'Switch Distance'
                            });

                            impostorFolder.addButton({title: '🔍 Inspect Impostor Atlas'}).on('click', () => {
                                FoliageImpostorDebugViewer.open(redGPUContext, foliageManager, typeName);
                            });
                        }
                    }
                };

                setInterval(updateFoliageTypeGUI, 1000);
                updateFoliageTypeGUI();
            }
        });
    }
);
