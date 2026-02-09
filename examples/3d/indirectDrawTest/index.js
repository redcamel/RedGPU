import * as RedGPU from "../../../dist/index.js?t=1770635178902";

/**
 * [KO] Indirect Draw 예제
 * [EN] Indirect Draw example
 *
 * [KO] GPU 기반의 Indirect Draw 기능을 사용하여 렌더링 성능을 최적화하는 방법을 보여줍니다.
 * [EN] Demonstrates how to optimize rendering performance using GPU-based Indirect Draw.
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

/**
 * [KO] 샘플 SpriteSheet3D를 생성합니다.
 * [EN] Creates a sample SpriteSheet3D.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleSpriteSheet3D = (redGPUContext, scene) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    spriteSheet.z = -5
    scene.addChild(spriteSheet);
}

/**
 * [KO] 샘플 Sprite3D를 생성합니다.
 * [EN] Creates a sample Sprite3D.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleSprite3D = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
    );

    const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3D.z = -3
    scene.addChild(sprite3D);
}

/**
 * [KO] 샘플 파티클을 생성합니다.
 * [EN] Creates a sample particle.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
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

/**
 * [KO] 샘플 텍스트를 생성합니다.
 * [EN] Creates sample text.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const createSampleText = (redGPUContext, scene) => {
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.y = 2
    textField3D.z = -2
    scene.addChild(textField3D);
}

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
    mesh.z = -20

    return mesh;
};

/**
 * [KO] 두 번째 샘플 메시를 생성합니다.
 * [EN] Creates a second sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh2 = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);
    mesh.z = -20
    mesh.x = -5

    return mesh;
};

/**
 * [KO] GLTF 모델들을 그리드 형태로 로드합니다.
 * [EN] Loads GLTF models in a grid layout.
 * @param {RedGPU.Display.View3D} view
 * @param {string[]} urls
 * @param {number} [gridSize=3]
 * @param {number} [spacing=3]
 */
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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770635178902');
    const {
        createIblHelper,
        setDebugButtons
    } = await import('../../exampleHelper/createExample/panes/index.js?t=1770635178902');
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();
    createIblHelper(pane, targetView, RedGPU);
};