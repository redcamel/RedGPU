import RAPIER from '@dimforge/rapier3d-compat';
import { quat, vec3 } from 'gl-matrix';
import Mesh from '../../../display/mesh/Mesh';
import { BodyParams, IPhysicsEngine } from '../../../physics/IPhysicsEngine';
import { PHYSICS_BODY_TYPE } from '../../../physics/PhysicsBodyType';
import { PHYSICS_SHAPE } from '../../../physics/PhysicsShape';
import { RapierBody } from './RapierBody';

/**
 * [KO] Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인입니다.
 * [EN] RedGPU physics plugin using the Rapier physics engine.
 *
 * @category Physics
 */
export class RapierPhysics implements IPhysicsEngine {
	#world: RAPIER.World;
	#bodies: Map<number, RapierBody> = new Map();
	#eventQueue: RAPIER.EventQueue;

	/**
	 * [KO] 충돌 시작 콜백
	 * [EN] Collision started callback
	 */
	onCollisionStarted: (handle1: number, handle2: number) => void;

	get nativeWorld(): RAPIER.World { return this.#world; }
	get RAPIER(): typeof RAPIER { return RAPIER; }
	get bodies(): RapierBody[] { return Array.from(this.#bodies.values()); }

	/**
	 * [KO] 콜라이더 핸들을 통해 RapierBody를 반환합니다.
	 * [EN] Returns RapierBody through the collider handle.
	 * @param handle - [KO] 콜라이더 핸들 [EN] Collider handle
	 */
	getBodyByColliderHandle(handle: number): RapierBody {
		return this.#bodies.get(handle);
	}

	async init(): Promise<void> {
		await RAPIER.init();
		this.#world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
		this.#eventQueue = new RAPIER.EventQueue(true);
	}

	step(deltaTime: number): void {
		if (!this.#world) return;
		this.#world.step(this.#eventQueue);

		// 충돌 이벤트 처리
		this.#eventQueue.drainCollisionEvents((h1, h2, started) => {
			if (started && this.onCollisionStarted) this.onCollisionStarted(h1, h2);
		});

		// 물리 바디 -> 메쉬 동기화
		this.#bodies.forEach(body => body.syncToMesh());
	}

	createBody(mesh: Mesh, params: BodyParams): RapierBody {
		const rigidBodyDesc = this.#createRigidBodyDesc(params, mesh);
		const rigidBody = this.#world.createRigidBody(rigidBodyDesc);

		const colliders: RAPIER.Collider[] = [];
		// [KO] 메쉬 본체 및 모든 자식 메쉬를 순회하며 콜라이더 생성 (복합 형상 지원)
		// [EN] Create colliders by traversing the mesh and all its children (Supports compound shapes)
		this.#createCollidersRecursively(mesh, rigidBody, params, colliders, mesh);

		const body = new RapierBody(mesh, rigidBody, colliders[0]);
		// [KO] 콜라이더 핸들을 키로 저장 (충돌 이벤트 시 조회를 위함)
		// [EN] Store using the collider handle as a key (for lookup during collision events)
		this.#bodies.set(colliders[0].handle, body);

		// 초기 동기화
		body.syncToMesh();
		return body;
	}

	#createCollidersRecursively(
		rootMesh: Mesh,
		rigidBody: RAPIER.RigidBody,
		params: BodyParams,
		outColliders: RAPIER.Collider[],
		currentMesh: Mesh,
		accumRelPos = vec3.create(),
		accumRelQuat = quat.create(),
		accumRelScale = vec3.fromValues(1, 1, 1)
	) {
		const localPos = vec3.fromValues(currentMesh.x || 0, currentMesh.y || 0, currentMesh.z || 0);
		const localQuat = quat.create();
		quat.fromEuler(localQuat, currentMesh.rotationX || 0, currentMesh.rotationY || 0, currentMesh.rotationZ || 0);
		const localScale = vec3.fromValues(currentMesh.scaleX || 1, currentMesh.scaleY || 1, currentMesh.scaleZ || 1);

		let currentRelPos = vec3.create();
		let currentRelQuat = quat.create();
		let currentRelScale = vec3.create();

		if (currentMesh === rootMesh) {
			vec3.set(currentRelPos, 0, 0, 0);
			quat.identity(currentRelQuat);
			vec3.copy(currentRelScale, localScale);
		} else {
			const offset = vec3.create();
			vec3.multiply(offset, localPos, accumRelScale);
			vec3.transformQuat(offset, offset, accumRelQuat);
			vec3.add(currentRelPos, accumRelPos, offset);

			quat.multiply(currentRelQuat, accumRelQuat, localQuat);
			vec3.multiply(currentRelScale, accumRelScale, localScale);
		}

		if (currentMesh.geometry) {
			const colliderDesc = this.#createColliderDesc(params, currentMesh, currentRelScale);
			colliderDesc.setTranslation(currentRelPos[0], currentRelPos[1], currentRelPos[2]);
			colliderDesc.setRotation({ x: currentRelQuat[0], y: currentRelQuat[1], z: currentRelQuat[2], w: currentRelQuat[3] });
			
			const collider = this.#world.createCollider(colliderDesc, rigidBody);
			outColliders.push(collider);
		}

		for (const child of currentMesh.children) {
			this.#createCollidersRecursively(rootMesh, rigidBody, params, outColliders, child, currentRelPos, currentRelQuat, currentRelScale);
		}
	}

	removeBody(body: RapierBody): void {
		this.#world.removeRigidBody(body.nativeBody);
		this.#bodies.delete(body.nativeCollider.handle);
	}

	get gravity(): { x: number, y: number, z: number } {
		return this.#world.gravity;
	}

	set gravity(value: { x: number, y: number, z: number }) {
		this.#world.gravity = value;
	}

	createCharacterController(offset: number): RAPIER.KinematicCharacterController {
		const controller = this.#world.createCharacterController(offset);
		// [KO] 기본 설정: 경사로 오르기, 계단 오르기 활성화
		// [EN] Default settings: enable slope and stair climbing
		controller.enableAutostep(0.5, 0.2, true); // 최대 높이 0.5, 최소 너비 0.2
		controller.enableSnapToGround(0.5);
		return controller;
	}

	#createRigidBodyDesc(params: BodyParams, mesh: Mesh): RAPIER.RigidBodyDesc {
		let desc: RAPIER.RigidBodyDesc;
		switch (params.type) {
			case PHYSICS_BODY_TYPE.STATIC: desc = RAPIER.RigidBodyDesc.fixed(); break;
			case PHYSICS_BODY_TYPE.KINEMATIC:
			case PHYSICS_BODY_TYPE.KINEMATIC_POSITION: desc = RAPIER.RigidBodyDesc.kinematicPositionBased(); break;
			case PHYSICS_BODY_TYPE.KINEMATIC_VELOCITY: desc = RAPIER.RigidBodyDesc.kinematicVelocityBased(); break;
			case PHYSICS_BODY_TYPE.DYNAMIC:
			default: desc = RAPIER.RigidBodyDesc.dynamic(); break;
		}
		
		const worldPos = vec3.fromValues(mesh.x || 0, mesh.y || 0, mesh.z || 0);
		const worldQuat = quat.create();
		quat.fromEuler(worldQuat, mesh.rotationX || 0, mesh.rotationY || 0, mesh.rotationZ || 0);

		// [KO] 부모 계층을 순회하며 전역 트랜스폼 계산 (Scene 등 모든 컨테이너 고려)
		// [EN] Calculate global transform by traversing parent hierarchy (Consider all containers including Scene)
		let parent: any = mesh.parent;
		while (parent) {
			// [KO] 부모가 트랜스폼 속성을 가지고 있는 경우에만 누적 계산
			// [EN] Accumulate only if the parent has transform properties
			const px = parent.x || 0;
			const py = parent.y || 0;
			const pz = parent.z || 0;
			const prX = parent.rotationX || 0;
			const prY = parent.rotationY || 0;
			const prZ = parent.rotationZ || 0;
			const psX = parent.scaleX !== undefined ? parent.scaleX : 1;
			const psY = parent.scaleY !== undefined ? parent.scaleY : 1;
			const psZ = parent.scaleZ !== undefined ? parent.scaleZ : 1;

			const parentPos = vec3.fromValues(px, py, pz);
			const parentQuat = quat.create();
			quat.fromEuler(parentQuat, prX, prY, prZ);
			const parentScale = vec3.fromValues(psX, psY, psZ);

			vec3.multiply(worldPos, worldPos, parentScale);
			vec3.transformQuat(worldPos, worldPos, parentQuat);
			vec3.add(worldPos, worldPos, parentPos);
			quat.multiply(worldQuat, parentQuat, worldQuat);

			parent = parent.parent;
		}

		desc.setTranslation(worldPos[0], worldPos[1], worldPos[2]);
		desc.setRotation({ x: worldQuat[0], y: worldQuat[1], z: worldQuat[2], w: worldQuat[3] });

		// [KO] 추가 물리 속성 설정 (감쇠, CCD 등)
		// [EN] Set additional physics properties (Damping, CCD, etc.)
		if (params.linearDamping !== undefined) desc.setLinearDamping(params.linearDamping);
		if (params.angularDamping !== undefined) desc.setAngularDamping(params.angularDamping);
		if (params.enableCCD !== undefined) desc.setCcdEnabled(params.enableCCD);

		return desc;
	}

