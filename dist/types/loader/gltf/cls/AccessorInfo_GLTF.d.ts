import { Accessor, Buffer, BufferView, GLTF, GlTfId } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * Class representing information about an accessor in a GLTF file.
 */
declare class AccessorInfo_GLTF {
    accessor: Accessor;
    bufferView: BufferView;
    bufferGlTfId: GlTfId;
    buffer: Buffer;
    bufferURIDataView: any;
    componentType: any;
    componentType_BYTES_PER_ELEMENT: number;
    getMethod: string;
    accessorBufferOffset: number;
    bufferViewOffset: number;
    bufferViewByteStride: number;
    startIndex: number;
    /**
     * Constructor for creating an instance of the class.
     *
     * @param {GLTFLoader} gltfLoader - The instance of the GLTFLoader class.
     * @param {GLTF} gltfData - The GLTF data object.
     * @param {GlTfId} accessorGlTfId - The ID of the accessor in the GLTF data object.
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId);
}
export default AccessorInfo_GLTF;
