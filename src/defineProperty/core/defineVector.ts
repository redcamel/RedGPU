import defineProperty_SETTING from "../old/funcs/defineProperty_SETTING";
import ABaseMaterial from "../../material/core/ABaseMaterial";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";

function createSetter(propertyKey: string, symbol: symbol) {
    return function (newValue: number[]) {
        this[symbol] = newValue;
        const {gpuRenderInfo} = this
        let targetUnformInfo;
        let targetUniformBuffer;
        if(this instanceof ABaseMaterial){
            targetUnformInfo = gpuRenderInfo.fragmentUniformInfo
            targetUniformBuffer = gpuRenderInfo.fragmentUniformBuffer
        }else if(this instanceof ASinglePassPostEffect){
            targetUnformInfo = this.uniformsInfo
            targetUniformBuffer = this.uniformBuffer
        }else if(gpuRenderInfo.vertexUniformInfo){
            targetUnformInfo = gpuRenderInfo.vertexUniformInfo
            targetUniformBuffer = gpuRenderInfo.vertexUniformBuffer
        }
        targetUniformBuffer.writeOnlyBuffer(targetUnformInfo.members[propertyKey], newValue)

    }
}

function defineVector(propertyKey: string, initValue: number[]) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): number[] {
            if (this[symbol] === undefined) this[symbol] = initValue
            return this[symbol]
        },
        set: createSetter(propertyKey, symbol),
        ...defineProperty_SETTING
    }
}

Object.freeze(defineVector)
export default defineVector;
