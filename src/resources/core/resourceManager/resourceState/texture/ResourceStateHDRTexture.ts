import type HDRTexture from "../../../../texture/hdr/HDRTexture";

/**
 * [KO] HDR 텍스처(`HDRTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.
 * [EN] Class representing the resource management state of HDR textures (`HDRTexture`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
class ResourceStateHDRTexture {
    /**
     * [KO] 관리 대상 HDR 텍스처 인스턴스
     * [EN] Managed HDR texture instance
     */
    texture: HDRTexture
    /**
     * [KO] 텍스처 소스 경로
     * [EN] Texture source path
     */
    src: string
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
     * [KO] ResourceStateHDRTexture 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStateHDRTexture instance.
     *
     * @param texture -
     * [KO] 관리할 HDR 텍스처 인스턴스
     * [EN] HDR texture instance to manage
     */
    constructor(texture: HDRTexture) {
        this.texture = texture
        this.src = texture.src
        this.cacheKey = texture.cacheKey
        this.useNum = 0
        this.uuid = texture.uuid
    }
}

export default ResourceStateHDRTexture;