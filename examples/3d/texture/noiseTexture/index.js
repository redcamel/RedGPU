import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 5;
		controller.speedDistance = 0.3;

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();

		// Add basic lighting
		// 기본 조명 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 0.8;
		scene.lightManager.addDirectionalLight(directionalLight);

		// Add a view and configure it
		// 뷰 생성 및 설정 추가
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// Create a single mesh
		// 단일 메쉬 생성
		const geometry = new RedGPU.Primitive.Box(redGPUContext,2,2,2);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");

		material.diffuseTexture = diffuseTexture
		// material.diffuseTexture = new RedGPU.Resource.NoiseTexture(redGPUContext)
		material.normalTexture = new RedGPU.Resource.NoiseNormalTexture(redGPUContext)

		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.setPosition(0, 0, 0);
		scene.addChild(mesh);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {

		});
		renderTestPane(redGPUContext, material.normalTexture);
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		errorMessage.style.color = "red";
		errorMessage.style.fontSize = "18px";
		errorMessage.style.padding = "20px";
		document.body.appendChild(errorMessage);
	}
);

const renderTestPane = async (redGPUContext, noiseTexture) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	// Add preset buttons
	// 프리셋 버튼 추가
	setSeparator(pane, "Presets");


///
	pane.addButton({title: '☁️ rock'}).on('click', ()=>noiseTexture.applyPreset('rock'));
	pane.addButton({title: '🏛️ metal'}).on('click', ()=>noiseTexture.applyPreset('metal'));
	pane.addButton({title: '🪵 leather'}).on('click',()=> noiseTexture.applyPreset('leather'));
	pane.addButton({title: '🏔️ concrete'}).on('click', ()=>noiseTexture.applyPreset('concrete'));
	pane.addButton({title: '🧵 water'}).on('click', ()=>noiseTexture.applyPreset('water'));
	pane.addButton({title: '🧵 skin'}).on('click', ()=>noiseTexture.applyPreset('skin'));
	pane.addButton({title: '🧵 fabric'}).on('click', ()=>noiseTexture.applyPreset('fabric'));
	// Add a separator
	setSeparator(pane, "Parameters");

	pane.addBinding(noiseTexture, 'frequency', {
		min: 0,
		max: 30,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.frequency = evt.value;

	});
	pane.addBinding(noiseTexture, 'amplitude', {
		min: 1,
		max: 10,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.amplitude = evt.value;

	});
	pane.addBinding(noiseTexture, 'octaves', {
		min: 1,
		max: 8,
		step:1
	}).on('change', (evt) => {
		noiseTexture.octaves = evt.value;

	});
	pane.addBinding(noiseTexture, 'persistence', {
		min: 0,
		max: 1,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.persistence = evt.value;

	});
	pane.addBinding(noiseTexture, 'lacunarity', {
		min: 0,
		max: 10,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.lacunarity = evt.value;

	});
	pane.addBinding(noiseTexture, 'seed', {
		min: 1,
		max: 1000,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.seed = evt.value;

	});
	pane.addBinding(noiseTexture, 'normalStrength', {
		min: 0,
		max: 5,
		step:0.01
	}).on('change', (evt) => {
		noiseTexture.normalStrength = evt.value;

	});

};
