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

const WORLD_SIZE = 1000.0;   // 월드 가로세로 크기 (1000x1000 거대 지형 규격)
const MAX_LOD = 5;         // 최대 LOD 레벨 (쿼드트리 세분화 깊이)
const MIN_H = 0.0;
const MAX_H = 150.0;       // 최대 높이 (완만한 산봉우리 스케일)

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

        // 1. 카메라 — 1000m 스케일에 알맞은 웅장한 기본 주시 거리와 이동 감도로 조정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 20;
        controller.distance = 650;
        controller.rotationX = 25;    
        controller.rotationY = 45;
        controller.camera.farClipping = 5000;
        controller.camera.nearClipping = 0.5;

        // 2. 씬 & 뷰
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 2-1. 노을녘 태양광 (Directional Light) 추가 — 고도를 극도로 낮춰 매우 길고 거대한 골짜기 그림자 생성
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45
        directionalLight.enableDebugger = true

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
        // 3-1. 높이맵 텍스처
        terrain.heightTexture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/height.jpg',
            false,
            null,
            null,
            'r16float',
        );

        // 3-2. PBR 지형 스플랫 페인팅 리소스 설정
        const baseColorTextureInstance = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/diffuse.jpg',
        );
        terrain.material.baseColorTexture = baseColorTextureInstance;

        const ormTextureInstance = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/orm.jpg',
            true,
            null,
            null,
            'rgba8unorm'
        );
        terrain.material.ormTexture = ormTextureInstance;

        // 💡 2000m 거대 월드에 어울리는 최적의 텍스처 타일링 값 수동 기입
        terrain.material.tileScale = 75.0;
        terrain.material.macroScale = 10.0;

        const splatTextureInstance = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/terrain/terrainTest_001/splatMap.jpg',
            true,
            null,
            null,
            'rgba8unorm'
        );
        terrain.material.splatTexture = splatTextureInstance;

        terrain.material.diffuseArray = new RedGPU.Resource.TextureArray(
            redGPUContext,
            [
                '../../../assets/terrain/terrainTest_001/layer/grass.jpg',
                '../../../assets/terrain/terrainTest_001/layer/sand.jpg',
                '../../../assets/terrain/terrainTest_001/layer/rock.jpg',
                '../../../assets/terrain/terrainTest_001/layer/gravel.jpg'
            ]
        );

        terrain.material.normalArray = new RedGPU.Resource.TextureArray(
            redGPUContext,
            [
                '../../../assets/terrain/terrainTest_001/layer/grass_normal.jpg',
                '../../../assets/terrain/terrainTest_001/layer/sand_normal.jpg',
                '../../../assets/terrain/terrainTest_001/layer/rock_normal.jpg',
                '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg'
            ],
            true,
            null,
            null,
            'rgba8unorm'
        );
        terrain.material.heightArray = new RedGPU.Resource.TextureArray(
            redGPUContext,
            [
                '../../../assets/terrain/terrainTest_001/layer/grass_height.jpg',
                '../../../assets/terrain/terrainTest_001/layer/sand_height.jpg',
                '../../../assets/terrain/terrainTest_001/layer/rock_height.jpg',
                '../../../assets/terrain/terrainTest_001/layer/gravel_normal.jpg'
            ],
            true,
            null,
            null,
            'rgba8unorm'
        );
        terrain.material.ormArray = new RedGPU.Resource.TextureArray(
            redGPUContext,
            [
                '../../../assets/terrain/terrainTest_001/layer/sand_orm.jpg', // grass 임시 비금속 ORM 폴백
                '../../../assets/terrain/terrainTest_001/layer/sand_orm.jpg',
                '../../../assets/terrain/terrainTest_001/layer/rock_orm.jpg',
                '../../../assets/terrain/terrainTest_001/layer/sand_orm.jpg'  // gravel 임시 비금속 ORM 폴백
            ],
            true,
            null,
            null,
            'rgba8unorm'
        );

        // 💡 지형 베이스 필터 색상을 흰색으로 초기화하여 텍스처 본연의 밝기와 태양광 반사를 그대로 표현
        terrain.material.baseColorFactor = '#ffffff';

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
        buildGUI(redGPUContext, terrain, controller, baseColorTextureInstance, ormTextureInstance, splatTextureInstance);
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
function buildGUI(redGPUContext, terrain, controller, baseColorTextureInstance, ormTextureInstance, splatTextureInstance) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {

            // ── Terrain 설정 ──
            const terrainFolder = pane.addFolder({title: '🌍 Terrain (거대 스케일)', expanded: true});

            const state = {
                wireframe: false,
                useMorph: true,
                maxLOD: MAX_LOD,
                minHeight: MIN_H,
                maxHeight: MAX_H,
                worldSizeX: WORLD_SIZE,
                worldSizeZ: WORLD_SIZE,
                lodThreshold: 2.0,
                tileScale: 150.0,
                macroScale: 20.0,
                normalScale: 1.0,
                roughnessFactor: 0.85,
                occlusionStrength: 1.0,
                blendContrast: 0.0,
                useBaseColorTexture: true,
                useOrmTexture: true,
                useSplatTexture: true,
            };

            // 와이어프레임
            terrainFolder.addBinding(state, 'wireframe', {label: '와이어프레임'})
                .on('change', (ev) => {
                    terrain.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                    terrain.dirtyPipeline = true;
                });

            // LOD 모핑 토글
            terrainFolder.addBinding(state, 'useMorph', {label: 'LOD 모핑 (크랙 복구)'})
                .on('change', (ev) => {
                    terrain.useMorph = ev.value;
                    console.log(`LOD Morphing & Crack Resolution: ${ev.value ? 'ON' : 'OFF'}`);
                });

            // maxLOD
            terrainFolder.addBinding(state, 'maxLOD', {
                label: '최대 LOD',
                min: 1, max: 8, step: 1
            }).on('change', (ev) => {
                terrain.maxLOD = ev.value;
            });
            terrainFolder.addBinding(terrain.material, 'blendContrast', {
                label: '블렌드 대비 (Contrast)',
                min: 0, max: 1.0, step: 0.00001
            })
            terrainFolder.addBinding(terrain.material, 'debugSplatTexture')

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
                min: 10, max: 500, step: 5
            }).on('change', (ev) => {
                terrain.maxHeight = ev.value;
            });

            // 월드 스케일
            const scaleFolder = terrainFolder.addFolder({title: '🌐 월드 크기', expanded: true});
            scaleFolder.addBinding(state, 'worldSizeX', {
                label: 'Width (X)',
                min: 10, max: 2048, step: 10
            }).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
                terrain.worldOffset = [-ev.value / 2, terrain.worldOffset[1]];
            });
            scaleFolder.addBinding(state, 'worldSizeZ', {
                label: 'Depth (Z)',
                min: 10, max: 2048, step: 10
            }).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
                terrain.worldOffset = [terrain.worldOffset[0], -ev.value / 2];
            });

            // 텍스처 타일링 및 PBR 재질 설정
            const materialFolder = terrainFolder.addFolder({title: '🎨 재질 및 타일링 설정', expanded: true});
            materialFolder.addBinding(state, 'tileScale', {
                label: '디테일 타일링 (근거리)',
                min: 1.0, max: 150.0, step: 0.01
            }).on('change', (ev) => {
                terrain.material.tileScale = ev.value;
            });
            materialFolder.addBinding(state, 'macroScale', {
                label: '매크로 타일링 (원거리)',
                min: 1.0, max: 50.0, step: 0.01
            }).on('change', (ev) => {
                terrain.material.macroScale = ev.value;
            });
            materialFolder.addBinding(state, 'normalScale', {
                label: '노멀 맵 강도',
                min: 0, max: 3, step: 0.1
            }).on('change', (ev) => {
                terrain.material.normalScale = ev.value;
            });
            materialFolder.addBinding(state, 'roughnessFactor', {
                label: '거칠기 (Roughness)',
                min: 0, max: 1, step: 0.05
            }).on('change', (ev) => {
                terrain.material.roughnessFactor = ev.value;
            });
            materialFolder.addBinding(state, 'occlusionStrength', {
                label: '오클루전 강도 (AO)',
                min: 0, max: 2, step: 0.05
            }).on('change', (ev) => {
                terrain.material.occlusionStrength = ev.value;
            });
            materialFolder.addBinding(state, 'useBaseColorTexture', {
                label: '베이스 컬러 사용'
            }).on('change', (ev) => {
                terrain.material.baseColorTexture = ev.value ? baseColorTextureInstance : null;
            });
            materialFolder.addBinding(state, 'useOrmTexture', {
                label: 'ORM 사용 (AO/R/M)'
            }).on('change', (ev) => {
                terrain.material.ormTexture = ev.value ? ormTextureInstance : null;
            });
            materialFolder.addBinding(state, 'useSplatTexture', {
                label: '스플랫 맵 사용 (Splat Map)'
            }).on('change', (ev) => {
                terrain.material.splatTexture = ev.value ? splatTextureInstance : null;
            });

        }
    });
}
