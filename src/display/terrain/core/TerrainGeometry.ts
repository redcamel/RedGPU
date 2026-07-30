import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../../primitive/core/Primitive";

class TerrainGeometry extends Geometry {
    constructor(redGPUContext: RedGPUContext, verticesPerSide: number = 64) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];
        const quadsPerSide = verticesPerSide - 1;

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

        for (let iy = 0; iy < quadsPerSide; iy++) {
            for (let ix = 0; ix < quadsPerSide; ix++) {
                const a = ix + verticesPerSide * iy;
                const b = ix + verticesPerSide * (iy + 1);
                const c = (ix + 1) + verticesPerSide * (iy + 1);
                const d = (ix + 1) + verticesPerSide * iy;
                indexData.push(a, b, c, a, c, d);
            }
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