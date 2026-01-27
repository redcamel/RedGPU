import * as RedGPU from "../../../../dist/index.js?t=1769500077563";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
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
                if (group.geometry instanceof RedGPU.Primitive.Box) {
                    group.rotationY += 0.1;
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
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1769500077563");
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
        {name: "addressModeU", values: ["clamp-to-edge", "repeat", "mirror-repeat"]},
        {name: "addressModeV", values: ["clamp-to-edge", "repeat", "mirror-repeat"]},
    ];

    const addressModeUGroups = generateGroupedCombinations(settings, "addressModeU");
    const addressModeVGroups = generateGroupedCombinations(settings, "addressModeV");
    const categories = [addressModeUGroups, addressModeVGroups];

    const spacingX = 3.8;
    const spacingY = 2;
    const categorySpacingY = 6;
    const groupSpacingX = 12;

    const totalGroupsPerCategory = addressModeUGroups.length;
    const totalCategoryWidth = (totalGroupsPerCategory - 1) * groupSpacingX;
    const centerOffsetX = -totalCategoryWidth / 2;

    let currentY = 5;

    categories.forEach((categoryGroups, categoryIndex) => {
        let currentX = centerOffsetX;

        const categoryLabel = new RedGPU.Display.TextField3D(redGPUContext);
        categoryLabel.text = `Category: ${["addressModeU", "addressModeV"][categoryIndex]}`;
        categoryLabel.color = "#dc631d";
        categoryLabel.fontSize = 52;
        categoryLabel.setPosition(currentX + totalCategoryWidth / 2, currentY + 2, 0);
        categoryLabel.useBillboard = true;
        categoryLabel.useBillboardPerspective = true;
        scene.addChild(categoryLabel);

        currentY -= 1.5;

        categoryGroups.forEach((group, groupIndex) => {
            createGroupMeshes(
                redGPUContext,
                scene,
                group,
                spacingX,
                spacingY,
                currentX,
                currentY,
            );
            currentX += groupSpacingX;
        });

        currentY -= categorySpacingY;
    });
};

const createGroupMeshes = (redGPUContext, scene, group, spacingX, spacingY, groupX, groupY) => {
    let maxYOffset = 0, minYOffset = 0;

    group.combinations.forEach((sampler, samplerIndex) => {
        const x = groupX + (samplerIndex % 3) * spacingX - spacingX;
        const y = groupY - Math.floor(samplerIndex / 3) * spacingY;

        if (samplerIndex === 0) maxYOffset = y;
        minYOffset = y;

        const material = createMaterialWithSampler(redGPUContext, sampler);
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2, 1, 1, 1, 2);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, y, 0);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `ModeU: ${sampler.addressModeU}<br/>ModeV: ${sampler.addressModeV}`;
        label.color = "#ffffff";
        label.fontSize = 18;
        label.useBillboard = true;
        label.useBillboardPerspective = true;
        label.setPosition(x, y - 2, 0);
        scene.addChild(label);
    });

    const groupHeight = maxYOffset - minYOffset;
    const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
    groupLabel.text = group.name;
    groupLabel.color = "#5fd7ff";
    groupLabel.fontSize = 36;
    groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2, 0);
    groupLabel.useBillboard = true;
    groupLabel.useBillboardPerspective = true;
    scene.addChild(groupLabel);
};

const createMaterialWithSampler = (redGPUContext, sampler) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/texture/crate.png");
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
    material.diffuseTexture = texture;

    material.diffuseTextureSampler.addressModeU = sampler.addressModeU;
    material.diffuseTextureSampler.addressModeV = sampler.addressModeV;

    return material;
};
