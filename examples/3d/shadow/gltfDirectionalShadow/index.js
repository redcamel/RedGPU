import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = -15
		controller.distance = 5
		controller.speedDistance = 0.3

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();

		// Add directional light
		// 방향광(light) 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);

		// Add a skybox to the view
		// 뷰에 스카이박스 추가
		view.skybox = createSkybox(redGPUContext);

		addGround(redGPUContext, scene);
		// 3D 모델 로드
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf', -1, 1);
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF/BrainStem.gltf', 1, 0);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			// 매 프레임 실행될 로직
			redGPUContext.viewList.forEach(view => {
				const {scene} = view
				let i = scene.numChildren
				while (i--) {
					if (i === 0) continue;
					let testObj = scene.children[i]
					testObj.rotationY += 0.5
				}
			})

		});
		renderTestPane(redGPUContext, scene);
	},
	(failReason) => {
		// Handle initialization failure
		console.error("Initialization failed:", failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);

function loadGLTF(redGPUContext, scene, url, xPosition, yPosition) {

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
			mesh.x = xPosition
			mesh.y = yPosition
			mesh.setCastShadowRecursively(true)
			mesh.setReceiveShadowRecursively(true)
		}
	)
}

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

	const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, skyboxImagePaths);

	const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
	return skybox;
};
const addGround = (redGPUContext, scene) => {

	const plane = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Plane(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000'))
	plane.setScale(200)
	plane.rotationX = 90
	plane.receiveShadow = true
	scene.addChild(plane)

};

// Function to render the UI controls for material properties
// 재질 속성 조작을 위한 UI를 렌더링하는 함수
const renderTestPane = async (redGPUContext, scene) => {
	const {Pane} = await import(
		"https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js"
		);

	const pane = new Pane();
	const {shadowManager} = scene
	const {directionalShadowManager} = shadowManager
	pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
		min: 128,
		max: 2048,
		step: 1
	}).on("change", (ev) => {
		directionalShadowManager.shadowDepthTextureSize = ev.value
	});

};
