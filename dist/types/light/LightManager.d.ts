import View3D from "../display/view/View3D";
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";
/**
 * 씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
 * Scene 생성시 자동으로 생성됩니다.
 */
declare class LightManager {
    #private;
    /**
     * 등록된 스포트 조명 배열을 반환합니다.
     * @returns 등록된 SpotLight 배열
     */
    get spotLights(): SpotLight[];
    /**
     * 등록된 스포트 조명의 개수를 반환합니다.
     * @returns 스포트 조명 개수
     */
    get spotLightCount(): number;
    /**
     * 클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.
     * @returns 클러스터 조명 최대 개수
     */
    get limitClusterLightCount(): number;
    /**
     * 등록된 포인트 조명 배열을 반환합니다.
     * @returns 등록된 PointLight 배열
     */
    get pointLights(): PointLight[];
    /**
     * 등록된 포인트 조명의 개수를 반환합니다.
     * @returns 포인트 조명 개수
     */
    get pointLightCount(): number;
    /**
     * 방향성 조명의 최대 허용 개수를 반환합니다.
     * @returns 방향성 조명 최대 개수
     */
    get limitDirectionalLightCount(): number;
    /**
     * 등록된 방향성 조명의 개수를 반환합니다.
     * @returns 방향성 조명 개수
     */
    get directionalLightCount(): number;
    /**
     * 등록된 방향성 조명 배열을 반환합니다.
     * @returns 등록된 DirectionalLight 배열
     */
    get directionalLights(): DirectionalLight[];
    /**
     * 현재 설정된 환경광(AmbientLight)을 반환합니다.
     * @returns AmbientLight 인스턴스 또는 null
     */
    get ambientLight(): AmbientLight;
    /**
     * 환경광(AmbientLight)을 설정합니다.
     * AmbientLight 인스턴스가 아닌 값을 전달하면 오류를 던집니다.
     * @param value 설정할 AmbientLight 인스턴스
     */
    set ambientLight(value: AmbientLight);
    /**
     * SpotLight를 추가합니다.
     * PointLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
     * @param value 추가할 SpotLight 인스턴스
     */
    addSpotLight(value: SpotLight): void;
    /**
     * PointLight를 추가합니다.
     * SpotLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
     * @param value 추가할 PointLight 인스턴스
     */
    addPointLight(value: PointLight): void;
    /**
     * DirectionalLight를 추가합니다.
     * 최대 방향성 조명 개수를 초과하면 오류를 던집니다.
     * @param value 추가할 DirectionalLight 인스턴스
     */
    addDirectionalLight(value: DirectionalLight): void;
    /**
     * 특정 SpotLight를 제거합니다.
     * 목록에 없으면 아무 동작도 하지 않습니다.
     * @param value 제거할 SpotLight 인스턴스
     */
    removeSpotLight(value: SpotLight): void;
    /**
     * 특정 PointLight를 제거합니다.
     * 목록에 없으면 아무 동작도 하지 않습니다.
     * @param value 제거할 PointLight 인스턴스
     */
    removePointLight(value: PointLight): void;
    /**
     * 특정 DirectionalLight를 제거합니다.
     * 목록에 없으면 아무 동작도 하지 않습니다.
     * @param value 제거할 DirectionalLight 인스턴스
     */
    removeDirectionalLight(value: DirectionalLight): void;
    /** 모든 SpotLight를 제거합니다. */
    removeAllSpotLight(): void;
    /** 모든 PointLight를 제거합니다. */
    removeAllPointLight(): void;
    /** 모든 DirectionalLight를 제거합니다. */
    removeAllDirectionalLight(): void;
    /**
     * 장면의 모든 조명을 제거합니다.
     * 포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.
     */
    removeAllLight(): void;
    /**
     * View3D에 필요한 시스템 유니폼 버퍼를 업데이트합니다.
     *
     * @param view 업데이트 대상 View3D 인스턴스
     */
    updateViewSystemUniforms(view: View3D): void;
}
export default LightManager;
