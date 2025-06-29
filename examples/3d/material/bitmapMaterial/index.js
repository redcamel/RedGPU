import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Set up camera, scene, and view
		// 카메라, 씬, 뷰 설정
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 5
		controller.speedDistance = 0.1
		const scene = new RedGPU.Display.Scene();
		scene.useBackgroundColor = true
		scene.backgroundColor.setColorByHEX('#5259c3')
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Create a sample mesh and add to the scene
		// 샘플 메쉬를 생성하고 씬에 추가
		const mesh = createSampleMesh(redGPUContext, scene);

		// Start the rendering loop
		// 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});

		// Render the UI for testing
		// 테스트용 UI 렌더링
		renderTestPane(redGPUContext, mesh);
	},
	(failReason) => {
		// Handle initialization errors
		// 초기화 실패 처리
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// Function to create a sample mesh
// 샘플 메쉬를 생성하는 함수
const createSampleMesh = (redGPUContext, scene) => {
	// Define initial material as BitmapMaterial
	// 초기 재질을 BitmapMaterial로 정의
	const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture); // 초기 텍스처

	// Create a sample geometry (Box in this case)
	// 샘플 기하구조를 생성 (여기서는 박스)
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);

	// Create a mesh with BitmapMaterial
	// BitmapMaterial을 사용하는 메쉬 생성
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE
	scene.addChild(mesh);

	return mesh;
};

// 테스트용 UI를 구성하는 함수
const renderTestPane = async (redGPUContext, mesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01})
		.on('change', (e) => {
			mesh.material.opacity = e.value
		});
	// UI Buttons to set textures
	// 다양한 텍스처를 설정하는 버튼 UI 추가
	const textures = [
		{name: 'set diffuseTexture : png', path: '../../../assets/imageFormat/webgpu.png'},
		{name: 'set diffuseTexture : jpg', path: '../../../assets/imageFormat/webgpu.jpg'},
		{name: 'set diffuseTexture : webp', path: '../../../assets/imageFormat/webgpu.webp'},
		{name: 'set diffuseTexture : svg', path: '../../../assets/imageFormat/webgpu.svg'},
	];

	pane.addFolder({title: 'Textures'});
	textures.forEach(({name, path}) => {
		pane.addButton({title: name}).on('click', () => {
			mesh.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, path);
			console.log(`Texture applied: ${path}`);
		});
	});

	// Add a separator
	// 구분자를 추가 (UI 시각적 구분 개선)
	setSeparator(pane);

};
