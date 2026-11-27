import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Camera.OrbitController (Gimbal Lock Regression)', () => {
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

    // tilt = ±90° 극점과 연속 pan 각도에서 viewMatrix의 유한성 및 정규직교성 유지 검증
    test('maintains orthonormal finite viewMatrix at tilt = ±90° across pan angles', async () => {
        const allValid = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const controller = new RedGPU.Camera.OrbitController(ctx);
            const view = new RedGPU.Display.View3D(ctx, scene, controller);

            controller.distance = 10;
            controller.rotationInterpolation = 0.0001;
            controller.distanceInterpolation = 0.0001;

            // 열 우선 viewMatrix의 상위 3x3 기저 벡터(Right, Up, Forward)가 단위 길이·상호 직교인지 검증
            const checkOrthonormal = (m: Float32Array) => {
                for (let i = 0; i < 16; i++) {
                    if (!Number.isFinite(m[i])) return false;
                }
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

            let valid = true;
            let t = 16;
            for (const tilt of [-90, 90, -89.999, 89.999]) {
                for (const pan of [0, 45, 90, 180, 270, 360]) {
                    controller.tilt = tilt;
                    controller.pan = pan;
                    controller.update(view, t);
                    t += 1000;
                    if (!checkOrthonormal(controller.camera.viewMatrix)) {
                        valid = false;
                    }
                }
            }

            controller.destroy();
            return valid;
        });

        expect(allValid).toBe(true);
    });

    // tilt = -90° 정점 상태에서도 pan 회전 시 실제 카메라 방향(viewMatrix)이 회전하는지 검증
    test('rotates camera orientation smoothly on pan change at tilt = -90°', async () => {
        const rotated = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const controller = new RedGPU.Camera.OrbitController(ctx);
            const view = new RedGPU.Display.View3D(ctx, scene, controller);

            controller.distance = 10;
            controller.rotationInterpolation = 0.0001;
            controller.distanceInterpolation = 0.0001;

            controller.tilt = -90;
            controller.pan = 0;
            controller.update(view, 16);
            const m0 = Array.from<number>(controller.camera.viewMatrix);

            controller.pan = 90;
            controller.update(view, 1016);
            const m90 = Array.from<number>(controller.camera.viewMatrix);

            controller.destroy();
            return Math.abs(m0[0] - m90[0]) > 0.5 || Math.abs(m0[8] - m90[8]) > 0.5;
        });

        expect(rotated).toBe(true);
    });
});
