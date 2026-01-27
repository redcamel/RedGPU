import * as RedGPU from "../../../../dist/index.js?t=1769498378009";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const mesh = createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleMesh = (redGPUContext, scene) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
    scene.addChild(mesh);

    return mesh;
};

const renderTestPane = async (redGPUContext, mesh) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769498378009');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769498378009");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01})
        .on('change', (e) => {
            mesh.material.opacity = e.value;
        });

    const textures = [
        {name: 'set diffuseTexture : png', path: '../../../assets/imageFormat/webgpu.png'},
        {name: 'set diffuseTexture : jpg', path: '../../../assets/imageFormat/webgpu.jpg'},
        {name: 'set diffuseTexture : webp', path: '../../../assets/imageFormat/webgpu.webp'},
        {name: 'set diffuseTexture : svg', path: '../../../assets/imageFormat/webgpu.svg'},
    ];

    pane.addFolder({title: 'Textures'});
    textures.forEach(({name, path}) => {
        pane.addButton({title: name}).on('click', () => {
            mesh.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, path);
            console.log(`Texture applied: ${path}`);
        });
    });

    setSeparator(pane);
};
