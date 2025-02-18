import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 7.5;
		controller.speedDistance = 0.2;

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();

		// Add directional light
		// 방향광(light) 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// Add a view and configure it
		// 뷰 생성 및 설정 추가
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add single mesh to the scene
		// 메쉬 하나를 추가
		const mesh = addSingleMesh(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			mesh.rotationY += 0.25; // Add rotation animation to the mesh
		});

		renderTestPane(redGPUContext, mesh); // Render test pane with the single mesh
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// Function to add a single mesh to the scene
// 씬에 하나의 메쉬를 추가하는 함수
const addSingleMesh = (redGPUContext, scene) => {
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 5, 5, 5, 16, 16, 16, 2);
	// const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/texture/crate.png");
	const diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
	material.diffuseTexture = diffuseTexture;

	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	mesh.setPosition(0, 0, 0); // Center the mesh
	scene.addChild(mesh);

	return mesh; // Return the created mesh
};
const renderTestPane = async (redGPUContext, mesh) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes");
	const pane = new Pane();

	// Add a separator
	setSeparator(pane);

	// Define initial sampler options
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

	let anisotropyStatusBinding = null; // Reference to the status text UI

	const updateAnisotropyState = () => {
		const valid = mesh.material.diffuseTextureSampler.isAnisotropyValid;

		if (!valid) {
			console.warn(`Max anisotropy disabled due to incompatible sampler filters.`);
			samplerOptions.maxAnisotropy = 1;
			maxAnisotropyBinding.disabled = true; // Disable maxAnisotropy control
		} else {
			maxAnisotropyBinding.disabled = false; // Enable maxAnisotropy control
		}

		// Update the bound property instead of directly modifying the binding
		samplerOptions.enableAnisotropy = valid
			? "enabled."
			: "disabled: Filters must be 'linear'.";

		// Apply the change to the mesh
		mesh.material.diffuseTextureSampler.maxAnisotropy = samplerOptions.maxAnisotropy;

		// Refresh the pane to reflect changes
		pane.refresh();
	};

	// Add UI controls for sampler options
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
	// Add maxAnisotropy binding
	const maxAnisotropyBinding = samplerFolder.addBinding(samplerOptions, 'maxAnisotropy', {
		min: 1,
		max: 16,
		step: 1,
	}).on('change', (evt) => {
		mesh.material.diffuseTextureSampler.maxAnisotropy = Math.floor(evt.value);
	});

	// Add status display for anisotropy
	anisotropyStatusBinding = samplerFolder.addBinding(
		samplerOptions,
		'enableAnisotropy',
		{view: 'text', disabled: true}
	);

	// Initial update of anisotropy state
	updateAnisotropyState();
};
