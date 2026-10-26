import RAPIER from '@dimforge/rapier3d-compat';
import {mat4, quat, vec3} from 'gl-matrix';
import Mesh from '../../display/mesh/Mesh';
import {IPhysicsBody} from '../../physics/IPhysicsBody';
import mat4ToEuler from '../../math/mat4ToEuler';

/**
 * [KO] Rapier 강체(`RigidBody`)와 RedGPU `Mesh` 간의 트랜스폼을 동기화하고 제어하는 `IPhysicsBody` 구현 클래스입니다.
 * [EN] `IPhysicsBody` implementation class that synchronizes and controls transforms between a Rapier `RigidBody` and a RedGPU `Mesh`.
 *
 * @experimental
 * @category RapierPhysics
 */
export class RapierBody implements IPhysicsBody {
    #nativeBody: RAPIER.RigidBody;
    #nativeCollider: RAPIER.Collider;
    #mesh: Mesh;

    /**
     * [KO] RapierBody 인스턴스를 생성합니다.
     * [EN] Creates a RapierBody instance.
     *
     * @param mesh -
     * [KO] 연동할 RedGPU `Mesh` 인스턴스
     * [EN] RedGPU `Mesh` instance to bind
     * @param body -
     * [KO] Rapier 강체(`RigidBody`) 인스턴스
     * [EN] Rapier `RigidBody` instance
     * @param collider -
     * [KO] Rapier 충돌체(`Collider`) 인스턴스
     * [EN] Rapier `Collider` instance
     */
    constructor(mesh: Mesh, body: RAPIER.RigidBody, collider: RAPIER.Collider) {
        this.#mesh = mesh;
        this.#nativeBody = body;
        this.#nativeCollider = collider;
    }

    /**
     * [KO] 연동된 RedGPU `Mesh` 인스턴스를 반환합니다.
     * [EN] Returns the bound RedGPU `Mesh` instance.
     *
     * @returns
     * [KO] 연동된 `Mesh` 인스턴스
     * [EN] Bound `Mesh` instance
     */
    get mesh(): Mesh {
        return this.#mesh;
    }

    /**
     * [KO] 원본 Rapier 강체(`RigidBody`) 객체를 반환합니다.
     * [EN] Returns the native Rapier `RigidBody` object.
     *
     * @returns
     * [KO] Rapier `RigidBody` 객체
     * [EN] Rapier `RigidBody` object
     */
    get nativeBody(): RAPIER.RigidBody {
        return this.#nativeBody;
    }

    /**
     * [KO] 원본 Rapier 충돌체(`Collider`) 객체를 반환합니다.
     * [EN] Returns the native Rapier `Collider` object.
     *
     * @returns
     * [KO] Rapier `Collider` 객체
     * [EN] Rapier `Collider` object
     */
    get nativeCollider(): RAPIER.Collider {
        return this.#nativeCollider;
    }

    /**
     * [KO] 물리 바디의 월드 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the world position of the physics body.
     *
     * @returns
     * [KO] 월드 위치 벡터 (`vec3`)
     * [EN] World position vector (`vec3`)
     */
    get position(): vec3 {
        const pos = this.#nativeBody.translation();
        return vec3.fromValues(pos.x, pos.y, pos.z);
    }

    set position(value: vec3 | { x: number; y: number; z: number }) {
        if ('x' in value) {
            this.#nativeBody.setTranslation({x: value.x, y: value.y, z: value.z}, true);
        } else {
            this.#nativeBody.setTranslation({x: value[0], y: value[1], z: value[2]}, true);
        }
    }

    /**
     * [KO] 물리 바디의 회전 쿼터니언(`quat`)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation quaternion (`quat`) of the physics body.
     *
     * @returns
     * [KO] 회전 쿼터니언 (`quat`)
     * [EN] Rotation quaternion (`quat`)
     */
    get rotation(): quat {
        const rot = this.#nativeBody.rotation();
        return quat.fromValues(rot.x, rot.y, rot.z, rot.w);
    }

    set rotation(value: quat | { x: number; y: number; z: number; w: number }) {
        if ('x' in value) {
            this.#nativeBody.setRotation({x: value.x, y: value.y, z: value.z, w: value.w}, true);
        } else {
            this.#nativeBody.setRotation({x: value[0], y: value[1], z: value[2], w: value[3]}, true);
        }
    }

    /**
     * [KO] 물리 바디의 선속도(`vec3`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the linear velocity (`vec3`) of the physics body.
     *
     * @returns
     * [KO] 선속도 벡터 (`vec3`)
     * [EN] Linear velocity vector (`vec3`)
     */
    get velocity(): vec3 {
        const vel = this.#nativeBody.linvel();
        return vec3.fromValues(vel.x, vel.y, vel.z);
    }

    set velocity(value: vec3 | { x: number; y: number; z: number }) {
        if ('x' in value) {
            this.#nativeBody.setLinvel({x: value.x, y: value.y, z: value.z}, true);
        } else {
            this.#nativeBody.setLinvel({x: value[0], y: value[1], z: value[2]}, true);
        }
    }

    /**
     * [KO] 물리 바디에 순간 충격량(Impulse)을 가합니다.
     * [EN] Applies an instantaneous impulse to the physics body.
     *
     * ### Example
     * ```typescript
     * body.applyImpulse([0, 10, 0]);
     * ```
     *
     * @param force -
     * [KO] 적용할 충격량 벡터 (`vec3` 또는 `{ x, y, z }`)
     * [EN] Impulse vector to apply (`vec3` or `{ x, y, z }`)
     */
    applyImpulse(force: vec3 | { x: number; y: number; z: number }): void {
        if ('x' in force) {
            this.#nativeBody.applyImpulse({x: force.x, y: force.y, z: force.z}, true);
        } else {
            this.#nativeBody.applyImpulse({x: force[0], y: force[1], z: force[2]}, true);
        }
    }

    /**
     * [KO] 물리 시뮬레이션의 위치 및 회전 결과를 연동된 `Mesh`에 동기화합니다.
     * [EN] Synchronizes the position and rotation results of the physics simulation to the bound `Mesh`.
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