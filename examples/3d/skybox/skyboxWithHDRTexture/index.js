import * as RedGPU from "../../../../dist/index.js?t=1769586122100";

const HDR_ASSETS = [
    {name: '2K - the sky is on fire', path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'},
    {name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr'},
    {name: 'field', path: '../../../assets/hdr/field.hdr'},
    {name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr'},
    {name: 'pisa', path: '../../../assets/hdr/pisa.hdr'},
];

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const newTexture = new RedGPU.Resource.HDRTexture(redGPUContext, HDR_ASSETS[0].path);
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, newTexture);
        renderTestPane(view)

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        document.body.innerHTML = `<div style="color:red;">Error: ${failReason}</div>`;
    }
);
const renderTestPane = async (targetView) => {
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769586122100" );
    const pane = new Pane();
    const {
        createFieldOfView,
        createIblHelper,
        setDebugButtons
    } = await import( "../../../exampleHelper/createExample/panes/index.js?t=1769586122100" );
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera)
    createIblHelper(pane, targetView, RedGPU);
};