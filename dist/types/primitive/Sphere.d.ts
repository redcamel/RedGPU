import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Sphere(구) 기본 도형 클래스입니다.
 * 반지름, 가로/세로 세그먼트, 시작/길이 각도, UV 스케일 등 다양한 파라미터로 3D 구 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 1, 32x16 세그먼트 구 생성 및 씬에 추가
 * const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 16);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/sphere/"></iframe>
 */
declare class Sphere extends Primitive {
    #private;
    /**
     * Sphere 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param radius 구 반지름 (기본값 1)
     * @param widthSegments 가로 세그먼트 수 (기본값 16, 최소 3)
     * @param heightSegments 세로 세그먼트 수 (기본값 16, 최소 2)
     * @param phiStart 가로 시작 각도(라디안, 기본값 0)
     * @param phiLength 가로 각도 길이(라디안, 기본값 2*PI)
     * @param thetaStart 세로 시작 각도(라디안, 기본값 0)
     * @param thetaLength 세로 각도 길이(라디안, 기본값 PI)
     * @param uvSize UV 스케일 (기본값 1)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number, uvSize?: number);
}
export default Sphere;
