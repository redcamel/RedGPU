import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Camera.OrbitController (Gimbal Lock Regression)', () => {
    // tilt = ±90° 극점과 연속 pan 회전에서도 유한한 정규직교 viewMatrix 유지 검증
    test('maintains orthonormal finite viewMatrix at tilt = ±90° across continuous pan angles', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const scene = new RedGPU.Display.Scene();
                            const controller = new RedGPU.Camera.OrbitController(ctx);
                            const view = new RedGPU.Display.View3D(ctx, scene, controller);

                            // 보간 계수를 작게 설정해 목표 pan/tilt에 즉시 수렴하도록 구성
                            controller.distance = 10;
                            controller.rotationInterpolation = 0.0001;
                            controller.distanceInterpolation = 0.0001;

                            // viewMatrix의 NaN/Infinity 부재 및 상위 3x3 회전 행렬의 정규직교성 검증
                            const checkOrthonormal = (m: Float32Array) => {
                                for (let i = 0; i < 16; i++) {
                                    if (!Number.isFinite(m[i])) return false;
                                }
                                // 열 우선(Column-major) viewMatrix의 기저 행 벡터(Right, Up, Forward) 추출
                                const rx = m[0], ry = m[4], rz = m[8];
                                const ux = m[1], uy = m[5], uz = m[9];
                                const fx = m[2], fy = m[6], fz = m[10];

                                const lenR = Math.hypot(rx, ry, rz);
                                const lenU = Math.hypot(ux, uy, uz);
                                const lenF = Math.hypot(fx, fy, fz);
                                const dotRU = rx * ux + ry * uy + rz * uz;
                                const dotRF = rx * fx + ry * fy + rz * fz;
                                const dotUF = ux * fx + uy * fy + uz * fz;

                                return (
                                    Math.abs(lenR - 1) < 1e-4 &&
                                    Math.abs(lenU - 1) < 1e-4 &&
                                    Math.abs(lenF - 1) < 1e-4 &&
                                    Math.abs(dotRU) < 1e-4 &&
                                    Math.abs(dotRF) < 1e-4 &&
                                    Math.abs(dotUF) < 1e-4
                                );
                            };

                            let allValid = true;
                            const tilts = [-90, 90, -89.999, 89.999];
                            const pans = [0, 45, 90, 180, 270, 360];
                            let t = 16;

                            for (const tilt of tilts) {
                                for (const pan of pans) {
                                    controller.tilt = tilt;
                                    controller.pan = pan;
                                    controller.update(view, t);
                                    t += 1000;
                                    if (!checkOrthonormal(controller.camera.viewMatrix)) {
                                        allValid = false;
                                    }
                                }
                            }

                            // tilt = -90° 정점 상태에서도 pan 회전이 실제 viewMatrix 방향을 회전시키는지 확인
                            controller.tilt = -90;
                            controller.pan = 0;
                            controller.update(view, t);
                            t += 1000;
                            const m0 = Array.from<number>(controller.camera.viewMatrix);
                            controller.pan = 90;
                            controller.update(view, t);
                            const m90 = Array.from<number>(controller.camera.viewMatrix);
                            const panChangedOrientation =
                                Math.abs(m0[0] - m90[0]) > 0.5 || Math.abs(m0[8] - m90[8]) > 0.5;

                            controller.destroy();
                            ctx.destroy();

                            resolve({allValid, panChangedOrientation});
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(result.allValid).toBe(true);
        expect(result.panChangedOrientation).toBe(true);
    });
});
