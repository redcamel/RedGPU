import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Triggers 예제
 * [EN] Triggers example
 *
 * [KO] 물리 트리거(Trigger)를 사용하여 물체의 진입을 감지하는 방법을 보여줍니다.
 * [EN] Demonstrates how to detect object entry using a physics trigger.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정: 환경광과 방향광
		// [EN] Lighting setup: Ambient and Directional lights
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 메시 생성 및 정적(Static) 물리 바디 적용
		// [EN] Create ground mesh and apply Static physics body
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

		// [KO] 1. 센서 구역 (Trigger Zone) 생성
		// [EN] 1. Create a Sensor area (Trigger Zone)
		const triggerMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		triggerMesh.material.color.setColorByHEX('#44ff44');
		triggerMesh.material.opacity = 0.3;
		triggerMesh.material.transparent = true;
		triggerMesh.y = 5;
		triggerMesh.scaleX = 10;
		triggerMesh.scaleY = 2;
		triggerMesh.scaleZ = 10;
		
		// [KO] 물리 바디 생성 전에 씬에 추가하여 정확한 월드 좌표를 계산하게 합니다.
		// [EN] Add to the scene before creating the physics body to ensure correct world coordinate calculation.
		scene.addChild(triggerMesh);

		const triggerBody = physicsEngine.createBody(triggerMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			isSensor: true
		});
		
		// [KO] 센서의 충돌 이벤트 발생을 활성화합니다.
		// [EN] Enable collision event reporting for the sensor.
		triggerBody.nativeCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

		// [KO] 동적 객체들 관리
		// [EN] Manage dynamic objects
		const activeBalls = [];

		/**
		 * [KO] 새로운 구슬을 생성하는 함수
		 * [EN] Function to create a new ball
		 */
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

			// [KO] 구슬의 충돌 이벤트를 활성화합니다. (센서와의 충돌 감지용)
			// [EN] Enable collision event reporting for the ball. (For detecting collision with the sensor)
			body.nativeCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
			
			const ballInfo = { mesh: ballMesh, body };
			activeBalls.push(ballInfo);

			// [KO] 성능을 위해 10초 후 구슬 제거
			// [EN] Remove ball after 10 seconds for performance
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ballMesh);
					activeBalls.splice(idx, 1);
				}
			}, 10000);
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		// [KO] 구슬 자동 스폰
		// [EN] Auto-spawn balls
		setInterval(createBall, 1000);

		/**
		 * [KO] 물리 엔진 충돌 시작 콜백
		 * [EN] Physics engine collision started callback
		 */
		physicsEngine.onCollisionStarted = (h1, h2) => {
			const triggerHandle = triggerBody.nativeCollider.handle;
			// [KO] 충돌한 두 물체 중 하나가 센서(trigger)인지 확인하고, 상대방 물체를 찾습니다.
			// [EN] Check if one of the colliding objects is the sensor (trigger) and find the other object.
			const ballHandle = (h1 === triggerHandle) ? h2 : (h2 === triggerHandle ? h1 : null);
			
			if (ballHandle !== null) {
				const ballBody = physicsEngine.getBodyByColliderHandle(ballHandle);
				if (ballBody?.mesh) {
					ballBody.mesh.material.color.setColorByHEX('#ff44ff');
				}
			}
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, scene, triggerMesh, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {RedGPU.Display.Mesh} triggerMesh
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, scene, triggerMesh, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	const params = {
		showSensor: !!triggerMesh.parent
	};

	// [KO] 센서 영역 가시성 제어 (addChild/removeChild 사용)
	// [EN] Control sensor area visibility (using addChild/removeChild)
	pane.addBinding(params, 'showSensor', {
		label: 'Show Sensor Mesh'
	}).on('change', (ev) => {
		if (ev.value) {
			scene.addChild(triggerMesh);
		} else {
			scene.removeChild(triggerMesh);
		}
	});

	pane.addBlade({
		view: 'text',
		label: 'Info',
		value: 'Green box is a Sensor!',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};
