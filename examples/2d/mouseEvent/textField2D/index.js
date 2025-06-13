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

		// 4. Create a scene and view, then add the view to the context
		// 4. 씬(Scene)과 뷰(View3D)를 생성 후 RedGPU 컨텍스트에 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);

		// Add sample mesh to the scene
		// 샘플 메쉬를 씬에 추가
		createSampleTextField2D(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)
			// 원형 배치 업데이트
			const radius = 250; // 원형의 반지름
			const numChildren = view.scene.children.length;

			const centerX = view.screenRectObject.width / 2
			const centerY = view.screenRectObject.height / 2
			// 원형으로 배치하면서 애니메이션 적용
			view.scene.children.forEach((textField2D, index) => {
				const angle = (index / numChildren) * Math.PI * 2; // 각도를 계산
				const endX = centerX + Math.cos(angle) * radius; // 목표 X 좌표
				const endY = centerY + Math.sin(angle) * radius; // 목표 Z 좌표

				textField2D.setPosition(
					textField2D.x + (endX - textField2D.x) * 0.3,
					textField2D.y + (endY - textField2D.y) * 0.3
				);

			});
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
const createSampleTextField2D = async (redGPUContext, scene) => {
	// Define two materials for testing
	// Create a sample geometry (Box in this case)
	// 샘플 지오메트리 생성 (예: Box)
	Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {

		const textField = new RedGPU.Display.TextField2D(redGPUContext,)

		textField.text = `Hello ${eventName} Event!`
		textField.background = 'blue'
		textField.color = 'white'
		textField.fontSize = 16
		textField.padding = 10
		textField.borderRadius = 10

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



const renderTestPane = async (redGPUContext,) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

};
