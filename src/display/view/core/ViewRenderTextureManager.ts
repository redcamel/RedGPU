import RedGPUContext from "../../../context/RedGPUContext";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import {keepLog} from "../../../utils";
import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/texture/getMipLevelCount";
import View3D from "../View3D";

/**
 * ViewRenderTextureManager 클래스
 *
 * View3D/2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성·관리합니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 *
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
     * 깊이 텍스처
     * @private
     * @type {GPUTexture}
     */
    #depthTexture: GPUTexture
    #depthTexture2: GPUTexture
    /**
     * 깊이 텍스처 뷰
     * @private
     * @type {GPUTextureView}
     */
    #depthTextureView: GPUTextureView
    #depthTexture2View: GPUTextureView
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
    #prevTime: number

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
     * 깊이 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTexture}
     */
    get depthTexture(): GPUTexture {
        return this.#view.renderViewStateData.swapBufferIndex ? this.#depthTexture2 : this.#depthTexture;
    }

    /**
     * 깊이 텍스처 뷰를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTextureView}
     */
    get depthTextureView(): GPUTextureView {
        this.#createDepthTexture();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#depthTexture2View : this.#depthTextureView;
    }

    get prevDepthTextureView(): GPUTextureView {
        this.#createDepthTexture();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#depthTextureView : this.#depthTexture2View;
    }

    /**
     * 렌더 패스1 결과 텍스처 뷰를 반환합니다.
     * @returns {GPUTextureView}
     */
    get renderPath1ResultTextureView(): GPUTextureView {
        return this.#renderPath1ResultTextureView;
    }

    /**
     * 렌더 패스1 결과 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTexture}
     */
    get renderPath1ResultTexture(): GPUTexture {
        this.#createRender2PathTexture('rgba16float');
        return this.#renderPath1ResultTexture;
    }

    /* ----------------------------------------
     * G-Buffer 관련 getters (컬러/노멀/모션 등)
     * 각 getter는 필요 시 #createGBuffer를 호출하여 생성 보장
     * ---------------------------------------- */
    /**
     * G-Buffer color 텍스처 반환 (미리 생성되지 않았으면 undefined)
     * @returns {GPUTexture}
     */
    get gBufferColorTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferColor')?.texture
    }

    /**
     * G-Buffer color resolve 텍스처 반환 (MSAA 사용 시 resolve 대상)
     * @returns {GPUTexture}
     */
    get gBufferColorResolveTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferColor')?.resolveTexture
    }

    /**
     * G-Buffer color 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferColorTextureView(): GPUTextureView {
        this.#createGBuffer('gBufferColor', 'rgba16float');
        return this.#gBuffers.get('gBufferColor')?.textureView
    }

    /**
     * G-Buffer color resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferColorResolveTextureView(): GPUTextureView {
        return this.#gBuffers.get('gBufferColor')?.resolveTextureView
    }

    /**
     * G-Buffer normal 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferNormalTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferNormal')?.texture
    }

    /**
     * G-Buffer normal resolve 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferNormalResolveTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferNormal')?.resolveTexture
    }

    /**
     * G-Buffer normal 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferNormalTextureView(): GPUTextureView {
        this.#createGBuffer('gBufferNormal');
        return this.#gBuffers.get('gBufferNormal')?.textureView
    }

    /**
     * G-Buffer normal resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferNormalResolveTextureView(): GPUTextureView {
        return this.#gBuffers.get('gBufferNormal')?.resolveTextureView
    }

    /**
     * G-Buffer 모션 벡터 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferMotionVectorTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferMotionVector')?.texture
    }

    /**
     * G-Buffer 모션 벡터 resolve 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferMotionVectorResolveTexture(): GPUTexture {
        return this.#gBuffers.get('gBufferMotionVector')?.resolveTexture
    }

    /**
     * G-Buffer 모션 벡터 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferMotionVectorTextureView(): GPUTextureView {
        this.#createGBuffer('gBufferMotionVector', 'rgba16float');
        return this.#gBuffers.get('gBufferMotionVector')?.textureView
    }

    /**
     * G-Buffer 모션 벡터 resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferMotionVectorResolveTextureView(): GPUTextureView {
        return this.#gBuffers.get('gBufferMotionVector')?.resolveTextureView
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
            this.#gBuffers.get('gBufferColor')?.texture,
            this.#gBuffers.get('gBufferColor')?.resolveTexture,
            this.#depthTexture,
            this.#renderPath1ResultTexture,
            this.#gBuffers.get('gBufferNormal')?.texture,
            this.#gBuffers.get('gBufferNormal')?.resolveTexture,
        ].filter(Boolean);
        this.#videoMemorySize = textures.reduce((total, texture) => {
            const videoMemory = calculateTextureByteSize(texture)
            return total + videoMemory
        }, 0)
    }

    /**
     * 지정된 G-Buffer 타입의 텍스처를 생성하거나 필요 시 재생성합니다.
     * - 타입 예: 'gBufferColor', 'gBufferNormal', 'gBufferMotionVector'
     * - format을 전달하면 해당 포맷으로 생성합니다 (예: 'rgba16float').
     *
     * 생성 기준:
     *  - 기존 텍스처가 없을 때
     *  - 뷰의 픽셀 크기가 변경되었을 때
     *  - MSAA 사용 여부가 변경되었을 때
     *
     * @private
     * @param {string} type - G-Buffer 식별자
     * @param {GPUTextureFormat} [format] - (선택) 텍스처 포맷
     */
    #createGBuffer(type: string, format?: GPUTextureFormat) {
        const {antialiasingManager, resourceManager} = this.#redGPUContext
        const {useMSAA} = antialiasingManager
        const targetInfo = this.#gBuffers.get(type)
        const currentTexture = targetInfo?.texture;
        const {pixelRectObject, name} = this.#view
        const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
        const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
        const changeUseMSAA = this.#gBuffersMSAAState[type] !== useMSAA
        const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
        this.#gBuffersMSAAState[type] = useMSAA
        if (needCreateTexture) {
            keepLog(`새 텍스처 생성 중: ${type}`)
            // 기존 텍스처 정리
            if (currentTexture) {
                currentTexture?.destroy()
                targetInfo.texture = null
                targetInfo.textureView = null
                targetInfo.resolveTexture?.destroy()
                targetInfo.resolveTexture = null
                targetInfo.resolveTextureView = null
                this.#gBuffers.delete(type)
            }
            // 새로운 텍스처 정보 객체 생성
            const newInfo = {
                texture: null,
                textureView: null,
                resolveTexture: null,
                resolveTextureView: null,
            }
            // 메인 텍스처 생성
            const newTexture = resourceManager.createManagedTexture({
                size: [
                    Math.max(pixelRectObjectW, 1),
                    Math.max(pixelRectObjectH, 1),
                    1
                ],
                sampleCount: useMSAA ? 4 : 1,
                label: `${name}_${type}_texture_${pixelRectObjectW}x${pixelRectObjectH}`,
                format: format || navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
            })
            newInfo.texture = newTexture;
            newInfo.textureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
            // MSAA 사용 시 Resolve 텍스처 생성
            if (useMSAA) {
                const newResolveTexture = resourceManager.createManagedTexture({
                    size: {
                        width: Math.max(pixelRectObjectW, 1),
                        height: Math.max(pixelRectObjectH, 1),
                        depthOrArrayLayers: 1
                    },
                    sampleCount: 1,
                    label: `${name}_${type}_resolveTexture_${pixelRectObjectW}x${pixelRectObjectH}`,
                    format: format || navigator.gpu.getPreferredCanvasFormat(),
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
                })
                newInfo.resolveTexture = newResolveTexture
                newInfo.resolveTextureView = resourceManager.getGPUResourceBitmapTextureView(newResolveTexture)
            }
            this.#gBuffers.set(type, newInfo)
            this.#checkVideoMemorySize()
        }
    }

    /**
     * 렌더 패스(또는 후처리) 결과를 담을 렌더 패스1 결과 텍스처를 생성하거나 재생성합니다.
     * - 기존 텍스처가 없거나 뷰 크기가 변경되면 재생성합니다.
     * - 생성 시 mipLevelCount를 계산하여 descriptor에 반영합니다.
     *
     * @private
     */
    #createRender2PathTexture(format: GPUTextureFormat) {
        const {resourceManager} = this.#redGPUContext
        const currentTexture = this.#renderPath1ResultTexture
        const {pixelRectObject, name} = this.#view
        const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
        const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
        const needCreateTexture = !currentTexture || changedSize
        if (needCreateTexture) {
            // 기존 텍스처 정리
            if (currentTexture) {
                this.#renderPath1ResultTexture = null
                this.#renderPath1ResultTextureView = null
            }
            // 텍스처 디스크립터 생성
            this.#renderPath1ResultTextureDescriptor = {
                size: {
                    width: Math.max(1, pixelRectObjectW),
                    height: Math.max(1, pixelRectObjectH),
                    depthOrArrayLayers: 1
                },
                format: format,
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT |
                    GPUTextureUsage.COPY_SRC,
                mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH),
                label: `${name}_renderPath1ResultTexture_${pixelRectObjectW}x${pixelRectObjectH}`
            }
            // 텍스처 및 텍스처 뷰 생성
            this.#renderPath1ResultTexture = resourceManager.createManagedTexture(this.#renderPath1ResultTextureDescriptor);
            this.#renderPath1ResultTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#renderPath1ResultTexture)
            this.#checkVideoMemorySize()
            requestAnimationFrame(() => {
                currentTexture?.destroy()
            })
        }
    }

    /**
     * 깊이 텍스처를 생성하거나 재생성합니다.
     * - MSAA 사용 여부 및 뷰 크기 변경에 따라 재생성됩니다.
     *
     * @private
     */
    #createDepthTexture(): void {
        const {antialiasingManager, resourceManager} = this.#redGPUContext
        const {useMSAA} = antialiasingManager
        const currentTexture = this.#depthTexture;
        const {pixelRectObject, name} = this.#view
        const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
        const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
        const changeUseMSAA = this.#gBuffersMSAAState['depth'] !== useMSAA
        const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
        this.#gBuffersMSAAState['depth'] = useMSAA
        if (needCreateTexture) {
            // 기존 텍스처 정리
            if (currentTexture) {
                currentTexture?.destroy()
                this.#depthTexture2?.destroy()
                this.#depthTexture = null
                this.#depthTexture2 = null
                this.#depthTextureView = null
                this.#depthTexture2View = null
            }
            // 새로운 깊이 텍스처 생성
            const newTexture = resourceManager.createManagedTexture({
                size: [
                    Math.max(pixelRectObjectW, 1),
                    Math.max(pixelRectObjectH, 1),
                    1
                ],
                sampleCount: useMSAA ? 4 : 1,
                label: `${name}_depth0_${pixelRectObjectW}x${pixelRectObjectH}`,
                format: 'depth32float',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
            })
            this.#depthTexture = newTexture;
            this.#depthTextureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
            {
                const newTexture = resourceManager.createManagedTexture({
                    size: [
                        Math.max(pixelRectObjectW, 1),
                        Math.max(pixelRectObjectH, 1),
                        1
                    ],
                    sampleCount: useMSAA ? 4 : 1,
                    label: `${name}_depth1_${pixelRectObjectW}x${pixelRectObjectH}`,
                    format: 'depth32float',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
                })
                this.#depthTexture2 = newTexture;
                this.#depthTexture2View = resourceManager.getGPUResourceBitmapTextureView(newTexture);
            }
            this.#checkVideoMemorySize()
        }
    }
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
