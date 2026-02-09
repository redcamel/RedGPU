import * as RedGPU from "../../../../../dist/index.js?t=1770625511985";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

/**
 * [KO] IBL Texture Size 예제
 * [EN] IBL Texture Size example
 *
 * [KO] IBL 텍스처 크기에 따른 렌더링 품질 차이를 비교합니다.
 * [EN] Compares rendering quality based on IBL texture size.
 */

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // ============================================
        // 기본 설정
        // ============================================

        // 궤도형 카메라 컨트롤러 생성
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 3;
        controller.speedDistance = 0.1;
        controller.tilt = 0;

        // 씬 생성
        const scene = new RedGPU.Display.Scene();
        const scene2 = new RedGPU.Display.Scene();

        // ============================================
        // 뷰 생성 및 설정
        // ============================================

        // 일반 뷰 생성

        // 일반 뷰 생성
        const viewBasic = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        )
        viewBasic.ibl = ibl;
        viewBasic.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewBasic);

        // 이펙트 뷰 생성
        const viewCustom = new RedGPU.Display.View3D(redGPUContext, scene2, controller);
        const ibl_adjustSize = new RedGPU.Resource.IBL(
            redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
            1024, 16
        )
        viewCustom.ibl = ibl_adjustSize;
        viewCustom.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl_adjustSize.environmentTexture);
        redGPUContext.addView(viewCustom);

        // ============================================
        // 씬 설정
        // ============================================

        // 조명 추가
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);
        scene2.lightManager.addDirectionalLight(directionalLight);

        // 3D 모델 로드
        loadGLTF(
            redGPUContext,
            scene,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareMetallic/glTF-Binary/CompareMetallic.glb'
        );
        loadGLTF(
            redGPUContext,
            scene2,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareMetallic/glTF-Binary/CompareMetallic.glb'
        );

        // ============================================
        // 레이아웃 설정
        // ============================================

        if (redGPUContext.detector.isMobile) {
            // 모바일: 위아래 분할
            viewBasic.setSize('100%', '50%');
            viewBasic.setPosition(0, 0);         // 상단
            viewCustom.setSize('100%', '50%');
            viewCustom.setPosition(0, '50%');     // 하단
        } else {
            // 데스크톱: 좌우 분할
            viewBasic.setSize('50%', '100%');
            viewBasic.setPosition(0, 0);         // 좌측
            viewCustom.setSize('50%', '100%');
            viewCustom.setPosition('50%', 0);     // 우측
        }

        // ============================================
        // 렌더링 시작
        // ============================================

        // 렌더러 생성 및 시작
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            // 추가 렌더링 로직이 필요하면 여기에 작성
        };
        renderer.start(redGPUContext, render);

        // 컨트롤 패널 생성
        renderTestPane(redGPUContext, viewCustom);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {string} url
 */
function loadGLTF(redGPUContext, scene, url) {

    let mesh
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            mesh = scene.addChild(v['resultMesh'])
        }
    )
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985');
    const {createPostEffectLabel} = await import('../../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js?t=1770625511985');
    createPostEffectLabel('Custom IBL Texture Size 16 * 16', redGPUContext.detector.isMobile, 'Basic IBL Texture Size 512 * 512')
    const {setDebugButtons} = await import( "../../../../exampleHelper/createExample/panes/index.js?t=1770625511985" );
    setDebugButtons(RedGPU, redGPUContext);
};