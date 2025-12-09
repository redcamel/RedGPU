import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 타겟 메시 생성
		const targetGeometry = new RedGPU.Primitive.Box(redGPUContext);
		const targetMaterial = new RedGPU.Material.ColorMaterial(redGPUContext);
		targetMaterial.color.setColorByRGB(255, 0, 0); // 빨간색
		// targetMaterial.color.setColorByHEX('#ff0000'); // 빨간색
		const targetMesh = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial);
		targetMesh.setPosition(0, 0, 0);

		// IsometricController 생성
		const isometricController = new RedGPU.Camera.IsometricController(redGPUContext, targetMesh);
		isometricController.name = "IsometricController Instance";
		console.log(isometricController.name);

		const scene = new RedGPU.Display.Scene();
		scene.addChild(targetMesh);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, isometricController);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		view.setSize('100%', '100%');
		view.setPosition(0, 0);

		const addMeshesToScene = (scene, count = 500) => {
			const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
			const material = new RedGPU.Material.ColorMaterial(redGPUContext);

			for (let i = 0; i < count; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

				mesh.setPosition(
					Math.random() * 50 - 25,
					0,
					Math.random() * 50 - 25
				);

				scene.addChild(mesh);
			}
		};

		addMeshesToScene(scene, 100);

		const renderer = new RedGPU.Renderer(redGPUContext);

		let targetX = 0;
		let targetZ = 0;
		const moveSpeed = 0.5;

		const render = (time) => {
		};

		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, isometricController, targetMesh);
	},
	(failReason) => {
		console.error('초기화 실패:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const renderTestPane = async (redGPUContext, controller, targetMesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {
		setDebugButtons
	} = await import("../../../exampleHelper/createExample/panes/index.js");

	setDebugButtons(redGPUContext);
	const pane = new Pane();

	// 카메라 설정 폴더
	const cameraFolder = pane.addFolder({
		title: 'Camera Settings',
	});


	cameraFolder.addBinding(controller, 'cameraAngle', {
		min: 0,
		max: 360,
		step: 1,
	});

	// 줌 설정 폴더
	const zoomFolder = pane.addFolder({
		title: 'Zoom Settings',
	});

	zoomFolder.addBinding(controller, 'zoom', {
		min: controller.minZoom,
		max: controller.maxZoom,
		step: 0.1,
	});

	zoomFolder.addBinding(controller, 'speedZoom', {
		min: 0.01,
		max: 0.5,
		step: 0.01,
	});

	zoomFolder.addBinding(controller, 'minZoom', {
		min: 0.1,
		max: 2,
		step: 0.1,
	});

	zoomFolder.addBinding(controller, 'maxZoom', {
		min: 1,
		max: 10,
		step: 0.1,
	});

	// 뷰 설정 폴더
	const viewFolder = pane.addFolder({
		title: 'View Settings',
	});



	viewFolder.addBinding(controller, 'viewHeight', {
		min: 5,
		max: 100,
		step: 1,
	});

	// 타겟 위치 폴더
	const targetFolder = pane.addFolder({
		title: 'Target Position',
	});

	const targetPos = {
		x: targetMesh.x,
		y: targetMesh.y,
		z: targetMesh.z,
	};

	targetFolder.addBinding(targetPos, 'x', {
		min: -500,
		max: 500,
		step: 1,
	}).on('change', (ev) => {
		targetMesh.x = ev.value;
	});

	targetFolder.addBinding(targetPos, 'y', {
		min: -500,
		max: 500,
		step: 1,
	}).on('change', (ev) => {
		targetMesh.y = ev.value;
	});

	targetFolder.addBinding(targetPos, 'z', {
		min: -500,
		max: 500,
		step: 1,
	}).on('change', (ev) => {
		targetMesh.z = ev.value;
	});

	targetFolder.addButton({
		title: 'Reset Target Position',
	}).on('click', () => {
		targetMesh.setPosition(0, 0, 0);
		targetPos.x = 0;
		targetPos.y = 0;
		targetPos.z = 0;
		pane.refresh();
	});

	// 카메라 리셋 버튼
	cameraFolder.addButton({
		title: 'Reset Camera',
	}).on('click', () => {
		controller.cameraDistance = 15;
		controller.cameraHeight = 12;
		controller.cameraAngle = 45;
		controller.zoom = 1;
		pane.refresh();
	});
};
