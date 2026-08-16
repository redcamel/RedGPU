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

        // 4. 신규 Landscape 인스턴스 생성 (UE5 공식 프로퍼티 명칭 사용, 16x16 256개 타일 에셋 완벽 대응)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: [16000, 16000],
            componentCount: [16, 16],
            componentSizeQuads: 63,
            maxLODLevel: 5,
            wireframe: false,
            lodColoration: false,
            loadingRadius: 4000
        });

        // 4-1. 지형 기본 바탕 색상 설정
        landscape.landscapeMaterial.color.setColorByHEX('#387d42');

        // Multi-Layer PBR 지형 레이어 4종 (Grass, Rock, Gravel, Leave) 등록
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';

        // UE5 표준: 1장의 Channel-Packed Splatmap 텍스처 (R: Layer0, G: Layer1, B: Layer2, A: Layer3)
        const sharedSplatMap = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/splatMap.jpg'
        );

        // 1. Grass (주 평지 레이어 - R 채널: weightChannel = 'R')
        const grassLayer = new RedGPU.LandscapeLayer({
            name: 'Grass',
            baseColorTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass.jpg`),
            normalTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass_normal.jpg`),
            ormTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass_orm.jpg`),
            weightTexture: sharedSplatMap,
            weightChannel: 'R',
            uvScale: [160, 160],
            blendMode: 'WEIGHT_MAP',
            roughness: 1.0,
            metallic: 0.0,
            normalIntensity: 1.0,
            tintColor: '#ffffff'
        });

        // 2. Gravel (전이 지대/흙 레이어 - G 채널: weightChannel = 'G')
        const gravelLayer = new RedGPU.LandscapeLayer({
            name: 'Gravel',
            baseColorTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}gravel.jpg`),
            normalTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}gravel_normal.jpg`),
            ormTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}gravel_orm.jpg`),
            weightTexture: sharedSplatMap,
            weightChannel: 'G',
            uvScale: [140, 140],
            blendMode: 'WEIGHT_MAP',
            roughness: 0.95,
            metallic: 0.0,
            normalIntensity: 1.0,
            tintColor: '#ffffff'
        });

        // 3. Rock (절벽/암벽 레이어 - B 채널: weightChannel = 'B')
        const rockLayer = new RedGPU.LandscapeLayer({
            name: 'Rock',
            baseColorTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}rock.jpg`),
            normalTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}rock_normal.jpg`),
            ormTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}rock_orm.jpg`),
            weightTexture: sharedSplatMap,
            weightChannel: 'B',
            uvScale: [120, 120],
            blendMode: 'WEIGHT_MAP',
            roughness: 0.9,
            metallic: 0.0,
            normalIntensity: 1.2,
            tintColor: '#ffffff'
        });

        // 4. Leave (골짜기/숲속 레이어 - A 채널: weightChannel = 'A')
        const leaveLayer = new RedGPU.LandscapeLayer({
            name: 'Leave',
            baseColorTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}leave.jpg`),
            normalTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}leave_normal.jpg`),
            ormTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}leave_orm.jpg`),
            weightTexture: sharedSplatMap,
            weightChannel: 'A',
            uvScale: [100, 100],
            blendMode: 'WEIGHT_MAP',
            roughness: 1.0,
            metallic: 0.0,
            normalIntensity: 1.0,
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

        // 5. LandscapeFoliageManager 생성 및 눈에 잘 띄는 거대 식생 테스트 파퓰레이션
        const foliageManager = landscape.foliageManager;
        const grassMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
        grassMaterial.baseColorFactor = [0.15, 0.75, 0.2, 1.0];
        grassMaterial.roughnessFactor = 0.7;
        grassMaterial.metallicFactor = 0.0;

        const dummyGrassMesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Box(redGPUContext, 0.4, 8.2, 0.4),
            grassMaterial
        );
        //
        const grassType = foliageManager.addFoliageType({
            name: 'BasicGrass',
            mesh: dummyGrassMesh,
            maxInstances: 1000000,
            cullingDistance: 1500,
            fadeStartDistance: 1000,
            minScale: [0.8, 0.8, 0.8],
            maxScale: [1.3, 1.5, 1.3],
            randomRotationY: true
        });

        // 5-1. 정식 RedGPU 디버거 클래스 인스턴스 생성 (2D SpatialGrid, VHT Heightmap, VNT Normal Atlas, HUD 디버거)
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

        // 6. RedGPU 정식 Renderer 생성 및 매 프레임 실시간 HUD 추적 렌더 루프 시작 (60fps Real-time Tracking)
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            landscape.update(controller, view.renderViewStateData);
            // hudDebugger.update(view.renderViewStateData);
            // spatialGridDebugger.update();
            // vhtDebugger.update();
            // vntDebugger.update();
        };
        renderer.start(redGPUContext, render);

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, directionalLight, [grassLayer, rockLayer, gravelLayer, leaveLayer], foliageManager, grassType);
    }
);

