import * as RedGPU from "../../../../dist/index.js?t=1769499639386";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 30;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const textures = createTextures(redGPUContext);

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

        createMeshesFromLines(redGPUContext, scene, lines, spacingX, spacingY, textures);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
    }
);
const renderTestPane = async (redGPUContext) => {
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769499639386");
    setDebugButtons(RedGPU, redGPUContext);
}
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

const createMeshesFromLines = (redGPUContext, scene, lines, spacingX, spacingY, textures) => {
    const totalLines = lines.length;

    lines.forEach((line, lineIndex) => {
        const base = line.base;
        const additionalTextures = line.additionalTextures;
        const totalMeshes = additionalTextures.length;

        const xPosition = lineIndex * spacingX - (totalLines - 1) * spacingX / 2;
        const yPosition = -((totalMeshes - 1) * spacingY / 2 + 4);

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

            const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32, 32);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

            mesh.setPosition(xPosition, meshYPosition, 0);
            scene.addChild(mesh);

            const label = new RedGPU.Display.TextField3D(redGPUContext);
            label.text = `${base.toLowerCase().includes('color') ? `<span style="color:${material[base].hex}">${material[base].hex}</span>` : base} + ${textureType}`;
            label.color = '#ffffff';
            label.fontSize = 26;
            label.setPosition(0, -2, 0);
            label.useBillboard = true;
            label.useBillboardPerspective = true;

            mesh.addChild(label);

        });
    });
};

const createMaterialWithTextures = (redGPUContext, base, additional, textures) => {
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);

    if (base.toLowerCase().includes('color')) {
        material[base].setColorByRGB(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        );
    }

    switch (base) {
        case 'diffuse':
            material.diffuseTexture = textures.diffuse;
            break;
        case 'alpha':
            material.alphaTexture = textures.alpha;
            break;
        case 'ao':
            material.aoTexture = textures.ao;
            break;
        case 'normal':
            material.normalTexture = textures.normal;
            break;
        case 'emissive':
            material.emissiveTexture = textures.emissive;
            break;
        case 'displacement':
            material.displacementTexture = textures.displacement;
            break;
        case 'specular':
            material.specularTexture = textures.specular;
            break;
    }

    switch (additional) {
        case 'diffuse':
            material.diffuseTexture = textures.diffuse;
            break;
        case 'alpha':
            material.alphaTexture = textures.alpha;
            break;
        case 'ao':
            material.aoTexture = textures.ao;
            break;
        case 'normal':
            material.normalTexture = textures.normal;
            break;
        case 'emissive':
            material.emissiveTexture = textures.emissive;
            break;
        case 'displacement':
            material.displacementTexture = textures.displacement;
            material.displacementScale = 2
            break;
        case 'specular':
            material.specularTexture = textures.specular;
            break;
    }

    return material;
};
