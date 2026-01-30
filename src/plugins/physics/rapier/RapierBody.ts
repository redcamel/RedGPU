import RAPIER from '@dimforge/rapier3d-compat';
import { mat4, quat, vec3 } from 'gl-matrix';
import Mesh from '../../../display/mesh/Mesh';
import { IPhysicsBody } from '../../../physics/IPhysicsBody';
import mat4ToEuler from '../../../utils/math/mat4ToEuler';

/**
 * [KO] Rapier 물리 엔진을 위한 IPhysicsBody 구현체입니다.
 * [EN] IPhysicsBody implementation for the Rapier physics engine.
 *
 * [KO] Rapier의 RigidBody와 RedGPU의 Mesh 사이에서 트랜스폼 정보를 동기화하고 제어하는 역할을 합니다.
 * [EN] It synchronizes and controls transform information between Rapier's RigidBody and RedGPU's Mesh.
 *
 * @category Physics
 */
export class RapierBody implements IPhysicsBody {
	#nativeBody: RAPIER.RigidBody;
	#nativeCollider: RAPIER.Collider;
	#mesh: Mesh;

	/**
	 * [KO] RapierBody 생성자
	 * [EN] RapierBody constructor
	 * @param mesh -
	 * [KO] 연결할 RedGPU 메쉬
	 * [EN] RedGPU mesh to connect
	 * @param body -
	 * [KO] Rapier 강체 객체
	 * [EN] Rapier rigid body object
	 * @param collider -
	 * [KO] Rapier 충돌체 객체
	 * [EN] Rapier collider object
	 */
	constructor(mesh: Mesh, body: RAPIER.RigidBody, collider: RAPIER.Collider) {
		this.#mesh = mesh;
		this.#nativeBody = body;
		this.#nativeCollider = collider;
	}

	/**
	 * [KO] 연결된 RedGPU 메쉬를 반환합니다.
	 * [EN] Returns the connected RedGPU mesh.
	 */
	get mesh(): Mesh {
		return this.#mesh;
	}

	/**
	 * [KO] Rapier의 원본 강체(RigidBody) 객체를 반환합니다.
	 * [EN] Returns the native Rapier rigid body object.
	 */
	get nativeBody(): RAPIER.RigidBody {
		return this.#nativeBody;
	}

	/**
	 * [KO] Rapier의 원본 충돌체(Collider) 객체를 반환합니다.
	 * [EN] Returns the native Rapier collider object.
	 */
	get nativeCollider(): RAPIER.Collider {
		return this.#nativeCollider;
	}

	/**
	 * [KO] 물리 바디의 현재 위치를 반환하거나 설정합니다.
	 * [EN] Gets or sets the current position of the physics body.
	 */
	get position(): vec3 {
		const pos = this.#nativeBody.translation();
		return vec3.fromValues(pos.x, pos.y, pos.z);
	}

	set position(value: vec3 | { x: number; y: number; z: number }) {
		if ('x' in value) {
			this.#nativeBody.setTranslation({ x: value.x, y: value.y, z: value.z }, true);
		} else {
			this.#nativeBody.setTranslation({ x: value[0], y: value[1], z: value[2] }, true);
		}
	}

	/**
	 * [KO] 물리 바디의 현재 회전(쿼터니언)을 반환하거나 설정합니다.
	 * [EN] Gets or sets the current rotation (quaternion) of the physics body.
	 */
	get rotation(): quat {
		const rot = this.#nativeBody.rotation();
		return quat.fromValues(rot.x, rot.y, rot.z, rot.w);
	}

	set rotation(value: quat | { x: number; y: number; z: number; w: number }) {
		if ('x' in value) {
			this.#nativeBody.setRotation({ x: value.x, y: value.y, z: value.z, w: value.w }, true);
		} else {
			this.#nativeBody.setRotation({ x: value[0], y: value[1], z: value[2], w: value[3] }, true);
		}
	}

	/**
	 * [KO] 물리 바디의 현재 선속도를 반환하거나 설정합니다.
	 * [EN] Gets or sets the current linear velocity of the physics body.
	 */
	get velocity(): vec3 {
		const vel = this.#nativeBody.linvel();
		return vec3.fromValues(vel.x, vel.y, vel.z);
	}

	set velocity(value: vec3 | { x: number; y: number; z: number }) {
		if ('x' in value) {
			this.#nativeBody.setLinvel({ x: value.x, y: value.y, z: value.z }, true);
		} else {
			this.#nativeBody.setLinvel({ x: value[0], y: value[1], z: value[2] }, true);
		}
	}

	/**
	 * [KO] 물리 바디에 충격량(Impulse)을 적용합니다.
	 * [EN] Applies an impulse to the physics body.
	 * @param force -
	 * [KO] 적용할 힘의 벡터
	 * [EN] Vector of the force to apply
	 */
	applyImpulse(force: vec3 | { x: number; y: number; z: number }): void {
		if ('x' in force) {
			this.#nativeBody.applyImpulse({ x: force.x, y: force.y, z: force.z }, true);
		} else {
			this.#nativeBody.applyImpulse({ x: force[0], y: force[1], z: force[2] }, true);
		}
	}

	/**
	 * [KO] 물리 시뮬레이션의 위치와 회전 정보를 연결된 RedGPU 메쉬에 동기화합니다.
	 * [EN] Synchronizes the physics simulation's position and rotation information to the connected RedGPU mesh.
	 */
	syncToMesh(): void {
		const pos = this.#nativeBody.translation();
		const rot = this.#nativeBody.rotation();

		this.#mesh.x = pos.x;
		this.#mesh.y = pos.y;
		this.#mesh.z = pos.z;

		const q = quat.fromValues(rot.x, rot.y, rot.z, rot.w);
		const m = mat4.create();
		mat4.fromQuat(m, q);

		const euler = [0, 0, 0];
		mat4ToEuler(m, euler);

		const radToDeg = 180 / Math.PI;
		this.#mesh.rotationX = euler[0] * radToDeg;
		this.#mesh.rotationY = euler[1] * radToDeg;
		this.#mesh.rotationZ = euler[2] * radToDeg;
	}
}