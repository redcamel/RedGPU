import Camera2D from "../../camera/camera/Camera2D";
import RedGPUContext from "../../context/RedGPUContext";
import Scene from "../scene/Scene";
import View3D from "./View3D";

class View2D extends View3D {
    constructor(redGPUContext: RedGPUContext, scene: Scene, name?: string) {
        const camera = new Camera2D()
        super(redGPUContext, scene, camera, name)
    }
}

Object.freeze(View2D)
export default View2D
