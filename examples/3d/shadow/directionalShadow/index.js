import * as RedGPU from "../../../../dist";

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
		controller.distance = 30

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

		// Add 500 random meshes to the scene
		// 장면에 500개의 메쉬를 무작위로 추가
		addRandomMeshes(redGPUContext, scene);
		// 3D 모델 로드
		loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf');

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
					testObj.rotationX += 1.5
					testObj.rotationY += 1.5
					testObj.y += Math.sin(time / 1000 + i * 10) / 10
					testObj.rotationZ += 1.5
				}
			})
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

function loadGLTF(redGPUContext, scene, url) {

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
			mesh.castShadow = true
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
const addRandomMeshes = (redGPUContext, scene) => {
	const geometries = [
		new RedGPU.Primitive.Sphere(redGPUContext, 2, 16, 16),
		new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),
		new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 6, 16),
		new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 16, 32),
		new RedGPU.Primitive.TorusKnot(redGPUContext, 0.5, 0.2, 128, 64, 2, 3)
	];

	const plane = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Plane(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000'))
	plane.setScale(200)
	plane.rotationX = 90
	plane.receiveShadow = true
	scene.addChild(plane)

	for (let i = 0; i < 500; i++) {
		const geometry = geometries[Math.floor(Math.random() * geometries.length)];

		const x = Math.random() * 150 - 75;
		const y = Math.random() * 3 - 1.5;
		const z = Math.random() * 150 - 75;

		const material = new RedGPU.Material.PhongMaterial(redGPUContext, getRandomHexValue());

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.setScale(Math.max(Math.random() * 1.5, 0.5))
		mesh.setPosition(x, y, z);
		mesh.rotationX = Math.random() * 360;
		mesh.rotationY = Math.random() * 360;
		mesh.rotationZ = Math.random() * 360;
		mesh.castShadow = true
		// 메쉬를 씬에 추가
		scene.addChild(mesh);

		renderTestPane(redGPUContext,scene);
	}
};

// 랜덤 색상 값을 반환하는 함수
const getRandomHexValue = () => {
	const randomColor = Math.floor(Math.random() * 0xffffff);
	return `#${randomColor.toString(16).padStart(6, "0")}`;
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
	pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize',{
		min:128,
		max:2048,
		step:1
	}).on("change", (ev) => {
		directionalShadowManager.shadowDepthTextureSize = ev.value
	});
	// pane.addBinding(scene.shadowManager, 'directionalLightShadowBias',{
	// 	min:0,
	// 	max:0.05,
	// 	step:0.000001
	// }).on("change", (ev) => {
	// 	redGPUContext.viewList[0].scene.shadowManager.directionalLightShadowBias = ev.value
	// });
};
