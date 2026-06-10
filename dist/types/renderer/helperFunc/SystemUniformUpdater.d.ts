import { mat4 } from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../../camera/camera/OrthographicCamera";
import DirectionalLight from "../../light/lights/DirectionalLight";
import AmbientLight from "../../light/lights/AmbientLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import SkyAtmosphere from "../../display/skyAtmosphere/SkyAtmosphere";
/**
 * [KO] 시스템 유니폼 데이터를 업데이트하는 유틸리티 클래스입니다.
 * [EN] A utility class for updating system uniform data.
 *
 * [KO] 카메라, 조명, 그림자 등 시스템 전역에서 공통으로 사용되는 WGSL 구조체 데이터를 Float32Array/Uint32Array 버퍼에 매핑합니다.
 * [EN] Maps WGSL structure data commonly used globally in the system, such as cameras, lights, and shadows, to Float32Array/Uint32Array buffers.
 *
 * @category Renderer
 */
declare class SystemUniformUpdater {
    /**
     * [KO] 카메라 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates camera information to uniform data.
     *
     * @param camera -
     * [KO] 업데이트할 카메라 인스턴스
     * [EN] Camera instance to update
     * @param cameraMembers -
     * [KO] WGSL 카메라 구조체 멤버 정보
     * [EN] WGSL camera structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateCamera(camera: PerspectiveCamera | Camera2D | OrthographicCamera, cameraMembers: any, //TODO 타입을 정해야하나...
    uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 그림자 설정 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates shadow configuration information to uniform data.
     *
     * @param shadowManager -
     * [KO] 쉐도우 매니저 인스턴스
     * [EN] Shadow manager instance
     * @param shadowMembers -
     * [KO] WGSL 그림자 구조체 멤버 정보
     * [EN] WGSL shadow structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateShadow(shadowManager: any, shadowMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 대기 산란(SkyAtmosphere) 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates SkyAtmosphere information to uniform data.
     *
     * @param skyAtmosphere -
     * [KO] 대기 산란 인스턴스
     * [EN] SkyAtmosphere instance
     * @param skyAtmosphereMembers -
     * [KO] WGSL 대기 산란 구조체 멤버 정보
     * [EN] WGSL SkyAtmosphere structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateSkyAtmosphere(skyAtmosphere: SkyAtmosphere, systemMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 시간 관련 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates time-related information to uniform data.
     *
     * @param timeInfo -
     * [KO] 시간 정보 객체
     * [EN] Time information object
     * @param timeMembers -
     * [KO] WGSL 시간 구조체 멤버 정보
     * [EN] WGSL time structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateTime(timeInfo: {
        time: number;
        deltaTime: number;
        frameIndex: number;
        sinTime: number;
    } | RenderViewStateData, timeMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 투영 관련 행렬 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates projection-related matrix information to uniform data.
     *
     * @param projectionInfo -
     * [KO] 투영 행렬 정보 객체
     * [EN] Projection matrix information object
     * @param projectionMembers -
     * [KO] WGSL 투영 구조체 멤버 정보
     * [EN] WGSL projection structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateProjection(projectionInfo: {
        projectionMatrix: mat4;
        projectionViewMatrix: mat4;
        noneJitterProjectionMatrix: mat4;
        noneJitterProjectionViewMatrix: mat4;
        inverseProjectionMatrix: mat4;
        inverseProjectionViewMatrix?: mat4;
        prevNoneJitterProjectionViewMatrix: mat4;
    }, projectionMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 직사광(DirectionalLight) 배열 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates DirectionalLight array information to uniform data.
     *
     * @param directionalLights -
     * [KO] 업데이트할 직사광 배열
     * [EN] Array of DirectionalLight to update
     * @param directionalLightsMemberList -
     * [KO] WGSL 직사광 구조체 배열 멤버 리스트
     * [EN] Member list of WGSL DirectionalLight structure array
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateDirectionalLights(directionalLights: DirectionalLight[], directionalLightsMemberList: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 환경광(AmbientLight) 정보를 유니폼 데이터에 업데이트합니다.
     * [EN] Updates AmbientLight information to uniform data.
     *
     * @param ambientLight -
     * [KO] 업데이트할 환경광 인스턴스
     * [EN] AmbientLight instance to update
     * @param ambientLightMembers -
     * [KO] WGSL 환경광 구조체 멤버 정보
     * [EN] WGSL AmbientLight structure member information
     * @param uniformDataF32 -
     * [KO] 대상 Float32Array 버퍼
     * [EN] Target Float32Array buffer
     * @param uniformDataU32 -
     * [KO] 대상 Uint32Array 버퍼
     * [EN] Target Uint32Array buffer
     */
    static updateAmbientLight(ambientLight: AmbientLight, ambientLightMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
}
export default SystemUniformUpdater;
