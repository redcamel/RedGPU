import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화
		// [EN] Initialize physics engine
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		/**
		 * [KO] 정적 블록 생성 함수
		 * [EN] Static block creation function
		 */
		const createBlock = (x, y, z, sx, sy, sz, color = '#666666') => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.scaleX = sx;
			mesh.scaleY = sy;
			mesh.scaleZ = sz;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// [KO] 환경 구축 (50m x 50m 바닥 및 공중 발판들)
		// [EN] Environment build (50m x 50m ground and floating platforms)
		createBlock(0, -0.5, 0, 50, 1, 50);
		for (let i = 0; i < 20; i++) {
			createBlock(
				(Math.random() * 40) - 20,
				i * 1.2 + 1,
				(Math.random() * 40) - 20,
				4,
				0.3,
				4,
				'#888888'
			);
		}

		// [KO] 캐릭터 생성 (지름 0.6m, 총 높이 1.8m 캡슐)
		// [EN] Create character (Capsule with diameter 0.6m, total height 1.8m)
		const charMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Capsule(redGPUContext, 0.3, 1.2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		charMesh.material.color.setColorByHEX('#ff4444');
		charMesh.y = 5;
		scene.addChild(charMesh);

		const charBody = physicsEngine.createBody(charMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.CAPSULE
		});

		const charController = physicsEngine.createCharacterController(0.01);
		
		const keys = { w: false, s: false, a: false, d: false, ' ': false };
		window.addEventListener('keydown', (e) => { 
			const k = e.key.toLowerCase();
			if (keys.hasOwnProperty(k)) keys[k] = true; 
		});
		window.addEventListener('keyup', (e) => { 
			const k = e.key.toLowerCase();
			if (keys.hasOwnProperty(k)) keys[k] = false; 
		});

		let velocity = { x: 0, y: 0, z: 0 };
		let jumpCount = 0;
		const maxJumps = 2;
		const moveSpeed = 0.06;
		const airControl = 0.3;
		const gravity = -0.015;
		const jumpForce = 0.25;
		const friction = 0.85;

		const render = (time) => {
			const isGrounded = charController.computedGrounded();
			if (isGrounded) {
				velocity.y = 0;
				jumpCount = 0;
			} else {
				velocity.y += gravity;
			}

			const camX = controller.camera.x;
			const camZ = controller.camera.z;
			const targetX = controller.centerX;
			const targetZ = controller.centerZ;
			
			let fX = targetX - camX;
			let fZ = targetZ - camZ;
			const fLen = Math.sqrt(fX * fX + fZ * fZ);
			if (fLen > 0) { fX /= fLen; fZ /= fLen; }

			const rX = -fZ;
			const rZ = fX;

			let inputX = 0, inputZ = 0;
			if (keys.w) inputZ -= 1;
			if (keys.s) inputZ += 1;
			if (keys.a) inputX -= 1;
			if (keys.d) inputX += 1;

			const len = Math.sqrt(inputX * inputX + inputZ * inputZ);
			if (len > 0) {
				inputX /= len;
				inputZ /= len;
			}

			const controlPower = isGrounded ? 1.0 : airControl;
			
			let moveX = (fX * -inputZ + rX * inputX) * moveSpeed * controlPower;
			let moveZ = (fZ * -inputZ + rZ * inputX) * moveSpeed * controlPower;

			velocity.x += moveX;
			velocity.z += moveZ;
			velocity.x *= friction;
			velocity.z *= friction;

			// [KO] 점프 로직 (최대 2단 점프)
			// [EN] Jump logic (Max double jump)
			if (keys[' '] && jumpCount < maxJumps) {
				velocity.y = jumpForce;
				jumpCount++;
				keys[' '] = false; 
			}

			charController.computeColliderMovement(charBody.nativeCollider, velocity);
			const corrected = charController.computedMovement();
			const current = charBody.nativeBody.translation();
			
			charBody.nativeBody.setNextKinematicTranslation({
				x: current.x + corrected.x,
				y: current.y + corrected.y,
				z: current.z + corrected.z
			});

			controller.centerX = charMesh.x;
			controller.centerY = charMesh.y;
			controller.centerZ = charMesh.z;
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, () => {
			charBody.nativeBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			velocity.x = velocity.y = velocity.z = 0;
		});
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetFunc) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Control',
		value: 'WASD: Move / Space: Double Jump',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Position' }).on('click', () => resetFunc());
};