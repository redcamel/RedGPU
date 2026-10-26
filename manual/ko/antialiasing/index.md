---
title: Antialiasing
order: 10
---

# 안티앨리어싱

**안티앨리어싱**(Antialiasing)은 3D 렌더링 시 발생하는 계단 현상 (Aliasing)을 제거하여 부드러운 외곽선과 화면을 만드는 기술입니다. RedGPU는 시간축 누적 기반의 **[
`TAA`](./taa.md)**, 하드웨어 멀티샘플링 기반의 **[`MSAA`](./msaa.md)**, 후처리 필터 기반의 **[`FXAA`](./fxaa.md)** 를 제공하며, 모든 설정은
`redGPUContext.antialiasingManager`(`AntialiasingManager`)를 통해 통합 제어됩니다.

---

## 1. 기본 동작 및 활성화 규칙

RedGPU의 안티앨리어싱 시스템은 **배타적**으로 동작합니다. 한 번에 하나의 기법만 활성화할 수 있으며, 새로운 기법을 켜면 기존 설정은 자동으로 해제됩니다.

### 초기화 시 자동 선택 (Auto-Selection)

엔진 초기화 시 디스플레이의 픽셀 밀도 (`window.devicePixelRatio`)를 감지하여 최적의 기법이 기본으로 활성화됩니다.

- **고해상도 디스플레이** (`devicePixelRatio > 1.0`): **`TAA`** 기본 활성화 (`useTAA = true`)
- **일반 디스플레이** (`devicePixelRatio <= 1.0`): **`MSAA`** 기본 활성화 (`useMSAA = true`)

```javascript
const { antialiasingManager } = redGPUContext;

// 안티앨리어싱 모드 전환 (기존 활성 모드는 자동 해제됨)
antialiasingManager.useTAA = true;
```

---

## 2. 기법별 비교

렌더링 품질과 성능 목표에 따라 적절한 기법을 선택할 수 있습니다.

| 기법                  | 방식            | 품질 및 특징                                                                      | 성능 비용 | 비교 이미지                     |
|:----------------------|:----------------|:----------------------------------------------------------------------------------|:----------|:--------------------------------|
| **NONE**              | 미적용          | 안티앨리어싱을 적용하지 않은 원본 상태 (계단 현상 발생)                           | 없음      | ![None](/antialiasing/none.jpg) |
| **[TAA](./taa.md)**   | 시간축 누적     | 지오메트리 외곽선과 셰이더/텍스처 내부 알리어싱까지 제거                          | 중간      | ![TAA](/antialiasing/taa.jpg)   |
| **[MSAA](./msaa.md)** | 하드웨어 샘플링 | 지오메트리 외곽선만 선명하게 처리 (텍스처 내부 패턴 및 알파 컷오프 경계는 미적용) | 높음      | ![MSAA](/antialiasing/msaa.jpg) |
| **[FXAA](./fxaa.md)** | 후처리 필터     | 최종 이미지의 경계를 빠르게 보정 (미세한 블러 동반)                               | 매우 낮음 | ![FXAA](/antialiasing/fxaa.jpg) |

> [!TIP]
> **실시간 테스트 안내**: RedGPU의 모든 예제 화면 UI에 위치한 **`ANTIALIASING`** 드롭다운 메뉴를 통해 현재 실행 중인 씬에서 `TAA`, `MSAA`, `FXAA`, `NONE` 모드를
즉시 전환하며 비교해 볼 수 있습니다.
>
> ![Antialiasing Control](/toneMapping/toneMappingControl.png)

---

[다음 단계: TAA 배우기](./taa.md)
