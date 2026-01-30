import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 50;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 바닥 생성
		const ground = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		ground.y = -1;
		ground.scaleX = 100; ground.scaleY = 2; ground.scaleZ = 100;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		// 2. 박스 관리 시스템
		const activeBoxes = [];
		const boxGeo = new RedGPU.Primitive.Box(redGPUContext);

		const createPile = () => {
			for (let i = 0; i < 100; i++) {
				const material = new RedGPU.Material.PhongMaterial(redGPUContext);
				material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
				const box = new RedGPU.Display.Mesh(redGPUContext, boxGeo, material);
				box.x = (Math.random() * 10) - 5; box.y = 2 + (i * 0.5); box.z = (Math.random() * 10) - 5;
				scene.addChild(box);

				const body = physicsEngine.createBody(box, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
					mass: 1, friction: 0.5, restitution: 0.2, linearDamping: 0.2, angularDamping: 0.2
				});
				activeBoxes.push({ mesh: box, body });
			}
		};

		const resetScene = () => {
			activeBoxes.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeBoxes.length = 0;
			createPile();
		};

		createPile();

		// 3. 폭발(Explosion) 로직
		canvas.addEventListener('mousedown', (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const worldPoint = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
			if (!worldPoint) return;

			const epicenter = { x: worldPoint[0], y: worldPoint[1], z: worldPoint[2] };
			const explosionRadius = 25;
			const explosionPower = 120;

			physicsEngine.bodies.forEach(body => {
				if (body.nativeBody.isFixed()) return;
				const pos = body.position;
				const dx = pos[0] - epicenter.x; const dy = pos[1] - epicenter.y; const dz = pos[2] - epicenter.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < explosionRadius) {
					const forceScalar = (1 - (distance / explosionRadius)) * explosionPower;
					const dir = { x: dx / distance, y: dy / distance, z: dz / distance };
					body.applyImpulse({ x: dir.x * forceScalar, y: (dir.y * forceScalar) + (forceScalar * 0.6), z: dir.z * forceScalar });
				}
			});
		});

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
	pane.addBlade({ view: 'text', label: 'Guide', value: 'Click anywhere to BOOM!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
