import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import AABB from "../../bound/AABB";
import OBB from "../../bound/OBB";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import {mat4} from "gl-matrix";

type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';

const LOCAL_VERTICES = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
];
const EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 0], // 뒷면
    [4, 5], [5, 6], [6, 7], [7, 4], // 앞면
    [0, 4], [1, 5], [2, 6], [3, 7]  // 연결선
];

/**
 * 대상 3D 메시(Mesh)의 공간 바운딩 박스(AABB, OBB) 정보를 추출하여 시각적으로 투영해 주는 디버깅용 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 모드는 OBB(빨간색 와이어프레임), AABB(초록색 와이어프레임), 혹은 두 형태를 모두 표기하는 BOTH 모드를 지원합니다.
 * - 메시 오브젝트의 크기, 회전, 스케일 등 볼륨 데이터의 변경 이력을 감지(캐싱 연산)하여 필요할 때만 GPU 버텍스 정보를 갱신합니다.
 * - 카메라 절두체 컬링(View Frustum Culling) 로직과 긴밀하게 연동되어, 바운딩 볼륨이 화면 밖으로 이탈하면 렌더 루프 호출을 방지합니다.
 *
 * **[EN]**
 * - Visualizes spatial bounds (AABB, OBB) of a target 3D Mesh in the viewport.
 * - Renders bounding wireframe boxes in various modes: OBB (Red), AABB (Green), or BOTH.
 * - Tracks change history of target geometries to execute GPU vertex updates lazily (performance-optimized caching).
 * - Implements view frustum culling to bypass drawing operations once the target object leaves the view camera boundaries.
 *
 * @category Debugger
 */
class DrawDebuggerMesh {
    #target: Mesh;
    #vertexBuffer: VertexBuffer;
    #material: ColorMaterial;
    #debugMesh: Mesh;
    #debugMode: DebugMode = 'AABB';
    // BOTH 모드용 추가 메시
    #aabbMaterial: ColorMaterial;
    #aabbDebugMesh: Mesh;
    // 캐시된 볼륨 데이터 (변경 감지용)
    #cachedOBB: OBB | null = null;
    #cachedAABB: AABB | null = null;

    constructor(redGPUContext: RedGPUContext, target: Mesh) {
        this.#target = target;
        const geometry = this.#createWireframeBoxGeometry(redGPUContext);
        this.#vertexBuffer = geometry.vertexBuffer;
        this.#material = new ColorMaterial(redGPUContext);
        this.#material.color.setColorByRGB(255, 0, 0);
        this.#debugMesh = new Mesh(redGPUContext, geometry, this.#material);
        this.#debugMesh.primitiveState.cullMode = 'none';
        this.#debugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;

        const aabbGeometry = this.#createWireframeBoxGeometry(redGPUContext);
        this.#aabbMaterial = new ColorMaterial(redGPUContext);
        this.#aabbMaterial.color.setColorByRGB(0, 255, 0);
        this.#aabbDebugMesh = new Mesh(redGPUContext, aabbGeometry, this.#aabbMaterial);
        this.#aabbDebugMesh.primitiveState.cullMode = 'none';
        this.#aabbDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;

    }

    get debugMode(): DebugMode {
        return this.#debugMode;
    }

    set debugMode(value: DebugMode) {
        this.#debugMode = value;
        if (value === 'OBB') {
            this.#material.color.setColorByRGB(255, 0, 0);
        } else if (value === 'AABB' || value === 'COMBINED_AABB') {
            this.#material.color.setColorByRGB(0, 255, 0);
        } else if (value === 'BOTH') {
            this.#material.color.setColorByRGB(255, 0, 0);
            this.#aabbMaterial.color.setColorByRGB(0, 255, 0);
        }
        // 디버그 모드가 변경되면 캐시 무효화 (다음 렌더링에서 업데이트 강제)
        this.#cachedOBB = null;
        this.#cachedAABB = null;
    }

