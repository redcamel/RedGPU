import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ATextField from "../core/ATextField";
interface TextField3D {
    useBillboardPerspective: boolean;
    useBillboard: boolean;
}
/**
 * TextField3D 클래스는 3D 공간에서 텍스트를 표현하는 객체입니다.
 *
 * 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다.
 * Billboard 기능을 지원하며, 텍스트 크기에 따라 transform을 자동으로 갱신합니다.
 *
 * @remarks
 * geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 *
 * <iframe src="/RedGPU/examples/3d/textField3D/"></iframe>
 *
 * 아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [TextField3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/textField3D/)
 *
 * @category TextField
 */
declare class TextField3D extends ATextField {
    #private;
    /**
     * TextField3D 생성자입니다.
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param text - 초기 텍스트 문자열
     */
    constructor(redGPUContext: RedGPUContext, text?: string);
    /**
     * 텍스트가 출력되는 지오메트리입니다. Plane으로 고정됩니다.
     * @returns {Geometry | Primitive}
     */
    get geometry(): Geometry | Primitive;
    /**
     * geometry는 외부에서 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive);
    /**
     * 텍스트에 사용되는 머티리얼입니다.
     * @returns 머티리얼 객체
     */
    get material(): any;
    /**
     * material은 외부에서 변경할 수 없습니다.
     */
    set material(value: any);
    /**
     * 렌더링된 텍스트 텍스처의 너비 (정규화된 값)
     * @returns {number}
     */
    get renderTextureWidth(): number;
    /**
     * 렌더링된 텍스트 텍스처의 높이 (정규화된 값)
     * @returns {number}
     */
    get renderTextureHeight(): number;
    /**
     * TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.
     * @returns {GPUShaderModule}
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default TextField3D;
