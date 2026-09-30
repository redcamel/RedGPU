import Mesh from "../../../display/mesh/Mesh";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import AScatterGeometryUnit, {type AScatterGeometryUnitInitOptions} from "./AScatterGeometryUnit";

/**
 * [KO] ScatterSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for ScatterSubMesh.
 */
export interface ScatterSubMeshInitOptions extends AScatterGeometryUnitInitOptions {
    /**
     * [KO] 원본 3D 메쉬 노드
     * [EN] Original 3D mesh node
     */
    mesh?: Mesh;

    /**
     * [KO] 서브메쉬에 적용된 재질(Material) 인스턴스
     * [EN] Material instance applied to the sub-mesh
     */
    material?: any;

    /**
     * [KO] 서브메쉬의 기본 디퓨즈/베이스 컬러 텍스처
     * [EN] Primary diffuse/base color texture of the sub-mesh
     */
    baseColorTexture?: BitmapTexture | null;

    /**
     * [KO] 피벗 보정을 위한 밑둥 Y 오프셋 (기본값: 0.0)
     * [EN] Bottom Y offset for pivot compensation (default: 0.0)
     */
    bottomOffset?: number;
}

/**
 * [KO] WebGPU 지오메트리 버퍼 단위(`AScatterGeometryUnit`)에 재질(Material), 텍스처, 원본 메쉬 메타데이터를 결합한 스캐터 공용 서브메쉬 기본 클래스입니다.
 * [EN] Common scatter sub-mesh base class combining a WebGPU geometry buffer unit (`AScatterGeometryUnit`) with material, texture, and original mesh metadata.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **지오메트리와 셰이딩의 융합**: 순수 GPU 버퍼(버텍스/인덱스 버퍼 및 간접 드로우 오프셋)를 관리하는 `AScatterGeometryUnit` 위에 실제 렌더링에 필요한 머티리얼, 베이스 컬러 텍스처, 원본 메쉬 참조를 바인딩합니다.
 * - **스캐터 파이프라인의 공통 단위**:
 *   - **잔디(Grass)**: 단일 또는 복합 잔디 모델을 구성하는 기본 렌더 단위로 직접 인스턴스화되어 Multi-Draw Indirect 렌더링에 사용됩니다.
 *   - **식생(Foliage)**: 복합 3D 수목/바위의 파트별 서브메시(`FoliageSubMesh`)의 부모 클래스로 상속되어, 바람(Wind) 시뮬레이션 및 지면 블렌딩 유니폼을 확장하는 기반이 됩니다.
 * - **지형 밀착을 위한 피벗 보정**: `bottomOffset` 속성을 통해 모델의 지면 접촉면(최하단 Y)을 정밀하게 보정하여 지형 표면에 부유하거나 묻히지 않도록 배치합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Fusion of Geometry and Shading**: Binds the rendering materials, base color textures, and source mesh references on top of `AScatterGeometryUnit`, which manages raw GPU vertex/index buffers and indirect draw offsets.
 * - **Common Unit for Scatter Pipelines**:
 *   - **Grass**: Directly instantiated as the primary rendering unit composing single or composite grass models for Multi-Draw Indirect rendering.
 *   - **Foliage**: Inherited by `FoliageSubMesh` representing individual parts (trunks, foliage leaves) of composite 3D trees and rocks, serving as the foundation for wind simulation and ground blending uniforms.
 * - **Pivot Alignment for Terrain Snapping**: Compensates for the model's ground contact plane (minimum Y) via the `bottomOffset` property, ensuring accurate placement on the landscape surface without floating or sinking.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager 및 Grass)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager and Grass).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class ScatterSubMesh extends AScatterGeometryUnit {
    #mesh?: Mesh;
    #material?: any;
    #baseColorTexture?: BitmapTexture | null;
    #bottomOffset: number;

    constructor(init: ScatterSubMeshInitOptions) {
        super(init);
        this.#mesh = init.mesh;
        this.#material = init.material;
        this.#baseColorTexture = init.baseColorTexture ?? null;
        this.#bottomOffset = init.bottomOffset ?? 0.0;
    }

    /**
     * [KO] 원본 메쉬 인스턴스를 반환합니다.
     * [EN] Returns the original mesh instance.
     */
    get mesh(): Mesh | undefined {
        return this.#mesh;
    }

    /**
     * [KO] 서브메쉬의 머티리얼 객체를 반환합니다.
     * [EN] Returns the material object of the sub-mesh.
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
     * [KO] 피벗 보정을 위한 밑둥 Y 오프셋을 반환합니다.
     * [EN] Returns the bottom Y offset for pivot compensation.
     */
    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    /**
     * [KO] 피벗 보정을 위한 밑둥 Y 오프셋을 설정합니다.
     * [EN] Sets the bottom Y offset for pivot compensation.
     */
    set bottomOffset(val: number) {
        this.#bottomOffset = val;
    }
}

Object.freeze(ScatterSubMesh);
export default ScatterSubMesh;
