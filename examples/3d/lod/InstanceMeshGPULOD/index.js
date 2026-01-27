import * as RedGPU from "../../../../dist/index.js?t=1769512737237";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const light = new RedGPU.Light.DirectionalLight()
        scene.lightManager.addDirectionalLight(light)

        const texture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        const skyboxTexture = new RedGPU.Resource.CubeTexture(
            redGPUContext,
            [
                "../../../assets/skybox/px.jpg", // Positive X
                "../../../assets/skybox/nx.jpg", // Negative X
                "../../../assets/skybox/py.jpg", // Positive Y
                "../../../assets/skybox/ny.jpg", // Negative Y
                "../../../assets/skybox/pz.jpg", // Positive Z
                "../../../assets/skybox/nz.jpg", // Negative Z
            ]
        );
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, skyboxTexture);
        view.grid = true

        createTest(redGPUContext, scene, material);

        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // Logic for every frame goes here
            // 매 프레임마다 실행될 로직 추가
            if (scene.children[0]) {
                // scene.children[0].rotationY += 0.001;
            }
        };
        renderer.start(redGPUContext, render);

    },
    (failReason) => {
        // Show the error if initialization fails
        // 초기화 실패 시 에러 표시
        console.error('초기화 실패:', failReason);

        // Create an element for the error message
        // 에러 메시지 표시용 요소 생성
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;

        // Append the error message to the document body
        // 문서 본문에 에러 메시지 추가
        document.body.appendChild(errorMessage);
    }
);

async function createTest(redGPUContext, scene, material) {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769512737237');

    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769512737237");
    setDebugButtons(RedGPU, redGPUContext);

    const maxInstanceCount = redGPUContext.detector.isMobile ? 100000 : RedGPU.Display.InstancingMesh.getLimitSize();
    const instanceCount = redGPUContext.detector.isMobile ? 20000 : 200000;
    const instancingMesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxInstanceCount,
        instanceCount,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 32, 32, 32),
        material
    );

    scene.addChild(instancingMesh);

    const initializeInstances = () => {
        for (let i = 0; i < instancingMesh.instanceCount; i++) {
            if (instancingMesh.instanceChildren[i].x === 0) {
                instancingMesh.instanceChildren[i].setPosition(
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                    Math.random() * 500 - 250,
                );
                instancingMesh.instanceChildren[i].setScale(Math.random() * 2 + 1);
                instancingMesh.instanceChildren[i].setRotation(
                    Math.random() * 360,
                    Math.random() * 360,
                    Math.random() * 360
                );
            }

            // mesh.instanceChildren[i].opacity = Math.random();
        }
    };

    initializeInstances();

    const pane = new Pane();

    // ---- 기본 메쉬 (LOD 0) 표시용 - 토글 불가 ----
    const baseInfo = {
        baseMesh: "Base Mesh (Sphere 32x32)",
    };
    pane.addBinding(baseInfo, "baseMesh", {
        label: "Base Mesh",
        readonly: true,
    });

    // ---- LOD 토글용 유틸 ----
    const hasLOD = (distance) => {
        return instancingMesh.LODManager.LODList.some(lod => lod.distance === distance);
    };

    const addLODIfNeeded = (distance, createGeometry) => {
        if (!hasLOD(distance)) {
            instancingMesh.LODManager.addLOD(distance, createGeometry());
        }
    };

    const removeLODIfExists = (distance) => {
        if (hasLOD(distance)) {
            instancingMesh.LODManager.removeLOD(distance);
        }
    };

    const lodState = {
        lod25: true,
        lod50: true,
        lod70: true,
        lodCount: 0,
        lodDistances: '',
    };

    const updateLODInfo = () => {
        const list = instancingMesh.LODManager.LODList;
        lodState.lodCount = list.length;
        lodState.lodDistances = list
            .map(lod => lod.distance)
            .sort((a, b) => a - b)
            .join(', ');
    };

    // 초기 LOD 3개 활성화
    addLODIfNeeded(25, () => new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8));
    addLODIfNeeded(50, () => new RedGPU.Primitive.Box(redGPUContext));
    addLODIfNeeded(70, () => new RedGPU.Primitive.Circle(redGPUContext, 0.5));
    updateLODInfo();

    // 25 LOD 토글
    pane.addBinding(lodState, 'lod25', {label: 'LOD 25 (Sphere 8x8)'})
        .on('change', (ev) => {
            if (ev.value) {
                addLODIfNeeded(25, () => new RedGPU.Primitive.Sphere(redGPUContext, 0.5, 8, 8, 8));
            } else {
                removeLODIfExists(25);
            }
            updateLODInfo();
        });

    // 50 LOD 토글
    pane.addBinding(lodState, 'lod50', {label: 'LOD 50 (Box)'})
        .on('change', (ev) => {
            if (ev.value) {
                addLODIfNeeded(50, () => new RedGPU.Primitive.Box(redGPUContext));
            } else {
                removeLODIfExists(50);
            }
            updateLODInfo();
        });

    // 70 LOD 토글
    pane.addBinding(lodState, 'lod70', {label: 'LOD 70 (Circle 0.5)'})
        .on('change', (ev) => {
            if (ev.value) {
                addLODIfNeeded(70, () => new RedGPU.Primitive.Circle(redGPUContext, 0.5));
            } else {
                removeLODIfExists(70);
            }
            updateLODInfo();
        });

    // 현재 LOD 상태 표시
    pane.addBinding(lodState, 'lodCount', {
        label: 'LOD Count',
        readonly: true,
        format: (v) => `${Math.floor(v).toLocaleString()}`
    });
    pane.addBinding(lodState, 'lodDistances', {
        label: 'LOD Distances',
        readonly: true,
    });

    pane.addBinding(instancingMesh, 'instanceCount', {min: 100, max: maxInstanceCount, step: 1})
        .on('change', initializeInstances);
    pane.addBinding({maxInstanceCount: maxInstanceCount}, 'maxInstanceCount', {
        readonly: true,
        format: (v) => `${Math.floor(v).toLocaleString()}`
    });
}
