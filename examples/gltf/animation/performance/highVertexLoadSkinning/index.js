import * as RedGPU from "../../../../../dist/index.js?t=1769497870527";
import {
    loadingProgressInfoHandler
} from '../../../../exampleHelper/createExample/loadingProgressInfoHandler.js?t=1769497870527'

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
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769497870527');
    const {
        setDebugButtons,
        createIblHelper
    } = await import('../../../../exampleHelper/createExample/panes/index.js?t=1769497870527');
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
