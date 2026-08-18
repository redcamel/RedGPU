import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import createPrimitiveGeometry from "../../../../primitive/core/createPrimitiveGeometry";
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

        // 평면 가로 축 방향 벡터: [-cos, 0, sin]
        const dx = cos * halfW;
        const dz = -sin * halfW;

        // 평면 법선 벡터: [sin, 0, cos]
        const nx = sin;
        const nz = cos;

        const uStart = uRanges[i].start;
        const uEnd = uRanges[i].end;

        // 4개 정점 (좌하 -> 우하 -> 우상 -> 좌상)
        rawVertices.push(
            {x: -dx, y: 0, z: -dz, u: uStart, v: 1.0, nx: nx, ny: 0, nz: nz},      // 0: Bottom-Left
            {x: dx, y: 0, z: dz, u: uEnd, v: 1.0, nx: nx, ny: 0, nz: nz},      // 1: Bottom-Right
            {x: dx, y: height, z: dz, u: uEnd, v: 0.0, nx: nx, ny: 0, nz: nz}, // 2: Top-Right
            {x: -dx, y: height, z: -dz, u: uStart, v: 0.0, nx: nx, ny: 0, nz: nz}  // 3: Top-Left
        );
    }

    const interleaveData: number[] = [];

    for (let i = 0; i < rawVertices.length; i++) {
        const v = rawVertices[i];
        interleaveData.push(
            v.x, v.y, v.z,
            v.nx, v.ny, v.nz,
            v.u, v.v,
            1.0, 0.0, 0.0, 1.0
        );
    }

    let indexData: number[];

    if (wireframe) {
        // 라인 모드 선분 인덱스
        indexData = [
            0, 1, 1, 2, 2, 3, 3, 0, 0, 2,
            4, 5, 5, 6, 6, 7, 7, 4, 4, 6,
            8, 9, 9, 10, 10, 11, 11, 8, 8, 10
        ];
    } else {
        // 솔리드 모드 삼각형 인덱스 (CCW)
        indexData = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 11, 10, 8, 10, 9
        ];
    }

    if (!wireframe) {
        calculateTangentsInterleaved(interleaveData, indexData, 12, 0, 3, 6, 8);
    }

    const uniqueKey = `CrossBillboard3StarGeometry_${width}_${height}_wf${wireframe}_${Date.now()}`;
    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
}
