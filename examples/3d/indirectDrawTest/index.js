import * as RedGPU from "../../../dist/index.js?t=1783324689986";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1783324689986";

/**
 * [KO] Indirect Draw 테스트 예제
 * [EN] Indirect Draw test example
 *
 * [KO] GPU 기반의 Indirect Draw 기능을 사용하여 다양한 객체들(Mesh, GLTF, Sprite, Particle 등)이 정상적으로 렌더링되는지 테스트합니다.
 * [EN] Tests whether various objects (Mesh, GLTF, Sprite, Particle, etc.) are rendered correctly using GPU-based Indirect Draw.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 8;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;
        redGPUContext.addView(view);

        // 2. 조명 설정
        const light = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(light);

        // 3. 다양한 샘플 객체 생성 및 로드
        const glbUrls = [
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
        ];

        loadGLTFGrid(view, glbUrls);
        createSampleMesh(redGPUContext, scene);
        createSampleMesh2(redGPUContext, scene);
        createSampleText(redGPUContext, scene);
        createSampleSprite3D(redGPUContext, scene);
        createSampleSpriteSheet3D(redGPUContext, scene);
        const testParticleWrap = createSampleParticle(redGPUContext, scene);

        // 4. 애니메이션 렌더 루프 및 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 파티클 래퍼 애니메이션
            testParticleWrap.x += Math.sin(time / 500) * 0.5;
            testParticleWrap.y += Math.cos(time / 500) * 0.5;
            testParticleWrap.z += Math.sin(time / 500) * 0.5;
        });

        // 5. 테스트 GUI 설정
        renderTestPane(redGPUContext);
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
 */
const createSampleSpriteSheet3D = (redGPUContext, scene) => {
    const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24);
    const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, spriteSheetInfo);
    spriteSheet.z = -5;
    scene.addChild(spriteSheet);
};

/**
 * [KO] 샘플 Sprite3D를 생성합니다.
 * [EN] Creates a sample Sprite3D.
 */
const createSampleSprite3D = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
    );

    const sprite3D = new RedGPU.Display.Sprite3D(redGPUContext, material);
    sprite3D.z = -3;
    scene.addChild(sprite3D);
};

/**
 * [KO] 샘플 파티클을 생성합니다.
 * [EN] Creates a sample particle.
 */
const createSampleParticle = (redGPUContext, scene) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/particle/particle2.png');
    const testParticleWrap = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
    );
    scene.addChild(testParticleWrap);

    const testParticle = new RedGPU.Display.ParticleEmitter(redGPUContext);
    testParticleWrap.addChild(testParticle);
    testParticle.material.diffuseTexture = texture;
    testParticle.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE;

    return testParticleWrap;
};

/**
 * [KO] 샘플 텍스트를 생성합니다.
 * [EN] Creates sample text.
 */
const createSampleText = (redGPUContext, scene) => {
    const textField3D = new RedGPU.Display.TextField3D(redGPUContext);
    textField3D.text = textField3D.name.split(' ').join('<br/>');
    textField3D.color = 'red';
    textField3D.y = 2;
    textField3D.z = -2;
    scene.addChild(textField3D);
};

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 */
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.z = -20;
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 두 번째 샘플 메시를 생성합니다.
 * [EN] Creates a second sample mesh.
 */
const createSampleMesh2 = (redGPUContext, scene) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.x = -5;
    mesh.z = -20;
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] GLTF 모델들을 그리드 형태로 로드합니다.
 * [EN] Loads GLTF models in a grid layout.
 */
const loadGLTFGrid = (view, urls, gridSize = 3, spacing = 3) => {
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
        });
    });
};

/**
 * [KO] 예제 도우미 패널을 렌더링합니다.
 * [EN] Renders the example helper panel.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true
    });
};
