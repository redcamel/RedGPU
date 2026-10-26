import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] XY 평면에 배치된 2D 사각형 평면의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 2D rectangular plane placed on the XY plane.
 *
 * ### Example
 * ```typescript
 * const plane = new RedGPU.Primitive.Plane(redGPUContext, 2, 2, 1, 1, false);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/plane/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Plane example](/RedGPU/examples/3d/primitive/plane/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class Plane extends Primitive {
    /**
     * [KO] Plane 인스턴스를 생성합니다.
     * [EN] Creates an instance of Plane.
     *
     * ### Example
     * ```typescript
     * const plane = new RedGPU.Primitive.Plane(redGPUContext, 2, 2, 1, 1, false);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로(X축) 길이 (기본값: 1)
     * [EN] Width along the X-axis (default: 1)
     * @param height -
     * [KO] 세로(Y축) 길이 (기본값: 1)
     * [EN] Height along the Y-axis (default: 1)
     * @param widthSegments -
     * [KO] 가로(X축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the X-axis (default: 1)
     * @param heightSegments -
     * [KO] 세로(Y축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Y-axis (default: 1)
     * @param flipY -
     * [KO] Y축 UV 좌표 반전 여부 (기본값: false)
     * [EN] Whether to flip UV coordinates along the Y-axis (default: false)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1,
        height: number = 1,
        widthSegments: number = 1,
        heightSegments: number = 1,
        flipY: boolean = false
    ) {
        const uniqueKey = Primitive.generateUniqueKey('PLANE', {width, height, widthSegments, heightSegments, flipY});
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generatePlaneEntryData(
            redGPUContext, width, height, widthSegments, heightSegments, flipY, uniqueKey
        ));
    }
}

export default Plane;
