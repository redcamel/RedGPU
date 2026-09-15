import RedGPUContext from "../../../../context/RedGPUContext";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] ASkyAtmosphereLUTGenerator는 대기 산란용 LUT(Look Up Table) 생성을 위한 추상 베이스 클래스입니다.
 * [EN] ASkyAtmosphereLUTGenerator is an abstract base class for creating atmospheric scattering LUTs (Look Up Tables).
 *
 * [KO] 컴퓨트 셰이더를 사용하여 물리 연산 결과를 텍스처에 베이킹하는 공통 로직을 제공합니다.
 * [EN] Provides common logic for baking physical calculation results into textures using compute shaders.
 */
declare abstract class ASkyAtmosphereLUTGenerator extends RedGPUObject {
    #private;
    protected constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler, label: string, width: number, height: number, depth?: number);
    get sharedUniformBuffer(): UniformBuffer;
    get sampler(): Sampler;
    get label(): string;
    get width(): number;
    get height(): number;
    get depth(): number;
    abstract get lutTexture(): DirectTexture | DirectCubeTexture;
    executeComputePass(pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, workgroupSize?: [number, number, number]): void;
    createLUTTexture(is3D?: boolean, format?: GPUTextureFormat): GPUTexture;
    destroy(): void;
    protected createComputePipeline(label: string, shaderCode: string): GPUComputePipeline;
    protected createBindGroup(label: string, pipeline: GPUComputePipeline, entries: GPUBindGroupEntry[]): GPUBindGroup;
}
export default ASkyAtmosphereLUTGenerator;
