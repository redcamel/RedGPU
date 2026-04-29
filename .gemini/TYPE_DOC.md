# RedGPU TypeDoc 주석 작성 가이드 (Professional)


# TypeDoc 주석 작성 규칙 (Professional)
## 0. 원본 로직 코드는 무조건 유지(필수)
## 0.1 원본 임포트 경로도 무조건 유지(필수)
## 0.2 <iframe> 이 존재할경우 해당라인은 유지(필수)
## 0.3 제네릭 타입표현의 백틱 사용 (중요)
VitePress는 마크다운 내부의 `<...>`를 HTML 태그로 해석하려 시도합니다. `Array<number>`, `Map<string, any>`와 같은 제네릭 타입 표현이 주석에 포함될 경우, 반드시 백틱(backtick)으로 감싸서 코드 형식으로 작성해야 합니다. 이를 생략할 경우 VitePress 빌드 시 "Element is missing end tag" 에러가 발생합니다.

**작성 예시:**
- 잘못된 예: [KO] 인덱스 데이터 (Array<number> 또는 Uint32Array)
- 올바른 예: [KO] 인덱스 데이터 (`Array<number>` 또는 `Uint32Array`)


## 1. 기본 원칙

### 1.1 태그 작성 순서 (중요)
TypeDoc 주석의 태그는 다음 순서로 작성합니다:

1. 클래스/함수 설명 (다국어)
2. `@example` - 사용 예시 **(반드시 다른 모든 태그보다 앞에 위치)**
3. `@param` - 매개변수
4. `@returns` - 반환값
5. `@throws` - 예외
6. `@typeParam` - 제네릭 타입
7. `@see` - 관련 항목 참조
8. `@deprecated` - 폐기 예정
9. `@since` - 버전 정보
10. `@category` - 카테고리 (가장 마지막)

### 1.2 다국어 태그 (필수)
모든 주석은 `[KO]`, `[EN]` 태그로 한국어와 영어를 병기합니다.
문서 빌드 시 `buildScripts/github/filterLanguageFiles.js`에 의해 선택된 언어만 남고 반대 언어 태그와 내용은 자동 삭제됩니다.

**작성 규칙:**
- **줄바꿈 병기**: 클래스/함수 설명뿐만 아니라 `@param`, `@returns`, `@throws`, `@typeParam` 등 모든 태그의 설명은 `[KO]`와 `[EN]`을 별도의 줄에 작성합니다.

```typescript
/**
 * [KO] 인스턴스 고유 ID
 * [EN] Instance unique ID
 * * ### Example
 * ```typescript
 * const id = instance.instanceId;
 * ```
*
* @param hex -
* [KO] 16진수 색상
* [EN] Hex color
  */
  #instanceId: number;
```

### 1.3 클래스 설명 원칙
클래스 설명은 **"무엇을 하는가(What)"**에 집중하고, **"어떻게 구현되었는가(How)"**는 제외합니다.

```typescript
/**
 * [KO] 직교 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses orthographic projection.
 *
 * [KO] 이 투영 모드에서는 객체의 크기가 카메라로부터의 거리에 관계없이 일정하게 유지됩니다.
 * [EN] In this projection mode, an object's size stays constant regardless of its distance from the camera.
 * * ### Example
 * ```typescript
 * const camera = new RedGPU.RedOrthographicCamera();
 * ```
*
* @category Camera
  */
  export class RedOrthographicCamera extends RedCamera {
  // ...
  }
```

### 1.4 iframe 보존 (중요)
TypeDoc 주석 내에 예제 실행을 위한 `<iframe>` 태그가 존재하는 경우, **절대로 삭제하거나 수정하지 않고 그대로 유지**해야 합니다. 주로 `@example` 태그 하단에 위치합니다.

### 1.5 자동 생성 클래스 (Manager/System) 문서화
`LightManager`나 `PostEffectManager`처럼 시스템 내부에서 자동으로 생성되고 관리되는 클래스는 다음 형식을 엄격히 준수합니다:

1.  **"자동 생성됨" 명시**: 클래스 설명에 내부적으로 자동 생성됨을 명시합니다.
2.  **"직접 생성 금지" 경고**: 다국어 태그(`[KO]`, `[EN]`) 뒤에 `* ::: warning`을 시작하여 경고를 작성하고, 마지막 줄에 `* :::`를 추가하여 블록을 닫습니다.
3.  **올바른 접근 예시**: `@example`에서 부모 객체를 통한 접근 방법(예: `scene.lightManager`)을 제시합니다.
5.  **contructor 예시** 시스템 내부에서 자동생성될경우 constructor에 example을 생성하지 않아야 합니다.

