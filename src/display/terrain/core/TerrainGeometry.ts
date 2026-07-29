import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../../primitive/core/Primitive";

class TerrainGeometry extends Geometry {
    constructor(redGPUContext: RedGPUContext, resolution: number = 64) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];

        for (let iy = 0; iy <= resolution; iy++) {
            const ratioZ = iy / resolution;
            const z = ratioZ - 0.5;

            const v = ratioZ;

            for (let ix = 0; ix <= resolution; ix++) {
                const ratioX = ix / resolution;
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

        for (let iy = 0; iy < resolution; iy++) {
            for (let ix = 0; ix < resolution; ix++) {
                const a = ix + (resolution + 1) * iy;
                const b = ix + (resolution + 1) * (iy + 1);
                const c = (ix + 1) + (resolution + 1) * (iy + 1);
                const d = (ix + 1) + (resolution + 1) * iy;
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