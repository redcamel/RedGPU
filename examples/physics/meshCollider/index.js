import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정
		// [EN] Camera setup
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -25;
		controller.centerY = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		/**
		 * [KO] 복잡한 지형 생성 함수 (정적 메쉬 콜라이더 사용)
		 * [EN] Function to create complex terrain (using static mesh collider)
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
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.MESH,
				friction: 0.5,
				restitution: 0.5
			});
		};

		// 지형 배치 (현실적인 미터 단위 스케일)
		createComplexStatic(new RedGPU.Primitive.Torus(redGPUContext, 4, 0.8, 32, 32), 0, 5, 0, 70, '#888888');
		createComplexStatic(new RedGPU.Primitive.Torus(redGPUContext, 6, 0.8, 32, 32), 0, 0, 0, 110, '#666666');
		createComplexStatic(new RedGPU.Primitive.TorusKnot(redGPUContext, 3, 0.8, 64, 16), 0, -5, 0, 0, '#444444');

		// [KO] 바닥 생성 (30m x 30m)
		// [EN] Create ground (30m x 30m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -10;
		ground.material.color.setColorByHEX('#222222');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeBalls = [];
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const ball = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
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

			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ball);
					activeBalls.splice(idx, 1);
				}
			}, 10000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		setInterval(createBall, 150);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

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