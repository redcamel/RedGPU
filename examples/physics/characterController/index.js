import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -30;

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
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 20; directionalLight.y = 40; directionalLight.z = 20;
		directionalLight.intensity = 1.2;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 지형 생성 (경사로와 계단 포함)
		const createStatic = (geometry, x, y, z, sx, sy, sz, rx = 0, color = '#444444') => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.material.color.setColorByHEX(color);
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = sx; mesh.scaleY = sy; mesh.scaleZ = sz;
			mesh.rotationX = rx;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		};

		createStatic(new RedGPU.Primitive.Box(redGPUContext), 0, -1, 0, 50, 2, 50);
		createStatic(new RedGPU.Primitive.Box(redGPUContext), -10, 1, 15, 10, 1, 15, -20, '#666666');
		for(let i=0; i<5; i++) {
			createStatic(new RedGPU.Primitive.Box(redGPUContext), 10, 1, -10 + (i*5), 2, 2, 2, 0, '#ffaa00');
		}

		// 2. 캐릭터 생성
		const charMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2), new RedGPU.Material.PhongMaterial(redGPUContext));
		charMesh.material.color.setColorByHEX('#ff4444');
		charMesh.y = 5;
		scene.addChild(charMesh);

		const charBody = physicsEngine.createBody(charMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.CAPSULE
		});

		const charController = physicsEngine.createCharacterController(0.1);

		// 3. 입력 핸들링
		const keys = { w: false, s: false, a: false, d: false };
		window.addEventListener('keydown', (e) => { if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true; });
		window.addEventListener('keyup', (e) => { if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false; });

		// 4. 이동 및 리셋 로직
		const movement = { x: 0, y: 0, z: 0 };
		const speed = 0.2;
		const gravityConst = -0.1;

		const resetCharacter = () => {
			charBody.nativeBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			movement.x = movement.y = movement.z = 0;
			Object.keys(keys).forEach(k => keys[k] = false);
		};

		const renderer = new RedGPU.Renderer();
		const render = (time) => {
			movement.x = 0; movement.z = 0;
			if (keys.w) movement.z = -speed; if (keys.s) movement.z = speed;
			if (keys.a) movement.x = -speed; if (keys.d) movement.x = speed;
			movement.y += gravityConst;

			charController.computeColliderMovement(charBody.nativeCollider, movement);
			const correctedMovement = charController.computedMovement();
			const currentPos = charBody.nativeBody.translation();
			charBody.nativeBody.setNextKinematicTranslation({
				x: currentPos.x + correctedMovement.x,
				y: currentPos.y + correctedMovement.y,
				z: currentPos.z + correctedMovement.z
			});

			const isGrounded = charController.computedGrounded ? charController.computedGrounded() : false;
			if (isGrounded) movement.y = 0;

			controller.centerX = charMesh.x; controller.centerY = charMesh.y; controller.centerZ = charMesh.z;
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetCharacter);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetCharacter) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Control', value: 'Use WASD to Move!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Character' }).on('click', () => resetCharacter());
};