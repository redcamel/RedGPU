import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 22; // 카메라 거리
		controller.tilt = 0;
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 샘플러 설정

		// 카테고리 생성 및 렌더링
		createCategoryGroups(
			redGPUContext,
			scene,
		);

		// 렌더 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
			scene.children.forEach(group => {
				if (group.geometry instanceof RedGPU.Primitive.TorusKnot) {
					group.rotationX += 0.25;
					group.rotationY += 0.25;
					group.rotationZ += 0.25;
				}
			})
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
	}
);

// 특정 값을 고정한 상태로 조합 생성
const generateSamplerCombinations = (settings, fixedCategory, fixedValue) => {
	const combinations = [];
	const recursiveGenerator = (current, depth) => {
		if (depth === settings.length) {
			if (current[fixedCategory] === fixedValue) {
				combinations.push({...current}); // 기준 값을 포함한 경우 추가
			}
			return;
		}
		const {name, values} = settings[depth];
		values.forEach((value) => {
			recursiveGenerator({...current, [name]: value}, depth + 1); // 깊이 탐색으로 조합 생성
		});
	};
	recursiveGenerator({}, 0);
	return combinations;
};
// 특정 카테고리를 기준으로 그룹 생성
const generateGroupedCombinations = (settings, category) => {
	const targetSetting = settings.find((setting) => setting.name === category); // 카테고리 찾기
	return targetSetting.values.map((value) => ({
		name: `${category}: ${value}`,
		combinations: generateSamplerCombinations(settings, category, value), // 해당 값에 맞는 조합 생성
	}));
};
// 카테고리별로 메쉬와 레이아웃 생성
const createCategoryGroups = (
	redGPUContext,
	scene,
) => {
	const settings = [
		{name: "minFilter", values: ["nearest", "linear"]},
		{name: "magFilter", values: ["nearest", "linear"]},
		{name: "mipmapFilter", values: ["nearest", "linear"]},
	];

	// 카테고리별 그룹화
	const minFilterGroups = generateGroupedCombinations(settings, "minFilter");
	const magFilterGroups = generateGroupedCombinations(settings, "magFilter");
	const mipmapFilterGroups = generateGroupedCombinations(settings, "mipmapFilter");
	const categories = [minFilterGroups, magFilterGroups, mipmapFilterGroups];
	// 간격 설정
	const spacingX = 3.5; // 그룹 내 요소 간격 (X축)
	const spacingY = 3; // 그룹 내 요소 간격 (Y축)
	const categorySpacingX = 15; // 카테고리 간 간격 (가로)
	const groupSpacingY = 7; // 그룹 간 Y 간격
	const subGroupSpacingY = 12; // 그룹 내부 서브 배치 간격

	// 중앙 배치를 위한 시작 위치 계산
	const totalCategoriesWidth = 2 * categorySpacingX; // 카테고리 자체 간격 (X)
	const startX = -totalCategoriesWidth / 2;
	let currentX = startX; // 카테고리 기준 위치

	categories.forEach((categoryGroups, categoryIndex) => {
		let currentY = 0; // 그룹 배치 시작 지점

		// 카테고리 라벨 (타이틀) 추가
		const categoryLabel = new RedGPU.Display.TextField3D(redGPUContext);
		categoryLabel.text = `Category: ${["minFilter", "magFilter", "mipmapFilter"][categoryIndex]}`;
		categoryLabel.color = "#dc631d";
		categoryLabel.fontSize = 64;
		categoryLabel.setPosition(currentX, currentY + 7, 0); // 위치 설정
		categoryLabel.useBillboard = true;
		categoryLabel.useBillboardPerspective = true;

		scene.addChild(categoryLabel);

		// 그룹 내 메쉬 배치
		categoryGroups.forEach((group) => {
			createGroupMeshes(
				redGPUContext,
				scene,
				group, // 그룹 정보와 좌표 넘기기
				spacingX,
				spacingY,
				subGroupSpacingY,
				currentX,
				currentY
			);
			currentY -= groupSpacingY; // 그룹 간 간격 적용
		});

		currentX += categorySpacingX; // 다음 카테고리로 X축 이동
	});
};

// 그룹 내부의 메쉬 및 라벨 배치
const createGroupMeshes = (redGPUContext, scene, group, spacingX, spacingY, subGroupSpacingY, groupX, groupY) => {
	let maxYOffset = 0, minYOffset = 0; // 그룹 높이를 추적

	group.combinations.forEach((sampler, samplerIndex) => {
		// 메쉬 배치 좌표 계산
		const x = groupX + (samplerIndex % 4) * spacingX - ((4 - 1) * spacingX) / 2; // X 정렬
		const y = groupY - Math.floor(samplerIndex / 4) * spacingY + 2.75; // Y 정렬

		// 높이 추적
		if (samplerIndex === 0) maxYOffset = y;
		minYOffset = y;

		// 메쉬 생성
		const material = createMaterialWithSampler(redGPUContext, sampler);
		// const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2); // 상자 생성
		const geometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 0.55, 0.3, 128, 64);
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.setPosition(x, y, 0);
		scene.addChild(mesh);

		// 메쉬에 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.text = `min: ${sampler.minFilter} <br/> mag: ${sampler.magFilter} <br/> mipmap: ${sampler.mipmapFilter}`;
		label.color = "#ffffff";
		label.useBillboard = true;
		label.fontSize = 21;
		label.setPosition(x, y - 2.2, 0);
		scene.addChild(label);
	});

	// 그룹 중앙에 라벨 배치
	const groupHeight = maxYOffset - minYOffset;
	const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
	groupLabel.text = group.name;
	groupLabel.color = "#5fd7ff";
	groupLabel.fontSize = 42;
	groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2.5, 0); // Y 값으로 중심 정렬
	groupLabel.useBillboard = true;
	groupLabel.useBillboardPerspective = true;
	scene.addChild(groupLabel);

	groupY -= subGroupSpacingY; // 다음 Y 위치로 이동
};

// 개별 샘플러 설정으로 메쉬 재질 생성
const createMaterialWithSampler = (redGPUContext, sampler) => {
	// const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/texture/crate.png");
	const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg");
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
	material.diffuseTexture = texture;

	// 샘플러 설정 반영
	material.diffuseTextureSampler.minFilter = sampler.minFilter;
	material.diffuseTextureSampler.magFilter = sampler.magFilter;
	material.diffuseTextureSampler.mipmapFilter = sampler.mipmapFilter;

	return material;
};
