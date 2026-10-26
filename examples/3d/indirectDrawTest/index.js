import * as RedGPU from "../../../dist/index.js?t=1792993380695";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1792993380695";

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
        controller.distance = 8;
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

        // [KO] Indirect Draw 검증을 위한 다양한 3D 객체 및 GLTF 모델 배치
        // [EN] Place various 3D objects and GLTF models for Indirect Draw verification
        const glbUrls = [
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',
            'https://redcamel.github.io/RedGL2/asset/glTF/breakDance/scene.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
        ];

        loadGLTFGrid(view, glbUrls);
        createSampleObjects(redGPUContext, scene);
        const testParticleWrap = createSampleParticle(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            testParticleWrap.x += Math.sin(time / 500) * 0.5;
            testParticleWrap.y += Math.cos(time / 500) * 0.5;
            testParticleWrap.z += Math.sin(time / 500) * 0.5;
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
    box.z = -20;
    scene.addChild(box);

    const sphere = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    sphere.x = -5;
    sphere.z = -20;
    scene.addChild(sphere);

    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.y = 2;
    textField3D.z = -2;
    scene.addChild(textField3D);

    const sprite3D = new RedGPU.Display.Sprite3D(
        redGPUContext,
        new RedGPU.Material.BitmapMaterial(
            redGPUContext,
            new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
        )
    );
    sprite3D.z = -3;
    scene.addChild(sprite3D);

    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(
        redGPUContext,
        '../../assets/spriteSheet/spriteSheet.png',
        5, 3, 15, 0, true, 24
    );
    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    spriteSheet.z = -5;
    scene.addChild(spriteSheet);
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

const loadGLTFGrid = (view, urls, gridSize = 3, spacing = 3) => {
    const {redGPUContext, scene} = view;
    const totalCols = Math.min(gridSize, urls.length);
    const totalRows = Math.ceil(urls.length / gridSize);
    const totalWidth = (totalCols - 1) * spacing;
    const totalDepth = (totalRows - 1) * spacing;

    urls.forEach((url, index) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh;
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;

            if (url.includes('breakDance')) mesh.setScale(0.001);
            mesh.setPosition(
                col * spacing - totalWidth / 2,
                -0.5,
                row * spacing - totalDepth / 2
            );
            scene.addChild(mesh);
        });
    });
};

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
