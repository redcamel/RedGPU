import * as RedGPU from "../../../../dist/index.js?t=1769835266959";

/**
 * [KO] Skybox With IBL 예제
 * [EN] Skybox With IBL example
 *
 * [KO] IBL(Image Based Lighting)을 사용하여 스카이박스를 생성하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a skybox using IBL (Image Based Lighting).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const hdrImages = [
    {name: '2K - the sky is on fire', path: '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'},
    {name: 'Cannon_Exterior', path: '../../../assets/hdr/Cannon_Exterior.hdr'},
    {name: 'field', path: '../../../assets/hdr/field.hdr'},
    {name: 'neutral.37290948', path: '../../../assets/hdr/neutral.37290948.hdr'},
    {name: 'pisa', path: '../../../assets/hdr/pisa.hdr'},
];

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        redGPUContext.addView(view);
        createIBL(view, hdrImages[0].path);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] IBL을 생성하고 스카이박스를 설정합니다.
 * [EN] Creates IBL and sets the skybox.
 * @param {RedGPU.Display.View3D} view
 * @param {string} src
 */
const createIBL = (view, src) => {
    const newIbl = new RedGPU.Resource.IBL(view.redGPUContext, src);
    const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, newIbl.environmentTexture);
    view.skybox = newSkybox;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (view) => {
    const {Pane} = await import( "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769835266959" );
    const pane = new Pane();
    const {
        createFieldOfView,
        setDebugButtons
    } = await import( "../../../exampleHelper/createExample/panes/index.js?t=1769835266959" );
    setDebugButtons(RedGPU, view.redGPUContext);
    createFieldOfView(pane, view.camera)
    const TEST_DATA = {
        blur: 0,
        opacity: 1,
    }
    pane.addBinding(TEST_DATA, 'blur', {
        min: 0,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        view.skybox.blur = ev.value;
    })
    pane.addBinding(TEST_DATA, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        view.skybox.opacity = ev.value;
    })

    const settings = {
        hdrImage: hdrImages[0].path,
    };

    pane.addBinding(settings, 'hdrImage', {
        options: hdrImages.reduce((acc, item) => {
            acc[item.name] = item.path;
            return acc;
        }, {})
    }).on("change", (ev) => {
        createIBL(view, ev.value);
        view.skybox.blur = TEST_DATA.blur
        view.skybox.opacity = TEST_DATA.opacity
    });

};