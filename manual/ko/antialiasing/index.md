---
title: Antialiasing
order: 10
---

# 안티앨리어싱

**안티앨리어싱**(Antialiasing) 은 3D 렌더링 시 발생하는 계단 현상(Aliasing)을 제거하여 부드러운 외곽선을 만드는 기술입니다. RedGPU는 하드웨어 기반의 **MSAA**, 후처리 기반의 **FXAA**, 시간축 기반의 **TAA** 를 제공합니다.

모든 설정은 `RedGPUContext` 의 `antialiasingManager` 를 통해 통합 제어됩니다.

## 1. 기본 동작 및 활성화 규칙

RedGPU의 안티앨리어싱 시스템은 **배타적**으로 동작합니다. 즉, 한 번에 하나의 기법만 활성화할 수 있으며, 새로운 기법을 켜면 기존 설정은 자동으로 해제됩니다.

### 초기화 시 기본값 (Auto-Selection)
엔진 초기화 시 실행 환경의 `devicePixelRatio` 에 따라 최적의 기법이 자동으로 선택됩니다.

- **고해상도 디스플레이** (`devicePixelRatio > 1.0`): **TAA** 가 기본으로 활성화됩니다.
- **일반 디스플레이**: **MSAA** 가 기본으로 활성화됩니다.

```javascript
// 현재 설정 확인
const manager = redGPUContext.antialiasingManager;
console.log(`TAA: ${manager.useTAA}, MSAA: ${manager.useMSAA}, FXAA: ${manager.useFXAA}`);
```

## 2. 기법별 특징 및 추천

렌더링 품질과 성능 목표에 따라 적절한 기법을 선택하세요.

| 기법 | 방식 | 품질 | 성능 비용 | 특징 |
| :--- | :--- | :--- | :--- | :--- |
| **[TAA](./taa.md)** | 시간축 누적 | 최상 | 높음 | 영화 같은 품질, 미세한 떨림 제거 |
| **[MSAA](./msaa.md)** | 하드웨어 샘플링 | 좋음 | 중간 | 표준적이고 안정적인 외곽선 처리 |
| **[FXAA](./fxaa.md)** | 후처리 | 보통 | 매우 낮음 | 가장 빠르지만 화면이 약간 흐려짐 |

## 학습 가이드

품질 순서대로 학습하는 것을 권장합니다.

1. **[TAA (Temporal AA)](./taa.md)** : 최고의 품질을 위한 선택
2. **[MSAA (Multisample AA)](./msaa.md)** : 표준적이고 안정적인 선택
3. **[FXAA (Fast Approximate AA)](./fxaa.md)** : 최고의 성능을 위한 선택

---

[다음 단계: TAA 배우기](./taa.md)
