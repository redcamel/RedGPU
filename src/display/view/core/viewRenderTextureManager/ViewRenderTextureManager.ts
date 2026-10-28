import keepLog from "../../../../utils/keepLog";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import View3D from "../../View3D";
import GBUFFER_TYPE from "../GBUFFER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";

const DEPTH0: GBUFFER_INNER_TYPE = 'depthTexture0'
const DEPTH1: GBUFFER_INNER_TYPE = 'depthTexture1'

type GBUFFER_INNER_TYPE = 'depthTexture0' | 'depthTexture1';

/**
 * [KO] G-Buffer 텍스처 및 관련 뷰 정보를 정의하는 타입입니다.
 * [EN] Type defining G-Buffer texture and related view information.
 *
 * @category Core
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
     * [KO] MSAA Resolve 대상 GPU 텍스처 객체
     * [EN] Resolve target GPU texture object for MSAA
     */
    resolveTexture?: GPUTexture,
    /**
     * [KO] MSAA Resolve 대상 GPU 텍스처 뷰 객체
     * [EN] Resolve target GPU texture view object for MSAA
     */
    resolveTextureView?: GPUTextureView,
    /**
     * [KO] MSAA Resolve 대상 GPU 텍스처 디스크립터
     * [EN] Resolve target GPU texture descriptor for MSAA
     */
    resolveTextureDescriptor?: GPUTextureDescriptor,
}
const BASIC_USAGE = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC

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
    [GBUFFER_TYPE.MOTION_VECTOR]: {format: 'rg16float', usage: BASIC_USAGE, withResolve: true, useMipmap: false},
    [GBUFFER_TYPE.NORMAL]: {usage: BASIC_USAGE, withResolve: true, useMipmap: false},
    [GBUFFER_TYPE.RENDER_PATH1_RESULT]: {
        format: 'rgba16float',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        withResolve: false,
        useMipmap: true
    },
    [GBUFFER_TYPE.RENDER_PATH1_DEPTH_RESULT]: {
        format: 'depth32float',
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
        withResolve: false,
        useMipmap: false
    }
};

/**
 * [KO] View3D/View2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.
 * [EN] Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/View2D.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D 인스턴스를 통해 접근
 * // [EN] Access via View3D instance
 * const viewRenderTextureManager = view.viewRenderTextureManager;
 * ```
 *
 * @category Core
 */
