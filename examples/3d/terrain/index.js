import * as RedGPU from "../../../dist/index.js?t=20260718_terrain";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=20260718_terrain";

/**
 * [KO] Terrain CDLOD 1단계: 높이 맵 바인딩 예제
 * [EN] Terrain CDLOD Step 1: Heightmap Binding Example
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const textureList = {
    'terrainTest_001': '../../assets/terrain/terrainTest_001_height.jpg',
    'UV Grid Map': '../../assets/UV_Grid_Sm.jpg',
    'Github Logo': '../../assets/github.png',
    'Doc Body': '../../assets/documentBody.png'
};

// ──────────────────────────────────────────
// 텍스처 픽셀 채널 정밀 분석 도구
// ──────────────────────────────────────────
function analyzeTextureChannel(url, name) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const cvs = document.createElement('canvas');
        cvs.width = img.width;
        cvs.height = img.height;
        const ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height).data;

        let sumR = 0, sumG = 0, sumB = 0;
        const totalPixels = img.width * img.height;
        for (let i = 0; i < imgData.length; i += 4) {
            sumR += imgData[i];
            sumG += imgData[i + 1];
            sumB += imgData[i + 2];
        }

        const avgR = (sumR / totalPixels).toFixed(1);
        const avgG = (sumG / totalPixels).toFixed(1);
        const avgB = (sumB / totalPixels).toFixed(1);

        console.log(`📊 [에셋 분석] ${name} 텍스처 (크기: ${img.width}x${img.height}) => R(Occlusion 평균): ${avgR}, G(Roughness 평균): ${avgG}, B(Metallic 평균): ${avgB}`);
    };
    img.onerror = () => {
        console.error(`[에셋 분석 실패] 텍스처 경로 확인 필요: ${url}`);
    };
    img.src = url;
}

analyzeTextureChannel("../../assets/terrain/terrainTest_001_metalicRoughness.jpg", "MetallicRoughness (기본)");
analyzeTextureChannel("../../assets/terrain/terrainTest_001_ao.jpg", "Occlusion (AO)");

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 컨트롤러 생성 (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;

        // 2. 씬 및 뷰 생성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 디버그 가이드라인 표시
        view.grid = true;

        redGPUContext.addView(view);

        // 3. 지형(Terrain) 인스턴스 생성 및 씬 추가
        // [01] 높이 맵 바인딩 명세에 따라, 내부적으로 BitmapTexture를 생성하여 TerrainMaterial에 공급합니다.
        const terrain = new RedGPU.Display.Terrain(
            redGPUContext,
        );
        terrain.material.baseColorTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../assets/terrain/terrainTest_001_diffuse.jpg");
        terrain.material.metallicRoughnessTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../assets/terrain/terrainTest_001_metalicRoughness.jpg");
        terrain.material.occlusionTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../assets/terrain/terrainTest_001_ao.jpg");
        terrain.heightTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, textureList['terrainTest_001']);
        scene.addTerrain(terrain);

        // 3단계 고저 변형 복원 검증을 위한 초기 스케일 셋업
        terrain.minHeight = 0;
        terrain.maxHeight = 0.2; // 입체 높이 설정
        terrain.worldSize = [1.0, 1.0]; // 가로세로 스케일 확대
        terrain.worldOffset = [-0.5, -0.5]; // 화면 정중앙 오프셋 정렬

        // 4. 렌더러 생성 및 루프 구동
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 5. 테스트용 GUI 컨트롤러 생성
        renderTestPane(redGPUContext, terrain);
    },
    (failReason) => {
        console.error('RedGPU 초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 실시간 텍스처 변경 테스트를 위한 GUI 패널을 렌더링합니다.
 */
const renderTestPane = (redGPUContext, terrain) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {


            const state = {
                textureSource: '../../assets/terrain/terrainTest_001_height.jpg',
                wireframe: false,
                minHeight: terrain.minHeight,
                maxHeight: terrain.maxHeight,
                worldSizeX: terrain.worldSize[0],
                worldSizeY: terrain.worldSize[1]
            };

            const folder = pane.addFolder({title: 'Terrain Control', expanded: true});
            folder.addBinding(state, 'textureSource', {
                options: textureList
            }).on('change', (ev) => {
                const value = ev.value;
                // Terrain 클래스 상의 프록시 getter/setter를 통해 텍스처 동적 교체 작동
                terrain.heightTexture = new RedGPU.Resource.BitmapTexture(
                    redGPUContext,
                    value,
                    true
                );
                console.log(`높이맵 텍스처 교체 완료: ${value}`);
            });

            // 2단계 와이어프레임(격자 구조) 검증 토글 추가
            folder.addBinding(state, 'wireframe').on('change', (ev) => {
                terrain.primitiveState.topology = ev.value ? 'line-list' : 'triangle-list';
                console.log(`와이어프레임 모드: ${ev.value ? '라인 드로우 (line-list)' : '면 드로우 (triangle-list)'}`);
            });

            // 3단계 실시간 높이 변위(Displacement) 조절 슬라이더 추가
            const displacementFolder = folder.addFolder({title: 'Height Displacement', expanded: true});
            displacementFolder.addBinding(state, 'minHeight', {min: -2, max: 2, step: 0.1}).on('change', (ev) => {
                terrain.minHeight = ev.value;
            });
            displacementFolder.addBinding(state, 'maxHeight', {min: 0, max: 3, step: 0.1}).on('change', (ev) => {
                terrain.maxHeight = ev.value;
            });
            displacementFolder.addBinding(state, 'worldSizeX', {min: 0.5, max: 5.0, step: 0.1}).on('change', (ev) => {
                terrain.worldSize = [ev.value, terrain.worldSize[1]];
            });
            displacementFolder.addBinding(state, 'worldSizeY', {min: 0.5, max: 5.0, step: 0.1}).on('change', (ev) => {
                terrain.worldSize = [terrain.worldSize[0], ev.value];
            });
        }
    });
};
