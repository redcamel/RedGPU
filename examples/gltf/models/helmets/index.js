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
		controller.speedDistance = 0.1
		controller.distance = 7
		controller.tilt = 0

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		loadGLTFGrid(view,
			[
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF/FlightHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf',
			]
		);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {

		};
		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext, view);
	},
	(failReason) => {
		// Handle initialization failure
		console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);

function loadGLTFGrid(view, urls, gridSize = 4, spacing = 3) {
	const {redGPUContext, scene} = view;

	// 그리드 크기 계산
	const totalCols = Math.min(gridSize, urls.length); // 한 줄의 최대 컬럼 수
	const totalRows = Math.ceil(urls.length / gridSize); // 필요한 줄 수
	const totalWidth = (totalCols - 1) * spacing; // 전체 넓이 (X)
	const totalDepth = (totalRows - 1) * spacing; // 전체 깊이 (Z)

	// GLTF 모델 로드 및 그리드 배치
	urls.forEach((url, index) => {
		new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
			const mesh = v['resultMesh'];
			scene.addChild(mesh);

			// 그리드 위치 계산 (X, Z 축 기준)
			const row = Math.floor(index / gridSize);
			const col = index % gridSize;
			const x = col * spacing - totalWidth / 2; // 중심 정렬
			const z = row * spacing - totalDepth / 2; // 중심 정렬

			// 메쉬 위치 설정
			mesh.x = x;
			mesh.y = 0; // Y축은 고정
			mesh.z = z;
			if (index === 0) {
				mesh.setScale(1.5)
			}
			if (index === 1) {
				mesh.setScale(5)
				mesh.y = -1.7
			}
		});
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {createIblHelper} = await import('../../../exampleHelper/createExample/panes/index.js');

	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
