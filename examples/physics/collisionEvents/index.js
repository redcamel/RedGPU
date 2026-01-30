import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 바닥 생성
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 15, 15), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, restitution: 0.8 });

		const activeObjects = [];
		const bodyMap = new Map();

		const createBall = (x, y, z) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext, 1), material);
			mesh.x = x; mesh.y = y; mesh.z = z;
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1, restitution: 0.9
			});
			body.nativeCollider.setActiveEvents(1);
			bodyMap.set(body.nativeCollider.handle, mesh);
			activeObjects.push({ mesh, body });
		};

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			bodyMap.clear();
			createBall(0, 10, 0);
		};

		createBall(0, 10, 0);

		physicsEngine.onCollisionStarted = (h1, h2) => {
			const mesh1 = bodyMap.get(h1);
			const mesh2 = bodyMap.get(h2);
			if (mesh1) mesh1.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			if (mesh2) mesh2.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, createBall, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, createBall, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Ball' }).on('click', () => createBall((Math.random() * 4) - 2, 15, (Math.random() * 4) - 2));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};