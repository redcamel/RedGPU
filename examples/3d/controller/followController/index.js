import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
  canvas,
  (redGPUContext) => {
      // 타겟 메시 생성 (빨간색 박스)
      const targetMesh = new RedGPU.Display.Mesh(redGPUContext);
      targetMesh.material = new RedGPU.Material.PhongMaterial(redGPUContext,'#ff0000');
      targetMesh.geometry = new RedGPU.Primitive.Box(redGPUContext);

      // 타겟의 자식 메시 (녹색 박스) - 타겟의 앞쪽을 표시
      const targetMesh2 = new RedGPU.Display.Mesh(redGPUContext);
      targetMesh2.material = new RedGPU.Material.PhongMaterial(redGPUContext,'#00ff00');
      targetMesh2.geometry = new RedGPU.Primitive.Box(redGPUContext);
      targetMesh2.z = -2; // 타겟의 앞쪽에 배치
      targetMesh2.setScale(0.5);
      targetMesh.addChild(targetMesh2);

      // FollowController 생성
      const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
      const controller2 = new RedGPU.Camera.FollowController(redGPUContext, targetMesh2);

      const scene = new RedGPU.Display.Scene();
      scene.addChild(targetMesh);

      const directionalLight = new RedGPU.Light.DirectionalLight();
      scene.lightManager.addDirectionalLight(directionalLight);

      const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
      view.axis = true;
      view.grid = true;
      redGPUContext.addView(view);


      const view2 = new RedGPU.Display.View3D(redGPUContext, scene, controller2);
      view2.axis = true;
      view2.grid = true;
      redGPUContext.addView(view2);



      if (redGPUContext.detector.isMobile) {
          // 모바일: 위아래 분할
          view.setSize('100%', '50%');
          view.setPosition(0, 0);         // 상단
          view2.setSize('100%', '50%');
          view2.setPosition(0, '50%');     // 하단
      } else {
          // 데스크톱: 좌우 분할
          view.setSize('50%', '100%');
          view.setPosition(0, 0);         // 좌측
          view2.setSize('50%', '100%');
          view2.setPosition('50%', 0);     // 우측
      }

      // 배경 메시 추가 (환경 표시용)
      const addMeshesToScene = (scene, count = 100) => {
          const geometry = new RedGPU.Primitive.Sphere(redGPUContext);
          const material = new RedGPU.Material.ColorMaterial(redGPUContext);

          for (let i = 0; i < count; i++) {
              const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

              mesh.setPosition(
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50
              );

              scene.addChild(mesh);
          }
      };

      addMeshesToScene(scene, 100);

      const renderer = new RedGPU.Renderer(redGPUContext);
      const render = (time) => {
          // 타겟 메시를 원형 경로로 이동하고 중앙을 바라봄
          const t = time * 0.001;
          const radius = 20;
          targetMesh.x = Math.sin(t * 0.5) * radius;
          targetMesh.z = Math.cos(t * 0.5) * radius;
          targetMesh.y = Math.sin(t * 0.3) * 5; // 위아래로도 움직임

          // 타겟이 원점을 바라봄
          targetMesh.lookAt(0, 0, 0);
      };
      renderer.start(redGPUContext, render);

      renderTestPane(redGPUContext, controller);
  },
  (failReason) => {
      console.error('초기화 실패:', failReason);
      const errorMessage = document.createElement('div');
      errorMessage.innerHTML = failReason;
      document.body.appendChild(errorMessage);
  }
);
const renderTestPane = async (redGPUContext, controller) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {
        setDebugButtons
    } = await import("../../../exampleHelper/createExample/panes/index.js");

    setDebugButtons(redGPUContext);
    const pane = new Pane();

    // FollowController 설정
    const followFolder = pane.addFolder({
        title: 'Follow Controller',
        expanded: true,
    });

    // 거리 및 높이
    followFolder.addBinding(controller, 'distance', {
        min: 1,
        max: 50,
        step: 0.5,
    });
    followFolder.addBinding(controller, 'delayDistance', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    followFolder.addBinding(controller, 'height',{
        min: -10,
        max: 20,
        step: 0.5,
    });
    followFolder.addBinding(controller, 'delayHeight', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });
    followFolder.addBinding(controller, 'delay', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    // 회전 각도
    const rotationFolder = pane.addFolder({
        title: 'Camera Rotation',
        expanded: true,
    });

    rotationFolder.addBinding(controller, 'pan', {
        min: -180,
        max: 180,
        step: 1,
    });
    rotationFolder.addBinding(controller, 'delayPan', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    rotationFolder.addBinding(controller, 'tilt', {
        min: -89,
        max: 89,
        step: 1,
    });
    rotationFolder.addBinding(controller, 'delayTilt', {
        min: 0.01,
        max: 1,
        step: 0.01,
    });

    rotationFolder.addBinding(controller, 'followTargetRotation', {
        label: 'Follow Target Rotation',
    });

    // 타겟 오프셋
    const offsetFolder = pane.addFolder({
        title: 'Target Look At Offset',
        expanded: true,
    });

    offsetFolder.addBinding(controller, 'targetOffsetX', {
        label: 'Offset X',
        min: -5,
        max: 5,
        step: 0.1,
    });

    offsetFolder.addBinding(controller, 'targetOffsetY', {
        label: 'Offset Y',
        min: -5,
        max: 5,
        step: 0.1,
    });

    offsetFolder.addBinding(controller, 'targetOffsetZ', {
        label: 'Offset Z',
        min: -5,
        max: 5,
        step: 0.1,
    });

    offsetFolder.addButton({
        title: 'Reset Offset',
    }).on('click', () => {
        controller.setTargetOffset(0, 0, 0);
        pane.refresh();
    });

    // 프리셋 버튼
    const presetFolder = pane.addFolder({
        title: 'Presets',
    });

    presetFolder.addButton({
        title: 'Reset All Delays',
    }).on('click', () => {
        controller.delay = 1;
        controller.delayDistance = 0.1;
        controller.delayHeight = 0.1;
        controller.delayPan = 0.1;
        controller.delayTilt = 0.1;
        pane.refresh();
    });

    presetFolder.addButton({
        title: 'Behind View',
    }).on('click', () => {
        controller.distance = 15;
        controller.height = 5;
        controller.pan = 0;
        controller.tilt = 20;
        controller.setTargetOffset(0, 0, 0);
        pane.refresh();
    });

    presetFolder.addButton({
        title: 'Top View',
    }).on('click', () => {
        controller.distance = 20;
        controller.height = 20;
        controller.pan = 0;
        controller.tilt = 60;
        controller.setTargetOffset(0, 0, 0);
        pane.refresh();
    });

    presetFolder.addButton({
        title: 'Side View',
    }).on('click', () => {
        controller.distance = 15;
        controller.height = 5;
        controller.pan = 90;
        controller.tilt = 10;
        controller.setTargetOffset(0, 0, 0);
        pane.refresh();
    });

};
