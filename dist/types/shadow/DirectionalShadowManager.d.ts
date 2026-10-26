import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import { mat4 } from "gl-matrix";
/**
 * [KO] 직사광(Directional Light)의 CSM (Cascaded Shadow Maps) 뎁스 텍스처 배열과 관련 설정을 총괄 관리하는 클래스입니다.
 * [EN] Class that manages CSM (Cascaded Shadow Maps) depth texture arrays and related settings for directional lights.
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
     * [KO] 전체 2D Texture Array 형태의 섀도우 뎁스 텍스처 뷰를 반환합니다. (메인 렌더링 셰이더 바인딩용)
     * [EN] Returns the shadow depth texture view in 2D Texture Array dimension. (For main rendering shader binding)
     *
     * @returns
     * [KO] 2D Array 섀도우 뎁스 GPUTextureView
     * [EN] 2D Array Shadow depth GPUTextureView
     */
    get shadowDepthTextureView(): GPUTextureView;
    /**
     * [KO] 그림자가 없는 상태를 위한 빈(1x1x4) 2D Array 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns an empty (1x1x4) 2D Array depth texture view for non-shadow states.
     *
     * @returns
     * [KO] 빈 뎁스 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get shadowDepthTextureViewEmpty(): GPUTextureView;
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
     * [KO] 그림자 바이어스(Bias) 값을 반환합니다.
     * [EN] Returns the shadow bias value.
     *
     * @returns
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    get bias(): number;
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
     * [KO] 그림자의 세기(Strength) 값을 반환합니다.
     * [EN] Returns the shadow strength value.
     *
     * @returns
     * [KO] 세기 값 (0.0 ~ 1.0)
     * [EN] Strength value (0.0 to 1.0)
     */
    get strength(): number;
    /**
     * [KO] CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4, 기본값: 3)를 반환합니다.
     * [EN] Returns the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4, default: 3).
     *
     * @returns
     * [KO] 캐스케이드 개수
     * [EN] Cascade count
     */
    get cascadeCount(): number;
    /**
     * [KO] 직사광 그림자가 도달할 수 있는 최대 가시거리(언리얼 엔진 표준 기본값: 200m)를 반환합니다.
     * [EN] Returns the maximum shadow distance (Unreal Engine standard default: 200m).
     */
    get maxShadowDistance(): number;
    /**
     * [KO] 직사광 그림자가 도달할 수 있는 최대 가시거리(언리얼 엔진 표준 기본값: 200m)를 설정합니다.
     * [EN] Sets the maximum shadow distance (Unreal Engine standard default: 200m).
     *
     * @param value - 최대 그림자 가시거리 (m)
     */
    set maxShadowDistance(value: number);
    /**
     * [KO] CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4)를 설정합니다.
     * [EN] Sets the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4).
     *
     * @param value -
     * [KO] 캐스케이드 개수 (1 ~ 4)
     * [EN] Cascade count (1 to 4)
     */
    set cascadeCount(value: number);
    /**
     * [KO] 각 캐스케이드의 분할 깊이(Split Depth) 배열(길이 4)을 반환합니다.
     * [EN] Returns the array of split depths for each cascade (length 4).
     *
     * @returns
     * [KO] 분할 깊이 Float32Array
     * [EN] Split depth Float32Array
     */
    get cascadeSplitDepths(): Float32Array;
    /**
     * [KO] 각 캐스케이드의 투영-뷰(Projection-View) 행렬 배열(길이 4)을 반환합니다.
     * [EN] Returns the array of projection-view matrices for each cascade (length 4).
     *
     * @returns
     * [KO] 투영-뷰 행렬 배열
     * [EN] Array of projection-view matrices
     */
    get cascadeProjectionViewMatrices(): mat4[];
    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 반환합니다.
     * [EN] Returns the size (resolution, default: 2048) of the shadow depth texture.
     *
     * @returns
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    get shadowDepthTextureSize(): number;
    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 설정합니다. (정수)
     * [EN] Sets the size (resolution, default: 2048) of the shadow depth texture. (Integer)
     *
     * @param value -
     * [KO] 해상도 값 (기본값: 2048)
     * [EN] Resolution value (default: 2048)
     */
    set shadowDepthTextureSize(value: number);
    /**
     * [KO] PCSS 광원의 가상 크기(Light Radius / Angular Size, 기본값: 2.0)를 반환합니다.
     * [EN] Returns the virtual light size for PCSS (Light Radius / Angular Size, default: 2.0).
     */
    get pcssLightSize(): number;
    /**
     * [KO] PCSS 광원의 가상 크기(Light Radius / Angular Size, 기본값: 2.0)를 설정합니다. (0.0 이상)
     * [EN] Sets the virtual light size for PCSS (Light Radius / Angular Size, default: 2.0). (0.0 or greater)
     */
    set pcssLightSize(value: number);
    /**
     * [KO] 특정 캐스케이드 레이어의 단일 2D 뎁스 텍스처 뷰를 반환합니다. (캐스케이드 렌더 패스 Attachment용)
     * [EN] Returns a single 2D depth texture view for a specific cascade layer. (For cascade render pass attachment)
     *
     * @param index - 캐스케이드 인덱스 (0 ~ 3)
     * @returns 해당 레이어의 2D GPUTextureView
     */
    getCascadeLayerView(index: number): GPUTextureView;
    /**
     * [KO] 섀도우 캐스팅 대상 리스트를 초기화합니다.
     * [EN] Resets the list of shadow casting objects.
     */
    resetCastingList(): void;
    /**
     * [KO] 언리얼 엔진 5(UE5) 표준 지수 분할(Exponential Distribution Exponent = 3.0) 및
     *      해석적 외접구(Analytical Bounding Sphere) 텍셀 스냅핑 알고리즘을 적용하여
     *      CSM 행렬과 분할 깊이를 직접(In-Place) 계산합니다.
     * [EN] In-place calculates jitter-free high-precision CSM matrices and split depths directly into member buffers.
     *
     * @param view - 대상 View3D
     */
    calculateCSMMatrices(view: View3D): void;
    /**
     * [KO] 내부 상태를 업데이트합니다. (주로 해상도 변경 체크)
     * [EN] Updates internal state. (Mainly checks for resolution changes)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext): boolean;
    /**
     * [KO] 사용 중인 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use.
     */
    destroy(): void;
}
export default DirectionalShadowManager;
