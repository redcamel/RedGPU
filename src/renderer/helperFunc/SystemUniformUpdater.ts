import {mat4} from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../../camera/camera/OrthographicCamera";
import updateSystemUniformData from "./updateSystemUniformData";
import DirectionalLight from "../../light/lights/DirectionalLight";
import AmbientLight from "../../light/lights/AmbientLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import SkyAtmosphere from "../../display/skyAtmosphere/SkyAtmosphere";
import WindManager from "../../wind/WindManager";

let temp3 = mat4.create()
const tempCascadeTexelSizes = new Float32Array(4);

/**
 * [KO] 카메라, 조명, 그림자, 대기 산란, 바람 등 시스템 전역 WGSL 유니폼 구조체 데이터를 `Float32Array`/`Uint32Array` 버퍼에 업데이트하는 유틸리티 클래스입니다.
 * [EN] Utility class that updates system-wide WGSL uniform structure data such as camera, lights, shadows, sky atmosphere, and wind to `Float32Array`/`Uint32Array` buffers.
 *
 * @category Renderer
 */
class SystemUniformUpdater {
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
    static updateCamera(
        camera: PerspectiveCamera | Camera2D | OrthographicCamera,
        cameraMembers: any,
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
                },
                {
                    key: 'ev100',
                    //@ts-ignore
                    value: camera.ev100,
                },
                {
                    key: 'aperture',
                    //@ts-ignore
                    value: camera.aperture,
                },
                {
                    key: 'shutterSpeed',
                    //@ts-ignore
                    value: camera.shutterSpeed,
                },
                {
                    key: 'iso',
                    //@ts-ignore
                    value: camera.iso,
                }
            ]
        )
    }

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
    static updateShadow(
        shadowManager: any,
        shadowMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        const directionalShadowManager = shadowManager.directionalShadowManager;
        const cascadePV = directionalShadowManager.cascadeProjectionViewMatrices;
        const cascadeSplits = directionalShadowManager.cascadeSplitDepths;
        const depthTexSize = directionalShadowManager.shadowDepthTextureSize;
        const oneOverTextureSize = 1.0 / Math.max(1, depthTexSize);

        for (let i = 0; i < 4; i++) {
            const mat = cascadePV[i];
            if (mat) {
                const m0 = mat[0];
                const m1 = mat[1];
                const m2 = mat[2];
                const orthoScaleSq = m0 * m0 + m1 * m1 + m2 * m2;
                const invOrthoScale = orthoScaleSq > 1e-8 ? 1.0 / Math.sqrt(orthoScaleSq) : 100.0;
                tempCascadeTexelSizes[i] = (orthoScaleSq > 1e-8 ? 2.0 * invOrthoScale : 0.01) * oneOverTextureSize;
            } else {
                tempCascadeTexelSizes[i] = 0.01 * oneOverTextureSize;
            }
        }

        updateSystemUniformData(
            shadowMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'directionalShadowDepthTextureSize',
                    value: directionalShadowManager.shadowDepthTextureSize,
                },
                {
                    key: 'directionalShadowBias',
                    value: directionalShadowManager.bias,
                },
                {
                    key: 'directionalShadowStrength',
                    value: directionalShadowManager.strength,
                },
                {
                    key: 'cascadeCount',
                    value: directionalShadowManager.cascadeCount,
                },
                {
                    key: 'cascadeSplitDepths',
                    value: cascadeSplits,
                },
                {
                    key: 'cascadeTexelSizes',
                    value: tempCascadeTexelSizes,
                },
                {
                    key: 'pcssLightSize',
                    value: directionalShadowManager.pcssLightSize,
                },
                {
                    key: 'casterBoundingCenter',
                    value: directionalShadowManager.casterBoundingCenter,
                },
                {
                    key: 'casterBoundingRadiusSq',
                    value: directionalShadowManager.casterBoundingRadiusSq,
                }
            ]
        );

        const matricesInfo = shadowMembers.cascadeLightViewProjectionMatrices;
        if (matricesInfo) {
            const startOffset = matricesInfo.uniformOffset / Float32Array.BYTES_PER_ELEMENT;
            for (let i = 0; i < 4; i++) {
                uniformDataF32.set(cascadePV[i], startOffset + i * 16);
            }
        }
    }

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
    static updateSkyAtmosphere(
        skyAtmosphere: SkyAtmosphere,
        systemMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        const params = skyAtmosphere?.params;
        const skyAtmosphereMembers = systemMembers.skyAtmosphere.members;

        updateSystemUniformData(
            systemMembers, uniformDataF32, uniformDataU32,
            [{key: 'useSkyAtmosphere', value: skyAtmosphere ? 1 : 0}]
        );

        updateSystemUniformData(
            skyAtmosphereMembers, uniformDataF32, uniformDataU32,
            [
                {key: 'rayleighScattering', value: params?.rayleighScattering || [0, 0, 0]},
                {key: 'rayleighExponentialDistribution', value: params?.rayleighExponentialDistribution || 0},
                {key: 'mieScattering', value: params?.mieScattering || [0, 0, 0]},
                {key: 'mieAnisotropy', value: params?.mieAnisotropy || 0},
                {key: 'mieAbsorption', value: params?.mieAbsorption || [0, 0, 0]},
                {key: 'mieExponentialDistribution', value: params?.mieExponentialDistribution || 0},
                {key: 'absorptionCoefficient', value: params?.absorptionCoefficient || [0, 0, 0]},
                {key: 'absorptionTipAltitude', value: params?.absorptionTipAltitude || 0},
                {key: 'groundAlbedo', value: params?.groundAlbedo || [0, 0, 0]},
                {key: 'absorptionTentWidth', value: params?.absorptionTentWidth || 0},
                {key: 'skyLuminanceFactor', value: params?.skyLuminanceFactor || [1, 1, 1]},
                {key: 'multiScatteringFactor', value: params?.multiScatteringFactor || 0},
                {key: 'sunDirection', value: params?.sunDirection || [0, 0, 0]},
                {key: 'transmittanceMinLightElevationAngle', value: params?.transmittanceMinLightElevationAngle || 0},
                {key: 'groundRadius', value: params?.groundRadius || 0},
                {key: 'atmosphereHeight', value: params?.atmosphereHeight || 0},
                {key: 'aerialPerspectiveDistanceScale', value: params?.aerialPerspectiveDistanceScale || 100.0},
                {key: 'aerialPerspectiveStartDepth', value: params?.aerialPerspectiveStartDepth || 0},
                {key: 'sunIntensity', value: params?.sunIntensity || 0},
                {key: 'sunSize', value: params?.sunSize || 0},
                {key: 'sunLimbDarkening', value: params?.sunLimbDarkening || 0.0},
                {key: 'cameraHeight', value: params?.cameraHeight || 0},
                {key: 'cloudTime', value: params?.cloudTime || 0},
                {key: 'cloudTimeMultiplier', value: params?.cloudTimeMultiplier || 0},
                {key: 'cloudCoverage', value: params?.cloudCoverage || 0},
                {key: 'cloudDensity', value: params?.cloudDensity || 0},
                {key: 'cloudHeight', value: params?.cloudHeight || 0},
            ]
        )
    }

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
                        value: light.intensityMultiplier * light.lux,
                    }
                ]
            )
        })
    }

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
    static updateAmbientLight(
        ambientLight: AmbientLight,
        ambientLightMembers: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        updateSystemUniformData(
            ambientLightMembers, uniformDataF32, uniformDataU32,
            [
                {
                    key: 'color',
                    value: ambientLight ? ambientLight.color.rgbNormalLinear : [0, 0, 0],
                },
                {
                    key: 'intensity',
                    value: ambientLight ? ambientLight.intensityMultiplier * ambientLight.lux : 0,
                },
            ]
        )
    }

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
    static updateWind(
        windManager: WindManager,
        windMembersInfo: any,
        uniformDataF32: Float32Array,
        uniformDataU32: Uint32Array
    ) {
        if (!windMembersInfo) return;
        const members = windMembersInfo.members || windMembersInfo;
        const enabledInfo = members.enabled;
        if (!enabledInfo) return;

        const enabledIdx = (enabledInfo.uniformOffset ?? enabledInfo.offset) / 4;
        if (!windManager || !windManager.enabled) {
            uniformDataU32[enabledIdx] = 0;
            return;
        }

        const dirInfo = members.direction;
        if (dirInfo) {
            const dir = windManager.direction;
            const dirIdx = (dirInfo.uniformOffset ?? dirInfo.offset) / 4;
            uniformDataF32[dirIdx] = dir[0];
            uniformDataF32[dirIdx + 1] = dir[1];
            uniformDataF32[dirIdx + 2] = dir[2];
        }

        const speedInfo = members.speed;
        if (speedInfo) {
            uniformDataF32[(speedInfo.uniformOffset ?? speedInfo.offset) / 4] = windManager.speed;
        }

        const strengthInfo = members.strength;
        if (strengthInfo) {
            uniformDataF32[(strengthInfo.uniformOffset ?? strengthInfo.offset) / 4] = windManager.strength;
        }

        uniformDataU32[enabledIdx] = 1;
    }
}

Object.freeze(SystemUniformUpdater)
export default SystemUniformUpdater