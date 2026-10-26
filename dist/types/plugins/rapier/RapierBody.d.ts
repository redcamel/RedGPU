import RAPIER from '@dimforge/rapier3d-compat';
import { quat, vec3 } from 'gl-matrix';
import Mesh from '../../display/mesh/Mesh';
import { IPhysicsBody } from '../../physics/IPhysicsBody';
/**
 * [KO] Rapier 강체(`RigidBody`)와 RedGPU `Mesh` 간의 트랜스폼을 동기화하고 제어하는 `IPhysicsBody` 구현 클래스입니다.
 * [EN] `IPhysicsBody` implementation class that synchronizes and controls transforms between a Rapier `RigidBody` and a RedGPU `Mesh`.
 *
 * @experimental
 * @category RapierPhysics
 */
export declare class RapierBody implements IPhysicsBody {
    #private;
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
    constructor(mesh: Mesh, body: RAPIER.RigidBody, collider: RAPIER.Collider);
    /**
     * [KO] 연동된 RedGPU `Mesh` 인스턴스를 반환합니다.
     * [EN] Returns the bound RedGPU `Mesh` instance.
     *
     * @returns
     * [KO] 연동된 `Mesh` 인스턴스
     * [EN] Bound `Mesh` instance
     */
    get mesh(): Mesh;
    /**
     * [KO] 원본 Rapier 강체(`RigidBody`) 객체를 반환합니다.
     * [EN] Returns the native Rapier `RigidBody` object.
     *
     * @returns
     * [KO] Rapier `RigidBody` 객체
     * [EN] Rapier `RigidBody` object
     */
    get nativeBody(): RAPIER.RigidBody;
    /**
     * [KO] 원본 Rapier 충돌체(`Collider`) 객체를 반환합니다.
     * [EN] Returns the native Rapier `Collider` object.
     *
     * @returns
     * [KO] Rapier `Collider` 객체
     * [EN] Rapier `Collider` object
     */
    get nativeCollider(): RAPIER.Collider;
    /**
     * [KO] 물리 바디의 월드 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the world position of the physics body.
     *
     * @returns
     * [KO] 월드 위치 벡터 (`vec3`)
     * [EN] World position vector (`vec3`)
     */
    get position(): vec3;
    set position(value: vec3 | {
        x: number;
        y: number;
        z: number;
    });
    /**
     * [KO] 물리 바디의 회전 쿼터니언(`quat`)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation quaternion (`quat`) of the physics body.
     *
     * @returns
     * [KO] 회전 쿼터니언 (`quat`)
     * [EN] Rotation quaternion (`quat`)
     */
    get rotation(): quat;
    set rotation(value: quat | {
        x: number;
        y: number;
        z: number;
        w: number;
    });
    /**
     * [KO] 물리 바디의 선속도(`vec3`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the linear velocity (`vec3`) of the physics body.
     *
     * @returns
     * [KO] 선속도 벡터 (`vec3`)
     * [EN] Linear velocity vector (`vec3`)
     */
    get velocity(): vec3;
    set velocity(value: vec3 | {
        x: number;
        y: number;
        z: number;
    });
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
    applyImpulse(force: vec3 | {
        x: number;
        y: number;
        z: number;
    }): void;
    /**
     * [KO] 물리 시뮬레이션의 위치 및 회전 결과를 연동된 `Mesh`에 동기화합니다.
     * [EN] Synchronizes the position and rotation results of the physics simulation to the bound `Mesh`.
     */
    syncToMesh(): void;
}
