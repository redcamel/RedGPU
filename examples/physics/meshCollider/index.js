import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Mesh Collider 예제
 * [EN] Mesh Collider example
 *
 * [KO] 메시 콜라이더를 사용하여 복잡한 지형과의 충돌 처리를 보여줍니다.
 * [EN] Demonstrates collision handling with complex terrain using mesh colliders.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -25;
		controller.centerY = 0;

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

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		/**
		 * [KO] 복잡한 지형 생성 함수 (정적 메쉬 콜라이더 사용)
		 * RedGPU 물리 플러그인은 PHYSICS_SHAPE.MESH 설정을 통해 
		 * 박스나 구체가 아닌 실제 메쉬의 정교한 형태 그대로 충돌 판정을 수행할 수 있게 합니다.
		 * [EN] Function to create complex terrain (using static mesh collider)
		 * The RedGPU physics plugin allows precise collision detection matching the 
		 * actual mesh shape using the PHYSICS_SHAPE.MESH setting.
		 */
		const createComplexStatic = (geometry, x, y, z, rx, color) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(color);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.rotationX = rx;
			scene.addChild(mesh);

			// [KO] 메쉬 형태를 그대로 사용하는 정적 물리 바디 생성
			// [EN] Create a static physics body using the actual mesh shape
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.MESH,
				friction: 0.5,
				restitution: 0.5
			});
		};

		// [KO] 현실적인 미터 단위 스케일로 지형 배치
		// [EN] Place terrain with realistic meter-unit scales
		createComplexStatic(
			new RedGPU.Primitive.Torus(redGPUContext, 4, 0.8, 32, 32),
			0,
			5,
			0,
			70,
			'#888888'
		);
		createComplexStatic(
			new RedGPU.Primitive.Torus(redGPUContext, 6, 0.8, 32, 32),
			0,
			0,
			0,
			110,
			'#666666'
		);
		createComplexStatic(
			new RedGPU.Primitive.TorusKnot(redGPUContext, 3, 0.8, 64, 16),
			0,
			-5,
			0,
			0,
			'#444444'
		);

		// [KO] 바닥 생성 및 물리 적용: 시인성을 위해 색상을 #666666으로 변경
		// [EN] Create ground and apply physics: Changed color to #666666 for better visibility
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -10;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeBalls = [];

		/**
		 * [KO] 동적 구체 생성 함수
		 * [EN] Function to create dynamic balls
		 */
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const ball = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.1 + Math.random()),
				material
			);
			ball.x = (Math.random() * 6) - 3;
			ball.y = 15;
			ball.z = (Math.random() * 6) - 3;
			scene.addChild(ball);

			const body = physicsEngine.createBody(ball, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.6
			});
			const ballInfo = { mesh: ball, body };
			activeBalls.push(ballInfo);

			// [KO] 성능을 위해 10초 후 구슬 제거
			// [EN] Remove ball after 10 seconds for performance
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ball);
					activeBalls.splice(idx, 1);
				}
			}, 10000);
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		// [KO] 구슬 자동 생성 인터벌
		// [EN] Auto ball spawn interval
		setInterval(createBall, 150);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
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
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Guide',
		value: 'Complex Geometry Physics!',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};