import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const texturePaths = {
	diffuse: "../../../assets/phongMaterial/test_diffuseMap.jpg",
	alpha: "../../../assets/phongMaterial/test_alphaMap.png",
	ao: "../../../assets/phongMaterial/test_aoMap.png",
	normal: "../../../assets/phongMaterial/test_normalMap.jpg",
	emissive: "../../../assets/phongMaterial/test_emissiveMap.jpg",
	displacement: "../../../assets/phongMaterial/test_displacementMap.jpg",
	specular: "../../../assets/phongMaterial/test_specularMap.webp",
};

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 10;
		controller.speedDistance = 0.5;

		const scene = new RedGPU.Display.Scene();
		scene.useBackgroundColor = true;
		scene.backgroundColor.setColorByHEX('#5259c3');

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 🎯 메시 하나만 생성
		const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.primitiveState.cullMode = "none";

		scene.addChild(mesh);

		renderUI(redGPUContext, mesh);

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
	const { Pane } = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const { setSeparator } = await import("../../../exampleHelper/createExample/panes/index.js");

	const pane = new Pane();
	const material = mesh.material;
	const textures = createTextures(redGPUContext);

	const params = {
		color: { r: material.color.r, g: material.color.g, b: material.color.b },
		aoStrength: material.aoStrength,
		emissiveColor: { r: material.emissiveColor.r, g: material.emissiveColor.g, b: material.emissiveColor.b },
		emissiveStrength: material.emissiveStrength,
		specularColor: { r: material.specularColor.r, g: material.specularColor.g, b: material.specularColor.b },
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

	// 🎯 컬러 컨트롤
	pane.addBinding(params, "color", { picker: "inline", view: "color", expanded: true })
		.on("change", (ev) => {
			const { r, g, b } = ev.value;
			material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});
	setSeparator(pane);

	// 🎯 텍스처 토글
	Object.keys(params.textures).forEach((key) => {
		pane.addBinding(params.textures, key).on("change", (ev) => {
			const textureType = key.replace("use", "").toLowerCase();
			material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
		});
	});
	setSeparator(pane);

	// 🎯 리셋 버튼
	pane.addButton({ title: "Reset All" }).on("click", () => {
		material.color.setColorByRGB(defaultValues.color.r, defaultValues.color.g, defaultValues.color.b);

		for (const k in defaultValues.textures) {
			params.textures[k] = false;
			const textureKey = k.replace("use", "").toLowerCase();
			material[`${textureKey}Texture`] = null;
		}

		refreshUI();
	});
};
