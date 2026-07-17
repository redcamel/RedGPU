import {keepLog} from "../../../../utils";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import View3D from "../../View3D";
import GBUFFER_TYPE from "../GBUFFER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";

const DEPTH0: GBUFFER_INNER_TYPE = 'depthTexture0'
const DEPTH1: GBUFFER_INNER_TYPE = 'depthTexture1'

type GBUFFER_INNER_TYPE = 'depthTexture0' | 'depthTexture1';

/**
 * [KO] G-Buffer 텍스처 및 관련 뷰 정보를 정의하는 타입
 * [EN] Type defining G-Buffer texture and related view information
 */
type GBufferInfo = {
    /**
     * [KO] GPU 텍스처 객체
     * [EN] GPU texture object
     */
    texture: GPUTexture,
    /**
     * [KO] GPU 텍스처 뷰 객체
     * [EN] GPU texture view object
     */
    textureView: GPUTextureView,
    /**
     * [KO] GPU 텍스처 디스크립터
     * [EN] GPU texture descriptor
     */
    textureDescriptor: GPUTextureDescriptor,
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 객체 (선택 사항)
     * [EN] Resolve target GPU texture object for MSAA (optional)
     */
    resolveTexture?: GPUTexture,
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 뷰 객체 (선택 사항)
     * [EN] Resolve target GPU texture view object for MSAA (optional)
     */
    resolveTextureView?: GPUTextureView,
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 디스크립터 (선택 사항)
     * [EN] Resolve target GPU texture descriptor for MSAA (optional)
     */
    resolveTextureDescriptor?: GPUTextureDescriptor,
}
const BASIC_USAGE = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC

/**
 * [KO] G-Buffer 타입별 포맷 및 사용 용도 정의
 * [EN] Define formats and usages by G-Buffer type
 */
