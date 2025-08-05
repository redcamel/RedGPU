import * as RedGPU from "../../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 기본 설정
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.speedDistance = 0.3;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		// view.axis = true;
		redGPUContext.addView(view);

		// 단일 바운딩 박스 테스트 (위쪽 줄)
		createBoundingTestRow(redGPUContext, scene, 0);

		// 결합 바운딩 박스 테스트 (아래쪽)
		createCombinedBoundingTest(redGPUContext, scene);

		// 렌더링 루프
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 모든 메시를 회전시켜 바운딩 박스 변화 확인
			scene.children.forEach(child => {
				child.rotationX += 0.2;
				child.rotationY += 0.2;
				child.rotationZ += 0.2;

				// 자식이 있으면 더 빠르게 회전
				const firstChild = child.getChildAt?.(0);
				if (firstChild) {
					firstChild.rotationX += 1;
					firstChild.rotationY += 1;
					firstChild.rotationZ += 1;
				}
			});
		};
		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		console.error('RedGPU 초기화 실패:', failReason);
		document.body.innerHTML = `<div>오류: ${failReason}</div>`;
	}
);
const renderTestPane = async (redGPUContext) => {
	const {setDebugViewButton} = await import("../../../../exampleHelper/createExample/panes/index.js");
	setDebugViewButton(redGPUContext);
};

// 단일 바운딩 박스 테스트 (OBB, AABB, BOTH)
function createBoundingTestRow(redGPUContext, scene, zOffset) {
	const configs = [
		{x: -4, mode: 'OBB', label: 'BoundingOBB'},
		{x: 0, mode: 'AABB', label: 'BoundingAABB'},
		{x: 4, mode: 'BOTH', label: 'BOTH'}
	];

	configs.forEach(config => {
		const mesh = createSampleMesh(redGPUContext, scene);
		mesh.x = config.x;
		mesh.z = zOffset;

		// 디버거 설정
		mesh.enableDebugger = true;
		mesh.drawDebugger.debugMode = config.mode;

		// 라벨 추가
		const label = new RedGPU.Display.TextField3D(redGPUContext, config.label);
		label.useBillboard = true;
		label.setPosition(config.x, -1, 2.5 + zOffset);
		label.fontSize = 24
		scene.addChild(label);
	});
}

// 결합 바운딩 박스 테스트 (부모-자식 관계)
function createCombinedBoundingTest(redGPUContext, scene) {
	// 부모 메시 생성
	const parentMesh = createSampleMesh(redGPUContext, scene);
	parentMesh.x = 0;
	parentMesh.z = -6;

	// 자식 메시 생성 및 추가
	const childMesh = createSampleMesh(redGPUContext, scene);
	childMesh.x = 2;  // 부모로부터 오프셋
	childMesh.setScale(0.5);  // 크기 축소
	childMesh.material.color.setColorByHEX('#ff0000')
	parentMesh.addChild(childMesh);

	// 결합 AABB 디버거 활성화
	parentMesh.enableDebugger = true;
	parentMesh.drawDebugger.debugMode = 'COMBINED_AABB';

	// 라벨 추가
	const label = new RedGPU.Display.TextField3D(redGPUContext, 'combinedBoundingAABB');
	label.useBillboard = true;
	label.setPosition(0, 2, -4.5);
	label.fontSize = 30
	scene.addChild(label);
}

// 기본 박스 메시 생성 함수
function createSampleMesh(redGPUContext, scene) {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#dfa9e6');
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
	const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	scene.addChild(mesh);
	return mesh;
}
