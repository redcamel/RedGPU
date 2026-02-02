import {mat4, vec3, vec2, vec4} from "gl-matrix";
import Ray from "../math/Ray";
import View3D from "../display/view/View3D";
import Mesh from "../display/mesh/Mesh";
import {keepLog} from "../utils";

/**
 * [KO] 3D 공간에서 광선(Ray)을 투사하여 객체와의 교차를 검사하는 클래스입니다.
 * [EN] Class that casts a ray in 3D space to check for intersections with objects.
 *
 * [KO] 마우스 좌표와 카메라 정보를 기반으로 광선을 생성하고, 메시의 정밀한 삼각형 단위 충돌 검사를 수행합니다.
 * [EN] Generates a ray based on mouse coordinates and camera information, and performs precise triangle-level collision tests on meshes.
 *
 * * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster3D();
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 * @category Picking
 */
export default class Raycaster3D {
    /**
     * [KO] 내부적으로 관리되는 광원 객체
     * [EN] Internally managed ray object
     */
    readonly ray: Ray;

    /**
     * [KO] 교차 검사 시 고려할 최소 거리
     * [EN] Minimum distance to consider for intersection
     * @defaultValue 0
     */
    near: number = 0;

    /**
     * [KO] 교차 검사 시 고려할 최대 거리
     * [EN] Maximum distance to consider for intersection
     * @defaultValue Infinity
     */
    far: number = Infinity;

    #tempMat4 = mat4.create();
    #tempMat4_2 = mat4.create();
    #tempMat4_3 = mat4.create();
    #tempVec3 = vec3.create();
    #tempVec3_2 = vec3.create();
    #view: View3D;
    #screenPoint: vec2 = vec2.create();

    /**
     * [KO] Raycaster3D 인스턴스를 생성합니다.
     * [EN] Creates a Raycaster3D instance.
     */
    constructor() {
        this.ray = new Ray();
    }

    /**
     * [KO] 화면 좌표와 카메라 정보를 기반으로 광선을 설정합니다.
     * [EN] Sets the ray based on screen coordinates and camera information.
     *
     * * ### Example
     * ```typescript
     * raycaster.setFromCamera(mouseX, mouseY, view);
     * ```
     *
     * @param screenX -
     * [KO] 화면 X 좌표
     * [EN] Screen X coordinate
     * @param screenY -
     * [KO] 화면 Y 좌표
     * [EN] Screen Y coordinate
     * @param view -
     * [KO] 대상 View3D 인스턴스
     * [EN] Target View3D instance
     */
    setFromCamera(screenX: number, screenY: number, view: View3D): void {
        const {rawCamera} = view;
        const origin = vec3.fromValues(rawCamera.x, rawCamera.y, rawCamera.z);
        const targetPoint = view.screenToWorld(screenX, screenY);
        const direction = vec3.create();
        vec3.subtract(direction, targetPoint as vec3, origin);
        vec3.normalize(direction, direction);

        vec3.copy(this.ray.origin, origin);
        vec3.copy(this.ray.direction, direction);

        this.#view = view;
        const {pixelRectObject} = view;
        const ndcX = ((screenX * devicePixelRatio) / pixelRectObject.width) * 2 - 1;
        const ndcY = -((screenY * devicePixelRatio) / pixelRectObject.height) * 2 + 1;
        vec2.set(this.#screenPoint, ndcX, ndcY);

        if ('nearClipping' in rawCamera) this.near = (rawCamera as any).nearClipping;
        if ('farClipping' in rawCamera) this.far = (rawCamera as any).farClipping;
    }

    /**
     * [KO] 단일 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersection with a single object.
     *
     * * ### Example
     * ```typescript
     * const result = raycaster.intersectObject(mesh);
     * ```
     *
     * @param mesh -
     * [KO] 검사할 메시 객체
     * [EN] Mesh object to check
     * @param recursive -
     * [KO] 자식 객체도 포함할지 여부 (기본값: true)
     * [EN] Whether to include child objects (default: true)
     * @returns
     * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection information (`RayIntersectResult[]`)
     */
    intersectObject(mesh: Mesh, recursive: boolean = true): RayIntersectResult[] {
        const intersects: RayIntersectResult[] = [];
        this.#intersectObject(mesh, recursive, intersects);
        return intersects.sort((a, b) => a.distance - b.distance);
    }

    /**
     * [KO] 여러 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersections with multiple objects.
     *
     * * ### Example
     * ```typescript
     * const results = raycaster.intersectObjects(scene.children);
     * ```
     *
     * @param meshes -
     * [KO] 검사할 메시 객체 배열
     * [EN] Array of mesh objects to check
     * @param recursive -
     * [KO] 자식 객체도 포함할지 여부 (기본값: true)
     * [EN] Whether to include child objects (default: true)
     * @returns
     * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection information (`RayIntersectResult[]`)
     */
    intersectObjects(meshes: Mesh[], recursive: boolean = true): RayIntersectResult[] {
        const intersects: RayIntersectResult[] = [];
        for (const mesh of meshes) {
            this.#intersectObject(mesh, recursive, intersects);
        }
        return intersects.sort((a, b) => a.distance - b.distance);
    }

    #intersectObject(mesh: Mesh, recursive: boolean, intersects: RayIntersectResult[]): void {
        const isBillboard = (mesh as any).useBillboard;
        const rx = (mesh as any)._renderRatioX || 1;
        const ry = (mesh as any)._renderRatioY || 1;

        if (isBillboard && this.#view) {
            const usePixelSize = (mesh as any).usePixelSize;
            if (usePixelSize) {
                this.#intersectPixelBillboard(mesh, intersects);
            } else {
                this.#intersectWorldBillboard(mesh, intersects);
            }
        } else if (mesh.geometry) {
            const effectiveModelMatrix = this.#tempMat4_2;
            mat4.copy(effectiveModelMatrix, mesh.modelMatrix);

            // Sprite3D, TextField3D 등 종횡비 보정이 들어가는 클래스 대응
            if (rx !== 1 || ry !== 1) {
                mat4.scale(effectiveModelMatrix, effectiveModelMatrix, [rx, ry, 1]);
                // 이 경우 기존 boundingAABB가 맞지 않으므로 바로 정밀 검사 수행
                this.#intersectNarrowPhase(mesh, effectiveModelMatrix, intersects, true);
            } else {
                const worldAABB = mesh.boundingAABB;
                if (this.ray.intersectBox(worldAABB)) {
                    this.#intersectNarrowPhase(mesh, mesh.modelMatrix, intersects, true);
                }
            }
        }

        if (recursive && mesh.children) {
            for (const child of mesh.children) {
                this.#intersectObject(child as Mesh, recursive, intersects);
            }
        }
    }

