import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";

/**
 * [KO] DOF 통합 블러 및 합성 이펙트입니다.
 * [EN] DOF unified blur and compositing effect.
 * @category Lens
 */
class DOFUnified extends ASinglePassPostEffect {
    #nearBlurSize: number = 16;
    #farBlurSize: number = 24;
    #nearStrength: number = 1.0;
    #farStrength: number = 1.0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this;
        const computeCode = `
            struct Uniforms {
                nearBlurSize: f32,
                farBlurSize: f32,
                nearStrength: f32,
                farStrength: f32,
            };
            
            @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba16float,read>;
            @group(0) @binding(1) var cocTexture : texture_storage_2d<rgba16float,read>;
            @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
            @group(1) @binding(1) var<uniform> uniforms: Uniforms;
            
            /* CoC 디코딩 함수 */
            fn decodeCoC(encoded: f32) -> f32 {
                /* 0~1 범위를 -1~1 범위로 복원 */
                return encoded * 2.0 - 1.0;
            }
            
            @compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
            fn main (@builtin(global_invocation_id) global_id : vec3<u32>) {
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                
                if (index.x >= dimensions.x || index.y >= dimensions.y) {
                    return;
                }
                
                let originalSample = textureLoad(sourceTexture, index);
                let originalColor = originalSample.rgb;
                let originalAlpha = originalSample.a;
                let encodedCoC = textureLoad(cocTexture, index).a;
                
                /* CoC 값 디코딩 */
                let cocValue = decodeCoC(encodedCoC);
                
                /* CoC 임계값 체크 */
                if (abs(cocValue) < 0.005) {
                    textureStore(outputTexture, index, vec4<f32>(originalColor, originalAlpha));
                    return;
                }
                
                var finalColor = originalColor;
                var finalAlpha = originalAlpha;
                
                /* Near blur 처리 (CoC < 0) */
                if (cocValue < 0.0) {
                    let blurResult = calculateBlur(index, abs(cocValue), uniforms.nearBlurSize, true);
                    let nearBlur = blurResult.rgb;
                    let nearBlurAlpha = blurResult.a;
                    /* Near strength 블렌딩 개선 - 더 강한 효과 */
                    let nearBlend = saturate(pow(abs(cocValue) * uniforms.nearStrength, 0.7));
                    finalColor = mix(originalColor, nearBlur, nearBlend);
                    finalAlpha = mix(originalAlpha, nearBlurAlpha, nearBlend);
                }
                /* Far blur 처리 (CoC > 0) */
                else if (cocValue > 0.0) {
                    let blurResult = calculateBlur(index, cocValue, uniforms.farBlurSize, false);
                    let farBlur = blurResult.rgb;
                    let farBlurAlpha = blurResult.a;
                    let rawBlend = cocValue * uniforms.farStrength;
                    let farBlend = saturate(smoothstep(0.0, 0.8, rawBlend));
                    finalColor = mix(originalColor, farBlur, farBlend);
                    finalAlpha = mix(originalAlpha, farBlurAlpha, farBlend);
                }
                
                textureStore(outputTexture, index, vec4<f32>(finalColor, finalAlpha));
            }
            
            fn calculateBlur(center: vec2<u32>, intensity: f32, maxBlurSize: f32, isNear: bool) -> vec4<f32> {
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                let blurRadius = intensity * maxBlurSize;
                
                /* 최소 블러 반경 조정 */
                if (blurRadius < 0.3) {
                    return textureLoad(sourceTexture, center);
                }
                
                var sum: vec3<f32> = vec3<f32>(0.0);
                var sumAlpha: f32 = 0.0;
                var totalWeight = 0.0;
                
                let maxRadius = min(blurRadius, maxBlurSize);
                /* Near blur에 더 많은 샘플 적용 */
                let samples = select(8, 16, isNear); /* near=16, far=8 */
                let angleStep = 6.28318530718 / f32(samples);
                
                let originalSample = textureLoad(sourceTexture, center);
                let originalColor = originalSample.rgb;
                let originalAlpha = originalSample.a;
                /* Near blur에 더 강한 중앙 가중치 */
                let centerWeight = select(0.4, 0.2, isNear); /* near=0.2, far=0.4 */
                sum += originalColor * centerWeight;
                sumAlpha += originalAlpha * centerWeight;
                totalWeight += centerWeight;
                
                /* 방사형 샘플링 */
                for (var i = 0; i < samples; i = i + 1) {
                    for (var r = 1.0; r <= maxRadius; r = r + 1.0) {
                        let angle = f32(i) * angleStep;
                        let offset = vec2<f32>(cos(angle) * r, sin(angle) * r);
                        
                        let samplePos = vec2<i32>(
                            clamp(i32(f32(center.x) + offset.x), 0, i32(dimensions.x) - 1),
                            clamp(i32(f32(center.y) + offset.y), 0, i32(dimensions.y) - 1)
                        );
                        
                        let sampleData = textureLoad(sourceTexture, vec2<u32>(samplePos));
                        let sampleColor = sampleData.rgb;
                        let sampleAlpha = sampleData.a;
                        let sampleEncodedCoC = textureLoad(cocTexture, vec2<u32>(samplePos)).a;
                        let sampleCoC = decodeCoC(sampleEncodedCoC); /* 디코딩 추가 */
                        
                        /* 가우시안 가중치 */
                        var weight = exp(-r * r / (maxRadius * maxRadius * 0.5));
                        
                        /* CoC 기반 가중치 조정 */
                        if (isNear) {
                            /* Near blur: 더 강한 조건으로 가중치 증가 */
                            if (sampleCoC < 0.0 && abs(sampleCoC) >= intensity * 0.5) {
                                weight *= 1.5;
                            }
                        } else {
                            /* Far blur: 기존 조건 유지 */
                            if (sampleCoC > 0.0 && sampleCoC >= intensity * 0.7) {
                                weight *= 1.2;
                            }
                        }
                        
                        sum += sampleColor * weight;
                        sumAlpha += sampleAlpha * weight;
                        totalWeight += weight;
                    }
                }
                
                /* 추가 근거리 샘플링 (near blur만) */
                if (isNear && maxRadius > 2.0) {
                    let additionalSamples = 8;
                    let innerRadius = maxRadius * 0.3;
                    let innerAngleStep = 6.28318530718 / f32(additionalSamples);
                    
                    for (var i = 0; i < additionalSamples; i = i + 1) {
                        let angle = f32(i) * innerAngleStep + 0.5; /* 약간의 오프셋 */
                        let offset = vec2<f32>(cos(angle) * innerRadius, sin(angle) * innerRadius);
                        
                        let samplePos = vec2<i32>(
                            clamp(i32(f32(center.x) + offset.x), 0, i32(dimensions.x) - 1),
                            clamp(i32(f32(center.y) + offset.y), 0, i32(dimensions.y) - 1)
                        );
                        
                        let sampleData = textureLoad(sourceTexture, vec2<u32>(samplePos));
                        let sampleColor = sampleData.rgb;
                        let sampleAlpha = sampleData.a;
                        let weight = 0.8;
                        
                        sum += sampleColor * weight;
                        sumAlpha += sampleAlpha * weight;
                        totalWeight += weight;
                    }
                }
                
                if (totalWeight > 0.0) {
                    return vec4<f32>(sum / totalWeight, sumAlpha / totalWeight);
                } else {
                    return vec4<f32>(originalColor, originalAlpha);
                }
            }
        `;
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_UNIFIED',
            {
                msaa: computeCode,
                nonMsaa: computeCode
            }
        );
        this.nearBlurSize = this.#nearBlurSize;
        this.farBlurSize = this.#farBlurSize;
        this.nearStrength = this.#nearStrength;
        this.farStrength = this.#farStrength;
    }

    get nearBlurSize(): number {
        return this.#nearBlurSize;
    }

    set nearBlurSize(value: number) {
        validateNumberRange(value);
        this.#nearBlurSize = value;
        this.updateUniform('nearBlurSize', value)
    }

    get farBlurSize(): number {
        return this.#farBlurSize;
    }

    set farBlurSize(value: number) {
        validateNumberRange(value);
        this.#farBlurSize = value;
        this.updateUniform('farBlurSize', value)
    }

    get nearStrength(): number {
        return this.#nearStrength;
    }

    set nearStrength(value: number) {
        validateNumberRange(value);
        this.#nearStrength = value;
        this.updateUniform('nearStrength', value)
    }

    get farStrength(): number {
        return this.#farStrength;
    }

    set farStrength(value: number) {
        validateNumberRange(value);
        this.#farStrength = value;
        this.updateUniform('farStrength', value)
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, cocTextureInfo: ASinglePassPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, cocTextureInfo);
    }
}

Object.freeze(DOFUnified);
export default DOFUnified;
