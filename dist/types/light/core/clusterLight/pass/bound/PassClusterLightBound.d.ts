import RedGPUContext from "../../../../../context/RedGPUContext";
import View3D from "../../../../../display/view/View3D";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] 뷰 프러스텀을 3D 클러스터 그리드로 분할하고 각 셀의 뷰 공간 AABB 바운딩 볼륨을 계산하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that subdivides the view frustum into a 3D cluster grid and calculates the view-space AABB bounding volume for each cell.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
declare class PassClusterLightBound extends RedGPUObject {
    #private;
    /**
     * [KO] 새로운 PassClusterLightBound 인스턴스를 생성합니다.
     * [EN] Creates a new PassClusterLightBound instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] 클러스터 바운딩 볼륨을 계산할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for cluster bounding volume calculation
     */
    constructor(redGPUContext: RedGPUContext, view: View3D);
    /**
     * [KO] 클러스터 타일별 뷰 공간 AABB 데이터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing per-tile view-space AABB data.
     *
     * @returns
     * [KO] 클러스터 바운드 `GPUBuffer` 인스턴스
     * [EN] Cluster bound `GPUBuffer` instance
     */
    get clusterBoundBuffer(): GPUBuffer;
    /**
     * [KO] 클러스터 타일의 AABB 바운딩 볼륨 계산 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the compute pass to calculate AABB bounding volumes for cluster tiles.
     */
    render(): void;
    /**
     * [KO] 할당된 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases allocated GPU buffer and pipeline resources.
     */
    destroy(): void;
}
export default PassClusterLightBound;
