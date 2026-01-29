import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		// 조명 설정
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10; directionalLight.y = 20; directionalLight.z = 10;
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 바닥 생성
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 10, 10), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#666666');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeBoxes = [];
		const createBox = (x, y, z, color) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(color);
			const boxMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
			boxMesh.x = x; boxMesh.y = y; boxMesh.z = z;
			boxMesh.rotationX = Math.random() * 360;
			boxMesh.rotationY = Math.random() * 360;
			scene.addChild(boxMesh);

			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				restitution: 0.5
			});
			activeBoxes.push({ mesh: boxMesh, body });
		};

		const initBoxes = () => {
			for (let i = 0; i < 5; i++) {
				createBox(Math.random() * 4 - 2, 10 + i * 2, Math.random() * 4 - 2, `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			}
		};

		const resetScene = () => {
			activeBoxes.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBoxes.length = 0;
			initBoxes();
		};

		initBoxes();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, physicsEngine, createBox, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, physicsEngine, createBox, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	const params = {
		gravityY: -9.81,
		addBox: () => createBox(Math.random() * 4 - 2, 10, Math.random() * 4 - 2, `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`)
	};

	pane.addBinding(params, 'gravityY', { min: -30, max: 10 }).on('change', (ev) => physicsEngine.setGravity(0, ev.value, 0));
	pane.addButton({ title: 'Add Box' }).on('click', () => params.addBox());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
