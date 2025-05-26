import * as RedGPU from "../../../../../dist";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Create a camera controller (Orbit type)
        // 궤도형 카메라 컨트롤러 생성
        const controller = new RedGPU.Camera.ObitController(redGPUContext);
        controller.distance = 5
        controller.speedDistance = 0.1
        controller.tilt = 0

        // Create a scene and add a view with the camera controller
        // 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);


        loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/TextureTransformTest/glTF/TextureTransformTest.gltf',);

        // Create a renderer and start rendering
        // 렌더러 생성 후 렌더링 시작
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {

        };
        renderer.start(redGPUContext, render);

    },
    (failReason) => {
        // Handle initialization failure
        console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
        document.body.appendChild(errorMessage);
    }
);

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view
    const cubeTexture =
        new RedGPU.Resource.CubeTexture(redGPUContext, [
            "../../../../assets/skybox/px.jpg", // Positive X
            "../../../../assets/skybox/nx.jpg", // Negative X
            "../../../../assets/skybox/py.jpg", // Positive Y
            "../../../../assets/skybox/ny.jpg", // Negative Y
            "../../../../assets/skybox/pz.jpg", // Positive Z
            "../../../../assets/skybox/nz.jpg", // Negative Z
        ])
    view.iblTexture = cubeTexture
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
    let mesh
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            mesh = scene.addChild(v['resultMesh'])
        }
    )
}

// Function to render Test Pane (for controls)
// 테스트 패널을 렌더링하는 함수
const renderTestPane = async (redGPUContext, mesh) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const pane = new Pane();

};
