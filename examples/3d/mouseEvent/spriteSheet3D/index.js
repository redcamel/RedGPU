import * as RedGPU from "../../../../dist";
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
		controller.distance = 7.5
		controller.tilt = 0

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add sample mesh to the scene
		// 샘플 메쉬를 씬에 추가
		createSampleSprite3D(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)

		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
		// 실시간 조정을 위한 테스트 패널 렌더링
		renderTestPane(redGPUContext);
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
const createSampleSprite3D = async (redGPUContext, scene) => {
	// Define two materials for testing
	// 테스트용으로 두 가지 재질 정의
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))

	// Create a sample geometry (Box in this case)
	// 샘플 지오메트리 생성 (예: Box)
	const geometry = new RedGPU.Primitive.Box(redGPUContext);
	const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24)
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {

		const total = array.length; // 총 이벤트 타입 개수
		const radius = 3; // 원형 배치 반지름 값

		// 폴라 좌표로 원형 배치 좌표 계산
		const angle = (index / total) * Math.PI * 2; // 메쉬의 각도
		const x = Math.cos(angle) * radius; // X 좌표
		const y = Math.sin(angle) * radius; // y 좌표

		const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo)
		spriteSheet.x = x; // 원형 배치된 X 좌표
		spriteSheet.y = y; // 원형 배치된 y 좌표
		spriteSheet.useBillboard = true; // 라벨이 항상 카메라를 바라보게 설정
		spriteSheet.useBillboardPerspective = false;

		// 메쉬와 이벤트 추가
		scene.addChild(spriteSheet);
		spriteSheet.addListener(eventName, (e) => {
			console.log(`Event: ${eventName}`, e);
			let tRotation = Math.random() * 360;
			TweenMax.to(e.target, 0.5, {
				rotationX: tRotation,
				rotationY: tRotation,
				rotationZ: tRotation,
				ease: Back.easeOut
			});
		});

		// 라벨 텍스트 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.text = eventName; // 이벤트 이름 텍스트 추가
		label.y = -1; // 라벨을 메쉬의 아래쪽에 배치
		label.useBillboard = true; // 라벨이 항상 카메라를 바라보게 설정
		label.useBillboardPerspective = false;
		label.primitiveState.cullMode = 'none'
		// label.useBillboard = true; // 라벨이 항상 카메라를 바라보게 설정
		spriteSheet.addChild(label);
	});

};

// Function to render Test Pane (for controls)
// 테스트 패널을 렌더링하는 함수
const renderTestPane = async (redGPUContext,) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

};
