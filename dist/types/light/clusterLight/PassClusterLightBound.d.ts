import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
/**
 * [KO] 클러스터 조명의 경계를 계산하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that calculates the bounds of cluster lights.
 *
 * [KO] 화면을 타일로 나누고 각 타일의 3D 공간 상의 AABB(Axis-Aligned Bounding Box)를 계산합니다.
 * [EN] Divides the screen into tiles and calculates the AABB (Axis-Aligned Bounding Box) in 3D space for each tile.
 * @category Light
 */
declare class PassClusterLightBound {
    #private;
    /**
     * [KO] PassClusterLightBound 인스턴스를 생성합니다.
     * [EN] Creates a PassClusterLightBound instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(redGPUContext: RedGPUContext, view: View3D);
    /**
     * [KO] 클러스터 경계 버퍼를 반환합니다.
     * [EN] Returns the cluster bound buffer.
     * @returns
     * [KO] 클러스터 경계 GPUBuffer
     * [EN] Cluster bound GPUBuffer
     */
    get clusterBoundBuffer(): GPUBuffer;
    /**
     * [KO] 클러스터 경계를 계산하는 컴퓨트 패스를 실행합니다.
     * [EN] Executes the compute pass to calculate cluster bounds.
     */
    render(): void;
}
export default PassClusterLightBound;
