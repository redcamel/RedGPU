import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		const createBlock = (x, y, z, sx, sy, sz, color = '#444444') => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = sx; mesh.scaleY = sy; mesh.scaleZ = sz;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		};

		createBlock(0, -1, 0, 100, 2, 100);
		for(let i=0; i<30; i++) {
			createBlock((Math.random()*80)-40, i*1.5 + 2, (Math.random()*80)-40, 6, 0.5, 6, '#666666');
		}

		const charMesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Cylinder(redGPUContext, 0.6, 0.6, 1.8), new RedGPU.Material.PhongMaterial(redGPUContext));
		charMesh.material.color.setColorByHEX('#ff4444');
		charMesh.y = 5;
		scene.addChild(charMesh);

		const charBody = physicsEngine.createBody(charMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.CAPSULE
		});

		const charController = physicsEngine.createCharacterController(0.01);
		
		const keys = { w: false, s: false, a: false, d: false, ' ': false };
		window.addEventListener('keydown', (e) => { 
			const k = e.key.toLowerCase();
			if(keys.hasOwnProperty(k)) keys[k] = true; 
		});
		window.addEventListener('keyup', (e) => { 
			const k = e.key.toLowerCase();
			if(keys.hasOwnProperty(k)) keys[k] = false; 
		});

		let velocity = { x: 0, y: 0, z: 0 };
		let jumpCount = 0;
		const maxJumps = 3;
		const moveSpeed = 0.08;
		const airControl = 0.3;
		const gravity = -0.01;
		const jumpForce = 0.3;
		const friction = 0.6;

		const render = (time) => {
			const isGrounded = charController.computedGrounded();
			if (isGrounded) {
				velocity.y = 0;
				jumpCount = 0;
			} else {
				velocity.y += gravity;
			}

			const camX = controller.camera.x;
			const camZ = controller.camera.z;
			const targetX = controller.centerX;
			const targetZ = controller.centerZ;
			
			let fX = targetX - camX;
			let fZ = targetZ - camZ;
			const fLen = Math.sqrt(fX*fX + fZ*fZ);
			if(fLen > 0) { fX /= fLen; fZ /= fLen; }

			const rX = -fZ;
			const rZ = fX;

			let inputX = 0, inputZ = 0;
			if (keys.w) inputZ -= 1;
			if (keys.s) inputZ += 1;
			if (keys.a) inputX -= 1;
			if (keys.d) inputX += 1;

			const len = Math.sqrt(inputX * inputX + inputZ * inputZ);
			if (len > 0) {
				inputX /= len;
				inputZ /= len;
			}

			const controlPower = isGrounded ? 1.0 : airControl;
			
			let moveX = (fX * -inputZ + rX * inputX) * moveSpeed * controlPower;
			let moveZ = (fZ * -inputZ + rZ * inputX) * moveSpeed * controlPower;

			velocity.x += moveX;
			velocity.z += moveZ;
			velocity.x *= friction;
			velocity.z *= friction;

			if (keys[' '] && jumpCount < maxJumps) {
				velocity.y = jumpForce;
				jumpCount++;
				keys[' '] = false; 
			}

			charController.computeColliderMovement(charBody.nativeCollider, velocity);
			const corrected = charController.computedMovement();
			const current = charBody.nativeBody.translation();
			
			charBody.nativeBody.setNextKinematicTranslation({
				x: current.x + corrected.x,
				y: current.y + corrected.y,
				z: current.z + corrected.z
			});

			controller.centerX = charMesh.x;
			controller.centerY = charMesh.y;
			controller.centerZ = charMesh.z;
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, () => {
			charBody.nativeBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			velocity.x = velocity.y = velocity.z = 0;
		});
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetFunc) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Control', value: 'WASD: Move / Space: Double Jump', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Position' }).on('click', () => resetFunc());
};