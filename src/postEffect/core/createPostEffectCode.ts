import ASinglePassPostEffect from "./ASinglePassPostEffect";

const createPostEffectCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '') => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect
    return `
			${uniformStruct}
      @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
      @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba8unorm, write>;
			${uniformStruct ? '@group(0) @binding(2) var<uniform> uniforms: Uniforms;' : ''}
      @compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
      fn main (
        @builtin(global_invocation_id) global_id : vec3<u32>,
      ){
          ${code}
      };
  `
}
Object.freeze(createPostEffectCode)
export default createPostEffectCode
