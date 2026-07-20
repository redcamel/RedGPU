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

const WORLD_SIZE = 4096;   // 월드 가로세로 크기 (거대 영토로 변경)
const MAX_LOD = 8;      // 최대 LOD 레벨 (2^8 = 256분할로 더 조밀하게 세분화)
const MIN_H = 0;
const MAX_H = 1200;    // 최대 높이 (1,200유닛의 거대한 고산지대)

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
document.body.appendChild(hud);

function updateHUD(terrain, camera) {
    const leafCount = terrain.quadtree ? terrain.quadtree.leafNodes.length : 0;
    const cx = camera.x.toFixed(1);
    const cy = camera.y.toFixed(1);
    const cz = camera.z.toFixed(1);
    hud.innerHTML = `
        <b style="color:#7dd3fc;font-size:14px;">🌍 CDLOD Quadtree</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        🗂 활성 리프 노드 : <b style="color:#4ade80;">${leafCount}</b><br>
        📐 월드 스케일   : <b style="color:#fbbf24;">${WORLD_SIZE} × ${WORLD_SIZE}</b><br>
        🏔 최대 높이     : <b style="color:#f87171;">${MAX_H}</b><br>
        🔢 최대 LOD      : <b style="color:#c084fc;">${MAX_LOD}</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        📷 카메라<br>
        &nbsp;&nbsp;X: <b>${cx}</b>  Y: <b>${cy}</b>  Z: <b>${cz}</b>
    `;
}

// ─── RedGPU 초기화 ─────────────────────────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {

        // 1. 카메라 — 거대 스케일에 맞춰 멀리 배치하고, 시선을 대폭 낮춰 지면 근처에서 고산을 올려다보도록 앵글 구성
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 200;
        controller.distance = 3500;   // 웅장한 전경을 보기 위해 뒤로 물러남
        controller.rotationX = 18;    // 18도 경사의 매우 낮은 부감으로 거대 산맥의 높이감을 시각적으로 극대화
        controller.rotationY = 45;
        controller.camera.farClipping = 160000;
        controller.camera.nearClipping = 0.5;

        // 2. 씬 & 뷰
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 2-1. 노을녘 태양광 (Directional Light) 추가 — 고도를 극도로 낮춰 매우 길고 거대한 골짜기 그림자 생성
        const directionalLight = new RedGPU.Light.DirectionalLight([-0.8, -0.35, -0.5], '#ffe8d1');
        directionalLight.intensity = 2.0; // 태양빛 강도 증폭
        scene.lightManager.addDirectionalLight(directionalLight);

        // 💡 전체화면 크기 설정 및 창 리사이즈 대응
        redGPUContext.setSize('100%', '100%');
        window.addEventListener('resize', () => redGPUContext.setSize('100%', '100%'));

        // 3. 거대 Terrain 생성
        const terrain = new RedGPU.Display.Terrain(
            redGPUContext,
            undefined,
            'CDLOD_Terrain'
        );
        {
            // // 3-1. 높이맵 텍스처
            // terrain.heightTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_001/height.jpg',
            //
            //     true,
            //     null,
            //     null,
            //     // 'rgba16float',
            //     'r16float',
            // );
            //
            // // 3-2. PBR 머티리얼 텍스처
            // terrain.material.baseColorTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_001/baseColor.jpg'
            // );
            //
            //
            // // 3-3. PBR 디테일 노멀맵 텍스처 (타일링 설정으로 근접 디테일 극대화)
            // terrain.material.normalTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_001/normal.jpg'
            // );
            // terrain.material.use_normalTexture_KHR_texture_transform = true;
            // terrain.material.normalTexture_KHR_texture_transform_scale = [1024, 1024];
        }
        {
            // 3-1. 높이맵 텍스처
            terrain.heightTexture = new RedGPU.Resource.BitmapTexture(
                redGPUContext,
                '../../../assets/terrain/terrainTest_002/height.jpeg',

                true,
                null,
                null,
                // 'rgba16float',
                'r16float',
            );

            // 3-2. PBR 머티리얼 텍스처
            terrain.material.baseColorTexture = new RedGPU.Resource.BitmapTexture(
                redGPUContext,
                '../../../assets/terrain/terrainTest_002/baseColor.jpg'
            );


        }
        {
            // // // 3-1. 높이맵 텍스처
            // terrain.heightTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_003/height.jpg',
            //     true,
            //     null,
            //     null,
            //     // 'rgba16float',
            //     'r16float',
            // );
            //
            // // 3-2. PBR 머티리얼 텍스처
            // terrain.material.baseColorTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_003/baseColor.jpg'
            // );
            //
            //
            // // 3-3. PBR 디테일 노멀맵 텍스처 (타일링 설정으로 근접 디테일 극대화)
            // terrain.material.normalTexture = new RedGPU.Resource.BitmapTexture(
            //     redGPUContext,
            //     '../../../assets/terrain/terrainTest_003/normal.jpg'
            // );
        }


        // 3-5. 지형 파라미터 — 거대 스케일 설정
        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2]; // 원점 중앙 정렬
        terrain.maxLOD = MAX_LOD;

        scene.addTerrain(terrain);

        // 4. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. HUD 루프 (rAF)
        const rawCam = controller;

        function hudLoop() {
            updateHUD(terrain, rawCam);
            requestAnimationFrame(hudLoop);
        }

        requestAnimationFrame(hudLoop);

        // 6. GUI 패널
        buildGUI(redGPUContext, terrain, controller);
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
function buildGUI(redGPUContext, terrain, controller) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {

            // ── Terrain 설정 ──
            const terrainFolder = pane.addFolder({title: '🌍 Terrain (거대 스케일)', expanded: true});

            const state = {
                wireframe: false,
                maxLOD: MAX_LOD,
                minHeight: MIN_H,
                maxHeight: MAX_H,
                worldSizeX: WORLD_SIZE,
                worldSizeZ: WORLD_SIZE,
                lodThreshold: 2.0,
            };

            // 와이어프레임
            terrainFolder.addBinding(state, 'wireframe', {label: '와이어프레임'})
                .on('change', (ev) => {
                    terrain.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                    terrain.dirtyPipeline = true;
                });

            // maxLOD
            terrainFolder.addBinding(state, 'maxLOD', {
                label: '최대 LOD',
                min: 1, max: 8, step: 1
            }).on('change', (ev) => {
                terrain.maxLOD = ev.value;
            });

            // 높이 범위
            const heightFolder = terrainFolder.addFolder({title: '📐 높이 설정', expanded: true});
            heightFolder.addBinding(state, 'minHeight', {
                label: '최소 높이',
                min: -100, max: 0, step: 1
            }).on('change', (ev) => {
                terrain.minHeight = ev.value;
            });

            heightFolder.addBinding(state, 'maxHeight', {
                label: '최대 높이',
                min: 10, max: 2000, step: 10
            }).on('change', (ev) => {
                terrain.maxHeight = ev.value;
            });

            // 월드 스케일
            const scaleFolder = terrainFolder.addFolder({title: '🌐 월드 크기', expanded: true});
            scaleFolder.addBinding(state, 'worldSizeX', {
                label: 'Width (X)',
                min: 100, max: 10000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
                terrain.worldOffset = [-ev.value / 2, terrain.worldOffset[1]];
            });
            scaleFolder.addBinding(state, 'worldSizeZ', {
                label: 'Depth (Z)',
                min: 100, max: 10000, step: 100
            }).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
                terrain.worldOffset = [terrain.worldOffset[0], -ev.value / 2];
            });



        }
    });
}
