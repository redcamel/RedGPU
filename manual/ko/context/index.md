---
title: RedGPU Context
description: RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onSuccess 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 커스텀 클래스 적용
        class Init,Render mermaid-system;
        class Callback mermaid-main;
`
</script>

# RedGPUContext

**RedGPUContext** 는 RedGPU 엔진이 동작하는 기반이 되는 최상위 컨텍스트 객체입니다.
복잡한 WebGPU 초기화 과정을 대신 처리하며, 디바이스, 어댑터, 캔버스, 리소스 및 렌더링에 필요한 다양한 매니저 객체들을 관리하는 중심 역할을 수행합니다.

> [!WARNING]
> `RedGPUContext` 는 `RedGPU.init()` 에 의해 내부적으로 자동 생성됩니다.<br/>
> 개발자가 직접 `new` 키워드를 사용하여 인스턴스를 생성하면 안 됩니다.

---

## 1. 역할과 주요 기능

RedGPUContext는 엔진의 전반적인 상태를 관리하며 다음과 같은 기능을 제공합니다.

| 기능 분류                                                                    | 설명                                                                                            |
|:-------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------|
| **디바이스 및 어댑터 관리**(Device & Adapter Management)                           | 브라우저와 GPU 하드웨어 간의 통신 및 연산 자원을 제어합니다.                                                          |
| **화면 크기 및 스케일 제어**(Canvas Size & Scale Control)                          | 캔버스의 실제 물리 해상도와 CSS 픽셀 해상도, 그리고 렌더 스케일( `renderScale` ) 을 유연하게 조정합니다.                         |
| **리소스 제어**(Resource Control)                                             | 텍스처, 메시, 재질, 버퍼 등 GPU 리소스를 통합적으로 관리하는 `resourceManager` 를 제공합니다.                              |
| **렌더링 품질 제어**(Rendering Quality Control)                                 | 계단 현상을 방지하는 MSAA, FXAA, TAA 설정을 관리하는 `antialiasingManager` 를 활용할 수 있습니다.                      |
| **커맨드 최적화 및 패스 수명 관리**(Command Optimization & Pass Lifecycle Management) | GPU 명령의 안전하고 효율적인 일괄 기록 및 제출을 위해 `commandEncoderManager` 를 제공합니다.                             |
| **이벤트 버퍼링**(Event Buffering)                                             | 실시간 화면 크기 변경 감지( `onResize` ), 마우스/터치 좌표 피킹 연동, 키보드 입력 상태 버퍼링( `keyboardKeyBuffer` ) 을 지원합니다. |

---

## 2. 초기화 프로세스

WebGPU 환경을 구축하기 위해 `RedGPU.init` 함수를 호출하여 비동기적으로 컨텍스트를 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

```javascript
import * as RedGPU from "dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// RedGPU 초기화 요청
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 초기화 성공 시 redGPUContext 인스턴스를 획득합니다.
        console.log('RedGPUContext 준비 완료:', redGPUContext);

      // 배경색을 검은색으로 지정
      redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
    },
    (failReason) => {
        // 초기화 실패 시 (WebGPU 미지원 등) 처리
        console.error('초기화 실패:', failReason);
    }
);
```

---

## 3. 핵심 API 명세

### 3.1 뷰 등록과 관리

`RedGPUContext` 는 화면에 요소를 렌더링하기 위해 **[View3D](../api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.md)
** 객체 목록을 관리하는 컨테이너 역할을 수행합니다. 등록된 뷰들은 순서대로 렌더링 파이프라인에서 처리됩니다.
이 인터페이스는 `RedGPUContextViewContainer` 를 상속받아 구현되었습니다.

| 메서드 / 속성                      | 설명                                           |
|:------------------------------|:---------------------------------------------|
| `viewList`                    | 등록된 모든 뷰의 목록을 반환합니다. (읽기 전용, `View3D[]`)     |
| `numViews`                    | 현재 컨테이너가 소유하고 있는 뷰의 개수입니다. (읽기 전용, `number`) |
| `addView(view)`               | 렌더링할 뷰를 등록합니다.                               |
| `addViewAt(view, index)`      | 특정 인덱스 위치에 뷰를 추가합니다.                         |
| `removeView(view)`            | 등록된 뷰를 제거합니다.                                |
| `removeViewAt(index)`         | 특정 인덱스의 뷰를 제거합니다.                            |
| `removeAllViews()`            | 등록된 모든 뷰를 제거합니다.                             |
| `getViewAt(index)`            | 지정된 인덱스에 있는 뷰를 반환합니다. (`View3D`)             |
| `getViewIndex(view)`          | 특정 뷰의 인덱스 번호를 반환합니다. (`number`)              |
| `setViewIndex(view, index)`   | 등록된 뷰의 렌더링 순서(인덱스)를 변경합니다.                   |
| `swapViews(view1, view2)`     | 두 뷰의 렌더링 위치를 서로 바꿉니다.                        |
| `swapViewsAt(index1, index2)` | 지정한 인덱스에 위치한 두 뷰를 서로 바꿉니다.                   |
| `contains(view)`              | 입력된 뷰가 현재 컨텍스트에 등록되어 있는지 확인합니다. (`boolean`)  |

---

### 3.2 화면 크기 및 해상도 최적화

RedGPUContext는 HTML 캔버스 요소의 화면 레이아웃 크기(CSS 픽셀 단위) 변화를 감지하고 렌더링 해상도를 자동으로 최적화합니다.

#### 주요 스펙 및 메서드

- **`width` / `height`** (`number | string`): 캔버스의 너비와 높이 값을 직접 변경하거나 가져올 수 있습니다. `'100%'`, `'800px'`, `600`과 같은 형식을 모두
  지원합니다.
- **`setSize(width, height)`**: 가로/세로 크기를 한 번에 지정합니다.
- **`renderScale`** (`number`): 화면의 렌더링 해상도 배율을 결정합니다. 기본값은 `1`이며, 모바일 기기에서의 성능 최적화를 위해 해상도를 낮추고 싶다면 `0.5` 등으로 조절할 수
  있습니다.
- **`screenRectObject`** (`IRedGPURectObject`): CSS 픽셀 기준 캔버스의 영역 정보 `{ x, y, width, height }`를 제공합니다.
- **`pixelRectObject`** (`IRedGPURectObject`): 물리 픽셀 기준 캔버스의 실제 렌더 해상도 정보 `{ x, y, width, height }`를 제공합니다.

#### `onResize` 이벤트 콜백

캔버스 크기가 조절되거나 `setSize` 가 호출되어 크기가 변경될 때, `onResize` 콜백을 등록하여 카메라 종횡비 변경 등의 추가 연산을 수행할 수 있습니다. 매개변수로 전달되는 `event` 객체는
`RedResizeEvent<RedGPUContext>` 인터페이스를 따릅니다.

```javascript
redGPUContext.onResize = (event) => {
    // event.target은 RedGPUContext 인스턴스를 가리킵니다.
    const { width, height } = event.screenRectObject; // CSS 픽셀 단위
    const { width: pWidth, height: pHeight } = event.pixelRectObject; // 물리 픽셀 단위
    
    console.log(`CSS 크기: ${width}x${height}, 실제 물리 해상도: ${pWidth}x${pHeight}`);
    
    // 예: 현재 뷰들의 카메라 종횡비를 재배치하고 싶을 때
    redGPUContext.viewList.forEach((view) => {
        view.camera.aspect = width / height;
    });
};
```

---

### 3.3 속성 목록

| 속성명                     | 타입                                                                                                                               | 설명                                                    |
|:------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------|
| `backgroundColor`       | [ColorRGBA](../api/RedGPU-API/namespaces/RedGPU/namespaces/Color/classes/ColorRGBA.md)                                           | 캔버스의 배경색을 결정합니다. (기본값: 검은색 `0, 0, 0, 1`)              |
| `alphaMode`             | `GPUCanvasAlphaMode`                                                                                                             | 캔버스 알파 합성 모드(`'opaque'` 또는 `'premultiplied'`)를 제어합니다. |
| `keyboardKeyBuffer`     | `{ [key: string]: boolean }`                                                                                                     | 현재 활성화된(눌려 있는) 키보드 키 상태를 갖는 실시간 버퍼입니다.                |
| `detector`              | [RedGPUContextDetector](../api/RedGPU-API/namespaces/RedGPU/namespaces/Context/namespaces/Core/classes/RedGPUContextDetector.md) | 모바일 기기 여부, 브라우저 스펙 등 사용자 기기 환경을 조회합니다. (읽기 전용)        |
| `resourceManager`       | [ResourceManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/namespaces/Core/classes/ResourceManager.md)            | GPU 리소스를 등록하고 캐싱하며 메모리 수명을 관리합니다. (읽기 전용)             |
| `antialiasingManager`   | [AntialiasingManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Antialiasing/classes/AntialiasingManager.md)                | 엔진 전체의 안티앨리어싱(MSAA 등) 설정을 제어합니다. (읽기 전용)              |
| `commandEncoderManager` | [CommandEncoderManager](../api/RedGPU-API/namespaces/RedGPU/classes/CommandEncoderManager.md)                                    | GPU 명령어를 기록하고 제출하는 커맨드 인코더 관리자입니다. (읽기 전용)            |
| `gpuDevice`             | `GPUDevice`                                                                                                                      | WebGPU의 가장 핵심적인 논리 장치 객체입니다. (읽기 전용)                  |
| `gpuAdapter`            | `GPUAdapter`                                                                                                                     | 연결된 물리 GPU 하드웨어 정보 객체입니다. (읽기 전용)                     |
| `gpuContext`            | `GPUCanvasContext`                                                                                                               | HTML 캔버스와 연결된 WebGPU 전용 컨텍스트입니다. (읽기 전용)              |
| `htmlCanvas`            | `HTMLCanvasElement`                                                                                                              | 렌더링에 사용 중인 실제 DOM 캔버스 요소입니다. (읽기 전용)                  |

#### 기타 메서드

- **`destroy()`** : WebGPU 리소스를 모두 폐기하고 연결된 GPU 디바이스를 해제합니다.

---

### 3.4 주요 매니저 객체

RedGPUContext는 엔진 전체의 안정적이고 효율적인 자원 운용을 위해 용도별로 고안된 **5가지 주요 매니저** 인스턴스를 소유하고 있습니다.

#### 1) 리소스 매니저 (`resourceManager`)

- **타입
  **: [ResourceManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/namespaces/Core/classes/ResourceManager.md)
- **역할**: WebGPU 셰이더 모듈, 버퍼, 바인드 그룹 레이아웃, 텍스처 뷰 캐시 및 리소스 상태를 통합 관리하고 캐싱합니다.
- **주요 기능**:
  - `createGPUShaderModule(name, descriptor)` / `getGPUShaderModule(name)` : WGSL 프리프로세서가 적용된 셰이더 생성 및 조회.
  - `createBindGroupLayout(name, descriptor)` / `getGPUBindGroupLayout(name)` : 바인드 그룹 레이아웃 캐싱 관리.
  - `getGPUResourceBitmapTextureView(texture)` / `getGPUResourceCubeTextureView(cubeTexture)` : 텍스처 뷰 캐싱 및 재사용을 통한 성능
    최적화.
  - IBL(Image-Based Lighting) 및 밉맵 생성을 담당하는 제너레이터 제공 ( `brdfGenerator`, `mipmapGenerator` 등).
  - 엔진 전체에서 공유하는 기본 샘플러 제공 ( `basicSampler`, `basicDisplacementSampler` ).

#### 2) 환경 감지 매니저 (`detector`)

- **타입
  **: [RedGPUContextDetector](../api/RedGPU-API/namespaces/RedGPU/namespaces/Context/namespaces/Core/classes/RedGPUContextDetector.md)
- **역할**: 사용자 기기의 HW 스펙, 플랫폼, 브라우저 엔진 및 WebGPU 한계 사양(Limits/Features)을 분석합니다.
- **주요 기능**:
  - 모바일 및 OS 유형 감지 ( `isMobile`, `isIOS`, `isAndroid` ).
  - 브라우저 유형 감지 ( `isChromium`, `isSafari`, `isFirefox` ).
  - 기기 정보 조회 ( `hardwareConcurrency` 코어 개수, `deviceMemory` 메모리 용량).
  - WebGPU 지원 한계 및 상세 프로파일링 보고서 생성 ( `toReport()` ).

#### 3) 안티앨리어싱 매니저 (`antialiasingManager`)

- **타입
  **: [AntialiasingManager](../api/RedGPU-API/namespaces/RedGPU/namespaces/Antialiasing/classes/AntialiasingManager.md)
- **역할**: 계단 현상을 방지하기 위해 렌더링 파이프라인에서 사용할 안티앨리어싱(Anti-aliasing) 방식을 중앙 제어합니다.
- **주요 기능**:
  - 다중 샘플링 활성화 ( `useMSAA` ).
  - 빠른 근사 안티앨리어싱 활성화 ( `useFXAA` ).
  - 시간차 안티앨리어싱 활성화 ( `useTAA` ).
  - 디바이스의 화소 밀도( `devicePixelRatio` ) 에 맞추어 기본 적용 모드를 지능적으로 자동 선택합니다.

#### 4) 커맨드 인코더 매니저 (`commandEncoderManager`)

- **타입**: [CommandEncoderManager](../api/RedGPU-API/namespaces/RedGPU/classes/CommandEncoderManager.md)
- **역할**: GPU 명령어를 기록하는 `GPUCommandEncoder` 와 렌더/컴퓨트 패스의 생명주기를 단계별로 관리하여 실행 효율을 극대화합니다.
- **주의**: 이 클래스는 시스템 내부에서 자동으로 초기화하므로 사용자가 직접 `new` 키워드로 생성하지 말아야 합니다.
- **주요 기능**:
  - 단계별 패스 일괄 등록 및 최적화 ( `Resource` -> `PreProcess` -> `Main` -> `PostProcess` ).
  - 패스가 활성화된 동안 중첩 호출이 일어날 경우 새로운 인코더를 자동 분할 생성하여 안전성 보장.
  - 즉시 실행 및 제출 지원 ( `immediateRenderPass`, `immediateComputePass`, `immediateSubmit` ).
  - 커맨드가 성공적으로 실행된 안전한 시점에 GPU 자원을 반환하는 지연 파괴( `addDeferredDestroy` ) 기능 제공.
  - 단일 큐 제출( `submitAll()` ) 및 렌더링 파이프라인 단계별 실시간 통계 리포트 반환.

---

## 4. 컨텍스트 주입의 필요성

RedGPU의 거의 모든 3D 객체(메시, 지오메트리, 텍스처, 재질 등)는 생성자 첫 번째 인자로 `redGPUContext` 를 요구합니다.

각 그래픽 객체는 GPU 메모리를 동적으로 할당받아야 하는데, 이때 **"어느 GPU 디바이스( `gpuDevice` ) 를 사용하여 리소스를 생성할 것인가"** 에 대한 연결 기준이 바로
`RedGPUContext` 가 되기 때문입니다.

```javascript
// [O] 올바른 방법: 생성 시 항상 첫 번째 인자로 컨텍스트를 주입합니다.
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] 잘못된 방법: 컨텍스트를 전달하지 않으면 에러가 발생합니다.
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## 핵심 요약

- **엔진의 컨트롤 타워**: `RedGPU.init` 을 통해 비동기적으로 준비되며, 디바이스, 어댑터, 캔버스를 통합 제어합니다.
- **상위 컨테이너**: 여러 개의 `View3D` 를 등록하고 조작하여 레이어드 렌더링을 가능하게 합니다.
- **리소스의 기준**: 생성되는 모든 그래픽 자원(버퍼, 재질, 텍스처)의 생성 기준으로 사용되므로 필수 주입 대상입니다.
- **크기 및 스케일 제어**: 화면 크기 변화에 연동해 자동으로 해상도를 갱신하고 스케일 조절을 편리하게 제공합니다.

---

## 다음 단계

RedGPUContext를 통해 엔진을 구동할 준비를 마쳤습니다. 하지만 아직 화면은 비어있습니다.

이제 빈 캔버스 위에 **카메라**(Camera) 를 배치하고, 물체를 담을 **공간**(Scene) 을 정의하여 실제 3D 세계를 구성하는 방법을 알아볼 차례입니다.

- **[화면 구성](../view-system/)**