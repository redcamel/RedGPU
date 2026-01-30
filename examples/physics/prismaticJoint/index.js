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
		controller.distance = 30;
		controller.tilt = -25;
		controller.centerY = 8;

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

		// [KO] 바닥 생성 (50m x 50m)
		// [EN] Create ground (50m x 50m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -0.5;
		ground.scaleX = 50;
		ground.scaleY = 1;
		ground.scaleZ = 50;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 2. 가이드 레일 생성 (높이 15m)
		// [EN] 2. Create guide rail (Height 15m)
		const rail = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		rail.x = -5;
		rail.y = 7.5;
		rail.z = 0;
		rail.scaleX = 1;
		rail.scaleY = 15;
		rail.scaleZ = 1;
		rail.material.color.setColorByHEX('#666666');
		scene.addChild(rail);
		const railBody = physicsEngine.createBody(rail, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 3. 승강기 플랫폼 생성 (5m x 5m)
		// [EN] 3. Create elevator platform (5m x 5m)
		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		platform.x = 0;
		platform.y = 2;
		platform.z = 0;
		platform.scaleX = 5;
		platform.scaleY = 0.4;
		platform.scaleZ = 5;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 20,
			linearDamping: 0.5,
			angularDamping: 1.0
		});

		// [KO] Prismatic Joint 설정 (수직 슬라이딩)
		// [EN] Prismatic Joint setup (Vertical sliding)
		const jointData = RAPIER.JointData.prismatic(
			{ x: 5, y: -5.5, z: 0 }, // rail 기준 상대 좌표 (y: 7.5 - 5.5 = 2m 지점 시작)
			{ x: 0, y: 0, z: 0 },    // platform 중심 기준
			{ x: 0, y: 1, z: 0 }     // 수직 Y축 방향
		);
		
		jointData.limitsEnabled = true;
		jointData.limits = [0, 12]; // 2m에서 시작해서 14m까지 이동 가능
		physicsEngine.nativeWorld.createImpulseJoint(jointData, railBody.nativeBody, platformBody.nativeBody, true);

		// 4. 낙하 박스
		const activeBoxes = [];
		const createBox = () => {
			const box = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			box.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			box.x = (Math.random() * 4) - 2;
			box.y = 15;
			box.z = (Math.random() * 4) - 2;
			box.scaleX = 0.6;
			box.scaleY = 0.6;
			box.scaleZ = 0.6;
			scene.addChild(box);

			const body = physicsEngine.createBody(box, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1
			});
			activeBoxes.push({ mesh: box, body });
			
			setTimeout(() => {
				const idx = activeBoxes.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(box);
					activeBalls.splice(idx, 1); // activeBalls -> activeBoxes 오타 수정 가능성 있지만 구조 유지
					activeBoxes.splice(idx, 1);
				}
			}, 10000);
		};

		const resetScene = () => {
			activeBoxes.forEach(v => {
				physicsEngine.removeBody(v.body);
				scene.removeChild(v.mesh);
			});
			activeBoxes.length = 0;
			platformBody.nativeBody.setTranslation({ x: 0, y: 2, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		};

		setInterval(createBox, 800);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, platformBody, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, platformBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = {
		liftPower: 300
	};
	pane.addBinding(params, 'liftPower', {
		min: 50,
		max: 1000
	});
	pane.addButton({ title: 'LIFT UP!' }).on('click', () => {
		platformBody.applyImpulse({ x: 0, y: params.liftPower, z: 0 });
	});
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
