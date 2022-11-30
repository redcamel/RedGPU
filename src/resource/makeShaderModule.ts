import shaderDefineReplace from "../systemShaderDefine/shaderDefineReplace";

const draftCache = new Map()

const makeShaderModule = (device: GPUDevice, source: string, label: string = '') => {
    if (draftCache.has(source)) {
        // console.log('이미 생성된 모듈을 사용',label)
        return draftCache.get(source)
    }
    const shaderModuleDescriptor = {
        code: shaderDefineReplace(source),
        label
    };
    const t0 = device.createShaderModule(shaderModuleDescriptor);
    draftCache.set(source, t0)
    // console.log('신규 생성 모듈을 사용',label)
    // console.log('draftCache', draftCache, t0)
    // console.log(t0)
    return t0
}

export default makeShaderModule
