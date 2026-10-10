/**
 * [KO] 스캐터 시스템(잔디, 식생 등)에서 WebGPU 간접 드로우(Indirect Draw)를 수행하는 지오메트리 버퍼와 머티리얼, 텍스처, 원본 메시 참조를 결합한 공용 최소 렌더 단위(Render Unit) 모듈입니다.
 * [EN] Common minimal render unit module combining WebGPU indirect draw geometry buffers with material, texture, and source mesh references across scatter systems (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

/**
 * [KO] ScatterRenderUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for ScatterRenderUnit.
 */
export interface ScatterRenderUnitInitOptions {
    /**
     * [KO] WebGPU 버텍스 및 인덱스 버퍼를 포함하는 지오메트리 객체
     * [EN] Geometry object containing WebGPU vertex and index buffers
     */
    geometry: Geometry;

    /**
     * [KO] 지오메트리의 정점 수 (생략 시 geometry.vertexBuffer.vertexCount로부터 자동 계산)
     * [EN] Number of vertices in the geometry (auto-computed from geometry.vertexBuffer.vertexCount if omitted)
     */
    vertexCount?: number;

    /**
     * [KO] 지오메트리의 인덱스 수 (생략 시 geometry.indexBuffer.indexCount 또는 vertexCount로부터 자동 계산)
     * [EN] Number of indices in the geometry (auto-computed from indexBuffer.indexCount or vertexCount if omitted)
     */
    indexCount?: number;

    /**
     * [KO] 인덱스 버퍼를 사용하는지 여부 (생략 시 !!geometry.indexBuffer로부터 자동 계산)
     * [EN] Whether an index buffer is used (auto-computed from !!geometry.indexBuffer if omitted)
     */
    isIndexed?: boolean;

    /**
     * [KO] 인덱스 포맷 (기본값: 'uint32')
     * [EN] Index format (default: 'uint32')
     */
    indexFormat?: GPUIndexFormat;

    /**
     * [KO] 버텍스 스트라이드 바이트 크기 (생략 시 geometry.vertexBuffer.stride * 4 또는 72바이트 기본값 적용)
     * [EN] Vertex stride in bytes (auto-computed from geometry.vertexBuffer.stride * 4 or 72 bytes if omitted)
     */
    strideBytes?: number;

    /**
     * [KO] GPU 인디렉트 버퍼 내 해당 렌더 단위의 바이트 오프셋
     * [EN] Byte offset of this render unit within the GPU indirect buffer
     */
    indirectOffsetBytes?: number;

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋
     * [EN] Instance offset within the instance buffer
     */
    instanceBufferOffset?: number;

    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋 (기본값: 0)
     * [EN] Starting index offset within index buffer (default: 0)
     */
    firstIndex?: number;

    /**
     * [KO] 렌더 단위에 적용된 재질(Material) 인스턴스
     * [EN] Material instance applied to the render unit
     */
    material?: any;

    /**
     * [KO] 렌더 단위의 기본 디퓨즈/베이스 컬러 텍스처
     * [EN] Primary diffuse/base color texture of the render unit
     */
    baseColorTexture?: BitmapTexture | null;

    /**
     * [KO] 피벗 보정을 위한 밑둥 Y 오프셋 (기본값: 0.0)
     * [EN] Bottom Y offset for pivot compensation (default: 0.0)
     */
    bottomOffset?: number;

    /**
     * [KO] 소속 LOD 레벨 인덱스
     * [EN] Associated LOD level index
     */
    lodIndex?: number;

    /**
     * [KO] 알파 마스킹 여부
     * [EN] Whether alpha masking is applied
     */
    isMasked?: boolean;
}

