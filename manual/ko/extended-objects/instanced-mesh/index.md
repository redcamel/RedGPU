---
title: Instancing Mesh
order: 2
---

<script setup>
const instancingGraph = `
    CPU["CPU (1 Draw Call)"] -->|전송| GPU["GPU (버퍼 연산)"]
    GPU --> Inst1["Instance 1"]
    GPU --> Inst2["Instance 2"]
    GPU --> InstN["Instance N..."]

    %% 회색조 스타일 적용
    style CPU fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GPU fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Inst1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Inst2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style InstN fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Instancing Mesh

**인스턴싱 메시**(Instancing Mesh)는 동일한 지오메트리와 재질을 공유하는 수천, 수만 개의 객체를 단 한 번의 **드로우 콜**(Draw Call)로 렌더링하는 고성능 객체입니다. 숲 (나무),
잔디, 군중 등을 표현할 때 필수적입니다.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

## 1. 왜 인스턴싱인가?

일반적인 `Mesh`를 1만 개 생성하여 씬에 추가하면 1만 번의 드로우 콜이 발생하여 CPU 오버헤드로 인해 프레임이 급격히 떨어집니다. 반면, `InstancingMesh`는 데이터들을 하나의 버퍼로 묶어 단
1번의 드로우 콜로 GPU에 전송하여 처리하므로 압도적인 렌더링 성능을 제공합니다.

## 2. 기본 사용법

`InstancingMesh`는 생성 시 할당할 최대 인스턴스 개수 (`maxInstanceCount`)와 초기 활성 개수 (`instanceCount`)를 지정해야 합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 최대 10만 개 공간 할당, 초기 5,000개 설정
const maxCount = 100000;
const initCount = 5000;

const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,   // 최대 버퍼 크기 (생성 후 변경 불가)
    initCount,  // 현재 렌더링할 개수 (`instanceCount`로 동적 변경 가능)
    geometry,
    material
);

scene.addChild(instancedMesh);
```

## 3. 개별 인스턴스 제어

`instancedMesh.instanceChildren` 배열을 통해 각 인스턴스 (`InstancingMeshObject3D`)의 트랜스폼 (위치, 회전, 크기)과 불투명도 (`opacity`)를 개별적으로
제어할 수 있습니다.

```javascript
// 각 인스턴스 위치, 회전, 스케일, 불투명도 설정
const instances = instancedMesh.instanceChildren;

for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    
    // 위치 설정
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    
    // 회전, 스케일 및 불투명도 설정
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
    instance.opacity = Math.random() * 0.5 + 0.5;
}
```

::: warning [자식 구조 제약]
`InstancingMesh`의 자식 인스턴스 (`InstancingMeshObject3D`)는 일반 `Mesh`와 유사한 트랜스폼 인터페이스를 가지지만, 독립된 3D 객체가 아니라 GPU 인스턴싱 버퍼 데이터를
제어하는 대리자 객체입니다. 따라서 `addChild()` 등을 통해 하위 자식 객체를 계층적으로 가질 수 없습니다.
:::

## 4. 실습 예제: 대량 인스턴스 제어

슬라이더를 조작하여 활성 인스턴스 개수 (`instanceCount`)를 실시간으로 변경하고 성능을 확인해 보세요.

<iframe src="/RedGPU/examples/3d/instancedMesh/simple/" style="width:100%; height:500px;"></iframe>

---

## 관련 예제

- [InstancingMesh 기본 예제](/RedGPU/examples/3d/instancedMesh/simple/)
- [InstancingMesh 구체 배열](/RedGPU/examples/3d/instancedMesh/sphere/)
- [InstancingMesh GPU LOD](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)

---

## 다음 학습 추천

3D 공간 내에서 항상 카메라를 마주보거나 간결한 2D 리소스를 효과적으로 활용하는 방법에 대해 알아봅니다.

- **[스프라이트](../sprite/index.md)**
