const EMPTY_FLOAT32_ARRAY = new Float32Array(0);

/**
 * [KO] GLTF 모프 타겟(Morph Target)의 정점 위치 델타 데이터를 보관하는 클래스입니다.
 * [EN] Class that stores vertex position delta data of a GLTF morph target.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
class MorphInfoData_GLTF {
    /**
     * [KO] 정점 위치 델타 데이터 배열
     * [EN] Vertex position delta data array
     */
    vertices: Float32Array = EMPTY_FLOAT32_ARRAY;
    /**
     * [KO] 인터리브된 모프 정점 데이터
     * [EN] Interleaved morph vertex data
     */
    interleaveData: Float32Array;
}

export default MorphInfoData_GLTF;
