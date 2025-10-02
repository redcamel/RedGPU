import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import ABaseMaterial from "../core/ABaseMaterial";
interface ColorMaterial {
    /**
     * 머티리얼의 단색 컬러(ColorRGB)
     */
    color: ColorRGB;
}
/**
 * 단색(솔리드 컬러) 렌더링을 위한 머티리얼 클래스입니다.
 * ColorRGB 기반의 색상 지정이 가능하며, GPU 파이프라인에서 단일 색상으로 오브젝트를 렌더링할 때 사용합니다.
 *
 * @example
 * ```javascript
 * const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/colorMaterial/"></iframe>
 *
 * @extends ABaseMaterial
 * @category Material
 *
 */
declare class ColorMaterial extends ABaseMaterial {
    /**
     * ColorMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param color - HEX 문자열 또는 컬러 코드(기본값: '#fff')
     */
    constructor(redGPUContext: RedGPUContext, color?: string);
}
export default ColorMaterial;
