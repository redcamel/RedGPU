import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import OrthographicCamera from "../camera/camera/OrthographicCamera";

let temp3 = mat4.create()

const updateSystemUniformData = (targetMembers,dataView,valueLust: { key, value}[]) => {
    valueLust.forEach(({key, value}) => {
        const info = targetMembers[key]
        dataView.set(typeof value === 'number' ? [value] : value, info.uniformOffset / info.View.BYTES_PER_ELEMENT)
    })
}

class SystemUniformUpdater {
    static updateCamera(
        camera: PerspectiveCamera | Camera2D | OrthographicCamera ,
        cameraMembers:any, //TODO 타입을 정해야하나...
        uniformDataF32: Float32Array
    ) {
        const {viewMatrix, position} = camera
        const camera2DYn = camera instanceof Camera2D;
        updateSystemUniformData(
            cameraMembers,uniformDataF32,
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
}

Object.freeze(SystemUniformUpdater)
export default SystemUniformUpdater