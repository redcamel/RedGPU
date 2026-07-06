import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1783322366074";
import * as RedGPU from "../../../dist/index.js?t=1783322366074";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1783322366074";

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
		controller.distance = 6; // 3인칭 밀착형 줌 조절 (keyboardCharacterControl 스타일)
		controller.tilt = -15; // 3인칭 밀착형 틸트 조절 (keyboardCharacterControl 스타일)
		controller.minDistance = 2.5;  // 최소 줌인 한계
		controller.maxDistance = 15;  // 최대 줌아웃 한계
		controller.minTilt = -75;    // 땅 밑을 과도하게 뚫어보지 않도록 틸트 하한 제한
		controller.maxTilt = -5;     // 수평보다 약간 아래까지만 가능하도록 상한 제한

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] IBL 및 스카이박스 설정
		// [EN] Setup IBL and SkyBox
		const iblUrl = '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
		const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl, 10000);
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

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

		// [KO] 지형 생성 함수 (현실적인 미터 단위)
		// [EN] Helper function to create static terrain (realistic meter scale)
		const createStatic = (geometry, x, y, z, sx, sy, sz, rx = 0, color = '#334155') => {
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
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		// 바닥 (30m x 30m)
		createStatic(new RedGPU.Primitive.Box(redGPUContext), 0, -0.5, 0, 30, 1, 30, 0, '#334155');
		// 경사로 (폭 5m, 길이 8m)
		createStatic(new RedGPU.Primitive.Box(redGPUContext), -6, 0.5, 8, 5, 0.5, 8, -20, '#db2777');
		// 계단 (높이 0.2m 간격)
		for (let i = 0; i < 5; i++) {
			const hue = 30 + (i * 8);
			createStatic(
				new RedGPU.Primitive.Box(redGPUContext),
				6,
				i * 0.2,
				-5 + (i * 1.5),
				2,
				0.4,
				1.5,
				0,
				hslToHex(hue, 90, 55)
			);
		}

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

				scene.addChild(soldierMesh);

				// ── 애니메이션 클립 매핑 ─────────
				const clips = loader.parsingResult.animations;
				// Soldier.glb: 0=Idle, 1=Run, 2=TPose, 3=Walk
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

					const BLEND = 0.25; // 전이 시간 (초)

					// Idle ↔ Walk ↔ Run 전이 그래프
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

					// 기존 자동 재생 정지 후, 재생 시작 + 상태 머신 주입
					loader.stopAnimation();
					loader.playAnimation(idleState);
					if (loader.activeAnimations.length > 0) {
						loader.activeAnimations[0].animStateMachine = stateMachine;
					}
				}
			},
			RedGPUExampleHelper.loadingProgressInfoHandler
		);

		// [KO] 캐릭터 물리 앵커 캡슐 생성 (가시성 및 렌더링을 완전히 꺼서 숨김)
		// [EN] Create character physics anchor capsule (Hide completely by disabling visibility)
		const charMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Capsule(redGPUContext, 0.3, 1.2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		charMesh.material.transparent = true;
		charMesh.material.opacity = 0.0; // 캡슐을 완전히 투명하게 설정
		charMesh.visible = false; // 가시성을 꺼서 렌더링에서 완전히 스킵
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
			if (soldierMesh) {
				soldierMesh.rotationY = 0;
			}
		};

		const renderer = new RedGPU.Renderer();
		const render = (time) => {
			const dt = lastTime !== null ? (time - lastTime) / 1000 : 0;
			lastTime = time;

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

			// Shift 달리기 체크
			const isRunning = len > 0 && (keyboardBuffer.shift || keyboardBuffer.Shift);
			const currentSpeed = isRunning ? 0.3 : speed;

			movement.x = (fX * -inputZ + rX * inputX) * currentSpeed;
			movement.z = (fZ * -inputZ + rZ * inputX) * currentSpeed;
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

			// [KO] gltf 캐릭터 위치 및 회전 업데이트
			// [EN] Update gltf character position and rotation
			if (soldierMesh) {
				soldierMesh.x = charMesh.x;
				soldierMesh.y = charMesh.y - 0.9; // 캡슐 중심에서 아래로 0.9m 오프셋 정렬 (발바닥 위치)
				soldierMesh.z = charMesh.z;

				// 이동 벡터 방향으로 자연스럽게 회전 (Orient Rotation to Movement)
				if (len > 0 && dt > 0) {
					const targetYawRad = Math.atan2(-movement.x, -movement.z);
					const targetYawDeg = targetYawRad * (180 / Math.PI);
					const desiredRotationY = targetYawDeg;

					let diff = (desiredRotationY - soldierMesh.rotationY) % 360;
					if (diff > 180) diff -= 360;
					if (diff < -180) diff += 360;

					const factor = 1 - Math.exp(-8.0 * dt);
					soldierMesh.rotationY += diff * factor;
				}

				// 상태 머신용 전이 조건 상태 갱신
				if (isRunning) targetStateName = 'Run';
				else if (len > 0) targetStateName = 'Walk';
				else targetStateName = 'Idle';
			}

			// [KO] 카메라가 캐릭터의 가슴/허리 높이(Y축 +1.2m 오프셋)를 스무스하게 따라가도록 업데이트 (3인칭 카메라 Lerp)
			// [EN] Smoothly update camera to follow the character's waist/chest height (+1.2m offset) (3rd person camera Lerp)
			const lerpFactor = 0.1;
			controller.centerX += (charMesh.x - controller.centerX) * lerpFactor;
			controller.centerY += ((charMesh.y + 1.2) - controller.centerY) * lerpFactor;
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
		controller.centerY = charMesh.y + 1.2;
		controller.centerZ = charMesh.z;

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
	
	new RedGPUExampleHelper(redGPUContext, {
		RedGPU,
		skybox: true,
		ibl: true,
		gui: (pane) => {

			pane.addBlade({
				view: 'text',
				label: 'Control',
				value: 'WASD (Move) / Shift (Run)',
				parse: (v) => v,
				readonly: true
			});
			pane.addButton({ title: 'Reset Character' }).on('click', () => resetCharacter());
		}
	});
};
