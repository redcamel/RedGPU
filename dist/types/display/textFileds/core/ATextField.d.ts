import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
interface ATextField {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    background: string;
    padding: number;
    letterSpacing: number;
    wordBreak: string;
    verticalAlign: string;
    textAlign: string;
    lineHeight: number;
    border: string;
    boxShadow: string;
    boxSizing: string;
    filter: string;
}
/**
 * [KO] 텍스트 필드 객체의 추상 베이스 클래스입니다.
 * [EN] Abstract base class for text field objects.
 *
 * [KO] HTML/SVG를 이용하여 텍스트를 비트맵 텍스처로 변환하고, 이를 메시의 디퓨즈 텍스처로 사용하는 공통 로직을 포함합니다.
 * [EN] Includes common logic for converting text to bitmap textures using HTML/SVG and using them as diffuse textures for meshes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
 *
 * @category Core
 */
declare class ATextField extends Mesh {
    #private;
    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn?: boolean);
    get text(): string;
    set text(text: string);
    render(renderViewStateData: RenderViewStateData): void;
}
export default ATextField;
