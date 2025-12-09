import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 타겟 메시 생성
		const targetGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
		const targetMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
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
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);
		const view = new RedGPU.Display.View3D(redGPUContext, scene, isometricController);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		view.setSize('100%', '100%');
		view.setPosition(0, 0);

		const addMeshesToScene = (scene, count = 500) => {
			const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);

			for (let i = 0; i < count; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

				mesh.setPosition(
					Math.ceil(Math.random() * 300 - 150) - 0.5,
					0.5,
					Math.ceil(Math.random() * 300 - 150) - 0.5,
				);
				scene.addChild(mesh);
			}
		};

		addMeshesToScene(scene, 500);

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
		readonly: true,
		step: 1
	});
	cameraFolder.addBinding(controller, 'moveSpeed', {
		min: 0.01,
		max: 2,
		step: 0.01
	});
	cameraFolder.addBinding(controller, 'mouseMoveSpeed', {
		min: 0.01,
		max: 0.1,
		step: 0.01
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

	targetFolder.addBinding(targetMesh, 'x', {
		readonly: true,
	})

	targetFolder.addBinding(targetMesh, 'y', {
		readonly: true,
	})

	targetFolder.addBinding(targetMesh, 'z', {
		readonly: true,
	})

	targetFolder.addButton({
		title: 'Reset Target Position',
	}).on('click', () => {
		targetMesh.setPosition(0, 0, 0);

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
