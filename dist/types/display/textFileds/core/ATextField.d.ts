import RedGPUContext from "../../../context/RedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import Mesh from "../../mesh/Mesh";
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
 * 텍스트 필드 객체의 추상 클래스입니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 *
 * @abstract
 */
declare class ATextField extends Mesh {
    #private;
    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn?: boolean);
    get text(): string;
    set text(text: string);
    render(renderViewStateData: RenderViewStateData): void;
}
export default ATextField;
