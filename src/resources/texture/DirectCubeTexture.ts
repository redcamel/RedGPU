import RedGPUContext from "../../context/RedGPUContext";
import ResourceStateCubeTexture from "../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import ADirectTexture from "./core/ADirectTexture";
import CubeTexture from "./CubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState';

/**
 * [KO] GPUTexture를 직접 주입받아 관리하는 다차원(Cube 및 3D) 텍스처 클래스입니다.
 * [EN] Multi-dimensional (Cube and 3D) texture class that directly injects and manages GPUTexture.
 *
 * @category Texture
 */
class DirectCubeTexture extends ADirectTexture {
    #dimension: GPUTextureDimension = '2d';

    /**
     * [KO] DirectCubeTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectCubeTexture instance.
     *
     * @param redGPUContext - RedGPU 컨텍스트
     * @param cacheKey - 캐시 키 (동일 키 존재 시 기존 인스턴스 반환)
     * @param gpuTexture - `GPUTexture` 객체 (선택)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture) {
        super(redGPUContext, MANAGED_STATE_KEY, cacheKey);
        
        const {table} = this.targetResourceManagedState;
        if (cacheKey) {
            const target: ResourceStateCubeTexture = table.get(cacheKey);
            if (target) {
                return target.texture as unknown as DirectCubeTexture;
            }
        }

        if (gpuTexture) {
            this.setGpuTexture(gpuTexture);
        }
        
        this.registerResource();
    }

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    get viewDescriptor(): GPUTextureViewDescriptor {
        const is3D = this.#dimension === '3d';
        return {
            ...CubeTexture.defaultViewDescriptor,
            dimension: (is3D ? '3d' : 'cube') as GPUTextureViewDimension,
            arrayLayerCount: is3D ? 1 : 6,
            mipLevelCount: this.mipLevelCount
        };
    }

    protected setGpuTexture(value: GPUTexture) {
        if (value) this.#dimension = value.dimension;
        super.setGpuTexture(value);
    }

    protected registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }

    protected unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(DirectCubeTexture);
export default DirectCubeTexture;
