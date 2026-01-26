---
title: Text Field
order: 1
---

# 텍스트 필드 (Text Field)

RedGPU는 3D 공간에서 텍스트를 편리하게 렌더링할 수 있는 **TextField** 시스템을 제공합니다. HTML/SVG 기술을 내부적으로 활용하여 복잡한 폰트 스타일과 효과를 GPU 가속 기반으로 출력합니다.

## 1. 주요 특징

- **HTML/SVG 기반**: 웹 개발자에게 익숙한 CSS 스타일(폰트, 색상, 정렬 등)을 그대로 사용할 수 있습니다.
- **공간 배치**: 3D 월드 내 실제 좌표에 배치되는 **TextField3D**를 지원합니다.
- **자동 크기 조절**: 텍스트 내용과 스타일에 맞춰 객체의 크기가 자동으로 갱신됩니다.
- **빌보드(Billboard) 지원**: 텍스트가 항상 카메라를 바라보게 설정할 수 있습니다.

## 2. 핵심 스타일 속성

텍스트 필드 객체는 다음과 같은 스타일 속성을 제공합니다.

| 속성 | 설명 | 기본값 |
| :--- | :--- | :--- |
| `text` | 출력할 문자열 (`<br/>` 지원) | `""` |
| `fontSize` | 폰트 크기 (px) | `16` |
| `fontFamily` | 폰트 종류 | `"Arial"` |
| `color` | 글자 색상 (Hex, RGB 등) | `"#fff"` |
| `background` | 배경색 및 투명도 | `"transparent"` |
| `textAlign` | 텍스트 정렬 (`left`, `center`, `right`) | `"center"` |
| `padding` | 여백 (px) | `0` |

::: info [HTML 태그 지원]
`text` 속성에 `<br/>` 태그를 사용하여 줄바꿈을 처리할 수 있습니다.
:::

## 다음 학습 로드맵

1.  **[TextField3D](./textfield3d.md)**: 3D 월드 내에 텍스트 배치하고 제어하기
2.  **[인터렉션 (Interaction)](../../interaction/index.md)**: 마우스와 터치를 통한 상호작용 배우기

---

[다음 단계: TextField3D 배우기](./textfield3d.md)
