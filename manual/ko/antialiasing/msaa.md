---
title: MSAA
order: 2
---

# MSAA (Multisample AA)

**MSAA**(Multisample Antialiasing) 는 하드웨어 (GPU) 레벨에서 폴리곤의 경계 (Edge) 부분을 멀티샘플링하여 외곽선을 부드럽게 처리하는 표준 안티앨리어싱 기법입니다.

## 1. 장점 및 단점

- **장점**:
    - 후처리 블러 (FXAA)나 잔상 (TAA) 없이 실제 지오메트리 (폴리곤)의 외곽선을 흐릿함 없이 선명하고 깔끔하게 정리합니다.
- **단점**:
    - **폴리곤 내부 알리어싱 미해결**: 폴리곤 안쪽의 고대비 텍스처 패턴이나 PBR 금속 재질의 스펙큘러 하이라이트 자글거림은 제거하지 못합니다.
    - **알파 컷오프 (`MASK` / Cutoff) 경계 미해결**: 나뭇잎, 철망, 또는 `Cutoff` 패널처럼 알파 값으로 잘려나간 경계선은 실제 폴리곤 외곽선이 아니므로 계단 현상이 그대로 남습니다.
    - **메모리 사용량 증가**: 멀티샘플링 버퍼 (4x MSAA)를 추가로 사용하므로 메모리와 대역폭 소모가 큽니다.

## 2. 사용법

`antialiasingManager.useMSAA` 를 통해 활성화합니다. 이를 켜면 FXAA나 TAA는 자동으로 비활성화됩니다.

```javascript
// MSAA 활성화 (다른 AA는 꺼짐)
redGPUContext.antialiasingManager.useMSAA = true;
```

## 3. 품질 비교

| 상태              | 결과 이미지                     |
|:------------------|:--------------------------------|
| **미적용 (NONE)** | ![None](/antialiasing/none.jpg) |
| **MSAA 적용**     | ![MSAA](/antialiasing/msaa.jpg) |

---

[다음 단계: FXAA 배우기](./fxaa.md)
