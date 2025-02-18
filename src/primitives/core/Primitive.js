import GeometryGPURenderInfo from "../../renderInfos/GeometryGPURenderInfo";
import InterleaveType from "../../resources/buffer/core/type/InterleaveType";
import InterleavedStruct from "../../resources/buffer/vertexBuffer/InterleavedStruct";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import calculateVolume from "../../utils/math/calculateVolume";
/**
 * Class representing a primitive geometry.
 *
 * @class Primitive
 */
class Primitive {
    #gpuRenderInfo;
    #vertexBuffer;
    #indexBuffer;
    #volume;
    constructor(redGPUContext) {
        validateRedGPUContext(redGPUContext);
    }
    static get primitiveInterleaveStruct() {
        return new InterleavedStruct({
            vertexPosition: InterleaveType.float32x3,
            vertexNormal: InterleaveType.float32x3,
            texcoord: InterleaveType.float32x2,
        }, `primitiveInterleaveStruct`);
    }
    get gpuRenderInfo() {
        return this.#gpuRenderInfo;
    }
    get vertexBuffer() {
        return this.#vertexBuffer;
    }
    get indexBuffer() {
        return this.#indexBuffer;
    }
    get volume() {
        if (!this.#volume) {
            //TODO vertexBuffer 내용이 변경될떄  재계산해야함
            this.#volume = calculateVolume(this.#vertexBuffer);
        }
        return this.#volume;
    }
    _setData(geometry) {
        this.#vertexBuffer = geometry.vertexBuffer;
        this.#indexBuffer = geometry.indexBuffer;
        if (this.#vertexBuffer) {
            const { interleavedStruct } = this.#vertexBuffer;
            this.#gpuRenderInfo = new GeometryGPURenderInfo([
                {
                    arrayStride: interleavedStruct.arrayStride,
                    attributes: interleavedStruct.attributes
                }
            ]);
        }
    }
}
Object.freeze(Primitive);
export default Primitive;
