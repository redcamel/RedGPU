import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -25;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false;
		view.grid = false;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = 50;
		ground.scaleY = 1;
		ground.scaleZ = 50;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const createBox = (x, y, z) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.rotationX = Math.random() * 360;
			mesh.rotationY = Math.random() * 360;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				restitution: 0.5
			});
			activeObjects.push({ mesh, body });
		};

		for (let i = 0; i < 30; i++) {
			createBox((Math.random() * 10) - 5, 10 + (i * 2), (Math.random() * 10) - 5);
		}

		let savedSnapshot = null;

		const takeSnapshot = () => {
			savedSnapshot = physicsEngine.nativeWorld.takeSnapshot();
			console.log('Snapshot saved! Size:', savedSnapshot.length, 'bytes');
		};

		const restoreSnapshot = () => {
			if (savedSnapshot) {
				physicsEngine.nativeWorld.restoreSnapshot(savedSnapshot);
				physicsEngine.bodies.forEach(body => body.syncToMesh());
				console.log('Snapshot restored!');
			}
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, takeSnapshot, restoreSnapshot);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, save, restore) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'TAKE SNAPSHOT' }).on('click', () => save());
	pane.addButton({ title: 'RESTORE SNAPSHOT' }).on('click', () => restore());
};