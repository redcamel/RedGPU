import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 65;
		controller.tilt = -25;
		controller.pan = 0;
		controller.centerZ = -20;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		// 조명 설정
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.4;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 20; directionalLight.y = 40; directionalLight.z = 20;
		directionalLight.intensity = 1.5;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 레인 생성
		const laneMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		laneMat.color.setColorByHEX('#666666');
		laneMat.shininess = 64;

		const laneMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 15, 100), laneMat);
		laneMesh.z = -30;
		scene.addChild(laneMesh);
		physicsEngine.createBody(laneMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, friction: 0.05 });

		const activePins = [];
		const activeBalls = [];

		const pinGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.4, 0.6, 2.5);
		const pinMat = new RedGPU.Material.PhongMaterial(redGPUContext);
		pinMat.color.setColorByHEX('#ffffff');

		const spawnPins = () => {
			const rows = 4;
			const spacingX = 1.8;
			const spacingZ = 1.8;
			const offsetZ = -60;

			for (let row = 0; row < rows; row++) {
				const z = offsetZ - row * spacingZ;
				const cols = row + 1;
				const startX = -(cols - 1) * spacingX / 2;

				for (let col = 0; col < cols; col++) {
					const x = startX + col * spacingX;
					const pinMesh = new RedGPU.Display.Mesh(redGPUContext, pinGeo, pinMat);
					pinMesh.x = x; pinMesh.y = 1.25; pinMesh.z = z;
					scene.addChild(pinMesh);
					const body = physicsEngine.createBody(pinMesh, {
						type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
						shape: RedGPU.Physics.PHYSICS_SHAPE.CYLINDER,
						mass: 0.5,
						friction: 0.1
					});
					activePins.push({ mesh: pinMesh, body });
				}
			}
		};

		const resetPins = () => {
			activePins.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activePins.length = 0;
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
			spawnPins();
		};

		spawnPins();

		const throwBall = (power) => {
			const ballMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 1.5),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			ballMesh.material.color.setColorByHEX('#ff4444');
			ballMesh.y = 1.5;
			ballMesh.z = 10;
			scene.addChild(ballMesh);

			const ballBody = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 20,
				restitution: 0.1,
				friction: 0.5,
				enableCCD: true 
			});

			ballBody.applyImpulse({ x: (Math.random() * 2) - 1, y: -10, z: -power });
			activeBalls.push({ mesh: ballMesh, body: ballBody });
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, throwBall, resetPins);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, throwBall, resetPins) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	const params = {
		power: 1500
	};

	pane.addBinding(params, 'power', { min: 100, max: 5000 });
	pane.addButton({ title: 'THROW BALL!' }).on('click', () => throwBall(params.power));
	pane.addButton({ title: 'Reset Game' }).on('click', () => resetPins());
};
