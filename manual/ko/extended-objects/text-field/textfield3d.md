---
title: TextField3D
order: 3
---

# TextField3D

**`TextField3D`** 는 3D 공간 상의 실제 좌표 (`x, y, z`)에 배치되는 텍스트 객체입니다. 월드 내의 표지판, 캐릭터 머리 위의 이름표, 또는 특정 객체에 부착된 설명문 등을 만들 때
유용합니다.

## 1. 기본 사용법

`TextField3D` 는 일반적인 `Mesh` 와 동일하게 다루어지며, 3D 공간 내에 물리적으로 위치합니다.

```javascript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "3D World Text");
textField.y = 5; // 공중에 배치
scene.addChild(textField);
```

## 2. 빌보드 (Billboard) 및 크기 제어

3D 텍스트는 카메라의 위치에 따라 측면이나 뒷면이 보일 수 있습니다. 텍스트를 항상 정면으로 보이게 하려면 **Billboard** 기능을 활성화하며, 필요에 따라 월드 단위 크기나 고정된 픽셀 크기를 설정할 수
있습니다.

| 속성명             | 설명                                                                                               | 기본값  |
|:-------------------|:---------------------------------------------------------------------------------------------------|:--------|
| **`useBillboard`** | 활성화 시 카메라가 회전해도 항상 텍스트가 정면을 향합니다.                                         | `true`  |
| **`worldSize`**    | 월드 공간에서의 세로 크기 (Unit 단위). 가로 크기는 텍스트 길이에 맞춰 자동 조절됩니다.             | `1`     |
| **`usePixelSize`** | 고정 픽셀 크기 모드 사용 여부. `true`일 경우 거리에 관계없이 렌더링된 물리 픽셀 크기로 표시됩니다. | `false` |

```javascript
// 1. 월드 단위 크기 설정 (거리에 따라 작아짐)
textField.worldSize = 2;

// 2. 고정 픽셀 크기 설정 (거리에 관계없이 가독성 유지)
textField.usePixelSize = true;
```

## 3. 월드 사이즈와 픽셀 사이즈 (폰트)의 관계

`TextField3D`에서 텍스트의 크기와 선명도를 결정하는 세 가지 핵심 속성의 관계를 이해하는 것이 중요합니다.

### 3.1 폰트 사이즈 (`fontSize`)

- **역할**: 내부적으로 텍스트를 비트맵으로 그릴 때의 **해상도**(품질)를 결정합니다.
- **특징**: `fontSize`가 클수록 더 크고 선명한 원본 텍스처가 생성됩니다. 3D 공간에서의 물리적 크기를 직접 결정하기보다는, 출력물의 '화질'을 결정하는 요소로 이해해야 합니다.

### 3.2 월드 사이즈 (`worldSize`)

- **역할**: 3D 월드 공간 내에서의 **물리적 세로 높이**(Unit 단위)를 결정합니다.
- **동작**: `usePixelSize`가 `false`일 때 작동하며, 카메라와의 거리에 따라 원근감이 적용되어 크기가 변합니다.

### 3.3 고정 픽셀 모드 (`usePixelSize`)

- **역할**: 3D 공간에 위치하지만, 화면에는 **실제 렌더링된 픽셀 크기** 그대로 표시합니다.
- **폰트와의 관계**: 이 모드가 활성화되면 `worldSize`는 무시되고, `fontSize`에 의해 생성된 실제 텍스처의 높이가 화면상의 출력 크기가 됩니다. 따라서 아이콘이나 이름표처럼 거리에 상관없이
  일정한 가독성을 유지해야 할 때 매우 유용합니다.

::: tip [최적화 팁]
`usePixelSize`를 사용할 때 텍스트가 너무 크거나 작게 보인다면 `worldSize`가 아닌 `fontSize`를 조절하십시오. 반대로 일반적인 3D 오브젝트처럼 동작해야 한다면 `fontSize`는
텍스처의 선명도를 위해 적절히 높은 값 (예: 24~48)으로 두고, 실제 크기는 `worldSize`로 조절하는 것이 좋습니다.
:::

## 4. 실습 예제: 스타일 및 크기 모드 비교

다양한 폰트 스타일 옵션과 함께, 월드 사이즈 (`worldSize`) 모드 및 고정 픽셀 (`usePixelSize`) 모드의 차이를 직접 확인해 보세요.

<iframe src="/RedGPU/examples/3d/textField/textField3D/" style="width:100%; height:500px;"></iframe>

---

## 관련 예제

- [TextField3D 기본](/RedGPU/examples/3d/textField/textField3D/)
- [TextField3D 크기 모드 비교](/RedGPU/examples/3d/textField/textField3DCompare/)
- [TextField3D 마우스 이벤트](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)

---

## 다음 단계

사용자의 입력에 반응하는 역동적인 콘텐츠를 만들기 위해 인터렉션 시스템을 알아봅니다.

- **[인터렉션](../../interaction/index.md)**