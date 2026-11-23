import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Light & LightManager', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // ABaseLight 기본 속성, Setter 갱신 및 NaN/음수/잘못된 color 타입 차단 검증
    test('validates ABaseLight properties and rejects invalid color or intensity', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;

            class TestLight extends RedGPU.Light.Core.ABaseLight {
                constructor(color?: any, intensity?: number) {
                    super(color, intensity);
                }
            }

            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };
            const baseColor = new RedGPU.Color.ColorRGB(100, 100, 100);
            const light = new TestLight(baseColor, 2.5);
            const newColor = new RedGPU.Color.ColorRGB(255, 0, 0);
            light.color = newColor;
            light.intensityMultiplier = 5;
            light.enableDebugger = true;

            return (
                light.color === newColor &&
                light.intensityMultiplier === 5 &&
                light.enableDebugger === true &&
                expectThrows(() => (light.color = null)) &&
                expectThrows(() => (light.color = '#ffffff')) &&
                expectThrows(() => (light.intensityMultiplier = NaN)) &&
                expectThrows(() => (light.intensityMultiplier = -0.1))
            );
        });

        expect(ok).toBe(true);
    });

    // AmbientLight 기본 색상/lux 및 사용자 지정 lux 설정 검증
    test('validates AmbientLight defaults and lux setter', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const def = new RedGPU.Light.AmbientLight();
            const custom = new RedGPU.Light.AmbientLight('#fff', 500);
            custom.lux = 1000;
            return def.color.hex === '#ADD8E6' && def.lux === 50 && custom.lux === 1000;
        });

        expect(ok).toBe(true);
    });

    // DirectionalLight 방향 벡터, 구면 좌표(elevation/azimuth) 및 개별 축 Setter 검증
    test('validates DirectionalLight direction, spherical coordinates, and axis setters', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const light = new RedGPU.Light.DirectionalLight([-1, -2, -3], '#ffffff', 50000);
            const initOk =
                light.direction[0] === -1 &&
                light.direction[1] === -2 &&
                light.direction[2] === -3 &&
                light.lux === 50000;

            light.elevation = 90;
            light.azimuth = 0;
            const sphereOk =
                Math.abs(light.direction[0]) < 1e-4 &&
                light.direction[1] === -1 &&
                Math.abs(light.direction[2]) < 1e-4;

            light.directionX = -1;
            light.directionY = 0;
            light.directionZ = 0;
            const compOk = light.direction[0] === -1 && light.direction[1] === 0 && light.direction[2] === 0;
            return initOk && sphereOk && compOk;
        });

        expect(ok).toBe(true);
    });

    // PointLight 위치(좌표/배열), 반경(radius), 루멘(lumen) 및 SpotLight cutoff/lookAt 검증
    test('validates PointLight position/radius/lumen and SpotLight cutoff/lookAt', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const point = new RedGPU.Light.PointLight('#ffffff', 2000);
            point.setPosition(10, 20, 30);
            point.radius = 50;
            const pointOk1 =
                point.x === 10 && point.y === 20 && point.z === 30 && point.radius === 50 && point.lumen === 2000;
            point.setPosition([100, 200, 300]);
            const pointOk2 = point.position[0] === 100 && point.position[1] === 200 && point.position[2] === 300;

            const spot = new RedGPU.Light.SpotLight('#ffffff');
            spot.innerCutoff = 10;
            spot.outerCutoff = 30;
            spot.setPosition(0, 10, 0);
            spot.lookAt(0, 0, 0);
            const spotOk = spot.innerCutoff === 10 && spot.outerCutoff === 30 && spot.direction[1] === -1;
            return pointOk1 && pointOk2 && spotOk;
        });

        expect(ok).toBe(true);
    });

    // LightManager 광원 추가·개별 삭제·일괄 삭제 및 최대 개수 초과·null ambientLight 차단 검증
    test('manages lights and enforces directional light limits in LightManager', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            const scene = new RedGPU.Display.Scene(ctx);
            const manager = scene.lightManager;

            const d1 = new RedGPU.Light.DirectionalLight();
            const p1 = new RedGPU.Light.PointLight();
            const s1 = new RedGPU.Light.SpotLight();
            const a1 = new RedGPU.Light.AmbientLight();

            manager.addDirectionalLight(d1);
            manager.addPointLight(p1);
            manager.addSpotLight(s1);
            manager.ambientLight = a1;
            const addedOk =
                manager.directionalLightCount === 1 &&
                manager.pointLightCount === 1 &&
                manager.spotLightCount === 1 &&
                manager.ambientLight === a1;

            manager.removeDirectionalLight(d1);
            manager.removePointLight(p1);
            manager.removeSpotLight(s1);
            const removedOk =
                manager.directionalLightCount === 0 &&
                manager.pointLightCount === 0 &&
                manager.spotLightCount === 0;

            const nullAmbientThrows = expectThrows(() => {
                manager.ambientLight = null;
            });

            const limit = manager.limitDirectionalLightCount;
            const limitThrows = expectThrows(() => {
                for (let i = 0; i <= limit; i++) {
                    manager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
                }
            });

            manager.addPointLight(new RedGPU.Light.PointLight());
            manager.addSpotLight(new RedGPU.Light.SpotLight());
            manager.removeAllDirectionalLight();
            manager.removeAllPointLight();
            manager.removeAllSpotLight();

            const removeAllOk =
                manager.directionalLightCount === 0 &&
                manager.pointLightCount === 0 &&
                manager.spotLightCount === 0;

            return addedOk && removedOk && nullAmbientThrows && limitThrows && removeAllOk;
        });

        expect(ok).toBe(true);
    });
});
