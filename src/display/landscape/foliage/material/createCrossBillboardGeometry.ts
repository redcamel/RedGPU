import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import VertexBuffer from "../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../resources/buffer/indexBuffer/IndexBuffer";
import Primitive from "../../../../primitive/core/Primitive";
import {calculateTangentsInterleaved} from "../../../../math/calculateTangents";

/**
 * [KO] 언리얼 엔진 5(UE5) 스타일의 3-Plane Star (0°, 60°, 120° 수직 3장 6각 별 모양) 크로스 빌보드 지오메트리를 생성합니다.
 *      수평면 없이 수직 판자 3장이 6방향으로 뻗어 있어 지상/공중 모든 각도에서 왜곡 없는 완벽한 원형 3D 수목 볼륨을 형성합니다.
 * [EN] Creates a UE5 style 3-Plane Star (0°, 60°, 120° 3-plane star) cross-billboard geometry.
 *
 * @param redGPUContext - RedGPUContext 인스턴스
 * @param width - 빌보드 가로 폭 (기본값 6.0)
 * @param height - 빌보드 세로 높이 (기본값 8.0)
 * @param sphericalCenterHeightRatio - 구형 노멀 중심점 높이 비율 (기본값 0.6)
 * @param wireframe - 라인 모드(와이어프레임) 선분 인덱스 생성 여부 (기본값 false)
 * @returns 3-Way 아틀라스 UV가 매핑된 3-Plane Star 빌보드 Geometry
 */
export function createCrossBillboardGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 8.0,
    sphericalCenterHeightRatio: number = 0.6,
    wireframe: boolean = false
): Geometry {
    const halfW = width * 0.5;

    const u0 = 0.0;
    const u1 = 1.0 / 3.0; // 0° View
    const u2 = 2.0 / 3.0; // 60° View
    const u3 = 1.0;       // 120° View

    // 🌟 3-Plane Star: 0°, 60°, 120° 3개 각도 평면 정의 (각도 k * 60°)
    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3]; // 0°, 60°, 120°
    const uRanges = [
        {start: u0, end: u1},
        {start: u1, end: u2},
        {start: u2, end: u3}
    ];

    const rawVertices: Array<{
        x: number; y: number; z: number;
        u: number; v: number;
        nx: number; ny: number; nz: number;
    }> = [];

    for (let i = 0; i < 3; i++) {
        const rad = angles[i];
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // 평면 법선 (Normal): 각도에 직교하는 수평 벡터
        const nx = sin;
        const nz = -cos;

        const leftX = -halfW * cos;
        const leftZ = -halfW * sin;
        const rightX = halfW * cos;
        const rightZ = halfW * sin;

        const uStart = uRanges[i].start;
        const uEnd = uRanges[i].end;

        // Quad 버텍스 4개 (v: 0 = Bottom, 1 = Top)
        // v0: 좌하단
        rawVertices.push({x: leftX, y: 0.0, z: leftZ, u: uStart, v: 1.0, nx, ny: 0, nz});
        // v1: 우하단
        rawVertices.push({x: rightX, y: 0.0, z: rightZ, u: uEnd, v: 1.0, nx, ny: 0, nz});
        // v2: 우상단
        rawVertices.push({x: rightX, y: height, z: rightZ, u: uEnd, v: 0.0, nx, ny: 0, nz});
        // v3: 좌상단
        rawVertices.push({x: leftX, y: height, z: leftZ, u: uStart, v: 0.0, nx, ny: 0, nz});
    }

    const interleavedData: number[] = [];
    for (const v of rawVertices) {
        interleavedData.push(
            v.x, v.y, v.z,          // Position (0..2)
            v.nx, v.ny, v.nz,       // Normal (3..5)
            v.u, v.v,               // UV (6..7)
            0, 0, 0, 0              // Tangent placeholder (8..11)
        );
    }

    const indexData: number[] = [];
    if (wireframe) {
        for (let i = 0; i < 3; i++) {
            const base = i * 4;
            indexData.push(
                base, base + 1,
                base + 1, base + 2,
                base + 2, base + 3,
                base + 3, base,
                base, base + 2,
                base + 1, base + 3
            );
        }
    } else {
        for (let i = 0; i < 3; i++) {
            const base = i * 4;
            indexData.push(
                base, base + 1, base + 2,
                base, base + 2, base + 3
            );
        }
    }

    const interleavedFloat32 = new Float32Array(interleavedData);
    const indexUint32 = new Uint32Array(indexData);

    calculateTangentsInterleaved(interleavedFloat32, indexUint32, 12, 0, 3, 6, 8);

    const wireframeKey = wireframe ? '_wf' : '';
    const vKey = `CrossBillboard_VB_${width}_${height}${wireframeKey}`;
    const iKey = `CrossBillboard_IB_${width}_${height}${wireframeKey}`;
    const vb = new VertexBuffer(redGPUContext, interleavedFloat32, Primitive.primitiveInterleaveStruct, undefined, vKey);
    const ib = new IndexBuffer(redGPUContext, indexUint32, undefined, iKey);
    return new Geometry(redGPUContext, vb, ib);
}
