import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 1050;
        controller.z = 0;
        controller.moveSpeed = 10000;

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
        landscape.heightScale = 1500;
        landscape.globalHeightmapUrl = '../../../assets/terrain/terrainTest_001/global_heightmap_1024.png';
        landscape.tileUrlResolver = (row, col) => {
            console.log(row, col)
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

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, landscape, controller, directionalLight);
    }
);

const renderTestPane = (redGPUContext, landscape, controller, directionalLight) => {
    const [wsX, wsZ] = landscape.worldSize;
    const [tcX, tcZ] = landscape.componentCount;
    const [tsX, tsZ] = landscape.tileSize;

    const config = {
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}m, ${Math.round(tsZ)}m]`,
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

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        directionalShadow: false,
        ibl: false,
        skybox: false,
        gui: (pane) => {
            activePane = pane;

            const folderCam = pane.addFolder({title: 'Camera', expanded: true});
            folderCam.addBinding(controller, 'moveSpeed', {min: 500, max: 20000, step: 500});

            // 1. Spatial Dimensions
            const folderSpatial = pane.addFolder({title: 'Spatial Dimensions', expanded: true});
            folderSpatial.addBinding(config, 'worldSizeX', {
                min: 1000,
                max: 16000,
                step: 500,
                label: 'worldSizeX (m)'
            }).on('change', (ev) => {
                config.worldSizeX = ev.value;
                landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                updateConfigValues();
            });
            folderSpatial.addBinding(config, 'worldSizeZ', {
                min: 1000,
                max: 16000,
                step: 500,
                label: 'worldSizeZ (m)'
            }).on('change', (ev) => {
                config.worldSizeZ = ev.value;
                landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                updateConfigValues();
            });
            folderSpatial.addBinding(config, 'componentCountX', {readonly: true, label: 'componentCountX (Fixed)'});
            folderSpatial.addBinding(config, 'componentCountZ', {readonly: true, label: 'componentCountZ (Fixed)'});
            folderSpatial.addBinding(config, 'tileSizeStr', {readonly: true, label: 'tileSize'});
            folderSpatial.addBinding(config, 'totalComponents', {readonly: true, label: 'totalComponents'});

            // 2. LOD Settings
            const folderLOD = pane.addFolder({title: 'LOD', expanded: true});
            folderLOD.addBinding(landscape, 'componentSizeQuads', {
                options: {
                    16: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_16,
                    32: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_32,
                    64: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
                    128: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_128,
                    256: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_256,
                    512: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_512
                }
            }).on('change', () => updateConfigValues());
            folderLOD.addBinding(landscape, 'lod0SizeQuads', {
                options: {
                    64: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
                    128: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_128,
                    256: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_256,
                    512: RedGPU.Display.Landscape.LANDSCAPE_BASE_GRID_SIZE.QUAD_512
                }
            }).on('change', () => updateConfigValues());
            folderLOD.addBinding(landscape, 'maxLODLevel', {
                min: 1,
                max: 8,
                step: 1
            }).on('change', () => updateConfigValues());
            folderLOD.addBinding(landscape, 'lodMetric', {
                options: {distance: 'distance', screenSize: 'screenSize'}
            });
            folderLOD.addBinding(landscape, 'lodFadeStartRatio', {min: 0.1, max: 0.99, step: 0.05});
            folderLOD.addBinding(landscape, 'lodGeomorphStartRatio', {min: 0.1, max: 0.99, step: 0.05});

            // 3. Tile Streaming
            const folderStream = pane.addFolder({title: 'Tile Streaming', expanded: true});
            folderStream.addBinding(landscape, 'loadedTileCount', {readonly: true});
            folderStream.addBinding(landscape, 'pendingQueueSize', {readonly: true});
            folderStream.addBinding(landscape, 'loadingRadius', {min: 500, max: 20000, step: 100});
            folderStream.addBinding(landscape, 'maxLoadsPerFrame', {min: 1, max: 10, step: 1});

            // 4. Display
            const folderDisplay = pane.addFolder({title: 'Display', expanded: true});
            folderDisplay.addBinding(landscape, 'heightScale', {min: 0, max: 6000, step: 50});
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

            // 5. Environment & Camera
            const folderEnv = pane.addFolder({title: 'Sun & Camera', expanded: false});
            folderEnv.addBinding(directionalLight, 'elevation', {min: 0, max: 90, step: 1});
            folderEnv.addBinding(directionalLight, 'azimuth', {min: 0, max: 360, step: 1});
            folderEnv.addBinding(controller, 'moveSpeed', {min: 500, max: 20000, step: 500});

            // 6. Landscape Debugger
            const dbg = landscape.debuggerManager;
            const folderDebuggers = pane.addFolder({title: 'Debugger Manager', expanded: true});
            folderDebuggers.addBinding(dbg, 'hud');
            folderDebuggers.addBinding(dbg, 'spatialGrid');
            folderDebuggers.addBinding(dbg, 'vht', {label: 'VHT (Height)'});
            folderDebuggers.addBinding(dbg, 'vnt', {label: 'VNT (Normal)'});

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
            });

            // 7. Foliage Manager
            const foliageManager = landscape.foliageManager;
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

            setInterval(() => {
                pane.refresh();
            }, 200);
        }
    });
};
