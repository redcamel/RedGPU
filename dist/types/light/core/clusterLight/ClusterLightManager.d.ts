import View3D from "../../../display/view/View3D";
import PassClusterLightBound from "./pass/bound/PassClusterLightBound";
import PassClustersLight from "./pass/light/PassClustersLight";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] `View3D`의 3차원 프러스텀 클러스터 분할 및 다중 광원(`PointLight`, `SpotLight`) GPU 컬링 패스를 관리하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that manages 3D frustum cluster subdivision and multi-light (`PointLight`, `SpotLight`) GPU culling passes for a `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const clusterLightManager = view.clusterLightManager;
 * ```
 *
 * @see [PointLight Performance Example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @see [SpotLight Performance Example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
declare class ClusterLightManager extends RedGPUObject {
    #private;
    /**
     * [KO] ClusterLightManager 인스턴스를 초기화합니다.
     * [EN] Initializes the ClusterLightManager instance.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     */
    constructor(view: View3D);
    /**
     * [KO] 클러스터 AABB 바운드 계산 컴퓨트 패스(`PassClusterLightBound`)를 반환합니다.
     * [EN] Returns the cluster AABB bound calculation compute pass (`PassClusterLightBound`).
     *
     * @returns
     * [KO] `PassClusterLightBound` 인스턴스
     * [EN] `PassClusterLightBound` instance
     */
    get passClusterLightBound(): PassClusterLightBound;
    /**
     * [KO] 클러스터별 광원 교차 컬링 컴퓨트 패스(`PassClustersLight`)를 반환합니다.
     * [EN] Returns the per-cluster light intersection culling compute pass (`PassClustersLight`).
     *
     * @returns
     * [KO] `PassClustersLight` 인스턴스
     * [EN] `PassClustersLight` instance
     */
    get passClustersLight(): PassClustersLight;
    /**
     * [KO] 클러스터 광원 데이터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer storing cluster light data.
     *
     * @returns
     * [KO] 클러스터 광원 `GPUBuffer`
     * [EN] Cluster light `GPUBuffer`
     */
    get clusterLightsBuffer(): GPUBuffer;
    /**
     * [KO] 씬의 `PointLight` 및 `SpotLight` 데이터를 GPU 버퍼에 업로드하고 클러스터 라이팅 컴퓨트 패스를 실행합니다.
     * [EN] Uploads `PointLight` and `SpotLight` data from the scene to the GPU buffer and executes the clustered lighting compute passes.
     */
    updateClusterLights(): void;
    /**
     * [KO] 할당된 GPU 버퍼 및 하위 컴퓨트 패스 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and sub-compute pass resources.
     */
    destroy(): void;
}
export default ClusterLightManager;
