import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import RenderViewStateData from "../view/core/RenderViewStateData";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import AABB from "../../utils/math/bound/AABB";
import OBB from "../../utils/math/bound/OBB";
import Mesh from "../mesh/Mesh";

type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';

class DrawDebuggerMesh {
    #redGPUContext: RedGPUContext;
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
        this.#redGPUContext = redGPUContext;
        this.#target = target;
        const geometry = this.#createWireframeBoxGeometry(redGPUContext);
        this.#vertexBuffer = geometry.vertexBuffer;
        this.#material = new ColorMaterial(redGPUContext);
        this.#material.color.setColorByRGB(255, 0, 0);
        this.#debugMesh = new Mesh(redGPUContext, geometry, this.#material);
        this.#debugMesh.primitiveState.cullMode = 'none';
        this.#debugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
        // this.#debugMesh.disableJitter=true
        const aabbGeometry = this.#createWireframeBoxGeometry(redGPUContext);
        this.#aabbMaterial = new ColorMaterial(redGPUContext);
        this.#aabbMaterial.color.setColorByRGB(0, 255, 0);
        this.#aabbDebugMesh = new Mesh(redGPUContext, aabbGeometry, this.#aabbMaterial);
        this.#aabbDebugMesh.primitiveState.cullMode = 'none';
        this.#aabbDebugMesh.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
        // this.#aabbDebugMesh.disableJitter=true
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
            this.#debugMesh.setPosition(0, 0, 0);
            this.#debugMesh.setRotation(0, 0, 0);
            this.#debugMesh.setScale(1, 1, 1);
            this.#debugMesh.render(renderViewStateData);
        } else if (this.#debugMode === 'AABB' || this.#debugMode === 'COMBINED_AABB') {
            const targetAABB = this.#debugMode === 'COMBINED_AABB' ? this.#target.combinedBoundingAABB : this.#target.boundingAABB;
            // AABB가 변경된 경우에만 업데이트
            if (this.#hasAABBChanged(targetAABB)) {
                this.#updateVertexDataFromAABB(targetAABB, this.#vertexBuffer);
                this.#cacheAABB(targetAABB);
            }
            this.#debugMesh.setPosition(0, 0, 0);
            this.#debugMesh.setRotation(0, 0, 0);
            this.#debugMesh.setScale(1, 1, 1);
            this.#debugMesh.render(renderViewStateData);
        } else if (this.#debugMode === 'BOTH') {
            const targetOBB = this.#target.boundingOBB;
            const targetAABB = this.#target.boundingAABB;
            // OBB (빨간색) - 변경된 경우에만 업데이트
            if (this.#hasOBBChanged(targetOBB)) {
                this.#updateVertexDataFromOBB(targetOBB, this.#vertexBuffer);
                this.#cacheOBB(targetOBB);
            }
            this.#debugMesh.setPosition(0, 0, 0);
            this.#debugMesh.setRotation(0, 0, 0);
            this.#debugMesh.setScale(1, 1, 1);
            this.#debugMesh.render(renderViewStateData);
            // AABB (초록색) - 변경된 경우에만 업데이트
            if (this.#hasAABBChanged(targetAABB)) {
                this.#updateVertexDataFromAABB(targetAABB, this.#aabbDebugMesh.geometry.vertexBuffer);
                this.#cacheAABB(targetAABB);
            }
            this.#aabbDebugMesh.setPosition(0, 0, 0);
            this.#aabbDebugMesh.setRotation(0, 0, 0);
            this.#aabbDebugMesh.setScale(1, 1, 1);
            this.#aabbDebugMesh.render(renderViewStateData);
        }
    }

    #createWireframeBoxGeometry(redGPUContext: RedGPUContext): Geometry {
        const vertices = new Float32Array(24 * 8);
        const interleavedStruct = new VertexInterleavedStruct(
            {
                vertexPosition: VertexInterleaveType.float32x3,
                vertexNormal: VertexInterleaveType.float32x3,
                texcoord: VertexInterleaveType.float32x2,
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

    #isMatrixEqual(a: Float32Array | number[], b: Float32Array | number[]): boolean {
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
        const localVertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        const transformedVertices = localVertices.map(vertex => {
            const scaledVertex = [
                vertex[0] * halfExtents[0],
                vertex[1] * halfExtents[1],
                vertex[2] * halfExtents[2]
            ];
            const rotatedVertex = [
                orientation[0] * scaledVertex[0] + orientation[4] * scaledVertex[1] + orientation[8] * scaledVertex[2],
                orientation[1] * scaledVertex[0] + orientation[5] * scaledVertex[1] + orientation[9] * scaledVertex[2],
                orientation[2] * scaledVertex[0] + orientation[6] * scaledVertex[1] + orientation[10] * scaledVertex[2]
            ];
            return [
                rotatedVertex[0] + center[0],
                rotatedVertex[1] + center[1],
                rotatedVertex[2] + center[2]
            ];
        });
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
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // 뒷면
            [4, 5], [5, 6], [6, 7], [7, 4], // 앞면
            [0, 4], [1, 5], [2, 6], [3, 7]  // 연결선
        ];
        const vertexData = vertexBuffer.data;
        let offset = 0;
        edges.forEach(([start, end]) => {
            // 시작점
            vertexData[offset++] = transformedVertices[start][0];
            vertexData[offset++] = transformedVertices[start][1];
            vertexData[offset++] = transformedVertices[start][2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            // 끝점
            vertexData[offset++] = transformedVertices[end][0];
            vertexData[offset++] = transformedVertices[end][1];
            vertexData[offset++] = transformedVertices[end][2];
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
            vertexData[offset++] = 1;
            vertexData[offset++] = 0;
            vertexData[offset++] = 0;
        });
        vertexBuffer.updateAllData(vertexData);
    }
}

Object.freeze(DrawDebuggerMesh);
export default DrawDebuggerMesh;
