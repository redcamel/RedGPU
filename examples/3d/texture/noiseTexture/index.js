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
		controller.distance = 55;
		controller.speedDistance = 2;
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
		// view.grid = true;
		redGPUContext.addView(view);

		// Create a single mesh
		// 단일 메쉬 생성
		// const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2,32,32,32);
		// const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 5,32,32,32);
		const geometry = new RedGPU.Primitive.Plane(redGPUContext, 50, 50, 1000,1000);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");

		material.diffuseTexture = diffuseTexture
		// material.diffuseTexture = new RedGPU.Resource.NoiseTexture(redGPUContext)
		// material.normalTexture = new RedGPU.Resource.NoiseNormalTexture(redGPUContext)
		material.displacementTexture = new RedGPU.Resource.NoiseDisplacementTexture(redGPUContext)
		material.diffuseTexture = 	material.displacementTexture
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = 'none';
		mesh.setPosition(0, 0, 0);
		mesh.rotationX = 90
		scene.addChild(mesh);

		const testData = {useAnimation:true}
		renderTestPane(redGPUContext, material.displacementTexture,testData);
		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			if(testData.useAnimation) {
				material.displacementTexture.time = time
			}
		});

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

const renderTestPane = async (redGPUContext, targetNoiseTexture,testData) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");
	const pane = new Pane();

	// Add preset buttons
	// 프리셋 버튼 추가
	setSeparator(pane, "Presets");

///
// 	pane.addButton({title: '☁️ rock'}).on('click', () => targetNoiseTexture.applyPreset('rock'));
// 	pane.addButton({title: '🏛️ metal'}).on('click', () => targetNoiseTexture.applyPreset('metal'));
// 	pane.addButton({title: '🪵 leather'}).on('click', () => targetNoiseTexture.applyPreset('leather'));
// 	pane.addButton({title: '🏔️ concrete'}).on('click', () => targetNoiseTexture.applyPreset('concrete'));
// 	pane.addButton({title: '🧵 water'}).on('click', () => targetNoiseTexture.applyPreset('water'));
// 	pane.addButton({title: '🧵 skin'}).on('click', () => targetNoiseTexture.applyPreset('skin'));
// 	pane.addButton({title: '🧵 fabric'}).on('click', () => targetNoiseTexture.applyPreset('fabric'));

	pane.addButton({title: '🧵 mountains'}).on('click', () => {targetNoiseTexture.applyPreset('mountains'),pane.refresh()} );
	pane.addButton({title: '🧵 waves'}).on('click', () => {targetNoiseTexture.applyPreset('waves'),pane.refresh()});
	pane.addButton({title: '🧵 crater'}).on('click', () => {targetNoiseTexture.applyPreset('crater'),pane.refresh()});
	pane.addButton({title: '🧵 wrinkles'}).on('click', () => {targetNoiseTexture.applyPreset('wrinkles'),pane.refresh()});
	pane.addButton({title: '🧵 cobblestone'}).on('click', () => {targetNoiseTexture.applyPreset('cobblestone'),pane.refresh()});
	pane.addButton({title: '🧵 dunes'}).on('click', () => {targetNoiseTexture.applyPreset('dunes'),pane.refresh()});
	pane.addButton({title: '🧵 coral'}).on('click', () => {targetNoiseTexture.applyPreset('coral'),pane.refresh()});
	pane.addButton({title: '🧵 bark'}).on('click', () => {targetNoiseTexture.applyPreset('bark'),pane.refresh()});
	// Add a separator
	setSeparator(pane, "Parameters");

	pane.addBinding(targetNoiseTexture, 'frequency', {
		min: 0,
		max: 30,
		step: 0.01
	}).on('change', (evt) => {
		targetNoiseTexture.frequency = evt.value;

	});
	pane.addBinding(targetNoiseTexture, 'amplitude', {
		min: 1,
		max: 10,
		step: 0.01
	}).on('change', (evt) => {
		targetNoiseTexture.amplitude = evt.value;

	});
	pane.addBinding(targetNoiseTexture, 'octaves', {
		min: 1,
		max: 8,
		step: 1
	}).on('change', (evt) => {
		targetNoiseTexture.octaves = evt.value;

	});
	pane.addBinding(targetNoiseTexture, 'persistence', {
		min: 0,
		max: 1,
		step: 0.01
	}).on('change', (evt) => {
		targetNoiseTexture.persistence = evt.value;

	});
	pane.addBinding(targetNoiseTexture, 'lacunarity', {
		min: 0,
		max: 10,
		step: 0.01
	}).on('change', (evt) => {
		targetNoiseTexture.lacunarity = evt.value;

	});
	pane.addBinding(targetNoiseTexture, 'seed', {
		min: 1,
		max: 1000,
		step: 0.01
	}).on('change', (evt) => {
		targetNoiseTexture.seed = evt.value;

	});
	if (targetNoiseTexture instanceof RedGPU.Resource.NoiseNormalTexture) {
		pane.addBinding(targetNoiseTexture, 'strength', {
			min: 0,
			max: 5,
			step: 0.01
		}).on('change', (evt) => {
			targetNoiseTexture.strength = evt.value;

		});
	}
	if (targetNoiseTexture instanceof RedGPU.Resource.NoiseDisplacementTexture) {
		pane.addBinding(targetNoiseTexture, 'strength', {
			min: 0,
			max: 5,
			step: 0.01
		}).on('change', (evt) => {
			targetNoiseTexture.strength = evt.value;

		});

		pane.addBinding(redGPUContext.viewList[0].scene.getChildAt(0).material, 'displacementScale', {
			min: 0,
			max: 20,
			step: 0.01
		}).on('change', (evt) => {
			redGPUContext.viewList[0].scene.getChildAt(0).material.displacementScale = evt.value;

		});
	}
	pane.addBinding(targetNoiseTexture, 'noiseDimension', {
		options: RedGPU.Resource.NOISE_DIMENSION
	}).on('change', (evt) => {
		targetNoiseTexture.noiseDimension = evt.value;

	});

	const animation = pane.addFolder({title: 'Animation', expanded: true});
	animation.addBinding(testData, 'useAnimation', )
	animation.addBinding(targetNoiseTexture, 'animationDirectionX', {
		min:-1,
		max:1,
		step:0.001
	}).on('change', (evt) => {
		targetNoiseTexture.animationDirectionX = evt.value;

	});
	animation.addBinding(targetNoiseTexture, 'animationDirectionY', {
		min:-1,
		max:1,
		step:0.001
	}).on('change', (evt) => {
		targetNoiseTexture.animationDirectionY = evt.value;

	});

};
