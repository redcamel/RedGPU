import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 20; // 카메라 거리
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
				if (group.geometry instanceof RedGPU.Primitive.Box) {

					group.rotationY += 0.1;
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
const createCategoryGroups = (redGPUContext, scene) => {
	const settings = [
		{name: "addressModeU", values: ["clamp-to-edge", "repeat", "mirror-repeat"]},
		{name: "addressModeV", values: ["clamp-to-edge", "repeat", "mirror-repeat"]},
	];

	// 카테고리별 그룹화
	const addressModeUGroups = generateGroupedCombinations(settings, "addressModeU");
	const addressModeVGroups = generateGroupedCombinations(settings, "addressModeV");
	const categories = [addressModeUGroups, addressModeVGroups];

	// 간격 설정
	const spacingX = 3.8; // 그룹 내 메쉬 간격 (X축)
	const spacingY = 2; // 그룹 내 메쉬 간격 (Y축)
	const categorySpacingY = 6; // 카테고리 간 세로 간격 (Y축)
	const groupSpacingX = 12; // 그룹 간 가로 간격

	// 중앙 배치를 위한 시작 위치 계산
	const totalGroupsPerCategory = addressModeUGroups.length; // 한 카테고리의 그룹 개수 (가로 길이 계산용)
	const totalCategoryWidth = (totalGroupsPerCategory - 1) * groupSpacingX; // 카테고리의 전체 가로 너비
	const centerOffsetX = -totalCategoryWidth / 2; // X 기준 중앙 정렬 보정값

	let currentY = 5; // 카테고리 시작 Y 축(위치 조정 가능)

	categories.forEach((categoryGroups, categoryIndex) => {
		let currentX = centerOffsetX; // X축 중앙 정렬 시작 값

		// 카테고리 라벨 (타이틀) 추가
		const categoryLabel = new RedGPU.Display.TextField3D(redGPUContext);
		categoryLabel.text = `Category: ${["addressModeU", "addressModeV"][categoryIndex]}`;
		categoryLabel.color = "#dc631d";
		categoryLabel.fontSize = 52;
		categoryLabel.setPosition(currentX + totalCategoryWidth / 2, currentY + 2, 0); // 카테고리 텍스트 X 정중앙 위치
		categoryLabel.useBillboard = true;
		categoryLabel.useBillboardPerspective = true;
		scene.addChild(categoryLabel);

		currentY -= 1.5; // 카테고리 라벨 바로 아래로 간격 조정

		// 그룹에 있는 메쉬들을 가로로 배치
		categoryGroups.forEach((group, groupIndex) => {
			createGroupMeshes(
				redGPUContext,
				scene,
				group, // 그룹 정보와 좌표 넘기기
				spacingX,
				spacingY,
				currentX, // X 방향으로 이동
				currentY,
			);
			currentX += groupSpacingX; // 다음 그룹으로 이동
		});

		currentY -= categorySpacingY; // 다음 카테고리로 세로 방향 Y축 이동
	});
};

// 그룹 내부의 메쉬 및 라벨 배치
const createGroupMeshes = (redGPUContext, scene, group, spacingX, spacingY, groupX, groupY) => {
	let maxYOffset = 0, minYOffset = 0; // 그룹 높이를 추적

	group.combinations.forEach((sampler, samplerIndex) => {
		// 메쉬 배치 좌표 계산
		const x = groupX + (samplerIndex % 3) * spacingX - spacingX; // X 정렬
		const y = groupY - Math.floor(samplerIndex / 3) * spacingY; // Y 정렬

		// 높이 추적
		if (samplerIndex === 0) maxYOffset = y;
		minYOffset = y;

		// 메쉬 생성
		const material = createMaterialWithSampler(redGPUContext, sampler);
		const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2, 1, 1, 1, 2); // 상자 지오메트리
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.setPosition(x, y, 0);
		scene.addChild(mesh);

		// 메쉬에 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext);
		label.text = `ModeU: ${sampler.addressModeU}<br/>ModeV: ${sampler.addressModeV}`;
		label.color = "#ffffff";
		label.fontSize = 18;
		label.useBillboard = true;
		label.useBillboardPerspective = true;
		label.setPosition(x, y - 2, 0);
		scene.addChild(label);
	});

	// 그룹 중앙에 라벨 배치
	const groupHeight = maxYOffset - minYOffset;
	const groupLabel = new RedGPU.Display.TextField3D(redGPUContext);
	groupLabel.text = group.name;
	groupLabel.color = "#5fd7ff";
	groupLabel.fontSize = 36;
	groupLabel.setPosition(groupX, maxYOffset + groupHeight / 2 + 2, 0);
	groupLabel.useBillboard = true;
	groupLabel.useBillboardPerspective = true;
	scene.addChild(groupLabel);
};

// 개별 샘플러 설정으로 메쉬 재질 생성
const createMaterialWithSampler = (redGPUContext, sampler) => {
	const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/texture/crate.png");
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext);
	material.diffuseTexture = texture;

	// 샘플러 설정 반영
	material.diffuseTextureSampler.addressModeU = sampler.addressModeU;
	material.diffuseTextureSampler.addressModeV = sampler.addressModeV;

	return material;
};
