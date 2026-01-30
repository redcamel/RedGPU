import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정
		// [EN] Camera setup
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -25;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 천장 앵커 포인트 생성 (높이 12m)
		// 1. Create ceiling anchor points (Height 12m)
		const anchorMeshList = [];
		const createAnchor = (x, z) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = 12;
			mesh.z = z;
			mesh.scaleX = 0.5;
			mesh.scaleY = 0.5;
			mesh.scaleZ = 0.5;
			mesh.material.color.setColorByHEX('#ff4444');
			scene.addChild(mesh);
			anchorMeshList.push(mesh);
			return physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		const anchors = [
			createAnchor(-5, -5),
			createAnchor(5, -5),
			createAnchor(5, 5),
			createAnchor(-5, 5)
		];

		// 2. 탄성 플랫폼 생성 (10m x 10m)
		// 2. Create elastic platform (10m x 10m)
		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		platform.y = 6;
		platform.scaleX = 10;
		platform.scaleY = 0.4;
		platform.scaleZ = 10;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 10,
			linearDamping: 0.5,
			angularDamping: 0.5
		});

		// 3. 스프링 물리 연결 최적화
		const springStiffness = 800.0;
		const springDamping = 40.0;

		anchors.forEach((anchor, i) => {
			const xSign = (i === 0 || i === 3) ? -1 : 1;
			const zSign = (i === 0 || i === 1) ? -1 : 1;

			const JD = RAPIER.JointData;
			const anchor1 = { x: 0, y: 0, z: 0 };
			const anchor2 = { x: 5 * xSign, y: 0, z: 5 * zSign };
			const jointData = JD.ball ? JD.ball(anchor1, anchor2) : JD.spherical(anchor1, anchor2);

			const joint = physicsEngine.nativeWorld.createImpulseJoint(jointData, anchor.nativeBody, platformBody.nativeBody, true);
			
			if (joint.setStiffness) joint.setStiffness(springStiffness);
			if (joint.setDamping) joint.setDamping(springDamping);
		});

		// 4. 시각적 스프링 선
		const springLines = [];
		anchorMeshList.forEach(() => {
			const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
			scene.addChild(line);
			springLines.push(line);
		});

		// 5. 낙하 물체 및 리셋
		const activeObjects = [];
		const createObject = () => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			mesh.x = (Math.random() * 4) - 2;
			mesh.y = 15;
			mesh.z = (Math.random() * 4) - 2;
			mesh.scaleX = 0.6;
			mesh.scaleY = 0.6;
			mesh.scaleZ = 0.6;
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1
			});
			activeObjects.push({ mesh, body });
			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeObjects.splice(idx, 1);
				}
			}, 10000);
		};

		const resetScene = () => {
			activeObjects.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeObjects.length = 0;
			platformBody.nativeBody.setTranslation({ x: 0, y: 6, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			platformBody.nativeBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
		};

		setInterval(createObject, 1500);

		const render = () => {
			springLines.forEach((line, i) => {
				const anchorMesh = anchorMeshList[i];
				const xSign = (i === 0 || i === 3) ? -1 : 1;
				const zSign = (i === 0 || i === 1) ? -1 : 1;
				line.removeAllPoint();
				line.addPoint(anchorMesh.x, anchorMesh.y, anchorMesh.z);
				line.addPoint(platform.x + (5 * xSign), platform.y, platform.z + (5 * zSign));
			});
		};
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};