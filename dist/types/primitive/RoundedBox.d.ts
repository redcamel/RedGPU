import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] 모서리가 둥근 박스 지오메트리 클래스입니다.
 * [EN] Rounded box geometry class.
 *
 * @category Primitive
 */
export default class RoundedBox extends Primitive {
    /**
     * [KO] RoundedBox 인스턴스를 생성합니다.
     * [EN] Creates a RoundedBox instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     * @param width - [KO] 가로 길이 [EN] Width
     * @param height - [KO] 세로 길이 [EN] Height
     * @param depth - [KO] 깊이 길이 [EN] Depth
     * @param widthSegments - [KO] 가로 분할 수 [EN] Width segments
     * @param heightSegments - [KO] 세로 분할 수 [EN] Height segments
     * @param depthSegments - [KO] 깊이 분할 수 [EN] Depth segments
     * @param radius - [KO] 모서리 반지름 [EN] Corner radius
     * @param radiusSegments - [KO] 모서리 분할 수 [EN] Corner segments
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, radius?: number, radiusSegments?: number);
}
