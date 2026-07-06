import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Resource.GlobalStorageBufferManager');

const makeContext = (callback) => {
    const canvas = document.createElement('canvas');
    RedGPU.init(
        canvas,
        (redGPUContext) => {
            callback(redGPUContext);
        },
        (error) => {
            console.error(error);
        }
    );
};

// 1. 초기화 및 기본 속성 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Initialization & Properties',
    (runner) => {
        runner.defineTest('Success Test: Create instance with correct properties', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 256, 128, 'TEST_BUFFER');
                    const totalSlotCount = manager.totalSlotCount;
                    const elementSize = manager.elementSize;
                    const label = manager.label;
                    const isGPUBuffer = manager.gpuBuffer instanceof GPUBuffer;

                    redGPUContext.destroy();
                    run(totalSlotCount === 128 && elementSize === 256 && label === 'TEST_BUFFER' && isGPUBuffer);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 2. 슬롯 할당, 해제 및 재사용 (LIFO 구조) 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Slot Allocation, Free & Reuse',
    (runner) => {
        runner.defineTest('Success Test: LIFO reuse and sequence allocation', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 256, 10, 'TEST_ALLOC');

                    const s0 = manager.allocateSlot();
                    const s1 = manager.allocateSlot();
                    const s2 = manager.allocateSlot();

                    manager.freeSlot(s1.index); // s1 해제 (index: 1)
                    manager.freeSlot(s0.index); // s0 해제 (index: 0)

                    // LIFO에 의해 마지막에 반환된 s0 (index 0)가 먼저 재할당되어야 함
                    const r0 = manager.allocateSlot();
                    const r1 = manager.allocateSlot(); // 그 다음 s1 (index 1)이 재할당되어야 함
                    const r2 = manager.allocateSlot(); // 새로 할당되는 index 3이 와야 함

                    redGPUContext.destroy();

                    const success = (
                        r0.index === 0 &&
                        r1.index === 1 &&
                        r2.index === 3
                    );
                    run(success);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 3. 다단계 연속 리사이징 및 데이터 보존성 정밀 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Multi-step Resizing & Data Retention',
    (runner) => {
        runner.defineTest('Success Test: Retain existing data after cascading resizes', (run) => {
            makeContext((redGPUContext) => {
                try {
                    // 초깃값 1개짜리 버퍼 생성 (elementSize: 16 bytes)
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 1, 'TEST_CASCADE');

                    const s0 = manager.allocateSlot(); // index: 0
                    const testData0 = new Float32Array([1.1, 2.2, 3.3, 4.4]);
                    manager.updateFloatData(s0.index, testData0);

                    // 할당 시마다 리사이즈 유발 (1 -> 2 -> 4)
                    const s1 = manager.allocateSlot(); // index: 1, 리사이즈 to 2
                    const testData1 = new Float32Array([5.5, 6.6, 7.7, 8.8]);
                    manager.updateFloatData(s1.index, testData1);

                    const s2 = manager.allocateSlot(); // index: 2, 리사이즈 to 4

                    // 내부 CPU 백킹 버퍼 뷰를 통해 이전 데이터가 안전하게 유지되었는지 복합 검증
                    const backingFloatView = new Float32Array(manager.cpuData);

                    // slot 0 (0~3 float offset)
                    const s0_preserved = (
                        Math.abs(backingFloatView[0] - 1.1) < 0.0001 &&
                        Math.abs(backingFloatView[1] - 2.2) < 0.0001 &&
                        Math.abs(backingFloatView[2] - 3.3) < 0.0001 &&
                        Math.abs(backingFloatView[3] - 4.4) < 0.0001
                    );
                    // slot 1 (4~7 float offset)
                    const s1_preserved = (
                        Math.abs(backingFloatView[4] - 5.5) < 0.0001 &&
                        Math.abs(backingFloatView[5] - 6.6) < 0.0001 &&
                        Math.abs(backingFloatView[6] - 7.7) < 0.0001 &&
                        Math.abs(backingFloatView[7] - 8.8) < 0.0001
                    );

                    redGPUContext.destroy();
                    run(s0_preserved && s1_preserved && manager.totalSlotCount === 4);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 4. 슬롯 내부 미세 오프셋 데이터 쓰기 및 데이터 정밀 매핑 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - OffsetInsideElement Precision Check',
    (runner) => {
        runner.defineTest('Success Test: Exact memory mapping with internal offsets', (run) => {
            makeContext((redGPUContext) => {
                try {
                    // elementSize: 32 bytes (8 floats)
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 32, 2, 'TEST_OFFSET');
                    const s0 = manager.allocateSlot(); // index: 0, byteOffset: 0
                    const s1 = manager.allocateSlot(); // index: 1, byteOffset: 32 (float index 8)

                    // index 1번 슬롯의 내부 3번째 float 위치(floatOffset: 2)부터 3개의 float 데이터 쓰기
                    const subData = new Float32Array([9.9, 8.8, 7.7]);
                    manager.updateFloatData(s1.index, subData, 2);

                    // 백킹 버퍼의 전역 float 인덱스로는:
                    // base = (1 * 32) / 4 + 2 = 8 + 2 = 10번 인덱스여야 함
                    const backingFloatView = new Float32Array(manager.cpuData);

                    const match = (
                        Math.abs(backingFloatView[10] - 9.9) < 0.0001 &&
                        Math.abs(backingFloatView[11] - 8.8) < 0.0001 &&
                        Math.abs(backingFloatView[12] - 7.7) < 0.0001 &&
                        backingFloatView[9] === 0 // 9번(슬롯 index 1의 2번째 float)은 비어있어야 함
                    );
                    redGPUContext.destroy();
                    run(match);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 5. 동일 슬롯 내부 영역에 Float 및 Uint 데이터 혼합 쓰기 무결성 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Float & Uint Data Coexistence',
    (runner) => {
        runner.defineTest('Success Test: Float and Uint parameters written in different partition of same slot', (run) => {
            makeContext((redGPUContext) => {
                try {
                    // elementSize: 16 bytes (4 words)
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 2, 'TEST_MIXED');
                    const s0 = manager.allocateSlot();

                    // 앞의 2개 워드(8바이트)는 Float
                    const fData = new Float32Array([1.5, 2.5]);
                    manager.updateFloatData(s0.index, fData, 0);

                    // 뒤의 2개 워드(8바이트, offset 2)는 Uint
                    const uData = new Uint32Array([42, 100]);
                    manager.updateUintData(s0.index, uData, 2);

                    const backingFloatView = new Float32Array(manager.cpuData);
                    const backingUintView = new Uint32Array(manager.cpuData);

                    const match = (
                        Math.abs(backingFloatView[0] - 1.5) < 0.0001 &&
                        Math.abs(backingFloatView[1] - 2.5) < 0.0001 &&
                        backingUintView[2] === 42 &&
                        backingUintView[3] === 100
                    );

                    redGPUContext.destroy();
                    run(match);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 6. 대규모 슬롯 할당 및 해제 스트레스 테스트 (인덱스 무결성 검사)
redUnit.testGroup(
    'GlobalStorageBufferManager - High Load Allocation Stress Test',
    (runner) => {
        runner.defineTest('Success Test: Allocate and free 1,000 slots repeatedly without errors', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 16, 'TEST_STRESS');
                    const slots = [];

                    // 1. 1000개 할당 (동적 리사이징 반복 트리거)
                    for (let i = 0; i < 1000; i++) {
                        slots.push(manager.allocateSlot());
                    }

                    const maxSlotCapacity = manager.totalSlotCount;

                    // 2. 짝수번째 슬롯 해제
                    for (let i = 0; i < 1000; i += 2) {
                        manager.freeSlot(slots[i].index);
                    }

                    // 3. 해제 후 남은 잔여 공간 수량 체크
                    const activeCount = manager.activeSlotCount; // 1000개 중 500개 해제했으므로 500
                    const remainingCount = manager.remainingSlotCount; // maxSlotCapacity - 500

                    // 4. 다시 500개 할당했을 때 기존 해제한 슬롯들이 잘 회수되는지 확인
                    const newSlots = [];
                    for (let i = 0; i < 500; i++) {
                        newSlots.push(manager.allocateSlot());
                    }

                    // 모든 신규 500개 인덱스가 기존의 짝수 인덱스(0, 2, 4...) 내에 들어가서 최대 수용량(totalSlotCount) 변화가 없어야 함
                    const finishedCapacity = manager.totalSlotCount;

                    redGPUContext.destroy();
                    run(activeCount === 500 && (finishedCapacity === maxSlotCapacity) && newSlots.every(s => s.index < 1000));
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 7. 더티 트래킹 변수의 실시간 수치 변화 정밀 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Dirty Tracking Bounds',
    (runner) => {
        runner.defineTest('Success Test: Dirty ranges correctly track min/max indices and reset after flush', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 10, 'TEST_DIRTY');

                    // 초기 상태는 min = Infinity, max = -Infinity
                    const isInitialClean = manager.dirtyMin === Infinity && manager.dirtyMax === -Infinity;

                    // 임의 슬롯 수정
                    manager.updateFloatData(4, new Float32Array([1.0]));
                    const check1 = manager.dirtyMin === 4 && manager.dirtyMax === 4;

                    manager.updateFloatData(2, new Float32Array([2.0])); // min 갱신 유도
                    manager.updateFloatData(7, new Float32Array([3.0])); // max 갱신 유도
                    const check2 = manager.dirtyMin === 2 && manager.dirtyMax === 7;

                    // flush 실행
                    manager.flush();

                    // flush 직후 더티 플래그가 다시 초기화 상태로 리셋되었는지 확인
                    const isAfterClean = manager.dirtyMin === Infinity && manager.dirtyMax === -Infinity;

                    redGPUContext.destroy();
                    run(isInitialClean && check1 && check2 && isAfterClean);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 8. 하드웨어 한계 용량 초과 예외 처리 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Hardware Limit Enforcement',
    (runner) => {
        runner.defineTest('Success Test: Throw error when resized beyond safe Max Buffer Size', (run) => {
            makeContext((redGPUContext) => {
                try {
                    // 64MB(67,108,864 bytes) 크기의 슬롯으로 2개 최초 용량 설정 (총 128MB 수용)
                    // safeMaxBufferSize 기본값은 128MB이므로, 다음 번 리사이즈 시 128MB를 초과하게 됩니다.
                    const elementSize = 67108864; // 64MB
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, elementSize, 2, 'TEST_LIMIT');

                    // 현재 용량 2개 * 64MB = 128MB (한계치인 128MB와 동일하여 안전)
                    manager.allocateSlot(); // idx 0
                    manager.allocateSlot(); // idx 1

                    // 3번째 슬롯 할당 시 -> 새 용량 4개 * 64MB = 256MB 로 확장을 시도하게 됨
                    // 이는 safeMaxBufferSize(128MB)를 초과하므로 리사이징 직전에 예외가 발생하여 catch로 떨어집니다.
                    manager.allocateSlot();

                    // 예외가 발생하지 않고 이곳에 도달하면 실패로 간주합니다.
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    // 예외가 정상적으로 던져져 이리로 오면 테스트 성공(false 반환)이 됩니다.
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, false);

        runner.defineTest('Failure Test: Throw error when initialized beyond safe Max Buffer Size', (run) => {
            makeContext((redGPUContext) => {
                try {
                    // 처음부터 64MB * 3 = 192MB 크기로 생성을 유도 (한계치인 128MB를 생성 시점에 즉각 돌파)
                    const elementSize = 67108864; // 64MB
                    new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, elementSize, 3, 'TEST_INIT_LIMIT');

                    // 예외 없이 생성 완료되면 테스트 실패
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    // 생성자 내부에서 예외가 성공적으로 떨어지면 성공(false 반환)
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, false);
    }
);

// 9. 동적 리사이즈 콜백 호출 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Resize Callback Notification',
    (runner) => {
        runner.defineTest('Success Test: Trigger onResize callback with manager instance as argument', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 1, 'TEST_RESIZE');
                    let callbackArgument = null;

                    manager.setOnResize((mgr) => {
                        callbackArgument = mgr;
                    });

                    manager.allocateSlot(); // idx 0
                    manager.allocateSlot(); // idx 1 (리사이즈 유발)

                    redGPUContext.destroy();
                    // 콜백에 전달된 인자가 생성한 매니저 인스턴스와 같은지 검증
                    run(callbackArgument === manager);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

// 10. 슬롯 허용 한도 초과 쓰기 차단 검증
redUnit.testGroup(
    'GlobalStorageBufferManager - Slot Boundary Enforcement',
    (runner) => {
        runner.defineTest('Failure Test: Throw error when input Float data exceeds elementSize', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 2, 'TEST_SLOT_OVERFLOW_FLOAT');
                    const slot = manager.allocateSlot();

                    // 16바이트(4 floats) 한계를 넘어서는 5 floats 쓰기 시도
                    manager.updateFloatData(slot.index, new Float32Array([1, 2, 3, 4, 5]));

                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, false);

        runner.defineTest('Failure Test: Throw error when input Float data with offset exceeds elementSize', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 2, 'TEST_SLOT_OVERFLOW_OFFSET');
                    const slot = manager.allocateSlot();

                    // 3 floats 쓰기이지만, offset 2에서 시작하므로 총 5 floats 공간을 소모하여 초과
                    manager.updateFloatData(slot.index, new Float32Array([1, 2, 3]), 2);

                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, false);

        runner.defineTest('Failure Test: Throw error when input Uint data exceeds elementSize', (run) => {
            makeContext((redGPUContext) => {
                try {
                    const manager = new RedGPU.Resource.GlobalStorageBufferManager(redGPUContext, 16, 2, 'TEST_SLOT_OVERFLOW_UINT');
                    const slot = manager.allocateSlot();

                    // 16바이트(4 uints) 한계를 넘어서는 5 uints 쓰기 시도
                    manager.updateUintData(slot.index, new Uint32Array([1, 2, 3, 4, 5]));

                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, false);
    }
);
