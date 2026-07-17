import View3D from "../../display/view/View3D";
import PassClusterLightBound from "../clusterLight/pass/bound/PassClusterLightBound";
import PassClustersLight from "../clusterLight/pass/light/PassClustersLight";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] 클러스터 기반 조명 연산을 관리하는 매니저 클래스입니다.
 * [EN] Manager class that manages cluster-based lighting computations.
 *
 * [KO] 씬 내부의 포인트 조명(PointLight)과 스포트 조명(SpotLight)을 3D 클러스터 공간에 매핑하여 효율적으로 렌더링하도록 돕습니다.
 * [EN] Maps point lights (PointLight) and spot lights (SpotLight) within the scene to 3D cluster space for efficient rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
declare class ClusterLightManager extends RedGPUObject {
    #private;
    /**
     * [KO] ClusterLightManager 인스턴스를 생성합니다.
     * [EN] Creates a ClusterLightManager instance.
     *
     * @param view -
     * [KO] 이 매니저가 속할 View3D 인스턴스
     * [EN] The View3D instance this manager belongs to
     */
    constructor(view: View3D);
    /**
     * [KO] 클러스터 라이팅 경계 패스를 반환합니다.
     * [EN] Returns the cluster light boundary pass.
     */
    get passClusterLightBound(): PassClusterLightBound;
    /**
     * [KO] 클러스터 라이팅 렌더링 패스를 반환합니다.
     * [EN] Returns the cluster lighting rendering pass.
     */
    get passClustersLight(): PassClustersLight;
    /**
     * [KO] 클러스터 라이트 데이터를 담은 GPUBuffer를 반환합니다.
     * [EN] Returns the GPUBuffer containing cluster light data.
     */
    get clusterLightsBuffer(): GPUBuffer;
    /**
     * [KO] 클러스터 라이트 데이터를 담은 Float32Array를 반환합니다.
     * [EN] Returns the Float32Array containing cluster light data.
     */
    get clusterLightsBufferData(): Float32Array;
    /**
     * [KO] 클러스터 라이트를 업데이트합니다.
     * [KO] 포인트 라이트와 스팟 라이트 데이터를 계산하고 GPU 버퍼에 업로드합니다.
     * [EN] Updates cluster lights.
     * [EN] Calculates PointLight and SpotLight data and uploads them to the GPU buffer.
     */
    updateClusterLights(): void;
    /**
     * [KO] ClusterLightManager 인스턴스를 파기하고 버퍼 및 연산 서브 패스들을 정리합니다.
     * [EN] Destroys the ClusterLightManager instance and cleans up buffers and computing sub-passes.
     */
    destroy(): void;
}
export default ClusterLightManager;
