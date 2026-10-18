import RAPIER from '@dimforge/rapier3d-compat';
import {quat, vec3} from 'gl-matrix';
import Mesh from '../../display/mesh/Mesh';
import {BodyParams, IPhysicsEngine} from '../../physics/IPhysicsEngine';
import {PHYSICS_BODY_TYPE} from '../../physics/PhysicsBodyType';
import {PHYSICS_SHAPE} from '../../physics/PhysicsShape';
import {RapierBody} from './RapierBody';

/**
 * [KO] Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.
 * [EN] RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] WASM 기반의 Rapier 엔진을 통합하여 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정 등 물리 시뮬레이션 월드를 관리합니다.
 * [EN] Integrates the WASM-based Rapier engine to manage the physics simulation world, including rigid body creation, collision detection, character controllers, and gravity settings.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @see [Basic Physics example](/RedGPU/examples/physics/basic/)
 * @experimental
 * @category RapierPhysics
 */
export class RapierPhysics implements IPhysicsEngine {
    /**
     * [KO] 물리 엔진에서 충돌이 시작될 때 호출되는 콜백 함수입니다.
     * [EN] Callback function invoked when a collision starts in the physics engine.
     *
     * @param handle1 -
     * [KO] 첫 번째 콜라이더 핸들
     * [EN] Handle of the first collider
     * @param handle2 -
     * [KO] 두 번째 콜라이더 핸들
     * [EN] Handle of the second collider
     */
    onCollisionStarted: (handle1: number, handle2: number) => void;
    #world: RAPIER.World;
    #bodies: Map<number, RapierBody> = new Map();
    #eventQueue: RAPIER.EventQueue;

    /**
     * [KO] 물리 엔진의 원본 월드(World) 객체를 반환합니다.
     * [EN] Returns the native World object of the physics engine.
     *
     * @returns
     * [KO] Rapier 원본 월드 객체
     * [EN] Native Rapier World object
     */
    get nativeWorld(): RAPIER.World {
        return this.#world;
    }

    /**
     * [KO] Rapier 라이브러리 네임스페이스를 반환합니다.
     * [EN] Returns the Rapier library namespace.
     *
     * @returns
     * [KO] Rapier 네임스페이스 객체
     * [EN] Rapier namespace object
     */
    get RAPIER(): typeof RAPIER {
        return RAPIER;
    }

    /**
     * [KO] 엔진에서 관리 중인 모든 `RapierBody` 목록을 반환합니다.
     * [EN] Returns a list of all `RapierBody` instances managed by the engine.
     *
     * @returns
     * [KO] `RapierBody` 인스턴스 배열
     * [EN] Array of `RapierBody` instances
     */
    get bodies(): RapierBody[] {
        return Array.from(this.#bodies.values());
    }

    /**
     * [KO] 물리 월드의 중력 가속도를 가져오거나 설정합니다.
     * [EN] Gets or sets the gravity acceleration of the physics world.
     *
     * ### Example
     * ```typescript
     * // [KO] 중력 설정
     * // [EN] Set gravity
     * physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
     * ```
     *
     * @returns
     * [KO] X, Y, Z 축 중력 가속도 벡터
     * [EN] Gravity acceleration vector for X, Y, and Z axes
     */
    get gravity(): { x: number, y: number, z: number } {
        return this.#world.gravity;
    }

    set gravity(value: { x: number, y: number, z: number }) {
        this.#world.gravity = value;
    }

    /**
     * [KO] 콜라이더 핸들로 관리 중인 `RapierBody`를 조회하여 반환합니다.
     * [EN] Finds and returns the managed `RapierBody` by its collider handle.
     *
     * ### Example
     * ```typescript
     * const body = physicsEngine.getBodyByColliderHandle(handle);
     * ```
     *
     * @param handle -
     * [KO] 조회할 콜라이더의 고유 핸들
     * [EN] Unique handle of the collider to find
     * @returns
     * [KO] 조회된 `RapierBody` 인스턴스 (존재하지 않으면 `undefined`)
     * [EN] Found `RapierBody` instance (`undefined` if not found)
     */
    getBodyByColliderHandle(handle: number): RapierBody {
        return this.#bodies.get(handle);
    }

    /**
     * [KO] Rapier 엔진을 초기화하고 기본 중력이 적용된 물리 월드를 생성합니다.
     * [EN] Initializes the Rapier engine and creates a physics world with default gravity.
     *
     * ### Example
     * ```typescript
     * await physicsEngine.init();
     * ```
     *
     * @returns
     * [KO] 초기화 완료 `Promise`
     * [EN] `Promise` that resolves when initialization is complete
     */
    async init(): Promise<void> {
        await RAPIER.init();
        this.#world = new RAPIER.World({x: 0, y: -9.81, z: 0});
        this.#eventQueue = new RAPIER.EventQueue(true);
    }

    /**
     * [KO] 물리 시뮬레이션을 한 스텝 진행하고 충돌 이벤트 처리 및 메쉬 트랜스폼 동기화를 수행합니다.
     * [EN] Advances the physics simulation by one step, processes collision events, and synchronizes mesh transforms.
     *
     * ### Example
     * ```typescript
     * // [KO] 렌더링 루프에서 물리 시뮬레이션 진행
     * // [EN] Step physics simulation in rendering loop
     * renderer.start(redGPUContext, (time, deltaTime) => {
     *     physicsEngine.step(deltaTime / 1000);
     * });
     * ```
     *
     * @param deltaTime -
     * [KO] 프레임 간 시간 간격 (초 단위)
     * [EN] Time interval between frames (in seconds)
     */
    step(deltaTime: number): void {
        if (!this.#world) return;
        this.#world.step(this.#eventQueue);

        this.#eventQueue.drainCollisionEvents((h1, h2, started) => {
            if (started && this.onCollisionStarted) this.onCollisionStarted(h1, h2);
        });

        this.#bodies.forEach(body => body.syncToMesh());
    }

