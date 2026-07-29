import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Terrain CDLOD 4단계: 쿼드트리 가변 그리드 분할 예제 (거대 스케일)
 *
 * - worldSize: 2000×2000 단위 (거대 지형)
 * - maxLOD: 6 (최대 64배 세분화)
 * - 카메라 거리에 따라 쿼드트리가 실시간 분할/병합
 * - Frustum Culling으로 시야 밖 노드 자동 제거
 * - GPU Instancing으로 단일 드로우콜에서 전체 지형 렌더링
 */

const WORLD_SIZE = 20000.0;  // 월드 가로세로 크기 (20000x20000 = 20km 초대형 거대 월드 규격: 400km²)
const MAX_LOD = 8;          // 최대 LOD 레벨 (20km 원경 지평선까지 쿼드트리 세분화 8단계)
const MIN_H = 0.0;
const MAX_H = 1500.0;       // 최대 높이 (20km 초대형 거대 산맥 스케일 고도: 1.5km)

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// ─── 전체화면 캔버스 CSS ────────────────────────────────────────────────────────
Object.assign(document.documentElement.style, {width: '100%', height: '100%', overflow: 'hidden'});
Object.assign(document.body.style, {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    margin: '0',
    padding: '0',
    background: '#000'
});

// ─── HUD 오버레이 ─────────────────────────────────────────────────────────────
// ─── HUD 및 SpatialGrid 디버거 오버레이 ───────────────────────────────────────
const hud = document.createElement('div');
Object.assign(hud.style, {
    position: 'fixed', top: '12px', left: '12px',
    padding: '10px 16px',
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#e8f4ff',
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: '1.7',
    pointerEvents: 'none',
    zIndex: 9999,
    minWidth: '220px'
});

const debugCanvas = document.createElement('canvas');
debugCanvas.id = 'spatial-grid-debug-canvas';
debugCanvas.width = 100;
debugCanvas.height = 100;
debugCanvas.style.setProperty('position', 'fixed', 'important');
debugCanvas.style.setProperty('left', '12px', 'important');
debugCanvas.style.setProperty('bottom', '100px', 'important');
debugCanvas.style.setProperty('top', 'auto', 'important');
debugCanvas.style.setProperty('width', '100px', 'important');
debugCanvas.style.setProperty('height', '100px', 'important');
debugCanvas.style.setProperty('background', 'rgba(15, 23, 42, 0.85)', 'important');
debugCanvas.style.setProperty('border', '1px solid rgba(56, 189, 248, 0.4)', 'important');
debugCanvas.style.setProperty('border-radius', '6px', 'important');
debugCanvas.style.setProperty('pointer-events', 'none', 'important');
debugCanvas.style.setProperty('z-index', '99999', 'important');
document.body.appendChild(hud);
document.body.appendChild(debugCanvas);
const debugCtx = debugCanvas.getContext('2d');

