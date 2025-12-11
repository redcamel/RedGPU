import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 타겟 메시 생성
		const targetGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
		const targetMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		const targetMaterial2 = new RedGPU.Material.PhongMaterial(redGPUContext);
		targetMaterial.color.setColorByRGB(255, 0, 0); // 빨간색
		targetMaterial2.color.setColorByRGB(0, 255, 0); // 빨간색
		// targetMaterial.color.setColorByHEX('#ff0000'); // 빨간색
		const targetMesh = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial);
		const targetMesh2 = new RedGPU.Display.Mesh(redGPUContext, targetGeometry, targetMaterial2);
		targetMesh.setPosition(0, 0, 0);
		targetMesh2.setPosition(0, 0, 0);

		// IsometricController 생성
		const isometricController = new RedGPU.Camera.IsometricController(redGPUContext);
		const isometricController2 = new RedGPU.Camera.IsometricController(redGPUContext);
		isometricController.name = "IsometricController Instance";
		console.log(isometricController.name);

		const scene = new RedGPU.Display.Scene();
		scene.addChild(targetMesh);
		scene.addChild(targetMesh2);
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);
		const view = new RedGPU.Display.View3D(redGPUContext, scene, isometricController);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		view.setSize('100%', '100%');
		view.setPosition(0, 0);

		const view2 = new RedGPU.Display.View3D(redGPUContext, scene, isometricController2);
		view2.axis = true;
		view2.grid = true;
		redGPUContext.addView(view2);

		if (redGPUContext.detector.isMobile) {
			// 모바일: 위아래 분할
			view.setSize('100%', '50%');
			view.setPosition(0, 0);         // 상단
			view2.setSize('100%', '50%');
			view2.setPosition(0, '50%');     // 하단
		} else {
			// 데스크톱: 좌우 분할
			view.setSize('50%', '100%');
			view.setPosition(0, 0);         // 좌측
			view2.setSize('50%', '100%');
			view2.setPosition('50%', 0);     // 우측
		}

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
	cameraFolder.addBinding(controller, 'delayMoveSpeed', {
		min: 0.01,
		max: 1,
		step: 0.01
	});
	cameraFolder.addBinding(controller, 'mouseMoveSpeed', {
		min: 0.01,
		max: 0.1,
		step: 0.01
	});
	cameraFolder.addBinding(controller, 'delayMouseMoveSpeed', {
		min: 0.01,
		max: 1,
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

	zoomFolder.addBinding(controller, 'delayZoom', {
		min: 0.01,
		max: 1,
		step: 0.01,
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

	viewFolder.addBinding(controller, 'delayViewHeight', {
		min: 0.01,
		max: 1,
		step: 0.01,
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

};
