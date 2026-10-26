import RedGPUContext from "../../../../context/RedGPUContext";
import { CommandEncoderType } from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 2D 텍스처의 밉맵(Mipmap)을 GPU 렌더 패스를 통해 자동 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class that automatically generates mipmaps for 2D textures via GPU render passes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
declare class MipmapGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] MipmapGenerator 인스턴스를 생성합니다.
     * [EN] Creates an instance of MipmapGenerator.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 지정된 밉 레벨 및 레이어의 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the texture view for the specified mip level and layer.
     *
     * @param texture -
     * [KO] 대상 GPUTexture
     * [EN] Target GPUTexture
     * @param baseMipLevel -
     * [KO] 기본 밉 레벨
     * [EN] Base mip level
     * @param baseArrayLayer -
     * [KO] 기본 배열 레이어
     * [EN] Base array layer
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @returns
     * [KO] 생성되거나 캐시된 GPUTextureView
     * [EN] Created or cached GPUTextureView
     */
    createTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number, useCache?: boolean): GPUTextureView;
    /**
     * [KO] 밉맵 렌더 패스에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the bind group to be used for the mipmap render pass.
     *
     * @param texture -
     * [KO] 대상 GPUTexture
     * [EN] Target GPUTexture
     * @param textureView -
     * [KO] 대상 GPUTextureView
     * [EN] Target GPUTextureView
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @returns
     * [KO] 생성되거나 캐시된 GPUBindGroup
     * [EN] Created or cached GPUBindGroup
     */
    createBindGroup(texture: GPUTexture, textureView: GPUTextureView, useCache?: boolean): GPUBindGroup;
    /**
     * [KO] 지정된 텍스처 포맷에 대응하는 밉맵 렌더 파이프라인을 반환합니다.
     * [EN] Returns the mipmap render pipeline corresponding to the specified texture format.
     *
     * @param format -
     * [KO] 대상 GPUTextureFormat
     * [EN] Target GPUTextureFormat
     * @returns
     * [KO] 밉맵 GPURenderPipeline
     * [EN] Mipmap GPURenderPipeline
     */
    getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline;
    /**
     * [KO] 입력 텍스처에 대한 밉맵 체인을 생성합니다.
     * [EN] Generates a mipmap chain for the input texture.
     *
     * @param texture -
     * [KO] 원본 GPUTexture
     * [EN] Source GPUTexture
     * @param textureDescriptor -
     * [KO] 텍스처 디스크립터
     * [EN] Texture descriptor
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @param encoderType -
     * [KO] 사용할 명령 인코더 유형 (기본값: COMMAND_ENCODER_TYPE.RESOURCE)
     * [EN] Command encoder type to use (default: COMMAND_ENCODER_TYPE.RESOURCE)
     * @returns
     * [KO] 밉맵이 생성된 GPUTexture
     * [EN] GPUTexture with generated mipmaps
     */
    generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor, useCache?: boolean, encoderType?: CommandEncoderType): GPUTexture;
    /**
     * [KO] 모든 캐시 및 밉맵 생성용 파이프라인 리소스를 해제합니다.
     * [EN] Releases all caches and mipmap generation pipeline resources.
     */
    destroy(): void;
}
export default MipmapGenerator;