    /**
     * [KO] 대상 메쉬에 물리 바디와 콜라이더를 생성하고 물리 월드에 등록합니다.
     * [EN] Creates a physics body and colliders for the target mesh and registers them in the physics world.
     *
     * ### Example
     * ```typescript
     * const body = physicsEngine.createBody(mesh, {
     *     type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
     *     shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
     *     mass: 1.0
     * });
     * ```
     *
     * @param mesh -
     * [KO] 물리 바디를 적용할 대상 메쉬
     * [EN] Target mesh to apply the physics body
     * @param params -
     * [KO] 물리 바디 생성 설정 파라미터
     * [EN] Configuration parameters for creating the physics body
     * @returns
     * [KO] 생성된 `RapierBody` 인스턴스
     * [EN] Created `RapierBody` instance
     */
    createBody(mesh: Mesh, params: BodyParams): RapierBody {
        const rigidBodyDesc = this.#createRigidBodyDesc(params, mesh);
        const rigidBody = this.#world.createRigidBody(rigidBodyDesc);

        const colliders: RAPIER.Collider[] = [];
        this.#createCollidersRecursively(mesh, rigidBody, params, colliders, mesh);

        const body = new RapierBody(mesh, rigidBody, colliders[0]);
        this.#bodies.set(colliders[0].handle, body);

        body.syncToMesh();
        return body;
    }

    /**
     * [KO] 물리 바디를 물리 월드에서 제거합니다.
     * [EN] Removes a physics body from the physics world.
     *
     * ### Example
     * ```typescript
     * // [KO] 물리 바디 제거
     * // [EN] Remove physics body
     * physicsEngine.removeBody(body);
     * ```
     *
     * @param body -
     * [KO] 제거할 `RapierBody` 인스턴스
     * [EN] `RapierBody` instance to remove
     */
    removeBody(body: RapierBody): void {
        this.#world.removeRigidBody(body.nativeBody);
        this.#bodies.delete(body.nativeCollider.handle);
    }

    /**
     * [KO] 경사로 및 계단 오르기와 지면 밀착이 활성화된 캐릭터 컨트롤러를 생성하여 반환합니다.
     * [EN] Creates and returns a character controller with autostep and snap-to-ground enabled.
     *
     * ### Example
     * ```typescript
     * const controller = physicsEngine.createCharacterController(0.1);
     * ```
     *
     * @param offset -
     * [KO] 캐릭터와 주변 장애물 사이의 여유 간격
     * [EN] Clearance offset between the character and surrounding obstacles
     * @returns
     * [KO] 생성된 `RAPIER.KinematicCharacterController` 인스턴스
     * [EN] Created `RAPIER.KinematicCharacterController` instance
     */
    createCharacterController(offset: number): RAPIER.KinematicCharacterController {
        const controller = this.#world.createCharacterController(offset);
        controller.enableAutostep(0.5, 0.2, true);
        controller.enableSnapToGround(0.5);
        return controller;
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
            colliderDesc.setRotation({
                x: currentRelQuat[0],
                y: currentRelQuat[1],
                z: currentRelQuat[2],
                w: currentRelQuat[3]
            });

            const collider = this.#world.createCollider(colliderDesc, rigidBody);
            outColliders.push(collider);
        }

