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
		controller.speedDistance = 0.3
		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true
		view.axis = true
		redGPUContext.addView(view);

		// Add sample mesh to the scene
		// 샘플 메쉬를 씬에 추가
		const mesh = createSampleMesh(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)
		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
		// 실시간 조정을 위한 테스트 패널 렌더링
		renderTestPane(redGPUContext, mesh);
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
	// Define two materials for testing
	// 테스트용으로 두 가지 재질 정의
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'))

	// Create a sample geometry (Box in this case)
	// 샘플 지오메트리 생성 (예: Box)
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);

	// Create a mesh with color material by default
	// 기본적으로 컬러 재질을 사용하는 메쉬 생성
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	scene.addChild(mesh);

	return mesh
};

// Function to render Test Pane (for controls)
// 테스트 패널을 렌더링하는 함수
const renderTestPane = async (redGPUContext, mesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Mesh transformation configurations
	// 메쉬 변환에 대한 초기 설정
	const config = {
		material: 'Bitmap', // 초기 활성화된 재질
		x: mesh.x,
		y: mesh.y,
		z: mesh.z,
		scaleX: mesh.scaleX,
		scaleY: mesh.scaleY,
		scaleZ: mesh.scaleZ,
		rotationX: mesh.rotationX,
		rotationY: mesh.rotationY,
		rotationZ: mesh.rotationZ
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
			mesh.material = new RedGPU.Material.ColroMaterial(redGPUContext)
		} else {
			mesh.material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg'))
		}
	});

	// Add position controls
	// 포지션 조정 슬라이더 추가
	const positionFolder = pane.addFolder({title: 'Position', expanded: true});
	positionFolder.addBinding(config, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		mesh.setPosition(evt.value, config.y, config.z);
	});
	positionFolder.addBinding(config, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		mesh.setPosition(config.x, evt.value, config.z);
	});
	positionFolder.addBinding(config, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
		mesh.setPosition(config.x, config.y, evt.value);
	});

	// Add scale controls
	// 스케일 조정 슬라이더 추가
	const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
	scaleFolder.addBinding(config, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		mesh.setScale(evt.value, config.scaleY, config.scaleZ);
	});
	scaleFolder.addBinding(config, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		mesh.setScale(config.scaleX, evt.value, config.scaleZ);
	});
	scaleFolder.addBinding(config, 'scaleZ', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		mesh.setScale(config.scaleX, config.scaleY, evt.value);
	});

	// Add rotation controls
	// 회전 조정 슬라이더 추가
	const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
	rotationFolder.addBinding(config, 'rotationX', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
		mesh.setRotation(evt.value, config.rotationY, config.rotationZ);
	});
	rotationFolder.addBinding(config, 'rotationY', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
		mesh.setRotation(config.rotationX, evt.value, config.rotationZ);
	});
	rotationFolder.addBinding(config, 'rotationZ', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
		mesh.setRotation(config.rotationX, config.rotationY, evt.value);
	});
};
