import { GLTF, MeshPrimitive } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import MorphInfoData_GLTF from "./MorphInfoData_GLTF";
/**
 * [KO] GLTF 메쉬 프리미티브의 모프 타겟(Morph Target) 목록과 가중치 정보를 관리하는 클래스입니다.
 * [EN] Class that manages morph target list and weight information for a GLTF mesh primitive.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
declare class MorphInfo_GLTF {
    /**
     * [KO] 모프 타겟 데이터 객체 목록
     * [EN] List of morph target data objects
     */
    morphInfoDataList: MorphInfoData_GLTF[];
    /**
     * [KO] 모프 타겟 가중치 배열
     * [EN] Morph target weights array
     */
    weights: number[];
    /**
     * [KO] 모프 데이터 캐시 객체
     * [EN] Morph data cache object
     */
    cacheData: {};
    /**
     * [KO] 원본 인터리브 정점 데이터
     * [EN] Original interleaved vertex data
     */
    origin: any;
    /**
     * [KO] `MorphInfo_GLTF` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `MorphInfo_GLTF`.
     *
     * @param gltfLoader -
     * [KO] `GLTFLoader` 인스턴스
     * [EN] `GLTFLoader` instance
     * @param gltfData -
     * [KO] GLTF 데이터 객체
     * [EN] GLTF data object
     * @param meshPrimitive -
     * [KO] GLTF 메쉬 프리미티브 객체
     * [EN] GLTF mesh primitive object
     * @param weightsValue -
     * [KO] 초기 모프 가중치 배열
     * [EN] Initial morph weights array
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive, weightsValue: number[]);
}
export default MorphInfo_GLTF;
