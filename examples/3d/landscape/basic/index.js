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
        controller.y = 300;
        controller.z = 800;
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

        // 4. 신규 Landscape 인스턴스 생성 (UE5 공식 프로퍼티 명칭 사용, 디버그 모드 기본 활성화)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: [8000, 8000],
            componentCount: [8, 8],
            componentSizeQuads: 63,
            maxLODLevel: 4,
            wireframe: true,
            lodColoration: true
        });

        landscape.tileUrlResolver = (row, col) => {
            const BASE_HOST = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            const rStr = String(row).padStart(2, '0');
            const cStr = String(col).padStart(2, '0');
            return `${BASE_HOST}28_134_86_730_13_512_512_16bit_tile_${rStr}_${cStr}.png`;
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

            const sysDrawCalls = view?.renderViewStateData?.renderResults?.numDrawCalls ?? activeDrawCalls;

            hud.innerHTML = `
                <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#38bdf8; border-bottom:1px solid rgba(56, 189, 248, 0.3); padding-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                    <span>⛰️ Landscape Real-time Engine Monitor</span>
                    <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 6px; border-radius:4px;">UE5 Spec</span>
                </div>
                <div>worldSize: <b style="color:#f1f5f9;">[${wsX}, ${wsZ}]m</b> | componentCount: <b style="color:#f1f5f9;">[${tcX}, ${tcZ}] (${tcX * tcZ} Components)</b></div>
                <div>tileSize: <b style="color:#f1f5f9;">[${Math.round(tsX)}, ${Math.round(tsZ)}]m</b> | componentSizeQuads: <b style="color:#f1f5f9;">${gs} Quads</b></div>
                
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

        // 5-1. 정식 RedGPU 디버거 클래스 인스턴스 생성 (2D SpatialGrid 및 VHT Heightmap Atlas 디버거)
        const spatialGridDebugger = new RedGPU.Display.LandscapeSpatialGridDebugger(landscape, controller, {
            width: 100,
            height: 100,
            left: 12,
            bottom: 12
        });

        const vhtDebugger = new RedGPU.Display.LandscapeVHTDebugger(landscape, {
            width: 100,
            height: 100,
            left: 120,
            bottom: 12
        });

        // 6. RedGPU 정식 Renderer 생성 및 매 프레임 실시간 HUD 추적 렌더 루프 시작 (60fps Real-time Tracking)
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            landscape.update(controller);
            updateHUD();
            spatialGridDebugger.update();
            vhtDebugger.update();
        };
        renderer.start(redGPUContext, render);

        // 7. Landscape 모든 get/set 속성 및 2D 디버거 전면 제어 테스트 패널 렌더링
        renderTestPane(redGPUContext, landscape, controller, spatialGridDebugger, vhtDebugger);
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
 */
const renderTestPane = (redGPUContext, landscape, controller, spatialGridDebugger, vhtDebugger) => {
    const [wsX, wsZ] = landscape ? landscape.worldSize : [8000, 8000];
    const [tcX, tcZ] = landscape ? landscape.componentCount : [8, 8];
    const [tsX, tsZ] = landscape ? landscape.tileSize : [1000, 1000];

    const config = {
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        componentCountX: tcX,
        componentCountZ: tcZ,
        totalComponents: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}, ${Math.round(tsZ)}]m`,
        componentSizeQuads: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
        maxLODLevel: 4,
        wireframe: landscape ? landscape.wireframe : true,
        lodColoration: landscape ? landscape.lodColoration : true,
        moveSpeed: controller ? controller.moveSpeed : 3000
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
            config.tileSizeStr = `[${Math.round(sX)}, ${Math.round(sZ)}]m`;
            if (activePane) activePane.refresh();
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            activePane = pane;

            // Folder 1: Terrain Dimensions (worldSize, componentCount, tileSize)
            const folderDimensions = pane.addFolder({title: '📐 Terrain Dimensions (UE5 Specs)', expanded: true});

            folderDimensions.addBinding(config, 'worldSizeX', {
                min: 1000,
                max: 20000,
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
                max: 20000,
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

            // Folder 2: Mesh & LOD Specs (componentSizeQuads, maxLODLevel)
            const folderSpecs = pane.addFolder({title: '🧩 Component & LOD Specs (UE5)', expanded: true});

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
                }
            });

            folderSpecs.addBinding(config, 'maxLODLevel', {
                min: 1,
                max: 6,
                step: 1
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.maxLODLevel = ev.value;
                }
            });

            // Folder 3: Render Options (wireframe, lodColoration)
            const folderDisplay = pane.addFolder({title: '🎨 Render Options', expanded: true});

            folderDisplay.addBinding(config, 'wireframe').on('change', (ev) => {
                if (landscape) landscape.wireframe = ev.value;
            });

            folderDisplay.addBinding(config, 'lodColoration').on('change', (ev) => {
                if (landscape) landscape.lodColoration = ev.value;
            });

            // Folder 4: Tile Streaming & VHT Controls (loadingRadius, heightScale, maxLoadsPerFrame)
            if (landscape) {
                const streamConfig = {
                    loadingRadius: landscape.loadingRadius,
                    heightScale: landscape.heightScale,
                    maxLoadsPerFrame: landscape.maxLoadsPerFrame
                };
                const folderStream = pane.addFolder({title: '⛰️ VHT Heightfield & Streaming', expanded: true});

                folderStream.addBinding(streamConfig, 'heightScale', {
                    min: 0,
                    max: 2000,
                    step: 50
                }).on('change', (ev) => {
                    if (landscape) landscape.heightScale = ev.value;
                });

                folderStream.addBinding(streamConfig, 'loadingRadius', {
                    min: 500,
                    max: 8000,
                    step: 100
                }).on('change', (ev) => {
                    if (landscape) landscape.loadingRadius = ev.value;
                });

                folderStream.addBinding(streamConfig, 'maxLoadsPerFrame', {
                    min: 1,
                    max: 10,
                    step: 1
                }).on('change', (ev) => {
                    if (landscape) landscape.maxLoadsPerFrame = ev.value;
                });
            }

            // Folder 5: Camera Controls (moveSpeed)
            if (controller) {
                const folderCam = pane.addFolder({title: '🎮 Camera Controls', expanded: true});
                folderCam.addBinding(config, 'moveSpeed', {
                    min: 500,
                    max: 15000,
                    step: 500
                }).on('change', (ev) => {
                    controller.moveSpeed = ev.value;
                });
            }

            // Folder 6: 2D Debuggers (Visibility & Box Size)
            const folderDebuggers = pane.addFolder({title: '🔍 2D Debuggers', expanded: true});
            const debuggerConfig = {
                spatialGridVisible: true,
                vhtDebuggerVisible: true,
                boxSize: 100
            };

            folderDebuggers.addBinding(debuggerConfig, 'spatialGridVisible', {label: 'SpatialGrid Mini-Map'}).on('change', (ev) => {
                if (spatialGridDebugger) spatialGridDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(debuggerConfig, 'vhtDebuggerVisible', {label: 'VHT Heightmap Atlas'}).on('change', (ev) => {
                if (vhtDebugger) vhtDebugger.visible = ev.value;
            });

            folderDebuggers.addBinding(debuggerConfig, 'boxSize', {
                label: 'Debugger Box Size',
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
            });
        }
    });
};


