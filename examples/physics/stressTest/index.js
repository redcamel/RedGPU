import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 60;
		controller.tilt = -35;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 20; directionalLight.y = 40; directionalLight.z = 20;
		directionalLight.intensity = 1.2;
		scene.lightManager.addDirectionalLight(directionalLight);

		const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		ground.scaleX = 60; ground.scaleY = 1; ground.scaleZ = 60;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#222222');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const boxGeo = new RedGPU.Primitive.Box(redGPUContext);
		const boxMat = new RedGPU.Material.PhongMaterial(redGPUContext);

		const createBox = () => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, boxGeo, boxMat);
			mesh.x = (Math.random() * 20) - 10;
			mesh.y = 20 + (Math.random() * 10);
			mesh.z = (Math.random() * 20) - 10;
			mesh.rotationX = Math.random() * 360;
			mesh.rotationY = Math.random() * 360;
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = 0.8;
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				restitution: 0.2,
				friction: 0.5
			});
			activeObjects.push({ mesh, body });
		};

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, createBox, resetScene, activeObjects);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, createBox, resetScene, activeObjects) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	const params = {
		spawnRate: 10,
		autoSpawn: true,
		objectCount: 0
	};

	pane.addBinding(params, 'spawnRate', { min: 1, max: 100, step: 1 });
	pane.addBinding(params, 'autoSpawn');
	pane.addBinding(params, 'objectCount', { readonly: true, interval: 100 });
	pane.addButton({ title: 'Spawn 100 Boxes' }).on('click', () => { for(let i=0; i<100; i++) createBox(); });
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());

	setInterval(() => {
		if (params.autoSpawn && activeObjects.length < 3000) {
			for(let i=0; i<params.spawnRate; i++) createBox();
		}
		params.objectCount = activeObjects.length;
	}, 100);
};
