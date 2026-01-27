import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * [KO] Sphere(구) 기본 도형 클래스입니다.
 * [EN] Sphere primitive geometry class.
 *
 * [KO] 반지름, 세그먼트 등을 기반으로 3D 구 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D spherical data based on radius, segments, etc.
 *
 * * ### Example
 * ```typescript
 * // 반지름 1, 32x16 세그먼트 구 생성
 * const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 16);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/sphere/"></iframe>
 * @category Primitive
 */
class Sphere extends Primitive {
    #makeData = (function () {
        // 재사용할 변수들
        let thetaEnd: number;
        let ix: number, iy: number;
        let index: number;
        let grid: number[][] = [];
        let a: number, b: number, c: number, d: number;
        const vertex = new Float32Array(3);
        const normal = new Float32Array(3);
        return function (uniqueKey, redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize) {
            thetaEnd = thetaStart + thetaLength;
            index = 0;
            // 그리드 초기화 (내부 배열들도 정리)
            grid.length = 0;
            const interleaveData: number[] = [];
            const indexData: number[] = [];
            // 정점, 노멀, UV 생성
            for (iy = 0; iy <= heightSegments; iy++) {
                const verticesRow: number[] = [];
                const v = iy / heightSegments;
                for (ix = 0; ix <= widthSegments; ix++) {
                    const u = ix / widthSegments;
                    // 구면 좌표 → 직교 좌표 변환
                    vertex[0] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex[1] = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    interleaveData.push(vertex[0], vertex[1], vertex[2]);
                    // 노멀 계산 (구면에서는 정점 위치를 정규화)
                    normal[0] = vertex[0];
                    normal[1] = vertex[1];
                    normal[2] = vertex[2];
                    vec3.normalize(normal, normal);
                    interleaveData.push(normal[0], normal[1], normal[2]);
                    // UV 좌표
                    interleaveData.push(u * uvSize, v * uvSize);
                    verticesRow.push(index++);
                }
                grid.push(verticesRow);
            }
            // 인덱스 생성 (극점 처리 포함)
            for (iy = 0; iy < heightSegments; iy++) {
                for (ix = 0; ix < widthSegments; ix++) {
                    a = grid[iy][ix + 1];
                    b = grid[iy][ix];
                    c = grid[iy + 1][ix];
                    d = grid[iy + 1][ix + 1];
                    // 북극점 처리 (첫 번째 행에서 퇴화 삼각형 방지)
                    if (iy !== 0 || thetaStart > 0) {
                        indexData.push(a, b, d);
                    }
                    // 남극점 처리 (마지막 행에서 퇴화 삼각형 방지)
                    if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
                        indexData.push(b, c, d);
                    }
                }
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
        };
    })();

    /**
     * [KO] Sphere 인스턴스를 생성합니다.
     * [EN] Creates an instance of Sphere.
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
     * @param uvSize - 
     * [KO] UV 스케일 (기본값 1) 
     * [EN] UV scale (default 1)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 1,
        widthSegments: number = 16,
        heightSegments: number = 16,
        phiStart: number = 0,
        phiLength: number = Math.PI * 2,
        thetaStart: number = 0,
        thetaLength: number = Math.PI,
        uvSize: number = 1
    ) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_SPHERE_R${radius}_WS${widthSegments}_HS${heightSegments}_PS${phiStart}_PL${phiLength}_TS${thetaStart}_TL${thetaLength}_UV${uvSize}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(
                uniqueKey, redGPUContext, radius, widthSegments, heightSegments,
                phiStart, phiLength, thetaStart, thetaLength, uvSize
            );
        }
        this._setData(geometry);
    }
}

export default Sphere;
