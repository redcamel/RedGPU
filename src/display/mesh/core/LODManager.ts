import Geometry from "../../../geometry/Geometry";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import Primitive from "../../../primitive/core/Primitive";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import meshVertexSource from '../shader/meshVertex.wgsl';
import meshVertexSourcePbr from '../shader/meshVertexPbr.wgsl';
import ParseWGSL from "../../../resources/wgslParser/parseWGSL";
import vertexModuleSourcePbrInput from "../shader/meshVertexPbr_input.wgsl";
import vertexModuleSourcePbrOutput from "../shader/meshVertexPbr_output.wgsl";
import vertexModuleSourcePbr from "../shader/meshVertexPbr.wgsl";
import vertexModuleSourceInput from "../shader/meshVertex_input.wgsl";
import vertexModuleSourceOutput from "../shader/meshVertex_output.wgsl";
import vertexModuleSource from "../shader/meshVertex.wgsl";

const SHADER_INFO_BASIC = ParseWGSL([
    vertexModuleSourceInput,
    vertexModuleSourceOutput,
    vertexModuleSource
].join("\n")).shaderSourceVariant.getVariant('none')

const SHADER_INFO_PBR = ParseWGSL([
    vertexModuleSourcePbrInput,
    vertexModuleSourcePbrOutput,
    vertexModuleSourcePbr,
].join("\n")).shaderSourceVariant.getVariant('none')

const SHADER_INFO_ONLY_VERTEX_PBR = ParseWGSL([
    vertexModuleSourcePbrInput,
    vertexModuleSourceOutput,
    vertexModuleSource,
].join("\n")).shaderSourceVariant.getVariant('none')

const SHADER_INFO_ONLY_FRAGMENT_PBR = ParseWGSL([
    vertexModuleSourceInput,
    vertexModuleSourcePbrOutput,
    vertexModuleSource,
].join("\n")).shaderSourceVariant.getVariant('none')
/**
 * LOD에 사용되는 지오메트리 타입입니다.
 *
 * Geometry 또는 Primitive를 LOD 단계에 사용할 수 있습니다.
 */
type LODGeometry = Geometry | Primitive;
/**
 * 단일 LOD(Level of Detail) 레벨을 나타내는 정보입니다.
 *
 * @remarks
 * - `distance`는 이 LOD가 활성화되는 기준 거리입니다.
 * - `distanceSquared`는 거리 비교를 최적화하기 위해 미리 제곱해 둔 값입니다.
 * - `geometry`는 해당 LOD 단계에서 사용할 지오메트리입니다.
 */
type LODEntry = {
    distance: number;
    distanceSquared: number;
    geometry: LODGeometry;
    materialIsPBR: boolean;
    geometryIsPBR: boolean;
    label: string;
    material?: ABaseMaterial;
    source: string;
};

/**
 * 거리 기반 LOD(Level of Detail) 관리를 담당하는 매니저 클래스입니다.
 *
 * 카메라와의 거리(또는 임의의 거리 값)에 따라 적절한 LOD 레벨을 선택하고,
 * LOD 목록이 갱신될 때 콜백을 호출합니다.
 *
 * @example
 * ```ts

 * lodManager.addLOD(10, nearGeometry);
 * lodManager.addLOD(30, midGeometry);
 * lodManager.addLOD(100, farGeometry);
 *
 * const lod = lodManager.getLOD(currentDistance);
 * const geometry = lod?.geometry;
 * ```
 */
class LODManager {
    #lodList: LODEntry[] = [];
    #callback: () => void;

    /**
     * LODManager 인스턴스를 생성합니다.
     *
     * @param callback LOD 목록이 변경될 때마다 호출되는 콜백 함수
     */
    constructor(callback: () => void) {
        this.#callback = callback;
    }

