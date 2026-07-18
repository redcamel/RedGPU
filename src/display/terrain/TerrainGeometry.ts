import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../primitive/core/Primitive";

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 2D 평면 그리드 지오메트리 클래스입니다.
 * [EN] 2D plane grid geometry class used for CDLOD terrain rendering.
 */
class TerrainGeometry extends Geometry {
    /**
     * [KO] TerrainGeometry 인스턴스를 생성합니다.
     * [EN] Creates a TerrainGeometry instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param resolution - [KO] 그리드 분할 정밀도 (기본값 64) [EN] Grid division resolution (default 64)
     */
    constructor(redGPUContext: RedGPUContext, resolution: number = 64) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];

        // 1. 2D 평면 격자 정점 생성 (X, Z 범위: 0.0 ~ 1.0)
        for (let iy = 0; iy <= resolution; iy++) {
            const z = iy / resolution;
            for (let ix = 0; ix <= resolution; ix++) {
                const x = ix / resolution;
                interleaveData.push(
                    x, 0, z,       // vertexPosition
                    0, 1, 0,       // vertexNormal
                    x, z,          // texcoord
                    0, 0, 0, 1     // vertexTangent
                );
            }
        }

        // 2. 인덱스 생성
        for (let iy = 0; iy < resolution; iy++) {
            for (let ix = 0; ix < resolution; ix++) {
                const a = ix + (resolution + 1) * iy;
                const b = ix + (resolution + 1) * (iy + 1);
                const c = (ix + 1) + (resolution + 1) * (iy + 1);
                const d = (ix + 1) + (resolution + 1) * iy;
                indexData.push(a, b, d, b, c, d);
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
