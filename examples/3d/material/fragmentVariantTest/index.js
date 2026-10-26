import * as RedGPU from "../../../../dist/index.js?t=1792986001111";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986001111";

/**
 * [KO] Fragment Variant Test 예제
 * [EN] Fragment Variant Test Example
 *
 * [KO] PhongMaterial에 바인딩된 텍스처 조합에 따라 프래그먼트 셰이더 베리언트가 동적으로 생성 및 캐싱되는 과정을 시연합니다.
 * [EN] Demonstrates how fragment shader variants are dynamically generated and cached based on active texture combinations in PhongMaterial.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const texturePaths = {
    diffuse: '../../../assets/phongMaterial/test_diffuseMap.jpg',
    alpha: '../../../assets/phongMaterial/test_alphaMap.png',
    ao: '../../../assets/phongMaterial/test_aoMap.jpg',
    normal: '../../../assets/phongMaterial/test_normalMap.jpg',
    emissive: '../../../assets/phongMaterial/test_emissiveMap.jpg',
    specular: '../../../assets/phongMaterial/test_specularMap.jpg',
};

const createVariantDisplay = () => {
    const container = document.createElement('div');
    container.className = 'variant-display';

    const titleEl = document.createElement('h3');
    titleEl.textContent = 'Variant Key';

    const keyEl = document.createElement('div');
    keyEl.className = 'variant-key';

    const featuresEl = document.createElement('div');
    featuresEl.className = 'variant-features';

    container.appendChild(titleEl);
    container.appendChild(keyEl);
    container.appendChild(featuresEl);
    document.body.appendChild(container);

    return {
        container,
        update(variant) {
            const features = variant === 'none' ? [] : variant.split('+');
            keyEl.textContent = variant === 'none' ? 'basic (none)' : variant;
            featuresEl.textContent = `active features: ${features.length}`;
        }
    };
};

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;

        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#2a2a2a');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 텍스처 조합별 셰이더 베리언트 확인을 위한 PhongMaterial 스피어 생성
        // [EN] Create a PhongMaterial sphere to inspect shader variants per texture combination
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
        scene.addChild(mesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, material);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, material) => {
    const textures = Object.fromEntries(
        Object.entries(texturePaths).map(([key, path]) => [
            key,
            new RedGPU.Resource.BitmapTexture(redGPUContext, path),
        ])
    );

    const variantDisplay = createVariantDisplay();
    const shaderVariantGenerator = material.gpuRenderInfo?.fragmentShaderSourceVariant || null;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                cachedVariants: 0,
                currentVariant: 'none',
                showVariantOverlay: true,
                useDiffuse: Boolean(material.diffuseTexture),
                useAlpha: Boolean(material.alphaTexture),
                useAo: Boolean(material.aoTexture),
                useSpecular: Boolean(material.specularTexture),
                useNormal: Boolean(material.normalTexture),
                useEmissive: Boolean(material.emissiveTexture),
            };

            const textureKeys = ['useDiffuse', 'useAlpha', 'useAo', 'useSpecular', 'useNormal', 'useEmissive'];

            const getCurrentVariant = () => {
                const shaderModuleLabel = material.gpuRenderInfo?.fragmentShaderModule?.label;
                if (shaderModuleLabel) {
                    const labelParts = shaderModuleLabel.split('_');
                    return labelParts[labelParts.length - 1] || 'none';
                }
                return 'none';
            };

            const updateVariantInfo = () => {
                const currentVariant = getCurrentVariant();
                params.currentVariant = currentVariant;
                if (shaderVariantGenerator) {
                    params.cachedVariants = shaderVariantGenerator.getCachedVariants().length;
                }
                variantDisplay.update(currentVariant);
                pane.refresh();
            };

            const variantFolder = pane.addFolder({title: 'Variant Information', expanded: true});
            variantFolder.addBinding(params, 'cachedVariants', {readonly: true});
            variantFolder.addBinding(params, 'currentVariant', {readonly: true});
            variantFolder.addBinding(params, 'showVariantOverlay').on('change', (ev) => {
                variantDisplay.container.style.display = ev.value ? 'flex' : 'none';
            });

            const textureFolder = pane.addFolder({title: 'Texture Variants', expanded: true});
            textureKeys.forEach((key) => {
                textureFolder.addBinding(params, key).on('change', (ev) => {
                    const textureType = key.replace('use', '').toLowerCase();
                    material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
                    updateVariantInfo();
                });
            });

            const utilityFolder = pane.addFolder({title: 'Utilities', expanded: true});
            utilityFolder.addButton({title: 'Clear All Textures'}).on('click', () => {
                textureKeys.forEach((key) => {
                    params[key] = false;
                    const textureType = key.replace('use', '').toLowerCase();
                    material[`${textureType}Texture`] = null;
                });
                updateVariantInfo();
            });

            const applyAllTextures = () => {
                textureKeys.forEach((key) => {
                    const textureType = key.replace('use', '').toLowerCase();
                    if (textures[textureType]) {
                        params[key] = true;
                        material[`${textureType}Texture`] = textures[textureType];
                    }
                });
                updateVariantInfo();
            };

            utilityFolder.addButton({title: 'Apply All Textures'}).on('click', applyAllTextures);

            applyAllTextures();
        }
    });
};
