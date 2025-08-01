import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
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

const renderTestPane = async (redGPUContext, mesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator, setDebugViewButton} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugViewButton(redGPUContext);
	const pane = new Pane();

	setSeparator(pane);

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

	let anisotropyStatusBinding = null;

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

	anisotropyStatusBinding = samplerFolder.addBinding(
		samplerOptions,
		'enableAnisotropy',
		{view: 'text', disabled: true}
	);

	updateAnisotropyState();
};
