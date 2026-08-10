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

const WORLD_SIZE = 1024.0;   // 월드 가로세로 크기 (8192m × 8192m = 8.2km 표준 오픈월드 규격, 1 Pixel = 1 Meter 1:1 정밀 해상도)
const MAX_LOD = 7;          // 최대 LOD 레벨 (8.2km 지평선 세분화 7단계)
const MIN_H = 0.0;
const MAX_H = 50.0;        // 최대 높이 (8.2km 스케일에 입체적이고 또렷한 최적 고도: 300m)

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
        🛰 활성 스트리밍 셀 : <b style="color:#38bdf8;">${streamedTileCount}</b>개 (반경 ${(terrain.spatialGrid.loadingRadius / 1000).toFixed(2)}km)<br>
        📥 프레임당 로드 (toLoad)   : <b style="color:#4ade80;">${terrain.tileStreamMetrics.lastFrameLoadCount}</b>개 (예산: ${maxBudget > 0 ? maxBudget + '개/프레임' : '제한없음'})<br>
        ⏳ 로딩 대기 큐 (Pending)   : <b style="color:#fbbf24;">${pendingQueueCount}</b>개<br>
        📤 프레임당 언로드 (toUnload) : <b style="color:#f87171;">${terrain.tileStreamMetrics.lastFrameUnloadCount}</b>개<br>
        🎯 중심 셀 위치     : <b style="color:#a7f3d0;">Cell(${centerGridX}, ${centerGridZ})</b><br>
        📐 월드 스케일     : <b style="color:#fbbf24;">${WORLD_SIZE} × ${WORLD_SIZE}</b><br>
        🏔 최대 높이       : <b style="color:#f87171;">${MAX_H}</b><br>
        🔢 최대 LOD        : <b style="color:#c084fc;">${MAX_LOD}</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        🚶 Character 조작<br>
        &nbsp;&nbsp;이동: <b>W, A, S, D</b><br>
        &nbsp;&nbsp;달리기: <b>Shift 누르고 이동</b><br>
        &nbsp;&nbsp;카메라: <b>마우스 드래그 (Orbit)</b><br>
        &nbsp;&nbsp;X: <b>${cx}</b>  Y: <b>${cy}</b>  Z: <b>${cz}</b>
    `;
}


// ─── RedGPU 초기화 ─────────────────────────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {

        // 1. 카메라 — 캐릭터 추적용 OrbitController 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;
        controller.tilt = -15;
        controller.minDistance = 5;
        controller.maxDistance = 150;
        controller.minTilt = -85;
        controller.maxTilt = -5;
        controller.camera.farClipping = 100000;
        controller.camera.nearClipping = 1.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        scene.shadowManager.directionalShadowManager.strength = 0.95;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight())
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        // view.skyAtmosphere = skyAtmosphere;

        // 💡 5km 이내 근경은 맑고 또렷하게 보장하고, 5km~20km 원경 지평선만 대기와 어우러지는 원경 대기 안개
        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
        heightFog.fogColor.setColorByRGB(160, 192, 224); // SkyAtmosphere 대기 산란 지평선 톤과 조화로운 Haze Blue
        heightFog.thickness = 500;               // 수직 안개 두께를 낮게 유지 (근경 지면 뽀얗게 되는 현상 완전 방지)
        heightFog.startDepth = 5000;             // 5km 이내 근경 지면은 안개 0% (맑고 칼같은 디테일)
        heightFog.endDepth = 20000;              // 5km ~ 20km 원경 구간에서만 지평선 대기와 은은하게 믹싱
        heightFog.density = 1;
        view.postEffectManager.addEffect(heightFog);
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
        terrain.addLayer({
            name: 'Grass',
            diffuse: '../../../assets/terrain/terrainTest_001/layer/grass.jpg',
            normal: '../../../assets/terrain/terrainTest_001/layer/grass_normal.jpg',
            height: '../../../assets/terrain/terrainTest_001/layer/grass_height.jpg',
            orm: '../../../assets/terrain/terrainTest_001/layer/grass_orm.jpg',
            roughnessFactor: 0.85
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



        // 3-5. 지형 파라미터 — 20km 초대형 스케일 설정 및 언리얼 스타일 공간 그리드 스트리밍 활성화
        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2]; // 원점 중앙 정렬
        terrain.maxLOD = MAX_LOD;
        terrain.tileScale = 32.0;                  // 1K 레이어 텍스처 질감과 노멀이 가장 쨍하고 정교하게 표현되는 최적 타일링 배율 (32.0)

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
        terrain.receiveShadow = true;

        // ── GLTF 캐릭터 로딩 ────────────────────────
        let soldierMesh = null;
        let characterController = null;
        let stateMachine = null;
        let targetStateName = 'Idle';
        let lastTime = null;

        const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
        new RedGPU.GLTFLoader(
            redGPUContext,
            MODEL_URL,
            (loader) => {
                soldierMesh = loader.resultMesh;
                soldierMesh.setCastShadowRecursively(true);
                soldierMesh.setReceiveShadowRecursively(true);
                // 땅 높이에 맞추기 위해 초기화
                soldierMesh.x = 0;
                soldierMesh.z = 0;
                soldierMesh.y = terrain.getTerrainHeight(0, 0);

                scene.addChild(soldierMesh);

                characterController = new RedGPU.Charactor.SimpleCharacterController(
                    redGPUContext,
                    soldierMesh,
                    view.camera,
                    {
                        speed: 15.0,     // 거대 지형에 맞게 속도를 조절
                        runSpeed: 45.0,
                        rotationSpeed: 8.0,
                        floorHeight: soldierMesh.y,
                    }
                );

                const clips = loader.parsingResult.animations;
                if (clips && clips.length > 0) {
                    const idleState = clips[0];
                    const runState = clips[1];
                    const walkState = clips[3] || clips[2];

                    idleState.name = 'Idle';
                    walkState.name = 'Walk';
                    runState.name = 'Run';

                    stateMachine = new RedGPU.AnimStateMachine(idleState);
                    stateMachine.addState(walkState);
                    stateMachine.addState(runState);

                    const BLEND = 0.25;
                    const pairs = [
                        ['Idle', 'Walk'], ['Idle', 'Run'],
                        ['Walk', 'Idle'], ['Walk', 'Run'],
                        ['Run', 'Idle'], ['Run', 'Walk'],
                    ];
                    pairs.forEach(([from, to]) => {
                        stateMachine.addTransition({
                            fromState: from,
                            toState: to,
                            duration: BLEND,
                            conditions: () => targetStateName === to,
                        });
                    });

                    loader.stopAnimation();
                    loader.playAnimation(idleState);
                    if (loader.activeAnimations.length > 0) {
                        loader.activeAnimations[0].animStateMachine = stateMachine;
                    }
                }
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );

        // 6. HUD 루프 (rAF)
        const rawCam = controller;

        function hudLoop() {
            updateHUD(terrain, rawCam);
            updateSpatialGrid2DDebugger(terrain, rawCam);
            updateHeightmapAtlas2DDebugger(terrain);
        }

        // 5. 렌더러 시작 및 루프 등록
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            if (soldierMesh && characterController) {
                // 1. 현재 캐릭터 X, Z 기준 지형 높이 실시간 구하기
                const currentHeight = terrain.getTerrainHeight(soldierMesh.x, soldierMesh.z);

                // 2. 캐릭터 컨트롤러 바닥 높이 동적 설정
                characterController.floorHeight = currentHeight;

                // 3. 캐릭터 컨트롤러 업데이트
                characterController.update(view, time);

                // 4. 카메라가 캐릭터 위치를 부드럽게 추적하도록 갱신
                const c = view.camera;
                c.centerX = soldierMesh.x;
                c.centerY = soldierMesh.y + 2.0; // 눈높이에 오프셋 추가
                c.centerZ = soldierMesh.z;

                // 5. 상태 업데이트
                if (characterController.isRunning) targetStateName = 'Run';
                else if (characterController.isMoving) targetStateName = 'Walk';
                else targetStateName = 'Idle';
            }
            hudLoop();
        });

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
                min: 1000, max: 10000, step: 250
            });

            // ── 4. 🎨 타일링 및 혼합 (Tiling & Blending) ───────────────────────────
            const tilingFolder = pane.addFolder({title: '🎨 타일링 및 혼합 (Tiling & Blending)', expanded: true});

            tilingFolder.addBinding(terrain, 'tileScale', {
                label: '디테일 타일링 (근거리)',
                min: 1.0, max: 5000.0, step: 10.0
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

            // ── 7. 🖼️ 글로벌 지형 텍스처 (Global Textures) ──────────────────────────
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

            // ── 8. ⚡ RVT 디버그 ──────────────────────────────────────────────────
            const rvtFolder = pane.addFolder({title: '⚡ RVT (Runtime Virtual Texture)', expanded: true});

            rvtFolder.addBinding(terrain.material, 'debugSplatTexture', {
                label: '디버그: Splat 맵 채널 보기'
            });

            // ── 9. 🌫️ HeightFog (대기 안개) ───────────────────────────────────────
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

        }
    });
}

