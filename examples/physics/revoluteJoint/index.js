import * as RedGPU from "../../../dist/index.js?t=1770713934910";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Revolute Joint 예제
 * [EN] Revolute Joint example
 *
 * [KO] 회전 조인트와 모터를 사용하여 풍차를 시뮬레이션하는 예제입니다.
 * [EN] Example of simulating a windmill using revolute joints and motors.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -25;
		controller.centerY = 3;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정 (그리드 활성화)
		// [EN] Create and configure 3D view (Grid enabled)
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 1. 바닥 생성 (40m x 40m)
		// [EN] 1. Create ground (40m x 40m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -0.5;
		ground.scaleX = 40;
		ground.scaleY = 1;
		ground.scaleZ = 40;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 2. 풍차 기둥 생성
		// [EN] 2. Create windmill pillar
		const pillar = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		pillar.y = 2.5;
		pillar.scaleX = 0.4;
		pillar.scaleY = 5;
		pillar.scaleZ = 0.4;
		pillar.material.color.setColorByHEX('#888888');
		scene.addChild(pillar);
		
		// [KO] pillarBody 변수를 캡처하여 이후 조인트 생성에 사용합니다.
		// [EN] Capture the pillarBody variable for use in joint creation later.
		const pillarBody = physicsEngine.createBody(pillar, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 3. 프로펠러 뭉치 생성 (회전할 동적 객체)
		// [EN] 3. Create propeller group (Dynamic object to rotate)
		const propellerGroup = new RedGPU.Display.Mesh(
			redGPUContext,
			null,
			null
		);
		propellerGroup.y = 4.5;
		propellerGroup.z = 0.4;
		scene.addChild(propellerGroup);

		const hub = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Cylinder(redGPUContext, 0.3, 0.3, 0.4),
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
			blade.scaleX = 4.0;
			blade.scaleY = 0.3;
			blade.scaleZ = 0.05;
			const angleRad = (i * 90) * (Math.PI / 180);
			blade.x = Math.cos(angleRad) * 2.0;
			blade.y = Math.sin(angleRad) * 2.0;
			blade.rotationZ = i * 90;
			blade.material.color.setColorByHEX('#ffcc00');
			propellerGroup.addChild(blade);
		}

		// [KO] 프로펠러 물리 바디 생성 및 저항(Damping) 설정
		// [EN] Create propeller physics body and configure damping
		const fanBody = physicsEngine.createBody(propellerGroup, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			mass: 5,
			// [KO] linearDamping: 이동 저항 (공기 저항과 유사, 직선 운동을 서서히 멈추게 함)
			// [EN] linearDamping: Positional resistance (Similar to air resistance, slows down linear movement)
			linearDamping: 0.1,
			// [KO] angularDamping: 회전 저항 (축의 마찰과 유사, 회전 운동을 서서히 멈추게 함)
			// [EN] angularDamping: Rotational resistance (Similar to axle friction, slows down spinning)
			angularDamping: 0.1
		});

		// [KO] 회전 조인트(Revolute Joint) 생성: 특정 축(Z)을 기준으로 회전하는 관절
		// [EN] Create Revolute Joint: A joint that rotates around a specific axis (Z)
		const jointData = RAPIER.JointData.revolute(
			{ x: 0, y: 2.0, z: 0.4 }, 
			{ x: 0, y: 0, z: 0 },     
			{ x: 0, y: 0, z: 1 }      
		);
		const joint = physicsEngine.nativeWorld.createImpulseJoint(jointData, pillarBody.nativeBody, fanBody.nativeBody, true);
		
		/**
		 * [KO] 조인트 모터 설정 (configureMotorVelocity)
		 * 첫 번째 인자(3.0): 목표 각속도 (초당 라디안). 회전의 빠르기와 방향을 결정합니다.
		 * 두 번째 인자(500.0): 최대 힘 (토크). 목표 속도를 유지하기 위해 낼 수 있는 최대 파워입니다.
		 * [EN] Joint Motor Configuration (configureMotorVelocity)
		 * 1st Arg (3.0): Target angular velocity (rad/s). Determines speed and direction.
		 * 2nd Arg (500.0): Max force (torque). The limit of power to maintain the target speed.
		 */
		joint.configureMotorVelocity(3.0, 500.0);

		// 4. 상호작용용 낙하 공
		const activeBalls = [];
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const ball = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.25),
				material
			);
			ball.x = (Math.random() * 4) - 2;
			ball.y = 10;
			ball.z = 0.4;
			scene.addChild(ball);
			const body = physicsEngine.createBody(ball, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});
			body.velocity = { x: 0, y: -5, z: 0 };
			activeBalls.push({ mesh: ball, body });
			
			setTimeout(() => {
				const idx = activeBalls.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ball);
					activeBalls.splice(idx, 1);
				}
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(v => {
				physicsEngine.removeBody(v.body);
				scene.removeChild(v.mesh);
			});
			activeBalls.length = 0;
		};

		setInterval(createBall, 800);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, joint, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {object} joint
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, joint, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	const params = {
		motorVelocity: 3.0
	};

	pane.addBinding(params, 'motorVelocity', {
		min: -15,
		max: 15
	}).on('change', (ev) => {
		// [KO] 실시간으로 모터 속도 변경 (최대 힘은 500 유지)
		// [EN] Change motor velocity in real-time (Maintain max force at 500)
		joint.configureMotorVelocity(ev.value, 500.0);
	});

	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};