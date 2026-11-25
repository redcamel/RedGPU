import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import {GlTfId} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import {MaterialVariantEntry} from "./materialVariantsHelper";

/**
 * [KO] 정적 메쉬 프리미티브의 공유 지오메트리 및 정점 속성 플래그 캐시 항목입니다.
 * [EN] Cache entry holding a shared static primitive geometry and its vertex attribute flags.
 *
 * @category GLTF
 */
export interface CachedStaticGeometryEntry {
    geometry: Geometry;
    hasVertexColor: boolean;
    hasVertexTangent: boolean;
}

/**
 * [KO] Pass 2에서 일괄 바인딩될 스킨 대기 항목입니다.
 * [EN] Pending skin binding entry resolved in Pass 2 after all scene nodes are created.
 *
 * @category GLTF
 */
export interface PendingSkinEntry {
    skinId: GlTfId;
    mesh: Mesh;
}

/**
 * [KO] 단일 glTF/GLB 파싱 세션 동안 런타임 노드·메쉬·머티리얼·지오메트리 매핑과 스킨 대기열을 관리하는 컨텍스트입니다.
 * [EN] Parsing-session context that manages runtime node, mesh, material, and geometry mappings along with pending skin bindings without mutating source `gltfData`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category GLTF
 */
class GLTFParseContext {
    /**
     * [KO] glTF 노드 ID별 대표 `Mesh` (또는 그룹 `Mesh`) 매핑
     * [EN] Mapping of glTF node ID to its representative `Mesh` (or group `Mesh`)
     */
    nodeObjectMap: Map<GlTfId, Mesh> = new Map();
    /**
     * [KO] glTF 노드 ID별 생성된 전체 프리미티브 `Mesh[]` 매핑
     * [EN] Mapping of glTF node ID to all primitive `Mesh` instances created for that node
     */
    nodeMeshesMap: Map<GlTfId, Mesh[]> = new Map();
    /**
     * [KO] 5-튜플 키(`${materialId}_${useVC}_${useVT}_${isSkinned}_${forceUnlit}`) 기반 `PBRMaterial` 공유 캐시
     * [EN] Shared `PBRMaterial` cache keyed by `${materialId}_${useVC}_${useVT}_${isSkinned}_${forceUnlit}`
     */
    materialCache: Map<string, PBRMaterial> = new Map();
    /**
     * [KO] 비-모프·비-스킨 정적 프리미티브용 `${meshId}_${primitiveIndex}` 기반 `Geometry` 공유 캐시
     * [EN] Shared `Geometry` cache keyed by `${meshId}_${primitiveIndex}` for non-morph, non-skinned primitives
     */
    geometryCache: Map<string, CachedStaticGeometryEntry> = new Map();
    /**
     * [KO] Pass 1 노드 생성 이후 Pass 2에서 일괄 연결할 스킨 대기열
     * [EN] Queue of skin bindings collected in Pass 1 and resolved in Pass 2
     */
    pendingSkins: PendingSkinEntry[] = [];
    /**
     * [KO] 파싱 세션 동안 사용하는 바이너리 버퍼 `DataView` 목록
     * [EN] Binary buffer `DataView` list used during the parse session
     */
    buffers: DataView[] = [];
    /**
     * [KO] 텍스처 로더에 전달할 원시 텍스처 대기 맵
     * [EN] Pending raw texture loading map passed to `TextureLoader`
     */
    textureRawList: Map<string, any> = new Map();
    /**
     * [KO] `KHR_animation_pointer` 바인딩 연결용 머티리얼 ID별 `PBRMaterial[]` 맵
     * [EN] Material ID to `PBRMaterial[]` map used to bind `KHR_animation_pointer`
     */
    materialsById: Map<number, PBRMaterial[]> = new Map();
    /**
     * [KO] `KHR_materials_variants` 메쉬별 변형 머티리얼 매핑 목록
     * [EN] Per-mesh material variant mapping entries for `KHR_materials_variants`
     */
    materialVariantEntries: MaterialVariantEntry[] = [];

    /**
     * [KO] 파싱 완료 또는 중단 시 컨텍스트 내부의 모든 임시 매핑과 캐시 참조를 해제합니다.
     * [EN] Releases all temporary mappings and cache references when parsing completes or aborts.
     */
    clear(): void {
        this.nodeObjectMap.clear();
        this.nodeMeshesMap.clear();
        this.materialCache.clear();
        this.geometryCache.clear();
        this.pendingSkins.length = 0;
        this.buffers.length = 0;
        this.textureRawList.clear();
        this.materialsById.clear();
        this.materialVariantEntries = [];
    }
}

const ACTIVE_PARSE_CONTEXT_MAP = new WeakMap<GLTFLoader, GLTFParseContext>();

/**
 * [KO] 지정된 `GLTFLoader`에 활성 `GLTFParseContext`를 바인딩합니다.
 * [EN] Binds an active `GLTFParseContext` to the specified `GLTFLoader`.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param parseContext -
 * [KO] 바인딩할 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance to bind
 * @category GLTF
 */
export const setActiveParseContext = (gltfLoader: GLTFLoader, parseContext: GLTFParseContext): void => {
    ACTIVE_PARSE_CONTEXT_MAP.set(gltfLoader, parseContext);
};

/**
 * [KO] 지정된 `GLTFLoader`에 바인딩된 활성 `GLTFParseContext`를 조회합니다.
 * [EN] Retrieves the active `GLTFParseContext` bound to the specified `GLTFLoader`.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @returns
 * [KO] 바인딩된 `GLTFParseContext` 또는 `undefined`
 * [EN] Bound `GLTFParseContext` or `undefined`
 * @category GLTF
 */
export const getActiveParseContext = (gltfLoader: GLTFLoader): GLTFParseContext | undefined => {
    return ACTIVE_PARSE_CONTEXT_MAP.get(gltfLoader);
};

/**
 * [KO] 지정된 `GLTFLoader`의 활성 `GLTFParseContext` 바인딩을 해제합니다.
 * [EN] Clears the active `GLTFParseContext` binding for the specified `GLTFLoader`.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @category GLTF
 */
export const clearActiveParseContext = (gltfLoader: GLTFLoader): void => {
    ACTIVE_PARSE_CONTEXT_MAP.delete(gltfLoader);
};

export default GLTFParseContext;