    render(renderViewStateData: RenderViewStateData) {
        if (!this.#target.enableDebugger) return;
        if (this.#debugMode === 'OBB') {
            const targetOBB = this.#target.boundingOBB;
            // OBB가 변경된 경우에만 업데이트
            if (this.#hasOBBChanged(targetOBB)) {
                this.#updateVertexDataFromOBB(targetOBB, this.#vertexBuffer);
                this.#cacheOBB(targetOBB);
            }
        } else if (this.#debugMode === 'AABB' || this.#debugMode === 'COMBINED_AABB') {
            const targetAABB = this.#debugMode === 'COMBINED_AABB' ? this.#target.combinedBoundingAABB : this.#target.boundingAABB;
            // AABB가 변경된 경우에만 업데이트
            if (this.#hasAABBChanged(targetAABB)) {
                this.#updateVertexDataFromAABB(targetAABB, this.#vertexBuffer);
                this.#cacheAABB(targetAABB);
            }
        } else if (this.#debugMode === 'BOTH') {
            const targetOBB = this.#target.boundingOBB;
            const targetAABB = this.#target.boundingAABB;
            // OBB (빨간색) - 변경된 경우에만 업데이트
            if (this.#hasOBBChanged(targetOBB)) {
                this.#updateVertexDataFromOBB(targetOBB, this.#vertexBuffer);
                this.#cacheOBB(targetOBB);
            }
            // AABB (초록색) - 변경된 경우에만 업데이트
            if (this.#hasAABBChanged(targetAABB)) {
                this.#updateVertexDataFromAABB(targetAABB, this.#aabbDebugMesh.geometry.vertexBuffer);
                this.#cacheAABB(targetAABB);
            }
        }
        let passFrustumAABBCulling = true
        let passFrustumOBBCulling = true
        {
            const {frustumPlanes} = renderViewStateData
            const frustumPlanes0 = frustumPlanes[0];
            const frustumPlanes1 = frustumPlanes[1];
            const frustumPlanes2 = frustumPlanes[2];
            const frustumPlanes3 = frustumPlanes[3];
            const frustumPlanes4 = frustumPlanes[4];
            const frustumPlanes5 = frustumPlanes[5];
            {
                const boundBox = this.#target.boundingAABB;
                const centerX = boundBox.centerX;
                const centerY = boundBox.centerY;
                const centerZ = boundBox.centerZ;
                const radius = boundBox.geometryRadius;
                // 각 frustum plane에 대해 거리 계산
                frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius ? passFrustumAABBCulling = false
                    : frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius ? passFrustumAABBCulling = false
                        : frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius ? passFrustumAABBCulling = false
                            : frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius ? passFrustumAABBCulling = false
                                : frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius ? passFrustumAABBCulling = false
                                    : frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius ? passFrustumAABBCulling = false : 0;
            }
            {
                const boundBox = this.#target.boundingOBB;
                const centerX = boundBox.centerX;
                const centerY = boundBox.centerY;
                const centerZ = boundBox.centerZ;
                const radius = boundBox.geometryRadius;
                // 각 frustum plane에 대해 거리 계산
                frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius ? passFrustumOBBCulling = false
                    : frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius ? passFrustumOBBCulling = false
                        : frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius ? passFrustumOBBCulling = false
                            : frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius ? passFrustumOBBCulling = false
                                : frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius ? passFrustumOBBCulling = false
                                    : frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius ? passFrustumOBBCulling = false : 0;
            }
        }
        if (this.#debugMode === 'OBB') {
            if (passFrustumOBBCulling) this.#debugMesh.render(renderViewStateData);
        } else if (this.#debugMode === 'AABB' || this.#debugMode === 'COMBINED_AABB') {
            if (passFrustumAABBCulling) this.#debugMesh.render(renderViewStateData);
        } else if (this.#debugMode === 'BOTH') {
            if (passFrustumOBBCulling) this.#debugMesh.render(renderViewStateData);
            if (passFrustumAABBCulling) this.#aabbDebugMesh.render(renderViewStateData);
        }
    }

    #createWireframeBoxGeometry(redGPUContext: RedGPUContext): Geometry {
        const vertices = new Float32Array(24 * 12); // 8 -> 12 (pos:3, normal:3, uv:2, tangent:4)
        const interleavedStruct = new VertexInterleavedStruct(
            {
                vertexPosition: VertexInterleaveType.float32x3,
                vertexNormal: VertexInterleaveType.float32x3,
                texcoord: VertexInterleaveType.float32x2,
                vertexTangent: VertexInterleaveType.float32x4,
            },
            `wireframeBoxStruct_${Math.random()}`
        );
        const vertexBuffer = new VertexBuffer(
            redGPUContext,
            vertices,
            interleavedStruct
        );
        return new Geometry(redGPUContext, vertexBuffer);
    }

