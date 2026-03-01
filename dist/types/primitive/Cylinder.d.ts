import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Cylinder(실린더) 기본 도형 클래스입니다.
 * [EN] Cylinder primitive geometry class.
 */
declare class Cylinder extends Primitive {
    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radiusTop - [KO] 상단 반지름 [EN] Top radius
     * @param radiusBottom - [KO] 하단 반지름 [EN] Bottom radius
     * @param height - [KO] 높이 [EN] Height
     * @param radialSegments - [KO] 원주 방향 분할 수 [EN] Radial segments
     * @param heightSegments - [KO] 높이 방향 분할 수 [EN] Height segments
     * @param capTop - [KO] 상단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the top cap (default true)
     * @param capBottom - [KO] 하단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the bottom cap (default true)
     * @param thetaStart - [KO] 시작 각도 [EN] Starting angle
     * @param thetaLength - [KO] 원호 각도 [EN] Arc angle
     * @param isRadialTop - [KO] 상단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether top cap uses radial UV (default false)
     * @param isRadialBottom - [KO] 하단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether bottom cap uses radial UV (default false)
     */
    constructor(redGPUContext: RedGPUContext, radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, capTop?: boolean, capBottom?: boolean, thetaStart?: number, thetaLength?: number, isRadialTop?: boolean, isRadialBottom?: boolean);
}
export default Cylinder;
