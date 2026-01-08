import * as RedGPU from "../../../../dist/index.js?t=1767862292106";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.querySelector('#example-container').appendChild(canvas);

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

        // ============================================
        // 뷰 생성 및 설정
        // ============================================

        const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr')
        // 일반 뷰 생성
        const viewNormal = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewNormal.ibl = ibl;
        viewNormal.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(viewNormal);

        // 이펙트 뷰 생성
        const viewEffect = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        viewEffect.ibl = ibl;
        viewEffect.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        viewEffect.postEffectManager.addEffect(new RedGPU.PostEffect.DirectionalBlur(redGPUContext));
        redGPUContext.addView(viewEffect);

        // ============================================
        // 씬 설정
        // ============================================

        // 조명 추가
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3D 모델 로드
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');

        // ============================================
        // 레이아웃 설정
        // ============================================

        if (redGPUContext.detector.isMobile) {
            // 모바일: 위아래 분할
            viewNormal.setSize('100%', '50%');
            viewNormal.setPosition(0, 0);         // 상단
            viewEffect.setSize('100%', '50%');
            viewEffect.setPosition(0, '50%');     // 하단
        } else {
            // 데스크톱: 좌우 분할
            viewNormal.setSize('50%', '100%');
            viewNormal.setPosition(0, 0);         // 좌측
            viewEffect.setSize('50%', '100%');
            viewEffect.setPosition('50%', 0);     // 우측
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
        renderTestPane(redGPUContext, viewEffect);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

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

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {createPostEffectLabel} = await import('../../../exampleHelper/createExample/loadExampleInfo/createPostEffectLabel.js');
    createPostEffectLabel('DirectionalBlur', redGPUContext.detector.isMobile)
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767862292106");
    setDebugButtons(redGPUContext);
    const pane = new Pane();

    const TEST_STATE = {
        DirectionalBlur: true,
        amount: targetView.postEffectManager.getEffectAt(0).amount,
        angle: targetView.postEffectManager.getEffectAt(0).angle,
    }
    const folder = pane.addFolder({title: 'PostEffect', expanded: true})
    // DirectionalBlur 토글
    folder.addBinding(TEST_STATE, 'DirectionalBlur').on('change', (v) => {
        if (v.value) {
            const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
            effect.amount = TEST_STATE.amount;
            effect.angle = TEST_STATE.angle;
            targetView.postEffectManager.addEffect(effect);
        } else {
            targetView.postEffectManager.removeAllEffect();
        }

        // 조정바 활성화/비활성화
        amountControl.disabled = !v.value;
        angleControl.disabled = !v.value;
    });
    const amountControl = folder.addBinding(TEST_STATE, 'amount', {min: 0, max: 100}).on('change', (v) => {
        targetView.postEffectManager.getEffectAt(0).amount = v.value
    })
    const angleControl = folder.addBinding(TEST_STATE, 'angle', {min: 0, max: 360}).on('change', (v) => {
        targetView.postEffectManager.getEffectAt(0).angle = v.value
    })
};
