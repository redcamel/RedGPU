import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
class Torus extends Primitive {
    #makeData = (function () {
        return function (uniqueKey, redGPUContext, radius, thickness, radialSubdivisions, bodySubdivisions, startAngle, endAngle) {
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
            for (let slice = 0; slice < bodySubdivisions; ++slice) { // eslint-disable-line
                for (let ring = 0; ring < radialSubdivisions; ++ring) { // eslint-disable-line
                    const nextRingIndex = 1 + ring;
                    const nextSliceIndex = 1 + slice;
                    indexData.push(radialParts * slice + ring, radialParts * nextSliceIndex + ring, radialParts * slice + nextRingIndex);
                    indexData.push(radialParts * nextSliceIndex + ring, radialParts * nextSliceIndex + nextRingIndex, radialParts * slice + nextRingIndex);
                }
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
        };
    })();
    constructor(redGPUContext, radius = 1, thickness = 0.5, radialSubdivisions = 16, bodySubdivisions = 16, startAngle = 0, endAngle = Math.PI * 2) {
        super(redGPUContext);
        if (radialSubdivisions < 3) {
            throw new Error('radialSubdivisions must be 3 or greater');
        }
        if (bodySubdivisions < 3) {
            throw new Error('verticalSubdivisions must be 3 or greater');
        }
        const uniqueKey = `PRIMITIVE_TORUS_R${radius}_T${thickness}_RSD${radialSubdivisions}_BSD${bodySubdivisions}_SA${startAngle}_EA${endAngle}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, radius, thickness, radialSubdivisions, bodySubdivisions, startAngle, endAngle);
        }
        this._setData(geometry);
    }
}
export default Torus;
