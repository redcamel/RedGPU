import RedGPUContext from "../../context/RedGPUContext";
import createUUID from "../../utils/createUUID";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import CubeTexture from "./CubeTexture";
import HDRTexture from "./hdr/HDRTexture";

class IBL {
	#redGPUContext: RedGPUContext
	#sourceCubeTexture: GPUTexture
	//
	#environmentTexture: CubeTexture;
	#irradianceTexture: CubeTexture;
	#prefilterMap: GPUTexture;
	#brdfLUT: GPUTexture;
	#uuid = createUUID()
	#useMipmap: boolean = true
	#format: GPUTextureFormat = 'rgba8unorm'

	constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], useMipmap: boolean = true) {
		this.#useMipmap = useMipmap
		this.#redGPUContext = redGPUContext
		this.#environmentTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		this.#irradianceTexture = new CubeTexture(redGPUContext, [], false, undefined, undefined, this.#format)
		if (typeof srcInfo === 'string') {
			new HDRTexture(
				redGPUContext,
				srcInfo,
				(v: HDRTexture) => {
					this.#sourceCubeTexture = v.gpuCubeTexture
					console.log('sourceCubeTexture', this.#sourceCubeTexture)
					this.#environmentTexture.setGPUTextureDirectly(this.#sourceCubeTexture, `${this.#uuid}_environmentTexture`)
					this.#init()
				},
			);
		} else {
			new CubeTexture(
				redGPUContext,
				srcInfo,
				useMipmap,
				(v: CubeTexture) => {
					this.#sourceCubeTexture = v.gpuTexture
					console.log('sourceCubeTexture', this.#sourceCubeTexture)
					this.#environmentTexture.setGPUTextureDirectly(this.#sourceCubeTexture, `${this.#uuid}_environmentTexture`)
					this.#init()
				}
			);
		}
	}

	get irradianceTexture(): CubeTexture {
		return this.#irradianceTexture;
	}

	get environmentTexture(): CubeTexture {
		return this.#environmentTexture;
	}

	async #init() {
		const irradianceGPUTexture = await this.#generateIrradianceMap(this.#sourceCubeTexture);
		this.#irradianceTexture.setGPUTextureDirectly(irradianceGPUTexture, `${this.#uuid}_irradianceTexture`, false);
	}

	async #generateIrradianceMap(sourceCubeTexture: GPUTexture): Promise<GPUTexture> {
		const {gpuDevice} = this.#redGPUContext;
		const irradianceSize = 32;
		const irradianceMipLevels = this.#useMipmap ? getMipLevelCount(irradianceSize, irradianceSize) : 1;
		const irradianceTexture = gpuDevice.createTexture({
			size: [irradianceSize, irradianceSize, 6],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: irradianceMipLevels,
			label: `${this.#uuid}_irradianceTexture`
		});
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
    vec2<f32>(1.0, 0.0), vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), 
    vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0), vec2<f32>(0.0, 1.0)  
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
          /* 텍스처 좌표를 NDC로 변환 [-1,1] 범위 */
          let ndc = vec2<f32>(
              input.texCoord.x * 2.0 - 1.0,
              1.0 - input.texCoord.y * 2.0  /* Y축 뒤집기 */
          );
      
          /* 로컬 방향 벡터 생성 (Z=1은 큐브 면의 깊이) */
          let localDirection = vec3<f32>(ndc.x, ndc.y, 1.0);
          
          /* 면 매트릭스로 월드 방향 변환 */
          let worldDirection = normalize((faceMatrix * vec4<f32>(localDirection, 0.0)).xyz);
          let normal = worldDirection;
      
          var irradiance = vec3<f32>(0.0);
          
          /* 탄젠트 공간 구성 */
          var up = vec3<f32>(0.0, 1.0, 0.0);

          let tangent = normalize(cross(up, normal));
          let bitangent = normalize(cross(normal, tangent));
          
          /* 적분 샘플링 */
          let sampleCount = 32u; 
          let invSampleCount = 1.0 / f32(sampleCount);
          
          for (var i = 0u; i < sampleCount; i++) {
              for (var j = 0u; j < sampleCount; j++) {
                  let u1 = (f32(i) + 0.5) * invSampleCount;
                  let u2 = (f32(j) + 0.5) * invSampleCount;
                  
                  let cosTheta = sqrt(u1);
                  let sinTheta = sqrt(1.0 - u1);
                  let phi = 2.0 * PI * u2;
                  
                  let cosPhi = cos(phi);
                  let sinPhi = sin(phi);
                  
                  let sampleVec = vec3<f32>(
                      sinTheta * cosPhi,
                      sinTheta * sinPhi,
                      cosTheta
                  );
                  
                  let worldSample = sampleVec.x * tangent + 
                                  sampleVec.y * bitangent + 
                                  sampleVec.z * normal;
                  
                  let sampleColor = textureSample(environmentTexture, environmentSampler, worldSample);
                  irradiance += sampleColor.rgb * cosTheta;
              }
          }
          
          irradiance = irradiance * PI * invSampleCount * invSampleCount;
          
          return vec4<f32>(irradiance, 1.0);
      }
  `
		});
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
		const sampler = gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		});
		const faceMatrices = this.#getCubeMapFaceMatrices();
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: 'irradiance_face_matrix_uniform'
		});
		/* 각 면마다 개별적으로 처리 */
		for (let face = 0; face < 6; face++) {
			/* 유니폼 버퍼에 현재 면의 매트릭스 작성 */
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrices[face]);
			const bindGroup = gpuDevice.createBindGroup({
				layout: irradiancePipeline.getBindGroupLayout(0),
				entries: [
					{binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
					{binding: 1, resource: sampler},
					{binding: 2, resource: {buffer: uniformBuffer}}
				]
			});
			/* 각 면마다 별도의 명령 인코더 생성 */
			const commandEncoder = gpuDevice.createCommandEncoder({
				label: `irradiance_face_${face}_encoder`
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
				}],
				label: `irradiance_face_${face}_renderpass`
			});
			renderPass.setPipeline(irradiancePipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
			/* 각 면마다 개별적으로 submit */
			gpuDevice.queue.submit([commandEncoder.finish()]);
		}
		/* 모든 작업 완료 후 유니폼 버퍼 정리 */
		uniformBuffer.destroy();
		console.log(`Irradiance Map 생성 완료: ${irradianceSize}x${irradianceSize}`);
		return irradianceTexture;
	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		// ✅ 수정된 큐브맵 면 매트릭스 (OpenGL 스타일)
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
