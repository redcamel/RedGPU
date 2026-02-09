import * as RedGPU from "../../../dist/index.js?t=1770635178902";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770635178902";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Raycast 예제
 * [EN] Raycast example
 *
 * [KO] 물리 엔진의 레이캐스트(Raycast) 기능을 시연합니다.
 * [EN] Demonstrates the Raycast feature of the physics engine.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 설정
		// [EN] Set up physics engine
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 조명 설정
		// [EN] Set up lighting
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		// [KO] 바닥 생성
		// [EN] Create ground
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 30, 30), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const createBox = (i) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.setPosition((Math.random() * 10) - 5, 2 + (i * 1.5), (Math.random() * 10) - 5);
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1, linearDamping: 0.5, angularDamping: 0.5
			});
			activeObjects.push({ mesh, body });

			mesh.addListener('click', (e) => {
				const dir = e.ray.direction;
				body.applyImpulse({ x: dir[0] * 40, y: (dir[1] * 40) + 15, z: dir[2] * 40 });
				e.target.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			});
		};

		const initScene = () => { for (let i = 0; i < 20; i++) createBox(i); };
		const resetScene = () => {
			activeObjects.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeObjects.length = 0;
			initScene();
		};

		initScene();
		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
	const { setDebugButtons } = await import("../../../examples/exampleHelper/createExample/panes/index.js?t=1770635178902");
	setDebugButtons(RedGPU, redGPUContext);
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Guide', value: 'Click boxes to push them!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
