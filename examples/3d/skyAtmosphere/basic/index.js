import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // 초기 카메라 위치 조정 (지평선을 바라보도록)
        controller.tilt = -10;
        controller.distance = 100;
        
        view.axis = true;
        redGPUContext.addView(view);
        
        // SkyAtmosphere 생성 및 물리적 초기값 설정
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        skyAtmosphere.sunElevation = 5; // 노을 시점
        skyAtmosphere.exposure = 1.5; 
        view.skyAtmosphere = skyAtmosphere;

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
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910" );
    const pane = new Pane();
    const {
        createFieldOfView,
        createSkyAtmosphereHelper,
        setDebugButtons
    } = await import( "../../../exampleHelper/createExample/panes/index.js?t=1770713934910" );
    
    setDebugButtons(RedGPU, targetView.redGPUContext);
    createFieldOfView(pane, targetView.camera);
    createSkyAtmosphereHelper(pane, targetView);
};
