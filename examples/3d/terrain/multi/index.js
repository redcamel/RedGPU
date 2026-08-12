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

const WORLD_SIZE = 10000.0;  // 언리얼엔진 5 오픈월드 규격 (10km × 10km)
const MAX_LOD = 6;          // UE5 표준 6단계 Max LOD
const MIN_H = 0.0;
const MAX_H = 500.0;        // UE5 Z-Scale 표준 500m 고도범위

let terrain = null; // 💡 모듈 전역 스코프 - 헬퍼 함수들이 직접 참조 가능

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

// ─── 16x16 Heightmap Atlas 2D 합성 디버그 캔버스 ────────────────────────────
const hmAtlasCanvas = document.createElement('canvas');
hmAtlasCanvas.id = 'heightmap-atlas-debug-canvas';
hmAtlasCanvas.width = 160;
hmAtlasCanvas.height = 160;
hmAtlasCanvas.style.setProperty('position', 'fixed', 'important');
hmAtlasCanvas.style.setProperty('left', '124px', 'important');
hmAtlasCanvas.style.setProperty('bottom', '100px', 'important');
hmAtlasCanvas.style.setProperty('top', 'auto', 'important');
hmAtlasCanvas.style.setProperty('width', '100px', 'important');
hmAtlasCanvas.style.setProperty('height', '100px', 'important');
hmAtlasCanvas.style.setProperty('background', 'rgba(15, 23, 42, 0.85)', 'important');
hmAtlasCanvas.style.setProperty('border', '1px solid rgba(74, 222, 128, 0.5)', 'important');
hmAtlasCanvas.style.setProperty('border-radius', '6px', 'important');
hmAtlasCanvas.style.setProperty('pointer-events', 'auto', 'important');
hmAtlasCanvas.style.setProperty('cursor', 'pointer', 'important');
hmAtlasCanvas.style.setProperty('z-index', '99999', 'important');
hmAtlasCanvas.title = '클릭하여 실제 GPU 합성 높이맵 아틀라스 미리보기';

// 화면 정중앙 512x512 미리보기 팝업 모달
const previewModal = document.createElement('div');
previewModal.style.setProperty('position', 'fixed', 'important');
previewModal.style.setProperty('top', '50%', 'important');
previewModal.style.setProperty('left', '50%', 'important');
previewModal.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
previewModal.style.setProperty('width', '512px', 'important');
previewModal.style.setProperty('height', '512px', 'important');
previewModal.style.setProperty('max-width', '512px', 'important');
previewModal.style.setProperty('max-height', '512px', 'important');
previewModal.style.setProperty('background', 'rgba(15, 23, 42, 0.95)', 'important');
previewModal.style.setProperty('backdrop-filter', 'blur(12px)', 'important');
previewModal.style.setProperty('border', '2px solid rgba(74, 222, 128, 0.8)', 'important');
previewModal.style.setProperty('border-radius', '12px', 'important');
previewModal.style.setProperty('z-index', '100000', 'important');
previewModal.style.setProperty('display', 'none', 'important');
previewModal.style.setProperty('box-shadow', '0 25px 50px rgba(0,0,0,0.9)', 'important');
previewModal.style.setProperty('cursor', 'pointer', 'important');
previewModal.style.setProperty('box-sizing', 'border-box', 'important');
previewModal.style.setProperty('overflow', 'hidden', 'important');
previewModal.title = '클릭하면 닫힙니다';

const dpr = window.devicePixelRatio || 1;

const previewCanvas = document.createElement('canvas');
previewCanvas.width = 512 * dpr;
previewCanvas.height = 512 * dpr;
previewCanvas.style.setProperty('width', '512px', 'important');
previewCanvas.style.setProperty('height', '512px', 'important');
previewCanvas.style.setProperty('max-width', '512px', 'important');
previewCanvas.style.setProperty('max-height', '512px', 'important');
previewCanvas.style.setProperty('display', 'block', 'important');
previewCanvas.style.setProperty('image-rendering', 'pixelated', 'important');
previewCanvas.style.setProperty('margin', '0', 'important');
previewCanvas.style.setProperty('padding', '0', 'important');
previewCanvas.style.setProperty('border', 'none', 'important');

previewModal.appendChild(previewCanvas);
document.body.appendChild(previewModal);

