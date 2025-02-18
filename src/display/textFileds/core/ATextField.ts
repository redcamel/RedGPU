import RedGPUContext from "../../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import BitmapMaterial from "../../../material/bitmapMaterial/BitmapMaterial";
import RenderViewStateData from "../../../renderer/RenderViewStateData";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../mesh/Mesh";

const TEXT_CONTAINER_STYLE = ';box-sizing:content-box;white-space:nowrap;'
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
    // borderRadius: '10px',
    lineHeight: 1.4,
    border: '',
    boxShadow: 'none',
    boxSizing: 'border-box',
    filter: '',
}
const isValidNumber = (value: any) => typeof value == 'number';
const isPixelNeeded = (key: string) => !['lineHeight', 'fontWeight'].includes(key);

class ATextField extends Mesh {
    #textureCvs: OffscreenCanvas | HTMLCanvasElement;
    #textureCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
    #svg: SVGSVGElement;
    #htmlElement: HTMLDivElement;
    #textureImg: HTMLImageElement;
    #text: string
    #textureImgOnload: Function
    #mode3dYn: boolean = true;
    readonly #redGPUContext: RedGPUContext
    #currentRequestAnimationFrame: number;
    #needsUpdate: boolean = false; // 업데이트 플래그
    #isRendering: boolean = false; // 현재 렌더링 중인지 여부
    #pendingUpdate: boolean = false; // 렌더링 중 추가 업데이트가 발생했는지 여부

