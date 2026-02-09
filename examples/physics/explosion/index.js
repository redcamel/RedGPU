import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.body.appendChild(document.createElement('canvas'));

/**
 * [KO] Explosion 예제
 * [EN] Explosion example
 *
 * [KO] 폭발 효과를 시뮬레이션하여 주변의 물리 객체들에 힘을 가하는 방법을 보여줍니다.
 * [EN] Demonstrates how to simulate an explosion effect by applying force to surrounding physics objects.
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

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		const activeBoxes = [];
		const boxGeo = new RedGPU.Primitive.Box(redGPUContext);

		const explodeAt = (point) => {
			const epicenter = { x: point[0], y: point[1], z: point[2] };
			const radius = 15, power = 60;

			physicsEngine.bodies.forEach(body => {
				if (body.nativeBody.isFixed()) return;
				const pos = body.position;
				const dx = pos[0] - epicenter.x, dy = pos[1] - epicenter.y, dz = pos[2] - epicenter.z;
				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (dist < radius && dist > 0) {
					const scalar = (1 - (dist / radius)) * power;
					body.applyImpulse({ x: (dx / dist) * scalar, y: (dy / dist) * scalar + (scalar * 0.5), z: (dz / dist) * scalar });
				}
			});
			createPile(10);
		};

		const createPile = (spawnY = 1) => {
			if (activeBoxes.length > 1000) {
				for (let i = 0; i < 100; i++) {
					const item = activeBoxes.shift();
					physicsEngine.removeBody(item.body);
					scene.removeChild(item.mesh);
				}
			}

			for (let i = 0; i < 100; i++) {
				const mesh = new RedGPU.Display.Mesh(redGPUContext, boxGeo, new RedGPU.Material.PhongMaterial(redGPUContext));
				mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
				mesh.setPosition((Math.random() * 8) - 4, spawnY + (i * 0.6), (Math.random() * 8) - 4);
				mesh.setScale(0.5);
				scene.addChild(mesh);

				const body = physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, mass: 1, friction: 0.5, restitution: 0.2 });
				activeBoxes.push({ mesh, body });
				mesh.addListener('click', (e) => explodeAt(e.point));
			}
		};

		const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		ground.setScale(60, 1, 60);
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		ground.addListener('click', (e) => explodeAt(e.point));

		createPile();
		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext, activeBoxes);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {Array<object>} activeBoxes
 */
const renderTestPane = async (redGPUContext, activeBoxes) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext);
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Interaction', value: 'Click to EXPLODE & SPAWN!', parse: (v) => v, readonly: true });
	pane.addBinding(activeBoxes, 'length', { label: 'Box Count', readonly: true, interval: 100 });
};