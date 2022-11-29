import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import throwError from "../util/errorFunc/throwError";

class PostEffectBase extends RedGPUContextBase {

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }
    render(){
        throwError('Must Override')
    }
}

export default PostEffectBase