// 모달 영역 누르면 즉시 닫기
previewModal.onclick = () => {
    previewModal.style.setProperty('display', 'none', 'important');
};

const downloadBtn = document.createElement('button');
downloadBtn.id = 'download-atlas-png-btn';
downloadBtn.innerHTML = '💾 Atlas PNG 다운로드';
downloadBtn.style.setProperty('position', 'fixed', 'important');
downloadBtn.style.setProperty('left', '230px', 'important');
downloadBtn.style.setProperty('bottom', '100px', 'important');
downloadBtn.style.setProperty('height', '32px', 'important');
downloadBtn.style.setProperty('padding', '0 12px', 'important');
downloadBtn.style.setProperty('background', 'rgba(15, 23, 42, 0.85)', 'important');
downloadBtn.style.setProperty('border', '1px solid rgba(74, 222, 128, 0.8)', 'important');
downloadBtn.style.setProperty('border-radius', '6px', 'important');
downloadBtn.style.setProperty('color', '#4ade80', 'important');
downloadBtn.style.setProperty('font-family', 'monospace', 'important');
downloadBtn.style.setProperty('font-weight', 'bold', 'important');
downloadBtn.style.setProperty('font-size', '12px', 'important');
downloadBtn.style.setProperty('cursor', 'pointer', 'important');
downloadBtn.style.setProperty('z-index', '99999', 'important');
downloadBtn.title = 'Terrain_HeightmapTileAtlasGPUTexture 를 PNG로 다운로드';

document.body.appendChild(hud);
document.body.appendChild(debugCanvas);
document.body.appendChild(hmAtlasCanvas);
document.body.appendChild(downloadBtn);
const debugCtx = debugCanvas.getContext('2d');
const hmAtlasCtx = hmAtlasCanvas.getContext('2d');
const modalCtx = previewCanvas.getContext('2d');

hmAtlasCanvas.onclick = () => {
    previewModal.style.setProperty('display', 'flex', 'important');
    renderAtlasModalPreview(terrain);
};

function renderAtlasModalPreview(terrainInstance) {
    const t = terrainInstance || terrain;
    if (!modalCtx || !t) return;
    t.renderAtlasPreview(modalCtx, 512, 512);
}

function updateHeightmapAtlas2DDebugger(terrainInstance) {
    if (!hmAtlasCtx) return;
    const w = hmAtlasCanvas.width;
    const h = hmAtlasCanvas.height;
    const tileSize = w / 16;

    hmAtlasCtx.clearRect(0, 0, w, h);

    // 1. 💡 격자 디버그 라인을 먼저 드로잉
    for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 16; z++) {
            const px = x * tileSize;
            const py = z * tileSize;

            hmAtlasCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            hmAtlasCtx.strokeRect(px, py, tileSize, tileSize);
        }
    }

    // 2. 💡 합성 완료된 활성 타일 영역이 격자 라인 위를 덮어쓰도록 드로잉
    for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 16; z++) {
            const key = `${x}_${z}`;
            const px = x * tileSize;
            const py = z * tileSize;

            if (terrainInstance && terrainInstance.isTileSynthesized(key)) {
                hmAtlasCtx.fillStyle = 'rgba(74, 222, 128, 0.65)';
                hmAtlasCtx.fillRect(px, py, tileSize, tileSize);
            }
        }
    }

    // 디버그 제목
    const count = terrainInstance ? terrainInstance.synthesizedTileCount : 0;
    hmAtlasCtx.fillStyle = '#4ade80';
    hmAtlasCtx.font = '10px monospace';
    hmAtlasCtx.fillText(`Atlas 16x16 (${count}/256)`, 4, 12);

    if (previewModal.style.display !== 'none') {
        renderAtlasModalPreview(terrainInstance);
    }
}

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

