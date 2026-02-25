import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../camera/camera/OrthographicCamera";
import updateSystemUniformData from "./updateSystemUniformData";
import DirectionalLight from "../light/lights/DirectionalLight";
import AmbientLight from "../light/lights/AmbientLight";
import RenderViewStateData from "../display/view/core/RenderViewStateData";

let temp3 = mat4.create()

/**
 * [KO] 시스템 유니폼 데이터를 업데이트하는 유틸리티 클래스입니다.
 * [EN] A utility class for updating system uniform data.
 *
 * [KO] 카메라, 조명, 그림자 등 시스템 전역에서 공통으로 사용되는 WGSL 구조체 데이터를 Float32Array/Uint32Array 버퍼에 매핑합니다.
 * [EN] Maps WGSL structure data commonly used globally in the system, such as cameras, lights, and shadows, to Float32Array/Uint32Array buffers.
 *
 * @category Renderer
 */
class SystemUniformUpdater {
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
    static updateCamera(
        camera: PerspectiveCamera | Camera2D | OrthographicCamera,
        cameraMembers: any, //TODO 타입을 정해야하나...
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        const {viewMatrix, position} = camera
        const camera2DYn = camera instanceof Camera2D;
        updateSystemUniformData(
            cameraMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'viewMatrix',
                    value: viewMatrix,
                },
                {
                    key: 'inverseViewMatrix',
                    value: mat4.invert(temp3, viewMatrix),
                },
                {
                    key: 'cameraPosition',
                    value: position,
                },
                {
                    key: 'nearClipping',
                    value: camera2DYn ? 0 : camera.nearClipping,
                },
                {
                    key: 'farClipping',
                    value: camera2DYn ? 0 : camera.farClipping,
                },
                {
                    key: 'fieldOfView',
                    //@ts-ignore
                    value: camera.fieldOfView * Math.PI / 180,
                }
            ]
        )
    }

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
    static updateShadow(
        shadowManager: any,
        shadowMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        updateSystemUniformData(
            shadowMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'directionalShadowDepthTextureSize',
                    value: shadowManager.directionalShadowManager.shadowDepthTextureSize,
                },
                {
                    key: 'directionalShadowBias',
                    value: shadowManager.directionalShadowManager.bias,
                }
            ]
        )
    }

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
    static updateSkyAtmosphere(
        skyAtmosphere: any, // TODO: SkyAtmosphere 타입 정의 필요
        skyAtmosphereMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        updateSystemUniformData(
            skyAtmosphereMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'useSkyAtmosphere',
                    value: skyAtmosphere ? 1 : 0,
                },
                {
                    key: 'skyAtmosphereSunIntensity',
                    value: skyAtmosphere ? skyAtmosphere.sunIntensity : 0,
                },
                {
                    key: 'skyAtmosphereExposure',
                    value: skyAtmosphere ? skyAtmosphere.exposure : 1,
                },
                {
                    key: 'skyAtmosphereCameraHeight',
                    value: skyAtmosphere ? skyAtmosphere.cameraHeight : 0.001,
                },
                {
                    key: 'skyAtmosphereSunDirection',
                    value: skyAtmosphere ? skyAtmosphere.sunDirection : new Float32Array([0, 0, 0]),
                },
                {
                    key: 'skyAtmosphereEarthRadius',
                    value: skyAtmosphere ? skyAtmosphere.earthRadius : 6360.0,
                },
                {
                    key: 'skyAtmosphereAtmosphereHeight',
                    value: skyAtmosphere ? skyAtmosphere.atmosphereHeight : 60.0,
                }
            ]
        )
    }

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
    static updateTime(
        timeInfo: {
            time: number,
            deltaTime: number,
            frameIndex: number,
            sinTime: number,
        } | RenderViewStateData,
        timeMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        updateSystemUniformData(
            timeMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'time',
                    value: timeInfo.time,
                },
                {
                    key: 'deltaTime',
                    value: timeInfo.deltaTime,
                },
                {
                    key: 'frameIndex',
                    value: timeInfo.frameIndex,
                },
                {
                    key: 'sinTime',
                    value: timeInfo.sinTime,
                }
            ]
        )
    }

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
    static updateProjection(
        projectionInfo: {
            projectionMatrix: mat4,
            projectionViewMatrix: mat4,
            noneJitterProjectionMatrix: mat4,
            noneJitterProjectionViewMatrix: mat4,
            inverseProjectionMatrix: mat4,
            inverseProjectionViewMatrix?: mat4,
            prevNoneJitterProjectionViewMatrix: mat4,
        },
        projectionMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        updateSystemUniformData(
            projectionMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'projectionMatrix',
                    value: projectionInfo.projectionMatrix,
                },
                {
                    key: 'projectionViewMatrix',
                    value: projectionInfo.projectionViewMatrix,
                },
                {
                    key: 'noneJitterProjectionMatrix',
                    value: projectionInfo.noneJitterProjectionMatrix,
                },
                {
                    key: 'noneJitterProjectionViewMatrix',
                    value: projectionInfo.noneJitterProjectionViewMatrix,
                },
                {
                    key: 'inverseProjectionMatrix',
                    value: projectionInfo.inverseProjectionMatrix,
                },
                {
                    key: 'inverseProjectionViewMatrix',
                    value: projectionInfo.inverseProjectionViewMatrix || mat4.create(),
                },
                {
                    key: 'prevNoneJitterProjectionViewMatrix',
                    value: projectionInfo.prevNoneJitterProjectionViewMatrix,
                }
            ]
        )
    }

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
    static updateDirectionalLights(
        directionalLights: DirectionalLight[],
        directionalLightsMemberList: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array,
    ) {
        directionalLights.forEach((light: DirectionalLight, index: number) => {
            const targetMembers = directionalLightsMemberList[index]
            updateSystemUniformData(
                targetMembers, uniformDataF32, uniformDataU32,
                [
                    {
                        key: 'direction',
                        value: light.direction,
                    },
                    {
                        key: 'color',
                        value: light.color.rgbNormalLinear,
                    },
                    {
                        key: 'intensity',
                        value: light.intensity,
                    }
                ]
            )
        })
    }

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
    static updateAmbientLight(
        ambientLight: AmbientLight,
        ambientLightMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        if (ambientLight) {
            updateSystemUniformData(
                ambientLightMembers, uniformDataF32, uniformDataU32,
                [
                    {
                        key: 'color',
                        value: ambientLight.color.rgbNormalLinear,
                    },
                    {
                        key: 'intensity',
                        value: ambientLight.intensity,
                    },
                ]
            )
        }
    }
}

Object.freeze(SystemUniformUpdater)
export default SystemUniformUpdater