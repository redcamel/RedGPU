import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] 모서리가 둥근 6면체 박스 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a rounded-edge hexahedral box.
 *
 * ### Example
 * ```typescript
 * const roundedBox = new RedGPU.Primitive.RoundedBox(redGPUContext, 1, 1, 1, 1, 1, 1, 0.1, 4);
 * ```
 *
 * @see [RoundedBox example](/RedGPU/examples/3d/primitive/roundedBox/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
export default class RoundedBox extends Primitive {
    /**
     * [KO] RoundedBox 인스턴스를 생성합니다.
     * [EN] Creates an instance of RoundedBox.
     *
     * ### Example
     * ```typescript
     * const roundedBox = new RedGPU.Primitive.RoundedBox(redGPUContext, 1, 1, 1, 1, 1, 1, 0.1, 4);
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
     * @param depth -
     * [KO] 깊이(Z축) 길이 (기본값: 1)
     * [EN] Depth along the Z-axis (default: 1)
     * @param widthSegments -
     * [KO] 가로(X축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the X-axis (default: 1)
     * @param heightSegments -
     * [KO] 세로(Y축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Y-axis (default: 1)
     * @param depthSegments -
     * [KO] 깊이(Z축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Z-axis (default: 1)
     * @param radius -
     * [KO] 모서리 곡률 반지름 (기본값: 0.1)
     * [EN] Corner fillet radius (default: 0.1)
     * @param radiusSegments -
     * [KO] 모서리 곡면 분할 수 (기본값: 4)
     * [EN] Number of segments for the rounded corners (default: 4)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1, height: number = 1, depth: number = 1,
        widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1,
        radius: number = 0.1, radiusSegments: number = 4
    ) {
        const uniqueKey = `RoundedBox_${width}_${height}_${depth}_${widthSegments}_${heightSegments}_${depthSegments}_${radius}_${radiusSegments}`;
        super(
            redGPUContext,
            uniqueKey,
            () => PrimitiveUtils.generateRoundedBoxData(redGPUContext, width, height, depth, widthSegments, heightSegments, depthSegments, radius, radiusSegments, uniqueKey)
        );
    }
}
