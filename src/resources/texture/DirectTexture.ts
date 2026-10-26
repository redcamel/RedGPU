import RedGPUContext from "../../context/RedGPUContext";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import ADirectTexture from "./core/ADirectTexture";

const MANAGED_STATE_KEY = 'managedBitmapTextureState';

/**
 * [KO] 외부에서 생성된 `GPUTexture`를 직접 주입받아 관리하는 2D 텍스처 클래스입니다.
 * [EN] 2D texture class that directly receives and manages an externally created `GPUTexture`.
 *
 * ### Example
 * ```typescript
 * const directTexture = new RedGPU.Resource.DirectTexture(redGPUContext, 'myDirectTexture', gpuTexture);
 * ```
 *
 * @category Texture
 */
class DirectTexture extends ADirectTexture {
    /**
     * [KO] DirectTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectTexture instance.
     *
     * ### Example
     * ```typescript
     * const directTexture = new RedGPU.Resource.DirectTexture(redGPUContext, 'myDirectTexture', gpuTexture);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cacheKey -
     * [KO] 캐시 키 (동일 키가 존재하면 기존 인스턴스를 반환)
     * [EN] Cache key (returns the existing instance if the same key exists)
     * @param gpuTexture -
     * [KO] 외부 `GPUTexture` 인스턴스 (선택)
     * [EN] External `GPUTexture` instance (optional)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture) {
        super(redGPUContext, MANAGED_STATE_KEY, cacheKey);

        const {table} = this.targetResourceManagedState;
        if (cacheKey) {
            const target: ResourceStateBitmapTexture = table.get(cacheKey);
            if (target) {
                return target.texture as unknown as DirectTexture;
            }
        }

        if (gpuTexture) {
            this.setGpuTexture(gpuTexture);
        }

        this.registerResource();
    }

    /**
     * [KO] 2D 텍스처 뷰 생성을 위한 `GPUTextureViewDescriptor`를 반환합니다.
     * [EN] Returns the `GPUTextureViewDescriptor` for creating a 2D texture view.
     *
     * @returns
     * [KO] `GPUTextureViewDescriptor` 객체
     * [EN] `GPUTextureViewDescriptor` object
     */
    get viewDescriptor(): GPUTextureViewDescriptor {
        return {
            dimension: '2d',
            format: this.format,
            mipLevelCount: this.mipLevelCount,
            baseMipLevel: 0,
            arrayLayerCount: 1,
            baseArrayLayer: 0,
            aspect: 'all'
        };
    }

    /**
     * [KO] 텍스처를 `ResourceManager`에 등록합니다.
     * [EN] Registers the texture with `ResourceManager`.
     */
    protected registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    /**
     * [KO] 텍스처를 `ResourceManager`에서 등록 해제합니다.
     * [EN] Unregisters the texture from `ResourceManager`.
     */
    protected unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(DirectTexture);
export default DirectTexture;
