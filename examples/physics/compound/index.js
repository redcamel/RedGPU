import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 물체 크기에 맞춰 거리를 15로 조정
		// [EN] Set up camera controller: Adjust distance to 15 to match object size
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -30;

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

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성
		// [EN] Create ground
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 20, 20),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			friction: 1.0,
			restitution: 0.1
		});

		const activeDumbbells = [];

		/**
		 * [KO] 아령 생성 함수: 현실적인 크기(전체 약 1.5m)로 설정
		 * [EN] Function to create a dumbbell: Set to realistic size (approx. 1.5m total)
		 */
		const createDumbbell = (x, y, z) => {
			// [KO] 1. 부모 메시(실린더) 생성: 반지름 0.05, 높이 1.0 (현실적인 손잡이 크기)
			// [EN] 1. Create parent mesh (Cylinder): radius 0.05, height 1.0 (realistic handle size)
			const dumbbellGroup = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Cylinder(redGPUContext, 0.05, 0.05, 1.0),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			dumbbellGroup.material.color.setColorByHEX('#aaaaaa');
			dumbbellGroup.x = x;
			dumbbellGroup.y = y;
			dumbbellGroup.z = z;
			
			// [KO] 스폰 시 랜덤 회전 적용
			// [EN] Apply random rotation upon spawn
			dumbbellGroup.rotationX = Math.random() * 360;
			dumbbellGroup.rotationY = Math.random() * 360;
			dumbbellGroup.rotationZ = Math.random() * 360;
			scene.addChild(dumbbellGroup);

			// [KO] 2. 자식 메시(추) 생성: 반지름 0.25 (현실적인 원판 크기)
			// [EN] 2. Create child meshes (Weights): radius 0.25 (realistic plate size)
			const weightGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.25);
			const weightMat = new RedGPU.Material.PhongMaterial(redGPUContext);
			weightMat.color.setColorByHEX('#ff4444');

			const leftWeight = new RedGPU.Display.Mesh(
				redGPUContext,
				weightGeo,
				weightMat
			);
			leftWeight.y = 0.5;
			dumbbellGroup.addChild(leftWeight);

			const rightWeight = new RedGPU.Display.Mesh(
				redGPUContext,
				weightGeo,
				weightMat
			);
			rightWeight.y = -0.5;
			dumbbellGroup.addChild(rightWeight);

			/**
			 * [KO] 3. 물리 바디 생성: 작아진 크기에 맞춰 질량 조정
			 * [EN] 3. Create physics body: Adjust mass to match the smaller size
			 */
			const body = physicsEngine.createBody(dumbbellGroup, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				mass: 5,             // [KO] 크기에 적합한 질량 [EN] Appropriate mass for size
				restitution: 0.1,    // [KO] 반발력 최소화 [EN] Minimize bounciness
				friction: 1.0,       // [KO] 최대 마찰력 [EN] Maximum friction
				linearDamping: 0.0,  // [KO] 현실 중력 가속도를 위해 저항 제거 [EN] Remove damping for real gravity acceleration
				angularDamping: 0.1
			});
			activeDumbbells.push({ mesh: dumbbellGroup, body });
		};

		// [KO] 초기 아령 씬 구성: 스폰 높이를 5~15 사이로 조절
		// [EN] Initial dumbbell scene configuration: Adjust spawn height between 5 and 15
		const initScene = () => {
			for (let i = 0; i < 5; i++) {
				createDumbbell(
					(Math.random() * 6) - 3,
					5 + (i * 2),
					(Math.random() * 6) - 3
				);
			}
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeDumbbells.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeDumbbells.length = 0;
			initScene();
		};

		initScene();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, createDumbbell, resetScene, activeDumbbells);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 */
const renderTestPane = async (redGPUContext, createDumbbell, resetScene, activeDumbbells) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	// [KO] 모든 아령 밀어내기
	// [EN] Push all dumbbells
	pane.addButton({ title: 'Push All Dumbbells' }).on('click', () => {
		activeDumbbells.forEach(item => {
			item.body.applyImpulse({
				x: (Math.random() * 100) - 50,
				y: 50,
				z: (Math.random() * 100) - 50
			});
		});
	});

	// [KO] 아령 하나 추가 생성
	// [EN] Add one more dumbbell
	pane.addButton({ title: 'Spawn Dumbbell' }).on('click', () => {
		createDumbbell(
			(Math.random() * 4) - 2,
			10,
			(Math.random() * 4) - 2
		);
	});

	// [KO] 씬 초기화 버튼
	// [EN] Scene reset button
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
