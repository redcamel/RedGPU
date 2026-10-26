import { GLTF, GlTfId } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF 애니메이션 데이터를 파싱하여 보관하는 클래스입니다.
 * [EN] Class that parses and stores GLTF animation data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
declare class AnimationData_GLTF {
    /**
     * [KO] `GLTFLoader` 인스턴스
     * [EN] `GLTFLoader` instance
     */
    gltfLoader: GLTFLoader;
    /**
     * [KO] GLTF 씬 데이터
     * [EN] GLTF scene data
     */
    scenesData: GLTF;
    /**
     * [KO] 엑세서의 GLTF ID
     * [EN] GLTF ID of the accessor
     */
    accessorGlTfId: GlTfId;
    /**
     * [KO] 파싱된 애니메이션 데이터 배열
     * [EN] Parsed animation data array
     */
    dataList: Float32Array;
    /**
     * [KO] `AnimationData_GLTF` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `AnimationData_GLTF`.
     *
     * @param gltfLoader -
     * [KO] `GLTFLoader` 인스턴스
     * [EN] `GLTFLoader` instance
     * @param gltfData -
     * [KO] GLTF 데이터 객체
     * [EN] GLTF data object
     * @param accessorGlTfId -
     * [KO] 데이터를 가져올 엑세서의 GLTF ID
     * [EN] GLTF ID of the accessor to retrieve data from
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId);
}
export default AnimationData_GLTF;
