import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
// 캔버스 생성 및 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 카메라 컨트롤러 생성 (궤도 방식)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		// Create a scene and view, then add the view to the context
		// 씬과 뷰 생성 후 컨텍스트에 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		// Enable the display of the axis helper in the view
		// 뷰에서 축 헬퍼를 표시
		view.axis = true;
		// Enable the display of the grid helper in the view
		// 뷰에서 그리드 헬퍼를 표시
		view.grid = true;
		redGPUContext.addView(view);

		// Function to add meshes to the scene
		// 메쉬 추가 함수
		const addMeshesToScene = (scene, count = 500) => {
			// Create a spherical geometry
			const geometry = new RedGPU.Primitive.Sphere(redGPUContext);

			// Create a color-based material
			const material = new RedGPU.Material.ColorMaterial(redGPUContext);

			for (let i = 0; i < count; i++) {
				// Create a new mesh
				const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

				// Randomly position the mesh within the range of -50 to 50
				mesh.setPosition(
					Math.random() * 500 - 250, // X coordinate
					Math.random() * 500 - 250, // Y coordinate
					Math.random() * 500 - 250  // Z coordinate
				);

				// Add the mesh to the scene
				scene.addChild(mesh);
			}
		};

		// Call the function to add 500 meshes to the scene
		addMeshesToScene(scene, 1000);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// Logic for every frame goes here
			// 매 프레임마다 실행될 로직 추가
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext)

	},
	(failReason) => {
		// Show the error if initialization fails
		// 초기화 실패 시 에러 표시
		console.error('초기화 실패:', failReason);

		// Create an element for the error message
		// 에러 메시지 표시용 요소 생성
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;

		// Append the error message to the document body
		// 문서 본문에 에러 메시지 추가
		document.body.appendChild(errorMessage);
	}
);

const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setRedGPUTest_pane, setViewListTest} = await import("../../../exampleHelper/createExample/panes");
	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, false);
	setViewListTest(pane, redGPUContext.viewList, true);
};
