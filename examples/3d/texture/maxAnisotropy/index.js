import * as RedGPU from "../../../../dist";

// Canvas 생성 및 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 100;
		controller.tilt = 75

		const scene = new RedGPU.Display.Scene();

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// Test Pane 렌더링 (maxAnisotropy 테스트)
		renderTestPane(redGPUContext, scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
)
const renderTestPane = async (redGPUContext, scene) => {
	const maxAnisotropyValues = [1, 8, 16];
	const spacing = 105;
	const yOffset = 55;

	for (let i = 0; i < maxAnisotropyValues.length; i++) {
		const anisotropy = maxAnisotropyValues[i];
		const x = -((maxAnisotropyValues.length - 1) * spacing) / 2 + spacing * i;

		const createMesh = (texturePath, yPosition) => {
			const geometry = new RedGPU.Primitive.Plane(redGPUContext, 100, 100, 32, 32, 2);
			const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, texturePath);
			const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
			material.diffuseTexture = texture;
			material.diffuseTextureSampler.maxAnisotropy = anisotropy;

			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			mesh.primitiveState.cullMode = 'none';
			mesh.setPosition(x, yPosition, 0);
			scene.addChild(mesh);

			return mesh;
		};

		// 상위 라인 (기존 텍스처)
		createMesh("../../../assets/maxAnisotropy/maxAnisotropy.jpg", yOffset);

		// 하위 라인 (새로운 텍스처)
		const bottomMesh = createMesh("../../../assets/UV_Grid_Sm.jpg", -yOffset);

		// 텍스트 라벨 추가 (하위 라인 기준)
		const textLabel = new RedGPU.Display.TextField3D(redGPUContext);
		textLabel.text = `maxAnisotropy: ${anisotropy}`;
		textLabel.useBillboardPerspective = false;
		textLabel.useBillboard = true;
		textLabel.fontSize = 26;
		textLabel.depthStencilState.depthCompare = 'always'
		textLabel.setPosition(bottomMesh.x, 0, bottomMesh.z);
		scene.addChild(textLabel);
	}
};
