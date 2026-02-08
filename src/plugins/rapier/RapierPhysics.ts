import RAPIER from '@dimforge/rapier3d-compat';
import { quat, vec3 } from 'gl-matrix';
import Mesh from '../../display/mesh/Mesh';
import { BodyParams, IPhysicsEngine } from '../../physics/IPhysicsEngine';
import { PHYSICS_BODY_TYPE } from '../../physics/PhysicsBodyType';
import { PHYSICS_SHAPE } from '../../physics/PhysicsShape';
import { RapierBody } from './RapierBody';

/**
 * [KO] Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.
 * [EN] RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] 이 클래스는 WASM 기반의 Rapier 엔진을 RedGPU 환경에 통합하며, 고성능 물리 시뮬레이션 월드를 관리합니다. 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정과 같은 핵심 물리 기능을 제공합니다.
 * [EN] This class integrates the WASM-based Rapier engine into the RedGPU environment and manages a high-performance physics simulation world. It provides core physics features such as rigid body creation, collision detection, character controllers, and gravity settings.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * * ### Example
 * ```typescript
 * const physics = new RedGPU.Plugins.RapierPhysics();
 * await physics.init();
 * 
 * // 매 프레임 업데이트 (Update every frame)
 * renderer.start(redGPUContext, (time, deltaTime) => {
 *     physics.step(deltaTime / 1000);
 * });
 * ```
 *
 * @see [KO] [물리 플러그인 매뉴얼](/RedGPU/manual/ko/plugins/physics)
 * @see [EN] [Physics Plugin Manual](/RedGPU/manual/en/plugins/physics)
 * @experimental
 * @category RapierPhysics
 */
export class RapierPhysics implements IPhysicsEngine {
	#world: RAPIER.World;
	#bodies: Map<number, RapierBody> = new Map();
	#eventQueue: RAPIER.EventQueue;

	/**
	 * [KO] 물리 엔진에서 충돌이 시작될 때 호출되는 콜백입니다.
	 * [EN] Callback called when a collision starts in the physics engine.
	 *
	 * @param handle1 -
	 * [KO] 첫 번째 충돌체의 핸들
	 * [EN] Handle of the first collider
	 * @param handle2 -
	 * [KO] 두 번째 충돌체의 핸들
	 * [EN] Handle of the second collider
	 */
	onCollisionStarted: (handle1: number, handle2: number) => void;

