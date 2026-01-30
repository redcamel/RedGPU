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
		controller.distance = 30;
		controller.tilt = -25;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = false;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성 (30m x 30m)
		// [EN] Create ground (30m x 30m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = 30;
		ground.scaleY = 1;
		ground.scaleZ = 30;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];
		const createBox = (x, y, z) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.rotationX = Math.random() * 360;
			mesh.rotationY = Math.random() * 360;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				restitution: 0.5
			});
			activeObjects.push({ mesh, body });
		};

		// [KO] 초기 박스 스폰
		// [EN] Initial box spawn
		for (let i = 0; i < 30; i++) {
			createBox(
				(Math.random() * 6) - 3,
				5 + (i * 1.2),
				(Math.random() * 6) - 3
			);
		}

		let savedSnapshot = null;

		/**
		 * [KO] 물리 월드의 스냅샷 저장
		 * [EN] Save a snapshot of the physics world
		 */
		const takeSnapshot = () => {
			savedSnapshot = physicsEngine.nativeWorld.takeSnapshot();
			console.log('Snapshot saved! Size:', savedSnapshot.length, 'bytes');
		};

		/**
		 * [KO] 저장된 스냅샷으로 물리 월드 복구
		 * [EN] Restore the physics world with the saved snapshot
		 */
		const restoreSnapshot = () => {
			if (savedSnapshot) {
				physicsEngine.nativeWorld.restoreSnapshot(savedSnapshot);
				// [KO] 복구 후 물리 엔진의 바디 위치를 메쉬에 동기화
				// [EN] After restoration, synchronize physics body positions to meshes
				physicsEngine.bodies.forEach(body => body.syncToMesh());
				console.log('Snapshot restored!');
			}
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, takeSnapshot, restoreSnapshot);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, save, restore) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'TAKE SNAPSHOT' }).on('click', () => save());
	pane.addButton({ title: 'RESTORE SNAPSHOT' }).on('click', () => restore());
};