const GBUFFER_FORMATS: Record<GBUFFER_TYPE, {
    format?: GPUTextureFormat,
    usage: GPUTextureUsageFlags,
    withResolve: boolean,
    useMipmap: boolean
}> = {
    [GBUFFER_TYPE.COLOR]: {
        format: 'rgba16float',
        usage: BASIC_USAGE | GPUTextureUsage.STORAGE_BINDING,
        withResolve: true,
        useMipmap: false
    },
    [GBUFFER_TYPE.MOTION_VECTOR]: {format: 'rgba16float', usage: BASIC_USAGE, withResolve: true, useMipmap: false},
    [GBUFFER_TYPE.NORMAL]: {usage: BASIC_USAGE, withResolve: true, useMipmap: false}, // navigator.gpu.getPreferredCanvasFormat() 사용
    [GBUFFER_TYPE.RENDER_PATH1_RESULT]: {
        format: 'rgba16float',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        withResolve: false,
        useMipmap: true
    }
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
class ViewRenderTextureManager extends RedGPUObject {
    /**
     * [KO] 관리 중인 텍스처들의 총 비디오 메모리 사용량 (바이트 단위)
     * [EN] Total video memory usage of managed textures (in bytes)
     */
    #videoMemorySize: number = 0
    /**
     * [KO] 소유하고 있는 View3D 인스턴스
     * [EN] Owned View3D instance
     */
    #view: View3D
    /**
     * [KO] G-Buffer 맵
     * [EN] G-Buffer map
     */
    #gBuffers: Map<string, GBufferInfo> = new Map()
    /**
     * [KO] 마지막으로 업데이트된 MSAA 고유 ID
     * [EN] Last updated MSAA unique ID
     */
    #lastUpdateMSAAID: string
    #targetTextureSize: GPUExtent3DDict
    #targetTextureSizeString: string

    /**
     * [KO] ViewRenderTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a new ViewRenderTextureManager instance.
     * @param view -
     * [KO] 이 매니저가 관리할 View3D 인스턴스
     * [EN] View3D instance this manager will manage
     */
    constructor(view: View3D) {
        super(view.redGPUContext)
        this.#view = view
    }

    /**
     * [KO] G-Buffer 맵을 반환합니다.
     * [EN] Returns the G-Buffer map.
     */
    get gBuffers(): Map<string, GBufferInfo> {
        return this.#gBuffers;
    }

    /**
     * [KO] 현재 계산된 비디오 메모리 사용량 (바이트 단위)을 반환합니다.
     * [EN] Returns the currently calculated video memory usage (in bytes).
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 렌더 패스 1단계 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.
     * [EN] Returns the descriptor used to create the render path 1 stage result texture.
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
        return this.#gBuffers.get(GBUFFER_TYPE.RENDER_PATH1_RESULT)?.textureDescriptor;
    }

    /**
     * [KO] 깊이(depth) 텍스처를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture. (reflects swap buffering)
     */
    get depthTexture(): GPUTexture {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.texture : this.#gBuffers.get(DEPTH0)?.texture;
    }

    /**
     * [KO] 깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture view. (reflects swap buffering)
     */
    get depthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.textureView : this.#gBuffers.get(DEPTH0)?.textureView;
    }

    /**
     * [KO] 이전 프레임의 깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture view of the previous frame. (reflects swap buffering)
     */
    get prevDepthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH0)?.textureView : this.#gBuffers.get(DEPTH1)?.textureView;
    }

    /**
     * [KO] 첫 번째 깊이(depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the first depth texture view.
     */
    get depthTexture0View(): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(DEPTH0)?.textureView
    }

    /**
     * [KO] 두 번째 깊이(depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the second depth texture view.
     */
    get depthTexture1View(): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(DEPTH1)?.textureView
    }

    /**
     * [KO] 렌더 패스 1단계 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 stage result texture view.
     */
    get renderPath1ResultTextureView(): GPUTextureView {
        return this.getGBufferTextureView(GBUFFER_TYPE.RENDER_PATH1_RESULT);
    }

    /**
     * [KO] 렌더 패스 1단계 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 stage result texture.
     */
    get renderPath1ResultTexture(): GPUTexture {
        return this.getGBufferTexture(GBUFFER_TYPE.RENDER_PATH1_RESULT);
    }

    /* ----------------------------------------
     * G-Buffer 공통 접근 메서드
     * ---------------------------------------- */
    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the G-Buffer texture of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.texture;
    }

    /**
     * [KO] 지정된 타입의 G-Buffer Resolve 텍스처를 반환합니다. (MSAA 해제 시 대상)
     * [EN] Returns the G-Buffer resolve texture of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferResolveTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTexture;
    }

    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the G-Buffer texture view of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.textureView;
    }

    /**
     * [KO] 지정된 타입의 G-Buffer Resolve 텍스처 뷰를 반환합니다. (MSAA 해제 시 대상 뷰)
     * [EN] Returns the G-Buffer resolve texture view of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferResolveTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTextureView;
    }

    /**
     * [KO] ViewRenderTextureManager 인스턴스를 파기하고 내부에 보관 중이던 G-Buffer 및 Depth 텍스처들을 물리적으로 해제합니다.
     * [EN] Destroys the ViewRenderTextureManager instance and physically releases all G-Buffer and Depth textures held inside.
     */
    destroy(): void {
        for (const key of this.#gBuffers.keys()) {
            this.#destroyGBuffer(key as any);
        }
        this.#gBuffers.clear();
        this.#view = null;
        console.log("🧹 ViewRenderTextureManager destroy 완료");
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
        const {antialiasingManager} = this;
        const {msaaID} = antialiasingManager;
        const {pixelRectObject, renderViewStateData} = this.#view;
        this.#targetTextureSize = {
            width: Math.max(pixelRectObject.width, 1),
            height: Math.max(pixelRectObject.height, 1),
            depthOrArrayLayers: 1
        }
        this.#targetTextureSizeString = `${this.#targetTextureSize.width}x${this.#targetTextureSize.height}`
        // 하나라도 변경되었는지 확인
        const renderPath1ResultTexture = this.#gBuffers.get(GBUFFER_TYPE.RENDER_PATH1_RESULT)?.texture
        const changedSize = renderPath1ResultTexture?.width !== this.#targetTextureSize.width || renderPath1ResultTexture?.height !== this.#targetTextureSize.height;
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID;

        if (changedSize || dirtyMSAA || !renderPath1ResultTexture) {
            this.#lastUpdateMSAAID = msaaID;
            renderViewStateData.swapBufferIndex = 0

            // 1. 기존 리소스 일괄 정리 (선택 사항이나 명시적 관리를 위해 유지)
            // 2. 새로운 리소스 일괄 생성
            this.#createDepthTexture(DEPTH0);
            this.#createDepthTexture(DEPTH1);

            // G-Buffer 일괄 생성 (for...in 루프로 최적화)
            for (const key in GBUFFER_TYPE) {
                this.#createGBuffer(GBUFFER_TYPE[key]);
            }

            // 3. 비디오 메모리 계산 (마지막에 한 번만 수행)
            this.#checkVideoMemorySize();
        }
    }

    /* ----------------------------------------
     * Private helpers
     * ---------------------------------------- */
    /**
     * 현재 관리 중인 텍스처들을 기반으로 비디오 메모리 사용량을 계산하여 #videoMemorySize를 업데이트합니다.
     * @private
     */
    #checkVideoMemorySize() {
        const textures = []
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
            const {texture, resolveTexture} = targetInfo;
            targetInfo.texture = null
            targetInfo.textureView = null
            //
            targetInfo.resolveTexture = null
            targetInfo.resolveTextureView = null
            //
            this.#gBuffers.delete(type)

            const {commandEncoderManager} = this;
            if (texture) commandEncoderManager.addDeferredDestroy(texture);
            if (resolveTexture) commandEncoderManager.addDeferredDestroy(resolveTexture);
        }
    }

    #createGBufferTextureAndTextureView(
        type: GBUFFER_TYPE | GBUFFER_INNER_TYPE,
        format: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        withResolve: boolean = false,
        mipLevelCount: number = 1
    ): GBufferInfo {
        const {antialiasingManager, resourceManager} = this
        const {useMSAA} = antialiasingManager
        const newInfo: GBufferInfo = {
            texture: null as any,
            textureView: null as any,
            textureDescriptor: null as any
        }

        const {name} = this.#view
        const sampleCount = useMSAA && mipLevelCount === 1 ? 4 : 1;
        const textureDescriptor = {
            size: this.#targetTextureSize,
            sampleCount, // 밉맵을 쓸 때는 보통 MSAA를 쓰지 않거나 resolve된 타겟을 씁니다.
            label: `${name}_${type}_texture_${this.#targetTextureSizeString}`,
            format: format,
            usage: sampleCount > 1 ? (usage & ~GPUTextureUsage.STORAGE_BINDING) : usage,
            mipLevelCount,
        }
        const newTexture = resourceManager.createManagedTexture(textureDescriptor)
        newInfo.textureDescriptor = textureDescriptor
        newInfo.texture = newTexture;
        newInfo.textureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);

        // MSAA 사용 시 Resolve 텍스처 생성
        if (withResolve && useMSAA) {
            const resolveTextureDescriptor = {
                size: this.#targetTextureSize,
                sampleCount: 1,
                label: `${name}_${type}_resolveTexture_${this.#targetTextureSizeString}`,
                format: format,
                usage,
            }
            const newResolveTexture = resourceManager.createManagedTexture(resolveTextureDescriptor)
            newInfo.resolveTextureDescriptor = resolveTextureDescriptor
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

        let format = GBUFFER_FORMATS[type]?.format || navigator.gpu.getPreferredCanvasFormat();
        let {usage, withResolve, useMipmap} = GBUFFER_FORMATS[type];
        let mipLevelCount = useMipmap ? getMipLevelCount(this.#targetTextureSize.width, this.#targetTextureSize.height) : 1;

        this.#destroyGBuffer(type)
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type, format, usage, withResolve, mipLevelCount))
    }

    /**
     * 깊이 텍스처를 생성하거나 재생성합니다.
     * @private
     */
    #createDepthTexture(type: GBUFFER_INNER_TYPE): void {
        this.#destroyGBuffer(type)
        keepLog(`새 텍스처 생성 중: ${type}`)
        const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type, 'depth32float', usage, false))
    }


}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager