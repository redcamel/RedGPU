import * as RedGPU from "../../../../dist/index.js?t=1783324948992";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783324948992";

/**
 * [KO] Fragment Variant Test 예제
 * [EN] Fragment Variant Test example
 *
 * [KO] 활성화된 텍스처 조합에 따라 셰이더 베리언트가 동적으로 생성되고 캐싱되는 과정을 시연합니다.
 * [EN] Demonstrates dynamic shader variant generation and caching based on active texture combinations.
 */

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
let variantDisplayOverlay = null;

/**
 * [KO] 셰이더 베리언트 키를 화면에 표시할 오버레이를 생성합니다.
 * [EN] Creates an overlay to display the shader variant key on the screen.
 */
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
		border: 1px solid rgba(255,255,255,0.16);
		z-index: 1000;
		pointer-events: none;
	`;
    document.body.appendChild(display);
    return display;
}

/**
 * [KO] 오버레이의 내용을 현재 베리언트 정보로 업데이트합니다.
 * [EN] Updates overlay content with current variant information.
 */
function updateVariantDisplay(variant) {
    if (!variantDisplayOverlay) return;

    const features = variant === 'none' ? [] : variant.split('+');
    const featureCount = features.length;
    const highlightColor = '#FF9800';

    variantDisplayOverlay.style.borderColor = highlightColor;
    variantDisplayOverlay.innerHTML = `
		<div style="display: flex;flex-direction: column;gap:6px">
			<h3>Variant Key</h3>
			<div style="font-size: 16px; font-weight: bold; color: ${highlightColor};word-break: keep-all">
				${variant === 'none' ? 'basic (none)' : `${variant}`}
			</div>
			<div style="font-size: 12px; color: #E0E0E0;">
				active features: ${featureCount}
			</div>
		</div>
	`;
}

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#2a2a2a');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 조명 설정
        // [EN] Setup Lighting
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. [KO] 테스트용 메시 생성
        // [EN] Create Test Mesh
        const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
        const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000');

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
        scene.addChild(mesh);

        // 5. [KO] UI 렌더링 및 셰이더 정보 추출
        // [EN] Render UI and Extract Shader Information
        renderUI(redGPUContext, mesh);

        // 6. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

/**
 * [KO] 머티리얼에서 셰이더 베리언트 생성기 정보를 추출합니다.
 * [EN] Extracts shader variant generator information from the material.
 */
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

/**
 * [KO] 테스트에 필요한 텍스처 리소들을 생성합니다.
 * [EN] Creates texture resources needed for testing.
 */
const createTextures = (redGPUContext) => {
    return Object.fromEntries(
        Object.entries(texturePaths).map(([key, path]) => [
            key,
            new RedGPU.Resource.BitmapTexture(redGPUContext, path),
        ])
    );
};

/**
 * [KO] 베리언트 제어 및 상태 모니터링을 위한 UI를 구성합니다.
 * [EN] Configures UI for variant control and status monitoring.
 */
const renderUI = (redGPUContext, mesh) => {
    const material = mesh.material;
    const textures = createTextures(redGPUContext);

    variantDisplayOverlay = createVariantDisplay();
    extractShaderVariantInfo(mesh);

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
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
                    showVariantOverlay: true
                }
            };

            // [KO] 베리언트 정보 폴더
            // [EN] Variant Information Folder
            const variantFolder = pane.addFolder({title: "📊 Variant Information", expanded: true});
            variantFolder.addBinding(params.shaderVariants, 'cachedVariants', {
                readonly: true,
                label: 'Cached Variants'
            });
            variantFolder.addBinding(params.shaderVariants, 'currentVariant', {
                readonly: true,
                label: 'Current Variant'
            });

            variantFolder.addBinding(params.display, 'showVariantOverlay', {
                label: 'Show Overlay Display'
            }).on('change', (ev) => {
                if (variantDisplayOverlay) {
                    variantDisplayOverlay.style.display = ev.value ? 'flex' : 'none';
                }
            });

            // [KO] 텍스처 베리언트 설정 폴더
            // [EN] Texture Variants Settings Folder
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

            // [KO] 유틸리티 기능
            // [EN] Utilities
            const utilityFolder = pane.addFolder({title: "🛠️ Utilities"});
            utilityFolder.addButton({title: "🧹 Clear All Textures"}).on('click', () => {
                Object.keys(params.textureVariants).forEach(key => {
                    params.textureVariants[key] = false;
                    const textureType = key.replace("use", "").toLowerCase();
                    material[`${textureType}Texture`] = null;
                });
                updateVariantInfo();
                pane.refresh();
            });

            const applyAllTextures = () => {
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
            utilityFolder.addButton({title: "🎨 Apply All Textures"}).on('click', applyAllTextures);

            /**
             * [KO] 현재 활성화된 셰이더 베리언트 키를 가져옵니다.
             * [EN] Gets the currently active shader variant key.
             */
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

            /**
             * [KO] 화면 및 UI에 베리언트 정보를 업데이트합니다.
             * [EN] Updates variant information on the screen and UI.
             */
            function updateVariantInfo() {
                const currentVariant = getCurrentVariant();
                params.shaderVariants.currentVariant = currentVariant;

                if (shaderVariantGenerator) {
                    params.shaderVariants.cachedVariants = shaderVariantGenerator.getCachedVariants().length;
                }

                updateVariantDisplay(currentVariant);
                pane.refresh();
            }

            // [KO] 초기 텍스처 일괄 적용
            // [EN] Initial bulk application of textures
            applyAllTextures();
        }
    });
};
