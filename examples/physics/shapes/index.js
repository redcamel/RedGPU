import * as RedGPU from "../../../dist/index.js?t=1770634235177";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770634235177";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Physics Shapes 예제
 * [EN] Physics Shapes example
 *
 * [KO] 다양한 물리 형상(Box, Sphere, Cylinder, Capsule)을 생성하고 시뮬레이션하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create and simulate various physics shapes (Box, Sphere, Cylinder, Capsule).
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -35;
		controller.pan = 45;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 정적 환경 구축 (50m 바닥 및 경사로)
		// [EN] Build static environment (50m floor and ramp)
		const createStaticBox = (x, y, z, w, h, d, color = '#444444', rx = 0, rz = 0) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(color);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.scaleX = w;
			mesh.scaleY = h;
			mesh.scaleZ = d;
			mesh.rotationX = rx;
			mesh.rotationZ = rz;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				friction: 0.8
			});
		};

		createStaticBox(0, -0.5, 0, 50, 1, 50, '#444444');
		createStaticBox(-12, 6, 0, 20, 1, 25, '#666666', 0, -25);

		const activeObjects = [];

		/**
		 * [KO] 다양한 형상의 물리 객체 생성 함수 (현실적인 1~2m 스케일)
		 * [EN] Helper function to create various shaped physics objects (realistic 1-2m scale)
		 * @param {string} type
		 * @param {number} x
		 * @param {number} y
		 * @param {number} z
		 * @param {string} color
		 * @param {number} restitution
		 * @param {number} friction
		 */
		const createPhysicalObject = (type, x, y, z, color, restitution = 0.5, friction = 0.5) => {
			let geometry, shape;
			switch (type) {
				case 'box':
					geometry = new RedGPU.Primitive.Box(redGPUContext);
					shape = RedGPU.Physics.PHYSICS_SHAPE.BOX;
					break;
				case 'sphere':
					geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
					shape = RedGPU.Physics.PHYSICS_SHAPE.SPHERE;
					break;
				case 'cylinder':
					geometry = new RedGPU.Primitive.Cylinder(redGPUContext, 0.5, 0.5, 1.5);
					shape = RedGPU.Physics.PHYSICS_SHAPE.CYLINDER;
					break;
				case 'capsule':
					geometry = new RedGPU.Primitive.Capsule(redGPUContext, 0.5, 1);
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
			boxMesh.x = x;
			boxMesh.y = y;
			boxMesh.z = z;
			scene.addChild(boxMesh);

			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: shape,
				mass: 1,
				restitution,
				friction
			});
			
			activeObjects.push({ mesh: boxMesh, body });
		};

		// [KO] 초기 씬 구성
		// [EN] Initial scene configuration
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
			initScene();
		};

		initScene();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene, createPhysicalObject);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetScene
 * @param {function} createPhysicalObject
 */
const renderTestPane = async (redGPUContext, resetScene, createPhysicalObject) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770634235177');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770634235177");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = {
		type: 'sphere',
		color: '#ffffff',
		restitution: 0.6,
		friction: 0.4
	};

	const folder = pane.addFolder({ title: 'Spawn Object' });
	folder.addBinding(params, 'type', {
		options: {
			Box: 'box',
			Sphere: 'sphere',
			Cylinder: 'cylinder',
			Capsule: 'capsule'
		}
	});
	folder.addBinding(params, 'color');
	folder.addButton({ title: 'Spawn' }).on('click', () => {
		createPhysicalObject(
			params.type,
			-18 + (Math.random() * 4),
			20,
			(Math.random() * 10) - 5,
			params.color,
			params.restitution,
			params.friction
		);
	});

	pane.addButton({ title: 'Spawn Random' }).on('click', () => {
		const types = ['box', 'sphere', 'cylinder', 'capsule'];
		const randomType = types[Math.floor(Math.random() * types.length)];
		const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
		createPhysicalObject(
			randomType,
			-18 + (Math.random() * 4),
			20,
			(Math.random() * 10) - 5,
			randomColor,
			params.restitution,
			params.friction
		);
	});

	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
