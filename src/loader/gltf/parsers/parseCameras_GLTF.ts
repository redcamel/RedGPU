import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import {GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";


/**
 * [KO] GLTF 카메라 정의(`perspective` / `orthographic`)를 RedGPU 카메라 인스턴스로 변환하여 `gltfLoader.parsingResult.cameras`에 추가합니다.
 * [EN] Converts GLTF camera definitions (`perspective` / `orthographic`) into RedGPU camera instances and appends them to `gltfLoader.parsingResult.cameras`.
 *
 * [KO] 원근 카메라의 `yfov`는 radian에서 degree로 변환되며, 직교 카메라는 `xmag`/`ymag`/`znear`/`zfar`를 `OrthographicCamera` 경계로 매핑합니다.
 * [EN] For perspective cameras, `yfov` is converted from radians to degrees; for orthographic cameras, `xmag`/`ymag`/`znear`/`zfar` are mapped to `OrthographicCamera` bounds.
 *
 * @param gltfLoader -
 * [KO] 파싱 결과를 저장할 GLTFLoader 인스턴스
 * [EN] GLTFLoader instance that stores the parsing result
 * @param gltfData -
 * [KO] 파싱할 GLTF 데이터
 * [EN] GLTF data to parse
 */
const parseCameras_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF) => {
    const {cameras} = gltfData;
    if (cameras) {
        for (let i = 0, len = cameras.length; i < len; i++) {
            const camera = cameras[i];
            if (camera.type === 'orthographic' && camera.orthographic) {
                const orthoCam = new OrthographicCamera();
                const {xmag, ymag, znear, zfar} = camera.orthographic;
                orthoCam.left = -xmag;
                orthoCam.right = xmag;
                orthoCam.top = ymag;
                orthoCam.bottom = -ymag;
                orthoCam.nearClipping = znear;
                orthoCam.farClipping = zfar;
                gltfLoader.parsingResult.cameras.push(orthoCam);
            } else {
                const camera3D = new PerspectiveCamera();
                if (camera.perspective) {
                    const yfov = camera.perspective.yfov ?? camera.perspective.yfieldOfView;
                    if (yfov !== undefined) {
                        camera3D.fieldOfView = yfov * 180 / Math.PI;
                    }
                    if (camera.perspective.zfar !== undefined) {
                        camera3D.farClipping = camera.perspective.zfar;
                    }
                    if (camera.perspective.znear !== undefined) {
                        camera3D.nearClipping = camera.perspective.znear;
                    }
                }
                gltfLoader.parsingResult.cameras.push(camera3D);
            }
        }
    }
};
export default parseCameras_GLTF;
