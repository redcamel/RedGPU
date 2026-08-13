import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js";

/**
 * [KO] Landscape Basic LOD 테스트 예제
 * [EN] Landscape Basic LOD Test Example
 *
 * [KO] 신규 Landscape 지형 시스템의 기본 LOD 처리 및 거리 기반 시각화 검증 예제입니다.
 * [EN] Basic LOD processing and distance-based visualization test example for the new Landscape terrain system.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 설정 (FreeController - 자유 관람 및 탐색)
        const controller = new RedGPU.Camera.FreeController(redGPUContext);
        controller.x = 0;
        controller.y = 300;
        controller.z = 800;
        controller.moveSpeed = 3000;

        // 2. Scene & View3D 초기화
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. 태양 광원 (Directional Light)
        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.elevation = 45;
        directionalLight.azimuth = 45;
        directionalLight.intensity = 1.5;
        scene.lightManager.addDirectionalLight(directionalLight);

        // 4. 신규 Landscape 인스턴스 생성 (동적 gridSize 및 lodCount 수용)
        const landscape = new RedGPU.Display.Landscape(redGPUContext, {
            gridSize: 64,
            lodCount: 4,
            wireframe: true,
            debugLODColorMode: true
        });

        if (scene.addLandscape) {
            scene.addLandscape(landscape);
        } else {
            scene.addChild(landscape);
        }

        // 5. 예제 조작 GUI 패널 구축
        const exampleHelper = new RedGPUExampleHelper(redGPUContext);
        exampleHelper.init();

        const gui = exampleHelper.gui;
        if (gui && landscape) {
            const landscapeFolder = gui.addFolder('Landscape Test Panel');
            landscapeFolder.open();

            if ('wireframe' in landscape) {
                landscapeFolder.add(landscape, 'wireframe').name('Wireframe Mode');
            }
            if ('debugLODColorMode' in landscape) {
                landscapeFolder.add(landscape, 'debugLODColorMode').name('LOD Color Overlay');
            }
        }

        // 6. 실시간 HUD 데이터 모니터링 패널
        const hud = document.createElement('div');
        Object.assign(hud.style, {
            position: 'fixed',
            top: '16px',
            left: '12px',
            padding: '14px 18px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.8',
            zIndex: '99999',
            minWidth: '280px'
        });

        hud.innerHTML = `
            <div style="font-weight: bold; color: #38bdf8; font-size: 14px; margin-bottom: 6px;">
                🏞️ Landscape Basic Test Panel
            </div>
            <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
                <b>LOD Level Status:</b><br>
                🟢 <span style="color:#00ff00">LOD 0</span>: <span id="countLOD0" style="color:#fff; font-weight:bold;">-</span><br>
                🟡 <span style="color:#ffff00">LOD 1</span>: <span id="countLOD1" style="color:#fff; font-weight:bold;">-</span><br>
                🟠 <span style="color:#ff8800">LOD 2</span>: <span id="countLOD2" style="color:#fff; font-weight:bold;">-</span><br>
                🔴 <span style="color:#ff0000">LOD 3</span>: <span id="countLOD3" style="color:#fff; font-weight:bold;">-</span>
            </div>
            <div id="statInfo" style="margin-top: 10px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #f8fafc;"></div>
        `;
        document.body.appendChild(hud);

        const statInfo = document.getElementById('statInfo');

        // 7. 렌더러 루프 및 매 프레임 위치 및 상태 추적
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            if (landscape && typeof landscape.update === 'function') {
                landscape.update(controller);
            }

            if (statInfo) {
                statInfo.textContent = `Cam Pos: [X: ${Math.round(controller.x)}, Y: ${Math.round(controller.y)}, Z: ${Math.round(controller.z)}]`;
            }
        });
    }
);

