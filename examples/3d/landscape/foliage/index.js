import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

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

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        // view.skyAtmosphere = skyAtmosphere;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        scene.lightManager.addDirectionalLight(directionalLight);

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

                        const lastLodDist = lodConfigs[lodConfigs.length - 1].lodDistance;

                        foliageManager.addFoliageType({
                            name: `Tree_${baseName}`,
                            lods: lodConfigs,
                            maxInstances: 250000,
                            minScale: [0.85, 0.85, 0.85],
                            maxScale: [1.35, 1.35, 1.35],
                            randomRotationY: true,
                            cullingDistance: 3500,
                            fadeStartDistance: 2800,
                            isFoliage: true,
                            billboard: {
                                enabled: true,
                                lodDistance: lastLodDist
                            }
                        });
                    });
                }
            }
        );

        // 2. Frangipani Tree (HD Realistic Tree + Octahedral Impostor) 로드
        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/realistic_hd_frangipani_tree_950.glb',
            (loader) => {
                const root = loader.resultMesh;
                console.log('🌸 [realistic_hd_frangipani_tree_950.glb] Loaded Root:', root);

                foliageManager.addFoliageType({
                    name: 'FrangipaniTree',
                    mesh: root,
                    maxInstances: 150000,
                    minScale: [2.2, 2.2, 2.2],
                    maxScale: [3.2, 3.2, 3.2],
                    randomRotationY: true,
                    cullingDistance: 3500,
                    fadeStartDistance: 2800,
                    isFoliage: true,
                    billboard: {
                        enabled: true,
                        lodDistance: 120
                    }
                });
            }
        );

        landscape.debuggerManager.spatialGrid = true;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, view, skyAtmosphere, landscape, controller, directionalLight, layers, foliageManager);
    }
);

