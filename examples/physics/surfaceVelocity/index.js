import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45;
		controller.tilt = -35;
		controller.centerY = 0;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		const beltSystems = [];

		const createRealConveyor = (x, z, length, width, speed, direction) => {
			const segmentLength = 1.0;
			const numSegments = Math.ceil(length / segmentLength) + 1;
			const segments = [];
			
			const frame = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			frame.x = x; frame.y = -0.6; frame.z = z;
			frame.scaleX = width; frame.scaleY = 0.2; frame.scaleZ = length;
			frame.material.color.setColorByHEX('#222222');
			scene.addChild(frame);
			physicsEngine.createBody(frame, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

			for (let i = 0; i < numSegments; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
				mesh.scaleX = width * 0.95; mesh.scaleY = 0.2; mesh.scaleZ = segmentLength * 0.95;
				
				const isEven = i % 2 === 0;
				mesh.material.color.setColorByHEX(isEven ? '#444444' : '#666666');
				
				const startOffset = - (length / 2);
				const initialZ = startOffset + (i * segmentLength);

				mesh.x = x;
				mesh.y = 0;
				mesh.z = z + initialZ;

				scene.addChild(mesh);

				const body = physicsEngine.createBody(mesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
					friction: 1.5,
					restitution: 0.0
				});

				segments.push({ mesh, body, localZ: initialZ });
			}

			beltSystems.push({
				segments,
				x, z,
				length,
				segmentLength,
				speed: speed * direction,
				totalLength: numSegments * segmentLength
			});
		};

		createRealConveyor(-6, 0, 20, 5, 2.0, 1);
		createRealConveyor(6, 0, 20, 5, 2.0, -1);

		const floor = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		floor.y = -5; floor.scaleX = 50; floor.scaleY = 1; floor.scaleZ = 60;
		floor.material.color.setColorByHEX('#111111');
		scene.addChild(floor);
		physicsEngine.createBody(floor, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const createBox = () => {
			const size = 0.8;
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = size;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			
			const onLeft = Math.random() > 0.5;
			mesh.x = onLeft ? -6 : 6;
			mesh.y = 5;
			mesh.z = 0;

			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				friction: 1.0, 
				restitution: 0.1
			});

			activeObjects.push({ mesh, body });

			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeObjects.splice(idx, 1);
				}
			}, 15000);
		};

		setInterval(createBox, 800);

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		const render = (time) => {
			const dt = 1 / 60;

			beltSystems.forEach(belt => {
				const moveDist = belt.speed * dt;
				const boundary = belt.length / 2;

				belt.segments.forEach(seg => {
					seg.localZ += moveDist;

					if (belt.speed > 0) {
						if (seg.localZ > boundary + belt.segmentLength) {
							seg.localZ -= belt.totalLength;
						}
					} else {
						if (seg.localZ < -boundary - belt.segmentLength) {
							seg.localZ += belt.totalLength;
						}
					}

					const newZ = belt.z + seg.localZ;
					seg.body.nativeBody.setNextKinematicTranslation({ x: belt.x, y: 0, z: newZ });
				});
			});
		};

		const renderer = new RedGPU.Renderer();
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
	pane.addBlade({ view: 'text', label: 'System', value: 'Physical Conveyor Plates', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Objects' }).on('click', () => resetScene());
};