/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 공통 속성, 서브메시/드로우콜 통계 및 메가버퍼 연동을 담당하는 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class responsible for common properties, sub-mesh/draw-call statistics, and mega-buffer integration across all scatter types (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import type {ScatterBaseSegmentAllocation} from "./AScatterMegaBuffer";
import type ScatterSubMesh from "./ScatterSubMesh";

/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class for all scatter types (Grass, Foliage, etc.).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **식별 및 수명주기 통일**: 모든 스캐터 종의 이름(`name`), 고유 ID(`typeId`), 간접 드로우콜 통계를 캡슐화합니다.
 * - **VRAM 세그먼트 메타데이터 바인딩**: 메가버퍼에서 배정된 세그먼트 할당 메타데이터(`allocation`)를 제네릭 타입으로 보관합니다.
 * - **서브메시 다형성 및 단일 진실 공급원**: 각 스캐터 종의 서브메시 컬렉션(`subMeshes`)을 추상 게터로 강제하며, 서브메시 개수(`subMeshCount`)는 항상 `subMeshes.length`와 일치하도록 보장합니다.
 * - **LOD 통합 지오메트리 규격 정의**: 각 LOD 단계별 단일 결합 지오메트리 목록(`unifiedGeometries`)을 추상 게터로 강제합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Unified Identification & Lifecycle**: Encapsulates name (`name`), unique ID (`typeId`), and indirect draw-call statistics across all scatter species.
 * - **VRAM Segment Metadata Binding**: Retains segment allocation metadata (`allocation`) assigned by mega-buffers as a generic type.
 * - **Sub-mesh Polymorphism & Single Source of Truth**: Mandates sub-mesh collection (`subMeshes`) via an abstract getter, guaranteeing `subMeshCount` always equals `subMeshes.length`.
 * - **LOD Unified Geometry Specification**: Mandates single combined geometry list (`unifiedGeometries`) per LOD level via an abstract getter.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스화할 수 없습니다. 서브클래스(Grass, Foliage)를 통해 사용하십시오.
 * [EN] This class is abstract and cannot be directly instantiated. Use via subclasses (Grass, Foliage).
 * :::
 */
export abstract class AScatterType<
    TAllocation extends ScatterBaseSegmentAllocation = ScatterBaseSegmentAllocation
> extends RedGPUObject {
    #name: string;
    #typeId: number;
    #drawCallCount: number = 0;
    #allocation: TAllocation | null = null;

    /**
     * [KO] AScatterType 인스턴스를 생성합니다.
     * [EN] Creates an AScatterType instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param name -
     * [KO] 스캐터 타입 고유 이름
     * [EN] Unique scatter type name
     * @param typeId -
     * [KO] 스캐터 타입 고유 ID (기본값: 0)
     * [EN] Unique scatter type ID (default: 0)
     */
    constructor(redGPUContext: RedGPUContext, name: string, typeId: number = 0) {
        super(redGPUContext);

        if (!name || typeof name !== 'string' || name.trim() === '') {
            consoleAndThrowError(`[${new.target.name}] name is required and must be a non-empty string!`);
        }

        const trimmedName = name.trim();
        super.name = trimmedName;
        this.#name = trimmedName;
        this.#typeId = typeId;
    }

    /**
     * [KO] 스캐터 인스턴스의 고유 식별자 이름을 반환합니다. (불변)
     * [EN] Returns the unique identifier name of the scatter instance. (immutable)
     */
    override get name(): string {
        return this.#name;
    }

    override set name(_value: string) {
        consoleAndThrowError(`[${this.constructor.name}] name property is readonly and cannot be changed.`);
    }

    /**
     * [KO] 스캐터 매니저 내부에서 배정하는 고유 타입 식별자 정수 (Type ID)를 반환합니다.
     * [EN] Returns the unique type identifier integer (Type ID) assigned internally by scatter managers.
     */
    get typeId(): number {
        return this.#typeId;
    }

    /**
     * [KO] 스캐터 타입 식별자 정수를 설정합니다.
     * [EN] Sets the unique type identifier integer.
     */
    set typeId(value: number) {
        this.#typeId = value;
    }

    /**
     * [KO] 해당 스캐터 모델을 구성하는 공통 서브메시 컬렉션을 반환하는 추상 게터입니다.
     * [EN] Abstract getter returning the collection of common sub-meshes composing this scatter model.
     */
    abstract get subMeshes(): readonly ScatterSubMesh[];

    /**
     * [KO] 해당 스캐터 모델을 구성하는 서브메시 총 개수를 반환합니다. (단일 진실 공급원)
     * [EN] Returns the total number of sub-meshes composing this scatter model. (Single source of truth)
     */
    get subMeshCount(): number {
        return this.subMeshes.length;
    }

    /**
     * [KO] 해당 스캐터 타입이 렌더 패스에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by this scatter type in render passes.
     */
    get drawCallCount(): number {
        return this.#drawCallCount;
    }

    /**
     * [KO] 메가버퍼 내 기본 세그먼트 할당 메타데이터를 반환합니다. (미할당 시 null)
     * [EN] Returns the base segment allocation metadata within the mega-buffer. (null if not allocated)
     */
    get allocation(): TAllocation | null {
        return this.#allocation;
    }

    /**
     * [KO] 간접 드로우콜 총 개수를 갱신합니다.
     * [EN] Updates the total number of indirect draw calls.
     *
     * @param drawCallCount -
     * [KO] 갱신할 간접 드로우콜 수
     * [EN] Updated indirect draw call count
     */
    updateDrawCallCount(drawCallCount: number): void {
        this.#drawCallCount = Math.max(0, drawCallCount);
    }

    /**
     * [KO] 메가버퍼에서 배정된 세그먼트 메타데이터를 바인딩합니다.
     * [EN] Binds the segment allocation metadata assigned by the mega-buffer.
     *
     * @param allocation -
     * [KO] 할당 메타데이터 객체
     * [EN] Allocation metadata object
     */
    bindAllocation(allocation: TAllocation): void {
        this.#allocation = allocation;
    }

    /**
     * [KO] 각 LOD 단계별 단일 결합 지오메트리 목록을 반환하는 추상 게터입니다.
     * [EN] Abstract getter returning single combined geometry list per LOD level.
     */
    abstract get unifiedGeometries(): (Geometry | null)[];

    /**
     * [KO] 기본 LOD 0 단계의 단일 결합 지오메트리를 반환합니다.
     * [EN] Returns the single combined geometry of base LOD 0.
     */
    get unifiedGeometry(): Geometry | null {
        const geoms = this.unifiedGeometries;
        return geoms.length > 0 ? geoms[0] : null;
    }

    /**
     * [KO] 스캐터 타입 리소스를 해제합니다.
     * [EN] Destroys scatter type resources.
     */
    destroy(): void {
        this.#allocation = null;
    }
}

Object.freeze(AScatterType);
export default AScatterType;
