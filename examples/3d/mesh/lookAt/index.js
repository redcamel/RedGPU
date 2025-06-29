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
		controller.speedDistance = 0.3
		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true
		redGPUContext.addView(view);

		createSampleMesh(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const targetPosition = [0, 0, 0]
		const targetObject = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext, 0.2), new RedGPU.Material.ColorMaterial(redGPUContext, 0xff0000));
		scene.addChild(targetObject);
		const render = (time) => {
			scene.children.forEach(v => {
				targetPosition[0] = Math.sin(time / 1000);
				targetPosition[1] = Math.cos(time / 1000);
				targetPosition[2] = Math.sin(time / 1000);
				targetObject.setPosition(...targetPosition)
				v.lookAt(...targetPosition)
			})
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

// Function to create a sample mesh
// 샘플 메쉬를 생성하는 함수
const createSampleMesh = (redGPUContext, scene) => {
	let i = 200
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png'))
	const material2 = new RedGPU.Material.ColorMaterial(redGPUContext, '#00ff00')

	while (i--) {

		// Create a sample geometry (Box in this case)
		// 샘플 지오메트리 생성 (예: Box)
		const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 2);

		// Create a mesh with color material by default
		// 기본적으로 컬러 재질을 사용하는 메쉬 생성
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		const mesh2 = new RedGPU.Display.Mesh(redGPUContext, geometry, material2);
		mesh2.setScale(0.25);
		mesh2.setPosition(0, 0.75, 0);
		mesh.addChild(mesh2);
		mesh.setPosition(Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 30 - 15);
		scene.addChild(mesh);
	}
};


