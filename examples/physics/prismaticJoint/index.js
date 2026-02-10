import * as RedGPU from "../../../dist/index.js?t=1770699661827";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770699661827";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Prismatic Joint 예제
 * [EN] Prismatic Joint example
 *
 * [KO] 프리즈매틱 조인트를 사용하여 직선 운동을 제한하는 방법을 보여줍니다.
 * [EN] Demonstrates how to use a prismatic joint to constrain linear motion.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -25;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();

		/**
		 * [KO] 3D 뷰 설정: 그리드 활성화
		 * RedGPU의 기본 그리드는 한 칸의 가로/세로 길이가 정확히 1유닛(1미터)입니다.
		 * [EN] 3D view setup: Enable grid
		 * RedGPU's default grid has a width/height of exactly 1 unit (1 meter) per cell.
		 */
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

		// [KO] 1. 바닥 생성 (현실적인 미터 단위 스케일)
		// [EN] 1. Create ground (Realistic meter scale)
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

		/**
		 * [KO] 2. 가이드 레일 생성
		 * 그리드 눈금과 일치시키기 위해 x = -2.0 위치에 배치합니다.
		 * [EN] 2. Create guide rail
		 * Positioned at x = -2.0 to align with the grid lines.
		 */
		const rail = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		rail.x = -2.0;
		rail.y = 5;
		rail.z = 0;
		rail.scaleX = 0.2;
		rail.scaleY = 10;
		rail.scaleZ = 0.2;
		rail.material.color.setColorByHEX('#888888');
		scene.addChild(rail);
		const railBody = physicsEngine.createBody(rail, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		/**
		 * [KO] 3. 승강기 플랫폼 생성
		 * 2m x 2m 크기로 설정하여 그리드 2칸을 정확히 차지하게 합니다.
		 * [EN] 3. Create elevator platform
		 * Set to 2m x 2m size to occupy exactly 2 grid cells.
		 */
		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		platform.x = 0;
		platform.y = 1;
		platform.z = 0;
		platform.scaleX = 2.0;
		platform.scaleY = 0.2;
		platform.scaleZ = 2.0;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 10,
			linearDamping: 0.5,
			angularDamping: 1.0
		});

		/**
		 * [KO] 프리즈매틱 조인트(Prismatic Joint) 설정
		 * 특정 축(여기서는 Y축)을 따라서만 직선 이동이 가능하도록 강체를 구속합니다.
		 * anchor1: rail 기준 연결 지점 (x: 2.0m 이동하여 플랫폼 중심인 0과 연결)
		 * anchor2: platform 기준 연결 지점
		 * axis: 이동 방향 벡터 (0, 1, 0 = Y축 수직 이동)
		 * limits: 이동 가능 거리 제한 [최소, 최대]
		 * [EN] Prismatic Joint setup
		 * Constraints the rigid body to move linearly only along a specific axis (Y-axis in this case).
		 * anchor1: Connection point relative to the rail (shifted 2.0m to connect with platform center)
		 * anchor2: Connection point relative to the platform
		 * axis: Movement direction vector (0, 1, 0 = Vertical Y-axis movement)
		 * limits: Range of allowed movement [min, max]
		 */
		const jointData = RAPIER.JointData.prismatic(
			{ x: 2.0, y: -4.0, z: 0 }, 
			{ x: 0, y: 0, z: 0 },    
			{ x: 0, y: 1, z: 0 }     
		);
		
		jointData.limitsEnabled = true;
		jointData.limits = [0, 8]; // 월드 좌표 기준 1m ~ 9m 사이만 이동 가능
		physicsEngine.nativeWorld.createImpulseJoint(jointData, railBody.nativeBody, platformBody.nativeBody, true);

		// [KO] 4. 상호작용용 낙하 박스 관리
		// [EN] 4. Interaction falling boxes management
		const activeBoxes = [];
		const createBox = () => {
			const box = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			box.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			box.x = (Math.random() * 1.6) - 0.8;
			box.y = 12;
			box.z = (Math.random() * 1.6) - 0.8;
			box.scaleX = 0.4;
			box.scaleY = 0.4;
			box.scaleZ = 0.4;
			scene.addChild(box);

			const body = physicsEngine.createBody(box, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1
			});
			activeBoxes.push({ mesh: box, body });
			
			// [KO] 성능을 위해 8초 후 박스 제거
			// [EN] Remove boxes after 8 seconds for performance
			setTimeout(() => {
				const idx = activeBoxes.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(box);
					activeBoxes.splice(idx, 1);
				}
			}, 8000);
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeBoxes.forEach(v => {
				physicsEngine.removeBody(v.body);
				scene.removeChild(v.mesh);
			});
			activeBoxes.length = 0;
			// 플랫폼 위치 및 속도 초기화
			platformBody.nativeBody.setTranslation({ x: 0, y: 1, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		};

		// [KO] 박스 자동 생성 인터벌
		// [EN] Auto box spawn interval
		setInterval(createBox, 800);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, platformBody, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {object} platformBody
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, platformBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770699661827");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	const params = {
		liftPower: 150
	};

	pane.addBinding(params, 'liftPower', {
		min: 50,
		max: 500
	});

	pane.addButton({ title: 'LIFT UP!' }).on('click', () => {
		// [KO] 플랫폼에 위쪽 방향으로 충격량(Impulse) 가하기
		// [EN] Apply impulse to the platform in the upward direction
		platformBody.applyImpulse({ x: 0, y: params.liftPower, z: 0 });
	});

	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};