import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정
		// [EN] Camera setup
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -20;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false;
		view.grid = false;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성 (30m x 30m)
		// [EN] Create ground (30m x 30m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = 30;
		ground.scaleY = 1;
		ground.scaleZ = 30;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeRagdolls = [];

		/**
		 * [KO] 신체 부위(Limb) 생성 함수
		 * [EN] Function to create limbs
		 */
		const createLimb = (geometry, x, y, z, sx, sy, sz, color) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.scaleX = sx;
			mesh.scaleY = sy;
			mesh.scaleZ = sz;
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

		/**
		 * [KO] 래그돌(Ragdoll) 생성 및 조인트 연결
		 * [EN] Create Ragdoll and connect joints
		 */
		const spawnRagdoll = (offsetX, offsetZ) => {
			const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
			const baseY = 5;

			const head = createLimb(new RedGPU.Primitive.Sphere(redGPUContext, 0.25), offsetX, baseY + 2.2, offsetZ, 1, 1, 1, color);
			const torso = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, baseY + 1.6, offsetZ, 0.6, 0.9, 0.3, color);
			const pelvis = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, baseY + 1.0, offsetZ, 0.5, 0.3, 0.3, color);

			const connect = (b1, b2, a1, a2) => {
				const JD = RAPIER.JointData;
				const jointData = JD.ball ? JD.ball(a1, a2) : JD.spherical(a1, a2);
				physicsEngine.nativeWorld.createImpulseJoint(jointData, b1.nativeBody, b2.nativeBody, true);
			};

			connect(torso.body, head.body, { x: 0, y: 0.5, z: 0 }, { x: 0, y: -0.3, z: 0 });
			connect(torso.body, pelvis.body, { x: 0, y: -0.5, z: 0 }, { x: 0, y: 0.2, z: 0 });

			const createArm = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.6), baseY + 1.7, offsetZ, 0.2, 0.5, 0.2, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.6), baseY + 1.1, offsetZ, 0.15, 0.5, 0.15, color);
				connect(torso.body, upper.body, { x: side * 0.4, y: 0.3, z: 0 }, { x: 0, y: 0.3, z: 0 });
				connect(upper.body, lower.body, { x: 0, y: -0.3, z: 0 }, { x: 0, y: 0.3, z: 0 });
				return [upper, lower];
			};

			const createLeg = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.2), baseY + 0.5, offsetZ, 0.2, 0.6, 0.2, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.2), baseY - 0.2, offsetZ, 0.15, 0.6, 0.15, color);
				connect(pelvis.body, upper.body, { x: side * 0.15, y: -0.15, z: 0 }, { x: 0, y: 0.35, z: 0 });
				connect(upper.body, lower.body, { x: 0, y: -0.35, z: 0 }, { x: 0, y: 0.35, z: 0 });
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
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, spawnRagdoll, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Ragdoll' }).on('click', () => spawnRagdoll((Math.random() * 6) - 3, (Math.random() * 6) - 3));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
