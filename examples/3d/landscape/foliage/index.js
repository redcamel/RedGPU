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
        controller.moveSpeed = 5000;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

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





        new RedGPU.GLTFLoader(
            redGPUContext,
            '../../../assets/terrain/tree_elm.glb',
            (loader) => {
                const treeMesh = loader.resultMesh;

                foliageManager.addFoliageType({
                    name: 'ElmTree',
                    mesh: treeMesh,
                    maxInstances: 300000,
                    minScale: [1, 1, 1],
                    billboard: {
                        enabled: true,
                        lodDistance: 250
                    }
                });
            }
        );

        landscape.debuggerManager.spatialGrid = true;

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, landscape, controller, directionalLight, layers, foliageManager);
    }
);

const renderTestPane = (redGPUContext, landscape, controller, directionalLight, layers, foliageManager) => {
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

                const subTree = folderFoliage.addFolder({title: 'ElmTree (Infinite Billboard)', expanded: true});
                const treeProxy = {
                    get count() {
                        const target = foliageManager.getFoliageType('ElmTree');
                        return target ? target.activeInstanceCount : 0;
                    },
                    get lodDistance() {
                        const target = foliageManager.getFoliageType('ElmTree');
                        return target ? target.options.lodDistance : 250;
                    },
                    set lodDistance(v) {
                        const target = foliageManager.getFoliageType('ElmTree');
                        if (target) target.options.lodDistance = v;
                    }
                };
                subTree.addBinding(treeProxy, 'count', {readonly: true});
                subTree.addBinding(treeProxy, 'lodDistance', {min: 50, max: 1000, step: 10});
                subTree.addBinding(config, 'billboardWireframe').on('change', (ev) => {
                    const target = foliageManager.getFoliageType('ElmTree');
                    if (target) {
                        target.setBillboardWireframe(ev.value);
                    }
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

            const folderCam = pane.addFolder({title: 'Camera', expanded: true});
            folderCam.addBinding(controller, 'moveSpeed', {min: 500, max: 20000, step: 500});

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
