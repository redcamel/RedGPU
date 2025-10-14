import validateNumberRange from "../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import createBasicPostEffectCode from "./core/createBasicPostEffectCode";
class FXAA extends ASinglePassPostEffect {
    #subpix = 0.75;
    #edgeThreshold = 0.166;
    #edgeThresholdMin = 0.0833;
    constructor(redGPUContext) {
        super(redGPUContext);
        const computeCode = `
let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

var colorC = textureLoad(sourceTexture, index);
var colorN = textureLoad(sourceTexture, vec2<u32>(index.x, u32(max(i32(index.y) - 1, 0))));
var colorS = textureLoad(sourceTexture, vec2<u32>(index.x, u32(min(i32(index.y) + 1, i32(dimH - 1)))));
var colorW = textureLoad(sourceTexture, vec2<u32>(u32(max(i32(index.x) - 1, 0)), index.y));
var colorE = textureLoad(sourceTexture, vec2<u32>(u32(min(i32(index.x) + 1, i32(dimW - 1))), index.y));

let lumaC = dot(colorC.rgb, vec3<f32>(0.299, 0.587, 0.114));
let lumaN = dot(colorN.rgb, vec3<f32>(0.299, 0.587, 0.114));
let lumaS = dot(colorS.rgb, vec3<f32>(0.299, 0.587, 0.114));
let lumaW = dot(colorW.rgb, vec3<f32>(0.299, 0.587, 0.114));
let lumaE = dot(colorE.rgb, vec3<f32>(0.299, 0.587, 0.114));

let lumaMin = min(lumaC, min(min(lumaN, lumaS), min(lumaW, lumaE)));
let lumaMax = max(lumaC, max(max(lumaN, lumaS), max(lumaW, lumaE)));
let range = lumaMax - lumaMin;

let edgeThreshold = uniforms.edgeThreshold;
let edgeThresholdMin = uniforms.edgeThresholdMin;
let subpix = uniforms.subpix;

if (range < edgeThresholdMin) {
textureStore(outputTexture, index, colorC);
return;
}

let blurredColor = (colorN.rgb + colorS.rgb + colorW.rgb + colorE.rgb + colorC.rgb) * 0.2;

let blendAmount = min(1.0, range * 50.0 + 0.5) * subpix;

let finalColor = mix(colorC.rgb, blurredColor, blendAmount);

textureStore(outputTexture, index, vec4<f32>(finalColor, colorC.a));
`;
        const uniformStructCode = `
struct Uniforms {
  subpix: f32,
  edgeThreshold: f32,
  edgeThresholdMin: f32 
};
`;
        this.init(redGPUContext, 'POST_EFFECT_FXAA', createBasicPostEffectCode(this, computeCode, uniformStructCode));
        this.subpix = this.#subpix;
        this.edgeThreshold = this.#edgeThreshold;
        this.edgeThresholdMin = this.#edgeThresholdMin;
    }
    get subpix() {
        return this.#subpix;
    }
    set subpix(value) {
        validateNumberRange(value, 0, 1);
        this.#subpix = value;
        this.updateUniform('subpix', value);
    }
    get edgeThreshold() {
        return this.#edgeThreshold;
    }
    set edgeThreshold(value) {
        validateNumberRange(value, 0.0001, 0.25);
        this.#edgeThreshold = value;
        this.updateUniform('edgeThreshold', value);
    }
    get edgeThresholdMin() {
        return this.#edgeThresholdMin;
    }
    set edgeThresholdMin(value) {
        validateNumberRange(value, 0.00001, 0.1);
        this.#edgeThresholdMin = value;
        this.updateUniform('edgeThresholdMin', value);
    }
}
Object.freeze(FXAA);
export default FXAA;
