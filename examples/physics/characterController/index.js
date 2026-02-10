import * as RedGPU from "../../../dist/index.js?t=1770699661827";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770699661827";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Character Controller 예제
 * [EN] Character Controller example
 *
 * [KO] 물리 기반 캐릭터 컨트롤러의 기본 기능(이동, 점프, 지형 충돌)을 보여줍니다.
 * [EN] Demonstrates the basic features of a physics-based character controller (movement, jump, terrain collision).
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 지형 생성 함수 (현실적인 미터 단위)
		// [EN] Helper function to create static terrain (realistic meter scale)
		const createStatic = (geometry, x, y, z, sx, sy, sz, rx = 0, color = '#444444') => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(color);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.scaleX = sx;
			mesh.scaleY = sy;
			mesh.scaleZ = sz;
			mesh.rotationX = rx;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// 바닥 (30m x 30m)
		createStatic(new RedGPU.Primitive.Box(redGPUContext), 0, -0.5, 0, 30, 1, 30);
		// 경사로 (폭 5m, 길이 8m)
		createStatic(new RedGPU.Primitive.Box(redGPUContext), -6, 0.5, 8, 5, 0.5, 8, -20, '#666666');
		// 계단 (높이 0.2m 간격)
		for (let i = 0; i < 5; i++) {
			createStatic(
				new RedGPU.Primitive.Box(redGPUContext),
				6,
				i * 0.2,
				-5 + (i * 1.5),
				2,
				0.4,
				1.5,
				0,
				'#ffaa00'
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
		charMesh.y = 3;
		scene.addChild(charMesh);

		const charBody = physicsEngine.createBody(charMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.CAPSULE
		});

		// [KO] 캐릭터 컨트롤러 생성 (오프셋 0.1m)
		// [EN] Create character controller (offset 0.1m)
		const charController = physicsEngine.createCharacterController(0.1);

		const keyboardBuffer = redGPUContext.keyboardKeyBuffer;
		const movement = { x: 0, y: 0, z: 0 };
		const speed = 0.15;
		const gravityConst = -0.05;

		const resetCharacter = () => {
			charBody.nativeBody.setTranslation({ x: 0, y: 2, z: 0 }, true);
			movement.x = movement.y = movement.z = 0;
		};

		const renderer = new RedGPU.Renderer();
		const render = (time) => {
			// [KO] 카메라 방향 기준 이동 계산
			// [EN] Calculate movement based on camera direction
			const camX = controller.camera.x;
			const camZ = controller.camera.z;
			const targetX = controller.centerX;
			const targetZ = controller.centerZ;

			let fX = targetX - camX;
			let fZ = targetZ - camZ;
			const fLen = Math.sqrt(fX * fX + fZ * fZ);
			if (fLen > 0) {
				fX /= fLen;
				fZ /= fLen;
			}

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

			movement.x = (fX * -inputZ + rX * inputX) * speed;
			movement.z = (fZ * -inputZ + rZ * inputX) * speed;
			movement.y += gravityConst;

			// [KO] 컨트롤러를 통한 충돌 감지 및 이동 계산
			// [EN] Calculate collider movement and move through the controller
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

			// [KO] 카메라가 캐릭터를 따라가도록 업데이트
			// [EN] Update camera to follow the character
			controller.centerX = charMesh.x;
			controller.centerY = charMesh.y;
			controller.centerZ = charMesh.z;
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetCharacter);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetCharacter
 */
const renderTestPane = async (redGPUContext, resetCharacter) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770699661827");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Control',
		value: 'Use WASD to Move!',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Character' }).on('click', () => resetCharacter());
};
