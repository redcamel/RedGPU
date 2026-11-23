import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Light & LightManager', () => {
    // ABaseLight, Ambient/Directional/Point/SpotLight 속성 및 LightManager 추가·제거·제한 검증
    test('validates ABaseLight, AmbientLight, DirectionalLight, PointLight, SpotLight, and LightManager', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // 추상 클래스 ABaseLight 검증용 테스트 서브클래스
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

            // 1. ABaseLight 기본 속성 및 NaN/음수/잘못된 타입 예외 검증
            const baseColor = new RedGPU.Color.ColorRGB(100, 100, 100);
            const baseLight = new TestLight(baseColor, 2.5);
            const newColor = new RedGPU.Color.ColorRGB(255, 0, 0);
            baseLight.color = newColor;
            baseLight.intensityMultiplier = 5;
            baseLight.enableDebugger = true;

            const baseOk =
                baseLight.color === newColor &&
                baseLight.intensityMultiplier === 5 &&
                baseLight.enableDebugger === true &&
                expectThrows(() => {
                    baseLight.color = null;
                }) &&
                expectThrows(() => {
                    baseLight.color = '#ffffff';
                }) &&
                expectThrows(() => {
                    baseLight.intensityMultiplier = NaN;
                }) &&
                expectThrows(() => {
                    baseLight.intensityMultiplier = -0.1;
                });

            // 2. AmbientLight 기본값 및 lux 설정 검증
            const ambientDefault = new RedGPU.Light.AmbientLight();
            const ambientCustom = new RedGPU.Light.AmbientLight('#fff', 500);
            ambientCustom.lux = 1000;
            const ambientOk =
                ambientDefault.color.hex === '#ADD8E6' &&
                ambientDefault.lux === 50 &&
                ambientCustom.lux === 1000;

            // 3. DirectionalLight 방향 벡터, 구면 좌표(elevation/azimuth) 및 개별 축 Setter 검증
            const dirLight = new RedGPU.Light.DirectionalLight([-1, -2, -3], '#ffffff', 50000);
            const dirInitOk =
                dirLight.direction[0] === -1 &&
                dirLight.direction[1] === -2 &&
                dirLight.direction[2] === -3 &&
                dirLight.lux === 50000;
            dirLight.elevation = 90;
            dirLight.azimuth = 0;
            const dirSphereOk =
                Math.abs(dirLight.direction[0]) < 1e-4 &&
                dirLight.direction[1] === -1 &&
                Math.abs(dirLight.direction[2]) < 1e-4;
            dirLight.directionX = -1;
            dirLight.directionY = 0;
            dirLight.directionZ = 0;
            const dirCompOk =
                dirLight.direction[0] === -1 &&
                dirLight.direction[1] === 0 &&
                dirLight.direction[2] === 0;

            // 4. PointLight 위치, 반경(radius), 루멘(lumen) 검증
            const pointLight = new RedGPU.Light.PointLight('#ffffff', 2000);
            pointLight.setPosition(10, 20, 30);
            pointLight.radius = 50;
            const pointOk1 =
                pointLight.x === 10 &&
                pointLight.y === 20 &&
                pointLight.z === 30 &&
                pointLight.radius === 50 &&
                pointLight.lumen === 2000;
            pointLight.setPosition([100, 200, 300]);
            const pointOk2 =
                pointLight.position[0] === 100 &&
                pointLight.position[1] === 200 &&
                pointLight.position[2] === 300;

            // 5. SpotLight cutoff 각도 및 lookAt 방향 검증
            const spotLight = new RedGPU.Light.SpotLight('#ffffff');
            spotLight.innerCutoff = 10;
            spotLight.outerCutoff = 30;
            spotLight.setPosition(0, 10, 0);
            spotLight.lookAt(0, 0, 0);
            const spotOk =
                spotLight.innerCutoff === 10 &&
                spotLight.outerCutoff === 30 &&
                spotLight.direction[1] === -1;

            // 6. LightManager 추가·개별 삭제·전체 삭제 및 최대 개수 초과 예외 검증
            const canvas = document.createElement('canvas');
            const managerOk = await new Promise<boolean>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
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

                            // 방향성 광원 최대 허용 개수 초과 시 예외 발생 검증
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

                            ctx.destroy();
                            resolve(addedOk && removedOk && nullAmbientThrows && limitThrows && removeAllOk);
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });

            return {
                baseOk,
                ambientOk,
                dirInitOk,
                dirSphereOk,
                dirCompOk,
                pointOk: pointOk1 && pointOk2,
                spotOk,
                managerOk
            };
        });

        expect(result).toEqual({
            baseOk: true,
            ambientOk: true,
            dirInitOk: true,
            dirSphereOk: true,
            dirCompOk: true,
            pointOk: true,
            spotOk: true,
            managerOk: true
        });
    });
});
