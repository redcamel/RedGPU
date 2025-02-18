import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 30; // Camera distance / 카메라 거리 설정
		controller.tilt = 0; // Tilt angle / 카메라 기울기 설정
		controller.speedDistance = 0.3

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Add directional light
		// 방향성 라이트 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// Preload textures
		// 텍스처 사전 로드
		const textures = createTextures(redGPUContext);

		// Define texture testing lines
		// 텍스처 테스트를 위한 라인 정의
		const lines = [
			{base: 'color', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
			{
				base: 'emissiveColor',
				additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']
			},
			{
				base: 'specularColor',
				additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']
			},
			{base: 'alpha', additionalTextures: ['ao', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
			{base: 'ao', additionalTextures: ['alpha', 'diffuse', 'displacement', 'emissive', 'normal', 'specular']},
			{base: 'diffuse', additionalTextures: ['alpha', 'ao', 'displacement', 'emissive', 'normal', 'specular']},
			{base: 'displacement', additionalTextures: ['alpha', 'ao', 'diffuse', 'emissive', 'normal', 'specular']},
			{base: 'emissive', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'normal', 'specular']},
			{base: 'normal', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'emissive', 'specular']},
			{base: 'specular', additionalTextures: ['alpha', 'ao', 'diffuse', 'displacement', 'emissive', 'normal']},
		];

		// Define spacing for lines and meshes
		// 라인 및 메쉬 간 간격 설정
		const spacingX = 6;
		const spacingY = 4.5;

		// Create and arrange meshes by line
		// 라인별 메쉬 생성 및 배치
		createMeshesFromLines(redGPUContext, scene, lines, spacingX, spacingY, textures);

		// Start rendering
		// 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {

		});
	},
	(failReason) => {
		console.error('Initialization failed:', failReason); // Log initialization failure / 초기화 실패 로그
	}
);

// Function to create reusable textures
// 재사용 가능한 텍스처를 생성하는 함수
const createTextures = (redGPUContext) => {
	return {
		diffuse: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_diffuseMap.jpg'),
		alpha: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_alphaMap.png'),
		ao: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_aoMap.png'),
		normal: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_normalMap.jpg'),
		emissive: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_emissiveMap.jpg'),
		displacement: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_displacementMap.jpg'),
		specular: new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/phongMaterial/test_specularMap.webp'),
	};
};

// Function to create and position meshes for each line
// 각 라인의 메쉬를 생성하고 배치하는 함수
const createMeshesFromLines = (redGPUContext, scene, lines, spacingX, spacingY, textures) => {
	const totalLines = lines.length; // Total number of lines / 전체 라인의 개수

	lines.forEach((line, lineIndex) => {
		const base = line.base; // Base texture / 기준 텍스처
		const additionalTextures = line.additionalTextures; // Additional textures / 추가 텍스처
		const totalMeshes = additionalTextures.length; // Total meshes per line / 라인의 메쉬 개수

		// Add label at the top of the line
		// 라인의 최상단에 라벨 추가
		const xPosition = lineIndex * spacingX - (totalLines - 1) * spacingX / 2; // X-axis position / X축 위치
		const yPosition = -((totalMeshes - 1) * spacingY / 2 + 4); // Y-axis for the label / 라벨의 Y축 위치
		const lineLabel = new RedGPU.Display.TextField3D(redGPUContext);
		lineLabel.text = `Base : ${base}`;
		lineLabel.color = '#df5f00'; // Label color / 라벨 색상
		lineLabel.fontSize = 32;
		lineLabel.setPosition(xPosition, yPosition, 0);
		lineLabel.useBillboard = true;
		scene.addChild(lineLabel);

		// Create meshes for the line
		// 해당 라인의 메쉬 생성
		additionalTextures.forEach((textureType, meshIndex) => {
			const material = createMaterialWithTextures(redGPUContext, base, textureType, textures);
			material.specularStrength = 10
			material.shininess = 16

			// Calculate the Y-axis position
			// Y축 위치 계산
			const meshYPosition = -(meshIndex * spacingY - (totalMeshes - 1) * spacingY / 2);

			// Create geometry and mesh
			// 지오메트리 및 메쉬 생성
			const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32, 32);
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

			mesh.setPosition(xPosition, meshYPosition, 0);
			scene.addChild(mesh);

			// Add label for the mesh
			// 메쉬에 라벨 추가
			const label = new RedGPU.Display.TextField3D(redGPUContext);
			label.text = `${base.toLowerCase().includes('color') ? `<span style="color:${material[base].hex}">${material[base].hex}</span>` : base} + ${textureType}`;
			label.color = '#ffffff';
			label.fontSize = 26;
			label.setPosition(0, -2, 0);
			label.useBillboard = true;
			label.useBillboardPerspective = true;

			mesh.addChild(label);
		});
	});
};

// Function to create a material with specified textures
// 지정된 텍스처로 머티리얼을 생성하는 함수
const createMaterialWithTextures = (redGPUContext, base, additional, textures) => {
	const material = new RedGPU.Material.PhongMaterial(redGPUContext);

	if (base.toLowerCase().includes('color')) {
		material[base].setColorByRGB(
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
		)
	}

	// Set base texture
	// 기준 텍스처 설정
	switch (base) {
		case 'diffuse':
			material.diffuseTexture = textures.diffuse;
			break;
		case 'alpha':
			material.alphaTexture = textures.alpha;
			break;
		case 'ao':
			material.aoTexture = textures.ao;
			break;
		case 'normal':
			material.normalTexture = textures.normal;
			break;
		case 'emissive':
			material.emissiveTexture = textures.emissive;
			break;
		case 'displacement':
			material.displacementTexture = textures.displacement;
			break;
		case 'specular':
			material.specularTexture = textures.specular;
			material.specularStrength = 2;
			break;
	}

	// Set additional texture
	// 추가 텍스처 설정
	switch (additional) {
		case 'diffuse':
			material.diffuseTexture = textures.diffuse;
			break;
		case 'alpha':
			material.alphaTexture = textures.alpha;
			break;
		case 'ao':
			material.aoTexture = textures.ao;
			break;
		case 'normal':
			material.normalTexture = textures.normal;
			break;
		case 'emissive':
			material.emissiveTexture = textures.emissive;
			break;
		case 'displacement':
			material.displacementTexture = textures.displacement;
			break;
		case 'specular':
			material.specularTexture = textures.specular;
			material.specularStrength = 2;
			break;
	}

	return material; // Return the created material / 생성된 머티리얼 반환
};
