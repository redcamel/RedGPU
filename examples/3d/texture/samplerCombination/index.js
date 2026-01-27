import * as RedGPU from "../../../../dist/index.js?t=1769498863678";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 22;
        controller.tilt = 0;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createCategoryGroups(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
            scene.children.forEach(group => {
                if (group.geometry instanceof RedGPU.Primitive.TorusKnot) {
                    group.rotationX += 0.05;
                    group.rotationY += 0.05;
                    group.rotationZ += 0.05;
                }
            });
        });
        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);
const renderTestPane = async (redGPUContext,) => {
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769498863678");
    setDebugButtons(RedGPU, redGPUContext);
}
const generateSamplerCombinations = (settings, fixedCategory, fixedValue) => {
    const combinations = [];
    const recursiveGenerator = (current, depth) => {
        if (depth === settings.length) {
            if (current[fixedCategory] === fixedValue) {
                combinations.push({...current});
            }
            return;
        }
        const {name, values} = settings[depth];
        values.forEach((value) => {
            recursiveGenerator({...current, [name]: value}, depth + 1);
        });
    };
    recursiveGenerator({}, 0);
    return combinations;
};

const generateGroupedCombinations = (settings, category) => {
    const targetSetting = settings.find((setting) => setting.name === category);
    return targetSetting.values.map((value) => ({
        name: `${category}: ${value}`,
        combinations: generateSamplerCombinations(settings, category, value),
    }));
};

const createCategoryGroups = (redGPUContext, scene) => {
    const settings = [
        {name: "minFilter", values: ["nearest", "linear"]},
        {name: "magFilter", values: ["nearest", "linear"]},
        {name: "mipmapFilter", values: ["nearest", "linear"]},
    ];

    const minFilterGroups = generateGroupedCombinations(settings, "minFilter");
    const magFilterGroups = generateGroupedCombinations(settings, "magFilter");
    const mipmapFilterGroups = generateGroupedCombinations(settings, "mipmapFilter");
    const categories = [minFilterGroups, magFilterGroups, mipmapFilterGroups];

    const spacingX = 3.5;
    const spacingY = 3;
    const categorySpacingX = 15;
    const groupSpacingY = 7;
    const subGroupSpacingY = 12;

    const totalCategoriesWidth = 2 * categorySpacingX;
    const startX = -totalCategoriesWidth / 2;
    let currentX = startX;

    categories.forEach((categoryGroups, categoryIndex) => {
        let currentY = 0;

        const categoryLabel = new RedGPU.Display.TextField3D(redGPUContext);
        categoryLabel.text = `Category: ${["minFilter", "magFilter", "mipmapFilter"][categoryIndex]}`;
        categoryLabel.color = "#dc631d";
        categoryLabel.fontSize = 64;
        categoryLabel.setPosition(currentX, currentY + 7, 0);
        categoryLabel.useBillboard = true;
        categoryLabel.useBillboardPerspective = true;

        scene.addChild(categoryLabel);

        categoryGroups.forEach((group) => {
            createGroupMeshes(
                redGPUContext,
                scene,
                group,
                spacingX,
                spacingY,
                subGroupSpacingY,
                currentX,
                currentY
            );
            currentY -= groupSpacingY;
        });

        currentX += categorySpacingX;
    });
};

const createGroupMeshes = (redGPUContext, scene, group, spacingX, spacingY, subGroupSpacingY, groupX, groupY) => {
    let maxYOffset = 0, minYOffset = 0;

    group.combinations.forEach((sampler, samplerIndex) => {
        const x = groupX + (samplerIndex % 4) * spacingX - ((4 - 1) * spacingX) / 2;
        const y = groupY - Math.floor(samplerIndex / 4) * spacingY + 2.75;

        if (samplerIndex === 0) maxYOffset = y;
        minYOffset = y;

        const material = createMaterialWithSampler(redGPUContext, sampler);
        const geometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 0.55, 0.3, 128, 64);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, y, 0);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `min: ${sampler.minFilter} <br/> mag: ${sampler.magFilter} <br/> mipmap: ${sampler.mipmapFilter}`;
        label.color = "#ffffff";
        label.useBillboard = true;
        label.fontSize = 21;
        label.setPosition(x, y - 2.2, 0);
        scene.addChild(label);
    });

    const groupHeight = maxYOffset - minYOffset;
    const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
    groupLabel.text = group.name;
    groupLabel.color = "#5fd7ff";
    groupLabel.fontSize = 42;
    groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2.5, 0);
    groupLabel.useBillboard = true;
    groupLabel.useBillboardPerspective = true;
    scene.addChild(groupLabel);

    groupY -= subGroupSpacingY;
};

const createMaterialWithSampler = (redGPUContext, sampler) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
    material.diffuseTexture = texture;

    material.diffuseTextureSampler.minFilter = sampler.minFilter;
    material.diffuseTextureSampler.magFilter = sampler.magFilter;
    material.diffuseTextureSampler.mipmapFilter = sampler.mipmapFilter;

    return material;
};