function updateHUD(terrain, camera) {
    const leafCount = terrain.spatialGrid ? terrain.spatialGrid.activeTileList.length : 0;
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
        <b style="color:#7dd3fc;font-size:14px;">🌍 UE5 World Partition & SpatialGrid</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        🗂 활성 지형 인스턴스 : <b style="color:#4ade80;">${leafCount}</b><br>
        🛰 활성 스트리밍 셀 : <b style="color:#38bdf8;">${streamedTileCount}</b>개 (반경 ${(terrain.spatialGrid.loadingRadius / 1000).toFixed(2)}km)<br>
        📥 프레임당 로드 (toLoad)   : <b style="color:#4ade80;">${terrain.tileStreamMetrics.lastFrameLoadCount}</b>개 (예산: ${maxBudget > 0 ? maxBudget + '개/프레임' : '제한없음'})<br>
        ⏳ 로딩 대기 큐 (Pending)   : <b style="color:#fbbf24;">${pendingQueueCount}</b>개<br>
        📤 프레임당 언로드 (toUnload) : <b style="color:#f87171;">${terrain.tileStreamMetrics.lastFrameUnloadCount}</b>개<br>
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
        controller.y = 800;                      // 20km 스케일을 시원하게 감상하는 800m 상공 시점
        controller.z = 0;                        // 중심부 남쪽 시점
        controller.tilt = -15;                   // 20km 아득한 산맥 지평선을 내려다보는 각도
        controller.pan = 0;
        controller.camera.farClipping = 100000;  // 20km 원경 끝까지 잘림 없이 시원하게 보이도록 확장
        controller.camera.nearClipping = 1.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight([-0.5, -1.0, -0.5], '#ffffff', 100000);
        scene.lightManager.addDirectionalLight(directionalLight);

        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;


        console.log(RedGPU)
        // 3. 거대 Terrain 생성 (verticesPerSide = 64 표준 규격 적용)
        terrain = new RedGPU.Display.Terrain(
            redGPUContext,
            'CDLOD_Terrain',

        );

        if (downloadBtn) {
            downloadBtn.onclick = () => {
                terrain.downloadHeightmapAtlasAsPNG();
            };
        }

        // 3-2. 텍스처 일괄 설정 — 완전 타일 스트리밍 모드 (setup 통 높이맵 무필요!)
        terrain.setup({
            baseColor: '../../../assets/terrain/terrainTest_001/diffuse.jpg',
            orm: '../../../assets/terrain/terrainTest_001/orm.jpg',
            splat: '../../../assets/terrain/terrainTest_001/splatMap.jpg',
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
        terrain.receiveShadow = true;               // 💡 지형이 그림자를 받도록 활성화 (receiveShadow = true)
        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2]; // 원점 중앙 정렬
        terrain.maxLOD = MAX_LOD;
        terrain.tileScale = 32.0;                  // 1K 레이어 텍스처 질감과 노멀이 가장 쨍하고 정교하게 표현되는 최적 타일링 배율 (32.0)
        terrain.blendContrast = 0.85;              // 입체적인 Height-Based Blending 콘트라스트 강도 (0.85)

        // 💡 8.2km 거대 지형 스케일에 맞는 섀도우 최대 렌더링 거리 확장 및 그림자 강도 1.0 설정
        scene.shadowManager.directionalShadowManager.maxShadowDistance = 3000;
        scene.shadowManager.directionalShadowManager.strength = 1.0;

        // 🛰️ 언리얼 엔진 5 표준 월드 파티션 공간 그리드 스트리밍 설정 (카메라 주변 동적 시야 로딩 반경)
        terrain.spatialGrid.loadingRadius = 2560;  // 카메라 시야 반경 2.56km 동적 로딩
        terrain.spatialGrid.maxLoadsPerFrame = 2;   // 프레임당 스트리밍 예산

        terrain.setTileUrlResolver((tile) => {
            const rStr = tile.tileRowStr;
            const cStr = tile.tileColStr;

            // 💡 16x16 그리드 상에서 (row 15, col 15) 코너 타일 및 엣지 타일 100% 매칭
            const BASE_URL = 'https://redcamel.github.io/testAsset/terrain/tile_001/';
            if (tile.tileRow === 15 && tile.tileCol === 15) {
                return BASE_URL + `28_134_86_730_13_449_449_16bit_tile_15_15.png`;
            } else if (tile.tileRow === 15) {
                return BASE_URL + `28_134_86_730_13_512_449_16bit_tile_15_${cStr}.png`;
            } else if (tile.tileCol === 15) {
                return BASE_URL + `28_134_86_730_13_449_512_16bit_tile_${rStr}_15.png`;
            } else {
                return BASE_URL + `28_134_86_730_13_512_512_16bit_tile_${rStr}_${cStr}.png`;
            }
        });

        terrain.setOnTileUnload((tile) => {
            console.log(`[Tile Streamer 📤] Unload Tile (${tile.gridX}, ${tile.gridZ})`);
        });

        scene.addTerrain(terrain);

        // 📦 PhongMaterial을 적용한 100개의 3D 박스 생성 및 지형 위 적절한 높이에 배치 (castShadow = true)
        const boxes = [];
        const boxCount = 100;
        const colorPalette = ['#ff3366', '#38bdf8', '#4ade80', '#fbbf24', '#a855f7', '#ec4899', '#f97316', '#06b6d4', '#eab308'];

        for (let i = 0; i < boxCount; i++) {
            const sizeX = 30 + Math.random() * 70;
            const sizeY = 30 + Math.random() * 90;
            const sizeZ = 30 + Math.random() * 70;

            const boxGeometry = new RedGPU.Primitive.Box(redGPUContext, sizeX, sizeY, sizeZ);
            const hexColor = colorPalette[i % colorPalette.length];
            const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext, hexColor);
            boxMaterial.shininess = 32;

            const boxMesh = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, boxMaterial);

            // 월드 중심 -2500m ~ +2500m 위치에 분포
            const rx = (Math.random() - 0.5) * 5000;
            const rz = (Math.random() - 0.5) * 5000;
            const baseTerrainH = terrain.getTerrainHeight(rx, rz);

            boxMesh.x = rx;
            boxMesh.y = baseTerrainH + sizeY * 0.5 + 150 + Math.random() * 350; // 지형 고도 상공 150m~650m 시원하게 높여 띄움
            boxMesh.z = rz;
            boxMesh.castShadow = true;

            // 회전 속도 및 부유 주기를 개별 지정
            boxMesh.__rotSpeedX = (Math.random() - 0.5) * 1.5;
            boxMesh.__rotSpeedY = (Math.random() - 0.5) * 2.0;
            boxMesh.__baseY = boxMesh.y;
            boxMesh.__floatFreq = 0.001 + Math.random() * 0.002;

            scene.addChild(boxMesh);
            boxes.push(boxMesh);
        }

        // 6. HUD 및 박스 애니메이션 통합 루프
        const rawCam = controller;

        function hudLoop(time) {
            const now = performance.now();
            const len = boxes.length;
            for (let i = 0; i < len; i++) {
                const b = boxes[i];
                b.rotationX += b.__rotSpeedX;
                b.rotationY += b.__rotSpeedY;
                b.y = b.__baseY + Math.sin(now * b.__floatFreq + i) * 60;
            }
            updateHUD(terrain, rawCam);
            updateSpatialGrid2DDebugger(terrain, rawCam);
            updateHeightmapAtlas2DDebugger(terrain);
        }

        // 5. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, hudLoop);


        // 7. GUI 패널
        buildGUI(redGPUContext, terrain, controller, view, directionalLight);
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
function buildGUI(redGPUContext, terrain, controller, view, directionalLight) {
    // 텍스처 켜기/끄기 토글용 원본 텍스처 인스턴스 백업 참조
    const baseColorTextureInstance = terrain.baseColorTexture;
    const ormTextureInstance = terrain.ormTexture;
    const splatTextureInstance = terrain.splatTexture;

    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        view,
        controller,
        ibl: true,
        skybox: true,
        gui: (pane) => {

            // ── 0. ☀️ 태양 조명 & 그림자 (Light & Shadow) ─────────────────────────
            const lightFolder = pane.addFolder({title: '☀️ 태양 조명 & 그림자 (Light & Shadow)', expanded: true});
            const shadowManager = view.scene.shadowManager.directionalShadowManager;

            const lightState = {
                elevation: directionalLight.elevation,
                azimuth: directionalLight.azimuth,
                shadowStrength: shadowManager.strength
            };

            lightFolder.addBinding(lightState, 'elevation', {
                label: '태양 고도각 (Elevation °)',
                min: 1.0,
                max: 90.0,
                step: 1.0
            })
                .on('change', (ev) => {
                    directionalLight.elevation = ev.value;
                    terrain.markDirty();
                });

            lightFolder.addBinding(lightState, 'azimuth', {
                label: '태양 방위각 (Azimuth °)',
                min: 0.0,
                max: 360.0,
                step: 1.0
            })
                .on('change', (ev) => {
                    directionalLight.azimuth = ev.value;
                    terrain.markDirty();
                });

            lightFolder.addBinding(lightState, 'shadowStrength', {
                label: '그림자 강도 (Strength)',
                min: 0.0,
                max: 1.0,
                step: 0.05
            })
                .on('change', (ev) => {
                    shadowManager.strength = ev.value;
                    terrain.markDirty();
                });

            // ── 1. 🌍 Terrain (기본 & LOD) ──────────────────────────────────────────
            const terrainFolder = pane.addFolder({title: '🌍 Terrain (기본 & LOD)', expanded: true});

            const state = {
                wireframe: false,
                verticesPerSide: terrain.verticesPerSide,
                maxLOD: terrain.maxLOD,
                lodThreshold: terrain.lodThreshold,
                minHeight: terrain.minHeight,
                maxHeight: terrain.maxHeight,
                worldSizeX: terrain.worldSize[0],
                worldSizeZ: terrain.worldSize[1],
                useBaseColorTexture: true,
                useOrmTexture: true,
                useSplatTexture: true,
            };

            terrainFolder.addBinding(state, 'wireframe', {label: '와이어프레임 (Wireframe)'})
                .on('change', (ev) => {
                    terrain.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                    terrain.dirtyPipeline = true;
                });

            terrainFolder.addBinding(state, 'verticesPerSide', {
                label: '한 변당 정점 수 (verticesPerSide)',
                options: {
                    '256 (255x255 quads)': RedGPU.Display.TERRAIN_VERTICES_PER_SIDE.SIZE_256,
                    '128 (127x127 quads)': RedGPU.Display.TERRAIN_VERTICES_PER_SIDE.SIZE_128,
                    '64 (63x63 quads - 기본)': RedGPU.Display.TERRAIN_VERTICES_PER_SIDE.SIZE_64,
                    '32 (31x31 quads)': RedGPU.Display.TERRAIN_VERTICES_PER_SIDE.SIZE_32,
                    '16 (15x15 quads)': RedGPU.Display.TERRAIN_VERTICES_PER_SIDE.SIZE_16,
                }
            }).on('change', (ev) => {
                terrain.verticesPerSide = ev.value;
            });

            terrainFolder.addBinding(state, 'maxLOD', {
                label: '최대 LOD (Max LOD)',
                min: 1, max: 8, step: 1
            }).on('change', (ev) => {
                terrain.maxLOD = ev.value;
            });

            terrainFolder.addBinding(state, 'lodThreshold', {
                label: 'LOD 분할 임계거리 (lodThreshold)',
                min: 1.0, max: 4.0, step: 0.1
            }).on('change', (ev) => {
                terrain.lodThreshold = ev.value;
            });

            // ── 2. 📐 높이 & 월드 규격 (Height & World Bounds) ────────────────────────
            const boundsFolder = pane.addFolder({title: '📐 높이 & 월드 규격 (Height & Bounds)', expanded: true});

            boundsFolder.addBinding(state, 'minHeight', {
                label: '최소 높이 (Min Height)',
                min: -500, max: 0, step: 5
            }).on('change', (ev) => {
                terrain.minHeight = ev.value;
            });

            boundsFolder.addBinding(state, 'maxHeight', {
                label: '최대 높이 (Max Height)',
                min: 10, max: 3000, step: 10
            }).on('change', (ev) => {
                terrain.maxHeight = ev.value;
            });

            boundsFolder.addBinding(state, 'worldSizeX', {
                label: '가로 크기 (World Size X)',
                min: 1000, max: 50000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
                terrain.worldOffset = [-ev.value / 2, terrain.worldOffset[1]];
            });

            boundsFolder.addBinding(state, 'worldSizeZ', {
                label: '세로 크기 (World Size Z)',
                min: 1000, max: 50000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
                terrain.worldOffset = [terrain.worldOffset[0], -ev.value / 2];
            });

            // ── 3. 🛰️ 공간 그리드 스트리밍 ──────────────────────────────────────────
            const streamingFolder = pane.addFolder({title: '🛰️ 공간 그리드 스트리밍 (Spatial Streaming)', expanded: true});

            streamingFolder.addBinding(terrain.spatialGrid, 'maxLoadsPerFrame', {
                label: '프레임당 최대 로드 예산',
                min: 0, max: 10, step: 1
            });

            streamingFolder.addBinding(terrain.spatialGrid, 'loadingRadius', {
                label: '스트리밍 로딩 반경 (m)',
                min: 1000, max: 20000, step: 500
            });

            // ── 4. 🎨 타일링 및 혼합 (Tiling & Blending) ───────────────────────────
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

            // ── 5. ✨ PBR 재질 & 음영 (PBR & Lighting) ─────────────────────────────
            const pbrFolder = pane.addFolder({title: '✨ PBR 재질 & 음영 (PBR & Lighting)', expanded: true});

            pbrFolder.addBinding(terrain, 'roughnessFactor', {
                label: '글로벌 거칠기 배율 (Global Roughness)',
                min: 0, max: 1, step: 0.05
            });
            pbrFolder.addBinding(terrain, 'normalScale', {
                label: '노멀 맵 강도 (Normal Scale)',
                min: 0, max: 3, step: 0.1
            });
            pbrFolder.addBinding(terrain, 'occlusionStrength', {
                label: '오클루전 강도 (AO Strength)',
                min: 0, max: 2, step: 0.05
            });
            pbrFolder.addBinding(terrain, 'metallicFactor', {
                label: '금속성 (Metallic)',
                min: 0, max: 1, step: 0.05
            });

            // ── 6. 🌱 개별 레이어 거칠기 (Layer Roughness) ──────────────────────────
            const layerFolder = pane.addFolder({title: '🌱 개별 레이어 거칠기 (Layer Roughness)', expanded: true});

            const currentLayers = terrain.layers;
            const layerState = {
                leavesRoughness: currentLayers[0]?.roughnessFactor ?? 0.85,
                rockRoughness: currentLayers[1]?.roughnessFactor ?? 0.90,
                gravelRoughness: currentLayers[2]?.roughnessFactor ?? 0.85,
                grassRoughness: currentLayers[3]?.roughnessFactor ?? 0.85,
            };

            layerFolder.addBinding(layerState, 'leavesRoughness', {
                label: 'Layer 0: Leaves (낙엽)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.updateLayer(0, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'rockRoughness', {
                label: 'Layer 1: Rock (바위)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.updateLayer(1, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'gravelRoughness', {
                label: 'Layer 2: Gravel (자갈)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.updateLayer(2, {roughnessFactor: ev.value});
            });

            layerFolder.addBinding(layerState, 'grassRoughness', {
                label: 'Layer 3: Grass (잔디)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.updateLayer(3, {roughnessFactor: ev.value});
            });

            // ── 7. 🖼️ 글로벌 지형 텍스처 (Global Textures) ──────────────────────────
            const textureFolder = pane.addFolder({title: '🖼️ 글로벌 지형 텍스처 (Global Textures)', expanded: true});

            textureFolder.addBinding(state, 'useBaseColorTexture', {
                label: '베이스 컬러 맵 사용'
            }).on('change', (ev) => {
                terrain.baseColorTexture = ev.value ? baseColorTextureInstance : null;
                terrain.material.bakeAllRVTTiles();
            });

            textureFolder.addBinding(state, 'useOrmTexture', {
                label: 'ORM 맵 사용'
            }).on('change', (ev) => {
                terrain.ormTexture = ev.value ? ormTextureInstance : null;
                terrain.material.bakeAllRVTTiles();
            });

            textureFolder.addBinding(state, 'useSplatTexture', {
                label: '스플랫 맵 사용'
            }).on('change', (ev) => {
                terrain.splatTexture = ev.value ? splatTextureInstance : null;
                terrain.material.bakeAllRVTTiles();
            });

            // ── 8. ⚡ RVT 디버그 ──────────────────────────────────────────────────
            const rvtFolder = pane.addFolder({title: '⚡ RVT (Runtime Virtual Texture)', expanded: true});

            rvtFolder.addBinding(terrain.material, 'debugSplatTexture', {
                label: '디버그: Splat 맵 채널 보기'
            }).on('change', () => {
                terrain.dirtyPipeline = true;
            });
        }
    });
}

