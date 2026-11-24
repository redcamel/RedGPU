import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import GLTF_COMPONENT_TYPES from "../core/GLTF_COMPONENT_TYPES";
import {Accessor, GLTF, GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";

/**
 * [KO] GLTF 파일의 엑세서(Accessor) 및 버퍼 뷰 정보를 담는 클래스입니다.
 * [EN] Class that holds accessor and buffer view information in a GLTF file.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
class AccessorInfo_GLTF {
    /**
     * [KO] GLTF 엑세서 객체
     * [EN] GLTF accessor object
     */
    accessor: Accessor;
    /**
     * [KO] 버퍼 URI의 `DataView` 인스턴스
     * [EN] `DataView` instance of the buffer URI
     */
    bufferURIDataView: any;
    /**
     * [KO] 컴포넌트 타입에 대응하는 TypedArray 생성자
     * [EN] TypedArray constructor corresponding to the component type
     */
    componentType: any;
    /**
     * [KO] 컴포넌트 타입 요소당 바이트 크기
     * [EN] Byte size per element of the component type
     */
    componentType_BYTES_PER_ELEMENT: number;
    /**
     * [KO] `DataView`에서 데이터를 읽을 메서드 이름
     * [EN] Method name to read data from `DataView`
     */
    getMethod: string;
    /**
     * [KO] 엑세서 바이트 오프셋
     * [EN] Accessor byte offset
     */
    accessorBufferOffset: number;
    /**
     * [KO] 버퍼 뷰 바이트 오프셋
     * [EN] Buffer view byte offset
     */
    bufferViewOffset: number;
    /**
     * [KO] 버퍼 뷰 바이트 스트라이드
     * [EN] Buffer view byte stride
     */
    bufferViewByteStride: number;
    /**
     * [KO] 버퍼 내 데이터 읽기 시작 인덱스
     * [EN] Start index for reading data in the buffer
     */
    startIndex: number;

    /**
     * [KO] `AccessorInfo_GLTF` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `AccessorInfo_GLTF`.
     *
     * @param gltfLoader -
     * [KO] `GLTFLoader` 인스턴스
     * [EN] `GLTFLoader` instance
     * @param gltfData -
     * [KO] GLTF 데이터 객체
     * [EN] GLTF data object
     * @param accessorGlTfId -
     * [KO] 엑세서의 GLTF ID
     * [EN] GLTF ID of the accessor
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId) {
        this.accessor = gltfData.accessors[accessorGlTfId];
        const bufferView = this.accessor.bufferView !== undefined
            ? gltfData.bufferViews[this.accessor.bufferView]
            : undefined;
        this.bufferURIDataView = null;
        if (bufferView) {
            const bufferDataView = gltfLoader.parsingResult.uris.buffers[bufferView.buffer];
            if (bufferDataView) {
                this.bufferURIDataView = bufferDataView;
            }
        }
        this.componentType = GLTF_COMPONENT_TYPES[this.accessor.componentType];
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
        this.bufferViewOffset = bufferView?.byteOffset || 0;
        this.bufferViewByteStride = bufferView?.byteStride || 0;
        this.startIndex = (this.bufferViewOffset + this.accessorBufferOffset) / this.componentType_BYTES_PER_ELEMENT;
    }
}

export default AccessorInfo_GLTF;
