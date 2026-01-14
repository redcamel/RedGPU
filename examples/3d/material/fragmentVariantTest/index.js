import * as RedGPU from "../../../../dist/index.js?t=1768301050717";

// ===== Global Variables =====
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const texturePaths = {
    diffuse: "../../../assets/phongMaterial/test_diffuseMap.jpg",
    alpha: "../../../assets/phongMaterial/test_alphaMap.png",
    ao: "../../../assets/phongMaterial/test_aoMap.jpg",
    normal: "../../../assets/phongMaterial/test_normalMap.jpg",
    emissive: "../../../assets/phongMaterial/test_emissiveMap.jpg",
    specular: "../../../assets/phongMaterial/test_specularMap.jpg",
};

let shaderVariantGenerator = null;

let variantDisplay = null;

// ===== Display Functions =====
function createVariantDisplay() {
    const display = document.createElement('div');
    display.id = 'variant-display';
    display.style.cssText = `
		position: fixed;
		bottom: 70px;
		left: 0;
		right:0;
		background: rgba(0, 0, 0, 0.8);
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: white;
		padding: 12px 12px 16px;
		overflow-x:hidden;
		font-size: 16px;
		border: 1px solid #rgba(255,255,255,0.16);
		z-index: 1000;
		pointer-events: none;
	`;
    document.body.appendChild(display);
    return display;
}

function updateVariantDisplay(variant) {
    if (!variantDisplay) return;

    const features = variant === 'none' ? [] : variant.split('+');
    const featureCount = features.length;
    const borderColor = '#FF9800';

    variantDisplay.style.borderColor = borderColor;
    variantDisplay.innerHTML = `
		<div style="display: flex;flex-direction: column;gap:6px">
			<h3>Variant Key</h3>
			<div style="font-size: 16px; font-weight: bold; color: ${borderColor};word-break: keep-all">
				${variant === 'none' ? 'basic (none)' : `${variant}`}
			</div>
			<div style="font-size: 12px; color: #E0E0E0;">
				active features: ${featureCount}
			</div>
		</div>
	`;
}

// ===== 3D Scene Initialization =====
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // Camera controller setup
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        // Scene setup
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#2a2a2a');

        // View setup
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // Lighting setup
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        // Mesh creation
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = "none";
        scene.addChild(mesh);

        // UI rendering
        renderUI(redGPUContext, mesh);

        // Start renderer
        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, () => {
        });
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

// ===== Utility Functions =====
function extractShaderVariantInfo(mesh) {
    try {
        const fragmentInfo = mesh.material.gpuRenderInfo;
        if (fragmentInfo && fragmentInfo.fragmentShaderSourceVariant) {
            shaderVariantGenerator = fragmentInfo.fragmentShaderSourceVariant;

        }
    } catch (error) {
        console.warn('Failed to extract shader variant information:', error);
    }
}

const createTextures = (redGPUContext) => {
    return Object.fromEntries(
        Object.entries(texturePaths).map(([key, path]) => [
            key,
            new RedGPU.Resource.BitmapTexture(redGPUContext, path),
        ])
    );
};

// ===== UI Rendering =====
const renderUI = async (redGPUContext, mesh) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1768301050717");
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1768301050717");
    setDebugButtons(RedGPU, redGPUContext);

    const pane = new Pane({title: "Phong Shader Variants"});
    const material = mesh.material;
    const textures = createTextures(redGPUContext);

    // Initial setup
    variantDisplay = createVariantDisplay();
    extractShaderVariantInfo(mesh);

    // Parameter object
    const params = {
        shaderVariants: {
            currentVariant: 'none',
            cachedVariants: 0,
        },
        textureVariants: {
            useDiffuse: !!material.diffuseTexture,
            useAlpha: !!material.alphaTexture,
            useAO: !!material.aoTexture,
            useSpecular: !!material.specularTexture,
            useNormal: !!material.normalTexture,
            useEmissive: !!material.emissiveTexture,
        },
        display: {
            showVariantOverlay: variantDisplay?.style.display !== 'none'
        }
    };

    // ===== UI Folder Creation =====

    // Variant information folder
    const variantFolder = pane.addFolder({title: "📊 Variant Information", expanded: true});

    variantFolder.addBinding(params.shaderVariants, 'cachedVariants', {
        readonly: true,
        label: 'Cached Variants'
    });

    variantFolder.addBinding(params.shaderVariants, 'currentVariant', {
        readonly: true,
        label: 'Current Variant'
    });

    // Overlay display toggle
    variantFolder.addBinding(params.display, 'showVariantOverlay', {
        label: 'Show Overlay Display'
    }).on('change', (ev) => {
        if (variantDisplay) {
            variantDisplay.style.display = ev.value ? 'block' : 'none';
            localStorage.setItem('variantDisplayVisible', ev.value);
        }
    });

    setSeparator(pane);

    // Texture variants folder
    const textureFolder = pane.addFolder({title: "🖼️ Texture Variants", expanded: true});

    Object.keys(params.textureVariants).forEach((key) => {
        const label = key.replace('use', '').replace(/([A-Z])/g, ' $1').trim();
        textureFolder.addBinding(params.textureVariants, key, {
            label: label
        }).on("change", (ev) => {
            const textureType = key.replace("use", "").toLowerCase();
            material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
            updateVariantInfo();
        });
    });

    setSeparator(pane);

    // Utility folder
    const utilityFolder = pane.addFolder({title: "🛠️ Utilities"});

    // Clear all textures button
    utilityFolder.addButton({title: "🧹 Clear All Textures"}).on('click', () => {
        Object.keys(params.textureVariants).forEach(key => {
            params.textureVariants[key] = false;
            const textureType = key.replace("use", "").toLowerCase();
            material[`${textureType}Texture`] = null;
        });
        updateVariantInfo();
        pane.refresh();
    });

    const HD_AllTexture = () => {
        Object.keys(params.textureVariants).forEach(key => {
            const textureType = key.replace("use", "").toLowerCase();
            if (textures[textureType]) {
                params.textureVariants[key] = true;
                material[`${textureType}Texture`] = textures[textureType];
            }
        });
        updateVariantInfo();
        pane.refresh();
    }
    utilityFolder.addButton({title: "🎨 Apply All Textures"}).on('click', HD_AllTexture);
    HD_AllTexture()

    // ===== Core Functions =====

    function getCurrentVariant() {
        try {
            const shaderModuleLabel = material.gpuRenderInfo.fragmentShaderModule.label;
            if (shaderModuleLabel) {
                const labelParts = shaderModuleLabel.split('_');
                const variantKey = labelParts[labelParts.length - 1];
                return variantKey || 'none';
            }
        } catch (error) {
            console.warn('Failed to extract variant key from shader module label:', error);
        }
        return 'none';
    }

    function updateVariantInfo() {
        const currentVariant = getCurrentVariant();
        params.shaderVariants.currentVariant = currentVariant;

        if (shaderVariantGenerator) {
            params.shaderVariants.cachedVariants = shaderVariantGenerator.getCachedVariants().length;
            console.log(shaderVariantGenerator.getCachedVariants())
        }

        updateVariantDisplay(currentVariant);
        pane.refresh();
    }

    // Initial update execution
    updateVariantInfo();
};
