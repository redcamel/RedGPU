import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import { MaterialNormalTextureInfo, MaterialOcclusionTextureInfo, TextureInfo } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] GLTF 재질의 텍스처 정보 및 샘플러 옵션을 파싱하여 로더의 텍스처 로드 목록에 등록합니다.
 * [EN] Parses texture information and sampler options of a GLTF material and registers them in the loader's texture load list.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param tMaterial -
 * [KO] 텍스처가 적용될 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance to which the texture will be applied
 * @param textureInfo -
 * [KO] 파싱할 GLTF 텍스처 정보 객체
 * [EN] GLTF texture info object to parse
 * @param targetTextureKey -
 * [KO] 대상 재질의 텍스처 프로퍼티 키 이름
 * [EN] Texture property key name on the target material
 * @param format -
 * [KO] 적용할 텍스처 포맷 문자열
 * [EN] Optional texture format string to apply
 * @param useMipmap -
 * [KO] 밉맵 사용 여부 (기본값: `true`)
 * [EN] Whether to use mipmaps (default: `true`)
 * @category Loader
 */
declare const parseMaterialTexture: (gltfLoader: GLTFLoader, tMaterial: PBRMaterial, textureInfo: TextureInfo | MaterialNormalTextureInfo | MaterialOcclusionTextureInfo, targetTextureKey: string, format?: string, useMipmap?: boolean) => void;
export default parseMaterialTexture;
