import RedGPUContext from "../../../../../context/RedGPUContext";
import View3D from "../../../../../display/view/View3D";
import RedGPUObject from "../../../../../base/RedGPUObject";
import PassClusterLightBound from "../bound/PassClusterLightBound";
/**
 * [KO] 클러스터 타일 AABB와 씬 내 광원(`PointLight`, `SpotLight`)의 교차 판정을 수행하여 타일별 유효 조명 목록을 구축하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that performs intersection culling between cluster tile AABBs and scene lights (`PointLight`, `SpotLight`) to build per-tile active light lists.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
declare class PassClustersLight extends RedGPUObject {
    #private;
    /**
     * [KO] 새로운 PassClustersLight 인스턴스를 생성합니다.
     * [EN] Creates a new PassClustersLight instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] 클러스터 라이트 컬링을 수행할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for cluster light culling
     * @param passClusterLightBound -
     * [KO] 클러스터 AABB 바운드 정보를 제공하는 `PassClusterLightBound` 인스턴스
     * [EN] `PassClusterLightBound` instance providing cluster AABB bound data
     */
    constructor(redGPUContext: RedGPUContext, view: View3D, passClusterLightBound: PassClusterLightBound);
    /**
     * [KO] 클러스터 셀별 광원 인덱스 및 개수가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing per-cell light indices and counts.
     *
     * @returns
     * [KO] 클러스터 라이트 그리드 `GPUBuffer` 인스턴스
     * [EN] Cluster light grid `GPUBuffer` instance
     */
    get clusterLightsBuffer(): GPUBuffer;
    /**
     * [KO] 클러스터별 광원 교차 판정(Culling) 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the per-cluster light intersection culling compute pass.
     */
    render(): void;
    /**
     * [KO] 할당된 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases allocated GPU buffer and pipeline resources.
     */
    destroy(): void;
}
export default PassClustersLight;
