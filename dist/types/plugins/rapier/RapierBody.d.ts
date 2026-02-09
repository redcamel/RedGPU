import RAPIER from '@dimforge/rapier3d-compat';
import { quat, vec3 } from 'gl-matrix';
import Mesh from '../../display/mesh/Mesh';
import { IPhysicsBody } from '../../physics/IPhysicsBody';
/**
 * [KO] Rapier 물리 엔진을 위한 `IPhysicsBody` 구현체입니다.
 * [EN] `IPhysicsBody` implementation for the Rapier physics engine.
 *
 * [KO] Rapier의 RigidBody와 RedGPU의 Mesh 사이에서 트랜스폼 정보를 동기화하고 제어하는 역할을 합니다. 물리 시뮬레이션의 결과가 매 프레임마다 연결된 메쉬의 위치와 회전에 자동으로 반영됩니다.
 * [EN] It synchronizes and controls transform information between Rapier's RigidBody and RedGPU's Mesh. Simulation results are automatically reflected in the connected mesh's position and rotation every frame.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @see [KO] [물리 플러그인 매뉴얼](/RedGPU/manual/ko/plugins/physics)
 * @see [EN] [Physics Plugin Manual](/RedGPU/manual/en/plugins/physics)
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
     * [KO] 연결할 RedGPU 메쉬
     * [EN] RedGPU mesh to connect
     * @param body -
     * [KO] Rapier 강체 객체
     * [EN] Rapier rigid body object
     * @param collider -
     * [KO] Rapier 충돌체 객체
     * [EN] Rapier collider object
     */
    constructor(mesh: Mesh, body: RAPIER.RigidBody, collider: RAPIER.Collider);
    /**
     * [KO] 연결된 RedGPU 메쉬를 반환합니다.
     * [EN] Returns the connected RedGPU mesh.
     * @readonly
     */
    get mesh(): Mesh;
    /**
     * [KO] Rapier의 원본 강체(RigidBody) 객체를 반환합니다.
     * [EN] Returns the native Rapier rigid body object.
     * @readonly
     */
    get nativeBody(): RAPIER.RigidBody;
    /**
     * [KO] Rapier의 원본 충돌체(Collider) 객체를 반환합니다.
     * [EN] Returns the native Rapier collider object.
     * @readonly
     */
    get nativeCollider(): RAPIER.Collider;
    /**
     * [KO] 물리 바디의 현재 위치를 반환하거나 설정합니다.
     * [EN] Gets or sets the current position of the physics body.
     */
    get position(): vec3;
    set position(value: vec3 | {
        x: number;
        y: number;
        z: number;
    });
    /**
     * [KO] 물리 바디의 현재 회전(쿼터니언)을 반환하거나 설정합니다.
     * [EN] Gets or sets the current rotation (quaternion) of the physics body.
     */
    get rotation(): quat;
    set rotation(value: quat | {
        x: number;
        y: number;
        z: number;
        w: number;
    });
    /**
     * [KO] 물리 바디의 현재 선속도를 반환하거나 설정합니다.
     * [EN] Gets or sets the current linear velocity of the physics body.
     */
    get velocity(): vec3;
    set velocity(value: vec3 | {
        x: number;
        y: number;
        z: number;
    });
    /**
     * [KO] 물리 바디에 충격량(Impulse)을 적용합니다.
     * [EN] Applies an impulse to the physics body.
     *
     * * ### Example
     * ```typescript
     * body.applyImpulse([0, 10, 0]);
     * ```
     *
     * @param force -
     * [KO] 적용할 힘의 벡터
     * [EN] Vector of the force to apply
     */
    applyImpulse(force: vec3 | {
        x: number;
        y: number;
        z: number;
    }): void;
    /**
     * [KO] 물리 시뮬레이션의 위치와 회전 정보를 연결된 RedGPU 메쉬에 동기화합니다.
     * [EN] Synchronizes the physics simulation's position and rotation information to the connected RedGPU mesh.
     */
    syncToMesh(): void;
}