    /**
     * 현재 등록된 모든 LOD 레벨 목록을 반환합니다.
     *
     * @returns LOD 레벨 정보 배열(복사본)
     *
     * @remarks
     * 반환되는 배열은 내부 배열의 복사본이므로, 외부에서 수정해도
     * LODManager 내부 상태에는 영향을 주지 않습니다.
     */
    get LODList(): LODEntry[] {
        return [...this.#lodList];
    }

    /**
     * 새로운 LOD 레벨을 추가합니다.
     *
     * @param distance 이 LOD가 사용될 기준 거리(양수)
     * @param geometry 해당 LOD 거리에서 사용할 지오메트리
     * @param material
     *
     * @remarks
     * - LOD 레벨은 최대 8개까지만 허용됩니다.
     * - 동일한 `distance` 값을 가진 LOD는 중복 추가할 수 없습니다.
     *
     * @throws {Error} LOD 레벨이 8개를 초과하는 경우
     * @throws {Error} 동일한 거리의 LOD가 이미 존재하는 경우
     */
    addLOD(distance: number, geometry: LODGeometry, material: ABaseMaterial) {
        validatePositiveNumberRange(distance, 1)
        if (this.#lodList.length >= 8) {
            throw new Error("Maximum of 8 LOD levels allowed.");
        }
        if (this.#lodList.some(lod => lod.distance === distance)) {
            throw new Error(`LOD with distance ${distance} already exists.`);
        }
        const geometryIsPBR = geometry.vertexBuffer.interleavedStruct.label === 'PBR'
        const materialIsPBR = material instanceof PBRMaterial
        this.#lodList.push({
            distance,
            distanceSquared: distance * distance,
            geometry,
            material,
            geometryIsPBR,
            materialIsPBR,
            label: `${geometryIsPBR ? 'pbr' : 'noPbr'}_${material?.constructor.name}_${materialIsPBR ? 'pbr' : 'noPbr'}`,
            source: this.#getLODVertexModuleSource(geometry, material)
        });
        this.#lodList.sort((a, b) => a.distance - b.distance);
        this.#callback?.()
    }

    #getLODVertexModuleSource(geometry: Geometry | Primitive, material: ABaseMaterial): string {
        const isPbrVertex = geometry.vertexBuffer.interleavedStruct.label=== 'PBR';
        const isPbrMaterial = material instanceof PBRMaterial;

        const isPBR = isPbrVertex && isPbrMaterial;
        const isPBROnyFragment = !isPbrVertex && isPbrMaterial;
        const isPBROnyVertex = isPbrVertex && !isPbrMaterial;

        return isPBR ? SHADER_INFO_PBR : isPBROnyFragment ? SHADER_INFO_ONLY_FRAGMENT_PBR : isPBROnyVertex ? SHADER_INFO_ONLY_VERTEX_PBR : SHADER_INFO_BASIC
    }

    /**
     * 현재 거리 값에 대해 가장 적절한 LOD 엔트리를 반환합니다.
     *
     * @param currentDistance 기준이 되는 현재 거리 값
     * @returns 선택된 LOD 엔트리, LOD가 하나도 없는 경우 `undefined`
     *
     * @remarks
     * - `currentDistance`가 가장 작은 `distance`보다 작으면 해당 LOD를 반환합니다.
     * - 그 외에는 조건을 만족하는 마지막 LOD 또는 가장 멀리 있는 LOD를 반환합니다.
     * - 실제 지오메트리는 반환값의 `geometry` 필드에서 접근할 수 있습니다.
     */
    getLOD(currentDistance: number): LODEntry | undefined {
        for (const lod of this.#lodList) {
            if (currentDistance < lod.distance) return lod;
        }
        return this.#lodList.at(-1);
    }

    /**
     * 지정한 거리의 LOD 레벨을 제거합니다.
     *
     * @param distance 제거할 LOD 레벨의 기준 거리
     *
     * @remarks
     * 지정한 거리와 정확히 일치하는 LOD만 제거됩니다.
     * 일치하는 LOD가 없으면 아무 작업도 수행하지 않습니다.
     */
    removeLOD(distance: number) {
        this.#lodList = this.#lodList.filter(lod => lod.distance !== distance);
        this.#callback?.()
    }

    /**
     * 모든 LOD 레벨을 제거합니다.
     *
     * @remarks
     * LOD 목록이 초기화된 후 콜백이 호출됩니다.
     */
    clearLOD() {
        this.#lodList.length = 0
        this.#callback?.()
    }
}

export default LODManager;
