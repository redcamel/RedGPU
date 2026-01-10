import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../resources/sampler/Sampler";
import parseWGSL from "../resources/wgslParser/parseWGSL";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import postEffectSystemUniformCode from "./core/postEffectSystemUniform.wgsl"
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
import TAASharpen from "./TAA/shapen/TAASharpen";
import ToneMapping from "./toneMapping/ToneMapping";

/**
 * 후처리 이펙트(PostEffect) 관리 클래스입니다.
 * 이펙트 추가/제거, 렌더링, 시스템 유니폼 관리, 비디오 메모리 계산 등 후처리 파이프라인을 통합적으로 제어합니다.
 * @category Core
 *
 */
class PostEffectManager {
    /** 연결된 View3D 인스턴스 (읽기 전용) */
    readonly #view: View3D
    /** 등록된 후처리 이펙트 리스트 */
    #postEffects: Array<ASinglePassPostEffect | AMultiPassPostEffect> = []
    /** 내부 스토리지 텍스처 */
    #storageTexture: GPUTexture
    /** 소스 텍스처 뷰 */
    #sourceTextureView: GPUTextureView
    /** 스토리지 텍스처 뷰 */
    #storageTextureView: GPUTextureView
    /** Compute 워크그룹 X 크기 */
    #COMPUTE_WORKGROUP_SIZE_X = 16
    /** Compute 워크그룹 Y 크기 */
    #COMPUTE_WORKGROUP_SIZE_Y = 4
    /** Compute 워크그룹 Z 크기 */
    #COMPUTE_WORKGROUP_SIZE_Z = 1
    /** Compute 셰이더 모듈 */
    #textureComputeShaderModule: GPUShaderModule
    /** Compute 바인드 그룹 */
    #textureComputeBindGroup: GPUBindGroup
    /** Compute 바인드 그룹 레이아웃 */
    #textureComputeBindGroupLayout: GPUBindGroupLayout
    /** Compute 파이프라인 */
    #textureComputePipeline: GPUComputePipeline
    /** 이전 프레임 텍스처 크기 */
    #previousDimensions: { width: number, height: number }
    /** 시스템 유니폼 버퍼 */
    #postEffectSystemUniformBuffer: UniformBuffer;
    /** 시스템 유니폼 버퍼 구조 정보 */
    #postEffectSystemUniformBufferStructInfo;
    /** 비디오 메모리 사용량 (byte) */
    #videoMemorySize: number = 0
    #uniformData: ArrayBuffer
    #uniformDataF32: Float32Array
    #uniformDataU32: Uint32Array
    #taaSharpenEffect: TAASharpen
    #ssao: SSAO;
    #useSSAO: boolean = false;
    #ssr: SSR;
    #useSSR: boolean = false;

    get toneMapping(): ToneMapping {

        if(!this.#toneMapping){
            this.#toneMapping = new ToneMapping(this.#view.redGPUContext)
        }
        return this.#toneMapping;
    }

    set toneMapping(value: ToneMapping) {
        this.#toneMapping = value;
    }

    #toneMapping:ToneMapping
    constructor(view: View3D) {
        this.#view = view;
        this.#init()
    }

    get useSSAO(): boolean {
        return this.#useSSAO;
    }

    set useSSAO(value: boolean) {
        this.#useSSAO = value;
        this.#checkSSAO()
    }

    get ssao(): SSAO {
        if (!this.#ssao) {
            this.#ssao = new SSAO(this.#view.redGPUContext)
        }
        return this.#ssao;
    }

    get useSSR(): boolean {
        return this.#useSSR;
    }

    set useSSR(value: boolean) {
        this.#useSSR = value;
        this.#checkSSR()
    }

    get ssr(): SSR {
        if (!this.#ssr) {
            this.#ssr = new SSR(this.#view.redGPUContext)
        }
        return this.#ssr;
    }

    get postEffectSystemUniformBuffer(): UniformBuffer {
        return this.#postEffectSystemUniformBuffer;
    }

