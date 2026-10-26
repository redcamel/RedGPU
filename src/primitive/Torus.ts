import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] 중심 반지름과 튜브 단면 반지름을 기반으로 3D 도넛(토러스) 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 3D torus based on major and minor radii.
 *
 * ### Example
 * ```typescript
 * const torus = new RedGPU.Primitive.Torus(redGPUContext, 1, 0.5, 16, 16);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Torus example](/RedGPU/examples/3d/primitive/torus/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class Torus extends Primitive {
    /**
     * [KO] Torus 인스턴스를 생성합니다.
     * [EN] Creates an instance of Torus.
     *
     * ### Example
     * ```typescript
     * const torus = new RedGPU.Primitive.Torus(redGPUContext, 1, 0.5, 16, 16);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 중심 원 반지름 (기본값: 1)
     * [EN] Major radius from the center of the torus to the center of the tube (default: 1)
     * @param thickness -
     * [KO] 튜브 단면 반지름 (기본값: 0.5)
     * [EN] Minor radius of the tube (default: 0.5)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값: 16, 최소값: 3)
     * [EN] Number of radial segments (default: 16, minimum: 3)
     * @param tubularSegments -
     * [KO] 튜브 단면 방향 분할 수 (기본값: 16, 최소값: 3)
     * [EN] Number of tubular segments (default: 16, minimum: 3)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값: 0)
     * [EN] Start angle in radians (default: 0)
     * @param thetaLength -
     * [KO] 원호 중심각 (라디안, 기본값: `Math.PI * 2`)
     * [EN] Central angle of the circular sector in radians (default: `Math.PI * 2`)
     * @param capStart -
     * [KO] 시작 단면 생성 여부 (기본값: false)
     * [EN] Whether to generate the start cap (default: false)
     * @param capEnd -
     * [KO] 끝 단면 생성 여부 (기본값: false)
     * [EN] Whether to generate the end cap (default: false)
     * @param isRadialCapStart -
     * [KO] 시작 단면의 방사형 UV 매핑 사용 여부 (기본값: false)
     * [EN] Whether to use radial UV mapping for the start cap (default: false)
     * @param isRadialCapEnd -
     * [KO] 끝 단면의 방사형 UV 매핑 사용 여부 (기본값: false)
     * [EN] Whether to use radial UV mapping for the end cap (default: false)
     * @throws
     * [KO] `radialSegments` 또는 `tubularSegments`가 3 미만인 경우 Error 발생
     * [EN] Throws Error if `radialSegments` or `tubularSegments` is less than 3
     */
    constructor(redGPUContext: RedGPUContext,
                radius: number = 1,
                thickness: number = 0.5,
                radialSegments: number = 16,
                tubularSegments: number = 16,
                thetaStart: number = 0,
                thetaLength: number = Math.PI * 2,
                capStart: boolean = false,
                capEnd: boolean = false,
                isRadialCapStart: boolean = false,
                isRadialCapEnd: boolean = false
    ) {
        if (radialSegments < 3) throw new Error('radialSegments must be 3 or greater');
        if (tubularSegments < 3) throw new Error('tubularSegments must be 3 or greater');
        const uniqueKey = Primitive.generateUniqueKey('TORUS', {
            radius,
            thickness,
            radialSegments,
            tubularSegments,
            thetaStart,
            thetaLength,
            capStart,
            capEnd,
            isRadialCapStart,
            isRadialCapEnd
        });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateTorusData(
            redGPUContext, radius, thickness, radialSegments, tubularSegments,
            thetaStart, thetaLength, capStart, capEnd, isRadialCapStart, isRadialCapEnd, uniqueKey
        ));
    }
}

export default Torus;
