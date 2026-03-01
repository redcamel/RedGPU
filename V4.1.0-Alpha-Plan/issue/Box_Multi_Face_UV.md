# [Feature] Box Primitive Multi-Face UV Control

## 📌 개요 (Overview)
현재 RedGPU의 `Box` 프리미티브는 6개 면 전체에 동일한 UV(0~1)가 고정 매핑되어 있습니다. 본 이슈에서는 각 면(PX, NX, PY, NY, PZ, NZ)마다 독립적인 UV 좌표(Offset, Scale)를 설정할 수 있는 기능을 도입하여, 단일 텍스처 아틀라스를 활용한 복잡한 객체 표현과 렌더링 최적화를 달성하고자 합니다.

---

## 🎯 핵심 목표 (Strategic Goals)
| 목표 | 상세 내용 | 기대 효과 |
| :--- | :--- | :--- |
| **아틀라스 매핑** | 하나의 텍스처에서 각 면이 서로 다른 영역을 참조 | 텍스처 리소스 절약 및 Minecraft형 블록 구현 가능 |
| **드로우 콜 최적화** | 6개의 Plane 대신 단일 Box 메시 사용 | 렌더링 오버헤드 감소 및 CPU/GPU 성능 향상 |
| **유연한 인터페이스** | 생성자 파라미터를 통한 직관적인 면별 UV 설정 | 개발자 생산성 및 코드 가독성 증대 |

---

## 📐 기술적 사양 (Technical Specifications)

### 1. 면별 식별자 표준 (Face Identifiers)
Box의 6면은 엔진 내부 표준에 따라 다음과 같이 정의됩니다:
- `px` (+X, Right)
- `nx` (-X, Left)
- `py` (+Y, Top)
- `ny` (-Y, Bottom)
- `pz` (+Z, Front)
- `nz` (-Z, Back)

### 2. UV 데이터 구조 (Data Structure)
각 면의 UV는 `[u, v, width, height]` 형태의 배열 또는 객체로 전달받습니다.
```typescript
interface BoxFaceUV {
    u: number;      // 시작 X 좌표 (0~1)
    v: number;      // 시작 Y 좌표 (0~1)
    w: number;      // 가로 폭 (0~1)
    h: number;      // 세로 높이 (0~1)
}
```

---

## 🛠️ 구현 전략 (Implementation Strategy)

### 1. 생성자 파라미터 확장
`Box` 생성자에 `faceUVs` 옵션을 추가합니다.
```typescript
const diceUVs = {
    px: [0, 0, 0.33, 0.5], // 1번 면
    nx: [0.33, 0, 0.33, 0.5], // 2번 면
    // ... 나머지 면 설정
};
const dice = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 1, 1, 1, diceUVs);
```

### 2. `PrimitiveUtils` 로직 고도화
- `generateBoxData`가 `faceUVs` 정보를 받아 각 면을 생성하는 `generatePlaneData`에 개별 UV 범위를 전달하도록 수정합니다.
- `generatePlaneData`는 기본 `0~1` 대신 전달받은 `uStart, vStart, uEnd, vEnd`를 기반으로 정점의 UV 데이터를 생성합니다.

---

## 💡 실무 활용 시나리오 (Use Cases)

### 1. 텍스처 아틀라스 기반 블록 (Minecraft Style)
- 상단(풀), 측면(흙+풀), 하단(흙) 이미지가 합쳐진 한 장의 텍스처를 Box 하나에 완벽히 매핑.

### 2. 주사위 및 퍼즐 (Dice & Puzzles)
- 숫자나 그림이 그려진 텍스처를 각 면의 인덱스에 맞춰 배치.

### 3. 스카이박스 (Skybox Optimization)
- 6개의 분리된 텍스처 대신 하나의 'Cube Map Layout' 이미지를 사용하여 배경 박스 생성.

---

## 🚀 향후 로드맵 반영
- **단계 1**: `PrimitiveUtils` 내 UV 범위 제어 로직 구현 (완료)
- **단계 2**: `Box` 클래스 인터페이스 확장 및 캐싱 키(`uniqueKey`) 연동
- **단계 3**: 다양한 아틀라스 구성을 시연하는 예제(`examples/3d/primitive/box/atlas/`) 제작

---
**상태:** 설계 완료 (Planned)
**대상 버전:** V4.1.0-Alpha
