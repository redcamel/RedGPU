import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Landscape Basic & SkyAtmosphere 예제
 * [EN] Landscape Basic & SkyAtmosphere example
 *
 * [KO] 신규 Landscape 지형 시스템 개발을 위한 SkyAtmosphere 기반 기본 3D 씬 예제입니다.
 * [EN] Basic 3D scene example with SkyAtmosphere for developing the new Landscape terrain system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 설정 (FreeController - 6자유도 자유 탐색)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 150;
        controller.z = 300;
        controller.moveSpeed = 5000;

        // 2. Scene & View3D 초기화
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 태양 광원 (Directional Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 25;
        directionalLight.azimuth = 45;
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. SkyAtmosphere (스카이 아트모스피어) 생성 및 바인딩
        const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
        view.skyAtmosphere = skyAtmosphere;

        // 5. Landscape 인스턴스 초기화 (10km x 10km, maxLOD 5)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            worldSize: 10000.0,
            chunkSize: 64.0,
            maxLOD: 5
        });
        landscape.meshes.forEach(mesh => scene.addChild(mesh));

        // 6. HUD 상태 창 생성
        const hud = document.createElement('div');
        Object.assign(hud.style, {
            position: 'fixed', top: '100px', left: '12px', bottom: 'auto',
            padding: '12px 18px',
            background: 'rgba(15,23,42,0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.7',
            pointerEvents: 'none',
            zIndex: '9999'
        });
        document.body.appendChild(hud);

        // 7. 렌더러 시작 및 매 프레임 LOD 갱신
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 카메라 위치로 Landscape LOD 계산 업데이트 (GC-Free)
            landscape.update([controller.x, controller.y, controller.z]);

            // HUD UI 정보 갱신 (LOD 레벨별 디버그 색상 범례 포함)
            hud.innerHTML = `
                <b style="color:#38bdf8;">[Landscape Dynamic LOD Visualizer]</b><br/>
                - Cam Pos : [${controller.x.toFixed(1)}, ${controller.y.toFixed(1)}, ${controller.z.toFixed(1)}]<br/>
                - Active Chunks : <b style="color:#facc15;">${landscape.lodManager.activeChunkCount}</b> / ${landscape.lodManager.maxChunks}<br/>
                - World Size : ${landscape.lodManager.worldSize}m | Max LOD: ${landscape.lodManager.maxLOD}<br/>
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.15); margin:6px 0;"/>
                <b>LOD Level Color Legend:</b><br/>
                <span style="color:#ff3333;">■ LOD 0 (High)</span> | 
                <span style="color:#ff9933;">■ LOD 1</span> | 
                <span style="color:#ffff33;">■ LOD 2</span><br/>
                <span style="color:#33ff33;">■ LOD 3</span> | 
                <span style="color:#3399ff;">■ LOD 4</span> | 
                <span style="color:#cc33ff;">■ LOD 5 (Low)</span>
            `;
        });

        // 8. GUI 컨트롤 설정
        renderTestPane(view, skyAtmosphere, directionalLight, landscape);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
    }
);

const renderTestPane = (targetView, skyAtmosphere, sunSource, landscape) => {
    new RedGPUExampleHelper(targetView.redGPUContext, {
        gui: (pane) => {
            // -------------------------------------------------------------------------
            // 0. Landscape Settings
            // -------------------------------------------------------------------------
            const f_land = pane.addFolder({title: 'Landscape LOD System', expanded: true});
            f_land.addBinding(landscape.lodManager, 'worldSize', {min: 1000, max: 50000, step: 500});
            f_land.addBinding(landscape.lodManager, 'chunkSize', {min: 16, max: 256, step: 16});
            f_land.addBinding(landscape.lodManager, 'maxLOD', {min: 1, max: 8, step: 1});
            f_land.addBinding(landscape.lodManager, 'lodDistanceRatio', {min: 0.5, max: 10.0, step: 0.1});

            // -------------------------------------------------------------------------
            // FreeController Settings
            // -------------------------------------------------------------------------
            const f_cam = pane.addFolder({title: 'FreeController (Camera)', expanded: true});
            f_cam.addBinding(targetView.camera, 'moveSpeed', {min: 100, max: 20000, step: 100});

            // -------------------------------------------------------------------------
            // 1. Sun (Directional Light)
            // -------------------------------------------------------------------------
            const f_sun = pane.addFolder({title: 'Sun (DirectionalLight)', expanded: false});
            f_sun.addBinding(sunSource, 'elevation', {min: -90, max: 90, step: 0.1});
            f_sun.addBinding(sunSource, 'azimuth', {min: -360, max: 360, step: 0.1});
            f_sun.addBinding(sunSource, 'intensity', {min: 0, max: 5, step: 0.1});

            // -------------------------------------------------------------------------
            // 2. SkyAtmosphere
            // -------------------------------------------------------------------------
            const f_atmo = pane.addFolder({title: 'SkyAtmosphere', expanded: false});
            f_atmo.addBinding(skyAtmosphere, 'sunSize', {min: 0.01, max: 10, step: 0.01});
            f_atmo.addBinding(skyAtmosphere, 'sunLimbDarkening', {min: 0, max: 10, step: 0.01});

            // Clouds
            const f_clouds = f_atmo.addFolder({title: 'Clouds', expanded: true});
            f_clouds.addBinding(skyAtmosphere, 'cloudCoverage', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudDensity', {min: 0, max: 1, step: 0.01});
            f_clouds.addBinding(skyAtmosphere, 'cloudHeight', {min: 0.1, max: 20, step: 0.1});
            f_clouds.addBinding(skyAtmosphere, 'cloudTimeMultiplier', {min: -10000, max: 10000, step: 0.01});
        }
    });
};