    get view(): View3D {
        return this.#view;
    }

    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect> {
        return this.#postEffects;
    }

    get videoMemorySize(): number {
        this.#calcVideoMemory()
        return this.#videoMemorySize;
    }

    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        this.#postEffects.push(v)
    }

    addEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect {
        return this.#postEffects[index]
    }

    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    removeEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    removeAllEffect() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
        this.#postEffects.length = 0
    }


    render() {
        const {viewRenderTextureManager, redGPUContext, taa, fxaa} = this.#view;
        const {antialiasingManager} = redGPUContext
        const {useMSAA, useFXAA, useTAA} = antialiasingManager;
        const {gBufferColorTextureView, gBufferColorResolveTextureView, gBufferColorTexture} = viewRenderTextureManager;
        const {width, height} = gBufferColorTexture;
        // 초기 텍스처 설정 (MSAA 여부에 따라 소스 결정)
        const initialSourceView = useMSAA ? gBufferColorResolveTextureView : gBufferColorTextureView;
        this.#updateSystemUniforms()
        this.#sourceTextureView = this.#renderToStorageTexture(this.#view, initialSourceView);
        let currentTextureView = {
            texture: this.#storageTexture,
            textureView: this.#sourceTextureView,
        };
        this.#postEffects.forEach(effect => {
            currentTextureView = effect.render(
                this.#view,
                width,
                height,
                currentTextureView,
            );
        });
        if (useFXAA) {
            currentTextureView = fxaa.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        if (this.#useSSAO) {
            currentTextureView = this.ssao.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        if (this.#useSSR) {
            currentTextureView = this.ssr.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        {

            currentTextureView = this.toneMapping.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        currentTextureView = fxaa.render(
            this.#view,
            width,
            height,
            currentTextureView
        );
        if (useTAA) {
            if (this.#view.constructor.name === 'View3D') { // View2D에는 TAA적용 안함{
                currentTextureView = taa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                );
                if (!this.#taaSharpenEffect) {
                    this.#taaSharpenEffect = new TAASharpen(redGPUContext)
                }
                currentTextureView = this.#taaSharpenEffect.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                )
            } else {
                currentTextureView = fxaa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                );
            }
        }

        return currentTextureView;
    }

    clear() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
    }

    #checkSSAO() {
        if (!this.#ssao && this.#useSSAO) {
            this.#ssao = new SSAO(this.#view.redGPUContext)
        }
    }

    #checkSSR() {
        if (!this.#ssr && this.#useSSR) {
            this.#ssr = new SSR(this.#view.redGPUContext)
        }
    }

    #updateSystemUniformData(valueLust: { key, value, dataView, targetMembers }[]) {
        valueLust.forEach(({key, value, dataView, targetMembers}) => {
            const info = targetMembers[key]
            dataView.set(typeof value === 'number' ? [value] : value, info.uniformOffset / info.View.BYTES_PER_ELEMENT)
        })
    }

    #updateSystemUniforms() {
        const {inverseProjectionMatrix, projectionMatrix, rawCamera, redGPUContext, scene} = this.#view
        const {gpuDevice} = redGPUContext
        const {modelMatrix: cameraMatrix, position: cameraPosition} = rawCamera
        const structInfo = this.#postEffectSystemUniformBufferStructInfo
        const gpuBuffer = this.#postEffectSystemUniformBuffer.gpuBuffer;
        const camera2DYn = rawCamera instanceof Camera2D;
        // console.log(structInfo);
        const projectionCameraMatrix = mat4.multiply(temp, projectionMatrix, cameraMatrix);
        {
            const {members} = structInfo;
            const cameraMembers = members.camera.members;
            this.#updateSystemUniformData(
                [
                    {
                        key: 'projectionMatrix',
                        value: projectionMatrix,
                        dataView: this.#uniformDataF32,
                        targetMembers: members
                    },
                    {
                        key: 'inverseProjectionMatrix',
                        value: inverseProjectionMatrix,
                        dataView: this.#uniformDataF32,
                        targetMembers: members
                    },
                    {
                        key: 'projectionCameraMatrix',
                        value: projectionCameraMatrix,
                        dataView: this.#uniformDataF32,
                        targetMembers: members
                    },
                    {
                        key: 'inverseProjectionCameraMatrix',
                        value: mat4.invert(temp2, projectionCameraMatrix),
                        dataView: this.#uniformDataF32,
                        targetMembers: members
                    },
                    // 카메라 시스템 유니폼 업데이트
                    {
                        key: 'cameraMatrix',
                        value: cameraMatrix,
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                    {
                        key: 'inverseCameraMatrix',
                        value: mat4.invert(temp2, cameraMatrix),
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                    {
                        key: 'cameraPosition',
                        value: cameraPosition,
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                    {
                        key: 'nearClipping',
                        value: camera2DYn ? 0 : rawCamera.nearClipping,
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                    {
                        key: 'farClipping',
                        value: camera2DYn ? 0 : rawCamera.farClipping,
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                    {
                        key: 'fieldOfView',
                        //@ts-ignore
                        value: rawCamera.fieldOfView * Math.PI / 180,
                        dataView: this.#uniformDataF32,
                        targetMembers: cameraMembers
                    },
                ]
            )
        }
        gpuDevice.queue.writeBuffer(gpuBuffer, 0, this.#uniformData);
        // console.log('structInfo',view.scene.directionalLights)
    }

    #init() {
        const {redGPUContext} = this.#view;
        const {gpuDevice, resourceManager} = redGPUContext;
        const textureComputeShader = this.#getTextureComputeShader();
        this.#textureComputeShaderModule = resourceManager.createGPUShaderModule('POST_EFFECT_TEXTURE_COPY_COMPUTE_SHADER', {
            code: textureComputeShader,
        });
        this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
        this.#textureComputePipeline = this.#createTextureComputePipeline(gpuDevice, this.#textureComputeShaderModule, this.#textureComputeBindGroupLayout)
        const SHADER_INFO = parseWGSL(postEffectSystemUniformCode)
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;
        const postEffectSystemUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        this.#postEffectSystemUniformBufferStructInfo = UNIFORM_STRUCT;
        this.#postEffectSystemUniformBuffer = new UniformBuffer(redGPUContext, postEffectSystemUniformData, `${this.#view.name}_POST_EFFECT_SYSTEM_UNIFORM_BUFFER`);
        this.#uniformData = new ArrayBuffer(this.#postEffectSystemUniformBufferStructInfo.endOffset)
        this.#uniformDataF32 = new Float32Array(this.#uniformData)
        this.#uniformDataU32 = new Uint32Array(this.#uniformData)
    }

    #calcVideoMemory() {
        const texture = this.#storageTexture
        if (!texture) return 0;
        this.#videoMemorySize = calculateTextureByteSize(texture)
        this.#postEffects.forEach(effect => {
            this.#videoMemorySize += effect.videoMemorySize
        })
    }

    #renderToStorageTexture(view: View3D, sourceTextureView: GPUTextureView) {
        const {redGPUContext, viewRenderTextureManager} = view;
        const {gBufferColorTexture} = viewRenderTextureManager;
        const {gpuDevice, antialiasingManager, resourceManager} = redGPUContext;
        const {useMSAA, changedMSAA} = antialiasingManager;
        const {width, height} = gBufferColorTexture;
        const dimensionsChanged = width !== this.#previousDimensions?.width || height !== this.#previousDimensions?.height;
        // 크기가 변경되면 텍스처 재생성
        if (dimensionsChanged) {
            if (this.#storageTexture) {
                this.#storageTexture.destroy();
                this.#storageTexture = null;
            }
            this.#storageTexture = this.#createStorageTexture(gpuDevice, width, height);
            this.#storageTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#storageTexture);
        }
        // 크기 변경 또는 MSAA 변경 시 BindGroup 재생성
        if (dimensionsChanged || changedMSAA) {
            this.#textureComputeBindGroup = this.#createTextureBindGroup(
                redGPUContext,
                this.#textureComputeBindGroupLayout,
                sourceTextureView,
                this.#storageTextureView
            );
        }
        this.#previousDimensions = {width, height};
        this.#executeComputePass(
            gpuDevice,
            this.#textureComputePipeline,
            this.#textureComputeBindGroup,
            width, height
        );
        return this.#storageTextureView;
    }

    #getTextureComputeShader() {
        return `
	
      @group(0) @binding(0) var sourceTextureSampler: sampler;
      @group(0) @binding(1) var sourceTexture : texture_2d<f32>;
      @group(0) @binding(2) var outputTexture : texture_storage_2d<rgba8unorm, write>;
 
      @compute @workgroup_size(${this.#COMPUTE_WORKGROUP_SIZE_X},${this.#COMPUTE_WORKGROUP_SIZE_Y},${this.#COMPUTE_WORKGROUP_SIZE_Z})
      fn main (
        @builtin(global_invocation_id) global_id : vec3<u32>,
      ){
          let index = vec2<u32>(global_id.xy );
          let dimensions: vec2<u32> = textureDimensions(sourceTexture);
          let dimW = f32(dimensions.x);
          let dimH = f32(dimensions.y);
          let uv = 	vec2<f32>((f32(index.x)+0.5)/dimW,(f32(index.y)+0.5)/dimH);
          var color:vec4<f32> = textureSampleLevel(
            sourceTexture,
            sourceTextureSampler,
            uv,
            0
          );
          
          textureStore(outputTexture, index, color );
      };
    `;
    }

    #createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
        return redGPUContext.resourceManager.createBindGroupLayout(`${this.#view.name}_POST_EFFECT_TEXTURE_COPY_BIND_GROUP_LAYOUT`, {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering',}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba8unorm'}},
            ]
        });
    }

    #createStorageTexture(gpuDevice: GPUDevice, width: number, height: number) {
        return this.#view.redGPUContext.resourceManager.createManagedTexture({
            size: {width: width, height: height,},
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
            label: `${this.#view.name}_POST_EFFECT_STORAGE_TEXTURE_${width}x${height}`,
        });
    }

    #createTextureBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, sourceTextureView: GPUTextureView, storageTextureView: GPUTextureView) {
        const timestamp = Date.now();
        return redGPUContext.gpuDevice.createBindGroup({
            label: `${this.#view.name}_POST_EFFECT_TEXTURE_COPY_BIND_GROUP_${timestamp}`,
            layout: bindGroupLayout,
            entries: [
                {binding: 0, resource: new Sampler(redGPUContext).gpuSampler},
                {binding: 1, resource: sourceTextureView},
                {binding: 2, resource: storageTextureView},
            ]
        });
    }

    #createTextureComputePipeline(gpuDevice: GPUDevice, shaderModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
        return gpuDevice.createComputePipeline({
            label: 'POST_EFFECT_TEXTURE_COPY_COMPUTE_PIPELINE',
            layout: gpuDevice.createPipelineLayout({
                label: 'POST_EFFECT_TEXTURE_COPY_PIPELINE_LAYOUT',
                bindGroupLayouts: [
                    bindGroupLayout,
                ]
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            }
        });
    }

    #executeComputePass(gpuDevice: GPUDevice, pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, width: number, height: number) {
        const commandEncoder = gpuDevice.createCommandEncoder({
            label: 'POST_EFFECT_TEXTURE_COPY_COMMAND_ENCODER'
        });
        const computePassEncoder = commandEncoder.beginComputePass({
            label: 'POST_EFFECT_TEXTURE_COPY_COMPUTE_PASS'
        });
        computePassEncoder.setPipeline(pipeline);
        computePassEncoder.setBindGroup(0, bindGroup);
        computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#COMPUTE_WORKGROUP_SIZE_X), Math.ceil(height / this.#COMPUTE_WORKGROUP_SIZE_Y));
        computePassEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
    }
}

let temp = mat4.create()
let temp2 = mat4.create()
Object.freeze(PostEffectManager)
export default PostEffectManager
