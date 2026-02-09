import * as RedGPU from "../../../../dist/index.js?t=1770634235177";

/**
 * [KO] Sampler Combination 예제
 * [EN] Sampler Combination example
 *
 * [KO] 텍스처 샘플러의 다양한 필터 조합(Min, Mag, Mipmap)을 테스트하고 비교합니다.
 * [EN] Tests and compares various filter combinations (Min, Mag, Mipmap) of the texture sampler.
 */

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

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext,) => {
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770634235177");
    setDebugButtons(RedGPU, redGPUContext);
}

/**
 * [KO] 샘플러 조합을 생성합니다.
 * [EN] Generates sampler combinations.
 * @param {Array<object>} settings
 * @param {string} fixedCategory
 * @param {string} fixedValue
 * @returns {Array<object>}
 */
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

/**
 * [KO] 그룹화된 조합을 생성합니다.
 * [EN] Generates grouped combinations.
 * @param {Array<object>} settings
 * @param {string} category
 * @returns {Array<{name: string, combinations: Array<object>}>}
 */
const generateGroupedCombinations = (settings, category) => {
    const targetSetting = settings.find((setting) => setting.name === category);
    return targetSetting.values.map((value) => ({
        name: `${category}: ${value}`,
        combinations: generateSamplerCombinations(settings, category, value),
    }));
};

/**
 * [KO] 카테고리 그룹들을 생성합니다.
 * [EN] Creates category groups.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
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
        categoryLabel.worldSize = 1.5
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

/**
 * [KO] 그룹 메시들을 생성합니다.
 * [EN] Creates group meshes.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {object} group
 * @param {number} spacingX
 * @param {number} spacingY
 * @param {number} subGroupSpacingY
 * @param {number} groupX
 * @param {number} groupY
 */
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
        label.worldSize = 2
        label.setPosition(x, y - 2.2, 0);
        scene.addChild(label);
    });

    const groupHeight = maxYOffset - minYOffset;
    const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
    groupLabel.text = group.name;
    groupLabel.color = "#5fd7ff";
    groupLabel.worldSize = 2
    groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2.5, 0);
    groupLabel.useBillboard = true;
    groupLabel.useBillboardPerspective = true;
    scene.addChild(groupLabel);

    groupY -= subGroupSpacingY;
};

/**
 * [KO] 샘플러 설정이 적용된 머티리얼을 생성합니다.
 * [EN] Creates a material with sampler settings applied.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {object} sampler
 * @returns {RedGPU.Material.BitmapMaterial}
 */
const createMaterialWithSampler = (redGPUContext, sampler) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
    material.diffuseTexture = texture;

    material.diffuseTextureSampler.minFilter = sampler.minFilter;
    material.diffuseTextureSampler.magFilter = sampler.magFilter;
    material.diffuseTextureSampler.mipmapFilter = sampler.mipmapFilter;

    return material;
};