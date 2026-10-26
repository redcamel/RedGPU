import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] ColorMaterial 예제
 * [EN] ColorMaterial Example
 *
 * [KO] ColorMaterial의 기본 생성과 다양한 색상 설정 메서드(RGB, HEX, RGB 문자열) 및 투명도 제어를 시연합니다.
 * [EN] Demonstrates basic creation of ColorMaterial, various color setting methods (RGB, HEX, RGB string), and opacity control.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 단색 ColorMaterial을 생성하여 박스 메시에 적용
        // [EN] Create a solid ColorMaterial and apply it to a Box mesh
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        scene.addChild(mesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, material);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, material) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                color: {r: material.color.r, g: material.color.g, b: material.color.b},
            };

            const refreshUI = () => {
                params.color.r = material.color.r;
                params.color.g = material.color.g;
                params.color.b = material.color.b;
                pane.refresh();
            };

            pane.addBinding(params, 'color', {
                picker: 'inline',
                view: 'color',
                expanded: true,
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                refreshUI();
            });

            ['r', 'g', 'b'].forEach((key) => {
                pane.addBinding(material.color, key, {min: 0, max: 255, step: 1}).on('change', () => {
                    refreshUI();
                });
            });

            pane.addBinding(material, 'opacity', {min: 0, max: 1, step: 0.01});

            const buttonFolder = pane.addFolder({title: 'Color Methods', expanded: true});
            buttonFolder.addButton({title: 'setColorByRGB(0, 128, 255)'}).on('click', () => {
                material.color.setColorByRGB(0, 128, 255);
                refreshUI();
            });
            buttonFolder.addButton({title: 'setColorByHEX("#ff00ff")'}).on('click', () => {
                material.color.setColorByHEX('#ff00ff');
                refreshUI();
            });
            buttonFolder.addButton({title: 'setColorByRGBString("rgb(34, 139, 34)")'}).on('click', () => {
                material.color.setColorByRGBString('rgb(34, 139, 34)');
                refreshUI();
            });
        }
    });
};
