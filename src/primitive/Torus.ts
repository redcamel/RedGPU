import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * 반지름, 두께, 세그먼트, 시작/끝 각도 등 다양한 파라미터로 3D 도넛 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 2, 두께 0.5, 32x16 세그먼트 토러스 생성 및 씬에 추가
 * const torus = new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 16);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/torus/"></iframe>
 *
 * @param redGPUContext RedGPUContext 인스턴스
 * @param radius 중심 원 반지름 (기본값 1)
 * @param thickness 단면(튜브) 반지름 (기본값 0.5)
 * @param radialSubdivisions 둘레 세그먼트 수 (기본값 16, 최소 3)
 * @param bodySubdivisions 단면 세그먼트 수 (기본값 16, 최소 3)
 * @param startAngle 시작 각도(라디안, 기본값 0)
 * @param endAngle 끝 각도(라디안, 기본값 2*PI)
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