**작성 예시:**
```typescript
/**
 * [KO] 씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
 * [EN] Class that manages all lights within a scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // 올바른 접근 방법 (Correct access)
 * const lightManager = scene.lightManager;
 * ```
 * @category Light
 */
```

### 1.6 Re-export 파일 (index.ts) 문서화
모듈을 다시 내보내는(re-export) 역할을 하는 `index.ts` 파일은 TypeDoc 생성 대상에 포함되도록 `@packageDocumentation` 태그를 사용해야 합니다.
단순히 "모듈을 내보냅니다"라고 적는 것을 지양하고, **해당 폴더가 포함하는 주요 기능이나 클래스들의 역할을 종합하여 구체적이면서도 간결하게 설명**해야 합니다.

**작성 규칙:**
- 파일 최상단에 주석 작성
- `[KO]`, `[EN]` 태그로 모듈 설명 병기
- `@packageDocumentation` 태그 필수 포함
- **내용**: 해당 모듈이 제공하는 핵심 기능 요약 (예: "MSAA, FXAA, TAA 등 다양한 안티앨리어싱 기법과 이를 관리하는 매니저를 제공합니다.")

**작성 예시:**
```typescript
/**
 * [KO] MSAA, FXAA, TAA 등 다양한 안티앨리어싱 기법과 이를 관리하는 매니저를 제공합니다.
 * [EN] Provides various anti-aliasing techniques such as MSAA, FXAA, TAA, and a manager to handle them.
 * @packageDocumentation
 */
export * from "./AntialiasingManager";
```

---

## 2. 필수 태그

### 2.1 @example - 사용 예시 (최우선 배치)
**`@example` 태그는 반드시 클래스/함수 설명 직후, `@param`, `@returns` 등 다른 모든 태그보다 앞에 위치해야 합니다.**

공개 API는 가능한 사용 예시를 제공합니다. `* ### Example` 형식을 사용합니다.
**중요: 모든 예시 코드는 `RedGPU` 네임스페이스와 하위 네임스페이스(예: util, math 등)를 포함한 전체 경로로 작성해야 합니다.**

```typescript
/**
 * [KO] 렌더링 파이프라인을 생성합니다.
 * [EN] Creates a rendering pipeline.
 * * ### Example
 * ```typescript
 * const pipeline = new RedGPU.RedPipeline(device, {
 *     vertexShader: vsCode,
 *     fragmentShader: fsCode
 * });
 * ```
*
* @param device -
* [KO] WebGPU 디바이스
* [EN] WebGPU device
* @category Rendering
  */
```

### 2.2 @param - 매개변수 문서화
모든 함수/메서드의 매개변수는 타입, 설명, 선택/필수 여부를 명시하며, `[KO]`와 `[EN]`을 **줄바꿈으로 병기**합니다.
**`@param`은 반드시 `@example` 뒤에 위치합니다.**

**중요: `@param` 작성 시 매개변수 이름 뒤에 반드시 ` - ` (공백-하이픈-공백)을 추가해야 합니다.**

```typescript
/**
 * [KO] 새로운 메시를 생성합니다.
 * [EN] Creates a new mesh.
 * * ### Example
 * ```typescript
 * const mesh = createMesh(geometry, material, "MyMesh");
 * ```
*
* @param geometry -
* [KO] 메시의 지오메트리
* [EN] Geometry of the mesh
* @param material -
* [KO] 메시의 재질
* [EN] Material of the mesh
* @param name -
* [KO] 메시 이름 (선택)
* [EN] Mesh name (optional)
  */
  createMesh(geometry: RedGeometry, material: RedMaterial, name?: string): RedMesh {
  // ...
  }
```

### 2.3 @returns - 반환값 문서화
함수의 반환값이 있는 경우 반드시 명시하며, `[KO]`와 `[EN]`을 **줄바꿈으로 병기**합니다.
**`@returns`는 반드시 `@example`과 `@param` 뒤에 위치합니다.**

```typescript
/**
 * [KO] 현재 뷰 행렬을 반환합니다.
 * [EN] Returns the current view matrix.
 * * ### Example
 * ```typescript
 * const viewMatrix = camera.getViewMatrix();
 * ```
*
* @returns
* [KO] 4x4 뷰 변환 행렬
* [EN] 4x4 view transformation matrix
  */
  getViewMatrix(): mat4 {
  return this.#viewMatrix;
  }
```

### 2.4 @category - 카테고리 분류
클래스, 인터페이스, 주요 타입은 카테고리로 분류합니다. (가장 마지막에 작성)

---

## 3. 고급 태그

### 3.1 @default / @defaultValue - 기본값
프로퍼티나 매개변수의 기본값을 명시합니다.

