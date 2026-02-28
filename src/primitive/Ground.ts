import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Ground(그라운드) 기본 도형 클래스입니다.
 * [EN] Ground primitive geometry class.
 *
 * [KO] XZ 평면에 배치된 평면 데이터를 생성하여 관리합니다. 주로 바닥이나 지형의 기반으로 사용됩니다.
 * [EN] Generates and manages planar data placed on the XZ plane. Primarily used as a base for floors or terrain.
 *
 * ### Example
 * ```typescript
 * // 10x10 크기의 그라운드 생성
 * const ground = new RedGPU.Ground(redGPUContext, 10, 10);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ground/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Ground extends Primitive {
    /**
     * [KO] Ground 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ground.
     *
     * ### Example
     * ```typescript
     * const ground = new RedGPU.Ground(redGPUContext, 10, 10, 1, 1, false);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로 길이 (기본값 1)
     * [EN] Width (default 1)
     * @param height -
     * [KO] 세로 길이 (기본값 1)
     * [EN] Height (default 1)
     * @param wSegments -
     * [KO] 가로(X축) 세그먼트 수 (기본값 1)
     * [EN] Width (X-axis) segments (default 1)
     * @param hSegments -
     * [KO] 세로(Z축) 세그먼트 수 (기본값 1)
     * [EN] Height (Z-axis) segments (default 1)
     * @param flipY -
     * [KO] Y축 UV 뒤집기 여부 (기본값 false)
     * [EN] Whether to flip UV on the Y-axis (default false)
     */
    constructor(redGPUContext: RedGPUContext, width = 1, height = 1, wSegments = 1, hSegments = 1, flipY = false) {
        const uniqueKey = `PRIMITIVE_GROUND_W${width}_H${height}_WS${wSegments}_HS${hSegments}_FY${flipY}`;
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, width, height, wSegments, hSegments, flipY));
    }
}

const makeData = function (uniqueKey, redGPUContext, width, height, wSegments, hSegments, flipY) {
    const interleaveData = [];
    const indexData = [];

    // XZ 평면 생성 (Y=0)
    PrimitiveUtils.generatePlaneData(
        interleaveData, indexData,
        width, height, 0,
        wSegments, hSegments,
        'x', 'z', 'y',
        1, 1, 1,
        flipY
    );

    PrimitiveUtils.calculateTangents(interleaveData, indexData);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
};

export default Ground;
