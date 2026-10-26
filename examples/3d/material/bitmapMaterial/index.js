import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] BitmapMaterial 예제
 * [EN] BitmapMaterial Example
 *
 * [KO] BitmapMaterial의 기본 생성과 런타임 diffuseTexture 교체 및 투명도(opacity) 제어를 시연합니다.
 * [EN] Demonstrates basic creation of BitmapMaterial, runtime diffuseTexture replacement, and opacity control.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] BitmapTexture와 BitmapMaterial을 생성하여 양면 렌더링 박스에 적용
        // [EN] Create BitmapTexture and BitmapMaterial and apply them to a double-sided Box mesh
        const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
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
            pane.addBinding(material, 'opacity', {min: 0, max: 1, step: 0.01});

            const textures = [
                {name: 'set diffuseTexture : png', path: '../../../assets/imageFormat/webgpu.png'},
                {name: 'set diffuseTexture : jpg', path: '../../../assets/imageFormat/webgpu.jpg'},
                {name: 'set diffuseTexture : webp', path: '../../../assets/imageFormat/webgpu.webp'},
                {name: 'set diffuseTexture : svg', path: '../../../assets/imageFormat/webgpu.svg'},
            ];

            const folder = pane.addFolder({title: 'Textures', expanded: true});
            textures.forEach(({name, path}) => {
                folder.addButton({title: name}).on('click', () => {
                    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, path);
                });
            });
        }
    });
};
