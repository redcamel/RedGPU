import * as RedGPU from "../../../../../dist/index.js?t=1770697269592";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    async (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] BRDF LUT 전용 텍스처 생성
        // [EN] Create a texture dedicated to BRDF LUT
        const texture = new RedGPU.Resource.CoreIBL.BRDFLUTTexture(redGPUContext);

        // [KO] 획득한 GPUTexture를 화면에 표시하기 위해 Mesh 생성
        // [EN] Create Mesh to display the acquired GPUTexture on the screen
        const mesh = new RedGPU.Display.Mesh(
            redGPUContext,
            new RedGPU.Primitive.Plane(redGPUContext),
            new RedGPU.Material.BitmapMaterial(redGPUContext)
        );
        mesh.scaleX = 5;
        mesh.scaleY = 5;

        mesh.material.diffuseTexture = texture;
        scene.addChild(mesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (failReason) => {
        console.error(failReason);
    }
);
