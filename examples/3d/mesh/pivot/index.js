import * as RedGPU from "../../../../dist";

// Create and append a canvas to the document
// 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Initialize RedGPU
// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext); // Orbit controller / 오빗 컨트롤러 생성
		controller.speedDistance = 0.3
		const scene = new RedGPU.Display.Scene(); // Create a new scene / 새로운 씬 생성
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller); // Create a view / 뷰 생성
		view.grid = true; // Enable grid / 그리드 활성화
		redGPUContext.addView(view); // Add view to the context / 컨텍스트에 뷰 추가

		// Create parent and child meshes
		// 부모 및 자식 메쉬 생성
		const parentMesh = createParentMesh(redGPUContext, scene);
		const childMesh = createChildMesh(redGPUContext, parentMesh);

		// Add pivot meshes
		// 피벗 메쉬 추가
		const parentPivotMesh = createPivotMesh(redGPUContext, parentMesh);
		const childPivotMesh = createPivotMesh(redGPUContext, childMesh);

		// Animation configuration
		// 애니메이션 설정
		const animationConfig = {
			parentAnimationOn: true, // Enable parent animation / 부모 애니메이션 활성화
			childAnimationOn: true,  // Enable child animation / 자식 애니메이션 활성화
			parentSpeedX: 0.5, // Parent rotation speed X / 부모 회전 속도 X
			parentSpeedY: 0.5, // Parent rotation speed Y / 부모 회전 속도 Y
			parentSpeedZ: 0.5, // Parent rotation speed Z / 부모 회전 속도 Z
			childSpeedX: 1.0,  // Child rotation speed X / 자식 회전 속도 X
			childSpeedY: 1.0,  // Child rotation speed Y / 자식 회전 속도 Y
			childSpeedZ: 1.0,  // Child rotation speed Z / 자식 회전 속도 Z
		};

		// Renderer and animation loop
		// 렌더러와 애니메이션 루프
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// Handle parent mesh animation / 부모 메쉬 애니메이션 처리
			if (animationConfig.parentAnimationOn) {
				parentMesh.rotationX += animationConfig.parentSpeedX;
				parentMesh.rotationY += animationConfig.parentSpeedY;
				parentMesh.rotationZ += animationConfig.parentSpeedZ;
			} else {
				parentMesh.rotationX = 0;
				parentMesh.rotationY = 0;
				parentMesh.rotationZ = 0;
			}

			// Handle child mesh animation / 자식 메쉬 애니메이션 처리
			if (animationConfig.childAnimationOn) {
				childMesh.rotationX += animationConfig.childSpeedX;
				childMesh.rotationY += animationConfig.childSpeedY;
				childMesh.rotationZ += animationConfig.childSpeedZ;
			} else {
				childMesh.rotationX = 0;
				childMesh.rotationY = 0;
				childMesh.rotationZ = 0;
			}

			// Update pivot mesh positions / 피벗 메쉬 위치 업데이트
			parentPivotMesh.setPosition(parentMesh.pivotX, parentMesh.pivotY, parentMesh.pivotZ);
			childPivotMesh.setPosition(childMesh.pivotX, childMesh.pivotY, childMesh.pivotZ);
		};

		renderer.start(redGPUContext, render); // Start the renderer / 렌더러 시작
		renderTestPane(parentMesh, childMesh, animationConfig); // Add UI controls / UI 컨트롤 추가
	},
	(failReason) => {
		console.error("Initialization failed:", failReason); // Log initialization failure / 초기화 실패 로그
	}
);

// Function to create the parent mesh / 부모 메쉬를 생성하는 함수
const createParentMesh = (redGPUContext, scene) => {
	const material = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		new RedGPU.Resource.BitmapTexture(redGPUContext, "../../../assets/UV_Grid_Sm.jpg")
	); // Bitmap material / 비트맵 재질
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3); // Box geometry / 박스 형태 지오메트리
	const parentMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	parentMesh.setPosition(0, 0, 0); // Set parent mesh position / 부모 메쉬 위치 설정
	scene.addChild(parentMesh); // Add parent mesh to the scene / 씬에 부모 메쉬 추가

	return parentMesh;
};

// Function to create the child mesh / 자식 메쉬를 생성하는 함수
const createChildMesh = (redGPUContext, parentMesh) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#ff0000"); // Red material / 빨간색 재질
	const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1); // Box geometry / 박스 형태 지오메트리
	const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

	childMesh.setPosition(3, 3, 0); // Set child mesh relative position / 자식 메쉬 상대 위치 설정
	parentMesh.addChild(childMesh); // Add child mesh to the parent mesh / 부모 메쉬에 자식 메쉬 추가

	return childMesh;
};

// Function to create a pivot mesh / 피벗 메쉬를 생성하는 함수
const createPivotMesh = (redGPUContext, targetMesh) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00ff00"); // Green material / 녹색 재질
	const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 0.1, 8, 8); // Sphere geometry / 구 형태 지오메트리
	const pivotMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
	pivotMesh.depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS; // Always render / 항상 렌더링

	targetMesh.addChild(pivotMesh); // Add pivot mesh to the target mesh / 대상 메쉬에 피벗 메쉬 추가
	return pivotMesh;
};

// Function to render UI controls / UI 컨트롤을 렌더링하는 함수
const renderTestPane = async (parentMesh, childMesh, animationConfig) => {
	const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js");
	const pane = new Pane();

	// Parent mesh controls / 부모 메쉬 컨트롤
	const parentFolder = pane.addFolder({title: "Parent Mesh", expanded: true});
	parentFolder.addBinding(animationConfig, "parentAnimationOn", {label: "Parent Animation"}); // Toggle parent animation / 부모 애니메이션 온오프
	parentFolder.addBinding(parentMesh, "pivotX", {min: -2, max: 2, step: 0.1, label: "Pivot X"});
	parentFolder.addBinding(parentMesh, "pivotY", {min: -2, max: 2, step: 0.1, label: "Pivot Y"});
	parentFolder.addBinding(parentMesh, "pivotZ", {min: -2, max: 2, step: 0.1, label: "Pivot Z"});

	// Child mesh controls / 자식 메쉬 컨트롤
	const childFolder = pane.addFolder({title: "Child Mesh", expanded: true});
	childFolder.addBinding(animationConfig, "childAnimationOn", {label: "Child Animation"}); // Toggle child animation / 자식 애니메이션 온오프
	childFolder.addBinding(childMesh, "pivotX", {min: -2, max: 2, step: 0.1, label: "Pivot X"});
	childFolder.addBinding(childMesh, "pivotY", {min: -2, max: 2, step: 0.1, label: "Pivot Y"});
	childFolder.addBinding(childMesh, "pivotZ", {min: -2, max: 2, step: 0.1, label: "Pivot Z"});
};
