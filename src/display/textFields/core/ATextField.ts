import RedGPUContext from "../../../context/RedGPUContext";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import TextFieldMaterial from "./textFieldMaterial/TextFieldMaterial";

const TEXT_CONTAINER_STYLE = ';box-sizing:content-box;white-space:nowrap;'

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

const BASE_STYLES = {
    padding: 0,
    background: 'transparent',
    color: '#fff',
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    wordBreak: 'keep-all',
    verticalAlign: 'middle',
    textAlign: 'center',
    borderRadius: 0,
    lineHeight: 1.4,
    border: '',
    boxShadow: 'none',
    boxSizing: 'border-box',
    filter: '',
}
const isValidNumber = (value: any) => typeof value == 'number';
const isPixelNeeded = (key: string) => !['lineHeight', 'fontWeight'].includes(key);

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
class ATextField extends Mesh {
    #textureCvs: OffscreenCanvas | HTMLCanvasElement;
    #textureCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
    #svg: SVGSVGElement;
    #htmlElement: HTMLDivElement;
    #textureImg: HTMLImageElement;
    #text: string
    #textureImgOnload: Function
    #mode3dYn: boolean = true;
    #redGPUContext: RedGPUContext
    #currentRequestAnimationFrame: number;
    #needsUpdate: boolean = false; // 업데이트 플래그
    #renderWidth: number = 1
    #renderHeight: number = 1

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
    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn: boolean = true) {
        super(redGPUContext);
        this.#redGPUContext = redGPUContext
        this.#mode3dYn = mode3dYn
        this.#textureImgOnload = imgOnload
        this._material = new TextFieldMaterial(redGPUContext)
        this._material.transparent = true
        if (mode3dYn) {
            this._material.diffuseTextureSampler = new Sampler(redGPUContext, {
                minFilter: GPU_FILTER_MODE.LINEAR,
                magFilter: GPU_FILTER_MODE.LINEAR,
                mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR
            })
        } else {
            this._material.diffuseTextureSampler = new Sampler(redGPUContext, {
                minFilter: GPU_FILTER_MODE.NEAREST,
                magFilter: GPU_FILTER_MODE.NEAREST,
                mipmapFilter: null
            })
        }
        this.depthStencilState.depthWriteEnabled = false
        //
        this.#createCanvasAndContext();
        //
        this.#setHtmlElement()
        this.#setSvgElement()
        this.#setImgElement()
        this.#setBasicStyle()
    }

    /**
     * [KO] 표시할 텍스트를 반환합니다.
     * [EN] Returns the text to display.
     */
    get text() {
        return this.#text;
    }

    /**
     * [KO] 표시할 텍스트를 설정합니다. 줄바꿈(`\n` 또는 `<br/>`)을 인식하여 처리합니다.
     * [EN] Sets the text to display. Recognizes and handles line breaks (`\n` or `<br/>`).
     * @param text -
     * [KO] 표시할 텍스트 문자열
     * [EN] Text string to display
     */
    set text(text: string) {
        if (this.#text === text) return
        this.#text = text
        const svg = this.#svg;
        const htmlContainer = svg.querySelector('foreignObject div');
        const processedText = this.#processText(text)
        this.#htmlElement.innerHTML = processedText;
        htmlContainer.innerHTML = processedText;
        this.#needsUpdate = true
    }

    /**
     * [KO] 매 프레임마다 텍스트 필드를 렌더링하고, 필요 시 비트맵 텍스처를 갱신합니다.
     * [EN] Renders the text field every frame, updating the bitmap texture if needed.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData) {
        // if (this.#renderWidth && this.#renderHeight) {
        this.#textureImgOnload(this.#renderWidth, this.#renderHeight)
        // }
        this.#updateTexture()
        super.render(renderViewStateData);
    }

    #processText(input: string): string {
        return input.toString().replace(/\<br\/>/gi, '<div/>');
    }

    #createCanvasAndContext() {
        if (typeof OffscreenCanvas !== 'undefined') this.#textureCvs = new OffscreenCanvas(100, 100);
        else this.#textureCvs = document.createElement('canvas');
        this.#textureCtx = this.#textureCvs.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    }

    #getRenderHtmlSize() {
        // 요소의 현재 크기 가져오기
        const rect = this.#htmlElement.getBoundingClientRect();
        // 확장 영역 초기화
        let extraLeft = 3, extraRight = 3, extraTop = 3, extraBottom = 3;
        // Box-Shadow와 패딩을 고려한 전체 크기
        const renderedWidth = rect.width + extraLeft + extraRight; // 좌우 확장값 합산
        const renderedHeight = rect.height + extraTop + extraBottom; // 상하 확장값 합산
        // 디버깅용 로그 (패딩 및 최종 크기 확인)
        console.log("Calculated Render Size (Fully Including Box-Shadow):", {
            rectWidth: rect.width,
            rectHeight: rect.height,
            renderedWidth,
            renderedHeight,
            extraLeft,
            extraRight,
            extraTop,
            extraBottom,
        });
        // 최종 값 반환
        return {
            width: Math.ceil(renderedWidth) & ~1,
            height: Math.ceil(renderedHeight) & ~1,
            extraTop,
            extraRight,
            extraBottom,
            extraLeft
        };
    }

    #setSvgToImg() {
        // SVG 업데이트 작업
        const svg = this.#svg;
        const foreignObject = svg.querySelector('foreignObject');
        // 크기 및 Box-Shadow 확장값 계산
        const {width, height, extraTop, extraRight, extraBottom, extraLeft} = this.#getRenderHtmlSize();
        // ForeignObject 크기 설정
        foreignObject.setAttribute('width', width.toString());
        foreignObject.setAttribute('height', height.toString());
        // Box-Shadow 확장을 포함한 패딩 설정
        foreignObject.style.padding = `${extraTop}px ${extraRight}px ${extraBottom}px ${extraLeft}px`;
        // SVG 크기 설정
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        // 데이터를 이미지로 변환
        this.#textureImg.src =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(svg.outerHTML);
        // 디버깅 정보 출력
        console.log("Final SVG and ForeignObject Sizes:", {
            svgWidth: svg.getAttribute('width'),
            svgHeight: svg.getAttribute('height'),
            padding: foreignObject.style.padding,
        });
    }

    #setImgElement() {
        this.#textureImg = new Image();
        this.#textureImg.style.cssText = 'position:absolute;bottom:0px;left:0;'
        this.#textureImg.onload = _ => {
            let tW: number, tH: number;
            const {width, height} = this.#getRenderHtmlSize();
            const multiple = window.devicePixelRatio === 1 ? 2 : window.devicePixelRatio;
            tW = width * multiple;
            tH = height * multiple;
            this.#textureImg.width = width;
            this.#textureImg.height = height;

            // 렌더링 크기 설정
            this.#textureCvs.width = tW;
            this.#textureCvs.height = tH;
            // 스타일 크기 동기화
            if (!(this.#textureCvs instanceof OffscreenCanvas)) {
                this.#textureCvs.style.width = `${width}px`;
                this.#textureCvs.style.height = `${height}px`;
            }
            this.#textureCtx.imageSmoothingEnabled = true;
            this.#textureCtx.imageSmoothingQuality = 'high';
            this.#textureCtx.clearRect(0, 0, tW, tH);
            this.#textureCtx.fillStyle = 'rgba(0, 0, 0, 0)'; // 투명 배경으로 초기화
            this.#textureCtx.fillRect(0, 0, tW, tH);
            // 이미지 캔버스에 그리기
            this.#textureCtx.drawImage(this.#textureImg, 0, 0, tW, tH);
            this.dirtyTransform = true;
            // Blob으로 변환하여 처리
            const callback = (blob: Blob | MediaSource) => {
                if (this.material.diffuseTexture) {
                    const prevSrc = this.material.diffuseTexture.src
                    const isObjectURL = typeof prevSrc === 'string' && prevSrc?.startsWith?.('blob:');
                    this.material.diffuseTexture.destroy()
                    this.material.diffuseTexture = null
                    if (isObjectURL) {
                        URL.revokeObjectURL(prevSrc);
                    }
                }
                this.material.diffuseTexture = new BitmapTexture(this.#redGPUContext, URL.createObjectURL(blob), true, () => {
                    this.#renderWidth = width
                    this.#renderHeight = height
                }, null, null, true);
            };
            if (this.#textureCvs instanceof OffscreenCanvas) {
                this.#textureCvs.convertToBlob({type: 'image/png'}).then(callback);
            } else {
                this.#textureCvs.toBlob(callback, 'image/png');
            }
        };
    }

    #updateTexture() {
        if (this.#needsUpdate) {
            if (this.#currentRequestAnimationFrame) cancelAnimationFrame(this.#currentRequestAnimationFrame)
            this.#currentRequestAnimationFrame = requestAnimationFrame(() => {
                this.#setSvgToImg();
            })
        }
        this.#needsUpdate = false
    }

    #setStyle = (key: string, baseValue: number | string) => {
        const svgDom: HTMLElement = this.#svg.querySelector('foreignObject > div')
        const tStyle: any = svgDom.style;
        const tStyle2: any = this.#htmlElement.style;
        const internalKey = `_${key}`;
        this[internalKey] = baseValue;
        Object.defineProperty(this, key, {
            get: () => {
                return this[internalKey];
            },
            set: (value: number | string) => {
                // 값이 실제로 변경되었는지 확인
                const oldValue = this[internalKey];
                this[internalKey] = value;
                // 픽셀 단위 처리
                const processedValue = (isValidNumber(value) && isPixelNeeded(key))
                    ? `${value}px`
                    : value;
                tStyle[key] = processedValue;
                tStyle2[key] = processedValue;
                // 값이 변경된 경우에만 텍스처 업데이트
                if (oldValue !== value) this.#needsUpdate = true
            },
            configurable: true
        });
        // 초기값 설정 (이때는 업데이트 호출하지 않음)
        this[key] = baseValue;
    };

    #setHtmlElement() {
        this.#htmlElement = document.createElement('div')
        this.#htmlElement.style.cssText = TEXT_CONTAINER_STYLE + ';position:absolute;top:200px;left:0;visibility:hidden;text-rendering:optimizeLegibility'
        // this.#htmlElement.style.cssText = TEXT_CONTAINER_STYLE + ';position:absolute;top:250px;left:0px;'
        document.body.appendChild(this.#htmlElement)
    }

    #setSvgElement() {
        const svg = this.#svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('text-rendering', 'optimizeLegibility');
        svg.style.cssText = 'position:absolute;top:0px;left:0px;z-index:1;margin:0;padding:0;overflow:visible;background:transparent';
        svg.innerHTML = `
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
            <foreignObject  width="100%" height="100%" style="margin:0;padding:0;" overflow="visible">
			    <div xmlns="http://www.w3.org/1999/xhtml" style="${TEXT_CONTAINER_STYLE}"></div>
			</foreignObject>`;
        // document.body.appendChild(this.#svg)
    }

    #setBasicStyle() {
        for (const [key, value] of Object.entries(BASE_STYLES)) {
            this.#setStyle(key, value);
        }
        this.#needsUpdate = true
    }
}

Object.freeze(ATextField)
export default ATextField;
