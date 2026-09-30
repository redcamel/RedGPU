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
 * [KO] WebGPU 지오메트리 버퍼 단위(AScatterGeometryUnit)에 재질(Material), 텍스처, 원본 메쉬 메타데이터를 결합한 스캐터 공용 서브메쉬 기본 클래스입니다.
 * [EN] Common scatter sub-mesh base class combining WebGPU geometry buffer unit (AScatterGeometryUnit) with material, texture, and original mesh metadata.
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
