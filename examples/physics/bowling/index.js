import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 현실적인 스케일에 맞춰 거리 단축
		// [EN] Camera setup: Shorten distance for realistic scale
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -25;
		controller.pan = 0;
		controller.centerZ = -5;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화: 기본 중력(-9.81) 사용
		// [EN] Initialize physics engine (Rapier): Using default gravity (-9.81)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 레인 생성 (현실적인 볼링 레인 길이 약 18m)
		// [EN] Create lane (Realistic bowling lane length approx. 18m)
		const laneMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		laneMat.color.setColorByHEX('#444444');
		laneMat.shininess = 64;

		const laneMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 1.5, 25),
			laneMat
		);
		laneMesh.z = -8;
		scene.addChild(laneMesh);
		physicsEngine.createBody(laneMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			friction: 0.05
		});

		const activePins = [];
		const activeBalls = [];

		// [KO] 핀 지오메트리 (높이 약 38cm)
		// [EN] Pin geometry (height approx. 38cm)
		const pinGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.06, 0.08, 0.38);
		const pinMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		pinMat.color.setColorByHEX('#ffffff');

		/**
		 * [KO] 볼링 핀 스폰 함수
		 * [EN] Function to spawn bowling pins
		 */
		const spawnPins = () => {
			const rows = 4;
			const spacingX = 0.3;
			const spacingZ = 0.3;
			const offsetZ = -15;

			for (let row = 0; row < rows; row++) {
				const z = offsetZ - row * spacingZ;
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
					pinMesh.y = 0.2;
					pinMesh.z = z;
					scene.addChild(pinMesh);
					const body = physicsEngine.createBody(pinMesh, {
						type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
						shape: RedGPU.Physics.PHYSICS_SHAPE.CYLINDER,
						mass: 1.5,
						friction: 0.1
					});
					activePins.push({ mesh: pinMesh, body });
				}
			}
		};

		/**
		 * [KO] 게임 리셋 함수
		 * [EN] Game reset function
		 */
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
		 * [KO] 볼링공 투구 함수 (현실적인 공 크기 약 22cm)
		 * [EN] Function to throw a bowling ball (Realistic ball size approx. 22cm)
		 */
		const throwBall = (power) => {
			const ballMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.11),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			ballMesh.material.color.setColorByHEX('#ff4444');
			ballMesh.y = 0.11;
			ballMesh.z = 2;
			scene.addChild(ballMesh);

			const ballBody = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 7, // 약 15파운드 질량
				restitution: 0.1,
				friction: 0.5,
				enableCCD: true 
			});

			ballBody.applyImpulse({
				x: (Math.random() * 0.5) - 0.25,
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
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 */
const renderTestPane = async (redGPUContext, throwBall, resetGame) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	const params = {
		power: 150
	};

	pane.addBinding(params, 'power', {
		min: 50,
		max: 500
	});
	pane.addButton({ title: 'THROW BALL!' }).on('click', () => throwBall(params.power));
	pane.addButton({ title: 'Reset Game' }).on('click', () => resetGame());
};
