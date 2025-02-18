import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import {GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";

const parseCameras_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF) => {
    const {cameras} = gltfData
    if (cameras) {
        cameras.forEach(function (camera) {
            let camera3D = new PerspectiveCamera();
            if (camera.type == 'orthographic') {
                // t0.isScene2DMode = true; // TODO
            } else {
                camera3D.fieldOfView = camera.perspective.yfieldOfView * 180 / Math.PI;
                camera3D.farClipping = camera.perspective.zfar;
                camera3D.nearClipping = camera.perspective.znear;
            }
            // console.log('카메라', camera,camera3D);
            gltfLoader.parsingResult.cameras.push(camera3D);
        });
    }
};
export default parseCameras_GLTF;
