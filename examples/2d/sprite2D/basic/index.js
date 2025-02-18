import * as RedGPU from "../../../../dist";

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
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
		const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

		// 6. Create and configure a 2D sprite
		// 6. 2D 스프라이트 생성 및 설정
		const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
		sprite2D.setSize(100, 100);
		sprite2D.x = view.screenRectObject.width / 2;
		sprite2D.y = view.screenRectObject.height / 2;
		scene.addChild(sprite2D); // 스프라이트를 씬에 추가

		// 8. Create a renderer and start rendering
		// 8. 렌더러(Renderer) 생성 및 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext); // RedGPU 렌더러 생성
		const render = (time) => {

		};
		renderer.start(redGPUContext, render); // 렌더링 루프 시작, 매 프레임마다 render 함수 호출

		// 9. Render a test pane for debugging or configuration
		// 9. 디버깅 또는 설정을 위한 테스트 패널 렌더링
		renderTestPane(redGPUContext, sprite2D); // 테스트 패널 생성 및 표시
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
const renderTestPane = async (redGPUContext, sprite2D) => {
	// Dynamically import Tweakpane and additional setup module
	// Tweakpane 및 RedGPU 설정 관련 동적 모듈 import
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js'); // Tweakpane 라이브러리 import
	const {setRedGPUTest_pane} = await import("../../../exampleHelper/createExample/panes"); // 추가 설정 모듈 import

	// Create a Tweakpane object and apply settings
	// Tweakpane 객체 생성 후 설정 적용
	const pane = new Pane(); // Tweakpane 인스턴스 생성
	setRedGPUTest_pane(pane, redGPUContext, false); // RedGPU 관련 테스트 설정 적용

	// Mesh transformation configurations
	// 메쉬 변환에 대한 초기 설정
	const config = {
		material: 'Bitmap', // 초기 활성화된 재질

	};

	// Add material selector
	// 재질 선택을 위한 UI
	pane.addBinding(config, 'material', {
		options: {
			Color: 'Color',
			Bitmap: 'Bitmap'
		}
	}).on('change', (evt) => {
		if (evt.value === 'Color') {
			sprite2D.material = new RedGPU.Material.ColorMaterial(redGPUContext)
		} else {
			sprite2D.material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))
		}
	});

	// Add position controls
	// 포지션 조정 슬라이더 추가
	const positionFolder = pane.addFolder({title: 'Position', expanded: true});
	positionFolder.addBinding(sprite2D, 'x', {
		min: 0,
		max: redGPUContext.screenRectObject.width,
		step: 0.1
	}).on('change', (evt) => {
		sprite2D.x = evt.value;
	});
	positionFolder.addBinding(sprite2D, 'y', {
		min: 0,
		max: redGPUContext.screenRectObject.height,
		step: 0.1
	}).on('change', (evt) => {
		sprite2D.y = evt.value;
	});

	// Add scale controls
	// 스케일 조정 슬라이더 추가
	const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
	scaleFolder.addBinding(sprite2D, 'scaleX', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
		sprite2D.scaleX = evt.value;
	});
	scaleFolder.addBinding(sprite2D, 'scaleY', {min: 0, max: 5, step: 0.1}).on('change', (evt) => {
		sprite2D.scaleY = evt.value;
	});
	const widthHeightFolder = pane.addFolder({title: 'Width & Height', expanded: true});
	widthHeightFolder.addBinding(sprite2D, 'width', {min: 0, max: sprite2D.width * 2, step: 0.1}).on('change', (evt) => {
		sprite2D.width = evt.value;
	});
	widthHeightFolder.addBinding(sprite2D, 'height', {
		min: 0,
		max: sprite2D.height * 2,
		step: 0.1
	}).on('change', (evt) => {
		sprite2D.height = evt.value;
	});
	// Add rotation controls
	// 회전 조정 슬라이더 추가
	const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
	rotationFolder.addBinding(sprite2D, 'rotation', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
		sprite2D.rotation = evt.value
	});
};
