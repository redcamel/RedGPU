import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Landscape Basic LOD & Full Feature 테스트 예제
 * [EN] Landscape Basic LOD & Full Feature Test Example
 *
 * [KO] 신규 Landscape 지형 시스템의 모든 get/set 속성 실시간 검증 예제입니다.
 * [EN] Real-time test example for all get/set properties of the new Landscape terrain system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 설정 (FreeController - 자유 관람 및 탐색)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 350;
        controller.z = 0;
        controller.moveSpeed = 5000;

        // 2. Scene & View3D 초기화
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 태양 광원 (Directional Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. 신규 Landscape 인스턴스 생성 (16x16 256개 타일 에셋 대응)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: [16000, 16000],
            componentCount: [16, 16],
            componentSizeQuads: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
            maxLODLevel: 5,
            wireframe: false,
            lodColoration: false,
            loadingRadius: 4000
        });

        // 4-1. 지형 기본 바탕 색상 설정
        landscape.landscapeMaterial.color.setColorByHEX('#387d42');

        // Multi-Layer PBR 지형 레이어 4종 (Grass, Rock, Gravel, Leave) 등록
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const splatMapPath = '../../../assets/terrain/terrainTest_001/splatMap.jpg';

        // 1. Grass (주 광활한 초원/산맥 레이어 - 🔴 R 채널: 전체 지형의 65% 최대 면적 차지)
        const grassLayer = new RedGPU.LandscapeLayer({
            name: 'Grass',
            baseColorTexture: `${assetPath}grass.jpg`,
            normalTexture: `${assetPath}grass_normal.jpg`,
            ormTexture: `${assetPath}grass_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'R',
            uvScale: [50, 50],
            roughness: 0.85,
            metallic: 0.0,
            normalIntensity: 1.5,
            aoIntensity: 1.0,
            tintColor: '#ffffff'
        });

        // 2. Gravel (오솔길/흙길 레이어 - 🔵 B 채널: 좁은 오솔길 10%)
        const gravelLayer = new RedGPU.LandscapeLayer({
            name: 'Gravel',
            baseColorTexture: `${assetPath}gravel.jpg`,
            normalTexture: `${assetPath}gravel_normal.jpg`,
            ormTexture: `${assetPath}gravel_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'B',
            uvScale: [40, 40],
            roughness: 0.9,
            metallic: 0.0,
            normalIntensity: 1.8,
            aoIntensity: 1.2,
            tintColor: '#ffffff'
        });

        // 3. Rock (절벽/암벽 레이어 - 🟢 G 채널: 능선 및 절벽 포인트 20%)
        const rockLayer = new RedGPU.LandscapeLayer({
            name: 'Rock',
            baseColorTexture: `${assetPath}rock.jpg`,
            normalTexture: `${assetPath}rock_normal.jpg`,
            ormTexture: `${assetPath}rock_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'G',
            uvScale: [15, 15],
            roughness: 0.7,
            metallic: 0.05,
            normalIntensity: 2.2,
            aoIntensity: 1.5,
            tintColor: '#ffffff'
        });

        // 4. Leave (골짜기/숲속 레이어 - ⚫ A / Black 채널: 그늘진 골짜기 5%)
        const leaveLayer = new RedGPU.LandscapeLayer({
            name: 'Leave',
            baseColorTexture: `${assetPath}leave.jpg`,
            normalTexture: `${assetPath}leave_normal.jpg`,
            ormTexture: `${assetPath}leave_orm.jpg`,
            weightTexture: splatMapPath,
            weightChannel: 'A',
            uvScale: [50, 50],
            roughness: 0.8,
            metallic: 0.0,
            normalIntensity: 1.4,
            aoIntensity: 1.0,
            tintColor: '#ffffff'
        });

        landscape.landscapeMaterial.addLayer(grassLayer);
        landscape.landscapeMaterial.addLayer(gravelLayer);
        landscape.landscapeMaterial.addLayer(rockLayer);
        landscape.landscapeMaterial.addLayer(leaveLayer);

        landscape.tileUrlResolver = (row, col) => {
            const BASE_HOST = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const rStr = String(row).padStart(2, '0');
            const cStr = String(col).padStart(2, '0');

            // [KO] tile_001 에셋의 외곽(15번째) 타일 해상도 파일명 처리
            let sizeStr = '512_512';
            if (row === 15 && col === 15) {
                sizeStr = '449_449';
            } else if (col === 15) {
                sizeStr = '449_512';
            } else if (row === 15) {
                sizeStr = '512_449';
            }

            return `${BASE_HOST}28_134_86_730_13_${sizeStr}_16bit_tile_${rStr}_${cStr}.png`;
        };

        scene.addLandscape(landscape);

        // 5. 정식 RedGPU 디버거 클래스 인스턴스 생성 (2D SpatialGrid, VHT Heightmap, VNT Normal Atlas, HUD 디버거)
        const hudDebugger = new RedGPU.Display.LandscapeHUDDebugger(landscape, controller, {
            width: 320,
            left: 12,
            bottom: 120
        });

        const spatialGridDebugger = new RedGPU.Display.LandscapeSpatialGridDebugger(landscape, controller, {
            width: 100,
            height: 100,
            left: 12,
            bottom: 12
        });

        const vhtDebugger = new RedGPU.Display.LandscapeVHTDebugger(landscape, controller, {
            width: 100,
            height: 100,
            left: 120,
            bottom: 12
        });

        const vntDebugger = new RedGPU.Display.LandscapeVNTDebugger(landscape, controller, {
            width: 100,
            height: 100,
            left: 228,
            bottom: 12
        });

        // 6. RedGPU 정식 Renderer 생성 및 렌더 루프 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, directionalLight, [grassLayer, rockLayer, gravelLayer, leaveLayer]);
    }
);

/**
 * [KO] Landscape 모든 get/set 속성 전면 제어 테스트 패널(GUI)을 렌더링합니다.
 * [EN] Renders a test panel (GUI) for full control of all get/set properties of Landscape.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Landscape} landscape
 * @param {RedGPU.Camera.FreeController} controller
 * @param {RedGPU.Display.LandscapeHUDDebugger} hudDebugger
 * @param {RedGPU.Display.LandscapeSpatialGridDebugger} spatialGridDebugger
 * @param {RedGPU.Display.LandscapeVHTDebugger} vhtDebugger
 * @param {RedGPU.Display.LandscapeVNTDebugger} vntDebugger
 * @param {RedGPU.Light.DirectionalLight} directionalLight
 * @param {Array<RedGPU.LandscapeLayer>} layers
 */
const renderTestPane = (redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, directionalLight, layers) => {
    const [wsX, wsZ] = landscape ? landscape.worldSize : [8000, 8000];
    const [tcX, tcZ] = landscape ? landscape.componentCount : [8, 8];
    const [tsX, tsZ] = landscape ? landscape.tileSize : [1000, 1000];

    const config = {
        // 1. Terrain Dimensions & Transform
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}m, ${Math.round(tsZ)}m]`,

        // 2. Component & Mesh Specs
        componentSizeQuads: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
        maxLODLevel: landscape ? landscape.maxLODLevel : 4,
        lodFadeStartRatio: landscape ? landscape.lodFadeStartRatio : 0.7,
        lodGeomorphStartRatio: landscape ? landscape.lodGeomorphStartRatio : 0.7,

        // 3. Height & Displacement
        heightScale: landscape ? landscape.heightScale : 500,

        // 4. Render Options & Material
        wireframe: landscape ? landscape.wireframe : false,
        lodColoration: landscape ? landscape.lodColoration : false,
        terrainColor: '#387d42',
        textureArraySize: landscape?.landscapeMaterial?.textureArraySize ?? 1024,

        // 4-1. Directional Light (Sun)
        sunElevation: directionalLight ? directionalLight.elevation : 45,
        sunAzimuth: directionalLight ? directionalLight.azimuth : 45,
        sunColor: '#ffffff',

        // 5. Tile Streaming & VHT
        loadingRadius: landscape ? landscape.loadingRadius : 2500,
        maxLoadsPerFrame: landscape ? landscape.maxLoadsPerFrame : 2,

        // 6. Camera Controls
        moveSpeed: controller ? controller.moveSpeed : 5000,

        // 7. Debuggers
        spatialGridVisible: true,
        vhtDebuggerVisible: true,
        vntDebuggerVisible: true,
        boxSize: 100
    };

    let activePane = null;

    const updateConfigValues = () => {
        if (landscape) {
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
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            activePane = pane;

            // Folder 1: Terrain Dimensions (worldSize, componentCount, tileSize)
            const folderDimensions = pane.addFolder({title: 'Dimensions', expanded: true});

            folderDimensions.addBinding(config, 'worldSizeX', {
                min: 1000,
                max: 30000,
                step: 500
            }).on('change', (ev) => {
                config.worldSizeX = ev.value;
                if (landscape) {
                    landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'worldSizeZ', {
                min: 1000,
                max: 30000,
                step: 500
            }).on('change', (ev) => {
                config.worldSizeZ = ev.value;
                if (landscape) {
                    landscape.worldSize = [config.worldSizeX, config.worldSizeZ];
                    updateConfigValues();
                }
            });

            const maxTilesAllowed = Math.floor((redGPUContext.gpuDevice?.limits?.maxTextureDimension2D ?? 8192) / 512);

            folderDimensions.addBinding(config, 'componentCountX', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountX = ev.value;
                if (landscape) {
                    landscape.componentCount = [config.componentCountX, config.componentCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'componentCountZ', {
                min: 1,
                max: maxTilesAllowed,
                step: 1
            }).on('change', (ev) => {
                config.componentCountZ = ev.value;
                if (landscape) {
                    landscape.componentCount = [config.componentCountX, config.componentCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'tileSizeStr', {readonly: true});
            folderDimensions.addBinding(config, 'totalComponents', {readonly: true});

            // Folder 2: Mesh & Grid Specs (componentSizeQuads, maxLODLevel)
            const folderSpecs = pane.addFolder({title: 'Grid & LOD', expanded: true});

            folderSpecs.addBinding(config, 'componentSizeQuads', {
                options: {
                    '16x16 (289 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_16,
                    '32x32 (1089 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_32,
                    '64x64 (4225 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_64,
                    '128x128 (16641 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_128,
                    '256x256 (66049 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_256,
                    '512x512 (263169 Verts)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_512
                }
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.componentSizeQuads = ev.value;
                    updateConfigValues();
                }
            });

            folderSpecs.addBinding(config, 'maxLODLevel', {
                min: 1,
                max: 8,
                step: 1
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.maxLODLevel = ev.value;
                    updateConfigValues();
                }
            });

            folderSpecs.addBinding(config, 'lodFadeStartRatio', {
                min: 0.1,
                max: 0.99,
                step: 0.05
            }).on('change', (ev) => {
                if (landscape) landscape.lodFadeStartRatio = ev.value;
            });

            folderSpecs.addBinding(config, 'lodGeomorphStartRatio', {
                min: 0.1,
                max: 0.99,
                step: 0.05
            }).on('change', (ev) => {
                if (landscape) landscape.lodGeomorphStartRatio = ev.value;
            });

            // Folder 3: Height & Elevation Displacement
            const folderHeight = pane.addFolder({title: 'Height', expanded: true});

            folderHeight.addBinding(config, 'heightScale', {
                min: 0,
                max: 3000,
                step: 25
            }).on('change', (ev) => {
                if (landscape) landscape.heightScale = ev.value;
            });

            // Folder 4: Render Options & Material Color
            const folderDisplay = pane.addFolder({title: 'Material', expanded: true});

            folderDisplay.addBinding(config, 'wireframe').on('change', (ev) => {
                if (landscape) landscape.wireframe = ev.value;
            });

            folderDisplay.addBinding(config, 'lodColoration').on('change', (ev) => {
                if (landscape) landscape.lodColoration = ev.value;
            });

            folderDisplay.addBinding(config, 'terrainColor').on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.color.setColorByHEX(ev.value);
                }
            });

            folderDisplay.addBinding(config, 'textureArraySize', {
                readonly: true
            });

            // Folder 4-1: Multi-Layer PBR Controls (Grass, Rock, Gravel, Leave)
            if (layers && layers.length) {
                const folderLayers = pane.addFolder({title: 'Layers', expanded: true});

                layers.forEach((layer) => {
                    const subFolder = folderLayers.addFolder({
                        title: layer.name,
                        expanded: layer.name === 'Grass'
                    });

                    subFolder.addBinding(layer, 'enabled').on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'weightChannel', {
                        options: {R: 'R', G: 'G', B: 'B', A: 'A'}
                    }).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });

                    subFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.01}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'metallic', {min: 0, max: 1, step: 0.01}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 3, step: 0.01}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'aoIntensity', {min: 0, max: 2, step: 0.01}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'heightOffset', {min: -500, max: 500, step: 0.1}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                    subFolder.addBinding(layer, 'heightContrast', {min: 0, max: 5, step: 0.1}).on('change', () => {
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });

                    const layerScaleObj = {uvScale: layer.uvScale[0]};
                    subFolder.addBinding(layerScaleObj, 'uvScale', {
                        min: 1,
                        max: 200,
                        step: 1
                    }).on('change', (e) => {
                        layer.uvScale = [e.value, e.value];
                        landscape?.landscapeMaterial?.requestVBTRebake();
                    });
                });
            }

            // Folder 5: Tile Streaming & VHT Controls
            if (landscape) {
                const folderStream = pane.addFolder({title: 'Tile Streaming', expanded: true});

                folderStream.addBinding(config, 'loadingRadius', {
                    min: 500,
                    max: 20000,
                    step: 100
                }).on('change', (ev) => {
                    if (landscape) landscape.loadingRadius = ev.value;
                });

                folderStream.addBinding(config, 'maxLoadsPerFrame', {
                    min: 1,
                    max: 10,
                    step: 1
                }).on('change', (ev) => {
                    if (landscape) landscape.maxLoadsPerFrame = ev.value;
                });
            }

            // Folder 6: Camera Controls
            if (controller) {
                const folderCam = pane.addFolder({title: 'Camera', expanded: true});
                folderCam.addBinding(config, 'moveSpeed', {
                    min: 500,
                    max: 20000,
                    step: 500
                }).on('change', (ev) => {
                    controller.moveSpeed = ev.value;
                });
            }

            // Folder 7: Debugger Controls (HUD, SpatialGrid, VHT & VNT)
            const folderDebuggers = pane.addFolder({
                title: 'Debuggers',
                expanded: true
            });

            if (!('hudDebuggerVisible' in config)) config.hudDebuggerVisible = true;
            config.spatialGridVisible = spatialGridDebugger ? spatialGridDebugger.visible : true;
            config.vhtDebuggerVisible = vhtDebugger ? vhtDebugger.visible : true;
            config.vntDebuggerVisible = vntDebugger ? vntDebugger.visible : true;

            folderDebuggers.addBinding(config, 'hudDebuggerVisible').on('change', (ev) => {
                if (hudDebugger) hudDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'spatialGridVisible').on('change', (ev) => {
                if (spatialGridDebugger) spatialGridDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'vhtDebuggerVisible').on('change', (ev) => {
                if (vhtDebugger) vhtDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'vntDebuggerVisible').on('change', (ev) => {
                if (vntDebugger) vntDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'boxSize', {
                min: 60,
                max: 300,
                step: 10
            }).on('change', (ev) => {
                const sz = ev.value;
                if (spatialGridDebugger) {
                    spatialGridDebugger.setSize(sz, sz);
                }
                if (vhtDebugger) {
                    vhtDebugger.setSize(sz, sz);
                    vhtDebugger.setPosition(12 + sz + 10, 12);
                }
                if (vntDebugger) {
                    vntDebugger.setSize(sz, sz);
                    vntDebugger.setPosition(12 + (sz + 10) * 2, 12);
                }
            });
        }
    });
};
