import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../camera/camera/OrthographicCamera";
import updateSystemUniformData from "./updateSystemUniformData";
import DirectionalLight from "../light/lights/DirectionalLight";
import AmbientLight from "../light/lights/AmbientLight";
import RedGPUContext from "../context/RedGPUContext";
import RenderViewStateData from "../display/view/core/RenderViewStateData";

let temp3 = mat4.create()

class SystemUniformUpdater {
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
                }
            ]
        )
    }

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