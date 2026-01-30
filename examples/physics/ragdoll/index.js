import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -20;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false; view.grid = false;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		ground.scaleX = 50; ground.scaleY = 1; ground.scaleZ = 50;
		ground.y = -1;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeRagdolls = [];

		const createLimb = (geometry, x, y, z, sx, sy, sz, color) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = sx; mesh.scaleY = sy; mesh.scaleZ = sz;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			const shape = geometry instanceof RedGPU.Primitive.Sphere ? RedGPU.Physics.PHYSICS_SHAPE.SPHERE : RedGPU.Physics.PHYSICS_SHAPE.BOX;
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: shape,
				mass: 1,
				linearDamping: 0.1,
				angularDamping: 0.1
			});
			return { mesh, body };
		};

		const spawnRagdoll = (offsetX, offsetZ) => {
			const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
			const baseY = 10;

			const head = createLimb(new RedGPU.Primitive.Sphere(redGPUContext, 0.5), offsetX, baseY + 4.5, offsetZ, 1, 1, 1, color);
			const torso = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, baseY + 3.2, offsetZ, 1.2, 1.8, 0.6, color);
			const pelvis = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, baseY + 2.0, offsetZ, 1.0, 0.6, 0.6, color);

			const createJoint = (b1, b2, a1, a2) => {
				const JD = RAPIER.JointData;
				let params;
				if (typeof JD.spherical === 'function') params = JD.spherical(a1, a2);
				else if (typeof JD.ball === 'function') params = JD.ball(a1, a2);
				else {
					console.error('Ball/Spherical joint not supported');
					return;
				}
				physicsEngine.nativeWorld.createImpulseJoint(params, b1.nativeBody, b2.nativeBody, true);
			};

			createJoint(torso.body, head.body, { x: 0, y: 1.0, z: 0 }, { x: 0, y: -0.6, z: 0 });
			createJoint(torso.body, pelvis.body, { x: 0, y: -1.0, z: 0 }, { x: 0, y: 0.4, z: 0 });

			const createArm = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 1.2), baseY + 3.5, offsetZ, 0.4, 1.0, 0.4, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 1.2), baseY + 2.3, offsetZ, 0.3, 1.0, 0.3, color);
				createJoint(torso.body, upper.body, { x: side * 0.8, y: 0.7, z: 0 }, { x: 0, y: 0.6, z: 0 });
				createJoint(upper.body, lower.body, { x: 0, y: -0.6, z: 0 }, { x: 0, y: 0.6, z: 0 });
				return [upper, lower];
			};

			const createLeg = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.4), baseY + 1.0, offsetZ, 0.4, 1.2, 0.4, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.4), baseY - 0.5, offsetZ, 0.3, 1.2, 0.3, color);
				createJoint(pelvis.body, upper.body, { x: side * 0.3, y: -0.3, z: 0 }, { x: 0, y: 0.7, z: 0 });
				createJoint(upper.body, lower.body, { x: 0, y: -0.7, z: 0 }, { x: 0, y: 0.7, z: 0 });
				return [upper, lower];
			};

			const limbs = [head, torso, pelvis, ...createArm(-1), ...createArm(1), ...createLeg(-1), ...createLeg(1)];
			activeRagdolls.push(limbs);
		};

		spawnRagdoll(0, 0);

		const resetScene = () => {
			activeRagdolls.forEach(limbs => {
				limbs.forEach(limb => {
					physicsEngine.removeBody(limb.body);
					scene.removeChild(limb.mesh);
				});
			});
			activeRagdolls.length = 0;
			spawnRagdoll(0, 0);
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, spawnRagdoll, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, spawnRagdoll, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Ragdoll' }).on('click', () => spawnRagdoll((Math.random() * 10) - 5, (Math.random() * 10) - 5));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};