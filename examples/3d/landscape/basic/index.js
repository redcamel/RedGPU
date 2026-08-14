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
        directionalLight.intensity = 1.5;
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

        // 4-1. 기본 지형 PBR 텍스처(baseColorTexture: diffuse.jpg / ormTexture: orm.jpg) 및 UV 스케일링 설정
        const groundTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/diffuse.jpg'
        );
        const ormTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/orm.jpg'
        );
        landscape.landscapeMaterial.baseColorTexture = groundTexture;
        landscape.landscapeMaterial.ormTexture = ormTexture;
        landscape.landscapeMaterial.color.setColorByHEX('#ffffff');
        landscape.landscapeMaterial.textureScale = [160, 160];

        // Multi-Layer PBR 지형 레이어 (Grass) 등록
        const assetPath = '../../../assets/terrain/terrainTest_001/layer/';
        const grassLayer = new RedGPU.LandscapeLayer({
            name: 'Grass',
            baseColorTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass.jpg`),
            normalTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass_normal.jpg`),
            ormTexture: new RedGPU.Resource.BitmapTexture(redGPUContext, `${assetPath}grass_orm.jpg`),
            textureScale: [160, 160],
            blendType: 'SLOPE',
            blendParams: {minVal: 0, maxVal: 90, blendFalloff: 5},
            tintColor: '#ffffff'
        });
        landscape.landscapeMaterial.addLayer(grassLayer);

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
            hudDebugger.update(view.renderViewStateData);
            spatialGridDebugger.update();
            vhtDebugger.update();
            vntDebugger.update();
        };
        renderer.start(redGPUContext, render);

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, groundTexture, ormTexture, directionalLight);
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
 * @param {RedGPU.Resource.BitmapTexture} groundTexture
 * @param {RedGPU.Resource.BitmapTexture} ormTexture
 * @param {RedGPU.Light.DirectionalLight} directionalLight
 */
const renderTestPane = (redGPUContext, landscape, controller, hudDebugger, spatialGridDebugger, vhtDebugger, vntDebugger, groundTexture, ormTexture, directionalLight) => {
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
        componentSizeQuads: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
        maxLODLevel: landscape ? landscape.maxLODLevel : 4,
        totalQuadsStr: `${(tcX * 63) * (tcZ * 63)} Quads`,
        totalVertsStr: `${(tcX * 63 + 1) * (tcZ * 63 + 1)} Vertices`,

        // 3. Height & Displacement
        heightScale: landscape ? landscape.heightScale : 500,

        // 4. Render Options & Material
        wireframe: landscape ? landscape.wireframe : false,
        lodColoration: landscape ? landscape.lodColoration : false,
        terrainColor: '#ffffff',
        roughness: 1.0,
        metallic: 0.0,
        occlusionStrength: 1.0,
        useDiffuseTexture: true,
        useOrmTexture: true,
        textureScaleU: 160,
        textureScaleV: 160,

        // 4-1. Directional Light (Sun)
        sunElevation: directionalLight ? directionalLight.elevation : 45,
        sunAzimuth: directionalLight ? directionalLight.azimuth : 45,
        sunIntensity: directionalLight ? directionalLight.intensity : 1.5,
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
        gui: (pane) => {
            activePane = pane;

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

            folderDisplay.addBinding(config, 'roughness', {
                min: 0.0,
                max: 1.0,
                step: 0.01
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.roughnessFactor = ev.value;
                }
            });

            folderDisplay.addBinding(config, 'metallic', {
                min: 0.0,
                max: 1.0,
                step: 0.01
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.metallicFactor = ev.value;
                }
            });

            folderDisplay.addBinding(config, 'occlusionStrength', {
                min: 0.0,
                max: 2.0,
                step: 0.05
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.occlusionStrength = ev.value;
                }
            });

            folderDisplay.addBinding(config, 'useDiffuseTexture').on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.baseColorTexture = ev.value ? groundTexture : null;
                }
            });

            folderDisplay.addBinding(config, 'useOrmTexture').on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    landscape.landscapeMaterial.ormTexture = ev.value ? ormTexture : null;
                }
            });

            folderDisplay.addBinding(config, 'textureScaleU', {
                min: 1,
                max: 1000,
                step: 5
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    const [, scV] = landscape.landscapeMaterial.textureScale;
                    landscape.landscapeMaterial.textureScale = [ev.value, scV];
                }
            });

            folderDisplay.addBinding(config, 'textureScaleV', {
                min: 1,
                max: 1000,
                step: 5
            }).on('change', (ev) => {
                if (landscape && landscape.landscapeMaterial) {
                    const [scU] = landscape.landscapeMaterial.textureScale;
                    landscape.landscapeMaterial.textureScale = [scU, ev.value];
                }
            });

            // Folder 4-1: Directional Light Controls
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

            folderSun.addBinding(config, 'sunIntensity', {
                min: 0,
                max: 10,
                step: 0.1
            }).on('change', (ev) => {
                if (directionalLight) directionalLight.intensity = ev.value;
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

            folderDebuggers.addBinding(config, 'hudDebuggerVisible', {label: 'Show HUD Monitor'}).on('change', (ev) => {
                if (hudDebugger) hudDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'spatialGridVisible', {label: 'Show 2D SpatialGrid'}).on('change', (ev) => {
                if (spatialGridDebugger) spatialGridDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'vhtDebuggerVisible', {label: 'Show VHT Atlas'}).on('change', (ev) => {
                if (vhtDebugger) vhtDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(config, 'vntDebuggerVisible', {label: 'Show VNT Normal Atlas'}).on('change', (ev) => {
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


