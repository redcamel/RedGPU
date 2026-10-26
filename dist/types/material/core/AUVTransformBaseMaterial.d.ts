import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "./ABitmapBaseMaterial";
/**
 * [KO] 텍스처 UV 변환(Offset, Scale) 기능을 제공하는 추상 머티리얼 클래스입니다.
 * [EN] Abstract material class providing texture UV transformation (Offset, Scale) functionality.
 *
 * [KO] 비트맵 기반 머티리얼에서 텍스처의 오프셋 이동과 타일링 배율을 제어하며, 변환 연산은 버텍스 셰이더 단계에서 처리됩니다.
 * [EN] Controls texture offset translation and tiling scale in bitmap-based materials, with transformation calculations processed at the vertex shader stage.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] AUVTransformBaseMaterial을 상속받은 머티리얼에서 UV 변환 설정
 * // [EN] Configure UV transform on a material inheriting from AUVTransformBaseMaterial
 * material.textureOffset = [0.1, 0.1];
 * material.textureScale = [2.0, 2.0];
 * ```
 * <iframe src="/RedGPU/examples/3d/material/uvTransform/" style="width:100%; height:500px;"></iframe>
 *
 * @category Material
 */
declare abstract class AUVTransformBaseMaterial extends ABitmapBaseMaterial {
    #private;
    /**
     * [KO] 텍스처 UV 변환 정보 변경 여부 플래그
     * [EN] Flag indicating whether texture UV transform information has changed
     */
    dirtyTextureTransform: boolean;
    /**
     * [KO] AUVTransformBaseMaterial 인스턴스를 초기화합니다.
     * [EN] Initializes an AUVTransformBaseMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈 이름
     * [EN] Material module name
     * @param fragmentSource -
     * [KO] 프래그먼트 셰이더 WGSL 소스 코드
     * [EN] Fragment shader WGSL source code
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 타겟 인덱스
     * [EN] Bind group target index
     */
    protected constructor(redGPUContext: RedGPUContext, moduleName: string, fragmentSource: string, targetGroupIndex: number);
    /**
     * [KO] 텍스처 UV 오프셋 `[u, v]`를 반환하거나 설정합니다.
     * [EN] Returns or sets the texture UV offset `[u, v]`.
     *
     * @returns
     * [KO] UV 오프셋 튜플 `[u, v]` (기본값: `[0, 0]`)
     * [EN] UV offset tuple `[u, v]` (default: `[0, 0]`)
     */
    get textureOffset(): [number, number];
    set textureOffset(value: [number, number]);
    /**
     * [KO] 텍스처 UV 타일링 스케일 `[u, v]`를 반환하거나 설정합니다.
     * [EN] Returns or sets the texture UV tiling scale `[u, v]`.
     *
     * @returns
     * [KO] UV 스케일 튜플 `[u, v]` (기본값: `[1, 1]`)
     * [EN] UV scale tuple `[u, v]` (default: `[1, 1]`)
     */
    get textureScale(): [number, number];
    set textureScale(value: [number, number]);
}
export default AUVTransformBaseMaterial;