function updateSpatialGrid2DDebugger(terrain, camera) {
    if (!debugCtx || !terrain.spatialGrid) return;

    const w = debugCanvas.width;
    const h = debugCanvas.height;
    const padding = 5;
    const mapDrawSize = w - padding * 2;

    debugCtx.clearRect(0, 0, w, h);

    // 2. 월드 10km 영역 경계 박스
    const worldMin = -WORLD_SIZE / 2; // -5000
    const worldMax = WORLD_SIZE / 2;  // +5000

    const worldToCanvas = (wx, wz) => {
        const nx = (wx - worldMin) / WORLD_SIZE; // 0 ~ 1
        const nz = (wz - worldMin) / WORLD_SIZE; // 0 ~ 1
        return [
            padding + nx * mapDrawSize,
            padding + (1 - nz) * mapDrawSize // 2D Y축 반전
        ];
    };

    const [bx0, by0] = worldToCanvas(-5000, 5000);
    const [bx1, by1] = worldToCanvas(5000, -5000);

    debugCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    debugCtx.lineWidth = 1;
    debugCtx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);

    // 3. 활성 스트리밍 셀 (Active Grid Cells) 사각형 그리기
    const activeTiles = terrain.spatialGrid.activeTiles;
    const cellSize = terrain.spatialGrid.cellSize;

    debugCtx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    debugCtx.strokeStyle = 'rgba(56, 189, 248, 0.8)';

    activeTiles.forEach((tile) => {
        const [minX, minZ, maxX, maxZ] = tile.worldBounds;
        const [cx0, cy0] = worldToCanvas(minX, maxZ);
        const [cx1, cy1] = worldToCanvas(maxX, minZ);

        const tw = cx1 - cx0;
        const th = cy1 - cy0;

        debugCtx.fillRect(cx0, cy0, tw, th);
        debugCtx.strokeRect(cx0, cy0, tw, th);
    });

    // 4. 카메라 감지 반경 원
    const [camCanvasX, camCanvasY] = worldToCanvas(camera.x, camera.z);
    const radiusPixels = (terrain.spatialGrid.loadingRadius / WORLD_SIZE) * mapDrawSize;

    debugCtx.beginPath();
    debugCtx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
    debugCtx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
    debugCtx.lineWidth = 1.5;
    debugCtx.setLineDash([3, 3]);
    debugCtx.stroke();
    debugCtx.setLineDash([]);

    // 5. 현재 카메라 위치 점 (Red Dot)
    debugCtx.beginPath();
    debugCtx.arc(camCanvasX, camCanvasY, 4, 0, Math.PI * 2);
    debugCtx.fillStyle = '#f87171';
    debugCtx.fill();
    debugCtx.strokeStyle = '#ffffff';
    debugCtx.lineWidth = 1.5;
    debugCtx.stroke();
}

let frameLoadCount = 0;
let frameUnloadCount = 0;
let lastFrameLoadCount = 0;
let lastFrameUnloadCount = 0;

function updateHUD(terrain, camera) {
    const leafCount = terrain.quadtree ? terrain.quadtree.leafNodes.length : 0;
    const streamedTileCount = terrain.spatialGrid ? terrain.spatialGrid.activeTiles.size : 0;
    const pendingQueueCount = terrain.spatialGrid ? terrain.spatialGrid.pendingQueueSize : 0;
    const maxBudget = terrain.spatialGrid ? terrain.spatialGrid.maxLoadsPerFrame : 2;
    const cellSize = terrain.spatialGrid ? terrain.spatialGrid.cellSize : 512;
    const centerGridX = Math.floor(camera.x / cellSize);
    const centerGridZ = Math.floor(camera.z / cellSize);

    const cx = camera.x.toFixed(1);
    const cy = camera.y.toFixed(1);
    const cz = camera.z.toFixed(1);
    hud.innerHTML = `
        <b style="color:#7dd3fc;font-size:14px;">🌍 CDLOD Quadtree & World Partition</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        🗂 활성 CDLOD 노드 : <b style="color:#4ade80;">${leafCount}</b><br>
        🛰 활성 스트리밍 셀 : <b style="color:#38bdf8;">${streamedTileCount}</b>개 (반경 3.5km)<br>
        📥 프레임당 로드 (toLoad)   : <b style="color:#4ade80;">${lastFrameLoadCount}</b>개 (예산: ${maxBudget > 0 ? maxBudget + '개/프레임' : '제한없음'})<br>
        ⏳ 로딩 대기 큐 (Pending)   : <b style="color:#fbbf24;">${pendingQueueCount}</b>개<br>
        📤 프레임당 언로드 (toUnload) : <b style="color:#f87171;">${lastFrameUnloadCount}</b>개<br>
        🎯 중심 셀 위치     : <b style="color:#a7f3d0;">Cell(${centerGridX}, ${centerGridZ})</b><br>
        📐 월드 스케일     : <b style="color:#fbbf24;">${WORLD_SIZE} × ${WORLD_SIZE}</b><br>
        🏔 최대 높이       : <b style="color:#f87171;">${MAX_H}</b><br>
        🔢 최대 LOD        : <b style="color:#c084fc;">${MAX_LOD}</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        📷 FreeController 비행 조작<br>
        &nbsp;&nbsp;이동: <b>W, A, S, D, Q, E</b><br>
        &nbsp;&nbsp;회전: <b>마우스 드래그</b><br>
        &nbsp;&nbsp;X: <b>${cx}</b>  Y: <b>${cy}</b>  Z: <b>${cz}</b>
    `;
}

