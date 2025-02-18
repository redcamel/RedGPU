import * as RedGPU from "../../../../dist/index.js";

// Create and append a canvas
// 캔버스를 생성하고 추가합니다.
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize RedGPU
// RedGPU를 초기화합니다.
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create camera controllers (3D and 2D)
		// 3D와 2D용 카메라 컨트롤러를 생성합니다.
		const controller3D = new RedGPU.Camera.ObitController(redGPUContext);

		// Create scenes and views, set up axes and grids for 3D
		// 씬(Scene)과 뷰(View3D)를 생성하고, 3D 뷰를 위한 축과 그리드를 설정합니다.
		const sceneFor3D = new RedGPU.Display.Scene();
		const viewFor3D = new RedGPU.Display.View3D(redGPUContext, sceneFor3D, controller3D);
		viewFor3D.grid = true;
		viewFor3D.axis = true;
		redGPUContext.addView(viewFor3D);

		// 4. Create a scene and view, then add the view to the context
		// 4. 씬(Scene)과 뷰(View3D)를 생성 후 RedGPU 컨텍스트에 추가
		const sceneFor2D = new RedGPU.Display.Scene();
		const viewFor2D = new RedGPU.Display.View2D(redGPUContext, sceneFor2D);
		viewFor2D.setSize("100%", 200);
		sceneFor2D.useBackgroundColor = true;
		sceneFor2D.backgroundColor.setColorByHEX("#471010");
		sceneFor2D.backgroundColor.a = 0.5;
		redGPUContext.addView(viewFor2D);

		// Create a texture and material for a 2D sprite
		// 2D 스프라이트를 위한 텍스처와 재질(Material)을 생성합니다.
		const texture = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/UV_Grid_Sm.jpg'
		);
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

		// Create and configure a 2D sprite
		// 2D 스프라이트를 생성하고 설정합니다.
		const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
		sprite2D.setSize(100, 100);
		sprite2D.x = viewFor2D.screenRectObject.width / 2;
		sprite2D.y = viewFor2D.screenRectObject.height / 2;
		sceneFor2D.addChild(sprite2D);

		// Handle resizing events for the 2D view
		// 2D 뷰의 크기 변경 이벤트를 처리합니다.
		viewFor2D.onResize = (width, height) => {
			sprite2D.x = width / 2;
			sprite2D.y = height / 2;
		};

		// Adjust 2D view position to align with the bottom of the screen
		// 2D 뷰의 위치를 화면 하단에 맞추도록 조정합니다.
		const onResizeRedGPUContext = () => {
			viewFor2D.y = redGPUContext.screenRectObject.height - 200;
		};
		redGPUContext.onResize = onResizeRedGPUContext;
		onResizeRedGPUContext();

		// Create a renderer and start the rendering loop
		// 렌더러를 생성하고 렌더링 루프를 시작합니다.
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			sprite2D.rotation += 1; // Rotate the sprite by 1 degree every frame
		                          // 매 프레임마다 스프라이트를 1도씩 회전시킵니다.
		};
		renderer.start(redGPUContext, render);

		// Render a test pane for debugging or settings
		// 디버깅 또는 설정을 위한 테스트 패널을 렌더링합니다.
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		// Log and display error if initialization fails
		// 초기화 실패 시 오류를 기록하고 화면에 표시합니다.
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// Render a test pane and set up settings for debugging
// 디버깅을 위한 테스트 패널을 렌더링하고 설정합니다.
const renderTestPane = async (redGPUContext) => {
	// Dynamically load Tweakpane and configuration helper modules
	// Tweakpane 및 설정 모듈을 동적으로 가져옵니다.
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const {setRedGPUTest_pane, setViewListTest} = await import("../../../exampleHelper/createExample/panes/index.js");

	// Initialize Tweakpane and configure the views
	// Tweakpane을 초기화하고 뷰를 설정합니다.
	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, false);
	setViewListTest(pane, redGPUContext.viewList, true, true);
};
