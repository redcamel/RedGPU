import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

// ─── 10km x 10km 거대 월드 및 타일 설정 ─────────────────────────────────────
const GRID_SIZE = 10;                     // 10x10 격자 (총 100개 타일)
const TILE_SIZE = 1000.0;                 // 타일당 1000m x 1000m
const TOTAL_WORLD_SIZE = TILE_SIZE * GRID_SIZE; // 전체 월드: 10,000m x 10,000m (10km)
const MAX_LOD = 6;                        // 10km 월드 크기에 맞는 LOD 계층
const MIN_H = 0.0;
const MAX_H = 100.0;                      // 산맥 표현을 위해 최대 높이 상향

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

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
const hud = document.createElement('div');
Object.assign(hud.style, {
    position: 'fixed', top: '12px', left: '12px',
    padding: '12px 18px',
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#e8f4ff',
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: '1.7',
    pointerEvents: 'none',
    zIndex: 9999,
    minWidth: '250px'
});
document.body.appendChild(hud);

function updateHUD(terrains, camera) {
    let totalLeafCount = 0;
    terrains.forEach(t => {
        if (t.quadtree && t.quadtree.leafNodes) {
            totalLeafCount += t.quadtree.leafNodes.length;
        }
    });

    hud.innerHTML = `
        <b style="color:#7dd3fc;font-size:14px;">🌍 10km Large-Scale World</b><br>
        <span style="color:#94a3b8;">──────────────────────</span><br>
        🧩 타일 구성     : <b style="color:#facc15;">${GRID_SIZE} × ${GRID_SIZE} (${terrains.length} Tiles)</b><br>
        🗂 활성 리프 노드 : <b style="color:#4ade80;">${totalLeafCount}</b><br>
        📐 전체 월드 스케일: <b style="color:#fbbf24;">${TOTAL_WORLD_SIZE / 1000}km × ${TOTAL_WORLD_SIZE / 1000}km</b><br>
        <span style="color:#94a3b8;">──────────────────────</span><br>
        📷 카메라 위치<br>
        &nbsp;&nbsp;X: <b>${camera.x.toFixed(1)}</b> Y: <b>${camera.y.toFixed(1)}</b> Z: <b>${camera.z.toFixed(1)}</b>
    `;
}

// ─── 공통 텍스처 에셋 데이터 구조 ─────────────────────────────────────────────
const TERRAIN_ASSETS = {
    height: '../../../assets/terrain/terrainTest_001/height.jpg',
    baseColor: '../../../assets/terrain/terrainTest_001/diffuse.jpg',
    orm: '../../../assets/terrain/terrainTest_001/orm.jpg',
    splat: '../../../assets/terrain/terrainTest_001/splatMap.jpg',
};

const LAYERS = [
    {
        name: 'Leaves',
        diffuse: '../../../assets/terrain/terrainTest_001/layer/leave.jpg',
        normal: '../../../assets/terrain/terrainTest_001/layer/leave_normal.jpg',
        height: '../../../assets/terrain/terrainTest_001/layer/leave_height.jpg',
        orm: '../../../assets/terrain/terrainTest_001/layer/leave_orm.jpg',
        roughnessFactor: 0.85
    },
    {
        name: 'Rock',
        diffuse: '../../../assets/terrain/terrainTest_001/layer/rock.jpg',
        normal: '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg',
        height: '../../../assets/terrain/terrainTest_001/layer/rock_height.jpg',
        orm: '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg',
        roughnessFactor: 0.90
    },
    {
        name: 'Gravel',
        diffuse: '../../../assets/terrain/terrainTest_001/layer/gravel.jpg',
        normal: '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg',
        height: '../../../assets/terrain/terrainTest_001/layer/gravel_height.jpg',
        orm: '../../../assets/terrain/terrainTest_001/layer/gravel_orm.jpg',
        roughnessFactor: 0.85
    },
    {
        name: 'Grass',
        diffuse: '../../../assets/terrain/terrainTest_001/layer/grass.jpg',
        normal: '../../../assets/terrain/terrainTest_001/layer/grass_normal.jpg',
        height: '../../../assets/terrain/terrainTest_001/layer/grass_height.jpg',
        orm: '../../../assets/terrain/terrainTest_001/layer/grass_orm.jpg',
        roughnessFactor: 0.85
    }
];

// ─── RedGPU 초기화 ─────────────────────────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 설정 (10km 거대 월드 조망용 시야 거리 설정)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 200;
        controller.distance = 4000;

        // 10km 원거리 지평선이 절리지 않도록 Far Clipping 확대
        if (controller.camera) {
            controller.camera.farClipping = 20000;
        }

        // 2. 씬 및 뷰 설정
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
        view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

        // 3. 10x10 멀티 지형(Terrain) 생성
        const terrains = [];
        const startOffset = -TOTAL_WORLD_SIZE / 2; // 전체 10km 월드의 중심을 (0,0)으로 설정

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const terrain = new RedGPU.Display.Terrain(
                    redGPUContext,
                    undefined,
                    `CDLOD_Terrain_${row}_${col}`
                );

                // 지형 기본 맵 설정
                terrain.setup(TERRAIN_ASSETS);

                // 디테일 레이어 4종 등록
                LAYERS.forEach(layer => terrain.addLayer(layer));

                // 지형 파라미터 및 월드 좌표 오프셋 설정
                terrain.minHeight = MIN_H;
                terrain.maxHeight = MAX_H;
                terrain.worldSize = [TILE_SIZE, TILE_SIZE];

                // 타일별 X, Z 위치 지정 (중심점 기준 정렬)
                const offsetX = startOffset + (col * TILE_SIZE) + (TILE_SIZE / 2);
                const offsetZ = startOffset + (row * TILE_SIZE) + (TILE_SIZE / 2);
                terrain.worldOffset = [offsetX, offsetZ];
                terrain.maxLOD = MAX_LOD;

                // 씬에 추가
                scene.addTerrain(terrain);
                terrains.push(terrain);
            }
        }

        // 4. Render Loop & HUD 업데이트
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            updateHUD(terrains, controller);
        });

        // 5. GUI 구성
        buildGUI(redGPUContext, terrains);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
    }
);

// ─── GUI 패널 ──────────────────────────────────────────────────────────────────
function buildGUI(redGPUContext, terrains) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const worldFolder = pane.addFolder({title: '🌍 10km 월드 제어', expanded: true});

            const state = {
                wireframe: false,
                useMorph: terrains[0].useMorph ?? true,
                maxLOD: terrains[0].maxLOD,
            };

            // 일괄 와이어프레임 전환
            worldFolder.addBinding(state, 'wireframe', {label: '전체 와이어프레임'})
                .on('change', (ev) => {
                    terrains.forEach(t => {
                        if (t.primitiveState) {
                            t.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                            t.dirtyPipeline = true;
                        }
                    });
                });

            // 일괄 LOD 모핑 전환
            worldFolder.addBinding(state, 'useMorph', {label: 'LOD 모핑 적용'})
                .on('change', (ev) => {
                    terrains.forEach(t => t.useMorph = ev.value);
                });

            // 일괄 최대 LOD 변경
            worldFolder.addBinding(state, 'maxLOD', {label: '최대 LOD', min: 1, max: 8, step: 1})
                .on('change', (ev) => {
                    terrains.forEach(t => t.maxLOD = ev.value);
                });
        }
    });
}