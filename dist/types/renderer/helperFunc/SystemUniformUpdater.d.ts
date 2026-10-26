import { mat4 } from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../../camera/camera/OrthographicCamera";
import DirectionalLight from "../../light/lights/DirectionalLight";
import AmbientLight from "../../light/lights/AmbientLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import SkyAtmosphere from "../../display/skyAtmosphere/SkyAtmosphere";
import WindManager from "../../wind/WindManager";
/**
 * [KO] 카메라, 조명, 그림자, 대기 산란, 바람 등 시스템 전역 WGSL 유니폼 구조체 데이터를 `Float32Array`/`Uint32Array` 버퍼에 업데이트하는 유틸리티 클래스입니다.
 * [EN] Utility class that updates system-wide WGSL uniform structure data such as camera, lights, shadows, sky atmosphere, and wind to `Float32Array`/`Uint32Array` buffers.
 *
 * @category Renderer
 */
declare class SystemUniformUpdater {
    /**
     * [KO] 카메라 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates camera information to the system uniform buffer.
     *
     * @param camera -
     * [KO] 업데이트할 카메라 인스턴스
     * [EN] Camera instance to update
     * @param cameraMembers -
     * [KO] WGSL 카메라 구조체 멤버 정보
     * [EN] WGSL camera structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateCamera(camera: PerspectiveCamera | Camera2D | OrthographicCamera, cameraMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 그림자 설정 및 캐스케이드 행렬 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates shadow configuration and cascade matrix information to the system uniform buffer.
     *
     * @param shadowManager -
     * [KO] 섀도우 매니저 인스턴스
     * [EN] Shadow manager instance
     * @param shadowMembers -
     * [KO] WGSL 그림자 구조체 멤버 정보
     * [EN] WGSL shadow structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateShadow(shadowManager: any, shadowMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 대기 산란(`SkyAtmosphere`) 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates `SkyAtmosphere` information to the system uniform buffer.
     *
     * @param skyAtmosphere -
     * [KO] `SkyAtmosphere` 인스턴스
     * [EN] `SkyAtmosphere` instance
     * @param systemMembers -
     * [KO] WGSL 시스템 유니폼 구조체 멤버 정보
     * [EN] WGSL system uniform structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateSkyAtmosphere(skyAtmosphere: SkyAtmosphere, systemMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 시간 및 프레임 관련 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates time and frame-related information to the system uniform buffer.
     *
     * @param timeInfo -
     * [KO] 시간 정보 객체 또는 `RenderViewStateData` 인스턴스
     * [EN] Time information object or `RenderViewStateData` instance
     * @param timeMembers -
     * [KO] WGSL 시간 구조체 멤버 정보
     * [EN] WGSL time structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateTime(timeInfo: {
        time: number;
        deltaTime: number;
        frameIndex: number;
        sinTime: number;
    } | RenderViewStateData, timeMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 투영 및 뷰-투영 행렬 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates projection and view-projection matrix information to the system uniform buffer.
     *
     * @param projectionInfo -
     * [KO] 투영 행렬 정보 객체
     * [EN] Projection matrix information object
     * @param projectionMembers -
     * [KO] WGSL 투영 구조체 멤버 정보
     * [EN] WGSL projection structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
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
     * [KO] 직사광(`DirectionalLight`) 배열 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates `DirectionalLight` array information to the system uniform buffer.
     *
     * @param directionalLights -
     * [KO] 업데이트할 직사광 배열 (`DirectionalLight[]`)
     * [EN] Array of directional lights to update (`DirectionalLight[]`)
     * @param directionalLightsMemberList -
     * [KO] WGSL 직사광 구조체 배열 멤버 리스트
     * [EN] Member list of WGSL `DirectionalLight` structure array
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateDirectionalLights(directionalLights: DirectionalLight[], directionalLightsMemberList: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 환경광(`AmbientLight`) 정보를 시스템 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates `AmbientLight` information to the system uniform buffer.
     *
     * @param ambientLight -
     * [KO] 업데이트할 환경광 인스턴스 (`AmbientLight`)
     * [EN] `AmbientLight` instance to update
     * @param ambientLightMembers -
     * [KO] WGSL 환경광 구조체 멤버 정보
     * [EN] WGSL `AmbientLight` structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateAmbientLight(ambientLight: AmbientLight, ambientLightMembers: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
    /**
     * [KO] 바람(`WindManager`) 환경 정보를 시스템 유니폼 버퍼에 직접 복사하여 업데이트합니다.
     * [EN] Updates `WindManager` environmental information by directly copying it into the system uniform buffer.
     *
     * @param windManager -
     * [KO] 업데이트할 `WindManager` 인스턴스
     * [EN] `WindManager` instance to update
     * @param windMembersInfo -
     * [KO] WGSL 바람 구조체 멤버 정보
     * [EN] WGSL wind structure member information
     * @param uniformDataF32 -
     * [KO] 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer
     * @param uniformDataU32 -
     * [KO] 대상 `Uint32Array` 버퍼
     * [EN] Target `Uint32Array` buffer
     */
    static updateWind(windManager: WindManager, windMembersInfo: any, uniformDataF32: Float32Array, uniformDataU32: Uint32Array): void;
}
export default SystemUniformUpdater;
