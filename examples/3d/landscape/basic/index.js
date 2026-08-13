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

        // 4. 신규 Landscape 인스턴스 생성 (언리얼 5 공식 기본값: 월드 크기 [8000, 8000]m, 타일 개수 [8, 8], gridSize 63 -> 63x63 Quads)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: [8000, 8000],
            tileCount: [8, 8],
            gridSize: 63,
            lodCount: 4,
            wireframe: true,
            lodColoration: true
        });

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
            minWidth: '420px'
        });

        const lodColors = [
            '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#1abc9c', '#3498db', '#ecf0f1'
        ];

        const updateHUD = () => {
            if (!landscape) return;
            const [wsX, wsZ] = landscape.worldSize;
            const [tcX, tcZ] = landscape.tileCount;
            const [tsX, tsZ] = landscape.tileSize;
            const gs = landscape.gridSize;
            const lodCount = landscape.lodCount;
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
                        <span style="color:#38bdf8;"><b>${tileCountForLOD} Tiles</b> (${lodVerts.toLocaleString()} v / ${lodTris.toLocaleString()} t)</span>
                    </div>
                `;
            }

            const sysDrawCalls = view?.renderViewStateData?.renderResults?.numDrawCalls ?? activeDrawCalls;

            hud.innerHTML = `
                <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#38bdf8; border-bottom:1px solid rgba(56, 189, 248, 0.3); padding-bottom:4px; display:flex; justify-space-between; align-items:center;">
                    <span>⛰️ Landscape Real-time Engine Monitor</span>
                    <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 6px; border-radius:4px;">UE5 Spec</span>
                </div>
                <div>worldSize: <b style="color:#f1f5f9;">[${wsX}, ${wsZ}]m</b> | tileCount: <b style="color:#f1f5f9;">[${tcX}, ${tcZ}] (${tcX * tcZ} Tiles)</b></div>
                <div>tileSize: <b style="color:#f1f5f9;">[${Math.round(tsX)}, ${Math.round(tsZ)}]m</b> | gridSize: <b style="color:#f1f5f9;">${gs} Quads</b></div>
                
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
                </div>

                <div id="statInfo" style="margin-top:6px; font-size:11px; color:#94a3b8; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">
                    Cam Pos: [X: ${Math.round(controller?.x ?? 0)}, Y: ${Math.round(controller?.y ?? 0)}, Z: ${Math.round(controller?.z ?? 0)}]
                </div>
            `;
        };

        document.body.appendChild(hud);

        // 6. RedGPU 정식 Renderer 생성 및 매 프레임 실시간 HUD 추적 렌더 루프 시작 (60fps Real-time Tracking)
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            updateHUD();
        };
        renderer.start(redGPUContext, render);

        // 7. Landscape 모든 get/set 속성 전면 제어 테스트 패널 렌더링 (RedGPU 표준 인라인 컬러 피커 탑재)
        renderTestPane(redGPUContext, landscape, controller);
    }
);

/**
 * [KO] Landscape 모든 get/set 속성 전면 제어 테스트 패널(GUI)을 렌더링합니다.
 * [EN] Renders a test panel (GUI) for full control of all get/set properties of Landscape.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Landscape} landscape
 * @param {RedGPU.Camera.FreeController} controller
 */
const renderTestPane = (redGPUContext, landscape, controller) => {
    const [wsX, wsZ] = landscape ? landscape.worldSize : [8000, 8000];
    const [tcX, tcZ] = landscape ? landscape.tileCount : [8, 8];
    const [tsX, tsZ] = landscape ? landscape.tileSize : [1000, 1000];

    const config = {
        worldSizeX: wsX,
        worldSizeZ: wsZ,
        tileCountX: tcX,
        tileCountZ: tcZ,
        totalTiles: tcX * tcZ,
        tileSizeStr: `[${Math.round(tsX)}, ${Math.round(tsZ)}]m`,
        gridSize: RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
        lodCount: 4,
        wireframe: landscape ? landscape.wireframe : true,
        lodColoration: landscape ? landscape.lodColoration : true,
        moveSpeed: controller ? controller.moveSpeed : 3000
    };

    const materialColorParams = {
        color: {
            r: landscape?.material?.color?.r ?? 56,
            g: landscape?.material?.color?.g ?? 125,
            b: landscape?.material?.color?.b ?? 66
        }
    };

    let activePane = null;

    const updateConfigValues = () => {
        if (landscape) {
            const [wX, wZ] = landscape.worldSize;
            const [tX, tZ] = landscape.tileCount;
            const [sX, sZ] = landscape.tileSize;
            config.worldSizeX = wX;
            config.worldSizeZ = wZ;
            config.tileCountX = tX;
            config.tileCountZ = tZ;
            config.totalTiles = tX * tZ;
            config.tileSizeStr = `[${Math.round(sX)}, ${Math.round(sZ)}]m`;
            if (activePane) activePane.refresh();
        }
    };

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            activePane = pane;

            // Folder 1: Terrain Dimensions (worldSize, tileCount, tileSize)
            const folderDimensions = pane.addFolder({title: '📐 Terrain Dimensions (get / set)', expanded: true});

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

            folderDimensions.addBinding(config, 'tileCountX', {
                min: 1,
                max: 32,
                step: 1
            }).on('change', (ev) => {
                config.tileCountX = ev.value;
                if (landscape) {
                    landscape.tileCount = [config.tileCountX, config.tileCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'tileCountZ', {
                min: 1,
                max: 32,
                step: 1
            }).on('change', (ev) => {
                config.tileCountZ = ev.value;
                if (landscape) {
                    landscape.tileCount = [config.tileCountX, config.tileCountZ];
                    updateConfigValues();
                }
            });

            folderDimensions.addBinding(config, 'tileSizeStr', {readonly: true});
            folderDimensions.addBinding(config, 'totalTiles', {readonly: true});

            // Folder 2: Mesh & LOD Specs (gridSize, lodCount)
            const folderSpecs = pane.addFolder({title: '🧩 Mesh & LOD Specs (get / set)', expanded: true});

            folderSpecs.addBinding(config, 'gridSize', {
                options: {
                    '15 × 15 Quads (256 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_15,
                    '31 × 31 Quads (1,024 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_31,
                    '63 × 63 Quads (4,096 Vertices) [UE5 Default]': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_63,
                    '127 × 127 Quads (16,384 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_127,
                    '255 × 255 Quads (65,536 Vertices)': RedGPU.Display.LANDSCAPE_BASE_GRID_SIZE.QUAD_255
                }
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.gridSize = ev.value;
                }
            });

            folderSpecs.addBinding(config, 'lodCount', {
                min: 1,
                max: 6,
                step: 1
            }).on('change', (ev) => {
                if (landscape) {
                    landscape.lodCount = ev.value;
                }
            });

            // Folder 3: Render & Material Options (wireframe, lodColoration, material.color)
            const folderDisplay = pane.addFolder({title: '🎨 Render & Material Options (get / set)', expanded: true});

            folderDisplay.addBinding(config, 'wireframe').on('change', (ev) => {
                if (landscape) landscape.wireframe = ev.value;
            });

            folderDisplay.addBinding(config, 'lodColoration').on('change', (ev) => {
                if (landscape) landscape.lodColoration = ev.value;
            });


            // Folder 4: Camera Controls (moveSpeed)
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
        }
    });
};
