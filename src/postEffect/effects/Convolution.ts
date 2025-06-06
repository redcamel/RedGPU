import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createPostEffectCode from "../core/createPostEffectCode";

const NORMAL = ([
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0
]);
const SHARPEN = ([
    0, -1, 0, 0,
    -1, 5, -1, 0,
    0, -1, 0, 0,
])
const BLUR = ([
    1, 1, 1, 0,
    1, 1, 1, 0,
    1, 1, 1, 0
])
const EDGE = ([
    0, 1, 0, 0,
    1, -4, 1, 0,
    0, 1, 0, 0
]);
const EMBOSE = ([
    -2, -1, 0, 0,
    -1, 1, 1, 0,
    0, 1, 2, 0
]);

class Convolution extends ASinglePassPostEffect {
    static NORMAL = NORMAL
    static SHARPEN = SHARPEN
    static BLUR = BLUR
    static EDGE = EDGE
    static EMBOSE = EMBOSE
    #kernel: number[] = BLUR;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const computeCode = createPostEffectCode(
            this,
            `
							let index = vec2<i32>(global_id.xy );
							let dimensions: vec2<u32> = textureDimensions(sourceTexture);
							let dimW = f32(dimensions.x);
							let dimH = f32(dimensions.y);
							let perPX = 	vec2<f32>(1.0/dimW,1.0/dimH);
				      let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
							var color:vec4<f32> = vec4<f32>(0.0);
							let kernelWeight_value : f32 = uniforms.kernelWeight;
							let kernel_value : mat3x3<f32> = uniforms.kernel ;

							color += textureLoad(sourceTexture, index + vec2<i32>(-1,-1)) * kernel_value[0][0]  ;
							color += textureLoad(sourceTexture, index + vec2<i32>(0,-1)) * kernel_value[0][1] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(1,-1)) * kernel_value[0][2] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(-1,0)) * kernel_value[1][0] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(0,0)) * kernel_value[1][1] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(1,0)) * kernel_value[1][2] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(-1,1)) * kernel_value[2][0] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(0,1)) * kernel_value[2][1] ;
							color += textureLoad(sourceTexture, index + vec2<i32>(1,1)) * kernel_value[2][2] ;
							textureStore(outputTexture, index, vec4<f32>((color / kernelWeight_value).rgb, 1.0) );

		
			`,
            `
      struct Uniforms {
				kernelWeight:f32,
				kernel:mat3x3<f32>
			};
			`
        )
        this.init(
            redGPUContext,
            'POST_EFFECT_CONVOLUTION',
            computeCode
        )
        this.kernel = this.#kernel
    }

    get kernel(): number[] {
        return this.#kernel;
    }

    set kernel(value: number[]) {
        this.#kernel = value;
        let kernelWeight = 0;
        for (const k in this.#kernel) kernelWeight += this.#kernel[k];
        console.log('kernelWeight', kernelWeight);
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.kernelWeight, kernelWeight)
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.kernel, value)
    }
}

Object.freeze(Convolution)
export default Convolution

