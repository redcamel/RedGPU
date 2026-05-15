import * as RedGPU from "../../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Medium Load Skinning 예제
 * [EN] Medium Load Skinning example
 *
 * [KO] 중간 정도 부하를 가진 스키닝 애니메이션 객체를 다수 렌더링하여 성능을 테스트합니다.
 * [EN] Tests performance by rendering multiple skinning animation objects with medium load.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
        view.ibl = ibl;
        view.skybox = newSkybox;

        {
            let i = redGPUContext.detector.isMobile ? 200 : 500
            while (i--) {
                loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf');
                // ;loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb')

            }
        }
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

let num = 0
let first = true

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.Display.View3D} view
 * @param {string} url
 */
function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            if (num !== 0) {
                mesh.x = Math.random() * 30 - 15
                mesh.z = Math.random() * 30 - 15
            }
            num++
            pane?.refresh()
            first = false
        },
        (e) => first ? loadingProgressInfoHandler(e) : null
    );
}

let pane