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
    constructor(redGPUContext: RedGPUContext, resolution: number = 256) {
        const interleaveData: number[] = [];
        const indexData: number[] = [];

        // 1. 2D 평면 격자 정점 생성 (X, Z 범위를 -0.5 ~ 0.5로 중심 정렬하여 월드 1칸 스케일에 매칭)
        for (let iy = 0; iy <= resolution; iy++) {
            const ratioZ = iy / resolution;
            const z = ratioZ - 0.5; // 로컬 원점을 중앙(0,0)으로 이동

            // WebGPU/Vulkan의 V축 방향 특성을 고려한 UV 매핑 (0.0 ~ 1.0)
            const v = ratioZ;

            for (let ix = 0; ix <= resolution; ix++) {
                const ratioX = ix / resolution;
                const x = ratioX - 0.5; // 로컬 원점을 중앙(0,0)으로 이동
                const u = ratioX;

                interleaveData.push(
                    x, 0, z,       // vertexPosition
                    0, 1, 0,       // vertexNormal
                    u, v,          // texcoord
                    1, 0, 0, 1     // vertexTangent (X축 방향 기본 탄젠트 표준 적용)
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