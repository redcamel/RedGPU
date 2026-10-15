import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

/**
 * [KO] `ScatterRenderUnit` 인스턴스 초기화에 필요한 지오메트리, 인덱스 범위 및 머티리얼 옵션 인터페이스입니다.
 * [EN] Options interface for geometry, index range, and material required to initialize a `ScatterRenderUnit` instance.
 *
 * @category Landscape
 */
export interface ScatterRenderUnitInitOptions {
    /**
     * [KO] 렌더링할 정점/인덱스 버퍼를 보유한 `Geometry` 인스턴스
     * [EN] `Geometry` instance holding the vertex/index buffers to render
     */
    geometry: Geometry;

    /**
     * [KO] 렌더 유닛의 정점 개수 (생략 시 지오메트리에서 추론)
     * [EN] Vertex count of the render unit (inferred from geometry if omitted)
     */
    vertexCount?: number;

    /**
     * [KO] 드로우할 인덱스 개수 (생략 시 인덱스 버퍼에서 추론)
     * [EN] Number of indices to draw (inferred from index buffer if omitted)
     */
    indexCount?: number;

    /**
     * [KO] 인덱스 버퍼 사용 여부 (생략 시 지오메트리에서 추론)
     * [EN] Whether an index buffer is used (inferred from geometry if omitted)
     */
    isIndexed?: boolean;

    /**
     * [KO] 인덱스 버퍼 포맷 (기본값: `'uint32'`)
     * [EN] Index buffer format (default: `'uint32'`)
     */
    indexFormat?: GPUIndexFormat;

    /**
     * [KO] 정점당 바이트 스트라이드 (기본값: `72`)
     * [EN] Byte stride per vertex (default: `72`)
     */
    strideBytes?: number;

    /**
     * [KO] 인다이렉트 드로우 버퍼 내 바이트 오프셋 (기본값: `0`)
     * [EN] Byte offset within the indirect draw buffer (default: `0`)
     */
    indirectOffsetBytes?: number;

    /**
     * [KO] 컬링된 인스턴스 버퍼 내 시작 인스턴스 오프셋 (기본값: `0`)
     * [EN] Starting instance offset within the culled instance buffer (default: `0`)
     */
    instanceBufferOffset?: number;

    /**
     * [KO] 통합 인덱스 버퍼 내 시작 인덱스 오프셋 (기본값: `0`)
     * [EN] Starting index offset within the unified index buffer (default: `0`)
     */
    firstIndex?: number;

    /**
     * [KO] 이 렌더 유닛에 적용된 머티리얼 인스턴스 (선택적)
     * [EN] Material instance applied to this render unit (optional)
     */
    material?: any;

    /**
     * [KO] 베이스 컬러 텍스처 인스턴스 (선택적)
     * [EN] Base color texture instance (optional)
     */
    baseColorTexture?: BitmapTexture | null;

    /**
     * [KO] 이 렌더 유닛이 속한 LOD 레벨 인덱스 (기본값: `0`)
     * [EN] LOD level index to which this render unit belongs (default: `0`)
     */
    lodIndex?: number;

    /**
     * [KO] 알파 마스크(Alpha Cutoff) 머티리얼 여부 (기본값: `false`)
     * [EN] Whether the material uses alpha masking (alpha cutoff) (default: `false`)
     */
    isMasked?: boolean;
}

