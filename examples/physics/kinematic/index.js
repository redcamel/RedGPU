import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

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

		// [KO] 조명 설정: 환경광과 방향광
		// [EN] Lighting setup: Ambient and Directional lights
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성 및 정적(Static) 물리 바디 적용
		// [EN] Create ground and apply Static physics body
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#333333');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 키네마틱(Kinematic) 장애물 생성: 사용자 코드에 의해 직접 애니메이션되는 물리 객체
		// [EN] Create Kinematic obstacle: A physics object directly animated by user code
		const obstacleMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		obstacleMesh.material.color.setColorByHEX('#ffcc00');
		obstacleMesh.scaleX = 15;
		obstacleMesh.scaleY = 1;
		obstacleMesh.scaleZ = 1;
		obstacleMesh.y = 1;
		scene.addChild(obstacleMesh);
		const obstacleBody = physicsEngine.createBody(obstacleMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];
		// [KO] 동적(Dynamic) 객체 생성 함수 (박스 또는 구체 랜덤)
		// [EN] Dynamic object creation function (Random Box or Sphere)
		const spawnObject = () => {
			const isBox = Math.random() > 0.5;
			const geometry = isBox 
				? new RedGPU.Primitive.Box(redGPUContext) 
				: new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
			const physicsShape = isBox 
				? RedGPU.Physics.PHYSICS_SHAPE.BOX 
				: RedGPU.Physics.PHYSICS_SHAPE.SPHERE;

			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
				material
			);
			mesh.x = Math.random() * 10 - 5;
			mesh.y = 15;
			mesh.z = Math.random() * 10 - 5;
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: physicsShape,
				mass: 1,
				restitution: 0.5
			});
			activeObjects.push({mesh, body});
		};

		// [KO] 씬 초기화 함수
		// [EN] Scene reset function
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		setInterval(spawnObject, 500);

		const renderer = new RedGPU.Renderer();
		// [KO] 매 프레임 실행될 렌더링 루프
		// [EN] Rendering loop to be executed every frame
		const render = (time) => {
			// [KO] 키네마틱 바디의 회전을 매 프레임 업데이트
			// [EN] Update the rotation of the kinematic body every frame
			const speed = 0.001;
			const angle = time * speed;
			obstacleBody.nativeBody.setNextKinematicRotation({x: 0, y: Math.sin(angle / 2), z: 0, w: Math.cos(angle / 2)});
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setDebugButtons} = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({title: 'Reset Scene'}).on('click', () => resetScene());
};