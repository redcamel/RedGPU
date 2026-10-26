import BitmapTexture from "../../../../texture/BitmapTexture";
import DirectTexture from "../../../../texture/DirectTexture";
import ANoiseTexture from "../../../../texture/noiseTexture/core/ANoiseTexture";
/**
 * [KO] 2D 비트맵 텍스처(`BitmapTexture`, `ANoiseTexture`, `DirectTexture`)의 리소스 관리 상태를 나타내는 클래스입니다.
 * [EN] Class representing the resource management state of 2D bitmap textures (`BitmapTexture`, `ANoiseTexture`, `DirectTexture`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
declare class ResourceStateBitmapTexture {
    /**
     * [KO] 관리 대상 텍스처 인스턴스
     * [EN] Managed texture instance
     */
    texture: BitmapTexture | ANoiseTexture | DirectTexture;
    /**
     * [KO] 텍스처 소스 경로
     * [EN] Texture source path
     */
    src: string;
    /**
     * [KO] 리소스 캐시 키
     * [EN] Resource cache key
     */
    cacheKey: string;
    /**
     * [KO] 리소스 참조 횟수
     * [EN] Resource reference count
     */
    useNum: number;
    /**
     * [KO] 고유 식별자(UUID)
     * [EN] Unique identifier (UUID)
     */
    uuid: string | number;
    /**
     * [KO] ResourceStateBitmapTexture 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStateBitmapTexture instance.
     *
     * @param texture -
     * [KO] 관리할 텍스처 인스턴스
     * [EN] Texture instance to manage
     */
    constructor(texture: BitmapTexture | ANoiseTexture | DirectTexture);
}
export default ResourceStateBitmapTexture;
