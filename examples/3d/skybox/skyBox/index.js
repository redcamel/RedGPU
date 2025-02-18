import * as RedGPU from "../../../../dist/index.js";

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
		controller.tilt = 0

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);

		// Add a skybox to the view
		// 뷰에 스카이박스 추가
		view.skybox = createSkybox(redGPUContext);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
			// 매 프레임 실행될 로직 (필요시 추가)
		});
	},
	(failReason) => {
		// Handle initialization failure
		console.error("Initialization failed:", failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);

// Function to create a skybox
// 스카이박스를 생성하는 함수
const createSkybox = (redGPUContext) => {
	// Define texture paths for skybox
	// 스카이박스 텍스처 경로 정의
	const skyboxImagePaths = [
		"../../../assets/skybox/px.jpg", // Positive X
		"../../../assets/skybox/nx.jpg", // Negative X
		"../../../assets/skybox/py.jpg", // Positive Y
		"../../../assets/skybox/ny.jpg", // Negative Y
		"../../../assets/skybox/pz.jpg", // Positive Z
		"../../../assets/skybox/nz.jpg", // Negative Z
	];

	createDebug(skyboxImagePaths)

	const cubeTexture = new RedGPU.Resource.CubeTexture(
		redGPUContext,
		skyboxImagePaths
	);

	// Create and return the skybox
	// 스카이박스 생성 및 반환
	const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
	return skybox;
};

const createDebug = (skyboxImagePaths) => {
	const previewContainer = document.createElement("div");
	previewContainer.style.position = "absolute";
	previewContainer.style.left = "10px";
	previewContainer.style.top = "100px";
	previewContainer.style.zIndex = "1000";
	previewContainer.style.display = "flex";
	previewContainer.style.flexDirection = "column";
	previewContainer.style.backgroundColor = "rgba(0, 0, 0, 0.16)";
	previewContainer.style.gap = "8px";
	previewContainer.style.padding = "4px";
	previewContainer.style.borderRadius = "8px";
	document.body.appendChild(previewContainer);

	skyboxImagePaths.forEach((path) => {
		const img = document.createElement("img");
		img.src = path;
		img.alt = path;
		img.style.maxWidth = "100px";
		img.style.maxHeight = "100px";
		img.style.borderRadius = "8px";
		previewContainer.appendChild(img);
	});
}
