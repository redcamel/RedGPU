---
적용: 항상
---

# [TypeDoc 작성 지침]

1. 한국어 우선: 모든 설명과 주석은 한국어로 작성하여 국내 개발자가 이해하기 쉽게 할 것.
2. TSDoc 표준 준수: `@param`, `@returns`, `@throws`, `@example` 등 표준 태그를 반드시 포함할 것.
3. 구체적인 예제(@example):
    - 단순 호출뿐만 아니라 그래픽스 컨텍스트(예: 색상 설정, 버퍼 업데이트)에서의 실질적인 활용 사례를 포함할 것.
    - 코드 블록 내에 언어 명시(```typescript)를 철저히 할 것.
4. 예외 명시(@throws): 어떤 상황에서 에러가 발생하는지(예: 범위 초과, 유효하지 않은 포맷) 구체적으로 명시할 것.
5. 시각적 설명:
    - 수학적 개념(행렬, 벡터)이나 그래픽스 용어는 보충 설명을 덧붙일 것.
    - 단위(예: 0~255, 0.0~1.0, radian/degree)를 명확히 기록할 것.
6. 접근 제어 및 메타데이터:
    - `@private`, `@internal`, `@readonly` 등을 활용하여 API 노출 범위를 명확히 할 것.
    - 성능상 주의가 필요한 메서드는 `@remarks`나 `@note` 태그로 경고할 것.
7.  `````<iframe src="/RedGPU/examples/3d/mesh/basicMesh/"></iframe>````` 와 같은 형식은 수정하지말고 유지할것
8. @see를 포함한 아래와 같은 맥락은 수정하지말고 유지할것 
9. ```
   * 아래는 Mesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
   * @see [Mesh Hierarchy example](/RedGPU/examples/3d/mesh/hierarchy/)
   * @see [Mesh Pivot example](/RedGPU/examples/3d/mesh/pivot/)
   * @see [Mesh Child Methods example](/RedGPU/examples/3d/mesh/childMethod/)
   * @see [Mesh lookAt Methods example](/RedGPU/examples/3d/mesh/lookAt/)
   * @see [Mesh CPU LOD](/RedGPU/examples/3d/lod/MeshCPULOD/)
   ```
10. typedoc 를 요청할경우 코드 전문을 다보여줄것 
