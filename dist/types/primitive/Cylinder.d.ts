import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Cylinder(실린더) 기본 도형 클래스입니다.
 * [EN] Cylinder primitive geometry class.
 *
 * [KO] 상하 반지름, 높이 등을 기반으로 원기둥 형태의 정점 및 인덱스 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages vertex and index data for a cylinder based on radius, height, etc.
 *
 * * ### Example
 * ```typescript
 * // 반지름 1, 높이 2, 세그먼트 32짜리 실린더 생성
 * const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2, 32);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cylinder/"></iframe>
 * @category Primitive
 */
declare class Cylinder extends Primitive {
    #private;
    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radiusTop -
     * [KO] 윗면 반지름 (기본값 1)
     * [EN] Top radius (default 1)
     * @param radiusBottom -
     * [KO] 아랫면 반지름 (기본값 1)
     * [EN] Bottom radius (default 1)
     * @param height -
     * [KO] 높이 (기본값 1)
     * [EN] Height (default 1)
     * @param radialSegments -
     * [KO] 둘레 세그먼트 수 (기본값 8)
     * [EN] Radial segments (default 8)
     * @param heightSegments -
     * [KO] 높이 세그먼트 수 (기본값 8)
     * [EN] Height segments (default 8)
     * @param openEnded -
     * [KO] 캡 사용 안함 여부 (기본값 false)
     * [EN] Whether the ends are open (default false)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값 0)
     * [EN] Starting angle (radians, default 0)
     * @param thetaLength -
     * [KO] 원호 각도 (라디안, 기본값 2*PI)
     * [EN] Arc angle (radians, default 2*PI)
     */
    constructor(redGPUContext: RedGPUContext, radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
}
export default Cylinder;