class ViewRenderTextureManager extends RedGPUObject {
    #videoMemorySize: number = 0
    #view: View3D
    #gBuffers: Map<string, GBufferInfo> = new Map()
    #lastUpdateMSAAID: string
    #targetTextureSize: GPUExtent3DDict
    #targetTextureSizeString: string
    #depthResolvePipeline: GPURenderPipeline | null = null;
    #depthResolveBindGroupLayout: GPUBindGroupLayout | null = null;
    #depthResolveBindGroupMap: Map<GPUTextureView, GPUBindGroup> = new Map();
    #depthResolveRenderPassDescriptor: GPURenderPassDescriptor = {
        label: 'DepthResolveMSAA Render Pass',
        colorAttachments: [],
        depthStencilAttachment: {
            view: null as any,
            depthClearValue: 1.0,
            depthLoadOp: GPU_LOAD_OP.CLEAR,
            depthStoreOp: GPU_STORE_OP.STORE,
        }
    };

    /**
     * [KO] ViewRenderTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a ViewRenderTextureManager instance.
     *
     * @param view -
     * [KO] 이 매니저가 관리할 View3D 인스턴스
     * [EN] View3D instance this manager will manage
     */
    constructor(view: View3D) {
        super(view.redGPUContext)
        this.#view = view
    }

    /**
     * [KO] G-Buffer 맵(`Map<string, GBufferInfo>`)을 반환합니다.
     * [EN] Returns the G-Buffer map (`Map<string, GBufferInfo>`).
     *
     * @returns
     * [KO] G-Buffer 정보 맵
     * [EN] G-Buffer information map
     */
    get gBuffers(): Map<string, GBufferInfo> {
        return this.#gBuffers;
    }

    /**
     * [KO] 현재 관리 중인 렌더 텍스처들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the currently managed render textures.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (바이트)
     * [EN] Video memory usage (bytes)
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 1차 렌더 패스 결과 텍스처의 디스크립터를 반환합니다.
     * [EN] Returns the texture descriptor of the render path 1 result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처 디스크립터
     * [EN] Render path 1 result texture descriptor
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
        return this.#gBuffers.get(GBUFFER_TYPE.RENDER_PATH1_RESULT)?.textureDescriptor;
    }

    /**
     * [KO] 현재 프레임의 깊이(Depth) 텍스처를 반환합니다.
     * [EN] Returns the depth texture of the current frame.
     *
     * @returns
     * [KO] 현재 깊이 텍스처
     * [EN] Current depth texture
     */
    get depthTexture(): GPUTexture {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.texture : this.#gBuffers.get(DEPTH0)?.texture;
    }

    /**
     * [KO] 현재 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view of the current frame.
     *
     * @returns
     * [KO] 현재 깊이 텍스처 뷰
     * [EN] Current depth texture view
     */
    get depthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH1)?.textureView : this.#gBuffers.get(DEPTH0)?.textureView;
    }

    /**
     * [KO] 이전 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view of the previous frame.
     *
     * @returns
     * [KO] 이전 프레임 깊이 텍스처 뷰
     * [EN] Previous frame depth texture view
     */
    get prevDepthTextureView(): GPUTextureView {
        this.#update();
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gBuffers.get(DEPTH0)?.textureView : this.#gBuffers.get(DEPTH1)?.textureView;
    }

    /**
     * [KO] 첫 번째 깊이 텍스처(`depthTexture0`)의 뷰를 반환합니다.
     * [EN] Returns the view of the first depth texture (`depthTexture0`).
     *
     * @returns
     * [KO] 첫 번째 깊이 텍스처 뷰
     * [EN] First depth texture view
     */
    get depthTexture0View(): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(DEPTH0)?.textureView
    }

    /**
     * [KO] 두 번째 깊이 텍스처(`depthTexture1`)의 뷰를 반환합니다.
     * [EN] Returns the view of the second depth texture (`depthTexture1`).
     *
     * @returns
     * [KO] 두 번째 깊이 텍스처 뷰
     * [EN] Second depth texture view
     */
    get depthTexture1View(): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(DEPTH1)?.textureView
    }

    /**
     * [KO] 1차 렌더 패스 컬러 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 color result texture view.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처 뷰
     * [EN] Render path 1 result texture view
     */
    get renderPath1ResultTextureView(): GPUTextureView {
        return this.getGBufferTextureView(GBUFFER_TYPE.RENDER_PATH1_RESULT);
    }

    /**
     * [KO] 1차 렌더 패스 컬러 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 color result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처
     * [EN] Render path 1 result texture
     */
    get renderPath1ResultTexture(): GPUTexture {
        return this.getGBufferTexture(GBUFFER_TYPE.RENDER_PATH1_RESULT);
    }

    /**
     * [KO] 1차 렌더 패스 깊이 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 depth result texture view.
     *
     * @returns
     * [KO] 1차 렌더 패스 깊이 결과 텍스처 뷰
     * [EN] Render path 1 depth result texture view
     */
    get renderPath1DepthResultTextureView(): GPUTextureView {
        return this.getGBufferTextureView(GBUFFER_TYPE.RENDER_PATH1_DEPTH_RESULT);
    }

    /**
     * [KO] 1차 렌더 패스 깊이 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 depth result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 깊이 결과 텍스처
     * [EN] Render path 1 depth result texture
     */
    get renderPath1DepthResultTexture(): GPUTexture {
        return this.getGBufferTexture(GBUFFER_TYPE.RENDER_PATH1_DEPTH_RESULT);
    }

    /**
     * [KO] 1차 렌더 패스의 깊이 버퍼를 2차 패스 참조용 `renderPath1DepthResultTexture`에 복사 또는 MSAA 리졸브합니다.
     * [EN] Copies or MSAA-resolves the depth buffer of render path 1 into `renderPath1DepthResultTexture` for reading in path 2.
     *
     * @param encoder -
     * [KO] GPUCommandEncoder 인스턴스
     * [EN] GPUCommandEncoder instance
     */
    copyDepthToRenderPath1(encoder: GPUCommandEncoder): void {
        const sourceDepthTexture = this.depthTexture;
        const renderPath1DepthResultTexture = this.renderPath1DepthResultTexture;
        if (!sourceDepthTexture || !renderPath1DepthResultTexture) return;

        const {antialiasingManager} = this;
        if (antialiasingManager.useMSAA) {
            this.#resolveDepthMSAA(encoder);
        } else {
            encoder.copyTextureToTexture(
                {texture: sourceDepthTexture},
                {texture: renderPath1DepthResultTexture},
                {width: this.#targetTextureSize.width, height: this.#targetTextureSize.height, depthOrArrayLayers: 1}
            );
        }
    }

    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the G-Buffer texture of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] G-Buffer GPU 텍스처
     * [EN] G-Buffer GPU texture
     */
    getGBufferTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.texture;
    }

    /**
     * [KO] 지정된 타입의 MSAA Resolve G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the MSAA resolve G-Buffer texture of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] Resolve 대상 GPU 텍스처
     * [EN] Resolve target GPU texture
     */
    getGBufferResolveTexture(type: GBUFFER_TYPE): GPUTexture {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTexture;
    }

    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the G-Buffer texture view of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] G-Buffer GPU 텍스처 뷰
     * [EN] G-Buffer GPU texture view
     */
    getGBufferTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.textureView;
    }

    /**
     * [KO] 지정된 타입의 MSAA Resolve G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the MSAA resolve G-Buffer texture view of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] Resolve 대상 GPU 텍스처 뷰
     * [EN] Resolve target GPU texture view
     */
    getGBufferResolveTextureView(type: GBUFFER_TYPE): GPUTextureView {
        this.#update();
        return this.#gBuffers.get(type)?.resolveTextureView;
    }

    /**
     * [KO] 관리 중인 모든 G-Buffer 및 깊이 텍스처 리소스를 해제하고 매니저를 파기합니다.
     * [EN] Releases all managed G-Buffer and depth texture resources and destroys the manager.
     */
    destroy(): void {
        for (const key of this.#gBuffers.keys()) {
            this.#destroyGBuffer(key as any);
        }
        this.#gBuffers.clear();
        this.#depthResolveBindGroupMap.clear();
        this.#depthResolvePipeline = null;
        this.#depthResolveBindGroupLayout = null;
        if (this.#depthResolveRenderPassDescriptor.depthStencilAttachment) {
            (this.#depthResolveRenderPassDescriptor.depthStencilAttachment as any).view = null;
        }
        this.#view = null;
        console.log("🧹 ViewRenderTextureManager destroy 완료");
    }

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
        const renderPath1ResultTexture = this.#gBuffers.get(GBUFFER_TYPE.RENDER_PATH1_RESULT)?.texture
        const changedSize = renderPath1ResultTexture?.width !== this.#targetTextureSize.width || renderPath1ResultTexture?.height !== this.#targetTextureSize.height;
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID;

        if (changedSize || dirtyMSAA || !renderPath1ResultTexture) {
            this.#lastUpdateMSAAID = msaaID;
            renderViewStateData.swapBufferIndex = 0
            this.#depthResolveBindGroupMap.clear();

            this.#createDepthTexture(DEPTH0);
            this.#createDepthTexture(DEPTH1);

            for (const key in GBUFFER_TYPE) {
                this.#createGBuffer(GBUFFER_TYPE[key]);
            }

            this.#checkVideoMemorySize();
        }
    }

    #checkVideoMemorySize() {
        const textures = []
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
            targetInfo.resolveTexture = null
            targetInfo.resolveTextureView = null
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
        const sampleCount = (type === GBUFFER_TYPE.RENDER_PATH1_RESULT || type === GBUFFER_TYPE.RENDER_PATH1_DEPTH_RESULT) ? 1 : (useMSAA && mipLevelCount === 1 ? 4 : 1);
        const textureDescriptor = {
            size: this.#targetTextureSize,
            sampleCount,
            label: `${name}_${type}_texture_${this.#targetTextureSizeString}`,
            format: format,
            usage: sampleCount > 1 ? (usage & ~GPUTextureUsage.STORAGE_BINDING) : usage,
            mipLevelCount,
        }
        const newTexture = resourceManager.createManagedTexture(textureDescriptor)
        newInfo.textureDescriptor = textureDescriptor
        newInfo.texture = newTexture;
        newInfo.textureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);

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

    #createGBuffer(type: GBUFFER_TYPE) {
        keepLog(`새 텍스처 생성 중: ${type}`)

        let format = GBUFFER_FORMATS[type]?.format || navigator.gpu.getPreferredCanvasFormat();
        let {usage, withResolve, useMipmap} = GBUFFER_FORMATS[type];
        let mipLevelCount = useMipmap ? getMipLevelCount(this.#targetTextureSize.width, this.#targetTextureSize.height) : 1;

        this.#destroyGBuffer(type)
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type, format, usage, withResolve, mipLevelCount))
    }

    #createDepthTexture(type: GBUFFER_INNER_TYPE): void {
        this.#destroyGBuffer(type)
        keepLog(`새 텍스처 생성 중: ${type}`)
        const usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        this.#gBuffers.set(type, this.#createGBufferTextureAndTextureView(type, 'depth32float', usage, false))
    }

    #resolveDepthMSAA(encoder: GPUCommandEncoder): void {
        const sourceDepthView = this.depthTextureView;
        const targetDepthView = this.renderPath1DepthResultTextureView;
        if (!sourceDepthView || !targetDepthView) return;

        if (!this.#depthResolvePipeline) {
            this.#initDepthResolvePipeline();
        }

        let bindGroup = this.#depthResolveBindGroupMap.get(sourceDepthView);
        if (!bindGroup) {
            bindGroup = this.redGPUContext.gpuDevice.createBindGroup({
                label: 'DepthResolveMSAA BindGroup',
                layout: this.#depthResolveBindGroupLayout!,
                entries: [{binding: 0, resource: sourceDepthView}]
            });
            this.#depthResolveBindGroupMap.set(sourceDepthView, bindGroup);
        }

        (this.#depthResolveRenderPassDescriptor.depthStencilAttachment as GPURenderPassDepthStencilAttachment).view = targetDepthView;
        const passEncoder = encoder.beginRenderPass(this.#depthResolveRenderPassDescriptor);
        passEncoder.setPipeline(this.#depthResolvePipeline!);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();
    }

    #initDepthResolvePipeline(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        this.#depthResolveBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'DepthResolveMSAA BindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'depth', multisampled: true}
                }
            ]
        });

        const shaderModule = gpuDevice.createShaderModule({
            label: 'DepthResolveMSAA ShaderModule',
            code: `
                @group(0) @binding(0) var srcDepth: texture_depth_multisampled_2d;

                @vertex
                fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
                    var pos = array<vec2<f32>, 3>(
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>( 3.0, -1.0),
                        vec2<f32>(-1.0,  3.0)
                    );
                    return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                }

                @fragment
                fn fs_main(@builtin(position) pos: vec4<f32>) -> @builtin(frag_depth) f32 {
                    let coord = vec2<i32>(pos.xy);
                    return textureLoad(srcDepth, coord, 0);
                }
            `
        });

        this.#depthResolvePipeline = gpuDevice.createRenderPipeline({
            label: 'DepthResolveMSAA RenderPipeline',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#depthResolveBindGroupLayout]
            }),
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: []
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'always'
            },
            primitive: {
                topology: 'triangle-list'
            },
            multisample: {
                count: 1
            }
        });
    }

}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager