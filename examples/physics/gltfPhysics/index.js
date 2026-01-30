import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 65;
		controller.tilt = -35;
		controller.centerY = 5;

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

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;

		const SPACING = 15;
		const GRID_SIZE = 3;
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.8);

		// 1. 바닥 생성
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -1;
		ground.scaleX = 100;
		ground.scaleY = 2;
		ground.scaleZ = 100;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// 2. GLTF 모델 로드 및 배치
		const modelURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
		for (let ix = -1; ix <= 1; ix++) {
			for (let iz = -1; iz <= 1; iz++) {
				new RedGPU.GLTFLoader(redGPUContext, modelURL, (v) => {
					const model = v['resultMesh'];
					const randomScale = 1.0 + (Math.random() * 3.0);
					model.scaleX = model.scaleY = model.scaleZ = randomScale;
					model.x = ix * SPACING;
					model.y = 5;
					model.z = iz * SPACING;
					scene.addChild(model);
					view.update();
					physicsEngine.createBody(model, {
						type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
						shape: RedGPU.Physics.PHYSICS_SHAPE.MESH,
						friction: 0.3
					});
				});
			}
		}

		// 3. 구슬 스폰 및 리셋
		const activeBalls = [];
		const createBall = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const ball = new RedGPU.Display.Mesh(
				redGPUContext,
				ballGeo,
				material
			);
			const gridIdxX = Math.floor(Math.random() * GRID_SIZE) - 1; 
			const gridIdxZ = Math.floor(Math.random() * GRID_SIZE) - 1; 
			ball.x = (gridIdxX * SPACING) + (Math.random() * 4 - 2);
			ball.y = 15;
			ball.z = (gridIdxZ * SPACING) + (Math.random() * 4 - 2);
			scene.addChild(ball);

			const body = physicsEngine.createBody(ball, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 2,
				restitution: 0.6
			});
			const ballInfo = { mesh: ball, body };
			activeBalls.push(ballInfo);
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(ball); activeBalls.splice(idx, 1); }
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeBalls.length = 0;
		};

		setInterval(createBall, 300);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};