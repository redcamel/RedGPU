import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import createPrimitiveGeometry from "../../../../primitive/core/createPrimitiveGeometry";
import {calculateTangentsInterleaved} from "../../../../math/calculateTangents";

/**
 * [KO] 언리얼 엔진 5(UE5 SpeedTree) 스타일의 구형 노멀(Spherical Normals) 내장 십자 빌보드 지오메트리를 생성합니다.
 * [EN] Creates an Unreal Engine 5 (UE5 SpeedTree) style cross-billboard geometry with embedded spherical normals.
 *
 * @param redGPUContext - RedGPUContext 인스턴스
 * @param width - 빌보드 가로 폭 (기본값 6.0)
 * @param height - 빌보드 세로 높이 (기본값 8.0)
 * @param sphericalCenterHeightRatio - 구형 노멀 중심점 높이 비율 (기본값 0.6)
 * @returns 구형 노멀 및 탄젠트가 베이킹된 십자 빌보드 Geometry
 */
export function createCrossBillboardGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 8.0,
    sphericalCenterHeightRatio: number = 0.6
): Geometry {
    const halfW = width * 0.5;
    const centerHeight = height * sphericalCenterHeightRatio;

    // 8개 정점 위치 정의 [X, Y, Z, U, V]
    // 0~3: 평면 1 (XY 평면, Z=0)
    // 4~7: 평면 2 (ZY 평면, X=0, 90도 교차)
    const rawVertices = [
        // Plane 1 (Z=0)
        {x: -halfW, y: 0, z: 0, u: 0, v: 1},
        {x: halfW, y: 0, z: 0, u: 1, v: 1},
        {x: halfW, y: height, z: 0, u: 1, v: 0},
        {x: -halfW, y: height, z: 0, u: 0, v: 0},
        // Plane 2 (X=0)
        {x: 0, y: 0, z: -halfW, u: 0, v: 1},
        {x: 0, y: 0, z: halfW, u: 1, v: 1},
        {x: 0, y: height, z: halfW, u: 1, v: 0},
        {x: 0, y: height, z: -halfW, u: 0, v: 0},
    ];

    const interleaveData: number[] = [];

    // 구형 노멀(Spherical Normals) 재구성을 위한 평면 기하 노멀 베이킹
    for (let i = 0; i < rawVertices.length; i++) {
        const v = rawVertices[i];
        const isPlane1 = i < 4;
        const nx = isPlane1 ? 0 : 1;
        const ny = 0;
        const nz = isPlane1 ? 1 : 0;

        // 12 float Stride: Pos(3), Normal(3), UV(2), Tangent(4)
        interleaveData.push(
            v.x, v.y, v.z, // Pos
            nx, ny, nz,    // Face Normal (평면 1: Z+, 평면 2: X+)
            v.u, v.v,      // UV
            isPlane1 ? 1 : 0, 0, isPlane1 ? 0 : 1, 1 // Tangent
        );
    }


    // 4개 삼각형 인덱스 (평면 1 + 평면 2)
    const indexData = [
        0, 1, 2, 0, 2, 3, // Plane 1
        4, 5, 6, 4, 6, 7  // Plane 2
    ];

    // 탄젠트 계산 (노멀 매핑 호환)
    calculateTangentsInterleaved(interleaveData, indexData, 12, 0, 3, 6, 8);

    const uniqueKey = `CrossBillboardGeometry_${width}_${height}_${sphericalCenterHeightRatio}`;
    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
}
