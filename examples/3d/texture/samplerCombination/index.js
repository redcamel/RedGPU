import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Sampler Combination 예제
 * [EN] Sampler Combination example
 *
 * [KO] 텍스처 샘플러의 다양한 필터 조합(minFilter, magFilter, mipmapFilter)을 비교 시연합니다.
 * [EN] Compares and demonstrates various filter combinations (minFilter, magFilter, mipmapFilter) of the texture sampler.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 22;
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        createCategoryGroups(redGPUContext, scene);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            scene.children.forEach((child) => {
                if (child.geometry instanceof RedGPU.Primitive.TorusKnot) {
                    child.rotationX += 0.05;
                    child.rotationY += 0.05;
                    child.rotationZ += 0.05;
                }
            });
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
        combinations: generateSamplerCombinations(settings, category, value)
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
        {name: 'minFilter', values: ['nearest', 'linear']},
        {name: 'magFilter', values: ['nearest', 'linear']},
        {name: 'mipmapFilter', values: ['nearest', 'linear']}
    ];

    const minFilterGroups = generateGroupedCombinations(settings, 'minFilter');
    const magFilterGroups = generateGroupedCombinations(settings, 'magFilter');
    const mipmapFilterGroups = generateGroupedCombinations(settings, 'mipmapFilter');
    const categories = [minFilterGroups, magFilterGroups, mipmapFilterGroups];

    const geometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 0.55, 0.3, 128, 64);
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

    const spacingX = 3.5;
    const spacingY = 3;
    const categorySpacingX = 15;
    const groupSpacingY = 7;

    const totalCategoriesWidth = 2 * categorySpacingX;
    let currentX = -totalCategoriesWidth / 2;

    categories.forEach((categoryGroups, categoryIndex) => {
        let currentY = 0;

        const categoryLabel = new RedGPU.Display.TextField3D(redGPUContext);
        categoryLabel.text = `Category: ${['minFilter', 'magFilter', 'mipmapFilter'][categoryIndex]}`;
        categoryLabel.color = '#dc631d';
        categoryLabel.worldSize = 1.5;
        categoryLabel.setPosition(currentX, currentY + 7, 0);
        categoryLabel.useBillboard = true;
        categoryLabel.useBillboardPerspective = true;
        scene.addChild(categoryLabel);

        categoryGroups.forEach((group) => {
            createGroupMeshes(
                redGPUContext,
                scene,
                geometry,
                texture,
                group,
                spacingX,
                spacingY,
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
 * @param {RedGPU.Primitive.TorusKnot} geometry
 * @param {RedGPU.Resource.BitmapTexture} texture
 * @param {object} group
 * @param {number} spacingX
 * @param {number} spacingY
 * @param {number} groupX
 * @param {number} groupY
 */
const createGroupMeshes = (redGPUContext, scene, geometry, texture, group, spacingX, spacingY, groupX, groupY) => {
    let maxYOffset = 0;
    let minYOffset = 0;

    group.combinations.forEach((sampler, samplerIndex) => {
        const x = groupX + (samplerIndex % 4) * spacingX - ((4 - 1) * spacingX) / 2;
        const y = groupY - Math.floor(samplerIndex / 4) * spacingY + 2.75;

        if (samplerIndex === 0) maxYOffset = y;
        minYOffset = y;

        // [KO] 샘플러의 minFilter, magFilter, mipmapFilter 조합 적용
        // [EN] Apply minFilter, magFilter, and mipmapFilter combination to the sampler
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.diffuseTextureSampler.minFilter = sampler.minFilter;
        material.diffuseTextureSampler.magFilter = sampler.magFilter;
        material.diffuseTextureSampler.mipmapFilter = sampler.mipmapFilter;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.setPosition(x, y, 0);
        scene.addChild(mesh);

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = `min: ${sampler.minFilter} <br/> mag: ${sampler.magFilter} <br/> mipmap: ${sampler.mipmapFilter}`;
        label.color = '#ffffff';
        label.useBillboard = true;
        label.worldSize = 2;
        label.setPosition(x, y - 2.2, 0);
        scene.addChild(label);
    });

    const groupHeight = maxYOffset - minYOffset;
    const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
    groupLabel.text = group.name;
    groupLabel.color = '#5fd7ff';
    groupLabel.worldSize = 2;
    groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2.5, 0);
    groupLabel.useBillboard = true;
    groupLabel.useBillboardPerspective = true;
    scene.addChild(groupLabel);
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext);
};