	#createColliderDesc(params: BodyParams, mesh: Mesh, worldScale: vec3): RAPIER.ColliderDesc {
		const shapeType = params.shape || PHYSICS_SHAPE.BOX;

		if (shapeType === PHYSICS_SHAPE.MESH) {
			const { vertexBuffer, indexBuffer } = mesh.geometry;
			const { data, interleavedStruct } = vertexBuffer;
			const stride = interleavedStruct.arrayStride / 4;
			const numVertices = vertexBuffer.vertexCount;
			const positions = new Float32Array(numVertices * 3);
			
			for (let i = 0; i < numVertices; i++) {
				const offset = i * stride;
				positions[i * 3 + 0] = data[offset] * worldScale[0];
				positions[i * 3 + 1] = data[offset + 1] * worldScale[1];
				positions[i * 3 + 2] = data[offset + 2] * worldScale[2];
			}
			
			if (indexBuffer) {
				const indices = new Uint32Array(indexBuffer.data);
				return RAPIER.ColliderDesc.trimesh(positions, indices);
			} else {
				return RAPIER.ColliderDesc.convexHull(positions);
			}
		}

		const volume = mesh.geometry.volume;
		const hx = Math.max(0.01, (volume.xSize / 2) * worldScale[0]);
		const hy = Math.max(0.01, (volume.ySize / 2) * worldScale[1]);
		const hz = Math.max(0.01, (volume.zSize / 2) * worldScale[2]);

