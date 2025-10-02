import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const texturePaths = {
	diffuse: "../../../assets/phongMaterial/test_diffuseMap.jpg",
	alpha: "../../../assets/phongMaterial/test_alphaMap.png",
	ao: "../../../assets/phongMaterial/test_aoMap.jpg",
	normal: "../../../assets/phongMaterial/test_normalMap.jpg",
	emissive: "../../../assets/phongMaterial/test_emissiveMap.jpg",
	displacement: "../../../assets/phongMaterial/test_displacementMap.jpg",
	specular: "../../../assets/phongMaterial/test_specularMap.jpg",
};

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.speedDistance = 0.5;

		const scene = new RedGPU.Display.Scene();
		scene.useBackgroundColor = true;
		scene.backgroundColor.setColorByHEX('#5259c3');

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true
		redGPUContext.addView(view);

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const geometries = [
			new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
			new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3, 10, 10, 10),
			new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 32, 32),
			new RedGPU.Primitive.Plane(redGPUContext, 5, 5, 10, 10),
			new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 5, 32, 2),
			new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4, 128, 64)
		];

		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		const radius = 10;
		const totalGeometries = geometries.length;

		geometries.forEach((geometry, index) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

			const angle = (Math.PI * 2 * index) / totalGeometries;
			mesh.x = radius * Math.cos(angle);
			mesh.z = radius * Math.sin(angle);

			scene.addChild(mesh);
		});

		renderUI(redGPUContext, scene.children[0]);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
	}
);

const createTextures = (redGPUContext) => {
	return Object.fromEntries(
		Object.entries(texturePaths).map(([key, path]) => [
			key,
			new RedGPU.Resource.BitmapTexture(redGPUContext, path),
		])
	);
};

const renderUI = async (redGPUContext, mesh) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const {setSeparator, setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(redGPUContext);
	const pane = new Pane();
	const material = mesh.material;
	const textures = createTextures(redGPUContext);

	const params = {
		color: {r: material.color.r, g: material.color.g, b: material.color.b},
		aoStrength: material.aoStrength,
		emissiveColor: {r: material.emissiveColor.r, g: material.emissiveColor.g, b: material.emissiveColor.b},
		emissiveStrength: material.emissiveStrength,
		specularColor: {r: material.specularColor.r, g: material.specularColor.g, b: material.specularColor.b},
		specularStrength: material.specularStrength,
		shininess: material.shininess,
		normalScale: material.normalScale,
		displacementScale: material.displacementScale,
		textures: {
			useDiffuse: !!material.diffuseTexture,
			useAlpha: !!material.alphaTexture,
			useAo: !!material.aoTexture,
			useSpecular: !!material.specularTexture,
			useNormal: !!material.normalTexture,
			useEmissive: !!material.emissiveTexture,
			useDisplacement: !!material.displacementTexture,
		},
	};

	const defaultValues = JSON.parse(JSON.stringify(params));

	const refreshUI = () => {
		pane.refresh();
	};

	pane.addBinding(params, "color", {picker: "inline", view: "color", expanded: true})
		.on("change", (ev) => {
			const {r, g, b} = ev.value;
			material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});
	setSeparator(pane);

	pane.addBinding(params, "emissiveColor", {picker: "inline", view: "color", expanded: true})
		.on("change", (ev) => {
			const {r, g, b} = ev.value;
			material.emissiveColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});

	pane.addBinding(params, "specularColor", {picker: "inline", view: "color", expanded: true})
		.on("change", (ev) => {
			const {r, g, b} = ev.value;
			material.specularColor.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});
	setSeparator(pane);

	pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01})
		.on('change', (e) => {
			mesh.material.opacity = e.value;
		});
	setSeparator(pane);

	const properties = [
		{key: "aoStrength", min: 0, max: 5, step: 0.01},
		{key: "emissiveStrength", min: 0, max: 1, step: 0.01},
		{key: "specularStrength", min: 0, max: 20, step: 0.01},
		{key: "shininess", min: 0, max: 128, step: 1},
		{key: "normalScale", min: 0, max: 2, step: 0.01},
		{key: "displacementScale", min: 0, max: 5, step: 0.01},
	];

	properties.forEach(({key, min, max, step}) =>
		pane.addBinding(params, key, {min, max, step}).on("change", (ev) => {
			material[key] = ev.value;
		})
	);
	setSeparator(pane);

	Object.keys(params.textures).forEach((key) => {
		pane.addBinding(params.textures, key).on("change", (ev) => {
			const textureType = key.replace("use", "").toLowerCase();
			material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
		});
	});

	setSeparator(pane);

	pane.addButton({title: "Reset All"}).on("click", () => {
		material.color.setColorByRGB(defaultValues.color.r, defaultValues.color.g, defaultValues.color.b);
		material.aoStrength = defaultValues.aoStrength;
		material.emissiveColor.setColorByRGB(
			defaultValues.emissiveColor.r,
			defaultValues.emissiveColor.g,
			defaultValues.emissiveColor.b
		);
		material.emissiveStrength = defaultValues.emissiveStrength;
		material.specularStrength = defaultValues.specularStrength;
		material.shininess = defaultValues.shininess;
		material.normalScale = defaultValues.normalScale;
		material.displacementScale = defaultValues.displacementScale;

		for (const k in defaultValues.textures) {
			params.textures[k] = false;
			const textureKey = k.replace("use", "").toLowerCase();
			material[`${textureKey}Texture`] = null;
		}

		refreshUI();
	});
	//
	material.diffuseTexture = textures.diffuse
	material.displacementTexture = textures.displacement
	material.normalTexture = textures.normal
	params.textures.useDisplacement = true
	params.textures.useNormal = true
	params.textures.useDiffuse = true
	//
	pane.refresh();
};
