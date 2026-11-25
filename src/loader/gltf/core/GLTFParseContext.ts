import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import {GlTfId} from "../GLTF";

/**
 * [KO] 정적 메쉬 프리미티브의 공유 지오메트리·더미 스킨 버퍼 및 정점 속성 플래그 캐시 항목입니다.
 * [EN] Cache entry holding a shared static primitive geometry, dummy skin buffers, and its vertex attribute flags.
 *
 * @category GLTF
 */
export interface CachedStaticGeometryEntry {
    geometry: Geometry;
    weightBuffer: VertexBuffer;
    jointBuffer: IndexBuffer;
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
     * [KO] 4-튜플 키(`${materialId}_${useVC}_${useVT}_${isSkinned}`) 기반 `PBRMaterial` 공유 캐시
     * [EN] Shared `PBRMaterial` cache keyed by `${materialId}_${useVC}_${useVT}_${isSkinned}`
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
     * [KO] 파싱 완료 또는 중단 시 컨텍스트 내부의 모든 임시 매핑과 캐시 참조를 해제합니다.
     * [EN] Releases all temporary mappings and cache references when parsing completes or aborts.
     */
    clear(): void {
        this.nodeObjectMap.clear();
        this.nodeMeshesMap.clear();
        this.materialCache.clear();
        this.geometryCache.clear();
        this.pendingSkins.length = 0;
    }
}

export default GLTFParseContext;