### 3.2 @typeParam - 제네릭 타입 매개변수
제네릭 클래스/함수는 타입 매개변수를 설명하며, `[KO]`와 `[EN]`을 **줄바꿈으로 병기**합니다.

### 3.3 @throws - 예외 처리
함수가 예외를 발생시킬 수 있는 경우 명시하며, `[KO]`와 `[EN]`을 **줄바꿈으로 병기**합니다.

### 3.4 @see - 관련 항목 및 예제 참조
관련된 클래스, 메서드 또는 외부 예제 링크를 제공할 때 사용합니다.

**작성 규칙:**
1. **설명문 병기**: 여러 링크를 제공하기 전, 해당 항목들에 대한 통합 설명을 `[KO]`, `[EN]` 태그와 함께 줄바꿈하여 작성할 수 있습니다.
2. **링크 형식**: 예제 링크는 마크다운 링크 형식 `[제목](경로)`을 사용합니다.
3. **다중 태그**: 각 링크나 설명 세트는 개별적인 `@see` 태그로 작성하거나, 설명 바로 뒤에 링크를 나열합니다.

**작성 예시:**
```typescript
 * @see
 * [KO] 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Skybox.
 * @see [Skybox using HDRTexture](/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 * @see [Skybox using IBL](/RedGPU/examples/3d/skybox/skyboxWithIbl/)
```

### 3.5 @deprecated - 폐기 예정 API
더 이상 사용하지 않을 API를 표시하고 대안을 제시하며, 줄바꿈으로 병기합니다.

---

## 4. 복잡한 예시

### 4.1 완전한 클래스 문서화 예시
```typescript
/**
 * [KO] WebGPU 기반 3D 렌더러 클래스입니다.
 * [EN] WebGPU-based 3D renderer class.
 * 
 * [KO] 씬 그래프를 GPU에 렌더링하며, 포워드/디퍼드 렌더링을 지원합니다.
 * [EN] Renders scene graphs to GPU, supporting both forward and deferred rendering.
 * * ### Example
 * ```typescript
 * const renderer = new RedGPU.RedRenderer({
 *     canvas: document.getElementById('canvas'),
 *     antialias: true
 * });
 * 
 * renderer.render(scene, camera);
 * ```
*
* @since 1.0.0
* @category Rendering
  */
  export class RedRenderer {
  /**
  * [KO] WebGPU 디바이스 인스턴스
  * [EN] WebGPU device instance
  * @readonly
    */
    readonly device: GPUDevice;

/**
* [KO] 현재 렌더링 모드
* [EN] Current rendering mode
* @defaultValue 'forward'
  */
  renderMode: RenderMode = 'forward';

/**
* [KO] 렌더러를 초기화합니다.
* [EN] Initializes the renderer.
* * ### Example
* ```typescript
* const renderer = new RedGPU.RedRenderer({
*     canvas: myCanvas,
*     antialias: true,
*     sampleCount: 4
* });
* ```
*
* @param options -
* [KO] 렌더러 초기화 옵션
* [EN] Renderer initialization options
* @throws
* [KO] WebGPU를 지원하지 않는 브라우저에서 Error 발생
* [EN] Throws Error if WebGPU is not supported
  */
  constructor(options: RedRendererOptions) {
  // ...
  }

/**
* [KO] 씬을 렌더링합니다.
* [EN] Renders the scene.
* * ### Example
* ```typescript
* const frameInfo = renderer.render(scene, camera);
* console.log(`Frame time: ${frameInfo.frameTime}ms`);
* ```
*
* @param scene -
* [KO] 렌더링할 씬
* [EN] Scene to render
* @param camera -
* [KO] 렌더링에 사용할 카메라
* [EN] Camera to use for rendering
* @returns
* [KO] 렌더링된 프레임 정보
* [EN] Rendered frame information
* @fires RedRenderer#renderComplete
* @see {@link RedScene}
* @see {@link RedCamera}
  */
  render(scene: RedScene, camera: RedCamera): FrameInfo {
  // ...
  }
  }
```

---

## 5. 주석 작성 체크리스트

- [ ] `[KO]`, `[EN]` 태그 사용
- [ ] `@example`을 **모든 다른 태그보다 앞에** 배치
- [ ] `@param`: 매개변수 이름 뒤 ` - ` (공백-하이픈-공백) 필수 추가
- [ ] `@param`, `@returns`, `@throws`: 줄바꿈 병기
- [ ] `@category`: 클래스/인터페이스/주요 타입에 필수 추가 (가장 마지막)
- [ ] `@example`: 호출 시 `RedGPU.Namespace` 형태의 전체 경로 사용 확인
- [ ] 코드로 확인 가능한 불필요한 설명 제거