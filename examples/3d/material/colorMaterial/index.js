import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Set up camera, scene, and view
		// 카메라, 씬, 뷰 설정
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 5
		controller.speedDistance = 0.1
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Create a sample mesh and add to the scene
		// 샘플 메쉬를 생성하고 씬에 추가
		const mesh = createSampleMesh(redGPUContext, scene);

		// Start the rendering loop
		// 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});

		// Render the UI for testing
		// 테스트용 UI 렌더링
		renderTestPane(redGPUContext, mesh);
	},
	(failReason) => {
		// Handle initialization errors
		// 초기화 실패 처리
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// Function to create a sample mesh
// 샘플 메쉬를 생성하는 함수
const createSampleMesh = (redGPUContext, scene) => {
	// Define initial material as ColorMaterial
	// 초기 재질을 ColorMaterial로 정의
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000'); // 초기 색상: 빨강

	// Create a sample geometry (Box in this case)
	// 샘플 기하구조를 생성 (여기서는 박스)
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);

	// Create a mesh with ColorMaterial
	// ColorMaterial을 사용하는 메쉬 생성
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	scene.addChild(mesh);

	return mesh;
};


// 테스트용 UI를 구성하는 함수
const renderTestPane = async (redGPUContext, mesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	// Define the color parameter object for the pane
	// Pane에서 사용할 색상 파라미터 정의
	const params = {
		color: {r: 255, g: 0, b: 0}, // Initial color (Red in RGB) // 초기 색상(RGB 빨강)
	};

	const refresh = () => {
		params.color.r = mesh.material.color.r
		params.color.g = mesh.material.color.g
		params.color.b = mesh.material.color.b
		pane.refresh()
	}
	// Add color control with an inline color picker
	// 인라인 컬러 피커를 포함한 색상 컨트롤 추가
	pane.addBinding(params, 'color', {
		picker: 'inline',
		view: 'color',
		expanded: true,
	}).on('change', (ev) => {
		// Update color using the RGB values
		// RGB 값을 이용해 색상을 업데이트
		const r = Math.floor(ev.value.r);
		const g = Math.floor(ev.value.g);
		const b = Math.floor(ev.value.b);
		mesh.material.color.setColorByRGB(r, g, b);
		refresh()
	});

	// Add a separator to visually divide UI sections
	// UI 섹션을 시각적으로 구분하기 위한 구분자 추가
	setSeparator(pane);

	// UI bindings for dynamic color control
	// 동적 색상 변경을 위한 UI 바인딩 추가
	['r', 'g', 'b'].forEach(key => {
		pane.addBinding(params.color, key, {min: 0, max: 255, step: 1})
			.on('change', (e) => {
				mesh.material.color[key] = e.value
				refresh()
			});
	})

		pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01})
			.on('change', (e) => {
				mesh.material.opacity = e.value
			});


	// Add a separator
	// 구분자 추가
	setSeparator(pane);

	// Buttons for setting colors with specific methods
	// 특정 메서드로 색상을 설정하는 버튼 추가
	{
		const r = 0, g = 128, b = 255;
		// Example RGB: Blue
		// RGB 값을 이용해 색상을 설정하는 버튼
		pane.addButton({title: `setColorByRGB(${r}, ${g}, ${b})`})
			.on('click', () => {
				// Set the color using setColorByRGB
				// setColorByRGB를 이용해 색상을 설정
				mesh.material.color.setColorByRGB(r, g, b);
				refresh()
			});
	}

	{
		const hexColor = '#ff00ff';
		// Example HEX: Magenta
		// HEX 값을 이용해 색상을 설정하는 버튼
		pane.addButton({title: `setColorByHEX(${hexColor})`})
			.on('click', () => {
				// Set the color using setColorByHEX
				// setColorByHEX를 이용해 색상을 설정
				mesh.material.color.setColorByHEX(hexColor);
				refresh()
			});
	}

	{
		const rgbString = 'rgb(34, 139, 34)';
		// Example RGB String: ForestGreen
		// RGB 문자열을 이용해 색상을 설정하는 버튼
		pane.addButton({title: `setColorByRGBString(${rgbString})`})
			.on('click', () => {
				// Set the color using setColorByRGBString
				// setColorByRGBString을 이용해 색상을 설정
				mesh.material.color.setColorByRGBString(rgbString);
				const [r, g, b] = mesh.material.color.rgb
				params.color.r = r;
				params.color.g = g;
				params.color.b = b;
				pane.refresh()
			});
	}
};
