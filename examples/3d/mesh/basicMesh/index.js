import * as RedGPU from "../../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Basic Mesh 예제
 * [EN] Basic Mesh example
 *
 * [KO] 지오메트리와 재질로 Mesh를 생성하고 위치·크기·회전 및 재질 교체를 실시간으로 제어합니다.
 * [EN] Creates a Mesh from geometry and material, and controls its position, scale, rotation, and material in real-time.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 지오메트리 + 재질 조합으로 Mesh 생성 후 씬에 추가
        // [EN] Create a Mesh from geometry + material and add it to the scene
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
        const material = new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
        );
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        scene.addChild(mesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
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

const renderTestPane = (redGPUContext, mesh) => {
    // [KO] 재질은 런타임에 교체 가능 (미리 생성한 인스턴스를 재사용)
    // [EN] Materials can be swapped at runtime (reuse pre-created instances)
    const materials = {
        Bitmap: mesh.material,
        Color: new RedGPU.Material.ColorMaterial(redGPUContext),
    };
    const config = {material: 'Bitmap'};

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            pane.addBinding(config, 'material', {
                options: {Bitmap: 'Bitmap', Color: 'Color'}
            }).on('change', (evt) => {
                mesh.material = materials[evt.value];
            });

            const positionFolder = pane.addFolder({title: 'Position', expanded: true});
            positionFolder.addBinding(mesh, 'x', {min: -10, max: 10, step: 0.1});
            positionFolder.addBinding(mesh, 'y', {min: -10, max: 10, step: 0.1});
            positionFolder.addBinding(mesh, 'z', {min: -10, max: 10, step: 0.1});

            const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
            scaleFolder.addBinding(mesh, 'scaleX', {min: 0.1, max: 5, step: 0.1});
            scaleFolder.addBinding(mesh, 'scaleY', {min: 0.1, max: 5, step: 0.1});
            scaleFolder.addBinding(mesh, 'scaleZ', {min: 0.1, max: 5, step: 0.1});

            const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
            rotationFolder.addBinding(mesh, 'rotationX', {min: 0, max: 360, step: 0.01});
            rotationFolder.addBinding(mesh, 'rotationY', {min: 0, max: 360, step: 0.01});
            rotationFolder.addBinding(mesh, 'rotationZ', {min: 0, max: 360, step: 0.01});
        }
    });
};
