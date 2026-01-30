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
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 20, 20), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeDumbbells = [];
		const createDumbbell = (x, y, z) => {
			const dumbbellGroup = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Cylinder(redGPUContext, 0.2, 0.2, 4), new RedGPU.Material.PhongMaterial(redGPUContext));
			dumbbellGroup.material.color.setColorByHEX('#aaaaaa');
			dumbbellGroup.x = x; dumbbellGroup.y = y; dumbbellGroup.z = z;
			dumbbellGroup.rotationZ = 90;
			scene.addChild(dumbbellGroup);

			const weightGeo = new RedGPU.Primitive.Sphere(redGPUContext, 1);
			const weightMat = new RedGPU.Material.PhongMaterial(redGPUContext);
			weightMat.color.setColorByHEX('#ff4444');

			const leftWeight = new RedGPU.Display.Mesh(redGPUContext, weightGeo, weightMat);
			leftWeight.y = 2; dumbbellGroup.addChild(leftWeight);
			const rightWeight = new RedGPU.Display.Mesh(redGPUContext, weightGeo, weightMat);
			rightWeight.y = -2; dumbbellGroup.addChild(rightWeight);

			const body = physicsEngine.createBody(dumbbellGroup, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, mass: 5, restitution: 0.5 });
			activeDumbbells.push({ mesh: dumbbellGroup, body });
		};

		const initScene = () => {
			for (let i = 0; i < 5; i++) createDumbbell((Math.random() * 6) - 3, 10 + (i * 5), (Math.random() * 6) - 3);
		};

		const resetScene = () => {
			activeDumbbells.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeDumbbells.length = 0;
			initScene();
		};

		initScene();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, createDumbbell, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, createDumbbell, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Dumbbell' }).on('click', () => createDumbbell((Math.random() * 4) - 2, 15, (Math.random() * 4) - 2));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};