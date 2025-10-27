import {GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import AccessorInfo_GLTF from "./AccessorInfo_GLTF";

/**
 * Class representing animation information for GLTF format.
 */
class AnimationData_GLTF {
    gltfLoader: GLTFLoader;
    scenesData: GLTF;
    accessorGlTfId: GlTfId;
    dataList: Float32Array

    /**
     * Constructs a new instance of the class.
     *
     * @param {GLTFLoader} gltfLoader - The GLTFLoader object used to load the GLTF data.
     * @param {GLTF} gltfData - The GLTF data containing the scenes.
     * @param {GlTfId} accessorGlTfId - The ID of the accessor to retrieve data from.
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId) {
        this.gltfLoader = gltfLoader;
        this.scenesData = gltfData;
        this.accessorGlTfId = accessorGlTfId;
        const accessorInfo = new AccessorInfo_GLTF(this.gltfLoader, this.scenesData, this.accessorGlTfId);
        const {accessor, startIndex, componentType_BYTES_PER_ELEMENT, bufferURIDataView, getMethod} = accessorInfo
        const {type, count} = accessor
        let i = startIndex, factor = 1
        switch (type) {
            case 'SCALAR':
                factor = 1;
                break;
            case 'VEC4':
                factor = 4;
                break;
            case 'VEC3':
                factor = 3;
                break;
            default:
                console.log('알수없는 형식 엑세서 타입', accessor);
        }
        const temp = []
        let offset = 0;
        for (; offset < count * factor; i++, offset++) {
            temp[offset] = bufferURIDataView[getMethod](i * componentType_BYTES_PER_ELEMENT, true);
        }
        this.dataList = new Float32Array(temp);
    }
}

export default AnimationData_GLTF;
