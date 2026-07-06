import * as RedGPU from "../../../dist/index.js?t=1783322366074";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1783322366074";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1783322366074";

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
			// HSL 색상을 16진수 HEX 스트링(#RRGGBB)으로 변환하는 헬퍼 함수
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
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// [KO] 환경 구축 (Dense & Compact Test Course)
		// [EN] Environment build (Dense & Compact Test Course)
		createBlock(0, -0.5, 0, 100, 1, 100, '#334155'); // Base Ground (슬레이트 블루그레이)

		// [KO] 중앙 밀집 구역 (Center Complex)
		// 계단 -> 플랫폼 -> 경사로 연결
		for (let i = 0; i < 12; i++) {
			// 파란색 -> 보라색 그라데이션 변형 HSL 색상 적용
			const hue = 220 + (i * 3);
			createBlock(0, i * 0.18, 5 + i * 0.45, 4, 0.2, 0.6, hslToHex(hue, 70, 60));
		}
		createBlock(0, 12 * 0.18, 12, 6, 0.2, 6, '#6d28d9'); // 연결 플랫폼 (퍼플)
		createBlock(0, 12 * 0.18 + 1.4, 20, 6, 0.2, 10, '#db2777', 20, 0, 0); // 플랫폼에서 이어지는 경사로 (메탈릭 로즈/핑크)

		// 나선형 계단을 플랫폼 주변으로 밀착
		const spiralCenterX = 8;
		const spiralCenterZ = 10;
		for (let i = 0; i < 20; i++) {
			const angle = i * 0.5;
			const radius = 3;
			const x = spiralCenterX + Math.cos(angle) * radius;
			const z = spiralCenterZ + Math.sin(angle) * radius;
			// 에메랄드 그린 HSL 그라데이션 적용
			const hue = 140 + (i * 2);
			createBlock(x, i * 0.35, z, 1.5, 0.15, 1.5, hslToHex(hue, 65, 50), 0, -angle * 180 / Math.PI, 0);
		}

		// 파쿠르 코스를 중앙 플랫폼 옆으로 배치
		for (let i = 0; i < 8; i++) {
			// 네온 오렌지 / 골드 계열
			const hue = 30 + (i * 4);
			createBlock(
				-6 - i * 1.8, 
				1 + i * 0.4, 
				8 + (i % 2 === 0 ? 0.8 : -0.8), 
				1.5, 0.15, 1.5,
				hslToHex(hue, 85, 55)
			);
		}

		// 좁은 길을 플랫폼 상단에 교차
		createBlock(-12, 12 * 0.18, 12, 10, 0.15, 0.4, '#06b6d4'); // 좁은 길 (네온 사이언)

		// 입체 구조물을 시작 지점 근처로 당김
		// 피라미드형 계단
		for (let i = 0; i < 8; i++) {
			const size = 12 - i * 1.5;
			// 테크 크롬 그레이 그라데이션
			const lightness = 25 + (i * 5);
			createBlock(-15, i * 0.35, -5, size, 0.4, size, hslToHex(220, 10, lightness));
		}

		// 터널을 중앙 플랫폼 아래에 배치
		createBlock(0, 0.1, 12, 10, 0.1, 10, '#3b202c'); // 터널 바닥 (딥 로즈)
		createBlock(-4, 0, 12, 0.5, 2.5, 10, '#4b5563'); // 벽 1 (스톤 그레이)
		createBlock(4, 0, 12, 0.5, 2.5, 10, '#4b5563'); // 벽 2 (스톤 그레이)
		createBlock(0, 2.5, 12, 10, 0.5, 10, '#9ca3af'); // 지붕 (플랫폼 하단 - 테크 실버)

		// 캐릭터용 물리 구동 캡슐 생성 (가시성을 완전히 끄고 투명화하여 투명 물리 바디로 작동)
		const charMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Capsule(redGPUContext, 0.3, 1.2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		charMesh.material.transparent = true;
		charMesh.material.opacity = 0.0;
		charMesh.visible = false;
		charMesh.y = 5;
		scene.addChild(charMesh);

		// [KO] GLTF 캐릭터 로딩
		// [EN] GLTF Character Loading
		let soldierMesh = null;
		let stateMachine = null;
		let targetStateName = 'Idle';
		let lastTime = null;

		const MODEL_URL = 'https://threejs.org/examples/models/gltf/Soldier.glb';
		new RedGPU.GLTFLoader(
			redGPUContext,
			MODEL_URL,
			(loader) => {
				soldierMesh = loader.resultMesh;
				soldierMesh.setCastShadowRecursively(true);
				soldierMesh.setReceiveShadowRecursively(true);

				// Soldier.glb의 기본 앞면 각도 정렬 (0도)
				scene.addChild(soldierMesh);

				// ── 애니메이션 클립 매핑 ─────────
				const clips = loader.parsingResult.animations;
				if (clips && clips.length > 0) {
					const idleState = clips[0];
					const runState = clips[1];
					const walkState = clips[3] || clips[2];

					idleState.name = 'Idle';
					walkState.name = 'Walk';
					runState.name = 'Run';

					// ── 상태 머신 ──────────────────
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
		
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 6; // 3인칭 밀착형 줌 조절 (keyboardCharacterControl 스타일)
		controller.tilt = -15; // 3인칭 밀착형 틸트 조절 (keyboardCharacterControl 스타일)
		controller.minDistance = 2.5;  // 최소 줌인 한계
		controller.maxDistance = 15;  // 최대 줌아웃 한계
		controller.minTilt = -75;    // 땅 밑을 과도하게 뚫어보지 않도록 틸트 하한 제한
		controller.maxTilt = -5;     // 수평보다 약간 아래까지만 가능하도록 상한 제한

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] IBL 및 스카이박스 설정
		// [EN] Setup IBL and SkyBox
		const iblUrl = '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
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

			// Shift 달리기 체크
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

			// [KO] gltf 캐릭터 위치 및 회전 업데이트
			// [EN] Update gltf character position and rotation
			if (soldierMesh) {
				soldierMesh.x = charMesh.x;
				soldierMesh.y = charMesh.y - 0.9; // 캡슐 중심에서 아래로 0.9m 오프셋 정렬 (발바닥 위치)
				soldierMesh.z = charMesh.z;

				const speedXZ = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);

				// 이동 속도 벡터 방향으로 회전 보간 (Orient Rotation to Movement)
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

				// 상태 머신용 전이 조건 상태 갱신
				if (isRunning && speedXZ > 0.01) targetStateName = 'Run';
				else if (speedXZ > 0.005) targetStateName = 'Walk';
				else targetStateName = 'Idle';
			}

			// 카메라가 캐릭터의 중심보다 약간 위(Y축 +0.3m 오프셋)를 스무스하게 따라가도록 업데이트 (3인칭 카메라 Lerp)
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

			// 화면 비율에 맞춰 카메라 거리 자동 조절
			controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
		};

		// 초기 리사이즈 실행
		redGPUContext.onResize({
			target: redGPUContext,
			screenRectObject: redGPUContext.screenRectObject,
			pixelRectObject: redGPUContext.pixelRectObject
		});

		// 초기 1회 카메라 센터 지정 (Lerp에 의한 오프닝 카메라 딜레이 방지)
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetFunc
 */
const renderTestPane = async (redGPUContext, resetFunc) => {
	new RedGPUExampleHelper(redGPUContext, {
		RedGPU,
		skybox: true,
		ibl: true,
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
