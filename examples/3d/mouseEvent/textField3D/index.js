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
		controller.distance = 7.5

		controller.speedDistance = 0.1
		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true
		redGPUContext.addView(view);

		// Add sample mesh to the scene
		// 샘플 메쉬를 씬에 추가
		createSampleTextField3D(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)

		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
		// 실시간 조정을 위한 테스트 패널 렌더링
		renderTestPane(redGPUContext, scene);
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
const createSampleTextField3D = async (redGPUContext, scene) => {
	// Define two materials for testing
	// Create a sample geometry (Box in this case)
	// 샘플 지오메트리 생성 (예: Box)
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {

		const total = array.length; // 총 이벤트 타입 개수
		const radius = 3; // 원형 배치 반지름 값

		// 폴라 좌표로 원형 배치 좌표 계산
		const angle = (index / total) * Math.PI * 2; // 메쉬의 각도
		const x = Math.cos(angle) * radius; // X 좌표
		const y = Math.sin(angle) * radius; // y 좌표

		const textField = new RedGPU.Display.TextField3D(redGPUContext,)
		textField.x = x; // 원형 배치된 X 좌표
		textField.y = y; // 원형 배치된 y 좌표
		textField.useBillboard = true; // 라벨이 항상 카메라를 바라보게 설정
		textField.useBillboardPerspective = false;
		textField.text = `Hello ${eventName} Event!`
		textField.background = 'blue'
		textField.color = 'white'
		textField.fontSize = 16
		textField.padding = 10
		textField.borderRadius = 10
		textField.primitiveState.cullMode = 'none'

		// 메쉬와 이벤트 추가
		scene.addChild(textField);
		textField.addListener(eventName, (e) => {
			console.log(`Event: ${eventName}`, e);
			e.target.background = getRandomHexValue()

		});

	});

};

function getRandomHexValue() {
	var result = '';
	var characters = '0123456789ABCDEF';
	for (var i = 0; i < 6; i++) {
		result += characters[Math.floor(Math.random() * 16)];
	}
	return `#${result}`;
}

const renderTestPane = async (redGPUContext, scene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();
	const TextField3DFolder = pane.addFolder({title: 'TextField3D', expanded: true});
	const controls = {
		useBillboardPerspective: scene.children[0].useBillboardPerspective,
		useBillboard: scene.children[0].useBillboard,
	}
	TextField3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboardPerspective = evt.value;
		});
	});

// useBillboard 바인딩
	TextField3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
		scene.children.forEach((child) => {
			child.useBillboard = evt.value;
		});
	});
};
