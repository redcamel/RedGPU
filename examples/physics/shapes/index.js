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
		controller.distance = 35;
		controller.tilt = -35;
		controller.pan = 45;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
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

		// [KO] 정적 물리 객체(바닥, 경사로 등) 생성 함수
		// [EN] Helper function to create static physics objects (floor, ramp, etc.)
		const createStaticBox = (x, y, z, w, h, d, color = '#444444', rx = 0, rz = 0) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(color);
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = w; mesh.scaleY = h; mesh.scaleZ = d;
			mesh.rotationX = rx; mesh.rotationZ = rz;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				friction: 0.8
			});
		};

		// [KO] 실험실 환경 구축 (바닥 및 경사로)
		// [EN] Build laboratory environment (floor and ramp)
		createStaticBox(0, -0.5, 0, 50, 1, 50, '#444444');
		createStaticBox(-12, 6, 0, 20, 1, 25, '#666666', 0, -25);

		// [KO] 동적 물리 객체 관리 리스트
		// [EN] List to manage dynamic physics objects
		const activeObjects = [];

		// [KO] 다양한 형상의 물리 객체 생성 함수
		// [EN] Helper function to create various shaped physics objects
		const createPhysicalObject = (type, x, y, z, color, restitution = 0.5, friction = 0.5) => {
			let geometry, shape;
			switch (type) {
				case 'box':
					geometry = new RedGPU.Primitive.Box(redGPUContext);
					shape = RedGPU.Physics.PHYSICS_SHAPE.BOX;
					break;
				case 'sphere':
					geometry = new RedGPU.Primitive.Sphere(redGPUContext);
					shape = RedGPU.Physics.PHYSICS_SHAPE.SPHERE;
					break;
				case 'cylinder':
					geometry = new RedGPU.Primitive.Cylinder(redGPUContext);
					shape = RedGPU.Physics.PHYSICS_SHAPE.CYLINDER;
					break;
				case 'capsule':
					geometry = new RedGPU.Primitive.Cylinder(redGPUContext);
					shape = RedGPU.Physics.PHYSICS_SHAPE.CAPSULE;
					break;
			}
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(color);
			const boxMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
				material
			);
			boxMesh.x = x; boxMesh.y = y; boxMesh.z = z;
			scene.addChild(boxMesh);

			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: shape,
				mass: 1,
				restitution,
				friction
			});
			// [KO] 원기둥과 캡슐은 기본 방향을 조정
			// [EN] Adjust default orientation for cylinder and capsule
			if (type === 'cylinder' || type === 'capsule') body.rotation = [0, 0, 0.707, 0.707];
			activeObjects.push({ mesh: boxMesh, body });
		};

		// [KO] 초기 씬 구성: 여러 형태의 객체들을 랜덤하게 배치
		// [EN] Initial scene configuration: randomly place various objects
		const initScene = () => {
			const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
			const shapes = ['box', 'sphere', 'cylinder', 'capsule'];
			for (let i = 0; i < 12; i++) {
				createPhysicalObject(
					shapes[i % shapes.length],
					-15 - Math.random() * 5,
					15 + Math.random() * 10,
					(Math.random() * 16) - 8,
					colors[i % colors.length]
				);
			}
		};

		// [KO] 씬 초기화 함수
		// [EN] Scene reset function
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			initScene();
		};

		initScene();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene, createPhysicalObject);
	},
	(failReason) => { console.error(failReason); }
);

/**
 * [KO] 테스트용 컨트롤 패널을 생성합니다.
 * [EN] Create a control panel for testing.
 */
const renderTestPane = async (redGPUContext, resetScene, createPhysicalObject) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = { type: 'sphere', color: '#ffffff', restitution: 0.6, friction: 0.4 };

	// [KO] 개별 객체 생성 폴더
	// [EN] Folder for individual object spawning
	const folder = pane.addFolder({ title: 'Spawn Object' });
	folder.addBinding(params, 'type', { options: { Box: 'box', Sphere: 'sphere', Cylinder: 'cylinder', Capsule: 'capsule' } });
	folder.addBinding(params, 'color');
	folder.addButton({ title: 'Spawn' }).on('click', () => {
		createPhysicalObject(params.type, -18 + (Math.random() * 4), 20, (Math.random() * 10) - 5, params.color, params.restitution, params.friction);
	});

	// [KO] 랜덤 객체 생성 버튼
	// [EN] Spawn random object button
	pane.addButton({ title: 'Spawn Random' }).on('click', () => {
		const types = ['box', 'sphere', 'cylinder', 'capsule'];
		const randomType = types[Math.floor(Math.random() * types.length)];
		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
		createPhysicalObject(randomType, -18 + (Math.random() * 4), 20, (Math.random() * 10) - 5, randomColor, params.restitution, params.friction);
	});

	// [KO] 씬 초기화 버튼
	// [EN] Scene reset button
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
