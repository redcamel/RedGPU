import * as RedGPU from "../../../dist/index.js?t=1770635178902";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770635178902";

const canvas = document.body.appendChild(document.createElement('canvas'));

/**
 * [KO] Stress Test 예제
 * [EN] Stress Test example
 *
 * [KO] 수천 개의 물리 객체를 생성하여 물리 엔진의 성능을 테스트합니다.
 * [EN] Tests the performance of the physics engine by creating thousands of physics objects.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 수천 개의 구체가 굴러다니는 광범위한 장면을 관찰하기 위해 적절한 거리 유지
		// [EN] Camera setup: Maintain an appropriate distance to observe the extensive scene of thousands of rolling spheres
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 50;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 설정: 물리적 스케일(1유닛 = 1미터) 인지를 돕기 위해 그리드 활성화
		// [EN] 3D view setup: Enable grid to help perceive physical scale (1 unit = 1 meter)
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 조명 설정: 입체감을 강조하기 위해 방향광 추가
		// [EN] Lighting setup: Add directional light to emphasize depth and dimensionality
		scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight();
		scene.lightManager.ambientLight.intensity = 0.5;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		// [KO] 1. 대형 바닥 생성: 구체들이 넓게 퍼질 수 있도록 100m x 100m 스케일 적용
		// [EN] 1. Create a large ground: Apply 100m x 100m scale so spheres can spread out widely
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = ground.scaleZ = 100;
		ground.scaleY = 1;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];
		// [KO] 리소스 효율을 위해 1m 반지름의 기본 구체 지오메트리 공유
		// [EN] Shared base sphere geometry with 1m radius for resource efficiency
		const baseBallGeo = new RedGPU.Primitive.Sphere(redGPUContext, 1);

		/**
		 * [KO] 다양한 크기의 구체 생성 함수
		 * 각 구체는 고유의 크기와 재질을 가지며, 부피에 비례하는 질량을 할당받습니다.
		 * [EN] Variously sized sphere creation function
		 * Each sphere has its own unique size and material, assigned a mass proportional to its volume.
		 */
		const createBall = () => {
			// [KO] 반지름 결정 (0.1m ~ 0.6m)
			// [EN] Radius determination (0.1m to 0.6m)
			const radius = 0.1 + Math.random() * 0.5;
			
			// [KO] 개별 재질 생성: 각 객체의 고유 색상을 유지하고 깜박임을 방지합니다.
			// [EN] Create individual material: Maintains each object's unique color and prevents flickering.
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			
			const mesh = new RedGPU.Display.Mesh(redGPUContext, baseBallGeo, material);
			mesh.x = (Math.random() * 20) - 10;
			mesh.y = 20 + (Math.random() * 10);
			mesh.z = (Math.random() * 20) - 10;
			
			// [KO] 메쉬 스케일을 결정된 반지름에 맞게 조절
			// [EN] Adjust mesh scale to match the determined radius
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = radius;
			scene.addChild(mesh);

			/**
			 * [KO] 물리 바디 생성
			 * 질량을 크기에 비례하게 설정(radius * 10)하여 무거운 구체가 가벼운 구체를 쳐내도록 유도합니다.
			 * 구체는 상자보다 휴면(Sleep) 상태 진입이 까다로워 엔진 성능 테스트에 더욱 효과적입니다.
			 * [EN] Create physics body
			 * Set mass proportional to size (radius * 10), causing heavy spheres to push lighter ones.
			 * Spheres are harder to enter the Sleep state than boxes, making them more effective for engine stress testing.
			 */
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: radius * 10,
				restitution: 0.4,
				friction: 0.3
			});
			activeObjects.push({ mesh, body });
		};

		/**
		 * [KO] 씬 초기화 함수: 현재 시뮬레이션 중인 모든 객체 제거
		 * [EN] Scene reset function: Remove all objects currently being simulated
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext, createBall, resetScene, activeObjects);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} createBall
 * @param {function} resetScene
 * @param {Array<object>} activeObjects
 */
const renderTestPane = async (redGPUContext, createBall, resetScene, activeObjects) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770635178902");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	const params = {
		spawnRate: 5,    // [KO] 초당 생성 주기 [EN] Spawn interval per second
		autoSpawn: true, // [KO] 자동 생성 활성화 [EN] Enable auto-spawn
		objectCount: 0   // [KO] 현재 객체 수 [EN] Current object count
	};

	pane.addBinding(params, 'spawnRate', { min: 1, max: 50, step: 1 });
	pane.addBinding(params, 'autoSpawn');
	pane.addBinding(params, 'objectCount', { readonly: true, interval: 100 });
	
	pane.addButton({ title: 'Spawn 100 Varied Balls' }).on('click', () => {
		for (let i = 0; i < 100; i++) createBall();
	});
	
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());

	// [KO] 실시간 객체 관리 루프: 최대 2000개까지 구체 추가
	// [EN] Real-time object management loop: Adds spheres up to a maximum of 2000
	setInterval(() => {
		if (params.autoSpawn && activeObjects.length < 2000) {
			for (let i = 0; i < params.spawnRate; i++) {
				createBall();
			}
		}
		params.objectCount = activeObjects.length;
	}, 100);
};