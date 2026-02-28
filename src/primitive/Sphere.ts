import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Sphere(구) 기본 도형 클래스입니다.
 * [EN] Sphere primitive geometry class.
 *
 * [KO] 반지름, 세그먼트 등을 기반으로 3D 구 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D spherical data based on radius, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 1, 32x16 세그먼트 구 생성
 * const sphere = new RedGPU.Sphere(redGPUContext, 1, 32, 16);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/sphere/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Sphere extends Primitive {
    /**
     * [KO] Sphere 인스턴스를 생성합니다.
     * [EN] Creates an instance of Sphere.
     *
     * ### Example
     * ```typescript
     * const sphere = new RedGPU.Sphere(redGPUContext, 1, 32, 16);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 구 반지름 (기본값 1)
     * [EN] Sphere radius (default 1)
     * @param widthSegments -
     * [KO] 가로 세그먼트 수 (기본값 16, 최소 3)
     * [EN] Width segments (default 16, min 3)
     * @param heightSegments -
     * [KO] 세로 세그먼트 수 (기본값 16, 최소 2)
     * [EN] Height segments (default 16, min 2)
     * @param phiStart -
     * [KO] 수평 시작 각도 (라디안, 기본값 0)
     * [EN] Horizontal start angle (radians, default 0)
     * @param phiLength -
     * [KO] 수평 각도 길이 (라디안, 기본값 2*PI)
     * [EN] Horizontal angle length (radians, default 2*PI)
     * @param thetaStart -
     * [KO] 수직 시작 각도 (라디안, 기본값 0)
     * [EN] Vertical start angle (radians, default 0)
     * @param thetaLength -
     * [KO] 수직 각도 길이 (라디안, 기본값 PI)
     * [EN] Vertical angle length (radians, default PI)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 1,
        widthSegments: number = 16,
        heightSegments: number = 16,
        phiStart: number = 0,
        phiLength: number = Math.PI * 2,
        thetaStart: number = 0,
        thetaLength: number = Math.PI
    ) {
        const uniqueKey = `PRIMITIVE_SPHERE_R${radius}_WS${widthSegments}_HS${heightSegments}_PS${phiStart}_PL${phiLength}_TS${thetaStart}_TL${thetaLength}`;
        super(redGPUContext, uniqueKey, () => makeData(
            uniqueKey, redGPUContext, radius, widthSegments, heightSegments,
            phiStart, phiLength, thetaStart, thetaLength
        ));
    }
}

const makeData = function (uniqueKey, redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    const vertex = new Float32Array(3);
    const normal = new Float32Array(3);

    const interleaveData = [];
    const indexData = [];
    const gridX1 = widthSegments + 1;

    // [안전장치] 최소 1개의 정점은 생성하여 0바이트 버퍼 에러 방지 (인덱스는 비워둠)
    if (radius <= 0 || Math.abs(phiLength) < 1e-6 || Math.abs(thetaLength) < 1e-6) {
        PrimitiveUtils.interleavePacker(interleaveData, 0, 0, 0, 0, 0, 0, 0, 0);
        return createPrimitiveGeometry(redGPUContext, interleaveData, [], uniqueKey);
    }

    // 정점, 노멀, UV 생성
    for (let iy = 0; iy <= heightSegments; iy++) {
        const v = iy / heightSegments;
        const theta = thetaStart + v * thetaLength;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let ix = 0; ix <= widthSegments; ix++) {
            const u = ix / widthSegments;
            // [교정] 3시 방향 시작, 시계 방향 회전 (Cylinder 안정화 공식 적용)
            const phi = phiStart + u * phiLength;
            const sinPhi = -Math.sin(phi); // 시계 방향
            const cosPhi = Math.cos(phi);

            // x = cos(phi)sin(theta), y = cos(theta), z = sin(phi)sin(theta)
            vertex[0] = radius * cosPhi * sinTheta;
            vertex[1] = radius * cosTheta;
            vertex[2] = radius * sinPhi * sinTheta;

            // 노멀 계산
            normal[0] = vertex[0];
            normal[1] = vertex[1];
            normal[2] = vertex[2];
            vec3.normalize(normal, normal);

            // UV & Packing (v는 V-Down 표준 유지)
            PrimitiveUtils.interleavePacker(
                interleaveData,
                vertex[0], vertex[1], vertex[2],
                normal[0], normal[1], normal[2],
                u, v
            );
        }
    }

    // 인덱스 생성 (PrimitiveUtils.generateGridIndices 사용)
    // [교정] 시계 방향 정점 생성 + 표준 인덱스 = CCW 와인딩 (바깥쪽 앞면)
    PrimitiveUtils.generateGridIndices(indexData, 0, widthSegments, heightSegments, gridX1, false);

    PrimitiveUtils.calculateTangents(interleaveData, indexData);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
};

export default Sphere;
