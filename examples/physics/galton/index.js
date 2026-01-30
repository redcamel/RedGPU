import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45;
		controller.tilt = -20;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false; view.grid = false;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 2. 보드 프레임
		const createStaticBox = (x, y, z, w, h, d, color = '#444444') => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.material.color.setColorByHEX(color);
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = w; mesh.scaleY = h; mesh.scaleZ = d;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		};

		createStaticBox(0, 0, -1, 30, 40, 1, '#222222'); // 뒷벽
		createStaticBox(0, -20, 1, 30, 1, 5, '#111111'); // 바닥
		createStaticBox(-15, 0, 1, 1, 40, 5, '#111111'); // 왼쪽벽
		createStaticBox(15, 0, 1, 1, 40, 5, '#111111'); // 오른쪽벽

		// 3. 핀(Pins) 배치
		const pinGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.2, 0.2, 2);
		const pinMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		pinMat.color.setColorByHEX('#888888');

		for (let row = 0; row < 12; row++) {
			const y = 10 - row * 2.5;
			const cols = row + 1;
			const startX = -(cols - 1) * 2.5 / 2;
			for (let col = 0; col < cols; col++) {
				const pinMesh = new RedGPU.Display.Mesh(redGPUContext, pinGeo, pinMat);
				pinMesh.x = startX + col * 2.5; pinMesh.y = y; pinMesh.z = 0.5; pinMesh.rotationX = 90;
				scene.addChild(pinMesh);
				physicsEngine.createBody(pinMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.CYLINDER });
			}
		}

		// 4. 구슬 생성 및 리셋 로직
		const activeBalls = [];
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const ballMesh = new RedGPU.Display.Mesh(redGPUContext, ballGeo, material);
			ballMesh.x = (Math.random() * 0.4) - 0.2; ballMesh.y = 18; ballMesh.z = 0.5;
			scene.addChild(ballMesh);

			const body = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1, restitution: 0.6, friction: 0.1, linearDamping: 0.1
			});
			const ballInfo = { mesh: ballMesh, body };
			activeBalls.push(ballInfo);

			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ballMesh);
					activeBalls.splice(idx, 1);
				}
			}, 15000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeBalls.length = 0;
		};

		let intervalId = setInterval(createBall, 100);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, intervalId, createBall, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, intervalId, createBall, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = { spawnRate: 100, pause: false };
	pane.addBinding(params, 'spawnRate', { min: 50, max: 1000 }).on('change', (ev) => {
		clearInterval(intervalId);
		if (!params.pause) intervalId = setInterval(createBall, ev.value);
	});
	pane.addBinding(params, 'pause').on('change', (ev) => {
		if (ev.value) clearInterval(intervalId);
		else intervalId = setInterval(createBall, params.spawnRate);
	});
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};