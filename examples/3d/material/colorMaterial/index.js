import * as RedGPU from "../../../../dist/index.js?t=1768401228425";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;
        controller.speedDistance = 0.1;

        const scene = new RedGPU.Display.Scene();
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
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

const renderTestPane = async (redGPUContext, mesh) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768401228425');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1768401228425");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const params = {
        color: {r: 255, g: 0, b: 0},
    };

    const refresh = () => {
        params.color.r = mesh.material.color.r;
        params.color.g = mesh.material.color.g;
        params.color.b = mesh.material.color.b;
        pane.refresh();
    };

    pane.addBinding(params, 'color', {
        picker: 'inline',
        view: 'color',
        expanded: true,
    }).on('change', (ev) => {
        const r = Math.floor(ev.value.r);
        const g = Math.floor(ev.value.g);
        const b = Math.floor(ev.value.b);
        mesh.material.color.setColorByRGB(r, g, b);
        refresh();
    });

    setSeparator(pane);

    ['r', 'g', 'b'].forEach(key => {
        pane.addBinding(params.color, key, {min: 0, max: 255, step: 1})
            .on('change', (e) => {
                mesh.material.color[key] = e.value;
                refresh();
            });
    });

    pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01})
        .on('change', (e) => {
            mesh.material.opacity = e.value;
        });

    setSeparator(pane);

    {
        const r = 0, g = 128, b = 255;
        pane.addButton({title: `setColorByRGB(${r}, ${g}, ${b})`})
            .on('click', () => {
                mesh.material.color.setColorByRGB(r, g, b);
                refresh();
            });
    }

    {
        const hexColor = '#ff00ff';
        pane.addButton({title: `setColorByHEX(${hexColor})`})
            .on('click', () => {
                mesh.material.color.setColorByHEX(hexColor);
                refresh();
            });
    }

    {
        const rgbString = 'rgb(34, 139, 34)';
        pane.addButton({title: `setColorByRGBString(${rgbString})`})
            .on('click', () => {
                mesh.material.color.setColorByRGBString(rgbString);
                const [r, g, b] = mesh.material.color.rgb;
                params.color.r = r;
                params.color.g = g;
                params.color.b = b;
                pane.refresh();
            });
    }
};