		let desc: RAPIER.ColliderDesc;
		switch (shapeType) {
			case PHYSICS_SHAPE.SPHERE: {
				// [KO] 모든 방향의 스케일 중 가장 큰 값을 반지름으로 사용
				// [EN] Use the maximum of all scaled dimensions as the radius
				desc = RAPIER.ColliderDesc.ball(Math.max(hx, hy, hz));
				break;
			}
			case PHYSICS_SHAPE.CAPSULE: {
				// [KO] 반지름은 X, Z 중 큰 값을 사용하고, 실린더 절반 높이는 전체 높이(hy)에서 반지름을 뺀 값 사용
				// [EN] Use the max of X and Z for radius, and calculate half-height by subtracting radius from total height (hy)
				const radius = Math.max(hx, hz);
				const halfHeight = Math.max(0, hy - radius);
				desc = RAPIER.ColliderDesc.capsule(halfHeight, radius);
				break;
			}
			case PHYSICS_SHAPE.CYLINDER: {
				// [KO] 반지름은 X, Z 중 큰 값을 사용하고, 높이는 hy(절반 높이) 사용
				// [EN] Use the max of X and Z for radius, and hy for half-height
				desc = RAPIER.ColliderDesc.cylinder(hy, Math.max(hx, hz));
				break;
			}
			case PHYSICS_SHAPE.HEIGHTFIELD: {
				if (!params.heightData) {
					throw new Error('[RedGPU] heightData is required for PHYSICS_SHAPE.HEIGHTFIELD');
				}
				const { nrows, ncols, heights, scale } = params.heightData;
				desc = RAPIER.ColliderDesc.heightfield(nrows, ncols, heights, new RAPIER.Vector3(scale.x, scale.y, scale.z));
				
				// [KO] Rapier heightfield는 기본적으로 최소 코너가 (0,0,0)에 위치합니다.
				// [EN] Rapier heightfield is basically located with the minimum corner at (0,0,0).
				// [KO] 중앙 정렬을 위해 전체 크기의 절반만큼 음수 방향으로 오프셋을 설정합니다.
				// [EN] To align the center, set the offset in the negative direction by half the total size.
				desc.setTranslation(-scale.x / 2, 0, -scale.z / 2);
				break;
			}
			case PHYSICS_SHAPE.BOX:
			default: desc = RAPIER.ColliderDesc.cuboid(hx, hy, hz); break;
		}

		if (params.mass !== undefined) desc.setMass(params.mass);
		if (params.friction !== undefined) desc.setFriction(params.friction);
		if (params.restitution !== undefined) desc.setRestitution(params.restitution);
		if (params.isSensor !== undefined) desc.setSensor(params.isSensor);

		return desc;
	}
}