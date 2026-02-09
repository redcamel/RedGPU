import * as RedGPU from "../../../dist/index.js?t=1770634235177";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770634235177";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Advanced Character Controller 예제
 * [EN] Advanced Character Controller example
 *
 * [KO] 고급 물리 기반 캐릭터 컨트롤러의 기능(이동, 점프, 충돌 처리 등)을 보여줍니다.
 * [EN] Demonstrates the features of an advanced physics-based character controller (movement, jump, collision handling, etc.).
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const scene = new RedGPU.Display.Scene();

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
		 * @param {number} x
		 * @param {number} y
		 * @param {number} z
		 * @param {number} sx
		 * @param {number} sy
		 * @param {number} sz
		 * @param {string} color
		 */
		/**
		 * [KO] 정적 블록 생성 함수
		 * [EN] Static block creation function
		 * @param {number} x
		 * @param {number} y
		 * @param {number} z
		 * @param {number} sx
		 * @param {number} sy
		 * @param {number} sz
		 * @param {string} color
		 * @param {number} rx
		 * @param {number} ry
		 * @param {number} rz
		 */
		const createBlock = (x, y, z, sx, sy, sz, color = '#666666', rx = 0, ry = 0, rz = 0) => {
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
			mesh.rotationX = rx;
			mesh.rotationY = ry;
			mesh.rotationZ = rz;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// [KO] 환경 구축 (Dense & Compact Test Course)
		// [EN] Environment build (Dense & Compact Test Course)
		createBlock(0, -0.5, 0, 100, 1, 100); // Base Ground

		// [KO] 중앙 밀집 구역 (Center Complex)
		// 계단 -> 플랫폼 -> 경사로 연결
		for (let i = 0; i < 12; i++) {
			createBlock(0, i * 0.18, 5 + i * 0.45, 4, 0.2, 0.6, '#8888aa');
		}
		createBlock(0, 12 * 0.18, 12, 6, 0.2, 6, '#8888cc'); // 연결 플랫폼
		createBlock(0, 12 * 0.18 + 1.4, 20, 6, 0.2, 10, '#8888ee', 20, 0, 0); // 플랫폼에서 이어지는 경사로

		// 나선형 계단을 플랫폼 주변으로 밀착
		const spiralCenterX = 8;
		const spiralCenterZ = 10;
		for (let i = 0; i < 20; i++) {
			const angle = i * 0.5;
			const radius = 3;
			const x = spiralCenterX + Math.cos(angle) * radius;
			const z = spiralCenterZ + Math.sin(angle) * radius;
			createBlock(x, i * 0.35, z, 1.5, 0.15, 1.5, '#88aa88', 0, -angle * 180 / Math.PI, 0);
		}

		// 파쿠르 코스를 중앙 플랫폼 옆으로 배치
		for (let i = 0; i < 8; i++) {
			createBlock(
				-6 - i * 1.8, 
				1 + i * 0.4, 
				8 + (i % 2 === 0 ? 0.8 : -0.8), 
				1.5, 0.15, 1.5, 
				`#aa${(90 + i * 20).toString(16)}88`
			);
		}

		// 좁은 길을 플랫폼 상단에 교차
		createBlock(-12, 12 * 0.18, 12, 10, 0.15, 0.4, '#aaaa88');

		// 입체 구조물을 시작 지점 근처로 당김
		// 피라미드형 계단
		for (let i = 0; i < 8; i++) {
			const size = 12 - i * 1.5;
			createBlock(-15, i * 0.35, -5, size, 0.4, size, '#777777');
		}

		// 터널을 중앙 플랫폼 아래에 배치
		createBlock(0, 0.1, 12, 10, 0.1, 10, '#555555'); // 터널 바닥
		createBlock(-4, 0, 12, 0.5, 2.5, 10, '#444444'); // 벽 1
		createBlock(4, 0, 12, 0.5, 2.5, 10, '#444444'); // 벽 2
		createBlock(0, 2.5, 12, 10, 0.5, 10, '#666666'); // 지붕 (플랫폼 하단)

		// 캐릭터 생성 (지름 0.6m, 총 높이 1.8m 캡슐)
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
		
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 12;
		controller.tilt = -15;

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const keyboardBuffer = redGPUContext.keyboardKeyBuffer;

		let velocity = { x: 0, y: 0, z: 0 };
		let jumpCount = 0;
		const maxJumps = 2;
		const moveSpeed = 0.025;
		const airControl = 0.3;
		const gravity = -0.01;
		const jumpForce = 0.2;
		const friction = 0.8;

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
			const targetX = charMesh.x;
			const targetZ = charMesh.z;
			
			let fX = targetX - camX;
			let fZ = targetZ - camZ;
			const fLen = Math.sqrt(fX * fX + fZ * fZ);
			if (fLen > 0) { fX /= fLen; fZ /= fLen; }

			const rX = -fZ;
			const rZ = fX;

			let inputX = 0, inputZ = 0;
			if (keyboardBuffer.w || keyboardBuffer.W) inputZ -= 1;
			if (keyboardBuffer.s || keyboardBuffer.S) inputZ += 1;
			if (keyboardBuffer.a || keyboardBuffer.A) inputX -= 1;
			if (keyboardBuffer.d || keyboardBuffer.D) inputX += 1;

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
			if (keyboardBuffer[' '] && jumpCount < maxJumps) {
				velocity.y = jumpForce;
				jumpCount++;
				keyboardBuffer[' '] = false; 
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetFunc
 */
const renderTestPane = async (redGPUContext, resetFunc) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770634235177');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770634235177");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Move',
		value: 'WASD Keys',
		parse: (v) => v,
		readonly: true
	});
	pane.addBlade({
		view: 'text',
		label: 'Jump',
		value: 'Space (Double Jump)',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Position' }).on('click', () => resetFunc());
};
