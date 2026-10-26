---
title: TAA
order: 1
---

# TAA (Temporal AA)

**`TAA`**(Temporal Antialiasing) 는 이전 프레임의 결과물을 현재 프레임과 합성하여 계단 현상을 제거하는 시간축 기반 안티앨리어싱 기법입니다.

## 1. 장점 및 단점

- **장점**:
    - 지오메트리 외곽선뿐만 아니라 폴리곤 내부의 고대비 텍스처 패턴, 알파 컷오프 (`MASK`) 경계, PBR 스펙큘러 하이라이트의 자글거림까지 가장 뛰어난 품질로 제거합니다.
- **단점**:
    - 다수의 프레임을 누적하여 합성하므로 빠르게 움직이는 물체나 급격한 카메라 이동 시 미세한 잔상 (Ghosting)이 발생할 수 있습니다.

## 2. 사용법

`antialiasingManager.useTAA` 를 통해 활성화합니다. 이를 켜면 MSAA나 FXAA는 자동으로 비활성화됩니다.

```javascript
// TAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useTAA = true;
```

## 3. 품질 비교

| 상태              | 결과 이미지                     |
|:------------------|:--------------------------------|
| **미적용 (NONE)** | ![None](/antialiasing/none.jpg) |
| **TAA 적용**      | ![TAA](/antialiasing/taa.jpg)   |

---

[다음 단계: MSAA 배우기](./msaa.md)