/**
 * [KO] Landscape 모든 UE5 get/set 속성 전면 제어 테스트 패널(GUI)을 렌더링합니다.
 * [EN] Renders a test panel (GUI) for full control of all UE5 get/set properties of Landscape.
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
const renderTestPane = (redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, directionalLight, layers, foliageManager, grassType) => {
    const [wsX, wsZ] = landscape ? landscape.worldSize : [8000, 8000];
    const [tcX, tcZ] = landscape ? landscape.componentCount : [8, 8];
    const [tsX, tsZ] = landscape ? landscape.tileSize : [1000, 1000];

    const config = {
        // Foliage Controls
        foliageCount: grassType ? grassType.activeInstanceCount : 0,
        foliageCullingDist: grassType ? grassType.options.cullingDistance : 600,
        foliageFadeStartDist: grassType ? grassType.options.fadeStartDistance : 400,
        // 1. Terrain Dimensions & Transform
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}m, ${Math.round(tsZ)}m]`,

        // 2. Component & Mesh Specs
        componentSizeQuads: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
        maxLODLevel: landscape ? landscape.maxLODLevel : 4,
        totalQuadsStr: `${(tcX * 63) * (tcZ * 63)} Quads`,
        totalVertsStr: `${(tcX * 63 + 1) * (tcZ * 63 + 1)} Vertices`,

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
            const quads = landscape.componentSizeQuads;

            config.worldSizeX = wX;
            config.worldSizeZ = wZ;
            config.componentCountX = tX;
            config.componentCountZ = tZ;
            config.totalComponents = tX * tZ;
            config.tileSizeStr = `[${Math.round(sX)}m, ${Math.round(sZ)}m]`;

            const totalQ = (tX * quads) * (tZ * quads);
            const totalV = (tX * quads + 1) * (tZ * quads + 1);
            config.totalQuadsStr = `${totalQ.toLocaleString()} Quads`;
            config.totalVertsStr = `${totalV.toLocaleString()} Vertices`;

            if (activePane) activePane.refresh();
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            activePane = pane;

            // Folder 0: Foliage System Controls
            if (grassType) {
                const folderFoliage = pane.addFolder({title: '🌿 Foliage System Controls', expanded: true});
                folderFoliage.addBinding(config, 'foliageCount', {readonly: true});
                folderFoliage.addBinding(config, 'foliageCullingDist', {
                    min: 100,
                    max: 2000,
                    step: 20
                }).on('change', (ev) => {
                    grassType.options.cullingDistance = ev.value;
                });
                folderFoliage.addBinding(config, 'foliageFadeStartDist', {
                    min: 50,
                    max: 1500,
                    step: 20
                }).on('change', (ev) => {
                    grassType.options.fadeStartDistance = ev.value;
                });
            }

            // Folder 1: Terrain Dimensions (worldSize, componentCount, tileSize)
            const folderDimensions = pane.addFolder({title: '⛰️ Terrain Dimensions (UE5 Specs)', expanded: true});

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
            const folderSpecs = pane.addFolder({title: '🧩 Grid & LOD Specs (UE5 Standard)', expanded: true});

            folderSpecs.addBinding(config, 'componentSizeQuads', {
                options: {
                    '15 × 15 Quads (256 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_15,
                    '31 × 31 Quads (1,024 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_31,
                    '63 × 63 Quads (4,096 Vertices) [UE5 Default]': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
                    '127 × 127 Quads (16,384 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_127,
                    '255 × 255 Quads (65,536 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_255
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

            folderSpecs.addBinding(config, 'totalQuadsStr', {readonly: true});
            folderSpecs.addBinding(config, 'totalVertsStr', {readonly: true});

            // Folder 3: Height & Elevation Displacement
            const folderHeight = pane.addFolder({title: '🏔️ Height & Displacement (UE5 Scale)', expanded: true});

            folderHeight.addBinding(config, 'heightScale', {
                min: 0,
                max: 3000,
                step: 25
            }).on('change', (ev) => {
                if (landscape) landscape.heightScale = ev.value;
            });

            // Folder 4: Render Options & Material Color
            const folderDisplay = pane.addFolder({title: '🎨 Material & Visual Options', expanded: true});

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
                options: {
                    '512': 512,
                    '1024': 1024,
                    '2048': 2048
                }
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.textureArraySize = ev.value;
                }
            });

            // Folder 4-1: Multi-Layer PBR Controls (Grass, Rock, Gravel, Leave)
            if (layers && layers.length) {
                const folderLayers = pane.addFolder({title: '🌿 Multi-Layer PBR (UE5 Specs)', expanded: true});

                layers.forEach((layer) => {
                    const subFolder = folderLayers.addFolder({
                        title: `Layer: ${layer.name}`,
                        expanded: layer.name === 'Grass'
                    });

                    subFolder.addBinding(layer, 'enabled');
                    subFolder.addBinding(layer, 'blendMode', {
                        options: {SLOPE: 'SLOPE', HEIGHT: 'HEIGHT', WEIGHT_MAP: 'WEIGHT_MAP'}
                    });
                    subFolder.addBinding(layer, 'weightChannel', {
                        options: {R: 'R', G: 'G', B: 'B', A: 'A'}
                    });

                    subFolder.addBinding(layer, 'minVal', {min: -500, max: 500, step: 0.1});
                    subFolder.addBinding(layer, 'maxVal', {min: -500, max: 500, step: 0.1});
                    subFolder.addBinding(layer, 'blendFalloff', {min: 0.1, max: 50, step: 0.1});

                    subFolder.addBinding(layer, 'roughness', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'metallic', {min: 0, max: 1, step: 0.01});
                    subFolder.addBinding(layer, 'normalIntensity', {min: 0, max: 2, step: 0.01});
                    subFolder.addBinding(layer, 'aoIntensity', {min: 0, max: 2, step: 0.01});
                    subFolder.addBinding(layer, 'heightOffset', {min: -500, max: 500, step: 0.1});
                    subFolder.addBinding(layer, 'heightContrast', {min: 0, max: 5, step: 0.1});

                    const layerScaleData = {uvScale: layer.uvScale[0]};
                    subFolder.addBinding(layerScaleData, 'uvScale', {min: 1, max: 500, step: 1}).on('change', (e) => {
                        layer.uvScale = [e.value, e.value];
                    });
                });
            }

            // Folder 4-2: Directional Light Controls
            const folderSun = pane.addFolder({title: '☀️ Directional Light', expanded: true});

            folderSun.addBinding(config, 'sunElevation', {
                min: -90,
                max: 90,
                step: 1
            }).on('change', (ev) => {
                if (directionalLight) directionalLight.elevation = ev.value;
            });

            folderSun.addBinding(config, 'sunAzimuth', {
                min: 0,
                max: 360,
                step: 1
            }).on('change', (ev) => {
                if (directionalLight) directionalLight.azimuth = ev.value;
            });


            folderSun.addBinding(config, 'sunColor').on('change', (ev) => {
                if (directionalLight && directionalLight.color) {
                    directionalLight.color.setColorByHEX(ev.value);
                }
            });

            // Folder 5: Tile Streaming & VHT Controls
            if (landscape) {
                const folderStream = pane.addFolder({title: '🛰️ VHT Tile Streaming', expanded: true});

                folderStream.addBinding(config, 'loadingRadius', {
                    min: 500,
                    max: 15000,
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

                folderStream.addButton({title: '🔄 Reset Tile Streaming Cache'}).on('click', () => {
                    if (landscape && landscape.tileStreamer) {
                        landscape.tileStreamer.resetTileState();
                        console.log('[Landscape Example 🛰️] Tile Streaming cache state reset successfully!');
                    }
                });
            }

            // Folder 6: Camera Controls
            if (controller) {
                const folderCam = pane.addFolder({title: '🎮 Camera Controls', expanded: true});
                folderCam.addBinding(config, 'moveSpeed', {
                    min: 500,
                    max: 20000,
                    step: 500
                }).on('change', (ev) => {
                    controller.moveSpeed = ev.value;
                });

                folderCam.addButton({title: '🎯 Reset Camera View'}).on('click', () => {
                    controller.x = 0;
                    controller.y = 800;
                    controller.z = 2500;
                    controller.pan = 0;
                    controller.tilt = -25;
                    console.log('[Landscape Example 🎮] Camera view reset to initial position!');
                });
            }

            // Folder 7: Debugger Controls (HUD, SpatialGrid, VHT & VNT)
            const folderDebuggers = pane.addFolder({
                title: '🔍 Debugger Controls (HUD, SpatialGrid, VHT & VNT)',
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
