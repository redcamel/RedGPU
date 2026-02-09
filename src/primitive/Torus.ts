import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * [KO] Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * [EN] Torus primitive geometry class.
 *
 * [KO] 반지름, 두께, 세그먼트 등을 기반으로 3D 도넛 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus data based on radius, thickness, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 2, 두께 0.5짜리 토러스 생성
 * const torus = new RedGPU.Torus(redGPUContext, 2, 0.5);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Torus extends Primitive {
    #makeData = (function () {
        return function (uniqueKey, redGPUContext,
                         radius,
                         thickness,
                         radialSubdivisions,
                         bodySubdivisions,
                         startAngle,
                         endAngle
        ) {
            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!
            // vertexBuffer Data
            startAngle = startAngle || 0;
            endAngle = endAngle || Math.PI * 2;
            const range = endAngle - startAngle;
            const radialParts = radialSubdivisions + 1;
            const bodyParts = bodySubdivisions + 1;
            const interleaveData = [];
            const indexData = [];
            for (let slice = 0; slice < bodyParts; ++slice) {
                const v = slice / bodySubdivisions;
                const sliceAngle = v * Math.PI * 2;
                const sliceSin = Math.sin(sliceAngle);
                const ringRadius = radius + sliceSin * thickness;
                const ny = Math.cos(sliceAngle);
                const y = ny * thickness;
                for (let ring = 0; ring < radialParts; ++ring) {
                    const u = ring / radialSubdivisions;
                    const ringAngle = startAngle + u * range;
                    const xSin = Math.sin(ringAngle);
                    const zCos = Math.cos(ringAngle);
                    const x = xSin * ringRadius;
                    const z = zCos * ringRadius;
                    const nx = xSin * sliceSin;
                    const nz = zCos * sliceSin;
                    interleaveData.push(x, y, z, nx, ny, nz, u, 1 - v);
                }
            }
            for (let slice = 0; slice < bodySubdivisions; ++slice) {  // eslint-disable-line
                for (let ring = 0; ring < radialSubdivisions; ++ring) {  // eslint-disable-line
                    const nextRingIndex = 1 + ring;
                    const nextSliceIndex = 1 + slice;
                    indexData.push(radialParts * slice + ring,
                        radialParts * nextSliceIndex + ring,
                        radialParts * slice + nextRingIndex);
                    indexData.push(radialParts * nextSliceIndex + ring,
                        radialParts * nextSliceIndex + nextRingIndex,
                        radialParts * slice + nextRingIndex);
                }
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
        };
    })();

    /**
     * [KO] Torus 인스턴스를 생성합니다.
     * [EN] Creates an instance of Torus.
     * 
     * ### Example
     * ```typescript
     * const torus = new RedGPU.Torus(redGPUContext, 1, 0.5, 16, 16, 0, Math.PI * 2);
     * ```
     *
     * @param redGPUContext - 
     * [KO] RedGPUContext 인스턴스 
     * [EN] RedGPUContext instance
     * @param radius - 
     * [KO] 중심 원 반지름 (기본값 1) 
     * [EN] Major radius (default 1)
     * @param thickness - 
     * [KO] 단면(튜브) 반지름 (기본값 0.5) 
     * [EN] Minor radius/thickness (default 0.5)
     * @param radialSubdivisions - 
     * [KO] 둘레 세그먼트 수 (기본값 16, 최소 3) 
     * [EN] Radial segments (default 16, min 3)
     * @param bodySubdivisions - 
     * [KO] 단면 세그먼트 수 (기본값 16, 최소 3) 
     * [EN] Tubular segments (default 16, min 3)
     * @param startAngle - 
     * [KO] 시작 각도 (라디안, 기본값 0) 
     * [EN] Starting angle (radians, default 0)
     * @param endAngle - 
     * [KO] 끝 각도 (라디안, 기본값 2*PI) 
     * [EN] Ending angle (radians, default 2*PI)
     */
    constructor(redGPUContext: RedGPUContext,
                radius = 1,
                thickness = 0.5,
                radialSubdivisions = 16,
                bodySubdivisions = 16,
                startAngle = 0,
                endAngle = Math.PI * 2
    ) {
        super(redGPUContext);
        if (radialSubdivisions < 3) {
            throw new Error('radialSubdivisions must be 3 or greater');
        }
        if (bodySubdivisions < 3) {
            throw new Error('verticalSubdivisions must be 3 or greater');
        }
        const uniqueKey = `PRIMITIVE_TORUS_R${radius}_T${thickness}_RSD${radialSubdivisions}_BSD${bodySubdivisions}_SA${startAngle}_EA${endAngle}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext,
                radius,
                thickness,
                radialSubdivisions,
                bodySubdivisions,
                startAngle,
                endAngle
            )
        }
        this._setData(geometry)
    }
}

export default Torus
