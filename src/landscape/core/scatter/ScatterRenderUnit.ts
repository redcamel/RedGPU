/**
 * [KO] 스캐터 시스템(잔디, 식생 등)에서 머티리얼, 텍스처, 원본 메시 참조 및 지형 피벗 오프셋을 결합한 공용 렌더 단위(Render Unit) 모듈입니다.
 * [EN] Common render unit module combining material, texture, source mesh reference, and terrain pivot offsets across scatter systems (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import Mesh from "../../../display/mesh/Mesh";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import AScatterGeometryUnit, {type AScatterGeometryUnitInitOptions} from "./AScatterGeometryUnit";

/**
 * [KO] ScatterRenderUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for ScatterRenderUnit.
 */
export interface ScatterRenderUnitInitOptions extends AScatterGeometryUnitInitOptions {
    /**
     * [KO] 원본 3D 메쉬 노드
     * [EN] Original 3D mesh node
     */
    mesh?: Mesh;

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
 * [KO] WebGPU 지오메트리 버퍼 단위(`AScatterGeometryUnit`)에 재질(Material), 텍스처, 원본 메쉬 메타데이터를 결합한 스캐터 공용 렌더 단위 기본 클래스입니다.
 * [EN] Common scatter render unit base class combining a WebGPU geometry buffer unit (`AScatterGeometryUnit`) with material, texture, and original mesh metadata.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **지오메트리와 셰이딩의 융합**: 순수 GPU 버퍼(버텍스/인덱스 버퍼 및 간접 드로우 오프셋)를 관리하는 `AScatterGeometryUnit` 위에 실제 렌더링에 필요한 머티리얼, 베이스 컬러 텍스처, 원본 메쉬 참조를 바인딩합니다.
 * - **스캐터 파이프라인의 공통 단위**:
 *   - **잔디(Grass)**: 단일 또는 복합 잔디 모델을 구성하는 기본 렌더 단위로 직접 인스턴스화되어 Multi-Draw Indirect 렌더링에 사용됩니다.
 *   - **식생(Foliage)**: 복합 3D 수목/바위의 파트별 렌더 단위(`FoliageRenderUnit`)의 부모 클래스로 상속되어, 바람(Wind) 시뮬레이션 및 지면 블렌딩 유니폼을 확장하는 기반이 됩니다.
 *
 * **[EN] Architecture & Role:**
 * - **Fusion of Geometry and Shading**: Binds the rendering materials, base color textures, and source mesh references on top of `AScatterGeometryUnit`, which manages raw GPU vertex/index buffers and indirect draw offsets.
 * - **Common Unit for Scatter Pipelines**:
 *   - **Grass**: Directly instantiated as the primary rendering unit composing single or composite grass models for Multi-Draw Indirect rendering.
 *   - **Foliage**: Inherited by `FoliageRenderUnit` representing individual parts (trunks, foliage leaves) of composite 3D trees and rocks, serving as the foundation for wind simulation and ground blending uniforms.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager 및 Grass)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager and Grass).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class ScatterRenderUnit extends AScatterGeometryUnit {
    #mesh?: Mesh;
    #material?: any;
    #baseColorTexture?: BitmapTexture | null;
    #lodIndex: number;
    #isMasked: boolean;

    /**
     * [KO] ScatterRenderUnit 인스턴스를 생성하고 렌더링 메타데이터를 초기화합니다.
     * [EN] Creates a ScatterRenderUnit instance and initializes rendering metadata.
     *
     * @param init -
     * [KO] 렌더 단위 초기화 옵션 객체
     * [EN] Render unit initialization options object
     */
    constructor(init: ScatterRenderUnitInitOptions) {
        super(init);
        const {
            mesh,
            material,
            baseColorTexture = null,
            lodIndex = 0,
            isMasked = false
        } = init;
        this.#mesh = mesh;
        this.#material = material;
        this.#baseColorTexture = baseColorTexture;
        this.#lodIndex = lodIndex;
        this.#isMasked = isMasked;
    }

    /**
     * [KO] 원본 메쉬 인스턴스를 반환합니다.
     * [EN] Returns the original mesh instance.
     */
    get mesh(): Mesh | undefined {
        return this.#mesh;
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
}

Object.freeze(ScatterRenderUnit);
export default ScatterRenderUnit;
