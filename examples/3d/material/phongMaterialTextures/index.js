import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] PhongMaterial Textures 예제
 * [EN] PhongMaterial Textures Example
 *
 * [KO] PhongMaterial에서 지원하는 베이스 속성(Color, AO, Alpha, Diffuse, Displacement, Emissive, Normal, Specular)과 추가 텍스처의 조합 매트릭스를 시각화합니다.
 * [EN] Visualizes the combination matrix of base properties (Color, AO, Alpha, Diffuse, Displacement, Emissive, Normal, Specular) and additional textures in PhongMaterial.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const createTextures = (redGPUContext) => ({
    diffuse: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_diffuseMap.jpg'),
    alpha: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_alphaMap.png'),
    ao: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_aoMap.jpg'),
    normal: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_normalMap.jpg'),
    emissive: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_emissiveMap.jpg'),
    displacement: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_displacementMap.jpg'),
    specular: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_specularMap.jpg'),
});

const createMaterialWithTextures = (redGPUContext, base, additional, textures) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.shininess = 16;

    if (base.toLowerCase().includes('color')) {
        material[base].setColorByRGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
    }

    const applyTexture = (type) => {
        if (!textures[type]) return;
        material[`${type}Texture`] = textures[type];
        if (type === 'displacement') {
            material.displacementScale = 2;
        }
    };

    applyTexture(base);
    applyTexture(additional);

    return material;
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 베이스 속성 및 텍스처 조합 매트릭스에 따른 스피어 메시 군집 생성
        // [EN] Create a sphere mesh grid based on the base property and texture combination matrix
        const textures = createTextures(redGPUContext);
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
        const lines = [
            {base: 'color', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
            {
                base: 'emissiveColor',
                additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']
            },
            {
                base: 'specularColor',
                additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']
            },
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
        const totalLines = lines.length;

        lines.forEach(({base, additionalTextures}, lineIndex) => {
            const totalMeshes = additionalTextures.length;
            const xPosition = lineIndex * spacingX - ((totalLines - 1) * spacingX) / 2;
            const yPosition = -(((totalMeshes - 1) * spacingY) / 2 + 4);

            const lineLabel = new RedGPU.Display.TextField3D(redGPUContext);
            lineLabel.text = `Base : ${base}`;
            lineLabel.color = '#df5f00';
            lineLabel.fontSize = 32;
            lineLabel.setPosition(xPosition, yPosition, 0);
            lineLabel.useBillboard = true;
            scene.addChild(lineLabel);

            additionalTextures.forEach((textureType, meshIndex) => {
                const material = createMaterialWithTextures(redGPUContext, base, textureType, textures);
                const meshYPosition = -(meshIndex * spacingY - ((totalMeshes - 1) * spacingY) / 2);
                const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
                mesh.setPosition(xPosition, meshYPosition, 0);
                scene.addChild(mesh);

                const label = new RedGPU.Display.TextField3D(redGPUContext);
                const baseText = base.toLowerCase().includes('color')
                    ? `<span style="color:${material[base].hex}">${material[base].hex}</span>`
                    : base;
                label.text = `${baseText} + ${textureType}`;
                label.color = '#ffffff';
                label.worldSize = 0.9;
                label.setPosition(0, -2, 0);
                label.useBillboard = true;
                label.useBillboardPerspective = true;
                mesh.addChild(label);
            });
        });

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
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

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
