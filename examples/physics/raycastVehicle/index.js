import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Raycast Vehicle 예제
 * [EN] Raycast Vehicle example
 *
 * [KO] 레이캐스트를 이용한 차량 시뮬레이션(서스펜션, 마찰력 등)을 보여줍니다.
 * [EN] Demonstrates vehicle simulation using raycasting (suspension, friction, etc.).
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45; controller.tilt = -25; controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = false;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// Lighting
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.4;
		scene.lightManager.ambientLight = ambientLight;
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 20; directionalLight.y = 40; directionalLight.z = 20;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. Ground
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = 500; ground.scaleY = 10; ground.scaleZ = 500;
		ground.y = -5;
		ground.material.color.setColorByHEX('#888');
		scene.addChild(ground);
		physicsEngine.createBody(ground, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, friction: 1.0 });

		// 2. Chassis
		const chassisMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		chassisMesh.scaleX = 3; chassisMesh.scaleY = 1; chassisMesh.scaleZ = 6;
		chassisMesh.y = 8;
		chassisMesh.material.color.setColorByHEX('#ff4444');
		scene.addChild(chassisMesh);

		const chassisBody = physicsEngine.createBody(chassisMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 500, 
			linearDamping: 0.1, angularDamping: 6.0,
			enableCCD: true
		});

		// 3. Wheels Setup
		const wheelRadius = 0.8;
		const suspensionRestLength = 1.2;
		const stiffness = 8000.0;
		const damping = 400.0;
		const lateralGrip = 0.9;
		
		const wheelLocalOffsets = [
			{ x: 1.8, y: 0.5, z: 2.2 },  { x: -1.8, y: 0.5, z: 2.2 }, 
			{ x: 1.8, y: 0.5, z: -2.2 }, { x: -1.8, y: 0.5, z: -2.2 }
		];

		// [KO] 계층 구조 바퀴 생성 (Pivot -> Mesh)
		const wheelContainers = wheelLocalOffsets.map(() => {
			const pivot = new RedGPU.Display.Group3D(); // [KO] Scene 대신 Group3D 사용 [EN] Use Group3D instead of Scene
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Cylinder(redGPUContext, wheelRadius, wheelRadius, 0.6, 24),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.rotationZ = 90; // 기본 눕힘
			mesh.material.color.setColorByHEX('#222');
			pivot.addChild(mesh);
			scene.addChild(pivot);
			return { pivot, mesh };
		});

		const keyboardBuffer = redGPUContext.keyboardKeyBuffer;

		let steerAngle = 0;
		let wheelSpin = 0;

		const updateVehicle = () => {
			let forward = 0;
			let right = 0;
			if (keyboardBuffer.w || keyboardBuffer.W || keyboardBuffer.ArrowUp) forward = 1;
			if (keyboardBuffer.s || keyboardBuffer.S || keyboardBuffer.ArrowDown) forward = -1;
			if (keyboardBuffer.a || keyboardBuffer.A || keyboardBuffer.ArrowLeft) right = -1;
			if (keyboardBuffer.d || keyboardBuffer.D || keyboardBuffer.ArrowRight) right = 1;

			const body = chassisBody.nativeBody;
			const pos = body.translation();
			const rot = body.rotation();
			const q = RedGPU.Math.quat.fromValues(rot.x, rot.y, rot.z, rot.w);

			const localUp = RedGPU.Math.vec3.fromValues(0, 1, 0);
			const localForward = RedGPU.Math.vec3.fromValues(0, 0, 1);
			const localRight = RedGPU.Math.vec3.fromValues(1, 0, 0);
			RedGPU.Math.vec3.transformQuat(localUp, localUp, q);
			RedGPU.Math.vec3.transformQuat(localForward, localForward, q);
			RedGPU.Math.vec3.transformQuat(localRight, localRight, q);

			steerAngle += (right * 30 - steerAngle) * 0.1;
			const currentVel = body.linvel();
			const speed = RedGPU.Math.vec3.dot(RedGPU.Math.vec3.fromValues(currentVel.x, currentVel.y, currentVel.z), localForward);
			wheelSpin += speed * 2.0;

			wheelContainers.forEach((container, i) => {
				const offset = wheelLocalOffsets[i];
				const attachVec = RedGPU.Math.vec3.fromValues(offset.x, offset.y, offset.z);
				RedGPU.Math.vec3.transformQuat(attachVec, attachVec, q);
				const worldAttachPos = { x: attachVec[0] + pos.x, y: attachVec[1] + pos.y, z: attachVec[2] + pos.z };

				const rayDir = RedGPU.Math.vec3.fromValues(0, -1, 0);
				RedGPU.Math.vec3.transformQuat(rayDir, rayDir, q);
				const ray = new RAPIER.Ray(worldAttachPos, { x: rayDir[0], y: rayDir[1], z: rayDir[2] });
				
				const hit = physicsEngine.nativeWorld.castRay(ray, 5.0, true, undefined, undefined, undefined, chassisBody.nativeCollider);

				const { pivot, mesh } = container;
				if (hit) {
					const contactDist = hit.timeOfImpact;
					const limitedDist = Math.min(contactDist, suspensionRestLength + 0.5);
					const compression = (suspensionRestLength + 0.5) - limitedDist;

					if (compression > 0) {
						const worldContactPos = { 
							x: worldAttachPos.x + rayDir[0] * contactDist, 
							y: worldAttachPos.y + rayDir[1] * contactDist, 
							z: worldAttachPos.z + rayDir[2] * contactDist 
						};
						const velAtPoint = body.velocityAtPoint(worldContactPos);
						
						// 서스펜션 힘
						const relVelUp = RedGPU.Math.vec3.dot(RedGPU.Math.vec3.fromValues(velAtPoint.x, velAtPoint.y, velAtPoint.z), localUp);
						const suspMag = (compression * stiffness) - (relVelUp * damping);
						body.applyImpulseAtPoint({ x: localUp[0] * suspMag * (1/60), y: localUp[1] * suspMag * (1/60), z: localUp[2] * suspMag * (1/60) }, worldContactPos, true);

						// 횡마찰 조향
						const wheelRight = RedGPU.Math.vec3.clone(localRight);
						if (i < 2) {
							const steerQ = RedGPU.Math.quat.create();
							RedGPU.Math.quat.setAxisAngle(steerQ, localUp, -steerAngle * (Math.PI / 180));
							RedGPU.Math.vec3.transformQuat(wheelRight, wheelRight, steerQ);
						}
						const lateralVel = RedGPU.Math.vec3.dot(RedGPU.Math.vec3.fromValues(velAtPoint.x, velAtPoint.y, velAtPoint.z), wheelRight);
						const lateralImpulseMag = -lateralVel * body.mass() * lateralGrip * (1/60);
						body.applyImpulseAtPoint({ x: wheelRight[0] * lateralImpulseMag, y: wheelRight[1] * lateralImpulseMag, z: wheelRight[2] * lateralImpulseMag }, worldContactPos, true);

						// [엔진 구동 - 차체 중심 방향으로 힘 분산]
						if (i >= 2 && forward !== 0) {
							const driveImpulseMag = forward * 12000 * (1/60);
							// [KO] 접점이 아닌 차체 중심 높이로 힘의 작용점을 올려 앞들림 방지
							const centerDrivePos = { x: worldContactPos.x, y: pos.y, z: worldContactPos.z };
							body.applyImpulseAtPoint({ x: localForward[0] * driveImpulseMag, y: localForward[1] * driveImpulseMag, z: localForward[2] * driveImpulseMag }, centerDrivePos, true);
						}
					}

					pivot.x = worldAttachPos.x + rayDir[0] * (limitedDist - wheelRadius);
					pivot.y = worldAttachPos.y + rayDir[1] * (limitedDist - wheelRadius);
					pivot.z = worldAttachPos.z + rayDir[2] * (limitedDist - wheelRadius);
				} else {
					const dropDist = suspensionRestLength + 0.5;
					pivot.x = worldAttachPos.x + rayDir[0] * (dropDist - wheelRadius);
					pivot.y = worldAttachPos.y + rayDir[1] * (dropDist - wheelRadius);
					pivot.z = worldAttachPos.z + rayDir[2] * (dropDist - wheelRadius);
				}
				
				// [KO] 회전 분리 적용
				pivot.rotationX = chassisMesh.rotationX;
				pivot.rotationY = chassisMesh.rotationY + (i < 2 ? -steerAngle : 0);
				pivot.rotationZ = chassisMesh.rotationZ;
				
				mesh.rotationX = wheelSpin; // 바퀴는 피벗 안에서 굴러가기만 함
			});

			// 각속도 안전 억제
			const angVel = body.angvel();
			if (Math.abs(angVel.y) > 3) body.setAngvel({ x: angVel.x, y: angVel.y * 0.95, z: angVel.z }, true);
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, updateVehicle);
		renderTestPane(redGPUContext, chassisBody);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {object} chassisBody
 */
const renderTestPane = async (redGPUContext, chassisBody) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Vehicle' }).on('click', () => {
		chassisBody.nativeBody.setTranslation({ x: 0, y: 10, z: 0 }, true);
		chassisBody.nativeBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
		chassisBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		chassisBody.nativeBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
	});
};