    #hasOBBChanged(currentOBB: OBB): boolean {
        if (!this.#cachedOBB) return true;
        const cached = this.#cachedOBB;
        return (
            cached.center[0] !== currentOBB.center[0] ||
            cached.center[1] !== currentOBB.center[1] ||
            cached.center[2] !== currentOBB.center[2] ||
            cached.halfExtents[0] !== currentOBB.halfExtents[0] ||
            cached.halfExtents[1] !== currentOBB.halfExtents[1] ||
            cached.halfExtents[2] !== currentOBB.halfExtents[2] ||
            !this.#isMatrixEqual(cached.orientation, currentOBB.orientation)
        );
    }

    #hasAABBChanged(currentAABB: AABB): boolean {
        if (!this.#cachedAABB) return true;
        const cached = this.#cachedAABB;
        return (
            cached.minX !== currentAABB.minX ||
            cached.maxX !== currentAABB.maxX ||
            cached.minY !== currentAABB.minY ||
            cached.maxY !== currentAABB.maxY ||
            cached.minZ !== currentAABB.minZ ||
            cached.maxZ !== currentAABB.maxZ
        );
    }

    #isMatrixEqual(a: Float32Array | number[] | mat4, b: Float32Array | number[] | mat4): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (Math.abs(a[i] - b[i]) > 0.0001) return false; // 부동소수점 오차 허용
        }
        return true;
    }

    #cacheOBB(obb: OBB): void {
        this.#cachedOBB = new OBB(
            obb.center,
            obb.halfExtents,
            obb.orientation,
        )
    }

    #cacheAABB(aabb: AABB): void {
        this.#cachedAABB = aabb.clone()
    }

    #updateVertexDataFromOBB(targetOBB: OBB, vertexBuffer: VertexBuffer) {
        const {center, halfExtents, orientation} = targetOBB;
        const transformedVertices = [];
        for (let i = 0; i < 8; i++) {
            const vertex = LOCAL_VERTICES[i];
            const scaledVertexX = vertex[0] * halfExtents[0];
            const scaledVertexY = vertex[1] * halfExtents[1];
            const scaledVertexZ = vertex[2] * halfExtents[2];
            const rotatedVertexX = orientation[0] * scaledVertexX + orientation[4] * scaledVertexY + orientation[8] * scaledVertexZ;
            const rotatedVertexY = orientation[1] * scaledVertexX + orientation[5] * scaledVertexY + orientation[9] * scaledVertexZ;
            const rotatedVertexZ = orientation[2] * scaledVertexX + orientation[6] * scaledVertexY + orientation[10] * scaledVertexZ;
            transformedVertices.push([
                rotatedVertexX + center[0],
                rotatedVertexY + center[1],
                rotatedVertexZ + center[2]
            ]);
        }
        this.#updateVertexBuffer(transformedVertices, vertexBuffer);
    }

    #updateVertexDataFromAABB(targetAABB: AABB, vertexBuffer: VertexBuffer) {
        const {minX, maxX, minY, maxY, minZ, maxZ} = targetAABB;
        const transformedVertices = [
            [minX, minY, minZ], [maxX, minY, minZ], [maxX, maxY, minZ], [minX, maxY, minZ], // 뒷면
            [minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ]  // 앞면
        ];
        this.#updateVertexBuffer(transformedVertices, vertexBuffer);
    }

    #updateVertexBuffer(transformedVertices: number[][], vertexBuffer: VertexBuffer) {
        const vertexData = vertexBuffer.data;
        let offset = 0;
        for (let i = 0; i < 12; i++) {
            const edge = EDGES[i];
            const startIdx = edge[0];
            const endIdx = edge[1];
            const start = transformedVertices[startIdx];
            const end = transformedVertices[endIdx];

            // 시작점
            vertexData[offset++] = start[0];
            vertexData[offset++] = start[1];
            vertexData[offset++] = start[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            // 탄젠트 (더미 데이터)
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            // 끝점
            vertexData[offset++] = end[0];
            vertexData[offset++] = end[1];
            vertexData[offset++] = end[2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            // 탄젠트 (더미 데이터)
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
        }
        vertexBuffer.updateAllData(vertexData);
    }
}

Object.freeze(DrawDebuggerMesh);
export default DrawDebuggerMesh;