        for (const child of currentMesh.children) {
            this.#createCollidersRecursively(rootMesh, rigidBody, params, outColliders, child, currentRelPos, currentRelQuat, currentRelScale);
        }
    }

    #createRigidBodyDesc(params: BodyParams, mesh: Mesh): RAPIER.RigidBodyDesc {
        let desc: RAPIER.RigidBodyDesc;
        switch (params.type) {
            case PHYSICS_BODY_TYPE.STATIC:
                desc = RAPIER.RigidBodyDesc.fixed();
                break;
            case PHYSICS_BODY_TYPE.KINEMATIC:
            case PHYSICS_BODY_TYPE.KINEMATIC_POSITION:
                desc = RAPIER.RigidBodyDesc.kinematicPositionBased();
                break;
            case PHYSICS_BODY_TYPE.KINEMATIC_VELOCITY:
                desc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
                break;
            case PHYSICS_BODY_TYPE.DYNAMIC:
            default:
                desc = RAPIER.RigidBodyDesc.dynamic();
                break;
        }

        const worldPos = vec3.fromValues(mesh.x || 0, mesh.y || 0, mesh.z || 0);
        const worldQuat = quat.create();
        quat.fromEuler(worldQuat, mesh.rotationX || 0, mesh.rotationY || 0, mesh.rotationZ || 0);

        let parent: any = mesh.parent;
        while (parent) {
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
        desc.setRotation({x: worldQuat[0], y: worldQuat[1], z: worldQuat[2], w: worldQuat[3]});

        if (params.linearDamping !== undefined) desc.setLinearDamping(params.linearDamping);
        if (params.angularDamping !== undefined) desc.setAngularDamping(params.angularDamping);
        if (params.enableCCD !== undefined) desc.setCcdEnabled(params.enableCCD);

        return desc;
    }

    #createColliderDesc(params: BodyParams, mesh: Mesh, worldScale: vec3): RAPIER.ColliderDesc {
        const shapeType = params.shape || PHYSICS_SHAPE.BOX;

        if (shapeType === PHYSICS_SHAPE.MESH) {
            const {vertexBuffer, indexBuffer} = mesh.geometry;
            const {data, interleavedStruct} = vertexBuffer;
            const stride = interleavedStruct.arrayStride / 4;
            const numVertices = vertexBuffer.vertexCount;
            const positions = new Float32Array(numVertices * 3);

            for (let i = 0; i < numVertices; i++) {
                const offset = i * stride;
                positions[i * 3] = data[offset] * worldScale[0];
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
                desc = RAPIER.ColliderDesc.ball(Math.max(hx, hy, hz));
                break;
            }
            case PHYSICS_SHAPE.CAPSULE: {
                const radius = Math.max(hx, hz);
                const halfHeight = Math.max(0, hy - radius);
                desc = RAPIER.ColliderDesc.capsule(halfHeight, radius);
                break;
            }
            case PHYSICS_SHAPE.CYLINDER: {
                desc = RAPIER.ColliderDesc.cylinder(hy, Math.max(hx, hz));
                break;
            }
            case PHYSICS_SHAPE.HEIGHTFIELD: {
                if (!params.heightData) {
                    throw new Error('[RedGPU] heightData is required for PHYSICS_SHAPE.HEIGHTFIELD');
                }
                const {nrows, ncols, heights, scale} = params.heightData;
                desc = RAPIER.ColliderDesc.heightfield(nrows, ncols, heights, new RAPIER.Vector3(scale.x, scale.y, scale.z));
                desc.setTranslation(-scale.x / 2, 0, -scale.z / 2);
                break;
            }
            case PHYSICS_SHAPE.BOX:
            default:
                desc = RAPIER.ColliderDesc.cuboid(hx, hy, hz);
                break;
        }

        if (params.mass !== undefined) desc.setMass(params.mass);
        if (params.friction !== undefined) desc.setFriction(params.friction);
        if (params.restitution !== undefined) desc.setRestitution(params.restitution);
        if (params.isSensor !== undefined) desc.setSensor(params.isSensor);

        return desc;
    }
}