    #intersectPixelBillboard(mesh: Mesh, intersects: RayIntersectResult[]) {
        const view = this.#view;
        const m = mesh.modelMatrix;
        const pixelSize = (mesh as any).pixelSize  ;
        keepLog((mesh as any).fontSize)
        const rx = (mesh as any)._renderRatioX || 1;
        const ry = (mesh as any)._renderRatioY || 1;

        const {rawCamera, projectionMatrix, pixelRectObject} = view;

        // 1. Pivot NDC 계산
        const centerWorld = vec3.fromValues(m[12], m[13], m[14]);
        const centerView = vec3.transformMat4(this.#tempVec3, centerWorld, rawCamera.modelMatrix);
        const centerClip = vec4.transformMat4(this.#tempMat4, vec4.fromValues(centerView[0], centerView[1], centerView[2], 1.0), projectionMatrix);

        if (centerClip[3] <= 0) return;

        const ndcX = centerClip[0] / centerClip[3];
        const ndcY = centerClip[1] / centerClip[3];

        // 2. 마우스 포인터 (NDC)
        const mouseX = this.#screenPoint[0];
        const mouseY = this.#screenPoint[1];

        // 3. NDC 크기 계산 (셰이더 로직 모사 - 물리 픽셀 기준)
        const physicalPixelSize = pixelSize * window.devicePixelRatio;
        const scaleX = (physicalPixelSize / pixelRectObject.width) * 2.0 * (rx / ry);
        const scaleY = (physicalPixelSize / pixelRectObject.height) * 2.0;

        // 4. 히트 테스트
        if (
            Math.abs(mouseX - ndcX) <= scaleX * 0.5 &&
            Math.abs(mouseY - ndcY) <= scaleY * 0.5
        ) {
            const dist = vec3.distance(this.ray.origin, centerWorld);
            if (dist >= this.near && dist <= this.far) {
                const u = (mouseX - ndcX) / scaleX + 0.5;
                const v = (mouseY - ndcY) / scaleY + 0.5;

                intersects.push({
                    distance: dist,
                    point: centerWorld,
                    localPoint: vec3.fromValues(0, 0, 0),
                    object: mesh,
                    faceIndex: 0,
                    uv: vec2.fromValues(u, 1.0 - v),
                    ray: this.ray.clone()
                });
            }
        }
    }

    #intersectWorldBillboard(mesh: Mesh, intersects: RayIntersectResult[]) {
        const view = this.#view;
        const m = mesh.modelMatrix;
        const rx = (mesh as any)._renderRatioX || 1;
        const ry = (mesh as any)._renderRatioY || 1;

        // 1. 빌보드 월드 행렬 생성
        const invView = mat4.invert(this.#tempMat4_2, view.rawCamera.modelMatrix);
        const billboardWorldMatrix = this.#tempMat4_3;
        mat4.copy(billboardWorldMatrix, invView);

        billboardWorldMatrix[12] = m[12];
        billboardWorldMatrix[13] = m[13];
        billboardWorldMatrix[14] = m[14];

        const sx = Math.hypot(m[0], m[1], m[2]);
        const sy = Math.hypot(m[4], m[5], m[6]);
        const sz = Math.hypot(m[8], m[9], m[10]);
        mat4.scale(billboardWorldMatrix, billboardWorldMatrix, [sx * rx, sy * ry, sz]);

        // 2. 좁은 단계 교차 검사
        this.#intersectNarrowPhase(mesh, billboardWorldMatrix, intersects, false);
    }

    #intersectNarrowPhase(mesh: Mesh, modelMatrix: mat4, intersects: RayIntersectResult[], backfaceCulling: boolean): void {
        const localRay = new Ray();
        vec3.copy(localRay.origin, this.ray.origin);
        vec3.copy(localRay.direction, this.ray.direction);

        const invModelMatrix = mat4.invert(this.#tempMat4, modelMatrix);
        if (invModelMatrix) {
            localRay.applyMatrix4(invModelMatrix);

            const geometry = mesh.geometry;
            const vertexBuffer = geometry.vertexBuffer;
            const indexBuffer = geometry.indexBuffer;
            const data = vertexBuffer.data;
            const stride = vertexBuffer.interleavedStruct.arrayStride / 4;

            if (indexBuffer) {
                const indices = indexBuffer.data;
                for (let i = 0; i < indices.length; i += 3) {
                    this.#checkTriangle(localRay, mesh, modelMatrix, data, stride, indices[i], indices[i + 1], indices[i + 2], intersects, backfaceCulling);
                }
            } else {
                const count = vertexBuffer.vertexCount;
                for (let i = 0; i < count; i += 3) {
                    this.#checkTriangle(localRay, mesh, modelMatrix, data, stride, i, i + 1, i + 2, intersects, backfaceCulling);
                }
            }
        }
    }

    #checkTriangle(
        localRay: Ray,
        mesh: Mesh,
        modelMatrix: mat4,
        data: Float32Array,
        stride: number,
        i0: number, i1: number, i2: number,
        intersects: RayIntersectResult[],
        backfaceCulling: boolean
    ) {
        const v0 = vec3.fromValues(data[i0 * stride], data[i0 * stride + 1], data[i0 * stride + 2]);
        const v1 = vec3.fromValues(data[i1 * stride], data[i1 * stride + 1], data[i1 * stride + 2]);
        const v2 = vec3.fromValues(data[i2 * stride], data[i2 * stride + 1], data[i2 * stride + 2]);

        const result = localRay.intersectTriangleBarycentric(v0, v1, v2, backfaceCulling);
        if (result) {
            const {point: localIntersectPoint, u, v} = result;
            const worldIntersectPoint = vec3.create();
            vec3.transformMat4(worldIntersectPoint, localIntersectPoint, modelMatrix);

            const distance = vec3.distance(this.ray.origin, worldIntersectPoint);
            if (distance >= this.near && distance <= this.far) {
                // UV Interpolation
                // Assuming standard interleaved layout: [Px, Py, Pz, Nx, Ny, Nz, U, V] (Stride 8)
                const uv0 = vec2.fromValues(data[i0 * stride + 6], data[i0 * stride + 7]);
                const uv1 = vec2.fromValues(data[i1 * stride + 6], data[i1 * stride + 7]);
                const uv2 = vec2.fromValues(data[i2 * stride + 6], data[i2 * stride + 7]);

                const hitUV = vec2.create();
                const w = 1 - u - v;
                vec2.scaleAndAdd(hitUV, hitUV, uv0, w);
                vec2.scaleAndAdd(hitUV, hitUV, uv1, u);
                vec2.scaleAndAdd(hitUV, hitUV, uv2, v);

                intersects.push({
                    distance,
                    point: worldIntersectPoint,
                    localPoint: localIntersectPoint,
                    object: mesh,
                    faceIndex: Math.floor(i0 / 3),
                    uv: hitUV,
                    ray: this.ray.clone()
                });
            }
        }
    }
}

/**
 * [KO] 레이캐스팅 교차 결과 인터페이스입니다.
 * [EN] Raycasting intersection result interface.
 */
export interface RayIntersectResult {
    /**
     * [KO] 광선 시작점부터 교차 지점까지의 거리
     * [EN] Distance from ray origin to intersection point
     */
    distance: number;
    /**
     * [KO] 월드 공간상의 교차 지점
     * [EN] Intersection point in world space
     */
    point: vec3;
    /**
     * [KO] 로컬 공간상의 교차 지점
     * [EN] Intersection point in local space
     */
    localPoint: vec3;
    /**
     * [KO] 교차된 객체
     * [EN] The intersected object
     */
    object: Mesh;
    /**
     * [KO] 교차된 삼각형의 인덱스
     * [EN] Index of the intersected triangle
     */
    faceIndex?: number;
    /**
     * [KO] 교차 지점의 UV 좌표
     * [EN] UV coordinates at the intersection point
     */
    uv?: vec2;
    /**
     * [KO] 교차 검사에 사용된 광선 (월드 공간)
     * [EN] Ray used for intersection test (world space)
     */
    ray: Ray;
}