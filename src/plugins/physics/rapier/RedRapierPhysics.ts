import * as RAPIER from '@dimforge/rapier3d-compat';
import { mat4, quat, vec3 } from 'gl-matrix';
import Mesh from '../../../display/mesh/Mesh';
import { BodyParams, IPhysicsEngine } from '../../../physics/IPhysicsEngine';
import { PHYSICS_SHAPE, PhysicsShape } from '../../../physics/PhysicsShape';
import { PHYSICS_BODY_TYPE } from '../../../physics/PhysicsBodyType';
import { RapierBody } from './RapierBody';

/**
 * [KO] Rapier(WASM)를 사용하는 물리 엔진 플러그인 구현체입니다.
 * [EN] Physics engine plugin implementation using Rapier (WASM).
 *
 * @category Physics
 */
export class RedRapierPhysics implements IPhysicsEngine {
	#world: RAPIER.World;
	#bodies: Map<any, RapierBody> = new Map();
	#eventQueue: RAPIER.EventQueue;
	#onCollisionStarted: (handle1: number, handle2: number) => void;

	get RAPIER(): any { return RAPIER; }

	set onCollisionStarted(callback: (handle1: number, handle2: number) => void) {
		this.#onCollisionStarted = callback;
	}

	get nativeWorld(): RAPIER.World { return this.#world; }

	/**
	 * [KO] 현재 관리 중인 모든 물리 바디들의 리스트를 반환합니다.
	 * [EN] Returns a list of all physics bodies currently being managed.
	 */
	get bodies(): RapierBody[] {
		return Array.from(this.#bodies.values());
	}

	async init(): Promise<void> {
		await RAPIER.init();
		const gravity = { x: 0.0, y: -9.81, z: 0.0 };
		this.#world = new RAPIER.World(gravity);
		this.#eventQueue = new RAPIER.EventQueue(true);
	}

	step(deltaTime: number): void {
		if (this.#world) {
			this.#world.timestep = deltaTime;
			this.#world.step(this.#eventQueue);

			if (this.#onCollisionStarted) {
				this.#eventQueue.drainCollisionEvents((h1, h2, started) => {
					if (started) this.#onCollisionStarted(h1, h2);
				});
			}

			for (const body of this.#bodies.values()) {
				if (!body.nativeBody.isFixed()) {
					body.syncToMesh();
				}
			}
		}
	}

	createBody(mesh: Mesh, params: BodyParams): RapierBody {
		const rigidBodyDesc = this.#createRigidBodyDesc(params, mesh);
		const rigidBody = this.#world.createRigidBody(rigidBodyDesc);

		const colliders: RAPIER.Collider[] = [];
		this.#createCollidersRecursively(mesh, rigidBody, params, colliders);

		if (params.linearDamping !== undefined) rigidBody.setLinearDamping(params.linearDamping);
		if (params.angularDamping !== undefined) rigidBody.setAngularDamping(params.angularDamping);
		if (params.enableCCD !== undefined) rigidBody.enableCcd(params.enableCCD);

		const body = new RapierBody(mesh, rigidBody, colliders[0] || null);
		this.#bodies.set(rigidBody.handle, body);

		return body;
	}

	#createCollidersRecursively(
		rootMesh: Mesh,
		rigidBody: RAPIER.RigidBody,
		params: BodyParams,
		outColliders: RAPIER.Collider[],
		currentMesh: Mesh = rootMesh,
		accumRelPos: vec3 = vec3.fromValues(0, 0, 0),
		accumRelQuat: quat = quat.fromValues(0, 0, 0, 1),
		accumRelScale: vec3 = vec3.fromValues(1, 1, 1)
	) {
		const localPos = vec3.fromValues(currentMesh.x || 0, currentMesh.y || 0, currentMesh.z || 0);
		const localQuat = quat.create();
		quat.fromEuler(localQuat, currentMesh.rotationX || 0, currentMesh.rotationY || 0, currentMesh.rotationZ || 0);
		const localScale = vec3.fromValues(
			currentMesh.scaleX !== undefined ? currentMesh.scaleX : 1,
			currentMesh.scaleY !== undefined ? currentMesh.scaleY : 1,
			currentMesh.scaleZ !== undefined ? currentMesh.scaleZ : 1
		);

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
		this.#bodies.delete(body.nativeBody.handle);
	}

	setGravity(x: number, y: number, z: number): void {
		this.#world.gravity = { x, y, z };
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
			case PHYSICS_BODY_TYPE.KINEMATIC: desc = RAPIER.RigidBodyDesc.kinematicPositionBased(); break;
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
			case PHYSICS_SHAPE.SPHERE: desc = RAPIER.ColliderDesc.ball(Math.max(hx, hy, hz)); break;
			case PHYSICS_SHAPE.CAPSULE: desc = RAPIER.ColliderDesc.capsule(hy, Math.max(hx, hz)); break;
			case PHYSICS_SHAPE.CYLINDER: desc = RAPIER.ColliderDesc.cylinder(hy, Math.max(hx, hz)); break;
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
