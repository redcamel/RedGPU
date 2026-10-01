/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 공통 속성, 서브메시/드로우콜 통계 및 메가버퍼 연동을 담당하는 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class responsible for common properties, sub-mesh/draw-call statistics, and mega-buffer integration across all scatter types (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import AScatterMegaBuffer, {ScatterBaseSegmentAllocation} from "./AScatterMegaBuffer";

/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class for all scatter types (Grass, Foliage, etc.).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **식별 및 수명주기 통일**: 모든 스캐터 종의 이름(`name`), 고유 ID(`typeId`), 서브메시 및 간접 드로우콜 통계를 캡슐화합니다.
 * - **VRAM 세그먼트 배정 연동**: 하위 [`AScatterMegaBuffer`](file:///D:/github/RedGPU/src/landscape/core/scatter/AScatterMegaBuffer.ts)의 64바이트 정렬 세그먼트 할당(`allocateBaseSegment`)을 호출하고 배정 정보를 보관합니다.
 * - **LOD 통합 지오메트리 규격 정의**: 각 LOD 단계별 단일 결합 지오메트리 목록(`unifiedGeometries`)을 추상 게터로 강제하여 상위 렌더 패스가 다형성(Polymorphism)으로 접근할 수 있도록 보장합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Unified Identification & Lifecycle**: Encapsulates name (`name`), unique ID (`typeId`), sub-mesh and indirect draw-call statistics across all scatter species.
 * - **VRAM Segment Allocation Link**: Calls aligned segment allocation (`allocateBaseSegment`) from [`AScatterMegaBuffer`](file:///D:/github/RedGPU/src/landscape/core/scatter/AScatterMegaBuffer.ts) and retains assignment metadata.
 * - **LOD Unified Geometry Specification**: Mandates single combined geometry list (`unifiedGeometries`) per LOD level via an abstract getter, allowing render passes to interface polymorphically.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스화할 수 없습니다. 서브클래스(Grass, Foliage)를 통해 사용하십시오.
 * [EN] This class is abstract and cannot be directly instantiated. Use via subclasses (Grass, Foliage).
 * :::
 */
export abstract class AScatterType extends RedGPUObject {
    #name: string;
    #typeId: number;
    #subMeshCount: number = 0;
    #drawCallCount: number = 0;
    #allocation: ScatterBaseSegmentAllocation | null = null;

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
     * [KO] 해당 스캐터 모델을 구성하는 서브메시 총 개수를 반환합니다.
     * [EN] Returns the total number of sub-meshes composing this scatter model.
     */
    get subMeshCount(): number {
        return this.#subMeshCount;
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
    get allocation(): ScatterBaseSegmentAllocation | null {
        return this.#allocation;
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
     * [KO] 서브메시 및 간접 드로우콜 통계 수치를 갱신합니다.
     * [EN] Updates sub-mesh and indirect draw-call statistics numbers.
     *
     * @param subMeshCount -
     * [KO] 서브메시 총 개수
     * [EN] Total number of sub-meshes
     * @param drawCallCount -
     * [KO] 간접 드로우콜 총 개수 (생략 시 subMeshCount와 동일)
     * [EN] Total number of indirect draw calls (same as subMeshCount if omitted)
     */
    updateSubMeshStats(subMeshCount: number, drawCallCount?: number): void {
        this.#subMeshCount = Math.max(0, subMeshCount);
        this.#drawCallCount = drawCallCount !== undefined ? Math.max(0, drawCallCount) : this.#subMeshCount;
    }

    /**
     * [KO] 메가버퍼의 기본 세그먼트를 할당하고 할당 정보를 저장합니다.
     * [EN] Allocates a base segment in the mega-buffer and stores the allocation metadata.
     *
     * @param megaBuffer -
     * [KO] 대상 스캐터 메가버퍼 인스턴스
     * [EN] Target scatter mega-buffer instance
     * @param maxInstances -
     * [KO] 최대 수용 인스턴스 수
     * [EN] Maximum instance capacity
     * @param culledMultiplier -
     * [KO] 컬링 결과 버퍼 배율 (기본값: 1)
     * [EN] Culled instance buffer multiplier (default: 1)
     * @returns
     * [KO] 할당된 기본 세그먼트 메타데이터
     * [EN] Allocated base segment metadata
     */
    allocateBaseSegment(
        megaBuffer: AScatterMegaBuffer,
        maxInstances: number,
        culledMultiplier: number = 1
    ): ScatterBaseSegmentAllocation {
        this.#allocation = megaBuffer.allocateBaseSegment(
            this.#name || this.#typeId,
            maxInstances,
            this.#subMeshCount,
            culledMultiplier
        );
        return this.#allocation;
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
