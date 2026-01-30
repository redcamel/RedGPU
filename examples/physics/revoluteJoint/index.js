import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 55;
		controller.tilt = -25;
		controller.centerY = 10;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;
		const WINDMILL_GROUP = 0x0001;
		const windmillFilter = (WINDMILL_GROUP << 16) | (~WINDMILL_GROUP & 0xFFFF);

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 바닥
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -1;
		ground.scaleX = 100;
		ground.scaleY = 2;
		ground.scaleZ = 100;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		// 2. 풍차 기둥
		const pillar = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		pillar.y = 10;
		pillar.scaleX = 2;
		pillar.scaleY = 20;
		pillar.scaleZ = 2;
		pillar.material.color.setColorByHEX('#666666');
		scene.addChild(pillar);
		const pillarBody = physicsEngine.createBody(pillar, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		pillarBody.nativeCollider.setCollisionGroups(windmillFilter);

		// 3. 프로펠러 뭉치
		const propellerGroup = new RedGPU.Display.Mesh(
			redGPUContext,
			null,
			null
		);
		propellerGroup.y = 18;
		propellerGroup.z = 2.1;
		scene.addChild(propellerGroup);

		const hub = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Cylinder(redGPUContext, 1.5, 1.5, 2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		hub.rotationX = 90;
		hub.material.color.setColorByHEX('#ffffff');
		propellerGroup.addChild(hub);

		for (let i = 0; i < 4; i++) {
			const blade = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			blade.scaleX = 15;
			blade.scaleY = 1.0;
			blade.scaleZ = 0.5;
			const angleRad = (i * 90) * (Math.PI / 180);
			blade.x = Math.cos(angleRad) * 8;
			blade.y = Math.sin(angleRad) * 8;
			blade.rotationZ = i * 90;
			blade.material.color.setColorByHEX('#ffcc00');
			propellerGroup.addChild(blade);
		}

		const fanBody = physicsEngine.createBody(propellerGroup, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, mass: 10, angularDamping: 0.1, linearDamping: 0.1 });
		fanBody.nativeBody.collider(0).setCollisionGroups(windmillFilter);
		fanBody.nativeBody.wakeUp();

		const jointData = RAPIER.JointData.revolute({ x: 0, y: 8, z: 2.1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
		const joint = physicsEngine.nativeWorld.createImpulseJoint(jointData, pillarBody.nativeBody, fanBody.nativeBody, true);
		joint.configureMotorVelocity(2.0, 1000.0);

		// 4. 낙하 공 및 리셋
		const activeBalls = [];
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const ball = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 1),
				material
			);
			ball.x = (Math.random() * 24) - 12;
			ball.y = 35;
			ball.z = 2.1;
			scene.addChild(ball);
			const body = physicsEngine.createBody(ball, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE, mass: 1, restitution: 0.5 });
			body.velocity = { x: 0, y: -15, z: 0 };
			activeBalls.push({ mesh: ball, body });
			setTimeout(() => {
				const idx = activeBalls.findIndex(v => v.body === body);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(ball); activeBalls.splice(idx, 1); }
			}, 10000);
		};

		const resetScene = () => {
			activeBalls.forEach(v => { physicsEngine.removeBody(v.body); scene.removeChild(v.mesh); });
			activeBalls.length = 0;
		};

		setInterval(createBall, 500);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, joint, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, joint, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = { motorVelocity: 2.0 };
	pane.addBinding(params, 'motorVelocity', { min: -20, max: 20 }).on('change', (ev) => joint.configureMotorVelocity(ev.value, 1000.0));
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};