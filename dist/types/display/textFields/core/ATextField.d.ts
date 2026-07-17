import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 텍스트 필드의 스타일링 속성을 정의하는 인터페이스
 * [EN] Interface defining the styling properties of a text field
 */
interface ATextField {
    /**
     * [KO] 글자 크기 (픽셀 단위 또는 CSS 단위)
     * [EN] Font size (in pixels or CSS units)
     */
    fontSize: number;
    /**
     * [KO] 글꼴 패밀리
     * [EN] Font family
     */
    fontFamily: string;
    /**
     * [KO] 글자 굵기 (예: 'bold', 'normal', '100'~'900')
     * [EN] Font weight (e.g., 'bold', 'normal', '100'~'900')
     */
    fontWeight: string;
    /**
     * [KO] 글자 스타일 (예: 'italic', 'normal')
     * [EN] Font style (e.g., 'italic', 'normal')
     */
    fontStyle: string;
    /**
     * [KO] 글자 색상 (CSS 색상 값)
     * [EN] Text color (CSS color value)
     */
    color: string;
    /**
     * [KO] 배경 스타일 (CSS background 값)
     * [EN] Background style (CSS background value)
     */
    background: string;
    /**
     * [KO] 패딩 크기 (픽셀 단위)
     * [EN] Padding size (in pixels)
     */
    padding: number;
    /**
     * [KO] 자간 설정 (픽셀 단위)
     * [EN] Letter spacing (in pixels)
     */
    letterSpacing: number;
    /**
     * [KO] 줄바꿈 방식 (예: 'break-all', 'keep-all')
     * [EN] Word break style (e.g., 'break-all', 'keep-all')
     */
    wordBreak: string;
    /**
     * [KO] 수직 정렬 방식 (예: 'middle', 'top', 'bottom')
     * [EN] Vertical alignment (e.g., 'middle', 'top', 'bottom')
     */
    verticalAlign: string;
    /**
     * [KO] 텍스트 정렬 방식 (예: 'center', 'left', 'right')
     * [EN] Text alignment (e.g., 'center', 'left', 'right')
     */
    textAlign: string;
    /**
     * [KO] 줄 높이 배수 또는 크기
     * [EN] Line height multiplier or size
     */
    lineHeight: number;
    /**
     * [KO] 테두리 설정 (CSS border 값)
     * [EN] Border setting (CSS border value)
     */
    border: string;
    /**
     * [KO] 테두리 둥글기 크기 (픽셀 단위 또는 CSS 값)
     * [EN] Border radius (in pixels or CSS value)
     */
    borderRadius: number | string;
    /**
     * [KO] 그림자 설정 (CSS box-shadow 값)
     * [EN] Box shadow setting (CSS box-shadow value)
     */
    boxShadow: string;
    /**
     * [KO] 박스 크기 기준 설정 (예: 'border-box', 'content-box')
     * [EN] Box sizing method (e.g., 'border-box', 'content-box')
     */
    boxSizing: string;
    /**
     * [KO] 필터 효과 (CSS filter 값)
     * [EN] Filter effect (CSS filter value)
     */
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
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [TextField2D Basic Example](/RedGPU/examples/2d/textField2D/basic/)
 * @see [TextField2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 * @see [TextField3D Basic Example](/RedGPU/examples/3d/textField/textField3D/)
 * @see [TextField3D Compare (World vs Pixel)](/RedGPU/examples/3d/textField/textField3DCompare/)
 * @see [TextField3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
 *
 * @category Core
 */
declare class ATextField extends Mesh {
    #private;
    /**
     * [KO] ATextField 인스턴스를 생성합니다.
     * [EN] Creates a new ATextField instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param imgOnload -
     * [KO] 이미지 생성 완료 후 가로/세로 해상도 동기화를 위한 콜백 함수
     * [EN] Callback function for syncing width/height resolution after image creation is complete
     * @param mode3dYn -
     * [KO] 3D 공간용 텍스처(선형 필터 적용)로 생성할지 여부
     * [EN] Whether to generate as a texture for 3D space (linear filter applied)
     */
    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn?: boolean);
    /**
     * [KO] 표시할 텍스트를 반환합니다.
     * [EN] Returns the text to display.
     */
    get text(): string;
    /**
     * [KO] 표시할 텍스트를 설정합니다. 줄바꿈(`\n` 또는 `<br/>`)을 인식하여 처리합니다.
     * [EN] Sets the text to display. Recognizes and handles line breaks (`\n` or `<br/>`).
     * @param text -
     * [KO] 표시할 텍스트 문자열
     * [EN] Text string to display
     */
    set text(text: string);
    /**
     * [KO] 매 프레임마다 텍스트 필드를 렌더링하고, 필요 시 비트맵 텍스처를 갱신합니다.
     * [EN] Renders the text field every frame, updating the bitmap texture if needed.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] ATextField 인스턴스를 파괴하고 사용 중인 DOM 엘리먼트와 Object URL 등의 리소스를 해제합니다.
     * [EN] Destroys the ATextField instance and releases resources such as the DOM elements and Object URLs in use.
     */
    destroy(): void;
}
export default ATextField;
