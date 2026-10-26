import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] 반지름과 수평·수직 세그먼트 분할 수를 기반으로 3D 구 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 3D sphere based on radius and horizontal/vertical segment counts.
 *
 * ### Example
 * ```typescript
 * const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 16);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/sphere/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sphere example](/RedGPU/examples/3d/primitive/sphere/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
declare class Sphere extends Primitive {
    /**
     * [KO] Sphere 인스턴스를 생성합니다.
     * [EN] Creates an instance of Sphere.
     *
     * ### Example
     * ```typescript
     * const sphere = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 16);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 구 반지름 (기본값: 1)
     * [EN] Sphere radius (default: 1)
     * @param widthSegments -
     * [KO] 수평(경도) 방향 분할 수 (기본값: 16, 최소값: 3)
     * [EN] Number of horizontal (longitude) segments (default: 16, minimum: 3)
     * @param heightSegments -
     * [KO] 수직(위도) 방향 분할 수 (기본값: 16, 최소값: 2)
     * [EN] Number of vertical (latitude) segments (default: 16, minimum: 2)
     * @param phiStart -
     * [KO] 수평 시작 각도 (라디안, 기본값: 0)
     * [EN] Horizontal start angle in radians (default: 0)
     * @param phiLength -
     * [KO] 수평 중심각 크기 (라디안, 기본값: `Math.PI * 2`)
     * [EN] Horizontal central angle in radians (default: `Math.PI * 2`)
     * @param thetaStart -
     * [KO] 수직 시작 각도 (라디안, 기본값: 0)
     * [EN] Vertical start angle in radians (default: 0)
     * @param thetaLength -
     * [KO] 수직 중심각 크기 (라디안, 기본값: `Math.PI`)
     * [EN] Vertical central angle in radians (default: `Math.PI`)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
}
export default Sphere;
