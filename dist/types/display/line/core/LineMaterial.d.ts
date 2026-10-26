import RedGPUContext from "../../../context/RedGPUContext";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
/**
 * [KO] `Line2D` 및 `Line3D`의 정점 색상을 렌더링하기 위한 라인 전용 재질 클래스입니다.
 * [EN] Dedicated line material class for rendering vertex colors of `Line2D` and `Line3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const material = line.material;
 * ```
 *
 * @category Line
 */
declare class LineMaterial extends ABaseMaterial {
    /**
     * [KO] `LineMaterial` 인스턴스를 생성합니다.
     * [EN] Creates a `LineMaterial` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param name -
     * [KO] 재질 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, name?: string);
}
export default LineMaterial;
