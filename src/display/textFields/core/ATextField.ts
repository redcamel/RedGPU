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
    #needsUpdate: boolean = false;
    #updateVersion: number = 0;
    #renderWidth: number = 1
    #renderHeight: number = 1

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
        this.#createCanvasAndContext();
        this.#setHtmlElement()
        this.#setSvgElement()
        this.#setImgElement()
        this.#setBasicStyle()
    }

    /**
     * [KO] 표시할 텍스트 문자열을 반환하거나 설정합니다. `<br/>` 태그를 줄바꿈으로 처리합니다.
     * [EN] Returns or sets the text string to display. Processes `<br/>` tags as line breaks.
     *
     * @returns
     * [KO] 현재 설정된 텍스트 문자열
     * [EN] Currently set text string
     */
    get text() {
        return this.#text;
    }

    set text(text: string) {
        if (this.#text === text) return
        this.#text = text
        const svg = this.#svg;
        const htmlContainer = svg.querySelector('foreignObject div');
        const processedText = this.#processText(text)
        this.#htmlElement.innerHTML = processedText;
        htmlContainer.innerHTML = processedText;
        this.#needsUpdate = true;
        this.#updateVersion++;
    }

    /**
     * [KO] 텍스트 텍스처 상태를 갱신하고 텍스트 필드를 렌더링합니다.
     * [EN] Updates the text texture state and renders the text field.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더링 상태 데이터
     * [EN] View rendering state data
     */
    render(renderViewStateData: RenderViewStateData) {
        this.#textureImgOnload(this.#renderWidth, this.#renderHeight)
        this.#updateTexture()
        super.render(renderViewStateData);
    }

    /**
     * [KO] 텍스트 필드 인스턴스를 파기하고 내부 DOM 엘리먼트, 텍스처 및 Object URL 리소스를 해제합니다.
     * [EN] Destroys the text field instance and releases internal DOM elements, textures, and Object URL resources.
     */
    destroy() {
        if (this.#currentRequestAnimationFrame) {
            cancelAnimationFrame(this.#currentRequestAnimationFrame);
        }
        if (this.material && this.material.diffuseTexture) {
            const prevSrc = this.material.diffuseTexture.src;
            const isObjectURL = typeof prevSrc === 'string' && prevSrc.startsWith('blob:');
            this.material.diffuseTexture.destroy();
            this.material.diffuseTexture = null;
            if (isObjectURL) {
                URL.revokeObjectURL(prevSrc);
            }
        }
        if (this.#htmlElement) {
            if (this.#htmlElement.parentNode) {
                this.#htmlElement.parentNode.removeChild(this.#htmlElement);
            }
            this.#htmlElement = null;
        }
        if (this.#svg) {
            if (this.#svg.parentNode) {
                this.#svg.parentNode.removeChild(this.#svg);
            }
            this.#svg = null;
        }

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
        const rect = this.#htmlElement.getBoundingClientRect();
        let extraLeft = 3, extraRight = 3, extraTop = 3, extraBottom = 3;
        const renderedWidth = rect.width + extraLeft + extraRight;
        const renderedHeight = rect.height + extraTop + extraBottom;
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
        return {
            width: Math.ceil(renderedWidth) & ~1,
            height: Math.ceil(renderedHeight) & ~1,
            extraTop,
            extraRight,
            extraBottom,
            extraLeft
        };
    }

    #setSvgToImg(requestVersion: number) {
        const svg = this.#svg;
        const foreignObject = svg.querySelector('foreignObject');
        const {width, height, extraTop, extraRight, extraBottom, extraLeft} = this.#getRenderHtmlSize();
        foreignObject.setAttribute('width', width.toString());
        foreignObject.setAttribute('height', height.toString());
        foreignObject.style.padding = `${extraTop}px ${extraRight}px ${extraBottom}px ${extraLeft}px`;
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        this.#textureImg.src =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(svg.outerHTML);

        (this.#textureImg as any)._requestVersion = requestVersion;
    }

    #setImgElement() {
        this.#textureImg = new Image();
        this.#textureImg.style.cssText = 'position:absolute;bottom:0px;left:0;'
        this.#textureImg.onload = _ => {
            const requestVersion = (this.#textureImg as any)._requestVersion;
            if (requestVersion !== this.#updateVersion) {
                if (this.#needsUpdate) this.#updateTexture();
                return;
            }

            let tW: number, tH: number;
            const {width, height} = this.#getRenderHtmlSize();
            const multiple = window.devicePixelRatio === 1 ? 2 : window.devicePixelRatio;
            tW = width * multiple;
            tH = height * multiple;
            this.#textureImg.width = width;
            this.#textureImg.height = height;

            this.#textureCvs.width = tW;
            this.#textureCvs.height = tH;
            if (!(this.#textureCvs instanceof OffscreenCanvas)) {
                this.#textureCvs.style.width = `${width}px`;
                this.#textureCvs.style.height = `${height}px`;
            }
            this.#textureCtx.imageSmoothingEnabled = true;
            this.#textureCtx.imageSmoothingQuality = 'high';
            this.#textureCtx.clearRect(0, 0, tW, tH);
            this.#textureCtx.fillStyle = 'rgba(0, 0, 0, 0)';
            this.#textureCtx.fillRect(0, 0, tW, tH);
            this.#textureCtx.drawImage(this.#textureImg, 0, 0, tW, tH);
            this.dirtyTransform = true;
            const callback = (blob: Blob | MediaSource) => {
                if (requestVersion !== this.#updateVersion) {
                    if (this.#needsUpdate) this.#updateTexture();
                    return;
                }
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
                    if (requestVersion !== this.#updateVersion) {
                        if (this.#needsUpdate) this.#updateTexture();
                        return;
                    }
                    this.#renderWidth = width;
                    this.#renderHeight = height;
                    if (this.#needsUpdate) {
                        this.#updateTexture();
                    }
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
            this.#needsUpdate = false;
            const currentVersion = this.#updateVersion;
            if (this.#currentRequestAnimationFrame) cancelAnimationFrame(this.#currentRequestAnimationFrame);
            this.#currentRequestAnimationFrame = requestAnimationFrame(() => {
                this.#setSvgToImg(currentVersion);
            });
        }
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
                const oldValue = this[internalKey];
                this[internalKey] = value;
                const processedValue = (isValidNumber(value) && isPixelNeeded(key))
                    ? `${value}px`
                    : value;
                tStyle[key] = processedValue;
                tStyle2[key] = processedValue;
                if (oldValue !== value) {
                    this.#needsUpdate = true;
                    this.#updateVersion++;
                }
            },
            configurable: true
        });
        this[key] = baseValue;
    };

    #setHtmlElement() {
        this.#htmlElement = document.createElement('div')
        this.#htmlElement.style.cssText = TEXT_CONTAINER_STYLE + ';position:absolute;top:200px;left:0;visibility:hidden;text-rendering:optimizeLegibility'
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