    constructor(redGPUContext: RedGPUContext, imgOnload: Function, mode3dYn: boolean = true) {
        super(redGPUContext);
        this.#redGPUContext = redGPUContext
        this.#mode3dYn = mode3dYn
        this.#textureImgOnload = imgOnload
        this._material = new BitmapMaterial(redGPUContext, new BitmapTexture(redGPUContext))
        this._material.transparent = true
        if (mode3dYn) {
            this._material.diffuseTextureSampler = new Sampler(redGPUContext, {
                minFilter: GPU_FILTER_MODE.LINEAR,
                magFilter: GPU_FILTER_MODE.LINEAR,
                mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR
            })
        } else {
            this._material.diffuseTextureSampler = new Sampler(redGPUContext, {
                minFilter: GPU_FILTER_MODE.LINEAR,
                magFilter: GPU_FILTER_MODE.LINEAR,
                mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR
            })
            this._material.diffuseTextureSampler.minFilter = null
            this._material.diffuseTextureSampler.magFilter = null
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
        this.#text = text
        const svg = this.#svg;
        const htmlContainer = svg.querySelector('foreignObject div');
        const processedText = this.#processText(text)
        this.#htmlElement.innerHTML = processedText;
        htmlContainer.innerHTML = processedText;
        this.#setSvgToImg();
    }

    render(debugViewRenderState: RenderViewStateData) {
        this.#textureImgOnload(this.#textureImg.width, this.#textureImg.height)
        super.render(debugViewRenderState);
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
        let extraLeft = 2, extraRight = 2, extraTop = 2, extraBottom = 2;
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
        // 플래그 설정 (업데이트 필요)
        this.#needsUpdate = true;

        // 이미 렌더링 중이라면 플래그만 설정하고 종료
        if (this.#isRendering) {
            this.#pendingUpdate = true; // 추가 요청 발생 플래그 설정
            return;
        }

        // requestAnimationFrame 시작
        this.#isRendering = true;
        const updateFrame = () => {
            if (this.#needsUpdate) {
                // 현재 요청 수행
                this.#needsUpdate = false;

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

            // 추가 요청이 있었는지 검사
            if (this.#pendingUpdate) {
                this.#needsUpdate = true; // 새 업데이트 요청 상태 반영
                this.#pendingUpdate = false; // 추가 요청 상태 초기화
                requestAnimationFrame(updateFrame); // 다음 프레임에서 다시 실행
            } else {
                // 모든 작업이 완료되었으면 렌더링 종료
                this.#isRendering = false;
            }
        };

        // 첫 번째 `requestAnimationFrame` 호출
        requestAnimationFrame(updateFrame);
    }

    #setImgElement() {
        this.#textureImg = new Image();
        this.#textureImg.style.cssText = 'position:absolute;bottom:0px;left:0;'
        // document.body.appendChild(this.#img)
        this.#textureImg.onload = _ => {
            let tW: number, tH: number;
            const { width, height } = this.#getRenderHtmlSize();
            const multiple = this.#mode3dYn ? 2 : 1;
            tW = width * multiple;
            tH = height * multiple;
            this.#textureImg.width = tW;
            this.#textureImg.height = tH;

            console.log("Final Texture Sizes:", {
                svgWidth: tW,
                svgHeight: tH,
            });
            // 렌더링 크기 설정
            this.#textureCvs.width = tW;
            this.#textureCvs.height = tH;

            // 스타일 크기 동기화
            if (!(this.#textureCvs instanceof OffscreenCanvas)) {
                this.#textureCvs.style.width = `${tW}px`;
                this.#textureCvs.style.height = `${tH}px`;
            }
            this.#textureCtx.imageSmoothingEnabled = false;
            this.#textureCtx.imageSmoothingQuality = 'high';
            this.#textureCtx.clearRect(0, 0, tW, tH);
            this.#textureCtx.fillStyle = 'rgba(0, 0, 0, 0)'; // 투명 배경으로 초기화
            this.#textureCtx.fillRect(0, 0, tW, tH);

            // 이미지 캔버스에 그리기
            this.#textureCtx.drawImage(this.#textureImg, 0, 0, tW, tH);

            // TODO - 이거쓸껀지 결정하자...
            // // Alpha 분리 (비프리멀티플 처리)
            // const imageData = this.#textureCtx.getImageData(0, 0, tW, tH);
            // const data = imageData.data;
            //
            // for (let i = 0; i < data.length; i += 4) {
            //     const alpha = data[i + 3] / 255; // Alpha 값을 0~1로 변환
            //     if (alpha > 0) {
            //         data[i] /= alpha;    // R 채널 비프리멀티플
            //         data[i + 1] /= alpha; // G 채널 비프리멀티플
            //         data[i + 2] /= alpha; // B 채널 비프리멀티플
            //     }
            // }
            //
            // // 비프리멀티플된 데이터를 캔버스에 다시 쓰기
            // this.#textureCtx.putImageData(imageData, 0, 0);

            this.#textureImgOnload?.(tW, tH)
            this.dirtyTransform = true;

            // Blob으로 변환하여 처리
            const callback = (blob: Blob | MediaSource) => {
                new BitmapTexture(this.#redGPUContext, URL.createObjectURL(blob), this.#mode3dYn, v => {
                    this.material.diffuseTexture?.destroy();
                    this.material.diffuseTexture = v;
                    this.dirtyTransform = true;
                });
            };

            if (this.#textureCvs instanceof OffscreenCanvas) {
                this.#textureCvs.convertToBlob({ type: 'image/png' }).then(callback);
            } else {
                this.#textureCvs.toBlob(callback, 'image/png');
            }
        };
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
                this[internalKey] = value;
                if (isValidNumber(value) && isPixelNeeded(key)) value = `${value}px`;
                tStyle[key] = value;
                tStyle2[key] = value;
                if (this.#currentRequestAnimationFrame) cancelAnimationFrame(this.#currentRequestAnimationFrame)
                this.#currentRequestAnimationFrame = requestAnimationFrame(() => {
                    this.#setSvgToImg();
                })
            }
        });
        this[key] = baseValue;
    };

    #setHtmlElement() {
        this.#htmlElement = document.createElement('div')
        this.#htmlElement.style.cssText = TEXT_CONTAINER_STYLE + 'text-rendering: geometricPrecision;;position:absolute;top:200px;left:0;visibility:hidden'
        // this.#htmlElement.style.cssText = TEXT_CONTAINER_STYLE + ';position:absolute;top:250px;left:0px;'
        document.body.appendChild(this.#htmlElement)
    }

    #setSvgElement() {
        const svg = this.#svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('text-rendering', 'geometricPrecision');
        svg.style.cssText = 'position:absolute;top:0px;left:0px;z-index:1;margin:0;padding:0;overflow:visible;background:transparent';
        svg.innerHTML = `
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
            <foreignObject  width="100%" height="100%" style="margin:0;padding:0" overflow="visible">
			    <div xmlns="http://www.w3.org/1999/xhtml" style="${TEXT_CONTAINER_STYLE}"></div>
			</foreignObject>`;
        // document.body.appendChild(this.#svg)
    }

    #setBasicStyle() {
        for (const [key, value] of Object.entries(BASE_STYLES)) {
            this.#setStyle(key, value);
        }
    }
}

Object.freeze(ATextField)
export default ATextField
