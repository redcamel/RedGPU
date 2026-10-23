---
title: Sprite & SpriteSheet
order: 3
---

# 스프라이트

RedGPU의 스프라이트 시스템은 3D 공간 (`View3D`)과 2D 화면 (`View2D`)에서 2D 이미지 및 프레임 애니메이션을 렌더링합니다. 항상 카메라를 정면으로 바라보는 **빌보드**(Billboard)
기능과 텍스처 종횡비 자동 조절을 기본 지원합니다.

## 1. 주요 구성 요소

| 클래스                | 네임스페이스     | 설명                                                                                         |
|:----------------------|:-----------------|:---------------------------------------------------------------------------------------------|
| **`Sprite3D`**        | `RedGPU.Display` | 3D 공간에서 단일 이미지를 표시하는 빌보드 스프라이트 객체                                    |
| **`SpriteSheet3D`**   | `RedGPU.Display` | 3D 공간에서 프레임 애니메이션을 재생하는 스프라이트 시트 객체                                |
| **`Sprite2D`**        | `RedGPU.Display` | `View2D` 픽셀 좌표계에 배치되는 2D 스프라이트 객체                                           |
| **`SpriteSheet2D`**   | `RedGPU.Display` | `View2D` 픽셀 좌표계에서 프레임 애니메이션을 재생하는 2D 스프라이트 시트 객체                |
| **`SpriteSheetInfo`** | `RedGPU.Display` | 스프라이트 시트의 격자 구조(가로·세로 세그먼트, 총 프레임 수, FPS 등)를 정의하는 데이터 객체 |

---

## 학습 로드맵

1. **[Sprite3D](./sprite.md)** : 단일 이미지를 이용한 3D 빌보드 스프라이트 구성
2. **[SpriteSheet3D](./spritesheet.md)** : 스프라이트 시트를 활용한 프레임 애니메이션 제어

---

## 관련 예제

- [Sprite3D 기본](/RedGPU/examples/3d/sprite/sprite3D/)
- [SpriteSheet3D 기본](/RedGPU/examples/3d/sprite/spriteSheet3D/)
- [Sprite2D 기본](/RedGPU/examples/2d/sprite2D/basic/)
- [SpriteSheet2D 기본](/RedGPU/examples/2d/spriteSheet2D/basic/)

---

## 다음 단계

- **[Sprite3D](./sprite.md)** : 단일 이미지를 이용한 3D 빌보드 스프라이트 구성 배우기
