---
title: Text Field
order: 4
---

# 텍스트 필드

RedGPU의 텍스트 필드 시스템은 HTML/SVG 렌더링을 내부적으로 활용하여 3D 월드 좌표 (`TextField3D`)와 2D 화면 좌표 (`TextField2D`)에 CSS 스타일이 적용된 텍스트를
출력합니다. 텍스트 내용과 스타일 변화에 맞춰 텍스처가 자동 갱신되며, `TextField3D` 는 카메라를 향하는 **빌보드**(Billboard) 기능을 기본 지원합니다.

## 1. 핵심 스타일 속성

`TextField3D` 와 `TextField2D` 가 공통으로 제공하는 주요 스타일 속성입니다.

| 속성             | 기본값          | 설명                                            |
|:-----------------|:----------------|:------------------------------------------------|
| **`text`**       | `""`            | 출력할 문자열 (`<br/>` 태그를 통한 줄바꿈 지원) |
| **`fontSize`**   | `24`            | 폰트 크기 (`px`)                                |
| **`fontFamily`** | `"Arial"`       | 폰트 종류                                       |
| **`color`**      | `"#fff"`        | 글자 색상 (Hex, RGB 등)                         |
| **`background`** | `"transparent"` | 배경색 및 투명도                                |
| **`textAlign`**  | `"center"`      | 텍스트 정렬 (`"left"`, `"center"`, `"right"`)   |
| **`padding`**    | `0`             | 내부 여백 (`px`)                                |

---

## 학습 로드맵

1. **[TextField3D](./textfield3d.md)** : 3D 월드 내에 텍스트 배치 및 크기 모드 제어하기
2. **[파티클 및 라인](../particle/index.md)** : GPU 파티클 이미터와 3D 곡선 렌더링 배우기
3. **[인터랙션](../../interaction/index.md)** : 마우스와 터치를 통한 객체 상호작용 배우기

---

## 관련 예제

- [TextField3D 기본](/RedGPU/examples/3d/textField/textField3D/)
- [TextField3D 크기 모드 비교](/RedGPU/examples/3d/textField/textField3DCompare/)
- [TextField2D 기본](/RedGPU/examples/2d/textField2D/basic/)

---

## 다음 단계

- **[TextField3D](./textfield3d.md)** : 3D 월드 내에 텍스트 배치 및 크기 모드 제어하기