// ─── RedGPU 초기화 ─────────────────────────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {

        // 1. 카메라 — 20km 초대형 거대 월드 비행 전용 FreeController 설정
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.moveSpeed = 5000;              // 20km 초대형 월드를 시원하게 누비는 비행 속도
        controller.mouseSensitivity = 0.2;       // 마우스 시선 회전 감도
        controller.x = 0;                        // 지형 X
        controller.y = 1500;                     // 20km 스케일을 바라보는 1km 상공 시점
        controller.z = 0;                    // 중심부 남쪽 시점
        controller.tilt = -15;                   // 20km 아득한 산맥 지평선을 내려다보는 각도
        controller.pan = 0;
        controller.camera.farClipping = 100000;  // 20km 원경 끝까지 잘림 없이 시원하게 보이도록 확장
        controller.camera.nearClipping = 1.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight())
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 💡 5km 이내 근경은 맑고 또렷하게 보장하고, 5km~20km 원경 지평선만 대기와 어우러지는 원경 대기 안개
        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
        heightFog.fogColor.setColorByRGB(160, 192, 224); // SkyAtmosphere 대기 산란 지평선 톤과 조화로운 Haze Blue
        heightFog.thickness = 500;               // 수직 안개 두께를 낮게 유지 (근경 지면 뽀얗게 되는 현상 완전 방지)
        heightFog.startDepth = 5000;             // 5km 이내 근경 지면은 안개 0% (맑고 칼같은 디테일)
        heightFog.endDepth = 20000;              // 5km ~ 20km 원경 구간에서만 지평선 대기와 은은하게 믹싱
        heightFog.density = 1;
        view.postEffectManager.addEffect(heightFog);


        // 3. 거대 Terrain 생성
        const terrain = new RedGPU.Display.Terrain(
            redGPUContext,
            undefined,
            'CDLOD_Terrain'
        );

        // 3-2. 텍스처 일괄 설정 — splat 미지정 시 Heightmap 경사도/고도 기반 100% 자동 SplatMap 베이킹 가동!
        terrain.setup({
            height: '../../../assets/terrain/terrainTest_001/height.jpg',
            baseColor: '../../../assets/terrain/terrainTest_001/diffuse.jpg',
            orm: '../../../assets/terrain/terrainTest_001/orm.jpg',
            splat: '../../../assets/terrain/terrainTest_001/splatMap.jpg', // 주석 처리 시 Auto Slope/Altitude 모드 가동!
        });


        // 💡 디테일 레이어 4종 등록
        terrain.addLayer({
            name: 'Leaves',
            diffuse: '../../../assets/terrain/terrainTest_001/layer/leave.jpg',
            normal: '../../../assets/terrain/terrainTest_001/layer/leave_normal.jpg',
            height: '../../../assets/terrain/terrainTest_001/layer/leave_height.jpg',
            orm: '../../../assets/terrain/terrainTest_001/layer/leave_orm.jpg',
            roughnessFactor: 0.85
        });

        terrain.addLayer({
            name: 'Rock',
            diffuse: '../../../assets/terrain/terrainTest_001/layer/rock.jpg',
            normal: '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg',
            height: '../../../assets/terrain/terrainTest_001/layer/rock_height.jpg',
            orm: '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg',
            roughnessFactor: 0.90
        });


        terrain.addLayer({
            name: 'Gravel',
            diffuse: '../../../assets/terrain/terrainTest_001/layer/gravel.jpg',
            normal: '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg',
            height: '../../../assets/terrain/terrainTest_001/layer/gravel_height.jpg',
            orm: '../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg',
            roughnessFactor: 0.85
        });

        terrain.addLayer({
            name: 'Grass',
            diffuse: '../../../assets/terrain/terrainTest_001/layer/grass.jpg',
            normal: '../../../assets/terrain/terrainTest_001/layer/grass_normal.jpg',
            height: '../../../assets/terrain/terrainTest_001/layer/grass_height.jpg',
            orm: '../../../assets/terrain/terrainTest_001/layer/grass_orm.jpg',
            roughnessFactor: 0.85
        });


        // 3-5. 지형 파라미터 — 20km 초대형 스케일 설정 및 언리얼 스타일 공간 그리드 스트리밍 활성화
        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2]; // 원점 중앙 정렬
        terrain.maxLOD = MAX_LOD;
        terrain.tileScale = 400.0;                 // 20km 초대형 스케일에 맞춘 촘촘한 텍스처 밀도 타일링 비율

        // 🛰️ 카메라 중심 공간 그리드 스트리밍 설정 (월드 파티션)
        terrain.enableStreaming = true;
        terrain.spatialGrid.cellSize = 512;        // 512m 단위 셀 분할
        terrain.spatialGrid.loadingRadius = 3500;  // 반경 3.5km 동적 로딩

        terrain.setOnTileLoad((tile) => {
            frameLoadCount++;
        });

        terrain.setOnTileUnload((tile) => {
            frameUnloadCount++;
        });

        scene.addTerrain(terrain);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 4. RVT (Runtime Virtual Texture) 생성 및 Terrain에 연결
        //    - 4종 레이어 Height-Blend 결과를 오프스크린으로 GPU 베이킹
        //    - 이후 셰이더는 단 2회 텍스처 페치로 지형 렌더링 (기존 30회+ → 2회)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 6. HUD 루프 (rAF)
        const rawCam = controller;

        function hudLoop() {
            lastFrameLoadCount = frameLoadCount;
            lastFrameUnloadCount = frameUnloadCount;
            frameLoadCount = 0;
            frameUnloadCount = 0;

            updateHUD(terrain, rawCam);
            updateSpatialGrid2DDebugger(terrain, rawCam);
        }


        // 5. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, hudLoop);


        // 7. GUI 패널
        buildGUI(redGPUContext, terrain, controller, view, heightFog);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        const el = document.createElement('div');
        el.style.cssText = 'color:red;padding:20px;font-family:monospace;';
        el.textContent = 'WebGPU 초기화 실패: ' + failReason;
        document.body.appendChild(el);
    }
);

