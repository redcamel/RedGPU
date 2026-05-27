import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - ToneMappingManager');

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Lifecycle & Properties',
    (runner) => {
        runner.defineTest('Constructor & Initial State', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                
                const checkContext = manager.redGPUContext === redGPUContext;
                const checkMode = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;
                const checkContrast = manager.contrast === 1.0;
                const checkBrightness = manager.brightness === 0.0;
                const checkInitialEffect = manager.toneMapping !== undefined;
                
                redGPUContext.destroy();
                run(checkContext && checkMode && checkContrast && checkBrightness && checkInitialEffect);
            });
        }, true);

        runner.defineTest('Mode Switching (Automatic Cleanup)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                
                // 1. 초기 인스턴스 확보
                const effect1 = manager.toneMapping;
                
                // 2. 모드 변경 (내부적으로 clear() 호출됨)
                manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                
                // 3. 새로운 인스턴스 생성됨을 확인
                const effect2 = manager.toneMapping;
                
                const checkModeChange = manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                const checkInstanceChange = effect1 !== effect2;
                
                redGPUContext.destroy();
                run(checkModeChange && checkInstanceChange);
            });
        }, true);

        runner.defineTest('Property Synchronization (Contrast/Brightness)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                
                // 생성 전 설정
                manager.contrast = 1.2;
                manager.brightness = -0.1;
                
                const effect = manager.toneMapping;
                const checkSync1 = effect.contrast === 1.2 && effect.brightness === -0.1;
                
                // 생성 후 실시간 변경 테스트
                manager.contrast = 1.8;
                manager.brightness = 0.5;
                const checkSync2 = effect.contrast === 1.8 && effect.brightness === 0.5;
                
                redGPUContext.destroy();
                run(checkSync1 && checkSync2);
            });
        }, true);

        runner.defineTest('Manual clear()', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                
                const effect1 = manager.toneMapping;
                manager.clear();
                const effect2 = manager.toneMapping; // 게터 호출로 새로 생성됨
                
                redGPUContext.destroy();
                run(effect1 !== effect2);
            });
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.ToneMapping.ToneMappingManager - Rendering',
    (runner) => {
        runner.defineTest('Render Delegation Path', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const manager = new RedGPU.ToneMapping.ToneMappingManager(redGPUContext);
                const scene = new RedGPU.Display.Scene();
                const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
                const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
                
                // 더미 텍스처 정보 생성
                const mockTextureInfo = {
                    texture: redGPUContext.gpuDevice.createTexture({
                        size: [4, 4, 1],
                        format: 'rgba8unorm',
                        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
                    }),
                    textureView: null
                };

                try {
                    const result = manager.render(view, 4, 4, mockTextureInfo);
                    const pass = result && result.texture instanceof GPUTexture;
                    redGPUContext.destroy();
                    run(pass);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);