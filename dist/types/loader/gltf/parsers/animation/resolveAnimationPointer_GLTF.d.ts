import GLTFParseContext from "../../core/GLTFParseContext";
import { GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] `KHR_animation_pointer` 트랙의 런타임 Zero-GC 프로퍼티 적용 바인딩 타입입니다.
 * [EN] Runtime Zero-GC property binding type for a `KHR_animation_pointer` animation track.
 *
 * @category GLTF
 */
export type PointerTargetBinding = {
    componentCount: 1 | 2 | 3 | 4;
    apply: (v0: number, v1: number, v2: number, v3: number) => void;
};
/**
 * [KO] JSON Pointer 문자열의 구조적 파싱 결과 타입입니다.
 * [EN] Structurally parsed result type of a JSON Pointer string.
 *
 * @category GLTF
 */
export type ParsedPointerDescriptor = {
    domain: 'node_standard';
    nodeIndex: number;
    path: 'translation' | 'rotation' | 'scale' | 'weights';
} | {
    domain: 'node_visibility';
    nodeIndex: number;
} | {
    domain: 'camera_perspective';
    cameraIndex: number;
    property: 'yfov' | 'znear' | 'zfar';
} | {
    domain: 'material_property';
    materialIndex: number;
    propertyKey: string;
} | {
    domain: 'material_texture_transform';
    materialIndex: number;
    textureKey: string;
    transformProp: 'offset' | 'scale' | 'rotation';
};
/**
 * [KO] `KHR_animation_pointer` JSON Pointer 문자열을 규칙 기반으로 해석하여 구조화된 타겟 디스크립터를 반환합니다.
 * [EN] Parses a `KHR_animation_pointer` JSON Pointer string using rule-based resolution into a structured target descriptor.
 *
 * @param pointer -
 * [KO] JSON Pointer 경로 문자열 (예: `/materials/0/pbrMetallicRoughness/baseColorFactor`)
 * [EN] JSON Pointer path string (e.g., `/materials/0/pbrMetallicRoughness/baseColorFactor`)
 * @returns
 * [KO] 해석된 디스크립터 또는 미지원/유효하지 않은 경로인 경우 `null`
 * [EN] Parsed descriptor, or `null` if unsupported or invalid
 * @category GLTF
 */
export declare const parseAnimationPointerPath: (pointer?: string) => ParsedPointerDescriptor | null;
/**
 * [KO] 해석된 `KHR_animation_pointer` 디스크립터를 실제 RedGPU 노드·카메라·머티리얼 인스턴스에 Zero-GC 바인딩합니다.
 * [EN] Binds a parsed `KHR_animation_pointer` descriptor to live RedGPU node, camera, or material instances with Zero-GC application.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱된 `GLTF` 데이터 객체
 * [EN] Parsed `GLTF` data object
 * @param descriptor -
 * [KO] `parseAnimationPointerPath`로 해석된 디스크립터
 * [EN] Descriptor parsed by `parseAnimationPointerPath`
 * @param componentCount -
 * [KO] 애니메이션 output accessor의 컴포넌트 개수 (`1`~`4`)
 * [EN] Component count (`1`~`4`) derived from the animation output accessor type
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스 (선택)
 * [EN] Optional `GLTFParseContext` instance for the current parse session
 * @returns
 * [KO] 런타임 적용 바인딩 또는 대상이 없을 경우 `null`
 * [EN] Runtime binding object, or `null` if the target does not exist
 * @category GLTF
 */
export declare const createPointerTargetBinding: (gltfLoader: GLTFLoader, gltfData: GLTF, descriptor: ParsedPointerDescriptor, componentCount: 1 | 2 | 3 | 4, parseContext?: GLTFParseContext) => PointerTargetBinding | null;
