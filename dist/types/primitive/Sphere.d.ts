import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
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
declare class Sphere extends Primitive {
    #private;
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
     * @param uvSize -
     * [KO] UV 스케일 (기본값 1)
     * [EN] UV scale (default 1)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number, uvSize?: number);
}
export default Sphere;
