---
title: WindManager
order: 4
---

<script setup>
const windGraph = `
    Scene["Scene"] -->|scene.windManager| Wind["WindManager (전역 바람 제어)"]
    Wind -->|풍향·풍속·강도 전달| Foliage["FoliageManager (나무·수목)"]
    Wind -->|풍향·풍속·강도 전달| Lake["Lake (호수·수면)"]

    %% 회색조 스타일 적용
    style Scene fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Wind fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Foliage fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Lake fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# WindManager

`WindManager` 는 씬 전체의 바람 방향 (풍향), 이동 속도 (풍속), 세기 (풍력 강도)를 통합 제어하는 전역 환경 매니저입니다. `Scene` 생성 시 내부적으로 자동 생성되며
`scene.windManager` 속성을 통해 접근합니다.

<ClientOnly>
  <MermaidResponsive :definition="windGraph" />
</ClientOnly>

## 1. 연동되는 환경 시스템

`scene.windManager` 의 속성을 변경하면 씬 내의 다음 자연 환경 시스템들에 즉시 반영됩니다.

- **대규모 식생 (`FoliageManager`)**: 나무 기둥의 휘어짐과 나뭇잎의 흔들림 방향 및 주기
- **물리 기반 수면 (`Lake`)**: 호수 수면 물결의 흐름 방향과 속도

## 2. 주요 속성 제어

별도의 인스턴스를 생성하지 않고 `scene.windManager` 의 속성을 직접 조절합니다.

| 속성                 | 기본값 | 설명                                                                   |
|:---------------------|:-------|:-----------------------------------------------------------------------|
| **`directionAngle`** | `0`    | 바람이 불어가는 수평 풍향 각도 (`0 ~ 360`도)                           |
| **`speed`**          | `1.0`  | 바람 애니메이션의 진행 속도 배율                                       |
| **`strength`**       | `1.0`  | 식생·수면에 가해지는 바람의 세기 배율                                  |
| **`enabled`**        | `true` | 전역 바람 효과 활성화 여부 (`false` 설정 시 모든 바람 애니메이션 정지) |

```javascript
const windManager = scene.windManager;

// 1. 풍향 각도 설정 (0 ~ 360도)
windManager.directionAngle = 45;

// 2. 풍속 및 바람 세기 조절
windManager.speed = 1.2;
windManager.strength = 1.5;

// 3. 필요 시 바람 효과 일시 정지
// windManager.enabled = false;
```

---

## 관련 예제

- [대규모 식생 및 바람 연동](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [오픈월드 통합 환경](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

## 다음 단계

자연 환경 구성을 마쳤다면 확장 객체 카테고리로 이동하여 외부 3D 모델과 다양한 디스플레이 객체 활용법을 살펴보세요.

- **[확장 객체](../extended-objects/index.md)**
