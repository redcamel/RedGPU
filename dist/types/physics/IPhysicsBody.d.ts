import { quat, vec3 } from 'gl-matrix';
/**
 * [KO] 물리 엔진의 강체(Rigid Body)와 RedGPU 메시를 연결하는 인터페이스입니다.
 * [EN] Interface that connects a physics engine's rigid body with a RedGPU mesh.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @experimental
 * @category Physics
 */
export interface IPhysicsBody {
    /**
     * [KO] 물리 엔진의 원본 Body 객체
     * [EN] Native body object of the physics engine
     */
    nativeBody: any;
    /**
     * [KO] 물리 바디의 현재 위치
     * [EN] Current position of the physics body
     */
    position: vec3 | {
        x: number;
        y: number;
        z: number;
    };
    /**
     * [KO] 물리 바디의 현재 회전(쿼터니언)
     * [EN] Current rotation (quaternion) of the physics body
     */
    rotation: quat | {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    /**
     * [KO] 물리 바디의 현재 선속도
     * [EN] Current linear velocity of the physics body
     */
    velocity: vec3 | {
        x: number;
        y: number;
        z: number;
    };
    /**
     * [KO] 물리 바디에 충격량(Impulse)을 적용합니다.
     * [EN] Applies an impulse to the physics body.
     *
     * ### Example
     * ```typescript
     * // [KO] Y축 방향으로 충격량 적용
     * // [EN] Apply impulse along the Y-axis
     * body.applyImpulse([0, 5, 0]);
     * ```
     *
     * @param force -
     * [KO] 적용할 힘의 벡터
     * [EN] Force vector to apply
     */
    applyImpulse(force: vec3 | {
        x: number;
        y: number;
        z: number;
    }): void;
    /**
     * [KO] 물리 시뮬레이션 결과를 연결된 메시의 트랜스폼에 동기화합니다.
     * [EN] Synchronizes the physics simulation results to the transform of the connected mesh.
     */
    syncToMesh(): void;
}
