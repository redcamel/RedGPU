import * as RedGPU from "../../../../../dist/index.js?t=1770625511985";
import {
    loadingProgressInfoHandler
} from '../../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1770625511985'

/**
 * [KO] High Vertex Load Skinning 예제
 * [EN] High Vertex Load Skinning example
 *
 * [KO] 높은 버텍스 부하를 가진 스키닝 애니메이션 객체를 다수 렌더링하여 성능을 테스트합니다.
 * [EN] Tests performance by rendering multiple skinning animation objects with high vertex load.
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

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight())

        {
            let i = redGPUContext.detector.isMobile ? 25 : 100
            while (i--) {
                loadGLTF(view, 'https://redcamel.github.io/RedGL2/asset/glTF/breakDance/scene.gltf');
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
            mesh.setScale(0.001)
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
    )
}

let pane
/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770625511985');
    const {
        setDebugButtons,
        createIblHelper
    } = await import('../../../../exampleHelper/createExample/panes/index.js?t=1770625511985');
    setDebugButtons(RedGPU, redGPUContext);
    pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
    const moreNum = redGPUContext.detector.isMobile ? 5 : 10
    pane.addButton({
        title: `Add ${moreNum} BreakDance`,
    }).on('click', () => {
        let i = moreNum
        while (i--) {
            loadGLTF(targetView, 'https://redcamel.github.io/RedGL2/asset/glTF/breakDance/scene.gltf',);
        }
    })

    pane.addBinding(targetView.scene.children, 'length', {
        disabled: true,
        label: `Count BreakDance`,
        step: 1
    })
};