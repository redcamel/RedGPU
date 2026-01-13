import * as RedGPU from "../../../../dist/index.js?t=1767864574385";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 1. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 카메라 및 컨트롤러 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // 씬 및 뷰 생성
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. GLTF 모델 로드
        const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ABeautifulGame/glTF-Binary/ABeautifulGame.glb';
        loadGLTF(view, MODEL_URL);

        // 3. 렌더러 시작
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            // 추가적인 프레임별 로직이 필요할 경우 여기에 작성
        });

        // 4. 테스트 패널 구성
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        handleInitError(failReason);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;

    const loaderUI = document.createElement('div');
    loaderUI.className = 'loading-ui'
    document.body.appendChild(loaderUI);

    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            view.camera.fitMeshToScreenCenter(mesh, view)
            loaderUI.style.opacity = 0
            setTimeout(() => loaderUI.remove(), 300);
        },
        (info) => {
            loaderUI.innerHTML = `
				<div class="loading-ui-title">📦 Loading Model...</div>
				<div class="loading-ui-progress">
					<div style="width: ${info.percent}%;"></div>
				</div>
				<div class="loading-ui-info">
					<span>${info.percent}%</span>
					<span>${info.transferred} / ${info.totalSize}</span>
				</div>
			`;
        }
    );
}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1767864574385');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../../exampleHelper/createExample/panes/index.js?t=1767864574385');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};
