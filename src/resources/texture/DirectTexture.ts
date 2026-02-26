import RedGPUContext from "../../context/RedGPUContext";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import ADirectTexture from "./core/ADirectTexture";

const MANAGED_STATE_KEY = 'managedBitmapTextureState';

/**
 * [KO] GPUTexture를 직접 주입받아 관리하는 2D 전용 텍스처 클래스입니다.
 * [EN] 2D-specific texture class that directly injects and manages GPUTexture.
 *
 * @category Texture
 */
class DirectTexture extends ADirectTexture {
    /**
     * [KO] DirectTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectTexture instance.
     *
     * @param redGPUContext - RedGPU 컨텍스트
     * @param cacheKey - 캐시 키 (동일 키 존재 시 기존 인스턴스 반환)
     * @param gpuTexture - 외부 GPUTexture 주입 (선택)
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

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
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

    protected registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    protected unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(DirectTexture);
export default DirectTexture;
