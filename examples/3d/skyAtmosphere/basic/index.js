import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // view.grid = true;
        view.axis = true;

        redGPUContext.addView(view);
        
        // SkyAtmosphere 생성 및 설정
        view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = async (targetView) => {
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js" );
    const pane = new Pane();
    const {
        createFieldOfView,
        createSkyAtmosphereHelper,
        setDebugButtons
    } = await import( "../../../exampleHelper/createExample/panes/index.js" );
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);
    createSkyAtmosphereHelper(pane, targetView);
};
