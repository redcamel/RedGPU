import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794640510497";
import * as RedGPU from "../../../dist/index.js?t=1794640510497";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794640510497";

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
        controller.distance = 6;
        controller.tilt = -15;
        controller.minDistance = 2.5;
        controller.maxDistance = 15;
        controller.minTilt = -75;
        controller.maxTilt = -5;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] IBL 및 스카이박스 설정
		// [EN] Setup IBL and SkyBox
		const iblUrl = '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
		const ibl = new RedGPU.Resource.IBL(redGPUContext, iblUrl, 10000);
		view.ibl = ibl;
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
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

		// [KO] 지형 생성 함수 (현실적인 미터 단위)
		// [EN] Helper function to create static terrain (realistic meter scale)
        const createStatic = (geometry, x, y, z, sx, sy, sz, rx = 0, color = '#5a6578') => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				geometry,
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
			);
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

        // [KO] 바닥, 경사로, 계단 지형 생성
        // [EN] Create ground, ramp, and stair terrain
        createStatic(new RedGPU.Primitive.Box(redGPUContext), 0, -0.5, 0, 30, 1, 30, 0, '#5a6578');
        createStatic(new RedGPU.Primitive.Box(redGPUContext), -6, 0.5, 8, 5, 0.5, 8, -20, '#c0487a');
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
                hslToHex(hue, 65, 55)
			);
		}

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

                // [KO] 애니메이션 클립 매핑 및 상태 머신 구성 (0=Idle, 1=Run, 2=TPose, 3=Walk)
                // [EN] Map animation clips and configure state machine (0=Idle, 1=Run, 2=TPose, 3=Walk)
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

        // [KO] 캐릭터 물리 앵커 캡슐 생성 (가시성을 꺼서 숨김)
        // [EN] Create character physics anchor capsule (Hide by disabling visibility)
		const charMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Capsule(redGPUContext, 0.3, 1.2),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		charMesh.y = 3;

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

            // [KO] glTF 캐릭터 위치, 회전 보간 및 상태 머신 갱신
            // [EN] Update glTF character position, rotation interpolation, and state machine
			if (soldierMesh) {
				soldierMesh.x = charMesh.x;
                soldierMesh.y = charMesh.y - 0.9;
				soldierMesh.z = charMesh.z;

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

			controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
		};

		redGPUContext.onResize({
			target: redGPUContext,
			screenRectObject: redGPUContext.screenRectObject,
			pixelRectObject: redGPUContext.pixelRectObject
		});

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

const renderTestPane = async (redGPUContext, resetCharacter) => {
	
	new RedGPUExampleHelper(redGPUContext, {
		RedGPU,
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
