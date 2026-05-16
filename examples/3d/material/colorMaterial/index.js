import * as RedGPU from "../../../../dist/index.js?t=1778920968741";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1778920968741";

/**
 * [KO] Color Material 예제
 * [EN] Color Material example
 *
 * [KO] ColorMaterial의 사용법과 색상 변경 기능을 보여줍니다.
 * [EN] Demonstrates the usage of ColorMaterial and color changing functionality.
 */

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
        
        view.grid = true;
        redGPUContext.addView(view);

        const mesh = createSampleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
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

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = async (redGPUContext, mesh) => {
    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
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

            const buttonFolder = pane.addFolder({title: 'Color Methods'});
            {
                const r = 0, g = 128, b = 255;
                buttonFolder.addButton({title: `setColorByRGB(${r}, ${g}, ${b})`})
                    .on('click', () => {
                        mesh.material.color.setColorByRGB(r, g, b);
                        refresh();
                    });
            }

            {
                const hexColor = '#ff00ff';
                buttonFolder.addButton({title: `setColorByHEX(${hexColor})`})
                    .on('click', () => {
                        mesh.material.color.setColorByHEX(hexColor);
                        refresh();
                    });
            }

            {
                const rgbString = 'rgb(34, 139, 34)';
                buttonFolder.addButton({title: `setColorByRGBString(${rgbString})`})
                    .on('click', () => {
                        mesh.material.color.setColorByRGBString(rgbString);
                        const [r, g, b] = mesh.material.color.rgb;
                        params.color.r = r;
                        params.color.g = g;
                        params.color.b = b;
                        pane.refresh();
                    });
            }
        }
    });
};
