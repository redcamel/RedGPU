import * as RedGPU from "../../../../dist/index.js";

// 1. 캔버스 생성 및 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. RedGPU 초기화
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 카메라 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 10;
        controller.maxTilt = 0
        controller.distance = 300

        // 씬 및 뷰 설정
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 라이트 설정
        const light = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(light);

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
        view.ibl = ibl;
        view.skybox = newSkybox;
        view.grid = true;

        // 기본 머티리얼 생성 (초기 테스트용)
        const texture = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );
        const material = new RedGPU.Material.PhongMaterial(redGPUContext);
        material.diffuseTexture = texture;

        // 테스트 씬 생성 실행
        createTest(redGPUContext, scene, material);

        // 렌더러 설정 및 시작
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = (time) => {
            // 매 프레임 실행될 로직
            if (scene.children[0]) {
                // scene.children[0].rotationY += 0.001;
            }
        };
        renderer.start(redGPUContext, render);
    },
    (failReason) => {
        // 초기화 실패 처리
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * 테스트 씬 생성 및 InstancingMesh 설정 함수
 */
async function createTest(context, scene, material) {
    // UI 라이브러리(Tweakpane) 동적 로드
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js");
    setDebugButtons(context);

    // 인스턴스 수 설정 (모바일/PC 구분)
    const maxInstanceCount = 20000;
    const instanceCount = 20000;

    // GLTF 모델 로드
    const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf';
    new RedGPU.GLTFLoader(context, url, (result) => {
        console.log(result.resultMesh);

        // GLTF 구조에서 대상 메쉬 추출
        const mesh = result.resultMesh.children[0];

        // LOD별 머티리얼 준비
        const materialLOD0 = new RedGPU.Material.PhongMaterial(context, '#ff0000');
        const materialLOD1 = new RedGPU.Material.PhongMaterial(context, '#00ff00');
        const materialLOD2 = new RedGPU.Material.PhongMaterial(context, '#0000ff');

        // InstancingMesh용 기본 머티리얼 재설정
        material = new RedGPU.Material.PhongMaterial(context);

        // InstancingMesh 생성 및 씬 추가
        const instancingMesh = new RedGPU.Display.InstancingMesh(
            context,
            maxInstanceCount,
            instanceCount,
            mesh.geometry,
            // new RedGPU.Primitive.Sphere(context, 0.5, 8, 8, 8),
            mesh.material
        );
        scene.addChild(instancingMesh);

        // 인스턴스 배치 초기화 함수
        const initializeInstances = () => {
            const radius = 1000;

            for (let i = 0; i < instancingMesh.instanceCount; i++) {
                if (instancingMesh.instanceChildren[i].x === 0) {
                    const angle = Math.random() * Math.PI * 2; // 0 ~ 2π
                    const randomValue = Math.random();
                    const distance = Math.sqrt(randomValue) * radius; // 0 ~ radius

                    const x = Math.cos(angle) * distance;
                    const z = Math.sin(angle) * distance;

                    instancingMesh.instanceChildren[i].setPosition(x, 0, z);
                    instancingMesh.instanceChildren[i].setScale(Math.random() * 6);
                }
            }
        };
        initializeInstances();

        // --- Tweakpane UI 설정 ---
        const pane = new Pane();

        // 1. 기본 정보 표시
        const baseInfo = {
            baseMesh: "Base Mesh",
        };
        pane.addBinding(baseInfo, "baseMesh", {
            label: "Base Mesh",
            readonly: true,
        });

        // 2. LOD 관리 유틸리티 함수
        const hasLOD = (distance) => {
            return instancingMesh.LODManager.LODList.some(lod => lod.distance === distance);
        };

        const addLODIfNeeded = (distance, createGeometry, material) => {
            if (!hasLOD(distance)) {
                instancingMesh.LODManager.addLOD(distance, createGeometry(), material);
            }
        };

        const removeLODIfExists = (distance) => {
            if (hasLOD(distance)) {
                instancingMesh.LODManager.removeLOD(distance);
            }
        };

        // 3. LOD 상태 및 제어
        const distanceLOD0 = 500;
        const distanceLOD1 = 750;
        const distanceLOD2 = 1000;

        const lodState = {
            [`lod${distanceLOD0}`]: true,
            [`lod${distanceLOD1}`]: true,
            [`lod${distanceLOD2}`]: true,
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

        // 초기 LOD 설정
        addLODIfNeeded(distanceLOD0, () => mesh.geometry, materialLOD0);
        addLODIfNeeded(distanceLOD1, () => new RedGPU.Primitive.Box(context), materialLOD1);
        addLODIfNeeded(distanceLOD2, () => new RedGPU.Primitive.Ground(context), materialLOD2);
        updateLODInfo();

        // LOD 토글 컨트롤 추가
        [
            {dist: distanceLOD0, label: `LOD ${distanceLOD0}`, createGeo: () => mesh.geometry, mat: materialLOD0},
            {
                dist: distanceLOD1,
                label: `LOD ${distanceLOD1}`,
                createGeo: () => new RedGPU.Primitive.Box(context),
                mat: materialLOD1
            },
            {
                dist: distanceLOD2,
                label: `LOD ${distanceLOD2}`,
                createGeo: () => new RedGPU.Primitive.Ground(context),
                mat: materialLOD2
            }
        ].forEach(config => {
            pane.addBinding(lodState, `lod${config.dist}`, {label: config.label})
                .on('change', (ev) => {
                    if (ev.value) {
                        addLODIfNeeded(config.dist, config.createGeo, config.mat);
                    } else {
                        removeLODIfExists(config.dist);
                    }
                    updateLODInfo();
                });
        });

        // LOD 정보 표시
        pane.addBinding(lodState, 'lodCount', {
            label: 'LOD Count',
            readonly: true,
            format: (v) => `${Math.floor(v).toLocaleString()}`
        });
        pane.addBinding(lodState, 'lodDistances', {
            label: 'LOD Distances',
            readonly: true,
        });

        // 인스턴스 개수 제어
        pane.addBinding(instancingMesh, 'instanceCount', {min: 100, max: maxInstanceCount, step: 1})
            .on('change', initializeInstances);
        pane.addBinding({maxInstanceCount: maxInstanceCount}, 'maxInstanceCount', {
            readonly: true,
            format: (v) => `${Math.floor(v).toLocaleString()}`
        });
    });
}