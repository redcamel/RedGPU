import * as RedGPU from "../../../dist/index.js?t=1770634235177";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770634235177";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Physics Basic 예제
 * [EN] Physics Basic example
 *
 * [KO] 기본적인 물리 엔진 설정과 객체 상호작용을 보여줍니다.
 * [EN] Demonstrates basic physics engine setup and object interaction.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 현실적인 스케일에 맞춰 거리 조정
		// [EN] Set up camera controller: Adjust distance for realistic scale
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
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

		// [KO] 바닥 메시 생성 (20m x 20m) 및 정적 물리 바디 적용
		// [EN] Create ground mesh (20m x 20m) and apply static physics body
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

		const activeBoxes = [];
		let currentGravityY = -9.81;

		/**
		 * [KO] 1m 정육면체 박스 생성 함수
		 * [EN] Function to create a 1m cubic box
		 * @param {number} x
		 * @param {number} y
		 * @param {number} z
		 * @param {string} color
		 */
		const createBox = (x, y, z, color) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(color);
			const boxMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				material
			);
			boxMesh.x = x;
			boxMesh.y = y;
			boxMesh.z = z;
			boxMesh.rotationX = Math.random() * 360;
			boxMesh.rotationY = Math.random() * 360;
			scene.addChild(boxMesh);

			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				restitution: 0.5
			});
			activeBoxes.push({ mesh: boxMesh, body });
		};

		// [KO] 초기 박스 스폰 로직
		// [EN] Initial box spawn logic
		const initBoxes = () => {
			const baseY = currentGravityY < 0 ? 8 : -8;
			for (let i = 0; i < 5; i++) {
				const y = baseY + (currentGravityY < 0 ? i * 2 : -i * 2);
				createBox(
					Math.random() * 4 - 2,
					y,
					Math.random() * 4 - 2,
					`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
				);
			}
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeBoxes.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBoxes.length = 0;
			initBoxes();
		};

		initBoxes();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, physicsEngine, createBox, resetScene, (v) => currentGravityY = v);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RapierPhysics} physicsEngine
 * @param {function} createBox
 * @param {function} resetScene
 * @param {function} updateGravityY
 */
const renderTestPane = async (redGPUContext, physicsEngine, createBox, resetScene, updateGravityY) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770634235177');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770634235177");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	const params = {
		gravityY: -9.81,
		addBox: () => {
			const y = params.gravityY < 0 ? 8 : -8;
			createBox(
				Math.random() * 4 - 2,
				y,
				Math.random() * 4 - 2,
				`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
			);
		}
	};

	pane.addBinding(params, 'gravityY', {
		min: -30,
		max: 30
	}).on('change', (ev) => {
		physicsEngine.gravity = { x: 0, y: ev.value, z: 0 };
		updateGravityY(ev.value);
	});
	pane.addButton({ title: 'Add Box' }).on('click', () => params.addBox());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};