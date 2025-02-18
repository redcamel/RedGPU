import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.speedDistance = 0.2

		// Create a scene and add a view with the camera controller
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// Material 설정
		const material = new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
			// new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/crate.png')
		);
		const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
		scene.addChild(sprite3D);
		// Sprite3D 10개를 원형 배치
		const spriteCount = 10; // 원에 배치될 Sprite3D 개수
		const radius = 5; // 원의 반지름

		for (let i = 0; i < spriteCount; i++) {
			const angle = (i / spriteCount) * Math.PI * 2; // 각도 계산
			const x = Math.cos(angle) * radius; // x 좌표
			const z = Math.sin(angle) * radius; // z 좌표

			const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);

			sprite3D.x = x;
			sprite3D.z = z;
			scene.addChild(sprite3D); // 씬에 추가
		}

		// Create a renderer and start rendering
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)
		};
		renderer.start(redGPUContext, render);

		// Render Test Pane for real-time adjustments
		renderTestPane(scene);
	},
	(failReason) => {
		// Handle initialization failure
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// Function to render Test Pane (for controls)
const renderTestPane = async (scene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const controls = {
		useBillboardPerspective: scene.children[0].useBillboardPerspective,
		useBillboard: scene.children[0].useBillboard,
		billboardFixedScale: scene.children[0].billboardFixedScale,
		scaleX: scene.children[0].scaleX,
		scaleY: scene.children[0].scaleY,
		scaleZ: scene.children[0].scaleZ,
	};

	const sprite3DFolder = pane.addFolder({title: 'Sprite3D', expanded: true});

	// Binding for useBillboardPerspective
	sprite3DFolder.addBinding(controls, 'useBillboardPerspective').on('change', (evt) => {
		scene.children.forEach((child) => {

			child.useBillboardPerspective = evt.value;

		});

		// Update billboardFixedScale visibility
		updateBillboardFixedScaleBinding();
	});

	// Binding for useBillboard
	sprite3DFolder.addBinding(controls, 'useBillboard').on('change', (evt) => {
		scene.children.forEach((child) => {

			child.useBillboard = evt.value;

		});

		// Update billboardFixedScale visibility
		updateBillboardFixedScaleBinding();
	});

	// Function to update billboardFixedScale visibility
	const updateBillboardFixedScaleBinding = () => {
		if (!controls.useBillboardPerspective && controls.useBillboard) {
			billboardFixedScaleBinding.element.style.opacity = 1
			billboardFixedScaleBinding.element.style.pointerEvents = 'painted'
		} else {
			billboardFixedScaleBinding.element.style.opacity = 0.25
			billboardFixedScaleBinding.element.style.pointerEvents = 'none'
		}
	};

	// Add binding for billboardFixedScale (initially hidden if conditions aren't met)
	const billboardFixedScaleBinding = sprite3DFolder
		.addBinding(controls, 'billboardFixedScale', {min: 0.1, max: 1})
		.on('change', (evt) => {
			scene.children.forEach((child) => {

				child.billboardFixedScale = evt.value;

			});
		});

	// Initialize visibility of billboardFixedScale based on conditions
	updateBillboardFixedScaleBinding();

	// Add scale controls
	// 스케일 조정 슬라이더 추가
	const scaleFolder = pane.addFolder({title: 'Sprite3D Scale', expanded: true});
	scaleFolder.addBinding(controls, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.scaleX = controls.scaleX
		})
	});
	scaleFolder.addBinding(controls, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
		scene.children.forEach((child) => {
			child.scaleY = controls.scaleY
		})
	});
};
