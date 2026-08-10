import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Terrain 3D 전나무(spruce_tree.glb) 타일 스트리밍 인스턴싱 예제
 *
 * - CDLOD Terrain (8.2km 오픈월드 지형 스케일)
 * - 추가된 3D 전나무 GLTF 모델 (assets/terrain/spruce_tree.glb) 지오메트리 & PBR 재질 로드
 * - 지형 타일 스트리밍(setOnTileLoad / setOnTileUnload)에 따른 3D 나무 식생 인스턴스 동적 로딩
 */

const WORLD_SIZE = 8192.0;
const MAX_LOD = 7;
const MIN_H = 0.0;
const MAX_H = 300.0;

let terrain = null;
let treeFoliageMesh = null;

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
    minWidth: '260px'
});
document.body.appendChild(hud);

function updateHUD(terrainInstance, camera) {
    const leafCount = terrainInstance.quadtree ? terrainInstance.quadtree.leafNodes.length : 0;
    const streamedTileCount = terrainInstance.spatialGrid ? terrainInstance.spatialGrid.activeTiles.size : 0;
    const treeCount = treeFoliageMesh ? treeFoliageMesh.instanceCount : 0;

    const cx = camera.x.toFixed(1);
    const cy = camera.y.toFixed(1);
    const cz = camera.z.toFixed(1);
    hud.innerHTML = `
        <b style="color:#4ade80;font-size:14px;">🌲 3D Spruce Tree Streaming</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        🌲 활성 3D 전나무 수 : <b style="color:#4ade80;">${treeCount.toLocaleString()}</b> 그루 (spruce_tree.glb)<br>
        🗂 활성 CDLOD 노드   : <b style="color:#7dd3fc;">${leafCount}</b><br>
        🛰 활성 스트리밍 셀   : <b style="color:#38bdf8;">${streamedTileCount}</b> 개<br>
        📐 월드 스케일       : <b style="color:#fbbf24;">${WORLD_SIZE} × ${WORLD_SIZE}</b><br>
        🏔 최대 높이         : <b style="color:#f87171;">${MAX_H}m</b><br>
        <span style="color:#94a3b8;">──────────────────</span><br>
        📷 FreeController 조작<br>
        &nbsp;&nbsp;이동: <b>W, A, S, D, Q, E</b><br>
        &nbsp;&nbsp;회전: <b>마우스 드래그</b><br>
        &nbsp;&nbsp;X: <b>${cx}</b>  Y: <b>${cy}</b>  Z: <b>${cz}</b>
    `;
}

