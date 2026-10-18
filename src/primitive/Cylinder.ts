import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] 상단 및 하단 반지름과 높이를 기반으로 3D 원기둥(실린더) 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 3D cylinder based on top/bottom radii and height.
 *
 * ### Example
 * ```typescript
 * const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2, 32, 1);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cylinder/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Cylinder example](/RedGPU/examples/3d/primitive/cylinder/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class Cylinder extends Primitive {
    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     *
     * ### Example
     * ```typescript
     * const cylinder = new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 2, 32, 1);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radiusTop -
     * [KO] 상단 반지름 (기본값: 1)
     * [EN] Top radius (default: 1)
     * @param radiusBottom -
     * [KO] 하단 반지름 (기본값: 1)
     * [EN] Bottom radius (default: 1)
     * @param height -
     * [KO] 높이 (기본값: 1)
     * [EN] Height (default: 1)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값: 8)
     * [EN] Number of radial segments (default: 8)
     * @param heightSegments -
     * [KO] 높이 방향 분할 수 (기본값: 1)
     * [EN] Number of height segments (default: 1)
     * @param capTop -
     * [KO] 상단 단면 생성 여부 (기본값: true)
     * [EN] Whether to generate the top cap (default: true)
     * @param capBottom -
     * [KO] 하단 단면 생성 여부 (기본값: true)
     * [EN] Whether to generate the bottom cap (default: true)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값: 0.0)
     * [EN] Start angle in radians (default: 0.0)
     * @param thetaLength -
     * [KO] 원호 중심각 (라디안, 기본값: `Math.PI * 2`)
     * [EN] Central angle of the circular sector in radians (default: `Math.PI * 2`)
     * @param isRadialTop -
     * [KO] 상단 단면의 방사형 UV 매핑 사용 여부 (기본값: false)
     * [EN] Whether to use radial UV mapping for the top cap (default: false)
     * @param isRadialBottom -
     * [KO] 하단 단면의 방사형 UV 매핑 사용 여부 (기본값: false)
     * [EN] Whether to use radial UV mapping for the bottom cap (default: false)
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
        const uniqueKey = Primitive.generateUniqueKey('CYLINDER', {
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments,
            capTop,
            capBottom,
            thetaStart,
            thetaLength,
            isRadialTop,
            isRadialBottom
        });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateCylinderData(
            redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments,
            capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom, uniqueKey
        ));
    }
}

export default Cylinder;
