---
title: WindManager
order: 4
---

# 전역 바람 시스템

`RedGPU.Wind.WindManager`는 씬 전체의 바람 방향 (풍향), 이동 속도 (풍속), 그리고 세기 (풍력 강도)를 단일 인터페이스로 제어하는 전역 환경
매니저입니다.

## 1. 연동되는 시스템

`Scene` 인스턴스가 기본 소유하는 `scene.windManager`의 속성을 변경하면 다음 렌더링 시스템들에 즉시 반영됩니다.

- **대규모 식생 (`FoliageManager`)**: 나무 기둥의 휘어짐 (`trunkBendScale`)과 나뭇잎의 미세 떨림 (`leafFlutterScale`) 방향 및 주기
- **절차적 잔디 (`GrassManager`)**: 초원 위를 지나가는 바람 파동 (Wind Gust)의 진행 방향과 흔들림 폭
- **물리 기반 수체 (`Lake`)**: 호수 수면 노멀 맵의 흐름 방향과 속도 (`flowRateScale`)

## 2. 사용법 및 주요 속성

별도의 인스턴스 생성 없이 `scene.windManager`를 통해 접근합니다.

| 속성명               | 타입      | 기본값    | 설명                                                                   |
|:---------------------|:----------|:----------|:-----------------------------------------------------------------------|
| **`enabled`**        | `boolean` | `true`    | 전역 바람 효과 활성화 여부 (`false` 설정 시 모든 바람 애니메이션 정지) |
| **`directionAngle`** | `number`  | `45`      | 바람이 불어가는 수평 풍향 각도 (단위: 도, `0 ~ 360`)                   |
| **`speed`**          | `number`  | `1.0`     | 바람 파동의 시간축 진행 속도 배율 (`0` 이상)                           |
| **`strength`**       | `number`  | `1.0`     | 식생·잔디·수면에 가해지는 풍력 강도 배율 (`0` 이상)                    |
| **`directionX`**     | `number`  | 읽기 전용 | `directionAngle`로부터 계산된 정규화 X축 방향 성분 (`cos`)             |
| **`directionZ`**     | `number`  | 읽기 전용 | `directionAngle`로부터 계산된 정규화 Z축 방향 성분 (`sin`)             |

```javascript
// Scene의 전역 바람 매니저 접근
const windManager = scene.windManager;

// 1. 풍향 각도 설정 (0 ~ 360도)
windManager.directionAngle = 120;

// 2. 풍속 및 풍력 강도 조절
windManager.speed = 1.2;
windManager.strength = 1.5;

// 3. 필요 시 바람 효과 일시 정지
// windManager.enabled = false;
```

---

## 관련 예제

- [절차적 잔디 및 바람 연동](/RedGPU/examples/3d/landscape/proceduralGrass/)
- [대규모 식생 및 바람 연동](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [오픈월드 통합 환경](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

## 다음 단계

자연 환경 구성을 마쳤다면 확장 객체 카테고리로 이동하여 외부 3D 모델과 다양한 디스플레이 객체 활용법을 살펴보세요.

- **[확장 객체](../extended-objects/index.md)**
