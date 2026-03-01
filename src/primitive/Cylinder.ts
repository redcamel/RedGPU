import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Cylinder(실린더) 기본 도형 클래스입니다.
 * [EN] Cylinder primitive geometry class.
 *
 * [KO] 상/하단 반지름, 높이 등을 기반으로 실린더(원기둥) 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages cylindrical data based on top/bottom radius, height, etc.
 *
 * ### Example
 * ```typescript
 * const cylinder = new RedGPU.Cylinder(redGPUContext, 1, 1, 2);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cylinder/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Cylinder extends Primitive {
    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radiusTop - [KO] 상단 반지름 (기본값 1) [EN] Top radius (default 1)
     * @param radiusBottom - [KO] 하단 반지름 (기본값 1) [EN] Bottom radius (default 1)
     * @param height - [KO] 높이 (기본값 1) [EN] Height (default 1)
     * @param radialSegments - [KO] 원주 방향 분할 수 (기본값 8) [EN] Radial segments (default 8)
     * @param heightSegments - [KO] 높이 방향 분할 수 (기본값 1) [EN] Height segments (default 1)
     * @param capTop - [KO] 상단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the top cap (default true)
     * @param capBottom - [KO] 하단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the bottom cap (default true)
     * @param thetaStart - [KO] 시작 각도 (라디안, 기본값 0) [EN] Starting angle (radians, default 0)
     * @param thetaLength - [KO] 원호 각도 (라디안, 기본값 2*PI) [EN] Arc angle (radians, default 2*PI)
     * @param isRadialTop - [KO] 상단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether top cap uses radial UV (default false)
     * @param isRadialBottom - [KO] 하단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether bottom cap uses radial UV (default false)
     */
    constructor(redGPUContext: RedGPUContext,
                radiusTop: number = 1,
                radiusBottom: number = 1,
                height: number = 1,
                radialSegments: number = 8,
                heightSegments: number = 1,
                capTop: boolean = true,
                capBottom: boolean = true,
                thetaStart: number = 0.0,
                thetaLength: number = Math.PI * 2,
                isRadialTop: boolean = false,
                isRadialBottom: boolean = false
    ) {
        const uniqueKey = Primitive.generateUniqueKey('CYLINDER', { radiusTop, radiusBottom, height, radialSegments, heightSegments, capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateCylinderData(
            redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments,
            capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom, uniqueKey
        ));
    }
}

export default Cylinder;
