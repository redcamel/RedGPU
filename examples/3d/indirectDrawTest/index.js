import * as RedGPU from "../../../dist/index.js?t=1769586122100";

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
        view.grid = true
        view.axis = true
        redGPUContext.addView(view);
        const light = new RedGPU.Light.DirectionalLight()
        scene.lightManager.addDirectionalLight(light)
        const glbUrls = [
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',

        ];
        loadGLTFGrid(view, glbUrls);
        createSampleMesh(redGPUContext, scene);
        createSampleMesh2(redGPUContext, scene);
        createSampleText(redGPUContext, scene)
        createSampleSprite3D(redGPUContext, scene)
        createSampleSpriteSheet3D(redGPUContext, scene)
        const testParticleWrap = createSampleParticle(redGPUContext, scene)

        ///
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            testParticleWrap.x += Math.sin(time / 500) * 0.5
            testParticleWrap.y += Math.cos(time / 500) * 0.5
            testParticleWrap.z += Math.sin(time / 500) * 0.5

        });
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);
const createSampleSpriteSheet3D = (redGPUContext, scene) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    spriteSheet.z = -5
    scene.addChild(spriteSheet);
}
const createSampleSprite3D = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
    );

    const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3D.z = -3
    scene.addChild(sprite3D);
}
const createSampleParticle = (redGPUContext, scene) => {
    const texture_particle2 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/particle/particle2.png');
    const testParticleWrap = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    )
    scene.addChild(testParticleWrap)
    const testParticle = new RedGPU.Display.ParticleEmitter(redGPUContext)
    testParticleWrap.addChild(testParticle)
    testParticle.material.diffuseTexture = texture_particle2
    testParticle.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE
    return testParticleWrap
}
const createSampleText = (redGPUContext, scene) => {
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.y = 2
    textField3D.z = -2
    scene.addChild(textField3D);
}
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    mesh.z = -20

    return mesh;
};
const createSampleMesh2 = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    mesh.z = -20
    mesh.x = -5

    return mesh;
};

function loadGLTFGrid(view, urls, gridSize = 3, spacing = 3) {
    const {redGPUContext, scene} = view;

    const totalCols = Math.min(gridSize, urls.length);
    const totalRows = Math.ceil(urls.length / gridSize);
    const totalWidth = (totalCols - 1) * spacing;
    const totalDepth = (totalRows - 1) * spacing;

    urls.forEach((url, index) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh;
            scene.addChild(mesh);

            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = col * spacing - totalWidth / 2;
            const z = row * spacing - totalDepth / 2;

            mesh.x = x;
            mesh.y = -0.5;
            mesh.z = z;

            // if(url.includes('CesiumMilkTruck')){
            // 	mesh.z = -100
            // }
        });
    });
}

const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769586122100');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../exampleHelper/createExample/panes/index.js?t=1769586122100');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};
