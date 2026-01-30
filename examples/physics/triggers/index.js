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
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 바닥 생성
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 20, 20),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// 1. 센서 구역 (Trigger Zone)
		const triggerMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		triggerMesh.material.color.setColorByHEX('#44ff44');
		triggerMesh.material.opacity = 0.3;
		triggerMesh.y = 5;
		triggerMesh.scaleX = 10;
		triggerMesh.scaleY = 2;
		triggerMesh.scaleZ = 10;
		scene.addChild(triggerMesh);

		const triggerBody = physicsEngine.createBody(triggerMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			isSensor: true
		});
		
		// [KO] 센서(Trigger)의 충돌 이벤트를 활성화합니다.
		// [EN] Enable collision events for the sensor (Trigger).
		triggerBody.nativeCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

		// 2. 동적 객체들 및 리셋
		const activeBalls = [];
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const ballMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
				material
			);
			ballMesh.x = (Math.random() * 8) - 4;
			ballMesh.y = 15;
			ballMesh.z = (Math.random() * 8) - 4;
			scene.addChild(ballMesh);

			const body = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});

			// [KO] 구슬의 충돌 이벤트를 활성화합니다.
			// [EN] Enable collision events for the ball.
			body.nativeCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
			
			const ballInfo = { mesh: ballMesh, body };
			activeBalls.push(ballInfo);
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(ballMesh); activeBalls.splice(idx, 1); }
			}, 10000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeBalls.length = 0;
		};

		setInterval(createBall, 1000);

		physicsEngine.onCollisionStarted = (h1, h2) => {
			const triggerHandle = triggerBody.nativeCollider.handle;
			const ballHandle = (h1 === triggerHandle) ? h2 : (h2 === triggerHandle ? h1 : null);
			
			if (ballHandle !== null) {
				// [KO] 엔진에서 직접 바디를 조회하여 메쉬 색상을 변경합니다. (bodyMap 제거됨)
				// [EN] Directly lookup the body from the engine to change the mesh color. (bodyMap removed)
				const ballBody = physicsEngine.getBodyByColliderHandle(ballHandle);
				if (ballBody?.mesh) ballBody.mesh.material.color.setColorByHEX('#ff44ff');
			}
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Info', value: 'Green box is a Sensor!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};