import * as RedGPU from "../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스 생성 및 HTML 문서에 추가
const canvas = document.createElement('canvas'); // 새로운 캔버스 요소 생성
document.body.appendChild(canvas); // 생성한 캔버스를 HTML body에 추가

// 2. Initialize RedGPU
// 2. RedGPU 초기화 시작
RedGPU.init(
	canvas, // RedGPU가 렌더링할 대상 캔버스 전달
	(redGPUContext) => {
		// Callback for successful RedGPU initialization
		// RedGPU 초기화 성공 시 실행되는 콜백

		// 4. Create a scene and view, then add the view to the context
		// 4. 씬(Scene)과 뷰(View3D)를 생성 후 RedGPU 컨텍스트에 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);

		// 5. Create a texture and material for the sprite
		// 5. 스프라이트 텍스처 및 재질(Material) 생성
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg');
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

		// 6. Create and configure a 2D sprite
		// 6. 2D 스프라이트 생성 및 설정
		const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
		sprite2D.setSize(100, 100);
		sprite2D.x = view.screenRectObject.width / 2;
		sprite2D.y = view.screenRectObject.height / 2;
		scene.addChild(sprite2D); // 스프라이트를 씬에 추가

		// 7. Handle screen resizing events
		// 7. 화면 크기 변경 이벤트 처리
		view.onResize = (width, height) => {
			// Update the sprite's central position when the screen is resized
			// 화면이 리사이즈될 때 스프라이트의 중앙 위치 업데이트
			// Adjust the horizontal center based on the new screen size
			// 새 화면 크기에 맞추어 가로 중심 재설정
			sprite2D.x = width / 2;
			// Adjust the vertical center based on the new screen size
			// 새 화면 크기에 맞추어 세로 중심 재설정
			sprite2D.y = height / 2;
		};

		// 8. Create a renderer and start rendering
		// 8. 렌더러(Renderer) 생성 및 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext); // RedGPU 렌더러 생성
		const render = (time) => {
			// Rotates the sprite by 1 degree every frame
			// 매 프레임마다 스프라이트를 1도씩 회전
			sprite2D.rotation += 1;
		};
		renderer.start(redGPUContext, render); // 렌더링 루프 시작, 매 프레임마다 render 함수 호출

		// 9. Render a test pane for debugging or configuration
		// 9. 디버깅 또는 설정을 위한 테스트 패널 렌더링
		renderTestPane(redGPUContext); // 테스트 패널 생성 및 표시
	},
	(failReason) => {
		// Callback for unsuccessful initialization
		// RedGPU 초기화 실패 시 실행되는 콜백

		// 10. Log the error reason and display it on screen
		// 10. 오류 메시지를 로그에 출력하고 사용자에게 표시
		console.error('Initialization failed:', failReason); // 오류를 콘솔에 출력
		const errorMessage = document.createElement('div'); // 오류 메시지 표시를 위한 새 HTML div 요소 생성
		errorMessage.innerHTML = failReason; // 오류 내용을 삽입
		document.body.appendChild(errorMessage); // HTML 문서에 추가
	}
);

// 11. Render a test pane and set it up
// 11. 테스트 패널 생성 및 렌더링 설정
const renderTestPane = async (redGPUContext) => {
	// Dynamically import Tweakpane and additional setup module
	// Tweakpane 및 RedGPU 설정 관련 동적 모듈 import
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js'); // Tweakpane 라이브러리 import
	const {setRedGPUTest_pane} = await import("../../exampleHelper/createExample/panes/index.js"); // 추가 설정 모듈 import

	// Create a Tweakpane object and apply settings
	// Tweakpane 객체 생성 후 설정 적용
	const pane = new Pane(); // Tweakpane 인스턴스 생성
	setRedGPUTest_pane(pane, redGPUContext, true); // RedGPU 관련 테스트 설정 적용
};
