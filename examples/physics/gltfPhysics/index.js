import * as RedGPU from "../../../dist/index.js?t=1770713934910";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] GLTF Physics 예제
 * [EN] GLTF Physics example
 *
 * [KO] GLTF 모델을 로드하고 물리 엔진을 적용하여 충돌 처리를 수행하는 방법을 보여줍니다.
 * [EN] Demonstrates how to load GLTF models and apply the physics engine to handle collisions.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정
		// [EN] Camera setup
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.tilt = -35;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
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

		const SPACING = 10;
		const GRID_SIZE = 3;
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.4);

		// [KO] 바닥 생성 (50m x 50m)
		// [EN] Create ground (50m x 50m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -0.5;
		ground.scaleX = 50;
		ground.scaleY = 1;
		ground.scaleZ = 50;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] GLTF 모델 로드 및 정적 메쉬 콜라이더 적용
		// [EN] Load GLTF models and apply static mesh colliders
		const modelURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
		
		for (let ix = -1; ix <= 1; ix++) {
			for (let iz = -1; iz <= 1; iz++) {
				new RedGPU.GLTFLoader(redGPUContext, modelURL, (v) => {
					const model = v['resultMesh'];
					const randomScale = 1.0 + (Math.random() * 2.0);
					model.scaleX = randomScale;
					model.scaleY = randomScale;
					model.scaleZ = randomScale;
					model.x = ix * SPACING;
					model.y = 2;
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
			ball.y = 10;
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
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ball);
					activeBalls.splice(idx, 1);
				}
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		setInterval(createBall, 300);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};
