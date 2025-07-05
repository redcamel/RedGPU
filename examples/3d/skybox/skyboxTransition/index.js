import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 🎨 여러 텍스처 옵션 정의
const textureOptions = [
	{
		name: 'Cube Texture',
		type: 'cube',
		paths: [
			"../../../assets/skybox/px.jpg",
			"../../../assets/skybox/nx.jpg",
			"../../../assets/skybox/py.jpg",
			"../../../assets/skybox/ny.jpg",
			"../../../assets/skybox/pz.jpg",
			"../../../assets/skybox/nz.jpg",
		]
	},
	{
		name: 'HDR - Cannon Exterior',
		type: 'hdr',
		path: '../../../assets/hdr/Cannon_Exterior.hdr'
	},
	{
		name: 'HDR - Field',
		type: 'hdr',
		path: '../../../assets/hdr/field.hdr'
	},
	{
		name: 'HDR - Pisa',
		type: 'hdr',
		path: '../../../assets/hdr/pisa.hdr'
	}
];

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);
		view.skybox = createSkybox(redGPUContext);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});

		renderTestPane(view, redGPUContext);
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const createSkybox = (redGPUContext) => {
	// 기본 큐브 텍스처로 시작
	const initialOption = textureOptions[0];
	const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, initialOption.paths);
	return new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
};

// 📦 텍스처 생성 헬퍼 함수
const createTexture = (redGPUContext, option) => {
	if (option.type === 'cube') {
		return new RedGPU.Resource.CubeTexture(redGPUContext, option.paths);
	} else {
		return new RedGPU.Resource.HDRTexture(redGPUContext, option.path);
	}
};

const renderTestPane = async (view, redGPUContext) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();
	const {createFieldOfView} = await import("../../../exampleHelper/createExample/panes/index.js");

	createFieldOfView(pane, view.camera);

	// 🎛️ 기본 속성 컨트롤
	const testData = {
		blur: 0,
		opacity: 1,
	};

	pane.addBinding(testData, 'blur', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.blur = ev.value;
	});

	pane.addBinding(testData, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	}).on("change", (ev) => {
		view.skybox.opacity = ev.value;
	});



	// 🚀 트랜지션 폴더
	const transitionFolder = pane.addFolder({
		title: 'Skybox Transition',
		expanded: true
	});

	// 현재 텍스처 표시
	const currentTextureData = {
		current: textureOptions[0].name,
		transitionDuration: 1000
	};
	transitionFolder.addBinding(currentTextureData, 'transitionDuration', {
		min: 100,
		max: 2000,
		step: 100
	});
	transitionFolder.addBinding(currentTextureData, 'current', {
		readonly: true,
		label: 'Current'
	});

	// 🎯 각 텍스처별 트랜지션 버튼
	textureOptions.forEach((option, index) => {
		if (index === 0) return; // 첫 번째는 이미 로드된 상태

		transitionFolder.addButton({
			title: `→ ${option.name}`,
		}).on('click', () => {
			const newTexture = createTexture(redGPUContext, option);

			// 🎬 트랜지션 실행
			view.skybox.transition(newTexture, currentTextureData.transitionDuration);

			// UI 업데이트
			setTimeout(() => {
				currentTextureData.current = option.name;
			}, currentTextureData.transitionDuration);

			console.log(`Transitioning to: ${option.name} (${currentTextureData.transitionDuration}ms)`);
		});
	});


};
