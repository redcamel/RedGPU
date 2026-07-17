import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";
import View3D from "../display/view/View3D";
/**
 * [KO] 씬의 전체적인 그림자 렌더링을 총괄하는 관리자 클래스입니다.
 * [EN] Manager class that oversees the overall shadow rendering of the scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Shadow
 */
declare class ShadowManager {
    #private;
    constructor();
    /**
     * [KO] 직사광(Directional Light) 섀도우 매니저를 반환합니다.
     * [EN] Returns the DirectionalShadowManager.
     *
     * @returns
     * [KO] DirectionalShadowManager 인스턴스
     * [EN] DirectionalShadowManager instance
     */
    get directionalShadowManager(): DirectionalShadowManager;
    /**
     * [KO] 섀도우 렌더 패스 디스크립터를 반환합니다.
     * [EN] Returns the shadow render pass descriptor.
     *
     * @returns
     * [KO] GPURenderPassDescriptor 객체
     * [EN] GPURenderPassDescriptor object
     */
    get shadowPassDescriptor(): GPURenderPassDescriptor;
    /**
     * [KO] 그림자 렌더링을 수행합니다.
     * [EN] Performs shadow rendering.
     *
     * @param view -
     * [KO] 대상 View3D
     * [EN] Target View3D
     */
    render(view: View3D): void;
    /**
     * [KO] 매니저의 상태를 업데이트합니다.
     * [EN] Updates the state of the manager.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext): void;
    /**
     * [KO] 사용 중인 그림자 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use for shadow rendering.
     */
    destroy(): void;
}
export default ShadowManager;