// ─── RedGPU 초기화 ─────────────────────────────────────────────────────────────
RedGPU.init(
    canvas,
    (redGPUContext) => {

        // 1. 카메라 설정 — 800m 비행 시점 설정
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.moveSpeed = 2000;
        controller.mouseSensitivity = 0.2;
        controller.x = 0;
        controller.y = 500;
        controller.z = 0;
        controller.tilt = -15;
        controller.pan = 0;
        controller.camera.farClipping = 100000;
        controller.camera.nearClipping = 1.0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = false;
        redGPUContext.addView(view);

        // 조명 & 대기 환경 (SkyAtmosphere + HeightFog)
        const directionalLight = new RedGPU.Light.DirectionalLight([-1.0, -0.35, -0.5], '#ffffff', 100000);
        scene.lightManager.addDirectionalLight(directionalLight);
        scene.shadowManager.directionalShadowManager.maxShadowDistance = 3000;
        scene.shadowManager.directionalShadowManager.bias = 0.00005;
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        const heightFog = new RedGPU.PostEffect.HeightFog(redGPUContext);
        heightFog.fogColor.setColorByRGB(160, 192, 224);
        heightFog.thickness = 500;
        heightFog.startDepth = 3000;
        heightFog.endDepth = 15000;
        heightFog.density = 1;
        view.postEffectManager.addEffect(heightFog);

        // 2. Terrain 생성 및 4종 PBR 레이어 / 16x16 타일 스트리머 설정
        terrain = new RedGPU.Display.Terrain(redGPUContext, 'SpruceTree_Terrain');

        terrain.setup({
            baseColor: '../../../assets/terrain/terrainTest_001/diffuse.jpg',
            orm: '../../../assets/terrain/terrainTest_001/orm.jpg',
            splat: '../../../assets/terrain/terrainTest_001/splatMap.jpg',
        });

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

        terrain.minHeight = MIN_H;
        terrain.maxHeight = MAX_H;
        terrain.worldSize = [WORLD_SIZE, WORLD_SIZE];
        terrain.worldOffset = [-WORLD_SIZE / 2, -WORLD_SIZE / 2];
        terrain.maxLOD = MAX_LOD;
        terrain.tileScale = 200.0;

        terrain.spatialGrid.loadingRadius = 2560;
        terrain.spatialGrid.maxLoadsPerFrame = 2;

        terrain.setTileUrlResolver((tile) => {
            const rStr = tile.tileRowStr;
            const cStr = tile.tileColStr;
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

        scene.addTerrain(terrain);

        const treeUrl = '../../../assets/terrain/test.glb';
        // const treeUrl = '../../../assets/terrain/spruce_tree.glb';

        new RedGPU.GLTFLoader(redGPUContext, treeUrl, (result) => {
            console.log('🌲 spruce_tree.glb 3D 모델 로드 완료:', result);

            const resultMesh = result.resultMesh;

            // 🌲 식생 전용 VegetationMesh 사용 (Zero-GC, 얇은 TypedArray 인스턴싱)
            treeFoliageMesh = new RedGPU.Display.VegetationMesh(redGPUContext, terrain, {
                count: 10000,
                gltfMesh: resultMesh,
                baseScale: 0.4,
                splatUrl: '../../../assets/terrain/terrainTest_001/splatMap.jpg',
                maskChannel: 'g',
                maskThreshold: 0.2,
                roughnessFactor: 0.9,
                metallicFactor: 0.0
            });
            scene.addChild(treeFoliageMesh);

            // 이미 활성화되어 있는 지형 타일들에 대해 즉시 3D 전나무 활성화
            if (terrain.spatialGrid && terrain.spatialGrid.activeTiles) {
                terrain.spatialGrid.activeTiles.forEach((tile) => {
                    treeFoliageMesh.onTileLoaded(tile);
                });
            }

            treeFoliageMesh.forceUpdate();

            // 지형 타일 비동기 로드/언로드 시 3D 전나무 식생 동적 스트리밍 이벤트 구독
            terrain.setOnTileLoad((tile) => {
                treeFoliageMesh.onTileLoaded(tile);
            });

            terrain.setOnTileUnload((tile) => {
                treeFoliageMesh.onTileUnloaded(tile);
            });
        });


        // 4. 렌더링 루프
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            updateHUD(terrain, controller);
        });

        // 5. GUI 패널 빌드
        buildGUI(redGPUContext, terrain, controller, view, heightFog);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
    }
);

