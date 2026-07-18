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
    constructor(redGPUContext: RedGPUContext, resolution: number = 128) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];

        // 1. 2D 평면 격자 정점 생성 (X, Z 범위: 0.0 ~ 1.0)
        for (let iy = 0; iy <= resolution; iy++) {
            const z = iy / resolution;
            // WebGPU/Vulkan의 V축 방향 특성을 고려하여,
            // z가 0일 때(월드 뒤쪽) V가 0, z가 1일 때(월드 앞쪽) V가 1이 되도록 맞추거나
            // 이미지 투영 기준에 따라 1.0 - z 처리를 고민해야 합니다. 보통은 z 그대로 쓰되 인덱스를 정렬합니다.
            const v = z;

            for (let ix = 0; ix <= resolution; ix++) {
                const x = ix / resolution;
                const u = x;

                interleaveData.push(
                    x, 0, z,       // vertexPosition
                    0, 1, 0,       // vertexNormal
                    u, v,          // texcoord
                    1, 0, 0, 1     // vertexTangent (X축 방향이 기본 탄젠트이므로 1,0,0,1이 좀 더 표준적)
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
