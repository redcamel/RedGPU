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

        // 5. 실시간 HUD 데이터 모니터링 패널 구축
        const hud = document.createElement('div');
        Object.assign(hud.style, {
            position: 'fixed',
            top: '16px',
            left: '12px',
            padding: '14px 18px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.7',
            zIndex: '99999',
        });
        document.body.appendChild(hud);

        const lodColors = [
            '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#1abc9c', '#3498db', '#ecf0f1'
        ];

        const updateHUD = () => {
            if (!landscape) return;
            const [wsX, wsZ] = landscape.worldSize;
            const [tcX, tcZ] = landscape.componentCount;
            const [tsX, tsZ] = landscape.tileSize;
            const gs = landscape.componentSizeQuads;
            const lodCount = landscape.maxLODLevel;
            const instanceBuffer = landscape.instanceBuffer;

            let lodListHTML = '';
            let activeTotalVerts = 0;
            let activeTotalTris = 0;
            let activeDrawCalls = 0;

            for (let i = 0; i < lodCount; i++) {
                const step = Math.pow(2, i);
                const segs = Math.max(1, Math.floor(gs / step));
                const vertsPerTile = (segs + 1) * (segs + 1);
                const trisPerTile = segs * segs * 2;

                const tileCountForLOD = instanceBuffer ? instanceBuffer.getLODInstanceCount(i) : 0;
                if (tileCountForLOD > 0) activeDrawCalls++;

                const lodVerts = tileCountForLOD * vertsPerTile;
                const lodTris = tileCountForLOD * trisPerTile;
                activeTotalVerts += lodVerts;
                activeTotalTris += lodTris;

                const color = lodColors[i % lodColors.length];
                lodListHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                        <span><span style="display:inline-block; width:10px; height:10px; background:${color}; margin-right:6px; border-radius:2px;"></span><b>LOD ${i}</b> (${segs}x${segs} quads):</span>
                        <span style="color:#38bdf8;"><b>${tileCountForLOD} Components</b> (${lodVerts.toLocaleString()} v / ${lodTris.toLocaleString()} t)</span>
                    </div>
                `;
            }

            const totalCompCount = tcX * tcZ;
            const visCompCount = landscape.visibleComponentCount ?? totalCompCount;
            const culledCompCount = landscape.culledComponentCount ?? 0;
            const culledPercent = totalCompCount > 0 ? ((culledCompCount / totalCompCount) * 100).toFixed(1) : '0.0';
            const frustumActive = landscape.frustumCullingActive;

            const sysDrawCalls = view?.renderViewStateData?.renderResults?.numDrawCalls ?? activeDrawCalls;

            hud.innerHTML = `
                <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#38bdf8; border-bottom:1px solid rgba(56, 189, 248, 0.3); padding-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                    <span>⛰️ Landscape Real-time Engine Monitor</span>
                    <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 6px; border-radius:4px;">UE5 Spec</span>
                </div>
                <div>worldSize: <b style="color:#f1f5f9;">[${wsX}, ${wsZ}]m</b> | componentCount: <b style="color:#f1f5f9;">[${tcX}, ${tcZ}] (${totalCompCount} Components)</b></div>
                <div>tileSize: <b style="color:#f1f5f9;">[${Math.round(tsX)}, ${Math.round(tsZ)}]m</b> | componentSizeQuads: <b style="color:#f1f5f9;">${gs} Quads</b></div>
                
                <div style="margin-top:8px; font-weight:bold; color:#cbd5e1; border-bottom:1px dashed rgba(255,255,255,0.15); padding-bottom:3px; display:flex; justify-content:space-between;">
                    <span>🎯 Camera Frustum & Spatial Culling:</span>
                    <span style="font-size:11px; color:${frustumActive ? '#4ade80' : '#f43f5e'};">● ${frustumActive ? 'Frustum Culling Active (6 Planes)' : 'Culling Disabled'}</span>
                </div>
                <div style="margin-top:4px; font-size:11px; background:rgba(30, 41, 59, 0.7); padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                    <div style="display:flex; justify-content:space-between;">
                        <span>👁️ Visible Components (In View):</span>
                        <span style="color:#38bdf8; font-weight:bold;">${visCompCount} / ${totalCompCount} <span style="color:#cbd5e1; font-weight:normal;">(${((visCompCount / totalCompCount) * 100).toFixed(1)}%)</span></span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:2px;">
                        <span>🚫 Culled Components (Skipped):</span>
                        <span style="color:#f43f5e; font-weight:bold;">${culledCompCount} <span style="color:#fb7185; font-weight:normal;">(${culledPercent}% GPU saved)</span></span>
                    </div>
                </div>

                <div style="margin-top:8px; font-weight:bold; color:#cbd5e1; border-bottom:1px dashed rgba(255,255,255,0.15); padding-bottom:3px;">
                    📊 Active LOD Instances & Geometry (Real-time):
                </div>
                <div style="margin-top:4px;">
                    ${lodListHTML}
                </div>

                <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(255,255,255,0.15);">
                    <div style="display:flex; justify-content:space-between;">
                        <span>🚀 Total Active Draw Calls:</span>
                        <span style="color:#f43f5e; font-weight:bold;">${sysDrawCalls} Calls <span style="font-size:10px; color:#94a3b8;">(Multi-LOD Batching)</span></span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:2px;">
                        <span>📐 Total Active Vertices:</span>
                        <span style="color:#4ade80; font-weight:bold;">${activeTotalVerts.toLocaleString()} Vertices</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:2px;">
                        <span>🔺 Total Active Triangles:</span>
                        <span style="color:#facc15; font-weight:bold;">${activeTotalTris.toLocaleString()} Triangles</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:2px;">
                        <span>🛰️ Streamed Host Tiles:</span>
                        <span style="color:#38bdf8; font-weight:bold;">${landscape.tileStreamer ? landscape.tileStreamer.loadedTileCount : 0} Loaded <span style="font-size:10px; color:#cbd5e1;">(Queue: ${landscape.tileStreamer ? landscape.tileStreamer.pendingQueueSize : 0})</span></span>
                    </div>
                </div>

                <div id="statInfo" style="margin-top:6px; font-size:11px; color:#94a3b8; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">
                    Cam Pos: [X: ${Math.round(controller?.x ?? 0)}, Y: ${Math.round(controller?.y ?? 0)}, Z: ${Math.round(controller?.z ?? 0)}]
                </div>
            `;
        };

        // 5-1. 정식 RedGPU 디버거 클래스 인스턴스 생성 (2D SpatialGrid, VHT Heightmap, VNT Normal Atlas 디버거)
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
            updateHUD();
            spatialGridDebugger.update();
            vhtDebugger.update();
            vntDebugger.update();
        };
        renderer.start(redGPUContext, render);

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, spatialGridDebugger, vhtDebugger, vntDebugger, groundTexture, ormTexture, directionalLight);
    }
);

/**
 * [KO] Landscape 모든 UE5 get/set 속성 전면 제어 테스트 패널(GUI)을 렌더링합니다.
 * [EN] Renders a test panel (GUI) for full control of all UE5 get/set properties of Landscape.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Landscape} landscape
 * @param {RedGPU.Camera.FreeController} controller
 * @param {RedGPU.Display.LandscapeSpatialGridDebugger} spatialGridDebugger
 * @param {RedGPU.Display.LandscapeVHTDebugger} vhtDebugger
 * @param {RedGPU.Display.LandscapeVNTDebugger} vntDebugger
 * @param {RedGPU.Resource.BitmapTexture} groundTexture
 * @param {RedGPU.Resource.BitmapTexture} ormTexture
 * @param {RedGPU.Light.DirectionalLight} directionalLight
 */
const renderTestPane = (redGPUContext, landscape, controller, spatialGridDebugger, vhtDebugger, vntDebugger, groundTexture, ormTexture, directionalLight) => {
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

            // Folder 7: 2D Debuggers (Visibility & Box Size)
            const folderDebuggers = pane.addFolder({title: '🔍 2D Debuggers (SpatialGrid, VHT & VNT)', expanded: true});

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


