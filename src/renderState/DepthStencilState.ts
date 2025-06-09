import Mesh from "../display/mesh/Mesh";
import GPU_COMPARE_FUNCTION from "../gpuConst/GPU_COMPARE_FUNCTION";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const validateCompareList: GPUCompareFunction[] = Object.values(GPU_COMPARE_FUNCTION)

/**
 * Represents a manager for managing DepthStencil configuration for a GPU.
 */
class DepthStencilState {
    state: GPUDepthStencilState
    #targetObject3D: Mesh
    #format: GPUTextureFormat = 'depth32float';
    #formatValues: string[] = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];
    #depthWriteEnabled: boolean = true;
    #depthCompare?: GPUCompareFunction = GPU_COMPARE_FUNCTION.LESS_EQUAL;
    //
    #stencilFront?: GPUStencilFaceState;
    #stencilBack?: GPUStencilFaceState;
    #stencilReadMask?: number;
    #stencilWriteMask?: number;
    #depthBias?: GPUDepthBias;
    #depthBiasSlopeScale?: number;
    #depthBiasClamp?: number;

    constructor(targetObject3D: any) {
        this.#targetObject3D = targetObject3D
        this.#update()
    }

    get format(): GPUTextureFormat {
        return this.#format;
    }

    set format(value: GPUTextureFormat) {
        if (this.#formatValues.includes(value)) {
            this.#format = value;
            this.#update()
        } else consoleAndThrowError(`Invalid value for format. Received ${value}. Expected one of: ${this.#formatValues.join(", ")}`);
    }

    get depthWriteEnabled(): boolean {
        return this.#depthWriteEnabled;
    }

    set depthWriteEnabled(value: boolean) {
        this.#depthWriteEnabled = value;
        this.#update();
    }

    get depthCompare(): GPUCompareFunction {
        return this.#depthCompare
    }

    set depthCompare(value: GPUCompareFunction) {
        if (validateCompareList.includes(value)) {
            this.#depthCompare = value;
            this.#update();
        } else consoleAndThrowError(`Invalid value for depthCompare. Received ${value}. Expected one of: ${validateCompareList.join(", ")}`);
    }

    get stencilFront(): GPUStencilFaceState {
        return this.#stencilFront
    }

    set stencilFront(value: GPUStencilFaceState) {
        this.#stencilFront = value;
        this.#update();
    }

    get stencilBack(): GPUStencilFaceState {
        return this.#stencilBack
    }

    set stencilBack(value: GPUStencilFaceState) {
        this.#stencilBack = value;
        this.#update();
    }

    get stencilReadMask(): number {
        return this.#stencilReadMask
    }

    set stencilReadMask(value: number) {
        this.#stencilReadMask = value;
        this.#update();
    }

    get stencilWriteMask(): number {
        return this.#stencilWriteMask
    }

    set stencilWriteMask(value: number) {
        this.#stencilWriteMask = value;
        this.#update();
    }

    get depthBias(): GPUDepthBias {
        return this.#depthBias
    }

    set depthBias(value: GPUDepthBias) {
        this.#depthBias = value;
        this.#update();
    }

    get depthBiasSlopeScale(): number {
        return this.#depthBiasSlopeScale
    }

    set depthBiasSlopeScale(value: number) {
        this.#depthBiasSlopeScale = value;
        this.#update();
    }

    get depthBiasClamp(): number {
        return this.#depthBiasClamp
    }

    set depthBiasClamp(value: number) {
        this.#depthBiasClamp = value;
        this.#update();
    }

    #update() {
        this.state = {
            format: this.#format,
            depthWriteEnabled: this.#depthWriteEnabled,
            depthCompare: this.#depthCompare,
            stencilFront: this.#stencilFront,
            stencilBack: this.#stencilBack,
            stencilReadMask: this.#stencilReadMask,
            stencilWriteMask: this.#stencilWriteMask,
            depthBias: this.#depthBias,
            depthBiasSlopeScale: this.#depthBiasSlopeScale,
            depthBiasClamp: this.#depthBiasClamp
        }
        this.#targetObject3D.dirtyPipeline = true
    }
}

export default DepthStencilState;