// ─── GUI 패널 ──────────────────────────────────────────────────────────────────
function buildGUI(redGPUContext, terrain, controller, view, heightFog) {
    // 텍스처 켜기/끄기 토글용 원본 텍스처 인스턴스 백업 참조
    const baseColorTextureInstance = terrain.baseColorTexture;
    const ormTextureInstance = terrain.ormTexture;
    const splatTextureInstance = terrain.splatTexture;

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {

            // ── 0. HeightFog (대기 안개) 설정 ────────────────────────────────────
            const fogFolder = pane.addFolder({title: '🌫️ HeightFog (대기 안개)', expanded: true});

            const fogState = {
                enabled: true,
                fogColor: {
                    r: heightFog.fogColor.r,
                    g: heightFog.fogColor.g,
                    b: heightFog.fogColor.b
                }
            };

            fogFolder.addBinding(fogState, 'enabled', {label: '안개 사용 (ON/OFF)'})
                .on('change', (ev) => {
                    if (ev.value) {
                        view.postEffectManager.addEffect(heightFog);
                    } else {
                        view.postEffectManager.removeEffect(heightFog);
                    }
                });

            fogFolder.addBinding(heightFog, 'density', {
                label: '안개 밀도 (Density)',
                min: 0, max: 5, step: 0.05
            });

            fogFolder.addBinding(heightFog, 'thickness', {
                label: '안개 두께 (Thickness)',
                min: 10, max: 3000, step: 10
            });

            fogFolder.addBinding(heightFog, 'startDepth', {
                label: '시작 거리 (Start Depth)',
                min: 0, max: 30000, step: 100
            });

            fogFolder.addBinding(heightFog, 'endDepth', {
                label: '최대 거리 (End Depth)',
                min: 1000, max: 50000, step: 500
            });

            fogFolder.addBinding(heightFog, 'baseHeight', {
                label: '기본 높이 (Base Height)',
                min: -1000, max: 2000, step: 10
            });

            fogFolder.addBinding(fogState, 'fogColor', {
                label: '안개 색상 (Fog Color)',
                color: {type: 'float'}
            }).on('change', (ev) => {
                heightFog.fogColor.setColorByRGB(
                    Math.round(ev.value.r * 255),
                    Math.round(ev.value.g * 255),
                    Math.round(ev.value.b * 255)
                );
            });

            // ── 0.5. 공간 그리드 스트리밍 & 프레임 예산 ─────────────────────────
            const streamingFolder = pane.addFolder({title: '🛰️ 공간 그리드 스트리밍 & 프레임 예산', expanded: true});

            streamingFolder.addBinding(terrain.spatialGrid, 'maxLoadsPerFrame', {
                label: '프레임당 최대 로드 예산',
                min: 0, max: 10, step: 1
            });

            streamingFolder.addBinding(terrain.spatialGrid, 'loadingRadius', {
                label: '스트리밍 로딩 반경 (m)',
                min: 1000, max: 10000, step: 250
            });

            // ── 1. RVT (Runtime Virtual Texture) 설정 ───────────────────────────
            const rvtFolder = pane.addFolder({title: '⚡ RVT (Runtime Virtual Texture)', expanded: true});

            rvtFolder.addButton({title: '🔄 RVT 수동 재베이킹 (Rebake)'})
                .on('click', () => {
                    console.log('🔄 RVT 수동 재베이킹 실행');
                    terrain.material.bakeRVT();
                });

            rvtFolder.addBinding(terrain.material, 'debugSplatTexture', {
                label: '디버그: Splat 맵 채널 보기'
            });

            // ── 2. Terrain 기본 & LOD 설정 ──────────────────────────────────────
            const terrainFolder = pane.addFolder({title: '🌍 Terrain (기본 & LOD)', expanded: true});

            const state = {
                wireframe: false,
                useMorph: terrain.useMorph,
                maxLOD: terrain.maxLOD,
                minHeight: terrain.minHeight,
                maxHeight: terrain.maxHeight,
                worldSizeX: terrain.worldSize[0],
                worldSizeZ: terrain.worldSize[1],
                useBaseColorTexture: true,
                useOrmTexture: true,
                useSplatTexture: true,
            };

            terrainFolder.addBinding(state, 'wireframe', {label: '와이어프레임'})
                .on('change', (ev) => {
                    terrain.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                    terrain.dirtyPipeline = true;
                });

            terrainFolder.addBinding(state, 'useMorph', {label: 'LOD 모핑 (크랙 방지)'})
                .on('change', (ev) => {
                    terrain.useMorph = ev.value;
                });

            terrainFolder.addBinding(state, 'maxLOD', {
                label: '최대 LOD',
                min: 1, max: 8, step: 1
            }).on('change', (ev) => {
                terrain.maxLOD = ev.value;
            });

            // 높이 범위
            const heightFolder = terrainFolder.addFolder({title: '📐 높이 범위 (Height)', expanded: true});
            heightFolder.addBinding(state, 'minHeight', {
                label: '최소 높이',
                min: -500, max: 0, step: 5
            }).on('change', (ev) => {
                terrain.minHeight = ev.value;
            });
            heightFolder.addBinding(state, 'maxHeight', {
                label: '최대 높이',
                min: 10, max: 3000, step: 10
            }).on('change', (ev) => {
                terrain.maxHeight = ev.value;
            });

            // 월드 크기
            const scaleFolder = terrainFolder.addFolder({title: '🌐 월드 스케일', expanded: false});
            scaleFolder.addBinding(state, 'worldSizeX', {
                label: '가로 크기 (X)',
                min: 1000, max: 50000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
                terrain.worldOffset = [-ev.value / 2, terrain.worldOffset[1]];
            });
            scaleFolder.addBinding(state, 'worldSizeZ', {
                label: '세로 크기 (Z)',
                min: 1000, max: 50000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
                terrain.worldOffset = [terrain.worldOffset[0], -ev.value / 2];
            });

            // ── 3. 타일링 & 블렌딩 설정 ──────────────────────────────────────────
            const tilingFolder = pane.addFolder({title: '🎨 타일링 및 혼합 (Tiling & Blending)', expanded: true});

            tilingFolder.addBinding(terrain, 'tileScale', {
                label: '디테일 타일링 (근거리)',
                min: 1.0, max: 1000.0, step: 1.0
            });
            tilingFolder.addBinding(terrain, 'macroScale', {
                label: '매크로 타일링 (원거리)',
                min: 0.1, max: 10.0, step: 0.1
            });
            tilingFolder.addBinding(terrain, 'blendContrast', {
                label: '높이 블렌드 대비 (Contrast)',
                min: 0, max: 1.0, step: 0.01
            });
            tilingFolder.addBinding(terrain, 'baseColorWeight', {
                label: '베이스 컬러 맵 혼합 비율',
                min: 0, max: 1.0, step: 0.05
            });
            tilingFolder.addBinding(terrain, 'baseColorBlendMode', {
                label: '베이스 컬러 혼합 모드',
                options: {
                    '직접 혼합 (Mix / Lerp)': 'mix',
                    '곱셈 틴트 (Multiply)': 'multiply'
                }
            });

            // ── 4. PBR 재질 & 음영 설정 ──────────────────────────────────────────
            const pbrFolder = pane.addFolder({title: '✨ PBR 재질 & 음영 (PBR & Lighting)', expanded: true});

            pbrFolder.addBinding(terrain, 'roughnessFactor', {
                label: '글로벌 거칠기 배율 (Global Roughness)',
                min: 0, max: 1, step: 0.05
            });
            pbrFolder.addBinding(terrain, 'normalScale', {
                label: '노멀 맵 강도',
                min: 0, max: 3, step: 0.1
            });
            pbrFolder.addBinding(terrain, 'occlusionStrength', {
                label: '오클루전 강도 (AO)',
                min: 0, max: 2, step: 0.05
            });
            pbrFolder.addBinding(terrain, 'metallicFactor', {
                label: '금속성 (Metallic)',
                min: 0, max: 1, step: 0.05
            });

            // ── 5. 개별 레이어 거칠기 설정 ─────────────────────────────────────
            const layerFolder = pane.addFolder({title: '🌱 개별 레이어 거칠기 (Layer Roughness)', expanded: true});

            const layerState = {
                leavesRoughness: terrain.material.layers[0]?.roughnessFactor ?? 0.85,
                rockRoughness: terrain.material.layers[1]?.roughnessFactor ?? 0.90,
                gravelRoughness: terrain.material.layers[2]?.roughnessFactor ?? 0.85,
                grassRoughness: terrain.material.layers[3]?.roughnessFactor ?? 0.85,
            };

            layerFolder.addBinding(layerState, 'leavesRoughness', {
                label: 'Layer 0: Leaves (낙엽)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.material.updateLayer(0, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'rockRoughness', {
                label: 'Layer 1: Rock (바위)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.material.updateLayer(1, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'gravelRoughness', {
                label: 'Layer 2: Gravel (자갈)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.material.updateLayer(2, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'grassRoughness', {
                label: 'Layer 3: Grass (잔디)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.material.updateLayer(3, {roughnessFactor: ev.value});
            });

            // ── 6. 글로벌 지형 텍스처 관리 ────────────────────────────────────────
            const textureFolder = pane.addFolder({title: '🖼️ 글로벌 지형 텍스처 (Global Textures)', expanded: true});

            textureFolder.addBinding(state, 'useBaseColorTexture', {
                label: '베이스 컬러 맵 사용'
            }).on('change', (ev) => {
                terrain.baseColorTexture = ev.value ? baseColorTextureInstance : null;
                terrain.material.bakeRVT();
            });

            textureFolder.addBinding(state, 'useOrmTexture', {
                label: 'ORM 맵 사용'
            }).on('change', (ev) => {
                terrain.ormTexture = ev.value ? ormTextureInstance : null;
                terrain.material.bakeRVT();
            });

            textureFolder.addBinding(state, 'useSplatTexture', {
                label: '스플랫 맵 사용'
            }).on('change', (ev) => {
                terrain.splatTexture = ev.value ? splatTextureInstance : null;
                terrain.material.bakeRVT();
            });

        }
    });
}

