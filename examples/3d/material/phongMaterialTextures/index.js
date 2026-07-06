import * as RedGPU from "../../../../dist/index.js?t=1783323470979";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323470979";

/**
 * [KO] Phong Material Textures 예제
 * [EN] Phong Material Textures example
 *
 * [KO] PhongMaterial에서 지원하는 다양한 텍스처(AO, Alpha, Emissive, Normal 등)의 조합과 그 효과를 시각화합니다.
 * [EN] Visualizes the combinations and effects of various textures (AO, Alpha, Emissive, Normal, etc.) supported by PhongMaterial.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] 조명 설정
        // [EN] Setup Lighting
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. [KO] 텍스처 리소스 생성
        // [EN] Create Texture Resources
        const textures = createTextures(redGPUContext);

        // [KO] 테스트용 라인 정의
        // [EN] Define Lines for Testing
        const lines = [
            {base: 'color', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'emissiveColor', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'specularColor', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'alpha', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'ao', additionalTextures: ['alpha', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'diffuse', additionalTextures: ['alpha', 'ao', 'displacement', 'emissive', 'normal', 'specular']},
            {base: 'displacement', additionalTextures: ['alpha', 'ao', 'diffuse', 'emissive', 'normal', 'specular']},
            {base: 'emissive', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'normal', 'specular']},
            {base: 'normal', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'emissive', 'specular']},
            {base: 'specular', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'emissive', 'normal']},
        ];

        const spacingX = 6;
        const spacingY = 4.5;

        // 5. [KO] 정의된 조합에 따라 메시 군집 생성
        // [EN] Create Mesh Swarm based on defined combinations
        createMeshesFromLines(redGPUContext, scene, lines, spacingX, spacingY, textures);

        // 6. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 7. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);

/**
 * [KO] 테스트용 GUI를 구성합니다.
 * [EN] Configures GUI for testing.
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
}

/**
 * [KO] 비트맵 텍스처 리소스들을 생성합니다.
 * [EN] Creates bitmap texture resources.
 */
const createTextures = (redGPUContext) => {
    return {
        diffuse: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_diffuseMap.jpg'),
        alpha: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_alphaMap.png'),
        ao: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_aoMap.jpg'),
        normal: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_normalMap.jpg'),
        emissive: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_emissiveMap.jpg'),
        displacement: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_displacementMap.jpg'),
        specular: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_specularMap.jpg'),
    };
};

/**
 * [KO] 텍스처 조합 매트릭스에 따라 메시와 라벨을 생성합니다.
 * [EN] Creates meshes and labels according to the texture combination matrix.
 */
const createMeshesFromLines = (redGPUContext, scene, lines, spacingX, spacingY, textures) => {
    const totalLines = lines.length;
    
    // [KO] 성능을 위해 지오메트리 공유
    // [EN] Share geometry for performance
    const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);

    lines.forEach((line, lineIndex) => {
        const base = line.base;
        const additionalTextures = line.additionalTextures;
        const totalMeshes = additionalTextures.length;

        const xPosition = lineIndex * spacingX - (totalLines - 1) * spacingX / 2;
        const yPosition = -((totalMeshes - 1) * spacingY / 2 + 4);

        // [KO] 라인 제목 라벨
        // [EN] Line Title Label
        const lineLabel = new RedGPU.Display.TextField3D(redGPUContext);
        lineLabel.text = `Base : ${base}`;
        lineLabel.color = '#df5f00';
        lineLabel.fontSize = 32;
        lineLabel.setPosition(xPosition, yPosition, 0);
        lineLabel.useBillboard = true;
        scene.addChild(lineLabel);

        additionalTextures.forEach((textureType, meshIndex) => {
            const material = createMaterialWithTextures(redGPUContext, base, textureType, textures);
            material.shininess = 16;

            const meshYPosition = -(meshIndex * spacingY - (totalMeshes - 1) * spacingY / 2);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            mesh.setPosition(xPosition, meshYPosition, 0);
            scene.addChild(mesh);

            // [KO] 개별 조합 라벨
            // [EN] Individual Combination Label
            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = `${base.toLowerCase().includes('color') ? `<span style="color:${material[base].hex}">${material[base].hex}</span>` : base} + ${textureType}`;
            label.color = '#ffffff';
            label.worldSize = 0.9
            label.setPosition(0, -2, 0);
            label.useBillboard = true;
            label.useBillboardPerspective = true;

            mesh.addChild(label);
        });
    });
};

/**
 * [KO] 특정 텍스처 조합이 적용된 PhongMaterial을 생성합니다.
 * [EN] Creates a PhongMaterial with specific texture combinations applied.
 */
const createMaterialWithTextures = (redGPUContext, base, additional, textures) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);

    // [KO] 베이스가 색상인 경우 무작위 색상 지정
    // [EN] Set random color if base is a color property
    if (base.toLowerCase().includes('color')) {
        material[base].setColorByRGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        );
    }

    const apply = (type) => {
        switch (type) {
            case 'diffuse': material.diffuseTexture = textures.diffuse; break;
            case 'alpha': material.alphaTexture = textures.alpha; break;
            case 'ao': material.aoTexture = textures.ao; break;
            case 'normal': material.normalTexture = textures.normal; break;
            case 'emissive': material.emissiveTexture = textures.emissive; break;
            case 'displacement': 
                material.displacementTexture = textures.displacement; 
                material.displacementScale = 2;
                break;
            case 'specular': material.specularTexture = textures.specular; break;
        }
    }

    apply(base);
    apply(additional);

    return material;
};
