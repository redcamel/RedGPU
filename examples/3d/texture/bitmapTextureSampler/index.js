import * as RedGPU from "../../../../dist/index.js?t=1792986902850";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1792986902850";

/**
 * [KO] Bitmap Texture Sampler 예제
 * [EN] Bitmap Texture Sampler example
 *
 * [KO] 비트맵 텍스처 샘플러의 필터링(min, mag, mipmap), 주소 모드(addressModeU, addressModeV), 이방성 필터링(maxAnisotropy) 옵션을 시연합니다.
 * [EN] Demonstrates filtering (min, mag, mipmap), address modes (addressModeU, addressModeV), and anisotropic filtering (maxAnisotropy) options of a bitmap texture sampler.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 7.5;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] 비트맵 텍스처 및 머티리얼 생성
        // [EN] Create bitmap texture and material
        const geometry = new RedGPU.Primitive.Box(redGPUContext, 5, 5, 5, 16, 16, 16, 2);
        const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, diffuseTexture);
        material.textureScale = [2, 2];

        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        scene.addChild(mesh);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            mesh.rotationY += 0.05;
        });

        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = (redGPUContext, mesh) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const texture = mesh.material.diffuseTexture;
            const sampler = mesh.material.diffuseTextureSampler;
            const state = {
                enableAnisotropy: ''
            };

            let maxAnisotropyBinding;

            const updateAnisotropyState = () => {
                const valid = sampler.isAnisotropyValid;

                if (!valid) {
                    sampler.maxAnisotropy = 1;
                    if (maxAnisotropyBinding) maxAnisotropyBinding.disabled = true;
                } else {
                    if (maxAnisotropyBinding) maxAnisotropyBinding.disabled = false;
                }

                state.enableAnisotropy = valid
                    ? 'enabled.'
                    : "disabled: Filters must be 'linear'.";

                pane.refresh();
            };

            const textureFolder = pane.addFolder({title: 'Texture Option', expanded: true});
            textureFolder.addBinding(texture, 'useMipmap');

            const samplerFolder = pane.addFolder({title: 'Sampler Option', expanded: true});
            const filterOptions = {
                Nearest: 'nearest',
                Linear: 'linear'
            };
            const addressOptions = {
                ClampToEdge: 'clamp-to-edge',
                Repeat: 'repeat',
                Mirror: 'mirror-repeat'
            };

            samplerFolder.addBinding(sampler, 'minFilter', {options: filterOptions}).on('change', updateAnisotropyState);
            samplerFolder.addBinding(sampler, 'magFilter', {options: filterOptions}).on('change', updateAnisotropyState);
            samplerFolder.addBinding(sampler, 'mipmapFilter', {options: filterOptions}).on('change', updateAnisotropyState);
            samplerFolder.addBinding(sampler, 'addressModeU', {options: addressOptions});
            samplerFolder.addBinding(sampler, 'addressModeV', {options: addressOptions});

            maxAnisotropyBinding = samplerFolder.addBinding(sampler, 'maxAnisotropy', {
                min: 1,
                max: 16,
                step: 1
            });

            samplerFolder.addBinding(state, 'enableAnisotropy', {
                view: 'text',
                disabled: true
            });

            updateAnisotropyState();
        }
    });
};
