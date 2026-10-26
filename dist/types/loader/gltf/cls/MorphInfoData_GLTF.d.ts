/**
 * [KO] GLTF 모프 타겟(Morph Target)의 정점 속성 데이터를 보관하는 클래스입니다.
 * [EN] Class that stores vertex attribute data of a GLTF morph target.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
declare class MorphInfoData_GLTF {
    /**
     * [KO] 정점 위치 데이터 배열
     * [EN] Vertex position data array
     */
    vertices: number[];
    /**
     * [KO] 정점 색상 데이터 배열
     * [EN] Vertex color data array
     */
    verticesColor_0: number[];
    /**
     * [KO] 법선 벡터 데이터 배열
     * [EN] Normal vector data array
     */
    normals: number[];
    /**
     * [KO] 텍스처 좌표(UV 0) 데이터 배열
     * [EN] Texture coordinate (UV 0) data array
     */
    uvs: number[];
    /**
     * [KO] 추가 텍스처 좌표(UV 1) 데이터 배열
     * [EN] Additional texture coordinate (UV 1) data array
     */
    uvs1: number[];
    /**
     * [KO] 추가 텍스처 좌표(UV 2) 데이터 배열
     * [EN] Additional texture coordinate (UV 2) data array
     */
    uvs2: number[];
    /**
     * [KO] 조인트 가중치 데이터 배열
     * [EN] Joint weight data array
     */
    jointWeights: number[];
    /**
     * [KO] 조인트 인덱스 데이터 배열
     * [EN] Joint index data array
     */
    joints: number[];
    /**
     * [KO] 탄젠트 벡터 데이터 배열
     * [EN] Tangent vector data array
     */
    tangents: number[];
    /**
     * [KO] 인터리브된 모프 정점 데이터
     * [EN] Interleaved morph vertex data
     */
    interleaveData: Float32Array;
    /**
     * [KO] `MorphInfoData_GLTF` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `MorphInfoData_GLTF`.
     *
     * @param vertices -
     * [KO] 정점 위치 데이터 배열
     * [EN] Vertex position data array
     * @param verticesColor_0 -
     * [KO] 정점 색상 데이터 배열
     * [EN] Vertex color data array
     * @param normals -
     * [KO] 법선 벡터 데이터 배열
     * [EN] Normal vector data array
     * @param uvs -
     * [KO] 텍스처 좌표(UV 0) 데이터 배열
     * [EN] Texture coordinate (UV 0) data array
     * @param uvs1 -
     * [KO] 추가 텍스처 좌표(UV 1) 데이터 배열
     * [EN] Additional texture coordinate (UV 1) data array
     * @param uvs2 -
     * [KO] 추가 텍스처 좌표(UV 2) 데이터 배열
     * [EN] Additional texture coordinate (UV 2) data array
     * @param jointWeights -
     * [KO] 조인트 가중치 데이터 배열
     * [EN] Joint weight data array
     * @param joints -
     * [KO] 조인트 인덱스 데이터 배열
     * [EN] Joint index data array
     * @param tangents -
     * [KO] 탄젠트 벡터 데이터 배열
     * [EN] Tangent vector data array
     */
    constructor(vertices?: number[], verticesColor_0?: number[], normals?: number[], uvs?: number[], uvs1?: number[], uvs2?: number[], jointWeights?: number[], joints?: number[], tangents?: number[]);
}
export default MorphInfoData_GLTF;
