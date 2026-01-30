import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성 및 정적 물리 바디 적용
		// [EN] Create ground and apply static physics body
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 15, 15),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			restitution: 0.8
		});

		const activeObjects = [];

		/**
		 * [KO] 새로운 구슬을 생성하고 충돌 이벤트를 활성화합니다.
		 * [EN] Create a new ball and enable collision events.
		 */
		const createBall = (x, y, z) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 1),
				material
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.9
			});

			// [KO] 물리 엔진이 이 충돌체의 이벤트를 보고하도록 상수를 사용하여 설정합니다.
			// [EN] Configure the physics engine to report events for this collider using a constant.
			body.nativeCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

			activeObjects.push({ mesh, body });
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			createBall(0, 10, 0);
		};

		// [KO] 초기 구슬 생성
		// [EN] Create initial ball
		createBall(0, 10, 0);

		/**
		 * [KO] 충돌 시작 시 호출되는 콜백 함수
		 * [EN] Callback function called when a collision starts
		 * @param h1 - [KO] 첫 번째 충돌체 핸들 [EN] First collider handle
		 * @param h2 - [KO] 두 번째 충돌체 핸들 [EN] Second collider handle
		 */
		physicsEngine.onCollisionStarted = (h1, h2) => {
			// [KO] 엔진의 getBodyByColliderHandle를 사용하여 직접 바디와 메쉬에 접근합니다.
			// [EN] Directly access the body and mesh using the engine's getBodyByColliderHandle.
			const body1 = physicsEngine.getBodyByColliderHandle(h1);
			const body2 = physicsEngine.getBodyByColliderHandle(h2);
			
			if (body1?.mesh) body1.mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			if (body2?.mesh) body2.mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, createBall, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 */
const renderTestPane = async (redGPUContext, createBall, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Ball' }).on('click', () => createBall((Math.random() * 4) - 2, 15, (Math.random() * 4) - 2));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};