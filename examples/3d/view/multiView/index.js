import * as RedGPU from "../../../../dist/index.js";

// 1. 캔버스 생성 및 추가
// Step 1: Create and append a canvas to the document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. RedGPU 초기화
// Step 2: Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 1-1. 첫 번째 카메라 컨트롤러 생성 (궤도 방식)
		// 1-1. Create the first camera controller (Orbit type)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		// 1-2. 첫 번째 씬과 뷰 생성
		// 1-2. Create the first scene and view
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		// 1-3. 첫 번째 뷰의 그리드 헬퍼 활성화
		// 1-3. Enable the grid helper in the first view
		view.grid = true;

		// 1-4. 첫 번째 뷰를 컨텍스트에 추가
		// 1-4. Add the first view to the GPU context
		redGPUContext.addView(view);

		// 2-1. 두 번째 카메라 컨트롤러 생성 (궤도 방식)
		// 2-1. Create the second camera controller (Orbit type)
		const controller2 = new RedGPU.Camera.ObitController(redGPUContext);

		// 2-2. 두 번째 씬과 뷰 생성
		// 2-2. Create the second scene and view
		const scene2 = new RedGPU.Display.Scene();
		const view2 = new RedGPU.Display.View3D(redGPUContext, scene2, controller2);

		// 2-3. 두 번째 뷰의 그리드 헬퍼 활성화
		// 2-3. Enable the grid helper in the second view
		view2.grid = true;

		// 2-4. 두 번째 뷰를 컨텍스트에 추가
		// 2-4. Add the second view to the GPU context
		redGPUContext.addView(view2);

		// 3-1. 세 번째 카메라 컨트롤러 생성 (궤도 방식)
		// 3-1. Create the third camera controller (Orbit type)
		const controller3 = new RedGPU.Camera.ObitController(redGPUContext);

		// 3-2. 세 번째 씬과 뷰 생성
		// 3-2. Create the third scene and view
		const scene3 = new RedGPU.Display.Scene();
		const view3 = new RedGPU.Display.View3D(redGPUContext, scene3, controller3);

		// 3-3. 세 번째 뷰의 축 표시 및 그리드 헬퍼 활성화
		// 3-3. Enable the axis display and grid helper in the third view
		view3.axis = true;
		view3.grid = true;

		// 3-4. 세 번째 뷰를 컨텍스트에 추가
		// 3-4. Add the third view to the GPU context
		redGPUContext.addView(view3);

		// 각 뷰의 레이아웃 설정
		// Configure layout for each view
		view.width = '50%'; // 첫 번째 뷰의 폭 50% / Set first view's width to 50%
		view2.width = '50%'; // 두 번째 뷰의 폭 50% / Set second view's width to 50%
		view3.width = '10%'; // 세 번째 뷰의 폭 10% / Set third view's width to 10%
		view3.height = '10%'; // 세 번째 뷰의 높이 10% / Set third view's height to 10%
		view.x = '0%'; // 첫 번째 뷰의 X 위치 설정 / Set first view's X position to 0%
		view2.x = '50%'; // 두 번째 뷰의 X 위치 설정 / Set second view's X position to 50%

		// 임의의 메쉬를 씬에 추가하는 함수 생성
		// Create a function to add random meshes to the scene
		const addMeshesToScene = (scene, count = 200) => {
			// 구형 기하학(스피어) 생성
			// Create a spherical geometry
			const geometry = new RedGPU.Primitive.Sphere(redGPUContext);

			// 컬러 재질(Material) 생성
			// Create a color-based material
			const material = new RedGPU.Material.ColorMaterial(redGPUContext);

			for (let i = 0; i < count; i++) {
				// 새로운 메쉬 생성
				// Create a new mesh
				const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

				// 메쉬 크기 설정 (1 ~ 4)
				// Set random scale for the mesh (1 to 4)
				mesh.setScale(Math.random() * 3 + 1);

				// 메쉬 위치 설정 (-150 ~ 150 범위)
				// Set a random position for the mesh (-150 to 150 range)
				mesh.setPosition(
					Math.random() * 300 - 150, // X 좌표 / X coordinate
					Math.random() * 300 - 150, // Y 좌표 / Y coordinate
					Math.random() * 300 - 150  // Z 좌표 / Z coordinate
				);

				// 씬에 메쉬 추가
				// Add the mesh to the scene
				scene.addChild(mesh);
			}
		};

		// 첫 번째와 두 번째 씬에 메쉬 추가
		// Add meshes to the first and second scenes
		addMeshesToScene(scene);
		addMeshesToScene(scene2);

		// 렌더러 생성 및 시작
		// Create a renderer and start rendering
		const renderer = new RedGPU.Renderer(redGPUContext);

		// 렌더링 함수 정의
		// Define the rendering function
		const render = (time) => {
			// 매 프레임마다 실행할 로직
			// Logic to execute every frame

			// 세 번째 뷰의 위치를 움직임 (sin, cos 기반)
			// Move the third view dynamically (based on sin and cos)
			view3.x = `${Math.sin(time / 1000) * 25 + 50}%`;
			view3.y = `${Math.cos(time / 1000) * 25 + 50}%`;
		};

		// 렌더링 시작
		// Start rendering
		renderer.start(redGPUContext, render);

		// 테스트용 패널 생성
		// Create a test control panel
		renderTestPane(redGPUContext);

	},
	(failReason) => {
		// 초기화 실패 시 에러 메시지 출력
		// Display an error message if initialization fails
		console.error('초기화 실패:', failReason);

		// 에러 메시지 표시용 요소 생성
		// Create an element to display the error message
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;

		// 문서 본문에 에러 메시지 추가
		// Append the error message to the document body
		document.body.appendChild(errorMessage);
	}
);

// 테스트 패널 생성 함수
// Function to create a test control panel
const renderTestPane = async (redGPUContext) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setRedGPUTest_pane, setViewListTest} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	// RedGPU용 기본 테스트 패널 설정
	// Set up the basic test panel for RedGPU
	setRedGPUTest_pane(pane, redGPUContext, false);

	// 각 뷰를 위한 테스트 패널 업데이트
	// Update the test panel for each view
	setViewListTest(pane, redGPUContext.viewList, true);
};
