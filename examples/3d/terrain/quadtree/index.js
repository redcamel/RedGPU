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
        // controller.camera.farClipping = 20000;
        // controller.camera.nearClipping = 0.5;

        // 2. 씬 & 뷰
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight())
        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext)
        view.postEffectManager.addEffect(heightFog)

        heightFog.fogColor.setColorByRGB(255, 245, 220);

        heightFog.thickness = 75;
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;


        // 3. 거대 Terrain 생성
        const terrain = new RedGPU.Display.Terrain(
            redGPUContext,
            undefined,
            'CDLOD_Terrain'
        );

        // 3-2. 텍스처 일괄 설정 — 각 텍스처 타입의 GPU 포맷·밉맵 옵션은 내부에서 자동 적용
        terrain.setup({
            height: '../../../assets/terrain/terrainTest_001/height.jpg',
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


        // 3-5. 지형 파라미터 — 거대 스케일 설정
        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2]; // 원점 중앙 정렬
        terrain.maxLOD = MAX_LOD;

        scene.addTerrain(terrain);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 4. RVT (Runtime Virtual Texture) 생성 및 Terrain에 연결
        //    - 4종 레이어 Height-Blend 결과를 오프스크린으로 GPU 베이킹
        //    - 이후 셰이더는 단 2회 텍스처 페치로 지형 렌더링 (기존 30회+ → 2회)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 6. HUD 루프 (rAF)
        const rawCam = controller;

        function hudLoop() {
            updateHUD(terrain, rawCam);
        }


        // 5. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, hudLoop);



        // 7. GUI 패널
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

            // 월드 크기
            const scaleFolder = terrainFolder.addFolder({title: '🌐 월드 스케일', expanded: false});
            scaleFolder.addBinding(state, 'worldSizeX', {
                label: '가로 크기 (X)',
                min: 100, max: 5000, step: 10
            }).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
                terrain.worldOffset = [-ev.value / 2, terrain.worldOffset[1]];
            });
            scaleFolder.addBinding(state, 'worldSizeZ', {
                label: '세로 크기 (Z)',
                min: 100, max: 5000, step: 10
            }).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
                terrain.worldOffset = [terrain.worldOffset[0], -ev.value / 2];
            });

            // ── 3. 타일링 & 블렌딩 설정 ──────────────────────────────────────────
            const tilingFolder = pane.addFolder({title: '🎨 타일링 및 혼합 (Tiling & Blending)', expanded: true});

            tilingFolder.addBinding(terrain, 'tileScale', {
                label: '디테일 타일링 (근거리)',
                min: 1.0, max: 64.0, step: 0.1
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
            });

            textureFolder.addBinding(state, 'useOrmTexture', {
                label: 'ORM 맵 사용'
            }).on('change', (ev) => {
                terrain.ormTexture = ev.value ? ormTextureInstance : null;
            });

            textureFolder.addBinding(state, 'useSplatTexture', {
                label: '스플랫 맵 사용'
            }).on('change', (ev) => {
                terrain.splatTexture = ev.value ? splatTextureInstance : null;
            });

        }
    });
}
