---
title: FXAA
order: 3
---

# FXAA (Fast Approximate AA)

**`FXAA`** 는 렌더링된 최종 이미지를 분석하여 경계를 부드럽게 보정하는 **후처리**(Post-Processing) 방식의 안티앨리어싱 기법입니다.

## 1. 장점 및 단점

- **장점**:
    - 연산 비용이 매우 적고 별도의 멀티샘플 버퍼를 요구하지 않아 모바일 및 저사양 기기에서도 부담 없이 사용할 수 있습니다.
- **단점**:
    - 최종 이미지의 픽셀 경계를 흐리게 보정하므로 화면 전체의 텍스처나 세밀한 디테일이 약간 흐려질 (Blur) 수 있습니다.

## 2. 사용법

`antialiasingManager.useFXAA` 를 통해 활성화합니다. 이를 켜면 MSAA나 TAA는 자동으로 비활성화됩니다.

```javascript
// FXAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useFXAA = true;
```

## 3. 품질 비교

| 상태              | 결과 이미지                     |
|:------------------|:--------------------------------|
| **미적용 (NONE)** | ![None](/antialiasing/none.jpg) |
| **FXAA 적용**     | ![FXAA](/antialiasing/fxaa.jpg) |

---

[다음 단계: 플러그인 시스템 배우기](../plugins/index.md)
