import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
/**
 * Class representing a Circle primitive.
 * @extends Primitive
 */
class Circle extends Primitive {
    #makeData = (function () {
        return function (uniqueKey, redGPUContext, radius, segments, thetaStart, thetaLength) {
            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!
            // vertexBuffer Data
            const interleaveData = [];
            const indexData = [];
            let segment, x, y;
            //
            interleaveData.push(0, 0, 0, 0, 0, 1, 0.5, 0.5);
            let s = 0;
            let i = 3;
            while (s <= segments) {
                segment = thetaStart + s / segments * thetaLength;
                x = Math.cos(segment);
                y = Math.sin(segment);
                interleaveData.push(radius * x, radius * y, 0, 0, 0, 1, (x / radius + 1) / 2, (y / radius + 1) / 2);
                s++;
                i += 3;
            }
            // indices
            i = 1;
            while (i <= segments) {
                indexData.push(i, i + 1, 0);
                i++;
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
        };
    })();
    /**
     * Creates a new instance of the Circle class.
     * @param {RedGPUContext} redGPUContext - The RedGPUContext instance.
     * @param {number} [radius=1] - The radius of the circle.
     * @param {number} [segments=32] - The number of segments in the circle.
     * @param {number} [thetaStart=0] - The angle at which the circle starts.
     * @param {number} [thetaLength=Math.PI x 2] - The length of the arc in radians.
     * @returns {void}
     */
    constructor(redGPUContext, radius = 1, segments = 32, thetaStart = 0, thetaLength = Math.PI * 2) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_CIRCLE_R${radius}_S${segments}_TS${thetaStart}_TL${thetaLength}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, radius, segments, thetaStart, thetaLength);
        }
        this._setData(geometry);
    }
}
export default Circle;