/**
 * [KO] 스캐터 시스템에서 단일 `drawIndexedIndirect` 드로우콜 단위가 되는 서브메시/LOD 렌더 유닛 클래스입니다.
 * [EN] Submesh/LOD render unit class that serves as a single `drawIndexedIndirect` draw call unit in the scatter system.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class ScatterRenderUnit {
    #geometry: Geometry;
    #vertexCount: number;
    #indexCount: number;
    #firstIndex: number;
    #isIndexed: boolean;
    #indexFormat: GPUIndexFormat;
    #strideBytes: number;
    #indirectOffsetBytes: number;
    #instanceBufferOffset: number;

    #material?: any;
    #baseColorTexture?: BitmapTexture | null;
    #lodIndex: number;
    #isMasked: boolean;

    /**
     * [KO] ScatterRenderUnit 인스턴스를 초기화합니다.
     * [EN] Initializes a ScatterRenderUnit instance.
     *
     * @param init -
     * [KO] 렌더 유닛 초기화 옵션
     * [EN] Render unit initialization options
     */
    constructor(init: ScatterRenderUnitInitOptions) {
        const {
            geometry,
            firstIndex = 0,
            indexFormat = 'uint32',
            indirectOffsetBytes = 0,
            instanceBufferOffset = 0,
            material,
            baseColorTexture = null,
            lodIndex = 0,
            isMasked = false,
            vertexCount: initVertexCount,
            indexCount: initIndexCount,
            isIndexed: initIsIndexed,
            strideBytes: initStrideBytes
        } = init;

        const {vertexBuffer, indexBuffer} = geometry;
        const vertexCount = initVertexCount ?? vertexBuffer.vertexCount ?? 0;
        const isIndexed = initIsIndexed ?? !!indexBuffer;
        const indexCount = initIndexCount ?? (indexBuffer ? indexBuffer.indexCount : vertexCount);
        const strideBytes = initStrideBytes ?? (vertexBuffer.stride ? vertexBuffer.stride * 4 : 72);

        this.#geometry = geometry;
        this.#vertexCount = vertexCount;
        this.#indexCount = indexCount;
        this.#firstIndex = firstIndex;
        this.#isIndexed = isIndexed;
        this.#indexFormat = indexFormat;
        this.#strideBytes = strideBytes;
        this.#indirectOffsetBytes = indirectOffsetBytes;
        this.#instanceBufferOffset = instanceBufferOffset;

        this.#material = material;
        this.#baseColorTexture = baseColorTexture ?? material?.baseColorTexture ?? null;
        this.#lodIndex = lodIndex;
        this.#isMasked = isMasked;
    }

    /**
     * [KO] 렌더 유닛의 `Geometry` 인스턴스를 반환합니다.
     * [EN] Returns the `Geometry` instance of the render unit.
     */
    get geometry(): Geometry {
        return this.#geometry;
    }

    /**
     * [KO] 렌더 유닛의 정점 개수를 반환합니다.
     * [EN] Returns the vertex count of the render unit.
     */
    get vertexCount(): number {
        return this.#vertexCount;
    }

    /**
     * [KO] 렌더 유닛의 인덱스 개수를 반환합니다.
     * [EN] Returns the index count of the render unit.
     */
    get indexCount(): number {
        return this.#indexCount;
    }

    /**
     * [KO] 통합 인덱스 버퍼 내 시작 인덱스 오프셋을 반환합니다.
     * [EN] Returns the starting index offset within the unified index buffer.
     */
    get firstIndex(): number {
        return this.#firstIndex;
    }

    /**
     * [KO] 인덱스 버퍼 기반 렌더링 여부를 반환합니다.
     * [EN] Returns whether rendering is index-buffer based.
     */
    get isIndexed(): boolean {
        return this.#isIndexed;
    }

    /**
     * [KO] 인덱스 버퍼의 `GPUIndexFormat`을 반환합니다.
     * [EN] Returns the `GPUIndexFormat` of the index buffer.
     */
    get indexFormat(): GPUIndexFormat {
        return this.#indexFormat;
    }

    /**
     * [KO] 정점당 바이트 스트라이드를 반환합니다.
     * [EN] Returns the byte stride per vertex.
     */
    get strideBytes(): number {
        return this.#strideBytes;
    }

    /**
     * [KO] 인다이렉트 드로우 버퍼 내 바이트 오프셋을 반환하거나 설정합니다.
     * [EN] Gets or sets the byte offset within the indirect draw buffer.
     */
    get indirectOffsetBytes(): number {
        return this.#indirectOffsetBytes;
    }

    set indirectOffsetBytes(val: number) {
        this.#indirectOffsetBytes = val;
    }

    /**
     * [KO] 컬링된 인스턴스 버퍼 내 시작 인스턴스 오프셋을 반환하거나 설정합니다.
     * [EN] Gets or sets the starting instance offset within the culled instance buffer.
     */
    get instanceBufferOffset(): number {
        return this.#instanceBufferOffset;
    }

    set instanceBufferOffset(val: number) {
        this.#instanceBufferOffset = val;
    }

    /**
     * [KO] 렌더 유닛에 연결된 머티리얼 인스턴스를 반환합니다.
     * [EN] Returns the material instance associated with the render unit.
     */
    get material(): any {
        return this.#material;
    }

    /**
     * [KO] 렌더 유닛의 베이스 컬러 `BitmapTexture`를 반환하거나 설정합니다.
     * [EN] Gets or sets the base color `BitmapTexture` of the render unit.
     */
    get baseColorTexture(): BitmapTexture | null | undefined {
        return this.#baseColorTexture;
    }

    set baseColorTexture(val: BitmapTexture | null | undefined) {
        this.#baseColorTexture = val;
    }

    /**
     * [KO] 이 렌더 유닛이 속한 LOD 레벨 인덱스를 반환합니다.
     * [EN] Returns the LOD level index to which this render unit belongs.
     */
    get lodIndex(): number {
        return this.#lodIndex;
    }

    /**
     * [KO] 알파 마스크(Alpha Cutoff) 머티리얼 사용 여부를 반환합니다.
     * [EN] Returns whether an alpha mask (alpha cutoff) material is used.
     */
    get isMasked(): boolean {
        return this.#isMasked;
    }

    /**
     * [KO] 전달된 렌더 패스 또는 렌더 번들 인코더에 `drawIndexedIndirect` 명령을 기록합니다.
     * [EN] Records a `drawIndexedIndirect` command onto the provided render pass or render bundle encoder.
     *
     * @param passEncoder -
     * [KO] 드로우 명령을 기록할 렌더 패스 인코더 또는 렌더 번들 인코더
     * [EN] Render pass encoder or render bundle encoder on which to record the draw command
     * @param indirectGPUBuffer -
     * [KO] 인다이렉트 드로우 인자가 담긴 `GPUBuffer`
     * [EN] `GPUBuffer` containing indirect draw arguments
     * @param offsetBytes -
     * [KO] 인다이렉트 버퍼 내 바이트 오프셋 (생략 시 `indirectOffsetBytes` 사용)
     * [EN] Byte offset within the indirect buffer (uses `indirectOffsetBytes` if omitted)
     */
    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes ?? this.#indirectOffsetBytes;
        passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
    }

    /**
     * [KO] 렌더 유닛이 참조하는 `Geometry` 리소스를 파기합니다.
     * [EN] Destroys the `Geometry` resource referenced by the render unit.
     */
    destroy(): void {
        this.#geometry.destroy();
    }
}

Object.freeze(ScatterRenderUnit);
export default ScatterRenderUnit;
