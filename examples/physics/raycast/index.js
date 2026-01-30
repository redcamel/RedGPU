import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 바닥 생성
		const groundMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Ground(redGPUContext, 30, 30), new RedGPU.Material.PhongMaterial(redGPUContext));
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });

		const activeObjects = [];
		const bodyMap = new Map();
		const createBox = (i) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const boxMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material);
			boxMesh.x = (Math.random() * 10) - 5; boxMesh.y = 2 + (i * 1.5); boxMesh.z = (Math.random() * 10) - 5;
			scene.addChild(boxMesh);

			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1, linearDamping: 0.5, angularDamping: 0.5
			});
			bodyMap.set(body.nativeCollider.handle, { body, mesh: boxMesh });
			activeObjects.push({ mesh: boxMesh, body });
		};

		const initScene = () => { for (let i = 0; i < 20; i++) createBox(i); };
		const resetScene = () => {
			activeObjects.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeObjects.length = 0;
			bodyMap.clear();
			initScene();
		};

		initScene();

		canvas.addEventListener('mousedown', (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const worldPoint = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
			if (!worldPoint) return;

			const rayOrigin = { x: view.rawCamera.x, y: view.rawCamera.y, z: view.rawCamera.z };
			const rayDir = { x: worldPoint[0] - rayOrigin.x, y: worldPoint[1] - rayOrigin.y, z: worldPoint[2] - rayOrigin.z };
			const mag = Math.sqrt(rayDir.x * rayDir.x + rayDir.y * rayDir.y + rayDir.z * rayDir.z);
			const normalizedDir = { x: rayDir.x / mag, y: rayDir.y / mag, z: rayDir.z / mag };

			const ray = new RAPIER.Ray(rayOrigin, normalizedDir);
			const hit = physicsEngine.nativeWorld.castRay(ray, 1000.0, true);

			if (hit) {
				const handle = (typeof hit.colliderHandle === 'number') ? hit.colliderHandle : (hit.collider ? hit.collider.handle : undefined);
				if (handle !== undefined) {
					const target = bodyMap.get(handle);
					if (target) {
						target.body.applyImpulse({ x: normalizedDir.x * 40, y: (normalizedDir.y * 40) + 15, z: normalizedDir.z * 40 });
						target.mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
					}
				}
			}
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
	pane.addBlade({ view: 'text', label: 'Guide', value: 'Click boxes to push them!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};