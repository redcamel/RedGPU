import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 텍스트 필드의 CSS 스타일링 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining CSS styling properties of a text field.
 *
 * @category Core
 */
interface ATextField {
    /**
     * [KO] 글자 크기 (픽셀 단위)
     * [EN] Font size (in pixels)
     */
    fontSize: number;
    /**
     * [KO] 글꼴 패밀리
     * [EN] Font family
     */
    fontFamily: string;
    /**
     * [KO] 글자 굵기 (예: `'normal'`, `'bold'`, `'100'`~`'900'`)
     * [EN] Font weight (e.g., `'normal'`, `'bold'`, `'100'`~`'900'`)
     */
    fontWeight: string;
    /**
     * [KO] 글자 스타일 (예: `'normal'`, `'italic'`)
     * [EN] Font style (e.g., `'normal'`, `'italic'`)
     */
    fontStyle: string;
    /**
     * [KO] 글자 색상 (CSS 색상 값)
     * [EN] Text color (CSS color value)
     */
    color: string;
    /**
     * [KO] 배경 스타일 (CSS `background` 값)
     * [EN] Background style (CSS `background` value)
     */
    background: string;
    /**
     * [KO] 내부 여백 크기 (픽셀 단위)
     * [EN] Padding size (in pixels)
     */
    padding: number;
    /**
     * [KO] 자간 크기 (픽셀 단위)
     * [EN] Letter spacing (in pixels)
     */
    letterSpacing: number;
    /**
     * [KO] 줄바꿈 기준 (예: `'keep-all'`, `'break-all'`)
     * [EN] Word break behavior (e.g., `'keep-all'`, `'break-all'`)
     */
    wordBreak: string;
    /**
     * [KO] 수직 정렬 방식 (예: `'middle'`, `'top'`, `'bottom'`)
     * [EN] Vertical alignment (e.g., `'middle'`, `'top'`, `'bottom'`)
     */
    verticalAlign: string;
    /**
     * [KO] 수평 텍스트 정렬 방식 (예: `'center'`, `'left'`, `'right'`)
     * [EN] Horizontal text alignment (e.g., `'center'`, `'left'`, `'right'`)
     */
    textAlign: string;
    /**
     * [KO] 줄 높이 배수
     * [EN] Line height multiplier
     */
    lineHeight: number;
    /**
     * [KO] 테두리 스타일 (CSS `border` 값)
     * [EN] Border style (CSS `border` value)
     */
    border: string;
    /**
     * [KO] 테두리 모서리 반경 (픽셀 단위 또는 CSS 값)
     * [EN] Border radius (in pixels or CSS value)
     */
    borderRadius: number | string;
    /**
     * [KO] 박스 그림자 스타일 (CSS `box-shadow` 값)
     * [EN] Box shadow style (CSS `box-shadow` value)
     */
    boxShadow: string;
    /**
     * [KO] 박스 크기 산정 기준 (예: `'border-box'`, `'content-box'`)
     * [EN] Box sizing model (e.g., `'border-box'`, `'content-box'`)
     */
    boxSizing: string;
    /**
     * [KO] 그래픽 필터 효과 (CSS `filter` 값)
     * [EN] Graphical filter effect (CSS `filter` value)
     */
    filter: string;
}
/**
 * [KO] HTML/SVG를 이용해 텍스트를 비트맵 텍스처로 변환하고 렌더링하는 텍스트 필드 추상 클래스입니다.
 * [EN] Abstract text field class that converts text into a bitmap texture using HTML/SVG and renders it.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [TextField2D Basic Example](/RedGPU/examples/2d/textField2D/basic/)
 * @see [TextField2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 * @see [TextField3D Basic Example](/RedGPU/examples/3d/textField/textField3D/)
 * @see [TextField3D Compare (World vs Pixel)](/RedGPU/examples/3d/textField/textField3DCompare/)
 * @see [TextField3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
 * @category Core
 */
declare class ATextField extends Mesh {
    #private;
    /**
     * [KO] ATextField 인스턴스를 초기화합니다.
     * [EN] Initializes an ATextField instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param imgOnload -
     * [KO] 텍스트 텍스처 생성 완료 후 가로/세로 크기 동기화 콜백 함수
     * [EN] Callback function to synchronize width and height after text texture creation
     * @param mode3dYn -
     * [KO] 3D 모드 여부 (`true`일 경우 선형 필터링 적용, 기본값: `true`)
     * [EN] Whether in 3D mode (applies linear filtering if `true`, default: `true`)
     */
    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn?: boolean);
    /**
     * [KO] 표시할 텍스트 문자열을 반환하거나 설정합니다. `<br/>` 태그를 줄바꿈으로 처리합니다.
     * [EN] Returns or sets the text string to display. Processes `<br/>` tags as line breaks.
     *
     * @returns
     * [KO] 현재 설정된 텍스트 문자열
     * [EN] Currently set text string
     */
    get text(): string;
    set text(text: string);
    /**
     * [KO] 텍스트 텍스처 상태를 갱신하고 텍스트 필드를 렌더링합니다.
     * [EN] Updates the text texture state and renders the text field.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더링 상태 데이터
     * [EN] View rendering state data
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 텍스트 필드 인스턴스를 파기하고 내부 DOM 엘리먼트, 텍스처 및 Object URL 리소스를 해제합니다.
     * [EN] Destroys the text field instance and releases internal DOM elements, textures, and Object URL resources.
     */
    destroy(): void;
}
export default ATextField;
