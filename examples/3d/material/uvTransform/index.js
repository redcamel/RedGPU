import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] UV Transform 예제
 * [EN] UV Transform example
 *
 * [KO] 텍스처 UV 좌표의 오프셋(이동)과 스케일(크기)을 변환하여 스크롤링 및 타일링 효과를 구현하는 방법을 시연합니다.
 * [EN] Demonstrates how to implement scrolling and tiling effects by transforming the offset and scale of texture UV coordinates.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    async (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.tilt = -20;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);


        // 4. [KO] 리소스 및 머티리얼 생성
        // [EN] Create Resources and Materials
        const textureGrid = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
        const textureHTest = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg');
        
        // [KO] 반복 랩핑(Repeat Wrapping)을 위한 샘플러 생성
        // [EN] Create sampler for Repeat Wrapping
        const repeatSampler = new RedGPU.Resource.Sampler(redGPUContext);
        repeatSampler.addressModeU = RedGPU.GPU_ADDRESS_MODE.REPEAT; 
        repeatSampler.addressModeV = RedGPU.GPU_ADDRESS_MODE.REPEAT;

        const materialTop = new RedGPU.Material.BitmapMaterial(redGPUContext, textureGrid);
        materialTop.diffuseTextureSampler = repeatSampler;
        
        const materialBottom = new RedGPU.Material.BitmapMaterial(redGPUContext, textureHTest);
        materialBottom.diffuseTextureSampler = repeatSampler;

        // 5. [KO] 모든 프리미티브 타입별 메시 생성 및 배치
        // [EN] Create and Place Meshes for each Primitive Type
        const rows = [
            [
                { name: 'Box', geo: new RedGPU.Primitive.Box(redGPUContext) },
                { name: 'Capsule', geo: new RedGPU.Primitive.Capsule(redGPUContext) },
                { name: 'Sphere', geo: new RedGPU.Primitive.Sphere(redGPUContext) },
                { name: 'Cylinder', geo: new RedGPU.Primitive.Cylinder(redGPUContext) }
            ],
            [
                { name: 'Cone', geo: new RedGPU.Primitive.Cone(redGPUContext) },
                { name: 'Torus', geo: new RedGPU.Primitive.Torus(redGPUContext, 0.7) },
                { name: 'TorusKnot', geo: new RedGPU.Primitive.TorusKnot(redGPUContext, 0.7, 0.2) },
                { name: 'Plane', geo: new RedGPU.Primitive.Plane(redGPUContext) }
            ],
            [
                { name: 'Ground', geo: new RedGPU.Primitive.Ground(redGPUContext) },
                { name: 'Circle', geo: new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, false) },
                { name: 'Ring', geo: new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 64, 1, 0, Math.PI * 2, false) },
                { name: 'RoundedBox', geo: new RedGPU.Primitive.RoundedBox(redGPUContext) }
            ]
        ];

        // [KO] 일부 프리미티브는 Radial UV 모드를 지원함
        // [EN] Some primitives support Radial UV mode
        const radialGeos = {
            'Circle': new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, true),
            'Ring': new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 64, 1, 0, Math.PI * 2, true),
            'Cylinder': new RedGPU.Primitive.Cylinder(redGPUContext, 1, 1, 1, 32, 1, true, true, 0, Math.PI * 2, true, true),
            'Cone': new RedGPU.Primitive.Cone(redGPUContext, 1, 1, 32, 1, true, 0, Math.PI * 2, true)
        };

        const trioGapX = 2.6;
        const itemGapX = 7.0;
        const rowGapY = 3.5;

        rows.forEach((primitives, rowIndex) => {
            const y = 3.5 - rowIndex * rowGapY;
            const startX = -(primitives.length - 1) * itemGapX / 2;

            primitives.forEach((item, index) => {
                const x = startX + index * itemGapX;
                const isRadialSupported = !!radialGeos[item.name];

                // [KO] 객체 이름 라벨
                // [EN] Object Name Label
                const nameLabel = new RedGPU.Display.TextField3D(redGPUContext);
                nameLabel.text = item.name; nameLabel.worldSize = 0.7; nameLabel.color = '#ffffff';
                nameLabel.setPosition(x, y + 1.2, 0);
                scene.addChild(nameLabel);

                // [KO] 일반(Planar) UV 메시
                // [EN] Planar UV Mesh
                const planarMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, materialTop);
                planarMesh.setPosition(x - trioGapX / 2, y, 0);
                scene.addChild(planarMesh);

                // [KO] 특수(Radial) UV 메시 또는 동일 메시
                // [EN] Radial UV Mesh or same mesh
                const radialMesh = new RedGPU.Display.Mesh(redGPUContext, radialGeos[item.name] || item.geo, materialBottom);
                radialMesh.setPosition(x + trioGapX / 2, y, 0);
                scene.addChild(radialMesh);

                if (isRadialSupported) {
                    const planarLabel = new RedGPU.Display.TextField3D(redGPUContext);
                    planarLabel.text = 'Planar'; planarLabel.worldSize = 0.5; planarLabel.color = '#aaaaaa';
                    planarLabel.setPosition(x - trioGapX / 2, y - 1.1, 0);
                    scene.addChild(planarLabel);

                    const radialLabel = new RedGPU.Display.TextField3D(redGPUContext);
                    radialLabel.text = 'Radial'; radialLabel.worldSize = 0.5; radialLabel.color = '#aaaaaa';
                    radialLabel.setPosition(x + trioGapX / 2, y - 1.1, 0);
                    scene.addChild(radialLabel);
                }
            });
        });

        // 6. [KO] 렌더러 생성 및 애니메이션 루프 시작
        // [EN] Create Renderer and Start Animation Loop
        const renderer = new RedGPU.Renderer();
        const scrollInfo = { autoScroll: true, speedU: 0.001, speedV: 0.002, offsetU: 0, offsetV: 0, scaleU: 1, scaleV: 1 };

        renderer.start(redGPUContext, () => {
            if (scrollInfo.autoScroll) {
                // [KO] 자동 스크롤 오프셋 계산
                // [EN] Calculate Auto Scroll Offset
                scrollInfo.offsetU += scrollInfo.speedU; 
                scrollInfo.offsetV += scrollInfo.speedV;
                
                // [KO] 범위를 벗어나면 보정하여 무한 루프 구현
                // [EN] Normalize to implementation infinite loop
                if (scrollInfo.offsetU > 2) scrollInfo.offsetU -= 4; 
                if (scrollInfo.offsetV > 2) scrollInfo.offsetV -= 4;
                if (scrollInfo.offsetU < -2) scrollInfo.offsetU += 4; 
                if (scrollInfo.offsetV < -2) scrollInfo.offsetV += 4;
                
                // [KO] 머티리얼에 UV 오프셋 적용
                // [EN] Apply UV offset to materials
                materialTop.textureOffset = [scrollInfo.offsetU, scrollInfo.offsetV];
                materialBottom.textureOffset = [scrollInfo.offsetU, scrollInfo.offsetV];
            }
        });

        // 7. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, { materialTop, materialBottom, scrollInfo });
    },
    (failReason) => console.error(failReason)
);

