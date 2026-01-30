import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45;
		controller.tilt = -15;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
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

		const CHAIN_GROUP = 0x0001;
		const chainCollisionFilter = (CHAIN_GROUP << 16) | (~CHAIN_GROUP & 0xFFFF);

		// 1. 고정 앵커
		const anchorMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		anchorMesh.material.color.setColorByHEX('#ff4444');
		anchorMesh.y = 15;
		scene.addChild(anchorMesh);

		const anchorBody = physicsEngine.createBody(anchorMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		anchorBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

		const activeChain = [];
		let bigBallInfo = null;

		const createBallJointData = (a1, a2) => {
			const JD = RAPIER.JointData;
			if (JD && typeof JD.ball === 'function') return JD.ball(a1, a2);
			if (JD && typeof JD.spherical === 'function') return JD.spherical(a1, a2);
			throw new Error('Joint data methods not found in RAPIER');
		};

		const initChain = () => {
			const linkGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
			const linkMat = new RedGPU.Material.PhongMaterial(redGPUContext);
			linkMat.color.setColorByHEX('#888888');

			let prevBody = anchorBody;
			const numLinks = 10;
			const spacing = 1.2;

			for (let i = 0; i < numLinks; i++) {
				const linkMesh = new RedGPU.Display.Mesh(redGPUContext, linkGeo, linkMat);
				linkMesh.y = 15 - (i + 1) * spacing; linkMesh.x = (i + 1) * 0.2; 
				scene.addChild(linkMesh);

				const currentBody = physicsEngine.createBody(linkMesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
					mass: 0.5, linearDamping: 0.5, angularDamping: 0.5
				});
				currentBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

				const jointData = createBallJointData({ x: 0, y: 0, z: 0 }, { x: 0, y: spacing, z: 0 });
				physicsEngine.nativeWorld.createImpulseJoint(jointData, prevBody.nativeBody, currentBody.nativeBody, true);

				activeChain.push({ mesh: linkMesh, body: currentBody });
				prevBody = currentBody;
			}

			const bigBallMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext, 2), new RedGPU.Material.PhongMaterial(redGPUContext));
			bigBallMesh.material.color.setColorByHEX('#4444ff');
			bigBallMesh.y = 15 - (numLinks + 1) * spacing - 1; bigBallMesh.x = (numLinks + 1) * 0.2;
			scene.addChild(bigBallMesh);

			const bigBallBody = physicsEngine.createBody(bigBallMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 5, linearDamping: 0.2, angularDamping: 0.2
			});
			bigBallBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

			const finalJointData = createBallJointData({ x: 0, y: 0, z: 0 }, { x: 0, y: spacing + 1, z: 0 });
			physicsEngine.nativeWorld.createImpulseJoint(finalJointData, prevBody.nativeBody, bigBallBody.nativeBody, true);
			bigBallInfo = { mesh: bigBallMesh, body: bigBallBody };
		};

		const resetScene = () => {
			activeChain.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeChain.length = 0;
			if (bigBallInfo) { physicsEngine.removeBody(bigBallInfo.body); scene.removeChild(bigBallInfo.mesh); }
			initChain();
		};

		initChain();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, () => bigBallInfo?.body, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, getBigBallBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Push Ball!' }).on('click', () => {
		const body = getBigBallBody();
		if (body) body.applyImpulse({ x: 150, y: 0, z: (Math.random() * 100) - 50 });
	});
	pane.addButton({ title: 'Reset Chain' }).on('click', () => resetScene());
};