// ─── GUI 패널 ──────────────────────────────────────────────────────────────────
function buildGUI(redGPUContext, terrain, controller, view, heightFog) {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const treeFolder = pane.addFolder({title: '🌲 식생 컨트롤 (Foliage System)', expanded: true});

            const treeState = {
                get activeCount() {
                    return treeFoliageMesh ? treeFoliageMesh.instanceCount : 0;
                },
                get maxDistance() {
                    return treeFoliageMesh ? treeFoliageMesh.maxDistance : 1500;
                },
                set maxDistance(v) {
                    if (treeFoliageMesh) treeFoliageMesh.maxDistance = v;
                },
                get startFadeDistance() {
                    return treeFoliageMesh ? treeFoliageMesh.startFadeDistance : 1200;
                },
                set startFadeDistance(v) {
                    if (treeFoliageMesh) treeFoliageMesh.startFadeDistance = v;
                },
                get windStrength() {
                    return treeFoliageMesh ? treeFoliageMesh.windStrength : 0.08;
                },
                set windStrength(v) {
                    if (treeFoliageMesh) treeFoliageMesh.windStrength = v;
                },
                get windMaxDistance() {
                    return treeFoliageMesh ? treeFoliageMesh.windMaxDistance : 300;
                },
                set windMaxDistance(v) {
                    if (treeFoliageMesh) treeFoliageMesh.windMaxDistance = v;
                },
                get maskThreshold() {
                    return treeFoliageMesh ? treeFoliageMesh.maskThreshold : 0.15;
                },
                set maskThreshold(v) {
                    if (treeFoliageMesh) treeFoliageMesh.maskThreshold = v;
                },
                get meshRotationX() {
                    return treeFoliageMesh ? treeFoliageMesh.meshRotationOffset[0] : 0;
                },
                set meshRotationX(v) {
                    if (treeFoliageMesh) {
                        const cur = treeFoliageMesh.meshRotationOffset;
                        treeFoliageMesh.meshRotationOffset = [v, cur[1], cur[2]];
                    }
                }
            };

            treeFolder.addBinding(treeState, 'activeCount', {
                label: '총 활성 식생 수',
                readonly: true
            });

            treeFolder.addBinding(treeState, 'meshRotationX', {
                label: '모델 세우기 회전 (Rotation X)',
                min: -180, max: 180, step: 1
            });

            treeFolder.addBinding(treeState, 'maxDistance', {
                label: '최대 가시거리 (Max Distance)',
                min: 100, max: 5000, step: 50
            });

            treeFolder.addBinding(treeState, 'startFadeDistance', {
                label: 'Fade 시작 거리 (Start Fade)',
                min: 50, max: 4500, step: 50
            });

            treeFolder.addBinding(treeState, 'windStrength', {
                label: '바람 애니메이션 (Wind WPO)',
                min: 0.0, max: 0.5, step: 0.01
            });

            treeFolder.addBinding(treeState, 'windMaxDistance', {
                label: '바람 적용 거리 (Wind Distance)',
                min: 50, max: 1000, step: 10
            });

            treeFolder.addBinding(treeState, 'maskThreshold', {
                label: 'Splatmap 토질 마스킹 (Threshold)',
                min: 0.0, max: 1.0, step: 0.01
            });

            const shadowFolder = pane.addFolder({title: '🌑 그림자 설정 (Shadow System)', expanded: true});

            const shadowState = {
                get castShadow() {
                    return treeFoliageMesh ? treeFoliageMesh.castShadow : true;
                },
                set castShadow(v) {
                    if (treeFoliageMesh) treeFoliageMesh.setCastShadowRecursively(v);
                },
                get terrainCastShadow() {
                    return terrain ? terrain.castShadow : true;
                },
                set terrainCastShadow(v) {
                    if (terrain) terrain.castShadow = v;
                },
                get receiveShadow() {
                    return terrain ? terrain.receiveShadow : true;
                },
                set receiveShadow(v) {
                    if (terrain) terrain.receiveShadow = v;
                },
                get lightDirY() {
                    return directionalLight ? directionalLight.direction[1] : -0.35;
                },
                set lightDirY(v) {
                    if (directionalLight) {
                        const dir = directionalLight.direction;
                        directionalLight.direction = [dir[0], v, dir[2]];
                    }
                },
                get bias() {
                    return view.scene.shadowManager.directionalShadowManager.bias;
                },
                set bias(v) {
                    view.scene.shadowManager.directionalShadowManager.bias = v;
                },
                get maxShadowDistance() {
                    return view.scene.shadowManager.directionalShadowManager.maxShadowDistance;
                },
                set maxShadowDistance(v) {
                    view.scene.shadowManager.directionalShadowManager.maxShadowDistance = v;
                }
            };

            shadowFolder.addBinding(shadowState, 'castShadow', {
                label: '🌲 식생 그림자 생성 (Cast Shadow)'
            });

            shadowFolder.addBinding(shadowState, 'terrainCastShadow', {
                label: '🏔 지형 산/언덕 자가 그림자 (Self-Shadow)'
            });

            shadowFolder.addBinding(shadowState, 'receiveShadow', {
                label: '🏔 지형 그림자 수신 (Receive Shadow)'
            });

            shadowFolder.addBinding(shadowState, 'lightDirY', {
                label: '☀️ 태양 고도 (Light Dir Y)',
                min: -1.0, max: -0.05, step: 0.01
            });

            shadowFolder.addBinding(shadowState, 'bias', {
                label: '그림자 바이어스 (Bias)',
                min: 0.00001, max: 0.0005, step: 0.00001
            });

            shadowFolder.addBinding(shadowState, 'maxShadowDistance', {
                label: '그림자 최대 가시거리',
                min: 100, max: 5000, step: 100
            });

            const terrainFolder = pane.addFolder({title: '🌍 Terrain (지형)', expanded: false});

            terrainFolder.addBinding(terrain, 'maxHeight', {
                label: '최대 높이 (Max Height)',
                min: 10, max: 1000, step: 10
            });

            terrainFolder.addBinding(terrain, 'tileScale', {
                label: '텍스처 타일링 (Tile Scale)',
                min: 1.0, max: 500.0, step: 1.0
            });

            const fogFolder = pane.addFolder({title: '🌫️ HeightFog (대기 안개)', expanded: true});

            fogFolder.addBinding(heightFog, 'density', {
                label: '안개 밀도',
                min: 0, max: 5, step: 0.05
            });
            fogFolder.addBinding(heightFog, 'startDepth', {
                label: '안개 시작 거리',
                min: 0, max: 30000, step: 100
            });
            fogFolder.addBinding(heightFog, 'endDepth', {
                label: '안개 최대 거리',
                min: 1000, max: 50000, step: 500
            });
        }
    });
}
