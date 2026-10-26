import RedGPUContext from "../../context/RedGPUContext";
import ResourceStateCubeTexture from "../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import ADirectTexture from "./core/ADirectTexture";
import CubeTexture from "./CubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState';

/**
 * [KO] 파일 경로(URL) 로드 과정 없이 외부 `GPUTexture`를 직접 주입받아 관리하는 다차원(Cube 및 3D) 텍스처 클래스입니다.
 * [EN] Multi-dimensional (Cube and 3D) texture class that directly receives and manages an external `GPUTexture` without loading from file URLs.
 *
 * ### Example
 * ```typescript
 * const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'custom_cube_key', gpuTexture);
 * ```
 *
 * @category Texture
 */
class DirectCubeTexture extends ADirectTexture {
    #dimension: GPUTextureDimension = '2d';

    /**
     * [KO] DirectCubeTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 존재할 경우 기존 캐시된 인스턴스를 반환합니다.
     * [EN] Creates a DirectCubeTexture instance. Returns the existing cached instance if the same `cacheKey` exists.
     *
     * ### Example
     * ```typescript
     * const directCubeTexture = new RedGPU.Resource.DirectCubeTexture(redGPUContext, 'my_cube_texture', gpuTexture);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cacheKey -
     * [KO] 리소스 식별 및 캐싱을 위한 고유 키
     * [EN] Unique key for resource identification and caching
     * @param gpuTexture -
     * [KO] 직접 주입할 `GPUTexture` 객체 (선택)
     * [EN] `GPUTexture` object to inject directly (optional)
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

    /**
     * [KO] 텍스처 차원(`cube` 또는 `3d`)과 밉맵 레벨이 반영된 `GPUTextureViewDescriptor`를 반환합니다.
     * [EN] Returns the `GPUTextureViewDescriptor` reflecting the texture dimension (`cube` or `3d`) and mipmap levels.
     *
     * @returns
     * [KO] `GPUTextureViewDescriptor` 객체
     * [EN] `GPUTextureViewDescriptor` object
     */
    get viewDescriptor(): GPUTextureViewDescriptor {
        const is3D = this.#dimension === '3d';
        return {
            ...CubeTexture.defaultViewDescriptor,
            dimension: (is3D ? '3d' : 'cube') as GPUTextureViewDimension,
            arrayLayerCount: is3D ? 1 : 6,
            mipLevelCount: this.mipLevelCount
        };
    }

    /**
     * [KO] `GPUTexture` 객체를 설정하고 차원 정보 및 뷰를 갱신합니다.
     * [EN] Sets the `GPUTexture` object and updates dimension information and view.
     *
     * @param value -
     * [KO] 설정할 `GPUTexture` 객체
     * [EN] `GPUTexture` object to set
     */
    protected setGpuTexture(value: GPUTexture) {
        if (value) this.#dimension = value.dimension;
        super.setGpuTexture(value);
    }

    /**
     * [KO] 리소스 매니저에 큐브 텍스처 상태를 등록합니다.
     * [EN] Registers the cube texture state in the resource manager.
     */
    protected registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }

    /**
     * [KO] 리소스 매니저에서 큐브 텍스처 등록을 해제합니다.
     * [EN] Unregisters the cube texture from the resource manager.
     */
    protected unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(DirectCubeTexture);
export default DirectCubeTexture;
