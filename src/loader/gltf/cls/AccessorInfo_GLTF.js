import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import WEBGL_COMPONENT_TYPES from "../core/WEBGL_COMPONENT_TYPES";
/**
 * Class representing information about an accessor in a GLTF file.
 */
class AccessorInfo_GLTF {
    accessor;
    bufferView;
    bufferGlTfId;
    buffer;
    bufferURIDataView;
    componentType; //TODO 이거 어떻게 선언하는지 잘모르겠다
    componentType_BYTES_PER_ELEMENT;
    getMethod;
    accessorBufferOffset;
    bufferViewOffset;
    bufferViewByteStride;
    startIndex;
    /**
     * Constructor for creating an instance of the class.
     *
     * @param {GLTFLoader} gltfLoader - The instance of the GLTFLoader class.
     * @param {GLTF} gltfData - The GLTF data object.
     * @param {GlTfId} accessorGlTfId - The ID of the accessor in the GLTF data object.
     */
    constructor(gltfLoader, gltfData, accessorGlTfId) {
        this.accessor = gltfData.accessors[accessorGlTfId];
        this.bufferView = gltfData.bufferViews[this.accessor.bufferView];
        this.bufferGlTfId = this.bufferView.buffer;
        this.buffer = gltfData.buffers[this.bufferGlTfId];
        this.bufferURIDataView = null;
        if (this.buffer.uri) {
            this.bufferURIDataView = gltfLoader.parsingResult.uris.buffers[this.bufferGlTfId];
        }
        this.componentType = WEBGL_COMPONENT_TYPES[this.accessor.componentType];
        this.componentType_BYTES_PER_ELEMENT = this.componentType.BYTES_PER_ELEMENT;
        switch (this.componentType) {
            case Float32Array:
                this.getMethod = 'getFloat32';
                break;
            case Uint32Array:
                this.getMethod = 'getUint32';
                break;
            case Uint16Array:
                this.getMethod = 'getUint16';
                break;
            case Int16Array:
                this.getMethod = 'getInt16';
                break;
            case Uint8Array:
                this.getMethod = 'getUint8';
                break;
            case Int8Array:
                this.getMethod = 'getInt8';
                break;
            default:
                consoleAndThrowError('파싱할수없는 타입', this.componentType);
        }
        this.accessorBufferOffset = this.accessor.byteOffset || 0;
        this.bufferViewOffset = this.bufferView.byteOffset || 0;
        this.bufferViewByteStride = this.bufferView.byteStride || 0;
        this.startIndex = (this.bufferViewOffset + this.accessorBufferOffset) / this.componentType_BYTES_PER_ELEMENT;
        // console.log('해당 bufferView 정보', this['bufferView'])
        // console.log('바라볼 버퍼 인덱스', this['bufferIndex'])
        // console.log('바라볼 버퍼', this['buffer'])
        // console.log('바라볼 버퍼데이터', this['bufferURIDataView'])
        // console.log('바라볼 엑세서', this['accessor'])
        // console.log('this['componentType']', this['componentType'])
        // console.log("this['getMethod']", this['getMethod'])
        // console.log("this['bufferView']['byteOffset']", this['bufferView']['byteOffset'])
        // console.log("this['accessor']['byteOffset']", this['accessor']['byteOffset'])
    }
}
export default AccessorInfo_GLTF;
