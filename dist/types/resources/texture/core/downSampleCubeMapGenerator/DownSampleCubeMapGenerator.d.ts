import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.
 * [EN] Generator class responsible for cubemap downsampling and mipmap generation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
declare class DownSampleCubeMapGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] DownSampleCubeMapGenerator 인스턴스를 생성합니다.
     * [EN] Creates an instance of DownSampleCubeMapGenerator.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 지정된 밉 레벨의 소스 큐브맵 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the source cubemap texture view for the specified mip level.
     *
     * @param sourceCubemap -
     * [KO] 소스 큐브맵 GPUTexture
     * [EN] Source cubemap GPUTexture
     * @param sourceMipLevel -
     * [KO] 소스 밉 레벨 인덱스
     * [EN] Source mip level index
     * @returns
     * [KO] 큐브맵 텍스처 뷰
     * [EN] Cubemap texture view
     */
    createSourceTextureView(sourceCubemap: GPUTexture, sourceMipLevel: number): GPUTextureView;
    /**
     * [KO] 지정된 밉 레벨의 타겟 2D 배열 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the target 2D array texture view for the specified mip level.
     *
     * @param targetCubemap -
     * [KO] 타겟 큐브맵 GPUTexture
     * [EN] Target cubemap GPUTexture
     * @param targetMipLevel -
     * [KO] 타겟 밉 레벨 인덱스
     * [EN] Target mip level index
     * @returns
     * [KO] 2D 배열 텍스처 뷰
     * [EN] 2D array texture view
     */
    createTargetTextureView(targetCubemap: GPUTexture, targetMipLevel: number): GPUTextureView;
    /**
     * [KO] 큐브맵 다운샘플링 연산에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the bind group to be used for cubemap downsampling.
     *
     * @param bindGroupLayout -
     * [KO] 바인드 그룹 레이아웃
     * [EN] Bind group layout
     * @param sourceView -
     * [KO] 소스 큐브맵 텍스처 뷰
     * [EN] Source cubemap texture view
     * @param targetView -
     * [KO] 타겟 2D 배열 텍스처 뷰
     * [EN] Target 2D array texture view
     * @param uniformBuffer -
     * [KO] 밉 레벨 파라미터 유니폼 버퍼
     * [EN] Mip level parameter uniform buffer
     * @returns
     * [KO] 생성되거나 캐시된 바인드 그룹
     * [EN] Created or cached bind group
     */
    createBindGroup(bindGroupLayout: GPUBindGroupLayout, sourceView: GPUTextureView, targetView: GPUTextureView, uniformBuffer: GPUBuffer): GPUBindGroup;
    /**
     * [KO] 큐브맵 다운샘플링을 수행합니다.
     * [EN] Performs cubemap downsampling.
     *
     * @param sourceCubemap -
     * [KO] 소스 큐브맵 텍스처
     * [EN] Source cubemap texture
     * @param targetSize -
     * [KO] 타겟 크기 (기본값: 256)
     * [EN] Target size (default: 256)
     * @param format -
     * [KO] 텍스처 포맷 (기본값: 'rgba16float')
     * [EN] Texture format (default: 'rgba16float')
     * @returns
     * [KO] 다운샘플링된 큐브맵 GPUTexture
     * [EN] Downsampled cubemap GPUTexture
     */
    downsampleCubemap(sourceCubemap: GPUTexture, targetSize?: number, format?: GPUTextureFormat): Promise<GPUTexture>;
    /**
     * [KO] 모든 캐시와 GPU 리소스를 해제합니다.
     * [EN] Releases all caches and GPU resources.
     */
    destroy(): void;
}
export default DownSampleCubeMapGenerator;
