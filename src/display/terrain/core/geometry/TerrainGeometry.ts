import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import VertexBuffer from "../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../../../primitive/core/Primitive";

class TerrainGeometry extends Geometry {
    constructor(redGPUContext: RedGPUContext, verticesPerSide: number = 64, skirtDepth: number = 0.1) {
        const quadsPerSide = verticesPerSide - 1;
        const mainVerticesCount = verticesPerSide * verticesPerSide;
        const skirtVerticesCount = quadsPerSide * 4 * 2;
        const totalVertices = mainVerticesCount + skirtVerticesCount;
        const totalVertexFloats = totalVertices * 12;

        const mainIndicesCount = quadsPerSide * quadsPerSide * 6;
        const skirtIndicesCount = quadsPerSide * 4 * 6;
        const totalIndices = mainIndicesCount + skirtIndicesCount;

        const interleaveData = new Float32Array(totalVertexFloats);
        const indexData = new Uint32Array(totalIndices);

        let vOffset = 0;
        let iOffset = 0;

        // 1. 메인 지형 그리드 정점 생성
        for (let iy = 0; iy < verticesPerSide; iy++) {
            const ratioZ = iy / quadsPerSide;
            const z = ratioZ - 0.5;
            const v = ratioZ;

            for (let ix = 0; ix < verticesPerSide; ix++) {
                const ratioX = ix / quadsPerSide;
                const x = ratioX - 0.5;
                const u = ratioX;

                interleaveData[vOffset++] = x;
                interleaveData[vOffset++] = 0;
                interleaveData[vOffset++] = z;

                interleaveData[vOffset++] = 0;
                interleaveData[vOffset++] = 1;
                interleaveData[vOffset++] = 0;

                interleaveData[vOffset++] = u;
                interleaveData[vOffset++] = v;

                interleaveData[vOffset++] = 1;
                interleaveData[vOffset++] = 0;
                interleaveData[vOffset++] = 0;
                interleaveData[vOffset++] = 1;
            }
        }

        // 2. 메인 지형 트라이앵글 인덱스 생성
        for (let iy = 0; iy < quadsPerSide; iy++) {
            for (let ix = 0; ix < quadsPerSide; ix++) {
                const a = ix + verticesPerSide * iy;
                const b = ix + verticesPerSide * (iy + 1);
                const c = (ix + 1) + verticesPerSide * (iy + 1);
                const d = (ix + 1) + verticesPerSide * iy;

                indexData[iOffset++] = a;
                indexData[iOffset++] = b;
                indexData[iOffset++] = c;
                indexData[iOffset++] = a;
                indexData[iOffset++] = c;
                indexData[iOffset++] = d;
            }
        }

        // 3. T-Junction 크랙 차단용 Skirt 정점 생성 헬퍼
        let skirtVertexIndex = mainVerticesCount;
        const addSkirtVertex = (ix: number, iy: number): number => {
            const ratioX = ix / quadsPerSide;
            const ratioZ = iy / quadsPerSide;
            const x = ratioX - 0.5;
            const z = ratioZ - 0.5;
            const u = ratioX;
            const v = ratioZ;

            interleaveData[vOffset++] = x;
            interleaveData[vOffset++] = -skirtDepth;
            interleaveData[vOffset++] = z;

            interleaveData[vOffset++] = 0;
            interleaveData[vOffset++] = -1;
            interleaveData[vOffset++] = 0;

            interleaveData[vOffset++] = u;
            interleaveData[vOffset++] = v;

            interleaveData[vOffset++] = 1;
            interleaveData[vOffset++] = 0;
            interleaveData[vOffset++] = 0;
            interleaveData[vOffset++] = 1;

            return skirtVertexIndex++;
        };

        // 4. 4개 테두리 엣지 Skirt 인덱스 엮기
        // Bottom Edge
        for (let ix = 0; ix < quadsPerSide; ix++) {
            const v0 = ix;
            const v1 = ix + 1;
            const s0 = addSkirtVertex(ix, 0);
            const s1 = addSkirtVertex(ix + 1, 0);
            indexData[iOffset++] = v0;
            indexData[iOffset++] = s1;
            indexData[iOffset++] = s0;
            indexData[iOffset++] = v0;
            indexData[iOffset++] = v1;
            indexData[iOffset++] = s1;
        }

        // Right Edge
        for (let iy = 0; iy < quadsPerSide; iy++) {
            const v0 = quadsPerSide + verticesPerSide * iy;
            const v1 = quadsPerSide + verticesPerSide * (iy + 1);
            const s0 = addSkirtVertex(quadsPerSide, iy);
            const s1 = addSkirtVertex(quadsPerSide, iy + 1);
            indexData[iOffset++] = v0;
            indexData[iOffset++] = s1;
            indexData[iOffset++] = s0;
            indexData[iOffset++] = v0;
            indexData[iOffset++] = v1;
            indexData[iOffset++] = s1;
        }

        // Top Edge
        for (let ix = 0; ix < quadsPerSide; ix++) {
            const v0 = (ix + 1) + verticesPerSide * quadsPerSide;
            const v1 = ix + verticesPerSide * quadsPerSide;
            const s0 = addSkirtVertex(ix + 1, quadsPerSide);
            const s1 = addSkirtVertex(ix, quadsPerSide);
            indexData[iOffset++] = v0;
            indexData[iOffset++] = s1;
            indexData[iOffset++] = s0;
            indexData[iOffset++] = v0;
            indexData[iOffset++] = v1;
            indexData[iOffset++] = s1;
        }

        // Left Edge
        for (let iy = 0; iy < quadsPerSide; iy++) {
            const v0 = verticesPerSide * (iy + 1);
            const v1 = verticesPerSide * iy;
            const s0 = addSkirtVertex(0, iy + 1);
            const s1 = addSkirtVertex(0, iy);
            indexData[iOffset++] = v0;
            indexData[iOffset++] = s1;
            indexData[iOffset++] = s0;
            indexData[iOffset++] = v0;
            indexData[iOffset++] = v1;
            indexData[iOffset++] = s1;
        }

        const vertexBuffer = new VertexBuffer(
            redGPUContext,
            interleaveData,
            Primitive.primitiveInterleaveStruct,
            undefined,
            `VertexBuffer_TerrainGeometry`
        );

        const indexBuffer = new IndexBuffer(
            redGPUContext,
            indexData,
            undefined,
            `IndexBuffer_TerrainGeometry`
        );

        super(redGPUContext, vertexBuffer, indexBuffer);
    }
}

Object.freeze(TerrainGeometry);
export default TerrainGeometry;