import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스 생성 및 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// 2. Define texture paths in one location
// 2. 텍스처 경로를 한 곳에서 정의
const texturePaths = {
	diffuse: "../../../assets/phongMaterial/test_diffuseMap.jpg",
	alpha: "../../../assets/phongMaterial/test_alphaMap.png",
	ao: "../../../assets/phongMaterial/test_aoMap.png",
	normal: "../../../assets/phongMaterial/test_normalMap.jpg",
	emissive: "../../../assets/phongMaterial/test_emissiveMap.jpg",
	displacement: "../../../assets/phongMaterial/test_displacementMap.jpg",
	specular: "../../../assets/phongMaterial/test_specularMap.webp",
};

// 3. Initialize RedGPU
// 3. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Set up camera controller
		// 카메라 컨트롤러 설정
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 40;
		controller.speedDistance = 0.5
		// Create and set up scene
		// 씬 생성 및 설정
		const scene = new RedGPU.Display.Scene();
		scene.useBackgroundColor = true;
		scene.backgroundColor.setColorByHEX('#5259c3');

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add directional light
		// 방향광(light) 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// Create and position multiple meshes with different primitives
		// 다양한 기본 프리미티브로 메쉬 생성 및 배치
		const geometries = [
			new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),       // Sphere
			new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3),            // Box
			new RedGPU.Primitive.Torus(redGPUContext, 1.5, 0.5, 32, 32), // Torus
			new RedGPU.Primitive.Plane(redGPUContext, 5, 5, 2, 2),       // Plane
			new RedGPU.Primitive.Cylinder(redGPUContext, 2, 2, 5, 32, 2), // Cylinder
			new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4, 128, 64) // TorusKnot
		];

		const material = new RedGPU.Material.PhongMaterial(redGPUContext);

		// Center radius for circular arrangement
		// 원형 배치 중심 반지름
		const radius = 10;

		// Total number of geometries
		const totalGeometries = geometries.length;

		// Arrange every geometry in a circular pattern
		geometries.forEach((geometry, index) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			mesh.primitiveState.cullMode = "none";

			// Angle calculation for circular arrangement
			// 원형 배치에 사용할 각도 계산
			const angle = (Math.PI * 2 * index) / totalGeometries;

			// Calculate x, z positions based on angle
			// 각도를 기반으로 x, z 좌표 계산
			mesh.x = radius * Math.cos(angle); // Compute x coordinate
			mesh.z = radius * Math.sin(angle); // Compute z coordinate

			scene.addChild(mesh);
		});

		// UI를 첫 번째 메쉬와 연결
		renderUI(redGPUContext, scene.children[0]);

		// Start rendering
		// 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
	}
);

// Function to create reusable textures using the texturePaths
// texturePaths를 이용한 재사용 가능한 텍스처 생성 함수
const createTextures = (redGPUContext) => {
	return Object.fromEntries(
		Object.entries(texturePaths).map(([key, path]) => [
			key,
			new RedGPU.Resource.BitmapTexture(redGPUContext, path),
		])
	);
};

// Function to render the UI controls for material properties
// 재질 속성 조작을 위한 UI를 렌더링하는 함수
const renderUI = async (redGPUContext, mesh) => {
	const {Pane} = await import(
		"https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js"
		);
	const {setSeparator} = await import("../../../exampleHelper/createExample/panes/index.js");

	const pane = new Pane();
	const material = mesh.material;
	const textures = createTextures(redGPUContext);

	// Parameters for UI controls
	// UI 조작을 위한 파라미터 설정
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

	// Store default values for reset
	// 리셋을 위한 기본값 보관
	const defaultValues = JSON.parse(JSON.stringify(params));

	// Refresh function to update UI
	// UI 업데이트를 위한 새로고침 함수
	const refreshUI = () => {
		pane.refresh();
	};

	// Add color picker for material color
	// 색상 선택기 추가 (재질 색상용)
	pane.addBinding(params, "color", {picker: "inline", view: "color", expanded: true})
		.on("change", (ev) => {
			const {r, g, b} = ev.value;
			material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
		});
	setSeparator(pane);

	// Add color picker for emissive color
	// 색상 선택기 추가 (방출 색상용)
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
			mesh.material.opacity = e.value
		});
	setSeparator(pane);
	// Add numeric controls for material properties
	// 재질 속성을 위한 슬라이더 추가
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

	// Add texture usage toggles
	// 텍스처 사용 여부 토글 추가
	Object.keys(params.textures).forEach((key) => {
		pane.addBinding(params.textures, key).on("change", (ev) => {
			const textureType = key.replace("use", "").toLowerCase();
			material[`${textureType}Texture`] = ev.value ? textures[textureType] : null;
		});
	});
	setSeparator(pane);

	// Reset button
	// 리셋 버튼
	pane.addButton({title: "Reset All"}).on("click", () => {
		// Reset material properties
		// 재질 속성 초기화
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

		// Reset textures
		// 텍스처 초기화
		for (const k in defaultValues.textures) {
			params.textures[k] = false;
			const textureKey = k.replace("use", "").toLowerCase();
			material[`${textureKey}Texture`] = null;
		}

		// Refresh UI
		// UI 리프레시
		refreshUI();
	});
};
