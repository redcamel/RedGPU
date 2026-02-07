import type HDRTexture from "../../../../texture/hdr/HDRTexture";

/**
 * [KO] HDR 관련 텍스처(2D)의 관리 상태를 정의하는 클래스입니다.
 * [EN] A class that defines the managed state of HDR-related textures (2D).
 */
class ResourceStateHDRTexture {
    /** [KO] 관리 대상 텍스처 인스턴스 [EN] Managed texture instance */
    texture: HDRTexture
    /** [KO] 소스 경로 [EN] Source path */
    src: string
    /** [KO] 캐시 키 [EN] Cache key */
    cacheKey: string
    /** [KO] 참조 횟수 [EN] Reference count */
    useNum: number = 0
    /** [KO] 고유 ID [EN] Unique ID */
    uuid: string | number

    constructor(texture: HDRTexture) {
        this.texture = texture
        this.src = texture.src
        this.cacheKey = texture.cacheKey
        this.useNum = 0
        this.uuid = texture.uuid
    }
}

export default ResourceStateHDRTexture;