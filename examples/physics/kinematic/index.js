import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
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
		scene.lightManager.addDirectionalLight(directionalLight);

		// 바닥 생성
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 30, 30), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#333333');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		// 키네마틱 장애물
		const obstacleMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		obstacleMesh.material.color.setColorByHEX('#ffcc00');
		obstacleMesh.scaleX = 15; obstacleMesh.scaleY = 1; obstacleMesh.scaleZ = 1;
		obstacleMesh.y = 1;
		scene.addChild(obstacleMesh);
		const obstacleBody = physicsEngine.createBody(obstacleMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const createBox = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const boxMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
			boxMesh.x = Math.random() * 10 - 5; boxMesh.y = 15; boxMesh.z = Math.random() * 10 - 5;
			scene.addChild(boxMesh);
			const body = physicsEngine.createBody(boxMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, mass: 1, restitution: 0.5 });
			activeObjects.push({ mesh: boxMesh, body });
		};

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		let intervalId = setInterval(createBox, 500);

		const renderer = new RedGPU.Renderer();
		const render = (time) => {
			const speed = 0.001;
			const angle = time * speed;
			obstacleBody.nativeBody.setNextKinematicRotation({ x: 0, y: Math.sin(angle / 2), z: 0, w: Math.cos(angle / 2) });
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};