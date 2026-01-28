import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
/**
 * [KO] 각 클러스터에 영향을 주는 조명을 식별하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that identifies lights affecting each cluster.
 *
 * [KO] 포인트 조명 및 스포트 조명과 클러스터(타일) 간의 교차 검사를 수행하여 각 클러스터에 포함되는 조명 인덱스를 기록합니다.
 * [EN] Performs intersection tests between point lights/spot lights and clusters (tiles) to record light indices included in each cluster.
 * @category Light
 */
declare class PassClustersLight {
    #private;
    /**
     * [KO] PassClustersLight 인스턴스를 생성합니다.
     * [EN] Creates a PassClustersLight instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(redGPUContext: RedGPUContext, view: View3D);
    /**
     * [KO] 클러스터 조명 버퍼를 반환합니다.
     * [EN] Returns the cluster lights buffer.
     * @returns
     * [KO] 클러스터 조명 GPUBuffer
     * [EN] Cluster lights GPUBuffer
     */
    get clusterLightsBuffer(): GPUBuffer;
    /**
     * [KO] 클러스터 조명을 계산하는 컴퓨트 패스를 실행합니다.
     * [EN] Executes the compute pass to calculate cluster lights.
     */
    render(): void;
}
export default PassClustersLight;
