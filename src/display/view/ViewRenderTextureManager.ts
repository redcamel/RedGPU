import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import View3D from "./View3D";

class ViewRenderTextureManager {
    #colorTexture: GPUTexture
    #colorResolveTexture: GPUTexture
    #depthTexture: GPUTexture
    #colorTextureView: GPUTextureView
    #colorResolveTextureView: GPUTextureView
    #depthTextureView: GPUTextureView
    //
    #useMSAAColor: boolean = true
    #useMSAADepth: boolean = true
    readonly #redGPUContext: RedGPUContext
    readonly #view: View3D

    constructor(view: View3D) {
        validateRedGPUContext(view.redGPUContext)
        this.#redGPUContext = view.redGPUContext
        this.#view = view
    }

    get colorTexture(): GPUTexture {
        return this.#colorTexture;
    }

    get colorResolveTexture(): GPUTexture {
        return this.#colorResolveTexture;
    }

    get depthTexture(): GPUTexture {
        return this.#depthTexture;
    }

    get depthTextureView(): GPUTextureView {
        this.#createTextureIfNeeded('depth');
        return this.#depthTextureView;
    }

    get colorTextureView(): GPUTextureView {
        this.#createTextureIfNeeded('color');
        return this.#colorTextureView;
    }

    get colorResolveTextureView(): GPUTextureView {
        return this.#colorResolveTextureView;
    }

    #createTextureIfNeeded(textureType: 'depth' | 'color'): void {
        const depthYn = textureType === 'depth'
        const {useMSAA, gpuDevice} = this.#redGPUContext
        const currentTexture = depthYn ? this.#depthTexture : this.#colorTexture;
        const {pixelRectObject} = this.#view
        const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
        const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
        const changeUseMSAA = depthYn ? this.#useMSAADepth !== useMSAA : this.#useMSAAColor !== useMSAA
        const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
        if (depthYn) this.#useMSAADepth = useMSAA
        else this.#useMSAAColor = useMSAA
        if (needCreateTexture) {
            if (currentTexture) {
                currentTexture?.destroy()
                if (!depthYn) this.#colorResolveTexture?.destroy()
            }
            const newTexture = gpuDevice.createTexture({
                size: [
                    Math.max(pixelRectObjectW, 1),
                    Math.max(pixelRectObjectH, 1),
                    1
                ],
                sampleCount: useMSAA ? 4 : 1,
                format: depthYn ? 'depth24plus' : navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.RENDER_ATTACHMENT | (textureType === 'color' ? GPUTextureUsage.TEXTURE_BINDING : 0)
            })
            if (depthYn) {
                this.#depthTexture = newTexture;
                this.#depthTextureView = newTexture.createView();
            } else {
                this.#colorTexture = newTexture;
                this.#colorTextureView = newTexture.createView();
                if (useMSAA) {
                    const newResolveTexture = gpuDevice.createTexture({
                        size: {
                            width: Math.max(pixelRectObjectW, 1),
                            height: Math.max(pixelRectObjectH, 1),
                            depthOrArrayLayers: 1
                        },
                        sampleCount: 1,
                        format: navigator.gpu.getPreferredCanvasFormat(),
                        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
                    })
                    this.#colorResolveTexture = newResolveTexture
                    this.#colorResolveTextureView = newResolveTexture.createView()
                }
            }
        }
    }
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