/**
 * [KO] WebGPU 지오메트리 버퍼 관리, 간접 드로우 인자(`drawIndexedIndirect`), 재질(Material), 텍스처 메타데이터를 결합한 스캐터 공용 최소 렌더 단위 기본 클래스입니다.
 * [EN] Common scatter minimal render unit base class combining WebGPU geometry buffer management, indirect draw arguments (`drawIndexedIndirect`), material, and texture metadata.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **지오메트리와 셰이딩의 완전한 단일화 (SSOT)**: 순수 GPU 버퍼(버텍스/인덱스 버퍼 및 간접 드로우 오프셋) 관리와 렌더링에 필요한 머티리얼, 베이스 컬러 텍스처를 단일 클래스에서 일원화하여 관리합니다.
 * - **간접 드로우(Multi-Draw Indirect) 인프라**: 스캐터 메가버퍼 규약에 맞추어 `drawIndexedIndirect` 명령을 고속으로 인코딩합니다.
 * - **스캐터 파이프라인의 공통 단위**:
 *   - **잔디(Grass)**: 단일 또는 복합 잔디 모델을 구성하는 기본 렌더 단위로 직접 인스턴스화되어 Multi-Draw Indirect 렌더링에 사용됩니다.
 *   - **식생(Foliage)**: 복합 3D 수목/바위의 통합 렌더 단위(`FoliageRenderUnit`)의 기반 클래스로 상속되어, 바람(Wind) 시뮬레이션 및 UBO 슬롯 풀링을 확장하는 기반이 됩니다.
 *
 * **[EN] Architecture & Role:**
 * - **Complete Unification of Geometry and Shading (SSOT)**: Unifies raw GPU buffer management (vertex/index buffers, indirect draw offsets) with materials and base color textures in a single class.
 * - **Multi-Draw Indirect Infrastructure**: Encodes `drawIndexedIndirect` commands conforming to the scatter mega-buffer layout.
 * - **Common Unit for Scatter Pipelines**:
 *   - **Grass**: Directly instantiated as the primary rendering unit composing single or composite grass models for Multi-Draw Indirect rendering.
 *   - **Foliage**: Inherited by `FoliageRenderUnit` representing individual/shadow parts of composite 3D trees and rocks, serving as the foundation for wind simulation and UBO slot pooling.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager 및 Grass)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager and Grass).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class ScatterRenderUnit {
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
     * [KO] ScatterRenderUnit 인스턴스를 생성하고 버퍼 파라미터 및 렌더링 메타데이터를 초기화합니다.
     * [EN] Creates a ScatterRenderUnit instance and initializes buffer parameters and rendering metadata.
     *
     * @param init -
     * [KO] 렌더 단위 초기화 옵션 객체
     * [EN] Render unit initialization options object
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
        } = init;

        const {vertexBuffer, indexBuffer} = geometry;
        const vertexCount = init.vertexCount ?? vertexBuffer.vertexCount ?? 0;
        const isIndexed = init.isIndexed ?? !!indexBuffer;
        const indexCount = init.indexCount ?? indexBuffer?.indexCount ?? vertexCount;
        const strideBytes = init.strideBytes ?? (vertexBuffer.stride ? vertexBuffer.stride * 4 : 72);

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
     * [KO] 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the geometry instance.
     */
    get geometry(): Geometry {
        return this.#geometry;
    }

    /**
     * [KO] 지오메트리의 정점 수를 반환합니다.
     * [EN] Returns the vertex count of the geometry.
     */
    get vertexCount(): number {
        return this.#vertexCount;
    }

    /**
     * [KO] 지오메트리의 인덱스 수를 반환합니다.
     * [EN] Returns the index count of the geometry.
     */
    get indexCount(): number {
        return this.#indexCount;
    }

    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋을 반환합니다.
     * [EN] Returns the starting index offset within the index buffer.
     */
    get firstIndex(): number {
        return this.#firstIndex;
    }

    /**
     * [KO] 인덱스 버퍼 사용 여부를 반환합니다.
     * [EN] Returns whether an index buffer is used.
     */
    get isIndexed(): boolean {
        return this.#isIndexed;
    }

    /**
     * [KO] 인덱스 포맷을 반환합니다.
     * [EN] Returns the index format.
     */
    get indexFormat(): GPUIndexFormat {
        return this.#indexFormat;
    }

    /**
     * [KO] 버텍스 스트라이드(바이트 단위)를 반환합니다.
     * [EN] Returns the vertex stride in bytes.
     */
    get strideBytes(): number {
        return this.#strideBytes;
    }

    /**
     * [KO] GPU 인디렉트 버퍼 내 바이트 오프셋을 반환합니다.
     * [EN] Returns the byte offset within the GPU indirect buffer.
     */
    get indirectOffsetBytes(): number {
        return this.#indirectOffsetBytes;
    }

    /**
     * [KO] GPU 인디렉트 버퍼 내 바이트 오프셋을 설정합니다.
     * [EN] Sets the byte offset within the GPU indirect buffer.
     */
    set indirectOffsetBytes(val: number) {
        this.#indirectOffsetBytes = val;
    }

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋을 반환합니다.
     * [EN] Returns the instance offset within the instance buffer.
     */
    get instanceBufferOffset(): number {
        return this.#instanceBufferOffset;
    }

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋을 설정합니다.
     * [EN] Sets the instance offset within the instance buffer.
     */
    set instanceBufferOffset(val: number) {
        this.#instanceBufferOffset = val;
    }

    /**
     * [KO] 렌더 단위의 머티리얼 객체를 반환합니다.
     * [EN] Returns the material object of the render unit.
     */
    get material(): any {
        return this.#material;
    }

    /**
     * [KO] 베이스 컬러 텍스처를 반환합니다.
     * [EN] Returns the base color texture.
     */
    get baseColorTexture(): BitmapTexture | null | undefined {
        return this.#baseColorTexture;
    }

    /**
     * [KO] 베이스 컬러 텍스처를 설정합니다.
     * [EN] Sets the base color texture.
     */
    set baseColorTexture(val: BitmapTexture | null | undefined) {
        this.#baseColorTexture = val;
    }

    /**
     * [KO] 소속 LOD 레벨 인덱스를 반환합니다.
     * [EN] Returns the associated LOD level index.
     */
    get lodIndex(): number {
        return this.#lodIndex;
    }

    /**
     * [KO] 알파 마스킹 적용 여부를 반환합니다.
     * [EN] Returns whether alpha masking is applied.
     */
    get isMasked(): boolean {
        return this.#isMasked;
    }

    /**
     * [KO] 인디렉트 버퍼를 기반으로 GPU 인덱스 간접 드로우 명령(`drawIndexedIndirect`)을 인코딩합니다.
     * [EN] Encodes the GPU indexed indirect draw command (`drawIndexedIndirect`) based on the indirect buffer.
     *
     * @param passEncoder - 렌더 패스 엔코더 또는 렌더 번들 엔코더
     * @param indirectGPUBuffer - 간접 드로우 인자가 포함된 GPU 버퍼
     * @param offsetBytes - 간접 드로우 인자 오프셋(바이트). 생략 시 기본 `indirectOffsetBytes` 사용.
     */
    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes !== undefined ? offsetBytes : this.#indirectOffsetBytes;
        passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
    }

    /**
     * [KO] 지오메트리 및 렌더 유닛 리소스를 해제합니다.
     * [EN] Destroys the geometry and render unit resources.
     */
    destroy(): void {
        this.#geometry?.destroy();
    }
}

Object.freeze(ScatterRenderUnit);
export default ScatterRenderUnit;
