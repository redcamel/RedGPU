import CubeTexture from "../../../../texture/CubeTexture";
import DirectCubeTexture from "../../../../texture/DirectCubeTexture";

/**
 * [KO] 큐브 텍스처(`CubeTexture`, `DirectCubeTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.
 * [EN] Class representing the resource management state of cube textures (`CubeTexture`, `DirectCubeTexture`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
class ResourceStateCubeTexture {
    /**
     * [KO] 관리 대상 큐브 텍스처 인스턴스
     * [EN] Managed cube texture instance
     */
    texture: CubeTexture | DirectCubeTexture
    /**
     * [KO] 큐브맵 6면 소스 경로 배열
     * [EN] Array of source paths for the 6 cubemap faces
     */
    srcList: string[]
    /**
     * [KO] 리소스 캐시 키
     * [EN] Resource cache key
     */
    cacheKey: string
    /**
     * [KO] 리소스 참조 횟수
     * [EN] Resource reference count
     */
    useNum: number = 0
    /**
     * [KO] 고유 식별자(UUID)
     * [EN] Unique identifier (UUID)
     */
    uuid: string | number

    /**
     * [KO] ResourceStateCubeTexture 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStateCubeTexture instance.
     *
     * @param cubeTexture -
     * [KO] 관리할 큐브 텍스처 인스턴스
     * [EN] Cube texture instance to manage
     */
    constructor(cubeTexture: CubeTexture | DirectCubeTexture) {
        this.texture = cubeTexture
        this.srcList = cubeTexture.constructor.name === 'CubeTexture' ? (cubeTexture as CubeTexture).srcList : undefined
        this.cacheKey = cubeTexture.cacheKey
        this.useNum = 0
        this.uuid = cubeTexture.uuid
    }
}

export default ResourceStateCubeTexture;