	/**
	 * [KO] 물리 엔진의 원본 월드(World) 객체를 반환합니다.
	 * [EN] Returns the native World object of the physics engine.
	 * @readonly
	 */
	get nativeWorld(): RAPIER.World { return this.#world; }

	/**
	 * [KO] Rapier 라이브러리 네임스페이스를 반환합니다.
	 * [EN] Returns the Rapier library namespace.
	 * @readonly
	 */
	get RAPIER(): typeof RAPIER { return RAPIER; }

	/**
	 * [KO] 엔진에서 관리 중인 모든 RapierBody 리스트를 반환합니다.
	 * [EN] Returns a list of all RapierBody instances managed by the engine.
	 * @readonly
	 */
	get bodies(): RapierBody[] { return Array.from(this.#bodies.values()); }

	/**
	 * [KO] 콜라이더 핸들을 통해 관리 중인 RapierBody를 찾아서 반환합니다.
	 * [EN] Finds and returns the managed RapierBody using its collider handle.
	 *
	 * * ### Example
	 * ```typescript
	 * const body = physics.getBodyByColliderHandle(handle);
	 * ```
	 *
	 * @param handle -
	 * [KO] 찾을 콜라이더의 고유 핸들
	 * [EN] Unique handle of the collider to find
	 * @returns
	 * [KO] 찾은 RapierBody (없으면 undefined)
	 * [EN] The found RapierBody (undefined if not found)
	 */
	getBodyByColliderHandle(handle: number): RapierBody {
		return this.#bodies.get(handle);
	}

	/**
	 * [KO] Rapier 엔진을 초기화하고 물리 월드를 생성합니다.
	 * [EN] Initializes the Rapier engine and creates the physics world.
	 *
	 * * ### Example
	 * ```typescript
	 * await physics.init();
	 * ```
	 *
	 * @returns
	 * [KO] 초기화 완료를 보장하는 Promise
	 * [EN] Promise that guarantees initialization completion
	 */
	async init(): Promise<void> {
		await RAPIER.init();
		this.#world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
		this.#eventQueue = new RAPIER.EventQueue(true);
	}

	/**
	 * [KO] 물리 시뮬레이션을 한 단계 진행하고 메쉬 트랜스폼을 동기화합니다.
	 * [EN] Steps the physics simulation and synchronizes mesh transforms.
	 *
	 * * ### Example
	 * ```typescript
	 * physics.step(deltaTime / 1000);
	 * ```
	 *
	 * @param deltaTime -
	 * [KO] 프레임 간 시간 간격 (초 단위)
	 * [EN] Time interval between frames (in seconds)
	 */
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

	/**
	 * [KO] 특정 메쉬에 물리 바디를 생성하고 엔진에 등록합니다.
	 * [EN] Creates a physics body for a specific mesh and registers it with the engine.
	 *
	 * * ### Example
	 * ```typescript
	 * const body = physics.createBody(mesh, {
	 *     type: 'dynamic',
	 *     shape: 'sphere',
	 *     mass: 1.0
	 * });
	 * ```
	 *
	 * @param mesh -
	 * [KO] 대상 RedGPU 메쉬
	 * [EN] Target RedGPU mesh
	 * @param params -
	 * [KO] 바디 생성 설정 파라미터
	 * [EN] Parameters for body creation
	 * @returns
	 * [KO] 생성된 RapierBody 인스턴스
	 * [EN] Created RapierBody instance
	 */
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

	/**
	 * [KO] 콜라이더를 재귀적으로 생성합니다.
	 * [EN] Recursively creates colliders.
	 *
	 * @param rootMesh - [KO] 루트 메쉬 [EN] Root mesh
	 * @param rigidBody - [KO] 강체 객체 [EN] Rigid body
	 * @param params - [KO] 바디 설정 [EN] Body parameters
	 * @param outColliders - [KO] 출력 콜라이더 배열 [EN] Output colliders array
	 * @param currentMesh - [KO] 현재 메쉬 [EN] Current mesh
	 * @param accumRelPos - [KO] 누적 상대 위치 [EN] Accumulated relative position
	 * @param accumRelQuat - [KO] 누적 상대 회전 [EN] Accumulated relative quaternion
	 * @param accumRelScale - [KO] 누적 상대 스케일 [EN] Accumulated relative scale
	 * @private
	 */
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

	/**
	 * [KO] 물리 바디를 엔진에서 제거합니다.
	 * [EN] Removes a physics body from the engine.
	 *
	 * * ### Example
	 * ```typescript
	 * physics.removeBody(body);
	 * ```
	 *
	 * @param body -
	 * [KO] 제거할 RapierBody 인스턴스
	 * [EN] RapierBody instance to remove
	 */
	removeBody(body: RapierBody): void {
		this.#world.removeRigidBody(body.nativeBody);
		this.#bodies.delete(body.nativeCollider.handle);
	}

	/**
	 * [KO] 물리 월드의 중력 가속도를 설정하거나 반환합니다.
	 * [EN] Sets or returns the gravity acceleration of the physics world.
	 *
	 * * ### Example
	 * ```typescript
	 * physics.gravity = { x: 0, y: -9.81, z: 0 };
	 * ```
	 */
	get gravity(): { x: number, y: number, z: number } {
		return this.#world.gravity;
	}

	set gravity(value: { x: number, y: number, z: number }) {
		this.#world.gravity = value;
	}

	/**
	 * [KO] 캐릭터 컨트롤러를 생성하여 반환합니다.
	 * [EN] Creates and returns a character controller.
	 *
	 * * ### Example
	 * ```typescript
	 * const controller = physics.createCharacterController(0.1);
	 * ```
	 *
	 * @param offset -
	 * [KO] 캐릭터와 지면 사이의 간격
	 * [EN] Offset between the character and the ground
	 * @returns
	 * [KO] Rapier 캐릭터 컨트롤러 인스턴스
	 * [EN] Rapier character controller instance
	 */
	createCharacterController(offset: number): RAPIER.KinematicCharacterController {
		const controller = this.#world.createCharacterController(offset);
		// [KO] 기본 설정: 경사로 오르기, 계단 오르기 활성화
		// [EN] Default settings: enable slope and stair climbing
		controller.enableAutostep(0.5, 0.2, true); // 최대 높이 0.5, 최소 너비 0.2
		controller.enableSnapToGround(0.5);
		return controller;
	}

	/**
	 * [KO] 강체 설정 기술서를 생성합니다.
	 * [EN] Creates a rigid body description.
	 *
	 * @param params - [KO] 바디 파라미터 [EN] Body parameters
	 * @param mesh - [KO] 메쉬 [EN] Mesh
	 * @returns [KO] 강체 설정 [EN] Rigid body description
	 * @private
	 */
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

	/**
	 * [KO] 콜라이더 설정 기술서를 생성합니다.
	 * [EN] Creates a collider description.
	 *
	 * @param params - [KO] 바디 파라미터 [EN] Body parameters
	 * @param mesh - [KO] 메쉬 [EN] Mesh
	 * @param worldScale - [KO] 월드 스케일 [EN] World scale
	 * @returns [KO] 콜라이더 설정 [EN] Collider description
	 * @private
	 */
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
