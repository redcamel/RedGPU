import {mat4, vec3, vec2, vec4} from "gl-matrix";
import Ray from "../math/Ray";
import View3D from "../display/view/View3D";
import Mesh from "../display/mesh/Mesh";
import TextField3D from "../display/textFileds/textField3D/TextField3D";

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
    #tempVec2 = vec2.create();
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
        if (mesh instanceof TextField3D) {
            this.#intersectTextField3D(mesh, intersects);
        } else {
            const isBillboard = (mesh as any).useBillboard;
            if (isBillboard && this.#view) {
                if ((mesh as any).useBillboardPerspective === false) {
                    this.#intersectBillboard(mesh, intersects);
                } else {
                    const view = this.#view;
                    const invView = mat4.invert(this.#tempMat4_2, view.rawCamera.modelMatrix);
                    const billboardWorldMatrix = this.#tempMat4_3;
                    mat4.copy(billboardWorldMatrix, invView);

                    billboardWorldMatrix[12] = mesh.modelMatrix[12];
                    billboardWorldMatrix[13] = mesh.modelMatrix[13];
                    billboardWorldMatrix[14] = mesh.modelMatrix[14];

                    const m = mesh.modelMatrix;
                    const sx = Math.hypot(m[0], m[1], m[2]);
                    const sy = Math.hypot(m[4], m[5], m[6]);
                    const sz = Math.hypot(m[8], m[9], m[10]);
                    mat4.scale(billboardWorldMatrix, billboardWorldMatrix, [sx, sy, sz]);

                    this.#intersectNarrowPhase(mesh, billboardWorldMatrix, intersects, false);
                }
            } else if (mesh.geometry) {
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

    #intersectTextField3D(mesh: TextField3D, intersects: RayIntersectResult[]) {
        if (!mesh.useBillboard) {
            const effectiveModelMatrix = this.#tempMat4_2;
            mat4.scale(effectiveModelMatrix, mesh.modelMatrix, [10, 10, 1]);
            this.#intersectNarrowPhase(mesh, effectiveModelMatrix, intersects, false);
            return;
        }

        const view = this.#view;
        if (!view) return;

        const m = mesh.modelMatrix;
        const usePerspective = mesh.useBillboardPerspective;

        if (!usePerspective) {
            // NDC 기반 2D 히트 테스트 (셰이더 로직 모사)
            const {rawCamera, projectionMatrix} = view;

            // 1. 객체 중심의 NDC 좌표 계산
            // View Space
            const centerWorld = vec3.fromValues(m[12], m[13], m[14]);
            const centerView = vec3.transformMat4(this.#tempVec3, centerWorld, rawCamera.modelMatrix);
            // Clip Space
            const centerClip = vec4.transformMat4(this.#tempMat4, vec4.fromValues(centerView[0], centerView[1], centerView[2], 1.0), projectionMatrix);

            // 카메라 뒤에 있는 경우 무시
            if (centerClip[3] <= 0) return;

            const ndcX = centerClip[0] / centerClip[3];
            const ndcY = centerClip[1] / centerClip[3];

            // 2. 마우스 포인터 (NDC)
            const mouseX = this.#screenPoint[0];
            const mouseY = this.#screenPoint[1];

            // 3. 셰이더 로직에 따른 NDC 반경 계산
            // offset = objectPosition.xy * vec2(P[0][0]*M[0][0], P[1][1]*M[1][1])
            // objectPosition(Plane) 범위: -0.5 ~ 0.5
            // P[0] = projectionMatrix[0], P[5] = projectionMatrix[5] (GL-Matrix는 열 우선)
            // M[0] = modelMatrix[0], M[5] = modelMatrix[5]
            const halfSizeX = 0.5 * Math.abs(projectionMatrix[0] * m[0]);
            const halfSizeY = 0.5 * Math.abs(projectionMatrix[5] * m[5]);

            // 4. 충돌 검사
            if (
                Math.abs(mouseX - ndcX) <= halfSizeX &&
                Math.abs(mouseY - ndcY) <= halfSizeY
            ) {
                const dist = vec3.distance(this.ray.origin, centerWorld);
                if (dist >= this.near && dist <= this.far) {
                    // UV 역산 (선택적)
                    const u = (mouseX - ndcX) / (halfSizeX * 2) + 0.5;
                    const v = (mouseY - ndcY) / (halfSizeY * 2) + 0.5; // Y축 방향 확인 필요 (보통 NDC Y는 위가 +, UV V는 아래가 +일 수 있음)

                    intersects.push({
                        distance: dist,
                        point: centerWorld, // 근사값
                        localPoint: vec3.fromValues(0, 0, 0),
                        object: mesh,
                        faceIndex: 0,
                        uv: vec2.fromValues(u, 1.0 - v), // Flip Y 가정
                        ray: this.ray.clone()
                    });
                }
            }
            return;
        }
        {
            // --- Perspective Mode ---

            // 1. Calculate Billboard Matrix (Camera Facing)
            const billboardWorldMatrix = this.#tempMat4_3;
            const cm = view.rawCamera.modelMatrix;
            const v = this.#tempVec3;

            // x-axis
            vec3.set(v, cm[0], cm[1], cm[2]);
            vec3.normalize(v, v);
            billboardWorldMatrix[0] = v[0];
            billboardWorldMatrix[1] = v[1];
            billboardWorldMatrix[2] = v[2];
            billboardWorldMatrix[3] = 0;
            // y-axis
            vec3.set(v, cm[4], cm[5], cm[6]);
            vec3.normalize(v, v);
            billboardWorldMatrix[4] = v[0];
            billboardWorldMatrix[5] = v[1];
            billboardWorldMatrix[6] = v[2];
            billboardWorldMatrix[7] = 0;
            // z-axis
            vec3.set(v, cm[8], cm[9], cm[10]);
            vec3.normalize(v, v);
            billboardWorldMatrix[8] = v[0];
            billboardWorldMatrix[9] = v[1];
            billboardWorldMatrix[10] = v[2];
            billboardWorldMatrix[11] = 0;

            billboardWorldMatrix[12] = m[12];
            billboardWorldMatrix[13] = m[13];
            billboardWorldMatrix[14] = m[14];
            billboardWorldMatrix[15] = 1;

            // 2. Apply Model Scale (sx, sy, sz)
            // mesh.modelMatrix에는 이미 renderTextureWidth/Height가 반영되어 있습니다.
            const sx = Math.hypot(m[0], m[1], m[2]);
            const sy = Math.hypot(m[4], m[5], m[6]);
            const sz = Math.hypot(m[8], m[9], m[10]);

            // 3. Apply TextField3D specific scale logic
            const extraScaleX = 10.0;
            const extraScaleY = 10.0;
            const extraScaleZ = 1.0;
            // Apply scales: ModelScale * ExtraScale
            mat4.scale(billboardWorldMatrix, billboardWorldMatrix, [
                sx * extraScaleX,
                sy * extraScaleY,
                sz * extraScaleZ
            ]);

            // 4. Narrow Phase
            this.#intersectNarrowPhase(mesh, billboardWorldMatrix, intersects, false);
        }
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

    #intersectBillboard(mesh: Mesh, intersects: RayIntersectResult[]) {
        const view = this.#view;
        const {pixelRectObject} = view;
        const aspectRatio = pixelRectObject.width / pixelRectObject.height;

        // 1. Calculate offset scale (matches shader's scaleX, scaleY)
        mat4.multiply(this.#tempMat4, view.projectionMatrix, mesh.modelMatrix);
        const pmm5 = this.#tempMat4[5];
        const scaleConstY = Math.max(-1.0, Math.min(1.0, pmm5));
        const scaleConstX = scaleConstY / aspectRatio;

        const billboardFixedScale = (mesh as any).billboardFixedScale !== undefined ? (mesh as any).billboardFixedScale : 0.1;
        const offsetXScale = scaleConstX * billboardFixedScale;
        const offsetYScale = scaleConstY * billboardFixedScale;

        // 2. Calculate Billboard View Matrix (Rotation cleared, Scale applied)
        const modelViewMatrix = this.#tempMat4_2;
        mat4.multiply(modelViewMatrix, view.rawCamera.modelMatrix, mesh.modelMatrix);

        const m = mesh.modelMatrix;
        const sx = Math.hypot(m[0], m[1], m[2]);
        const sy = Math.hypot(m[4], m[5], m[6]);
        const sz = Math.hypot(m[8], m[9], m[10]);

        modelViewMatrix[0] = 1;
        modelViewMatrix[1] = 0;
        modelViewMatrix[2] = 0;
        modelViewMatrix[4] = 0;
        modelViewMatrix[5] = 1;
        modelViewMatrix[6] = 0;
        modelViewMatrix[8] = 0;
        modelViewMatrix[9] = 0;
        modelViewMatrix[10] = 1;
        mat4.scale(modelViewMatrix, modelViewMatrix, [sx, sy, sz]);

        // 3. Prepare for intersection check
        const geometry = mesh.geometry;
        const vertexBuffer = geometry.vertexBuffer;
        const indexBuffer = geometry.indexBuffer;
        const data = vertexBuffer.data;
        const stride = vertexBuffer.interleavedStruct.arrayStride / 4;

        const mx = this.#screenPoint[0];
        const my = this.#screenPoint[1];

        const getNDC = (index: number, out: vec2) => {
            const lx = data[index * stride];
            const ly = data[index * stride + 1];
            const lz = data[index * stride + 2];

            const vx = modelViewMatrix[0] * lx + modelViewMatrix[4] * ly + modelViewMatrix[8] * lz + modelViewMatrix[12];
            const vy = modelViewMatrix[1] * lx + modelViewMatrix[5] * ly + modelViewMatrix[9] * lz + modelViewMatrix[13];
            const vz = modelViewMatrix[2] * lx + modelViewMatrix[6] * ly + modelViewMatrix[10] * lz + modelViewMatrix[14];
            const vw = modelViewMatrix[3] * lx + modelViewMatrix[7] * ly + modelViewMatrix[11] * lz + modelViewMatrix[15];

            const cx = view.projectionMatrix[0] * vx + view.projectionMatrix[4] * vy + view.projectionMatrix[8] * vz + view.projectionMatrix[12] * vw;
            const cy = view.projectionMatrix[1] * vx + view.projectionMatrix[5] * vy + view.projectionMatrix[9] * vz + view.projectionMatrix[13] * vw;
            const cw = view.projectionMatrix[3] * vx + view.projectionMatrix[7] * vy + view.projectionMatrix[11] * vz + view.projectionMatrix[15] * vw;

            if (cw <= 0) return false;
            const invW = 1 / cw;
            out[0] = cx * invW + lx * offsetXScale;
            out[1] = cy * invW + ly * offsetYScale;
            return true;
        };

        const v0 = vec2.create(), v1 = vec2.create(), v2 = vec2.create();
        const checkTri = (i0: number, i1: number, i2: number) => {
            if (!getNDC(i0, v0) || !getNDC(i1, v1) || !getNDC(i2, v2)) return;

            const x0 = v0[0], y0 = v0[1], x1 = v1[0], y1 = v1[1], x2 = v2[0], y2 = v2[1];
            const denom = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
            if (Math.abs(denom) < 0.000001) return;

            const wa = ((y1 - y2) * (mx - x2) + (x2 - x1) * (my - y2)) / denom;
            const wb = ((y2 - y0) * (mx - x2) + (x0 - x2) * (my - y2)) / denom;
            const wc = 1 - wa - wb;

            if (wa >= 0 && wa <= 1 && wb >= 0 && wb <= 1 && wc >= 0 && wc <= 1) {
                // Hit! Calculate exact intersection data
                // 1. Interpolate UV
                const hitUV = vec2.fromValues(
                    wa * data[i0 * stride + 6] + wb * data[i1 * stride + 6] + wc * data[i2 * stride + 6],
                    wa * data[i0 * stride + 7] + wb * data[i1 * stride + 7] + wc * data[i2 * stride + 7]
                );

                // 2. Interpolate Local Point
                const localPoint = vec3.fromValues(
                    wa * data[i0 * stride] + wb * data[i1 * stride] + wc * data[i2 * stride],
                    wa * data[i0 * stride + 1] + wb * data[i1 * stride + 1] + wc * data[i2 * stride + 1],
                    wa * data[i0 * stride + 2] + wb * data[i1 * stride + 2] + wc * data[i2 * stride + 2]
                );

                // 3. Proper World Point and Distance
                // The billboard plane in View Space is at constant depth VZ of its center
                const worldCenter = this.#tempVec3;
                vec3.set(worldCenter, mesh.modelMatrix[12], mesh.modelMatrix[13], mesh.modelMatrix[14]);

                const viewCenter = this.#tempVec3_2;
                vec3.transformMat4(viewCenter, worldCenter, view.rawCamera.modelMatrix);

                const viewRayOrigin = vec3.transformMat4(vec3.create(), this.ray.origin, view.rawCamera.modelMatrix);

                // Transform direction (rotation only)
                const vm = view.rawCamera.modelMatrix;
                const rd = this.ray.direction;
                const viewRayDirZ = vm[2] * rd[0] + vm[6] * rd[1] + vm[10] * rd[2];

                // Intersection with plane z = viewCenter[2]
                // viewRayOrigin[2] + viewRayDirZ * t = viewCenter[2]
                const t = (viewCenter[2] - viewRayOrigin[2]) / viewRayDirZ;

                const worldIntersectPoint = vec3.scaleAndAdd(vec3.create(), this.ray.origin, this.ray.direction, t);

                if (t >= this.near && t <= this.far) {
                    intersects.push({
                        distance: t,
                        point: worldIntersectPoint,
                        localPoint: localPoint,
                        object: mesh,
                        faceIndex: Math.floor(i0 / 3),
                        uv: hitUV,
                        ray: this.ray.clone()
                    });
                }
            }
        };

        if (indexBuffer) {
            const indices = indexBuffer.data;
            for (let i = 0; i < indices.length; i += 3) {
                checkTri(indices[i], indices[i + 1], indices[i + 2]);
            }
        } else {
            const count = vertexBuffer.vertexCount;
            for (let i = 0; i < count; i += 3) {
                checkTri(i, i + 1, i + 2);
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
                // UV offset is usually 6. We should verify this dynamically if possible, but for now hardcoded offset 6 is common in RedGPU primitives.
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