const renderTestPane = (redGPUContext, view, skyAtmosphere, landscape, controller, directionalLight, layers, foliageManager) => {
    const [wsX, wsZ] = landscape.worldSize;
    const [tcX, tcZ] = landscape.componentCount;
    const [tsX, tsZ] = landscape.tileSize;

    const config = {
        billboardWireframe: false,
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}m, ${Math.round(tsZ)}m]`,
        textureArraySize: 1024,
        boxSize: 100
    };

    let activePane = null;

    const updateConfigValues = () => {
        const [wX, wZ] = landscape.worldSize;
        const [tX, tZ] = landscape.componentCount;
        const [sX, sZ] = landscape.tileSize;

        config.worldSizeX = wX;
        config.worldSizeZ = wZ;
        config.componentCountX = tX;
        config.componentCountZ = tZ;
        config.totalComponents = tX * tZ;
        config.tileSizeStr = `[${Math.round(sX)}m, ${Math.round(sZ)}m]`;

        if (activePane) activePane.refresh();
    };

    setInterval(updateConfigValues, 500);

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            activePane = pane;

            if (foliageManager) {
                const folderFoliage = pane.addFolder({title: 'Foliage', expanded: true});

                const grassType = foliageManager.getFoliageType('BasicGrass');
                if (grassType) {
                    const subGrass = folderFoliage.addFolder({title: 'BasicGrass', expanded: false});
                    const grassProxy = {
                        get count() {
                            return grassType.activeInstanceCount;
                        },
                        get cullingDist() {
                            return grassType.options.cullingDistance;
                        },
                        set cullingDist(v) {
                            grassType.options.cullingDistance = v;
                        },
                        get fadeStartDist() {
                            return grassType.options.fadeStartDistance;
                        },
                        set fadeStartDist(v) {
                            grassType.options.fadeStartDistance = v;
                        }
                    };
                    subGrass.addBinding(grassProxy, 'count', {readonly: true});
                    subGrass.addBinding(grassProxy, 'cullingDist', {min: 500, max: 8000, step: 50});
                    subGrass.addBinding(grassProxy, 'fadeStartDist', {min: 200, max: 6000, step: 50});
                }

                const subFrangipani = folderFoliage.addFolder({
                    title: 'FrangipaniTree (3D + Octahedral Impostor)',
                    expanded: true
                });
                const frangipaniProxy = {
                    get count() {
                        const target = foliageManager.getFoliageType('FrangipaniTree');
                        return target ? target.activeInstanceCount : 0;
                    },
                    get lodDistance() {
                        const target = foliageManager.getFoliageType('FrangipaniTree');
                        if (target?.lodInfoList?.[0]) {
                            return target.lodInfoList[0].lodDistance;
                        }
                        return target ? target.options.lodDistance : 120;
                    },
                    set lodDistance(v) {
                        const target = foliageManager.getFoliageType('FrangipaniTree');
                        if (target) {
                            if (target.lodInfoList?.[0]) {
                                target.lodInfoList[0].lodDistance = v;
                            }
                            target.options.lodDistance = v;
                        }
                    },
                    get cullingDist() {
                        const target = foliageManager.getFoliageType('FrangipaniTree');
                        return target ? target.options.cullingDistance : 3500;
                    },
                    set cullingDist(v) {
                        const target = foliageManager.getFoliageType('FrangipaniTree');
                        if (target) target.options.cullingDistance = v;
                    }
                };
                subFrangipani.addBinding(frangipaniProxy, 'count', {readonly: true});
                subFrangipani.addBinding(frangipaniProxy, 'lodDistance', {
                    min: 30,
                    max: 1000,
                    step: 10,
                    label: '3D -> Impostor Dist'
                });
                subFrangipani.addBinding(frangipaniProxy, 'cullingDist', {min: 1000, max: 8000, step: 100});

                const subPine = folderFoliage.addFolder({title: 'PineTree (Multi-LOD + Octahedral)', expanded: true});
                const pineProxy = {
                    get count() {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        return target ? target.activeInstanceCount : 0;
                    },
                    get lod0Dist() {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        return target?.lodInfoList?.[0] ? target.lodInfoList[0].lodDistance : 80;
                    },
                    set lod0Dist(v) {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        if (target?.lodInfoList?.[0]) target.lodInfoList[0].lodDistance = v;
                    },
                    get lod1Dist() {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        return target?.lodInfoList?.[1] ? target.lodInfoList[1].lodDistance : 180;
                    },
                    set lod1Dist(v) {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        if (target?.lodInfoList?.[1]) target.lodInfoList[1].lodDistance = v;
                    },
                    get billboardDist() {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        const bbIdx = (target?.lodInfoList?.length ?? 1) - 2;
                        return target?.lodInfoList?.[bbIdx] ? target.lodInfoList[bbIdx].lodDistance : 320;
                    },
                    set billboardDist(v) {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        const bbIdx = (target?.lodInfoList?.length ?? 1) - 2;
                        if (target?.lodInfoList?.[bbIdx]) {
                            target.lodInfoList[bbIdx].lodDistance = v;
                        }
                    },
                    get cullingDist() {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        return target ? target.options.cullingDistance : 3500;
                    },
                    set cullingDist(v) {
                        const target = foliageManager.getFoliageType('Tree_Pine_large_1') || foliageManager.getFoliageType('Pine_large_1');
                        if (target) target.options.cullingDistance = v;
                    }
                };
                subPine.addBinding(pineProxy, 'count', {readonly: true});
                subPine.addBinding(pineProxy, 'lod0Dist', {min: 50, max: 600, step: 25, label: 'LOD 0 -> 1 Dist'});
                subPine.addBinding(pineProxy, 'lod1Dist', {min: 100, max: 1200, step: 50, label: 'LOD 1 -> 2 Dist'});
                subPine.addBinding(pineProxy, 'billboardDist', {
                    min: 200,
                    max: 2000,
                    step: 50,
                    label: 'LOD 2 -> Impostor'
                });
                subPine.addBinding(pineProxy, 'cullingDist', {min: 1000, max: 8000, step: 100});

                folderFoliage.addBinding(config, 'billboardWireframe', {label: 'Impostor Wireframe'}).on('change', (ev) => {
                    foliageManager.types.forEach(t => t.setBillboardWireframe(ev.value));
                });
            }

            const folderSpatial = pane.addFolder({title: 'Spatial', expanded: true});
            const folderDimensions = folderSpatial.addFolder({title: 'Dimensions', expanded: true});

            folderDimensions.addBinding(config, 'worldSizeX', {min: 1000, max: 30000, step: 500}).on('change', (ev) => {
                config.worldSizeX = ev.value;
                landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                updateConfigValues();
            });

            folderDimensions.addBinding(config, 'worldSizeZ', {min: 1000, max: 30000, step: 500}).on('change', (ev) => {
                config.worldSizeZ = ev.value;
                landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                updateConfigValues();
            });

            const maxTilesAllowed = Math.floor((redGPUContext.gpuDevice?.limits?.maxTextureDimension2D ?? 8192) / 512);

            folderDimensions.addBinding(config, 'componentCountX', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountX = ev.value;
                landscape.componentCount = [config.componentCountX, config.componentCountZ];
                updateConfigValues();
            });

            folderDimensions.addBinding(config, 'componentCountZ', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountZ = ev.value;
                landscape.componentCount = [config.componentCountX, config.componentCountZ];
                updateConfigValues();
            });

            folderDimensions.addBinding(config, 'tileSizeStr', {readonly: true});
            folderDimensions.addBinding(config, 'totalComponents', {readonly: true});

            const folderLOD = folderSpatial.addFolder({title: 'LOD', expanded: true});

            folderLOD.addBinding(landscape, 'componentSizeQuads', {
                options: {
                    16: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_16,
                    32: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_32,
                    64: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
                    128: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_128,
                    256: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_256,
                    512: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_512
                }
            }).on('change', () => {
                updateConfigValues();
            });

            folderLOD.addBinding(landscape, 'lod0SizeQuads', {
                options: {64: 64, 128: 128, 256: 256, 512: 512}
            }).on('change', () => {
                updateConfigValues();
            });

            folderLOD.addBinding(landscape, 'maxLODLevel', {min: 1, max: 8, step: 1}).on('change', () => {
                updateConfigValues();
            });

            folderLOD.addBinding(landscape, 'lodMetric', {
                options: {distance: 'distance', screenSize: 'screenSize'}
            });

            folderLOD.addBinding(landscape, 'lodFadeStartRatio', {min: 0.1, max: 0.99, step: 0.05});

            folderLOD.addBinding(landscape, 'lodGeomorphStartRatio', {
                min: 0.1,
                max: 0.99,
                step: 0.05
            });

            const folderStream = folderSpatial.addFolder({title: 'Tile Streaming', expanded: true});
            folderStream.addBinding(landscape, 'loadedTileCount', {readonly: true});
            folderStream.addBinding(landscape, 'pendingQueueSize', {readonly: true});
            folderStream.addBinding(landscape, 'loadingRadius', {min: 500, max: 20000, step: 100});
            folderStream.addBinding(landscape, 'maxLoadsPerFrame', {min: 1, max: 10, step: 1});

            const folderDisplay = pane.addFolder({title: 'Display', expanded: true});
            folderDisplay.addBinding(landscape, 'heightScale', {min: 0, max: 3000, step: 25});
            folderDisplay.addBinding(landscape, 'wireframe');
            folderDisplay.addBinding(landscape, 'lodColoration');

            const baseColorProxy = {
                get baseColor() {
                    return landscape.baseColor.hex;
                },
                set baseColor(v) {
                    landscape.baseColor.setColorByHEX(v);
                }
            };
            folderDisplay.addBinding(baseColorProxy, 'baseColor');
            folderDisplay.addBinding(config, 'textureArraySize', {readonly: true});

            if (layers?.length) {
                const folderLayers = pane.addFolder({title: 'Layers', expanded: true});

                layers.forEach((layer) => {
                    const subFolder = folderLayers.addFolder({
                        title: layer.name,
                        expanded: layer.name === 'Grass'
                    });

                    subFolder.addBinding(layer, 'enabled');
                    subFolder.addBinding(layer, 'weightChannel', {
                        options: {R: 'R', G: 'G', B: 'B', A: 'A'}
                    });

                    const tintObj = {
                        get tintColor() {
                            return layer.tintColor ? layer.tintColor.hex : '#ffffff';
                        },
                        set tintColor(v) {
                            layer.tintColor = v;
                        }
                    };
                    subFolder.addBinding(tintObj, 'tintColor');

                    subFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'metallic', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 3, step: 0.01});
                    subFolder.addBinding(layer, 'aoIntensity', {min: 0, max: 2, step: 0.01});

                    const layerScaleObj = {
                        get uvScale() {
                            return layer.uvScale[0];
                        },
                        set uvScale(v) {
                            layer.uvScale = [v, v];
                        }
                    };
                    subFolder.addBinding(layerScaleObj, 'uvScale', {min: 1, max: 200, step: 1});
                });
            }

            const folderSun = pane.addFolder({title: 'Sun Light', expanded: false});
            folderSun.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            folderSun.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});

            const folderAtmo = pane.addFolder({title: 'SkyAtmosphere', expanded: false});
            const atmoState = {enabled: true};
            folderAtmo.addBinding(atmoState, 'enabled', {label: 'Enabled'}).on('change', (ev) => {
                view.skyAtmosphere = ev.value ? skyAtmosphere : null;
            });
            folderAtmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01});
            folderAtmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01});
            folderAtmo.addBinding(skyAtmosphere, 'cloudCoverage', {min: 0, max: 1, step: 0.01});
            folderAtmo.addBinding(skyAtmosphere, 'cloudDensity', {min: 0, max: 1, step: 0.01});
            folderAtmo.addBinding(skyAtmosphere, 'cloudHeight', {min: 0.1, max: 20, step: 0.1});
            folderAtmo.addBinding(skyAtmosphere, 'atmosphereHeight', {min: 1, max: 200, step: 1});

            const folderCam = pane.addFolder({title: 'Camera', expanded: true});
            folderCam.addBinding(controller, 'moveSpeed', {min: 50, max: 20000, step: 10});

            const dbg = landscape.debuggerManager;
            const folderDebuggers = pane.addFolder({title: 'debuggerManager', expanded: true});

            folderDebuggers.addBinding(dbg, 'hud');
            folderDebuggers.addBinding(dbg, 'spatialGrid');
            folderDebuggers.addBinding(dbg, 'vht');
            folderDebuggers.addBinding(dbg, 'vnt');
            folderDebuggers.addBinding(dbg, 'vbt');
            folderDebuggers.addBinding(dbg, 'vbtNormal');
            folderDebuggers.addBinding(dbg, 'vbtORM');

            folderDebuggers.addBinding(config, 'boxSize', {min: 60, max: 300, step: 10}).on('change', (ev) => {
                const sz = ev.value;
                if (dbg.spatialGridDebugger) dbg.spatialGridDebugger.setSize(sz, sz);
                if (dbg.vhtDebugger) {
                    dbg.vhtDebugger.setSize(sz, sz);
                    dbg.vhtDebugger.setPosition(12 + sz + 10, 12);
                }
                if (dbg.vntDebugger) {
                    dbg.vntDebugger.setSize(sz, sz);
                    dbg.vntDebugger.setPosition(12 + (sz + 10) * 2, 12);
                }
                if (dbg.vbtDebugger) {
                    dbg.vbtDebugger.setSize(sz, sz);
                    dbg.vbtDebugger.setPosition(12 + (sz + 10) * 3, 12);
                }
                if (dbg.vbtNormalDebugger) {
                    dbg.vbtNormalDebugger.setSize(sz, sz);
                    dbg.vbtNormalDebugger.setPosition(12 + (sz + 10) * 4, 12);
                }
                if (dbg.vbtORMDebugger) {
                    dbg.vbtORMDebugger.setSize(sz, sz);
                    dbg.vbtORMDebugger.setPosition(12 + (sz + 10) * 5, 12);
                }
            });
        }
    });
};
