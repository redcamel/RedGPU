import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45;
		controller.tilt = -20;

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

		const waterLevel = 0;
		const waterMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Plane(redGPUContext, 100, 100),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		waterMesh.rotationX = -90;
		waterMesh.y = waterLevel;
		waterMesh.material.color.setColorByHEX('#00aaff');
		waterMesh.material.opacity = 0.4;
		waterMesh.material.transparent = true;
		scene.addChild(waterMesh);

		const floor = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		floor.y = -20;
		floor.scaleX = 100;
		floor.scaleY = 1;
		floor.scaleZ = 100;
		floor.material.color.setColorByHEX('#222222');
		scene.addChild(floor);
		physicsEngine.createBody(floor, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSIGHT_SHAPE?.BOX || 'box'
		});

		const activeObjects = [];
		const createObject = () => {
			const size = 1.0 + Math.random() * 2.0;
			const isBall = Math.random() > 0.5;
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext, 
				isBall ? new RedGPU.Primitive.Sphere(redGPUContext, size / 2) : new RedGPU.Primitive.Box(redGPUContext), 
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			if (!isBall) {
				mesh.scaleX = size;
				mesh.scaleY = size;
				mesh.scaleZ = size;
			}
			
			mesh.x = (Math.random() * 20) - 10;
			mesh.y = 15 + (Math.random() * 10);
			mesh.z = (Math.random() * 20) - 10;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: isBall ? RedGPU.Physics.PHYSICS_SHAPE.SPHERE : RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: size,
				restitution: 0.3
			});

			activeObjects.push({ mesh, body, size });
		};

		for (let i = 0; i < 10; i++) createObject();

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			for (let i = 0; i < 10; i++) createObject();
		};

		const render = (time) => {
			activeObjects.forEach(obj => {
				const pos = obj.body.position;
				const halfSize = obj.size / 2;
				
				const depth = waterLevel - (pos[1] - halfSize);
				
				if (depth > 0) {
					const buoyancyFactor = 25.0; 
					const lift = Math.min(depth, obj.size) * buoyancyFactor;
					
					obj.body.applyImpulse({ x: 0, y: lift * (1/60), z: 0 });

					obj.body.nativeBody.setLinearDamping(2.0);
					obj.body.nativeBody.setAngularDamping(2.0);
				} else {
					obj.body.nativeBody.setLinearDamping(0.0);
					obj.body.nativeBody.setAngularDamping(0.0);
				}
			});
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, createObject, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, createObject, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Object' }).on('click', () => createObject());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
