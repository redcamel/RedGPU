import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
/**
 * [KO] 직사광(Directional Light)의 그림자 뎁스 텍스처와 관련 설정을 관리하는 클래스입니다.
 * [EN] Class that manages shadow depth textures and related settings for directional lights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Shadow
 */
declare class DirectionalShadowManager {
    #private;
    /**
     * [KO] 현재 섀도우 맵이 사용하는 비디오 메모리 크기(Bytes)를 반환합니다.
     * [EN] Returns the video memory size (Bytes) used by the current shadow map.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 그림자를 생성할 대상 객체 리스트를 반환합니다.
     * [EN] Returns the list of objects that will cast shadows.
     *
     * @returns
     * [KO] 섀도우 캐스팅 대상 배열
     * [EN] Array of shadow casting objects
     */
    get castingList(): (Mesh | InstancingMesh)[];
    /**
     * [KO] 섀도우 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns the shadow depth texture view.
     *
     * @returns
     * [KO] 섀도우 뎁스 GPUTextureView
     * [EN] Shadow depth GPUTextureView
     */
    get shadowDepthTextureView(): GPUTextureView;
    /**
     * [KO] 그림자가 없는 상태를 위한 빈(1x1) 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns an empty (1x1) depth texture view for non-shadow states.
     *
     * @returns
     * [KO] 빈 뎁스 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get shadowDepthTextureViewEmpty(): GPUTextureView;
    /**
     * [KO] 그림자 바이어스(Bias) 값을 반환합니다.
     * [EN] Returns the shadow bias value.
     *
     * @returns
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    get bias(): number;
    /**
     * [KO] 그림자 바이어스(Bias) 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the shadow bias value. (0.0 to 1.0)
     *
     * @param value -
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    set bias(value: number);
    /**
     * [KO] 그림자의 세기(Strength) 값을 반환합니다.
     * [EN] Returns the shadow strength value.
     *
     * @returns
     * [KO] 세기 값 (0.0 ~ 1.0)
     * [EN] Strength value (0.0 to 1.0)
     */
    get strength(): number;
    /**
     * [KO] 그림자의 세기(Strength) 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the shadow strength value. (0.0 to 1.0)
     *
     * @param value -
     * [KO] 세기 값
     * [EN] Strength value
     */
    set strength(value: number);
    /**
     * [KO] 그림자 필터 번짐 반경(Filter Scale) 값을 반환합니다.
     * [EN] Returns the shadow filter scale value.
     *
     * @returns
     * [KO] 필터 스케일 값 (기본값: 4.0)
     * [EN] Filter scale value (default: 4.0)
     */
    get filterScale(): number;
    /**
     * [KO] 그림자 필터 번짐 반경(Filter Scale) 값을 설정합니다. (0.0 이상)
     * [EN] Sets the shadow filter scale value. (0.0 or greater)
     *
     * @param value -
     * [KO] 필터 스케일 값
     * [EN] Filter scale value
     */
    set filterScale(value: number);
    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도)를 반환합니다.
     * [EN] Returns the size (resolution) of the shadow depth texture.
     *
     * @returns
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    get shadowDepthTextureSize(): number;
    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도)를 설정합니다. (정수)
     * [EN] Sets the size (resolution) of the shadow depth texture. (Integer)
     *
     * @param value -
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    set shadowDepthTextureSize(value: number);
    /**
     * [KO] 매니저를 리셋하고 리소스를 파기합니다.
     * [EN] Resets the manager and destroys resources.
     */
    reset(): void;
    /**
     * [KO] 섀도우 캐스팅 대상 리스트를 초기화합니다.
     * [EN] Resets the list of shadow casting objects.
     */
    resetCastingList(): void;
    /**
     * [KO] 내부 상태를 업데이트합니다. (주로 해상도 변경 체크)
     * [EN] Updates internal state. (Mainly checks for resolution changes)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext): void;
    /**
     * [KO] 사용 중인 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use.
     */
    destroy(): void;
}
export default DirectionalShadowManager;
