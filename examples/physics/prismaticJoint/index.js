import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 55;
		controller.tilt = -25;
		controller.centerY = 15;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 바닥
		const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		ground.y = -1; ground.scaleX = 100; ground.scaleY = 2; ground.scaleZ = 100;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		// 2. 가이드 레일 (정확히 x: -10 위치에 수직으로 배치)
		const rail = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		rail.x = -10; rail.y = 15; rail.z = 0;
		rail.scaleX = 2; rail.scaleY = 30; rail.scaleZ = 2;
		rail.material.color.setColorByHEX('#666666');
		scene.addChild(rail);
		const railBody = physicsEngine.createBody(rail, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		// 3. 승강기 플랫폼 (정확히 원점에서 시작)
		const platform = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		platform.x = 0; platform.y = 5; platform.z = 0;
		platform.scaleX = 15; platform.scaleY = 1; platform.scaleZ = 15;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 50, // 묵직하게 설정
			linearDamping: 0.5,
			angularDamping: 1.0
		});

		// [Escape Hatch] Prismatic Joint 정밀 설정
		// railBody는 x: -10에 있고, platformBody는 x: 0에 있음.
		// 따라서 rail 입장에서는 오른쪽으로 10만큼 떨어진 지점이 연결점임.
		const jointData = RAPIER.JointData.prismatic(
			{ x: 10, y: -10, z: 0 }, // rail 기준 상대 좌표 (y: 15 - 10 = 5 지점을 기준점으로 잡음)
			{ x: 0, y: 0, z: 0 },    // platform 중심 기준
			{ x: 0, y: 1, z: 0 }     // 수직 Y축 방향으로만 슬라이딩
		);
		
		jointData.limitsEnabled = true;
		jointData.limits = [0, 25]; // 5에서 시작해서 30까지 이동 가능

		physicsEngine.nativeWorld.createImpulseJoint(jointData, railBody.nativeBody, platformBody.nativeBody, true);

		// 4. 낙하 박스
		const activeBoxes = [];
		const createBox = () => {
			const box = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			box.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			box.x = (Math.random() * 10) - 5;
			box.y = 35;
			box.z = (Math.random() * 10) - 5;
			scene.addChild(box);

			const body = physicsEngine.createBody(box, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, mass: 2 });
			activeBoxes.push({ mesh: box, body });
			
			setTimeout(() => {
				const idx = activeBoxes.findIndex(v => v.body === body);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(box); activeBoxes.splice(idx, 1); }
			}, 10000);
		};

		const resetScene = () => {
			activeBoxes.forEach(v => { physicsEngine.removeBody(v.body); scene.removeChild(v.mesh); });
			activeBoxes.length = 0;
			platformBody.nativeBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		};

		setInterval(createBox, 800);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, platformBody, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, platformBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = { liftPower: 1000 };
	pane.addBinding(params, 'liftPower', { min: 100, max: 5000 });
	pane.addButton({ title: 'LIFT UP!' }).on('click', () => platformBody.applyImpulse({ x: 0, y: params.liftPower, z: 0 }));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};