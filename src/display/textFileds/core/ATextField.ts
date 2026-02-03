import RedGPUContext from "../../../context/RedGPUContext";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import TextFieldMaterial from "./textFieldMaterial/TextFieldMaterial";

const TEXT_CONTAINER_STYLE = ';box-sizing:content-box;white-space:nowrap;'

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
    borderRadius: number | string;
    boxShadow: string;
    boxSizing: string;
    filter: string;
}

const BASE_STYLES = {
    padding: 0,
    background: 'transparent',
    color: '#fff',
    fontFamily: 'Arial',
    fontSize: 16,
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
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
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
        this.#needsUpdate = true
    }

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
            const dpr = window.devicePixelRatio=== 1 ? 2 :window.devicePixelRatio;
            const multiple = dpr;
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
                this.material.diffuseTexture = new BitmapTexture(this.#redGPUContext, URL.createObjectURL(blob), true, v => {
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
export default ATextField
