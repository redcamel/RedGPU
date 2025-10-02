import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Cylinder(실린더) 기본 도형 클래스입니다.
 * 상하 반지름, 높이, 세그먼트, 캡 여부, 시작/길이 각도 등 다양한 파라미터로 원기둥 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 1, 높이 2, 세그먼트 32짜리 실린더 생성 및 씬에 추가
 * const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2, 32, 1, false);
 *```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/cylinder/"></iframe>
 */
declare class Cylinder extends Primitive {
    #private;
    /**
     * Cylinder 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param radiusTop 윗면 반지름 (기본값 1)
     * @param radiusBottom 아랫면 반지름 (기본값 1)
     * @param height 높이 (기본값 1)
     * @param radialSegments 둘레 세그먼트 수 (기본값 8)
     * @param heightSegments 높이 세그먼트 수 (기본값 8)
     * @param openEnded 캡 없음 여부 (기본값 false)
     * @param thetaStart 시작 각도(라디안, 기본값 0)
     * @param thetaLength 원호 각도(라디안, 기본값 2*PI)
     */
    constructor(redGPUContext: RedGPUContext, radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
}
export default Cylinder;
