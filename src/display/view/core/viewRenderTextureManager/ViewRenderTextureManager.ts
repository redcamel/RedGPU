import RedGPUContext from "../../../../context/RedGPUContext";
import validateRedGPUContext from "../../../../runtimeChecker/validateFunc/validateRedGPUContext";
import {keepLog} from "../../../../utils";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import View3D from "../../View3D";
import GBUFFER_TYPE from "../GBUFFER_TYPE";

const DEPTH0: GBUFFER_INNER_TYPE = 'depthTexture0'
const DEPTH1: GBUFFER_INNER_TYPE = 'depthTexture1'

type GBUFFER_INNER_TYPE = 'depthTexture0' | 'depthTexture1';

/**
 * G-Buffer 타입별 포맷 정의
 */
const GBUFFER_FORMATS: Record<GBUFFER_TYPE, GPUTextureFormat> = {
    [GBUFFER_TYPE.COLOR]: 'rgba16float',
    [GBUFFER_TYPE.MOTION_VECTOR]: 'rgba16float',
    [GBUFFER_TYPE.NORMAL]: undefined // navigator.gpu.getPreferredCanvasFormat() 사용
};

/**
 * [KO] View3D/2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.
 * [EN] Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/2D.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class ViewRenderTextureManager {
    /**
     * 렌더 패스 1 결과 텍스처
     * @private
     * @type {GPUTexture}
     */
    #renderPath1ResultTexture: GPUTexture
    /**
     * 렌더 패스 1 결과 텍스처 뷰
     * @private
     * @type {GPUTextureView}
     */
    #renderPath1ResultTextureView: GPUTextureView
    /**
     * 렌더 패스 1 결과 텍스처 디스크립터(생성 시점 정보)
     * @private
     * @type {GPUTextureDescriptor}
     */
    #renderPath1ResultTextureDescriptor: GPUTextureDescriptor

    /**
     * 관리 중인 텍스처들의 총 비디오 메모리 사용량(바이트)
     * @private
     * @type {number}
     */
    #videoMemorySize: number = 0
    /**
     * 연결된 RedGPUContext 인스턴스
     * @private
     * @type {RedGPUContext}
     */
    #redGPUContext: RedGPUContext
    /**
     * 소유 View3D 인스턴스
     * @private
     * @type {View3D}
     */
    #view: View3D
    /**
     * G-Buffer 맵: key -> { texture, textureView, resolveTexture, resolveTextureView }
     * @private
     * @type {Map<string, {texture: GPUTexture, textureView: GPUTextureView, resolveTexture: GPUTexture, resolveTextureView: GPUTextureView}>}
     */
    #gBuffers: Map<string, {
        texture: GPUTexture,
        textureView: GPUTextureView,
        resolveTexture: GPUTexture,
        resolveTextureView: GPUTextureView,
    }> = new Map()
    /**
     * G-Buffer별 MSAA 사용 상태 캐시 (재생성 판단용)
     * @private
     * @type {{ [key: string]: boolean }}
     */
    #gBuffersMSAAState: { [key: string]: boolean } = {}
    /**
     * 마지막으로 업데이트된 MSAA 고유 ID
     * @private
     * @type {string}
     */
    #lastUpdateMSAAID: string
    #prevTime: number
    #targetTextureSize: GPUExtent3DDict
    #targetTextureSizeString: string

    /**
     * 생성자
     * @param {View3D} view - 이 매니저가 관리할 View3D 인스턴스
     */
    constructor(view: View3D) {
        validateRedGPUContext(view.redGPUContext)
        this.#redGPUContext = view.redGPUContext
        this.#view = view
    }

    /* ----------------------------------------
     * Public getters (메모리/텍스처 접근)
     * ---------------------------------------- */
    /**
     * [KO] 모든 렌더 텍스처들의 상태(크기, MSAA 등)를 일괄 확인하고 필요 시 재생성합니다.
     * [EN] Batch check the status (size, MSAA, etc.) of all render textures and regenerate them if necessary.
     * @private
     */
    #update() {
        const {antialiasingManager} = this.#redGPUContext;
        const {msaaID} = antialiasingManager;
        const {pixelRectObject} = this.#view;
        const {width, height} = pixelRectObject;
        this.#targetTextureSize = {
            width: Math.max(pixelRectObject.width, 1),
            height: Math.max(pixelRectObject.height, 1),
            depthOrArrayLayers: 1
        }
        this.#targetTextureSizeString = `${this.#targetTextureSize.width}x${this.#targetTextureSize.height}`
        // 하나라도 변경되었는지 확인
        const changedSize = this.#renderPath1ResultTexture?.width !== width || this.#renderPath1ResultTexture?.height !== height;
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID;

        if (changedSize || dirtyMSAA || !this.#renderPath1ResultTexture) {
            this.#lastUpdateMSAAID = msaaID;

            // 1. 기존 리소스 일괄 정리 (선택 사항이나 명시적 관리를 위해 유지)
            // 2. 새로운 리소스 일괄 생성
            this.#createDepthTexture(DEPTH0);
            this.#createDepthTexture(DEPTH1);
            this.#createRender2PathTexture('rgba16float');

            // G-Buffer 일괄 생성 (for...in 루프로 최적화)
            for (const key in GBUFFER_TYPE) {
                this.#createGBuffer(GBUFFER_TYPE[key]);
            }

            // 3. 비디오 메모리 계산 (마지막에 한 번만 수행)
            this.#checkVideoMemorySize();
        }
    }

    /**
     * 현재 계산된 비디오 메모리 사용량(바이트)을 반환합니다.
     * @returns {number}
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * 렌더 패스1 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.
     * @returns {GPUTextureDescriptor}
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
        return this.#renderPath1ResultTextureDescriptor;
    }

    /**
     * 깊이 텍스처를 반환합니다.
     * @returns {GPUTexture}
     */
    get depthTexture(): GPUTexture {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.texture : this.#gBuffers.get(DEPTH0)?.texture;
    }

    /**
     * 깊이 텍스처 뷰를 반환합니다.
     * @returns {GPUTextureView}
     */
    get depthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.textureView : this.#gBuffers.get(DEPTH0)?.textureView;
    }

    get prevDepthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH0)?.textureView : this.#gBuffers.get(DEPTH1)?.textureView;
    }

    /**
     * 렌더 패스1 결과 텍스처 뷰를 반환합니다.
     * @returns {GPUTextureView}
     */
    get renderPath1ResultTextureView(): GPUTextureView {
        this.#update();
        return this.#renderPath1ResultTextureView;
    }

    /**
     * 렌더 패스1 결과 텍스처를 반환합니다.
     * @returns {GPUTexture}
     */
    get renderPath1ResultTexture(): GPUTexture {
        this.#update();
        return this.#renderPath1ResultTexture;
    }

    /* ----------------------------------------
     * G-Buffer 공통 접근 메서드
     * ---------------------------------------- */
    /**
     * 지정된 타입의 G-Buffer 텍스처를 반환합니다.
     * @param {GBUFFER_TYPE} type - G-Buffer 타입 (GBUFFER_TYPE 상수 사용)
     * @returns {GPUTexture}
     */
    getGBufferTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.texture;
    }

    /**
     * 지정된 타입의 G-Buffer resolve 텍스처를 반환합니다.
     * @param {GBUFFER_TYPE} type - G-Buffer 타입 (GBUFFER_TYPE 상수 사용)
     * @returns {GPUTexture}
     */
    getGBufferResolveTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTexture;
    }

    /**
     * 지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.
     * @param {GBUFFER_TYPE} type - G-Buffer 타입 (GBUFFER_TYPE 상수 사용)
     * @returns {GPUTextureView}
     */
    getGBufferTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.textureView;
    }

    /**
     * 지정된 타입의 G-Buffer resolve 텍스처 뷰를 반환합니다.
     * @param {GBUFFER_TYPE} type - G-Buffer 타입 (GBUFFER_TYPE 상수 사용)
     * @returns {GPUTextureView}
     */
    getGBufferResolveTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTextureView;
    }

    /* ----------------------------------------
     * Private helpers
     * ---------------------------------------- */
    /**
     * 현재 관리 중인 텍스처들을 기반으로 비디오 메모리 사용량을 계산하여 #videoMemorySize를 업데이트합니다.
     * @private
     */
    #checkVideoMemorySize() {
        const textures = [
            this.#renderPath1ResultTexture,
        ].filter(Boolean);
        // 모든 G-Buffer 텍스처 추가
        this.#gBuffers.forEach(info => {
            if (info.texture) textures.push(info.texture);
            if (info.resolveTexture) textures.push(info.resolveTexture);
        });

        this.#videoMemorySize = textures.reduce((total, texture) => {
            const videoMemory = calculateTextureByteSize(texture)
            return total + videoMemory
        }, 0)
    }

    #destroyGBuffer(type: GBUFFER_TYPE | GBUFFER_INNER_TYPE) {
        const targetInfo = this.#gBuffers.get(type)
        if (targetInfo) {
            targetInfo?.texture?.destroy()
            targetInfo.texture = null
            targetInfo.textureView = null
            //
            targetInfo.resolveTexture?.destroy()
            targetInfo.resolveTexture = null
            targetInfo.resolveTextureView = null
            //
            this.#gBuffers.delete(type)
        }
    }

    #createGBufferTextureAndTextureView(type: GBUFFER_TYPE | GBUFFER_INNER_TYPE, format: GPUTextureFormat, usage?: GPUTextureUsageFlags, withResolve: boolean = false) {
        const {antialiasingManager, resourceManager} = this.#redGPUContext
        const {useMSAA} = antialiasingManager
        const newInfo = {
            texture: null,
            textureView: null,
            resolveTexture: null,
            resolveTextureView: null,
        }

        const {name} = this.#view
        const newTexture = resourceManager.createManagedTexture({
            size: this.#targetTextureSize,
            sampleCount: useMSAA ? 4 : 1,
            label: `${name}_${type}_texture_${this.#targetTextureSizeString}`,
            format: format,
            usage
        })

        newInfo.texture = newTexture;
        newInfo.textureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);

        // MSAA 사용 시 Resolve 텍스처 생성
        if (withResolve && useMSAA) {
            const newResolveTexture = resourceManager.createManagedTexture({
                size: this.#targetTextureSize,
                sampleCount: 1,
                label: `${name}_${type}_resolveTexture_${this.#targetTextureSizeString}`,
                format: format,
                usage
            })
            newInfo.resolveTexture = newResolveTexture
            newInfo.resolveTextureView = resourceManager.getGPUResourceBitmapTextureView(newResolveTexture)
        }
        return newInfo
    }

    /**
     * 지정된 G-Buffer 타입의 텍스처를 생성하거나 재생성합니다.
     * @private
     * @param {GBUFFER_TYPE} type - G-Buffer 식별자
     */
    #createGBuffer(type: GBUFFER_TYPE) {
        keepLog(`새 텍스처 생성 중: ${type}`)
        this.#destroyGBuffer(type)
        const format = GBUFFER_FORMATS[type] || navigator.gpu.getPreferredCanvasFormat();
        const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type,  format, usage, true))
    }

    /**
     * 깊이 텍스처를 생성하거나 재생성합니다.
     * @private
     */
    #createDepthTexture(type: GBUFFER_INNER_TYPE): void {
        this.#destroyGBuffer(type)
        keepLog(`새 텍스처 생성 중: ${type}`)
        const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type,  'depth32float', usage, false))
    }

    /**
     * 렌더 패스(또는 후처리) 결과를 담을 렌더 패스1 결과 텍스처를 생성하거나 재생성합니다.
     * @private
     */
    #createRender2PathTexture(format: GPUTextureFormat) {
        const {resourceManager} = this.#redGPUContext
        const currentTexture = this.#renderPath1ResultTexture
        const {pixelRectObject, name} = this.#view
        const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject

        // 기존 텍스처 정리
        if (currentTexture) {
            this.#renderPath1ResultTexture = null
            this.#renderPath1ResultTextureView = null
        }
        // 텍스처 디스크립터 생성
        this.#renderPath1ResultTextureDescriptor = {
            size: this.#targetTextureSize,
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH),
            label: `${name}_renderPath1ResultTexture_${this.#targetTextureSizeString}`
        }
        // 텍스처 및 텍스처 뷰 생성
        this.#renderPath1ResultTexture = resourceManager.createManagedTexture(this.#renderPath1ResultTextureDescriptor);
        this.#renderPath1ResultTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#renderPath1ResultTexture)
        requestAnimationFrame(() => {
            currentTexture?.destroy()
        })
    }


}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager