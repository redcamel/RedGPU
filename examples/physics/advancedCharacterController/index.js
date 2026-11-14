import * as RedGPU from "../../../dist/index.js?t=1794646734270";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794646734270";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794646734270";

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

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.elevation = 35;
		directionalLight.azimuth = 147.5;
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] HSL 색상을 16진수 HEX 문자열로 변환
		// [EN] Convert HSL color to hexadecimal HEX string
		const hslToHex = (h, s, l) => {
				l /= 100;
				const a = (s * Math.min(l, 1 - l)) / 100;
				const f = (n) => {
					const k = (n + h / 30) % 12;
					const colorValue = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
					return Math.round(255 * colorValue).toString(16).padStart(2, '0');
				};
				return `#${f(0)}${f(8)}${f(4)}`;
			};

		const createBlock = (x, y, z, sx, sy, sz, color = '#666666', rx = 0, ry = 0, rz = 0) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
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
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// [KO] 환경 구축 (바닥, 계단, 나선형 계단, 파쿠르 코스, 터널)
		// [EN] Build test course environment (ground, stairs, spiral stairs, parkour course, tunnel)
		createBlock(0, -0.5, 0, 100, 1, 100, '#5a6578');

		for (let i = 0; i < 12; i++) {
			const hue = 220 + (i * 3);
            createBlock(0, i * 0.18, 5 + i * 0.45, 4, 0.2, 0.6, hslToHex(hue, 55, 55));
		}
		createBlock(0, 12 * 0.18, 12, 6, 0.2, 6, '#6d58b5');
		createBlock(0, 12 * 0.18 + 1.4, 20, 6, 0.2, 10, '#c0487a', 20, 0, 0);

		const spiralCenterX = 8;
		const spiralCenterZ = 10;
		for (let i = 0; i < 20; i++) {
			const angle = i * 0.5;
			const radius = 3;
			const x = spiralCenterX + Math.cos(angle) * radius;
			const z = spiralCenterZ + Math.sin(angle) * radius;
			const hue = 140 + (i * 2);
            createBlock(x, i * 0.35, z, 1.5, 0.15, 1.5, hslToHex(hue, 50, 50), 0, -angle * 180 / Math.PI, 0);
		}

		for (let i = 0; i < 8; i++) {
			const hue = 30 + (i * 4);
			createBlock(
				-6 - i * 1.8, 
				1 + i * 0.4, 
				8 + (i % 2 === 0 ? 0.8 : -0.8), 
				1.5, 0.15, 1.5,
                hslToHex(hue, 65, 55)
			);
		}

		createBlock(-12, 12 * 0.18, 12, 10, 0.15, 0.4, '#3898b0');

		for (let i = 0; i < 8; i++) {
			const size = 12 - i * 1.5;
            const lightness = 35 + (i * 4);
			createBlock(-15, i * 0.35, -5, size, 0.4, size, hslToHex(220, 10, lightness));
		}

		createBlock(0, 0.1, 12, 10, 0.1, 10, '#5a3d4c');
		createBlock(-4, 0, 12, 0.5, 2.5, 10, '#5b6573');
		createBlock(4, 0, 12, 0.5, 2.5, 10, '#5b6573');
		createBlock(0, 2.5, 12, 10, 0.5, 10, '#8c939f');

		// [KO] 캐릭터용 물리 구동 캡슐 생성 (씬에 추가하지 않고 물리 바디로만 동작)
		// [EN] Create physics-driven capsule for character (operates as physics body without adding to scene)
		const charMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Capsule(redGPUContext, 0.3, 1.2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		charMesh.y = 5;

		// [KO] GLTF 캐릭터 로딩
		// [EN] GLTF Character Loading
		let soldierMesh = null;
		let stateMachine = null;
		let targetStateName = 'Idle';
		let lastTime = null;

        // [KO] 캐릭터 모델 로드 (출처: https://threejs.org/examples/models/gltf/Soldier.glb)
        // [EN] Load character model (Source: https://threejs.org/examples/models/gltf/Soldier.glb)
		const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
		new RedGPU.GLTFLoader(
			redGPUContext,
			MODEL_URL,
			(loader) => {
				soldierMesh = loader.resultMesh;
				soldierMesh.setCastShadowRecursively(true);
				soldierMesh.setReceiveShadowRecursively(true);

				scene.addChild(soldierMesh);

				// [KO] 애니메이션 클립 매핑 및 상태 머신 구성
				// [EN] Map animation clips and configure state machine
				const clips = loader.parsingResult.animations;
				if (clips && clips.length > 0) {
					const idleState = clips[0];
					const runState = clips[1];
					const walkState = clips[3] || clips[2];

					idleState.name = 'Idle';
					walkState.name = 'Walk';
					runState.name = 'Run';

					stateMachine = new RedGPU.AnimStateMachine(idleState);
					stateMachine.addState(walkState);
					stateMachine.addState(runState);

					const BLEND = 0.25;

					const pairs = [
						['Idle', 'Walk'], ['Idle', 'Run'],
						['Walk', 'Idle'], ['Walk', 'Run'],
						['Run', 'Idle'], ['Run', 'Walk'],
					];
					pairs.forEach(([from, to]) => {
						stateMachine.addTransition({
							fromState: from,
							toState: to,
							duration: BLEND,
							conditions: () => targetStateName === to,
						});
					});

					loader.stopAnimation();
					loader.playAnimation(idleState);
					if (loader.activeAnimations.length > 0) {
						loader.activeAnimations[0].animStateMachine = stateMachine;
					}
				}
			},
			RedGPUExampleHelper.loadingProgressInfoHandler
		);

		const charBody = physicsEngine.createBody(charMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.CAPSULE
		});

		const charController = physicsEngine.createCharacterController(0.01);

		// [KO] 3인칭 밀착형 카메라 컨트롤러 설정
		// [EN] Set up third-person close-range camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 6;
		controller.tilt = -15;
		controller.minDistance = 2.5;
		controller.maxDistance = 15;
		controller.minTilt = -75;
		controller.maxTilt = -5;

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] IBL 및 스카이박스 설정
		// [EN] Setup IBL and SkyBox
		const iblUrl = '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
		const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl, 10000);
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

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

			const isRunning = len > 0 && (keyboardBuffer.shift || keyboardBuffer.Shift);
			const currentSpeed = isRunning ? moveSpeed * 1.8 : moveSpeed;

			let moveX = (fX * -inputZ + rX * inputX) * currentSpeed * controlPower;
			let moveZ = (fZ * -inputZ + rZ * inputX) * currentSpeed * controlPower;

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

			const dt = lastTime !== null ? (time - lastTime) / 1000 : 0;
			lastTime = time;

			// [KO] glTF 캐릭터 위치, 회전 보간 및 상태 머신 갱신
			// [EN] Update glTF character position, rotation interpolation, and state machine
			if (soldierMesh) {
				soldierMesh.x = charMesh.x;
				soldierMesh.y = charMesh.y - 0.9;
				soldierMesh.z = charMesh.z;

				const speedXZ = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);

				if (speedXZ > 0.005 && dt > 0) {
					const targetYawRad = Math.atan2(-velocity.x, -velocity.z);
					const targetYawDeg = targetYawRad * (180 / Math.PI);
					const desiredRotationY = targetYawDeg;

					let diff = (desiredRotationY - soldierMesh.rotationY) % 360;
					if (diff > 180) diff -= 360;
					if (diff < -180) diff += 360;

					const factor = 1 - Math.exp(-8.0 * dt);
					soldierMesh.rotationY += diff * factor;
				}

				if (isRunning && speedXZ > 0.01) targetStateName = 'Run';
				else if (speedXZ > 0.005) targetStateName = 'Walk';
				else targetStateName = 'Idle';
			}

			// [KO] 3인칭 카메라가 캐릭터 중심(+0.3m)을 부드럽게 추적
			// [EN] Smoothly follow the character center (+0.3m) with third-person camera
			const lerpFactor = 0.1;
			controller.centerX += (charMesh.x - controller.centerX) * lerpFactor;
			controller.centerY += ((charMesh.y + 0.3) - controller.centerY) * lerpFactor;
			controller.centerZ += (charMesh.z - controller.centerZ) * lerpFactor;
		};

		// [KO] 리사이즈 핸들러 설정: 화면 크기 변경 시 카메라 거리 조절
		// [EN] Set up resize handler: Adjust camera distance when screen size changes
		redGPUContext.onResize = (resizeEvent) => {
			const {width, height} = resizeEvent.pixelRectObject;
			const aspect = width / height;
			const baseDistance = redGPUContext.detector.isMobile ? 8 : 10;

			controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
		};

		redGPUContext.onResize({
			target: redGPUContext,
			screenRectObject: redGPUContext.screenRectObject,
			pixelRectObject: redGPUContext.pixelRectObject
		});

		controller.centerX = charMesh.x;
		controller.centerY = charMesh.y + 0.3;
		controller.centerZ = charMesh.z;

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, () => {
			charBody.nativeBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			velocity.x = velocity.y = velocity.z = 0;
			if (soldierMesh) {
				soldierMesh.rotationY = 0;
			}
		});
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetFunc) => {
	new RedGPUExampleHelper(redGPUContext, {
		RedGPU,
		directionalShadow: true,
		gui: (pane) => {
			pane.addBlade({
				view: 'text',
				label: 'Move',
				value: 'WASD (Move) / Shift (Run)',
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
		}
	});
};
