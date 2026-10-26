import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] 3D 원뿔 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 3D cone.
 *
 * ### Example
 * ```typescript
 * const cone = new RedGPU.Primitive.Cone(redGPUContext, 1, 2, 32, 1, true);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cone/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Cone example](/RedGPU/examples/3d/primitive/cone/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
declare class Cone extends Primitive {
    /**
     * [KO] Cone 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cone.
     *
     * ### Example
     * ```typescript
     * const cone = new RedGPU.Primitive.Cone(redGPUContext, 1, 2, 32, 1, true);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 밑면 반지름 (기본값: 1)
     * [EN] Base radius (default: 1)
     * @param height -
     * [KO] 높이 (기본값: 1)
     * [EN] Height (default: 1)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값: 32)
     * [EN] Number of radial segments (default: 32)
     * @param heightSegments -
     * [KO] 높이 방향 분할 수 (기본값: 1)
     * [EN] Number of height segments (default: 1)
     * @param capBottom -
     * [KO] 밑면 단면 생성 여부 (기본값: true)
     * [EN] Whether to generate the bottom cap (default: true)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값: 0.0)
     * [EN] Start angle in radians (default: 0.0)
     * @param thetaLength -
     * [KO] 원호 중심각 (라디안, 기본값: `Math.PI * 2`)
     * [EN] Central angle of the circular sector in radians (default: `Math.PI * 2`)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, height?: number, radialSegments?: number, heightSegments?: number, capBottom?: boolean, thetaStart?: number, thetaLength?: number);
}
export default Cone;
