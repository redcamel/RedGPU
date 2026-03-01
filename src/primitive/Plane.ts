import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Plane(평면) 기본 도형 클래스입니다.
 * [EN] Plane primitive geometry class.
 *
 * [KO] 가로와 세로 길이를 기반으로 XY 평면 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages XY plane data based on width and height.
 *
 * ### Example
 * ```typescript
 * const plane = new RedGPU.Plane(redGPUContext, 2, 2);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/plane/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Plane extends Primitive {
    /**
     * [KO] Plane 인스턴스를 생성합니다.
     * [EN] Creates an instance of Plane.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 가로 길이 (기본값 1) [EN] Width (default 1)
     * @param height - [KO] 세로 길이 (기본값 1) [EN] Height (default 1)
     * @param widthSegments - [KO] 가로 분할 수 (기본값 1) [EN] Width segments (default 1)
     * @param heightSegments - [KO] 세로 분할 수 (기본값 1) [EN] Height segments (default 1)
     * @param flipY - [KO] Y축 UV 뒤집기 여부 (기본값 false) [EN] Whether to flip UV on the Y-axis (default false)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1,
        height: number = 1,
        widthSegments: number = 1,
        heightSegments: number = 1,
        flipY: boolean = false
    ) {
        const uniqueKey = Primitive.generateUniqueKey('PLANE', { width, height, widthSegments, heightSegments, flipY });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generatePlaneEntryData(
            redGPUContext, width, height, widthSegments, heightSegments, flipY, uniqueKey
        ));
    }
}

export default Plane;
