import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import throwError from "../util/errorFunc/throwError";
import PostEffectManager from "./PostEffectManager";

class PostEffectBase extends RedGPUContextBase {
    #subPassList:[]=[]
    get subPassList(): [] {
        return this.#subPassList;
    }

    uniformsBindGroupLayout: GPUBindGroupLayout
    uniformBindGroup: GPUBindGroup
    pipeline: GPURenderPipeline

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }
    render(postEffectManager:PostEffectManager,sourceTextureView:GPUTextureView):GPUTextureView{
        throwError('Must Override')
        return
    }
}

export default PostEffectBase