/**
 * [KO] UV 변환 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for UV transform control.
 */
function renderTestPane(redGPUContext, testTarget) {
    const { materialTop, materialBottom, scrollInfo } = testTarget;

    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 자동 스크롤 제어
            // [EN] Auto Scroll Control
            const folderScroll = pane.addFolder({ title: 'Auto Scroll Control' });
            folderScroll.addBinding(scrollInfo, 'autoScroll', { label: 'Use Auto Scroll' });
            folderScroll.addBinding(scrollInfo, 'speedU', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed U' });
            folderScroll.addBinding(scrollInfo, 'speedV', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed V' });

            // [KO] 수동 UV 변환 제어
            // [EN] Manual UV Transform
            const folderManual = pane.addFolder({ title: 'Manual UV Transform' });
            folderManual.addBinding(scrollInfo, 'offsetU', { min: -2, max: 2, step: 0.0001, label: 'Offset U' }).on('change', (ev) => { 
                if (!scrollInfo.autoScroll) { 
                    materialTop.textureOffset = [ev.value, materialTop.textureOffset[1]]; 
                    materialBottom.textureOffset = [ev.value, materialBottom.textureOffset[1]]; 
                } 
            });
            folderManual.addBinding(scrollInfo, 'offsetV', { min: -2, max: 2, step: 0.0001, label: 'Offset V' }).on('change', (ev) => { 
                if (!scrollInfo.autoScroll) { 
                    materialTop.textureOffset = [materialTop.textureOffset[0], ev.value]; 
                    materialBottom.textureOffset = [materialBottom.textureOffset[0], ev.value]; 
                } 
            });
            
            // [KO] UV 스케일(타일링) 제어
            // [EN] UV Scale (Tiling) Control
            folderManual.addBinding(scrollInfo, 'scaleU', { min: 0.1, max: 10, step: 0.0001, label: 'Scale U' }).on('change', (ev) => { 
                materialTop.textureScale = [ev.value, materialTop.textureScale[1]]; 
                materialBottom.textureScale = [ev.value, materialBottom.textureScale[1]]; 
            });
            folderManual.addBinding(scrollInfo, 'scaleV', { min: 0.1, max: 10, step: 0.0001, label: 'Scale V' }).on('change', (ev) => { 
                materialTop.textureScale = [materialTop.textureScale[0], ev.value]; 
                materialBottom.textureScale = [materialBottom.textureScale[0], ev.value]; 
            });

            pane.addButton({ title: 'Reset Transform' }).on('click', () => {
                scrollInfo.offsetU = 0; scrollInfo.offsetV = 0; scrollInfo.scaleU = 1; scrollInfo.scaleV = 1;
                materialTop.textureOffset = [0, 0]; materialBottom.textureOffset = [0, 0];
                materialTop.textureScale = [1, 1]; materialBottom.textureScale = [1, 1];
                pane.refresh();
            });

            // [KO] 자동 스크롤 시 UI 갱신 루프
            // [EN] Refresh UI loop during Auto Scroll
            setInterval(() => { if (scrollInfo.autoScroll) pane.refresh(); }, 100);
        }
    });
}
