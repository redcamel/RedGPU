import * as RedGPU from "../../../dist/index.js?t=1770713934910";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Bowling 예제
 * [EN] Bowling example
 *
 * [KO] 물리 엔진을 사용하여 볼링 시뮬레이션을 구현합니다.
 * [EN] Implements a bowling simulation using the physics engine.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 실제 규격 레인을 한눈에 볼 수 있도록 조정
		// [EN] Camera setup: Adjusted to see the real specification lane at a glance
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -25;
		controller.pan = 0;
		controller.centerZ = -10;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 설정: 그리드 활성화 (미터 단위 확인용)
		// [EN] 3D view setup: Enable grid (for verifying meter units)
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화: 기본 중력(-9.81) 사용
		// [EN] Initialize physics engine: Using default gravity (-9.81)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 메시 생성
		const floorMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 60, 60),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		floorMesh.material.color.setColorByHEX('#666666');
		floorMesh.y = -0.1;
		scene.addChild(floorMesh);

		// [KO] 볼링 레인 생성 (실제 규격: 너비 1.05m, 길이 약 22m)
		// [EN] Create bowling lane (Real Specs: Width 1.05m, Length approx. 22m)
		const laneMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		laneMat.color.setColorByHEX('#886644');
		laneMat.shininess = 128;

		const laneMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 1.05, 22),
			laneMat
		);
		laneMesh.z = -9; // 파울 라인부터 핀 뒤쪽 공간까지 커버
		scene.addChild(laneMesh);
		physicsEngine.createBody(laneMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			friction: 0.02,
			restitution: 0.1
		});

		const activePins = [];
		const activeBalls = [];

		// [KO] 실제 핀 규격 (지름 12.1cm, 높이 38.1cm)
		// [EN] Real pin specs (Diameter 12.1cm, Height 38.1cm)
		const pinGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.06, 0.06, 0.38);
		const pinMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		pinMat.color.setColorByHEX('#ffffff');

		/**
		 * [KO] 볼링 핀 스폰 (실제 규격: 파울 라인으로부터 18.288m 지점에 1번 핀 배치)
		 * [EN] Spawn pins (Real Specs: Place Pin #1 at 18.288m from the foul line)
		 */
		const spawnPins = () => {
			const rows = 4;
			const spacingX = 0.3048; // 12인치 간격
			const spacingZ = 0.264;  // 정삼각형 배치를 위한 Z 간격
			const headPinZ = -18.288; // [KO] 실제 규격 거리 [EN] Real specification distance

			for (let row = 0; row < rows; row++) {
				const z = headPinZ - row * spacingZ;
				const cols = row + 1;
				const startX = -(cols - 1) * spacingX / 2;

				for (let col = 0; col < cols; col++) {
					const x = startX + col * spacingX;
					const pinMesh = new RedGPU.Display.Mesh(
						redGPUContext,
						pinGeo,
						pinMat
					);
					pinMesh.x = x;
					pinMesh.y = 0.19;
					pinMesh.z = z;
					scene.addChild(pinMesh);
					
					const body = physicsEngine.createBody(pinMesh, {
						type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
						shape: RedGPU.Physics.PHYSICS_SHAPE.CYLINDER,
						mass: 1.5,
						friction: 0.1,
						restitution: 0.5
					});
					activePins.push({ mesh: pinMesh, body });
				}
			}
		};

		const resetGame = () => {
			activePins.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activePins.length = 0;
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
			spawnPins();
		};

		spawnPins();

		/**
		 * [KO] 볼링공 투구 (실제 규격: 지름 21.8cm, 무게 약 7kg)
		 * [EN] Throwing bowling ball (Real Specs: Diameter 21.8cm, Weight approx. 7kg)
		 * @param {number} power
		 * @param {number} aim
		 */
		const throwBall = (power, aim) => {
			const ballMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.109), // 반경 10.9cm
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			ballMesh.material.color.setColorByHEX('#ff4444');
			ballMesh.x = aim * 0.3;
			ballMesh.y = 0.109;
			ballMesh.z = 1; // 파울 라인 근처에서 투구
			scene.addChild(ballMesh);

			const ballBody = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 7, 
				restitution: 0.1,
				friction: 0.05,
				enableCCD: true 
			});

			const spread = (Math.random() * 0.1) - 0.05;
			ballBody.applyImpulse({
				x: (aim * 2) + spread,
				y: 0,
				z: -power
			});
			activeBalls.push({ mesh: ballMesh, body: ballBody });
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, throwBall, resetGame);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} throwBall
 * @param {function} resetGame
 */
const renderTestPane = async (redGPUContext, throwBall, resetGame) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	const params = {
		power: 180, // [KO] 늘어난 거리에 맞춰 기본 파워 상향 [EN] Increased default power for the longer distance
		aim: 0.0
	};

	pane.addBinding(params, 'power', { min: 100, max: 500 });
	pane.addBinding(params, 'aim', { min: -1.0, max: 1.0 });
	
	pane.addButton({ title: 'THROW BALL!' }).on('click', () => throwBall(params.power, params.aim));
	pane.addButton({ title: 'Reset Game' }).on('click', () => resetGame());
};
