import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import GLTFParseContext from "../../core/GLTFParseContext";
import { GLTF, GlTfId, MeshPrimitive } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] `parseMaterialInfo_GLTF` 호출 시 머티리얼 오버라이드·캐시·셰이더 변형을 제어하는 옵션 인터페이스입니다.
 * [EN] Options interface controlling material overrides, caching, and shader variants in `parseMaterialInfo_GLTF`.
 *
 * @category GLTF
 */
export interface MaterialParseOptions {
    overrideMaterialId?: GlTfId;
    parseContext?: GLTFParseContext;
    useVertexColor?: boolean;
    useVertexTangent?: boolean;
    isSkinned?: boolean;
    forceUnlit?: boolean;
    bypassCache?: boolean;
}
/**
 * [KO] glTF 메쉬 프리미티브의 재질 정보 및 확장을 파싱하여 `PBRMaterial` 인스턴스를 생성하거나 5-튜플 캐시에서 공유 반환합니다.
 * [EN] Parses material information and extensions of a glTF mesh primitive, creating or sharing a `PBRMaterial` instance via a 5-tuple cache key.
 *
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @param gltfData -
 * [KO] glTF 데이터 객체
 * [EN] glTF data object
 * @param meshPrimitive -
 * [KO] 대상 glTF 메쉬 프리미티브
 * [EN] Target glTF mesh primitive
 * @param options -
 * [KO] 머티리얼 오버라이드·캐시·셰이더 변형 옵션 (선택)
 * [EN] Optional material override, cache, and shader variant options
 * @returns
 * [KO] 파싱된 `PBRMaterial` 인스턴스
 * [EN] Parsed `PBRMaterial` instance
 * @category GLTF
 */
declare const parseMaterialInfo_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive, options?: MaterialParseOptions) => PBRMaterial;
export default parseMaterialInfo_GLTF;
