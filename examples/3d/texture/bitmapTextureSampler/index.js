import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

/**
 * [KO] Bitmap Texture Sampler 예제
 * [EN] Bitmap Texture Sampler example
 *
 * [KO] 비트맵 텍스처 샘플러의 다양한 옵션(필터링, 래핑, 이방성 필터링 등)을 테스트하는 예제입니다.
 * [EN] Example testing various options of bitmap texture sampler (filtering, wrapping, anisotropic filtering, etc.).
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 7.5;
        controller.speedDistance = 0.2;

        const scene = new RedGPU.Display.Scene();

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const mesh = addSingleMesh(redGPUContext, scene);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            mesh.rotationY += 0.05;
        });

        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 단일 메시를 추가합니다.
 * [EN] Adds a single mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const addSingleMesh = (redGPUContext, scene) => {
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 5, 5, 5, 16, 16, 16, 2);
    const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
    material.diffuseTexture = diffuseTexture;

    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.setPosition(0, 0, 0);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = async (redGPUContext, mesh) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
    const {
        setSeparator,
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");
    setDebugButtons(RedGPU, redGPUContext);
    const pane = new Pane();

    const samplerOptions = {
        enableAnisotropy: '',
        useMipmap: mesh.material.diffuseTexture.useMipmap,
        minFilter: mesh.material.diffuseTextureSampler.minFilter,
        magFilter: mesh.material.diffuseTextureSampler.magFilter,
        mipmapFilter: mesh.material.diffuseTextureSampler.mipmapFilter,
        addressModeU: mesh.material.diffuseTextureSampler.addressModeU,
        addressModeV: mesh.material.diffuseTextureSampler.addressModeV,
        addressModeW: mesh.material.diffuseTextureSampler.addressModeW,
        maxAnisotropy: mesh.material.diffuseTextureSampler.maxAnisotropy
    };

    const updateAnisotropyState = () => {
        const valid = mesh.material.diffuseTextureSampler.isAnisotropyValid;

        if (!valid) {
            console.warn(`Max anisotropy disabled due to incompatible sampler filters.`);
            samplerOptions.maxAnisotropy = 1;
            maxAnisotropyBinding.disabled = true;
        } else {
            maxAnisotropyBinding.disabled = false;
        }

        samplerOptions.enableAnisotropy = valid
            ? "enabled."
            : "disabled: Filters must be 'linear'.";

        mesh.material.diffuseTextureSampler.maxAnisotropy = samplerOptions.maxAnisotropy;
        pane.refresh();
    };

    const textureFolder = pane.addFolder({title: 'Texture Option', expanded: true});
    textureFolder.addBinding(samplerOptions, 'useMipmap').on('change', (evt) => {
        mesh.material.diffuseTexture.useMipmap = evt.value;
    });

    const samplerFolder = pane.addFolder({title: 'Sampler Option', expanded: true});
    samplerFolder.addBinding(samplerOptions, 'minFilter', {
        options: {
            Nearest: 'nearest',
            Linear: 'linear'
        }
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.minFilter = evt.value;
        samplerOptions.minFilter = evt.value;
        updateAnisotropyState();
    });

    samplerFolder.addBinding(samplerOptions, 'magFilter', {
        options: {
            Nearest: 'nearest',
            Linear: 'linear'
        }
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.magFilter = evt.value;
        samplerOptions.magFilter = evt.value;
        updateAnisotropyState();
    });

    samplerFolder.addBinding(samplerOptions, 'mipmapFilter', {
        options: {
            Nearest: 'nearest',
            Linear: 'linear'
        }
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.mipmapFilter = evt.value;
        samplerOptions.mipmapFilter = evt.value;
        updateAnisotropyState();
    });

    samplerFolder.addBinding(samplerOptions, 'addressModeU', {
        options: {
            ClampToEdge: 'clamp-to-edge',
            Repeat: 'repeat',
            Mirror: 'mirror-repeat'
        }
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.addressModeU = evt.value;
    });

    samplerFolder.addBinding(samplerOptions, 'addressModeV', {
        options: {
            ClampToEdge: 'clamp-to-edge',
            Repeat: 'repeat',
            Mirror: 'mirror-repeat'
        }
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.addressModeV = evt.value;
    });

    setSeparator(samplerFolder);

    const maxAnisotropyBinding = samplerFolder.addBinding(samplerOptions, 'maxAnisotropy', {
        min: 1,
        max: 16,
        step: 1,
    }).on('change', (evt) => {
        mesh.material.diffuseTextureSampler.maxAnisotropy = Math.floor(evt.value);
    });

    samplerFolder.addBinding(
        samplerOptions,
        'enableAnisotropy',
        {view: 'text', disabled: true}
    );

    updateAnisotropyState();
};