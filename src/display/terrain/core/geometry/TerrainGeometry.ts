import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import VertexBuffer from "../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../../../primitive/core/Primitive";

class TerrainGeometry extends Geometry {
    constructor(redGPUContext: RedGPUContext, verticesPerSide: number = 64, skirtDepth: number = 0.1) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];
        const quadsPerSide = verticesPerSide - 1;

        // 1. 메인 지형 그리드 정점 생성
        for (let iy = 0; iy < verticesPerSide; iy++) {
            const ratioZ = iy / quadsPerSide;
            const z = ratioZ - 0.5;
            const v = ratioZ;

            for (let ix = 0; ix < verticesPerSide; ix++) {
                const ratioX = ix / quadsPerSide;
                const x = ratioX - 0.5;
                const u = ratioX;

                interleaveData.push(
                    x, 0, z,
                    0, 1, 0,
                    u, v,
                    1, 0, 0, 1
                );
            }
        }

        // 2. 메인 지형 트라이앵글 인덱스 생성
        for (let iy = 0; iy < quadsPerSide; iy++) {
            for (let ix = 0; ix < quadsPerSide; ix++) {
                const a = ix + verticesPerSide * iy;
                const b = ix + verticesPerSide * (iy + 1);
                const c = (ix + 1) + verticesPerSide * (iy + 1);
                const d = (ix + 1) + verticesPerSide * iy;
                indexData.push(a, b, c, a, c, d);
            }
        }

        // 3. T-Junction 크랙 완전 차단용 Edge Skirt(하향 수직 벽) 지오메트리 생성
        const addSkirtVertex = (ix: number, iy: number): number => {
            const ratioX = ix / quadsPerSide;
            const ratioZ = iy / quadsPerSide;
            const x = ratioX - 0.5;
            const z = ratioZ - 0.5;
            const u = ratioX;
            const v = ratioZ;

            interleaveData.push(
                x, -skirtDepth, z,
                0, -1, 0,
                u, v,
                1, 0, 0, 1
            );
            return (interleaveData.length / 12) - 1;
        };

        // 4개 테두리 엣지(Bottom, Right, Top, Left) Skirt 패널 인덱스 엮기
        // Bottom Edge (iy = 0)
        for (let ix = 0; ix < quadsPerSide; ix++) {
            const v0 = ix;
            const v1 = ix + 1;
            const s0 = addSkirtVertex(ix, 0);
            const s1 = addSkirtVertex(ix + 1, 0);
            indexData.push(v0, s1, s0, v0, v1, s1);
        }

        // Right Edge (ix = quadsPerSide)
        for (let iy = 0; iy < quadsPerSide; iy++) {
            const v0 = quadsPerSide + verticesPerSide * iy;
            const v1 = quadsPerSide + verticesPerSide * (iy + 1);
            const s0 = addSkirtVertex(quadsPerSide, iy);
            const s1 = addSkirtVertex(quadsPerSide, iy + 1);
            indexData.push(v0, s1, s0, v0, v1, s1);
        }

        // Top Edge (iy = quadsPerSide)
        for (let ix = 0; ix < quadsPerSide; ix++) {
            const v0 = (ix + 1) + verticesPerSide * quadsPerSide;
            const v1 = ix + verticesPerSide * quadsPerSide;
            const s0 = addSkirtVertex(ix + 1, quadsPerSide);
            const s1 = addSkirtVertex(ix, quadsPerSide);
            indexData.push(v0, s1, s0, v0, v1, s1);
        }

        // Left Edge (ix = 0)
        for (let iy = 0; iy < quadsPerSide; iy++) {
            const v0 = verticesPerSide * (iy + 1);
            const v1 = verticesPerSide * iy;
            const s0 = addSkirtVertex(0, iy + 1);
            const s1 = addSkirtVertex(0, iy);
            indexData.push(v0, s1, s0, v0, v1, s1);
        }

        const vertexBuffer = new VertexBuffer(
            redGPUContext,
            new Float32Array(interleaveData),
            Primitive.primitiveInterleaveStruct,
            undefined,
            `VertexBuffer_TerrainGeometry`
        );

        const indexBuffer = new IndexBuffer(
            redGPUContext,
            new Uint32Array(indexData),
            undefined,
            `IndexBuffer_TerrainGeometry`
        );

        super(redGPUContext, vertexBuffer, indexBuffer);
    }
}

Object.freeze(TerrainGeometry);
export default TerrainGeometry;