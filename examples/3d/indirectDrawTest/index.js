import * as RedGPU from "../../../dist/index.js?t=1794646734270";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794646734270";

/**
 * [KO] Indirect Draw 테스트 예제
 * [EN] Indirect Draw test example
 *
 * [KO] GPU 기반의 Indirect Draw 파이프라인에서 다양한 객체들(Mesh, GLTF, Sprite3D, SpriteSheet3D, TextField3D, ParticleEmitter)이 정상적으로 렌더링되는지 검증합니다.
 * [EN] Verifies that various objects (Mesh, GLTF, Sprite3D, SpriteSheet3D, TextField3D, ParticleEmitter) render properly in the GPU-based Indirect Draw pipeline.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 14;
        controller.tilt = -20;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        // [KO] Indirect Draw 검증을 위한 다양한 3D 객체 및 GLTF 모델을 겹침 없이 배치
        // [EN] Place various 3D objects and GLTF models without overlap for Indirect Draw verification
        const gltfItems = [
            {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
                position: [-5.5, 0.5, 2.5],
            },
            {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Draco/CesiumMan.gltf',
                position: [-2.5, 0, 2.5],
            },
            {
                url: 'https://redcamel.github.io/RedGL2/asset/glTF/breakDance/scene.gltf',
                position: [0.5, 0, 2.5],
                scale: 0.001,
            },
            {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Draco/CesiumMilkTruck.gltf',
                position: [4.8, 0, 2.5],
            },
        ];

        loadGLTFItems(view, gltfItems);
        createSampleObjects(redGPUContext, scene);
        const testParticleWrap = createSampleParticle(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            testParticleWrap.setPosition(
                Math.sin(time / 700) * 5,
                4.2 + Math.cos(time / 500) * 0.6,
                Math.cos(time / 700) * 1.5
            );
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const createSampleObjects = (redGPUContext, scene) => {
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    box.setPosition(-6, 1, -2.8);
    scene.addChild(box);

    const sphere = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    sphere.setPosition(-3, 1, -2.8);
    scene.addChild(sphere);

    const sprite3D = new RedGPU.Display.Sprite3D(
        redGPUContext,
        new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
        )
    );
    sprite3D.setPosition(0, 1, -2.8);
    scene.addChild(sprite3D);

    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        '../../assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );
    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    spriteSheet.setPosition(3, 1, -2.8);
    scene.addChild(spriteSheet);

    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.setPosition(6, 1.5, -2.8);
    scene.addChild(textField3D);
};

const createSampleParticle = (redGPUContext, scene) => {
    const testParticleWrap = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(testParticleWrap);

    const testParticle = new RedGPU.Display.ParticleEmitter(redGPUContext);
    testParticle.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        '../../assets/particle/particle2.png'
    );
    testParticle.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
    testParticleWrap.addChild(testParticle);

    return testParticleWrap;
};

const loadGLTFItems = (view, items) => {
    const {redGPUContext, scene} = view;
    items.forEach(({url, position, scale}) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh;
            if (scale !== undefined) mesh.setScale(scale);
            mesh.setPosition(position[0], position[1], position[2]);
            scene.addChild(mesh);
        });
    });
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
