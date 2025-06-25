import RedGPUContext from "../../../context/RedGPUContext";
import createUUID from "../../../utils/createUUID";
import getMipLevelCount from "../../../utils/math/getMipLevelCount";
import CubeTexture from "../CubeTexture";

class IBL {
	#redGPUContext: RedGPUContext
	#sourceCubeTexture: GPUTexture
	//
	#environmentTexture: CubeTexture;
	#irradianceTexture: CubeTexture;
	#prefilterMap: GPUTexture;
	#brdfLUT: GPUTexture;
	#uuid = createUUID()
	#useMipmap:boolean=true
	#format:GPUTextureFormat = 'rgba8unorm'

	constructor(redGPUContext: RedGPUContext, sourceCubeTexture: GPUTexture,useMipmap:boolean=true) {
		this.#useMipmap = useMipmap
		this.#redGPUContext = redGPUContext
		this.#sourceCubeTexture = sourceCubeTexture
		this.#format = sourceCubeTexture.format
		console.log('sourceCubeTexture', sourceCubeTexture)

		this.#environmentTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		this.#irradianceTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)

		// Environment 텍스처는 바로 설정
		this.#environmentTexture.setGPUTextureDirectly(sourceCubeTexture, `${this.#uuid}_environmentTexture`)
		this.#init()
	}

	get irradianceTexture(): CubeTexture {
		return this.#irradianceTexture;
	}

	get environmentTexture(): CubeTexture {
		return this.#environmentTexture;
	}

	async #init(){
		const irradianceGPUTexture = await this.#generateIrradianceMap(this.#sourceCubeTexture);
		this.#irradianceTexture.setGPUTextureDirectly(irradianceGPUTexture, `${this.#uuid}_irradianceTexture`);

	}
	async #generateIrradianceMap(sourceCubeTexture: GPUTexture): Promise<GPUTexture> {
		const {gpuDevice} = this.#redGPUContext;
		const irradianceSize = 32; // 작은 크기로 충분
		const irradianceMipLevels = this.#useMipmap ? getMipLevelCount(irradianceSize, irradianceSize) : 1;
		const irradianceTexture = gpuDevice.createTexture({
			size: [irradianceSize, irradianceSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: irradianceMipLevels,
			label: `${this.#uuid}_irradianceTexture`
		});
		// ✅ Irradiance 계산용 셰이더 (구면 컨볼루션)
		const irradianceShader = gpuDevice.createShaderModule({
			code: `
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            @vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                var pos = array<vec2<f32>, 6>(
                    vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
                    vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
                );

                var texCoord = array<vec2<f32>, 6>(
                    vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0),
                    vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), vec2<f32>(1.0, 0.0)
                );

                var output: VertexOutput;
                output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                output.texCoord = texCoord[vertexIndex];
                return output;
            }

            @group(0) @binding(0) var environmentTexture: texture_cube<f32>;
            @group(0) @binding(1) var environmentSampler: sampler;
            @group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

            const PI = 3.14159265359;

            @fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
               
                let ndc = vec2<f32>(
                    input.texCoord.x * 2.0 - 1.0,
                    1.0 - input.texCoord.y * 2.0
                );

              
                var localDirection = vec3<f32>(ndc.x, ndc.y, 1.0);
                
              
                let worldDirection = normalize((faceMatrix * vec4<f32>(localDirection, 0.0)).xyz);
                let normal = worldDirection;

                
                var irradiance = vec3<f32>(0.0);
                var sampleCount = 0u;
                
             
                var up = vec3<f32>(0.0, 1.0, 0.0);
                if (abs(normal.y) > 0.999) {
                    up = vec3<f32>(0.0, 0.0, 1.0);
                }
                let tangent = normalize(cross(up, normal));
                let bitangent = cross(normal, tangent);
                
               
                let sampleDelta = 0.025; 
                
                for (var phi = 0.0; phi < 2.0 * PI; phi += sampleDelta) {
                    for (var theta = 0.0; theta < 0.5 * PI; theta += sampleDelta) {
                    
                        let sampleVec = vec3<f32>(
                            sin(theta) * cos(phi),
                            sin(theta) * sin(phi),
                            cos(theta)
                        );
                        
                      
                        let worldSample = sampleVec.x * tangent + 
                                        sampleVec.y * bitangent + 
                                        sampleVec.z * normal;
                        
                       
                        let sampleColor = textureSample(environmentTexture, environmentSampler, worldSample);
                        
                    
                        let cosTheta = cos(theta);
                        let sinTheta = sin(theta);
                        
                        irradiance += sampleColor.rgb * cosTheta * sinTheta;
                        sampleCount++;
                    }
                }
                
                irradiance = PI * irradiance / f32(sampleCount);
                
                return vec4<f32>(irradiance, 1.0);
            }
        `
		});
		// 렌더 파이프라인 생성
		const irradiancePipeline = gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: irradianceShader,
				entryPoint: 'vs_main'
			},
			fragment: {
				module: irradianceShader,
				entryPoint: 'fs_main',
				targets: [{format: this.#format}]
			},
			primitive: {
				topology: 'triangle-list'
			}
		});
		// 샘플러 생성 (선형 필터링)
		const sampler = gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		});
		const faceMatrices = this.#getCubeMapFaceMatrices();
		// ✅ 단일 버퍼를 재사용
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		const commandEncoder = gpuDevice.createCommandEncoder();
		for (let face = 0; face < 6; face++) {
			// ✅ 버퍼 내용만 업데이트 (재사용)
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrices[face]);
			const bindGroup = gpuDevice.createBindGroup({
				layout: irradiancePipeline.getBindGroupLayout(0),
				entries: [
					{binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
					{binding: 1, resource: sampler},
					{binding: 2, resource: {buffer: uniformBuffer}}
				]
			});
			const renderPass = commandEncoder.beginRenderPass({
				colorAttachments: [{
					view: irradianceTexture.createView({
						dimension: '2d',
						baseMipLevel: 0,
						mipLevelCount: 1,
						baseArrayLayer: face,
						arrayLayerCount: 1
					}),
					clearValue: {r: 0, g: 0, b: 0, a: 1},
					loadOp: 'clear',
					storeOp: 'store'
				}]
			});
			renderPass.setPipeline(irradiancePipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
		}
		// ✅ 모든 작업 후 submit
		gpuDevice.queue.submit([commandEncoder.finish()]);
		// ✅ 단일 버퍼만 정리
		uniformBuffer.destroy();
		console.log(`Irradiance Map 생성 완료: ${irradianceSize}x${irradianceSize}`);
		return irradianceTexture;
	}
	#getCubeMapFaceMatrices(): Float32Array[] {
		// 큐브맵 6면에 대한 뷰 매트릭스 정의
		return [
			// +X (Right)
			new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
			// -X (Left)
			new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
			// +Y (Top)
			new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
			// -Y (Bottom)
			new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
			// +Z (Front)
			new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]),
			// -Z (Back)
			new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
		];
	}

}

Object.freeze(IBL)
export default IBL;
