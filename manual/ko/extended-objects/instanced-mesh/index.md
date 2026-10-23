---
title: Instancing Mesh
order: 2
---

<script setup>
const instancingGraph = `
    CPU["CPU (단일 드로우콜)"] -->|전송| GPU["GPU (인스턴스 버퍼 연산)"]
    GPU --> Inst1["인스턴스 1"]
    GPU --> Inst2["인스턴스 2"]
    GPU --> InstN["인스턴스 N..."]

    %% 회색조 스타일 적용
    style CPU fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GPU fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Inst1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Inst2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style InstN fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Instancing Mesh

**인스턴싱 메시**(Instancing Mesh, `RedGPU.Display.InstancingMesh`)는 동일한 지오메트리와 재질을 공유하는 수천~수만 개의 객체를 단일 버퍼로 묶어 단 1번의 **드로우
콜**(Draw Call)로 렌더링하는 고성능 디스플레이 객체입니다.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

---

## 1. 생성 및 개별 인스턴스 제어

생성 시 할당할 최대 버퍼 용량 (`maxInstanceCount`)과 초기 렌더링 개수 (`instanceCount`)를 지정합니다.

| 속성                   | 타입                       | 설명                                                                                      |
|:-----------------------|:---------------------------|:------------------------------------------------------------------------------------------|
| **`maxInstanceCount`** | `number`                   | 할당된 최대 인스턴스 버퍼 크기 (생성 후 변경 불가, 읽기 전용)                             |
| **`instanceCount`**    | `number`                   | 화면에 실제로 렌더링할 활성 인스턴스 개수 (`0 ~ maxInstanceCount` 범위 내 동적 변경 가능) |
| **`instanceChildren`** | `InstancingMeshObject3D[]` | 개별 인스턴스의 트랜스폼(위치, 회전, 스케일) 및 투명도를 제어하는 가상 객체 배열          |

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const maxCount = 100000;
const initCount = 5000;

const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,   // 최대 버퍼 크기
    initCount,  // 초기 렌더링 개수
    geometry,
    material
);
scene.addChild(instancedMesh);

// 개별 인스턴스 트랜스폼 설정
const instances = instancedMesh.instanceChildren;
for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
}
```

> [!WARNING]
> `instanceChildren` 의 개별 요소 (`InstancingMeshObject3D`)는 일반 `Mesh` 와 유사한 트랜스폼 인터페이스를 제공하지만, GPU 인스턴싱 버퍼 데이터를 직접 갱신하는 대리자
객체이므로 `addChild()` 를 통해 하위 자식 객체를 가질 수 없습니다.

---

## 2. 실습 예제: 1만 개의 큐브

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 조명 설정
    const light = new RedGPU.Light.DirectionalLight();
    light.x = 10; light.y = 20; light.z = 10;
    scene.lightManager.addDirectionalLight(light);

    // 2. 인스턴싱 메시 생성 (1만 개)
    const maxCount = 10000;
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    const instancedMesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxCount,
        maxCount,
        geometry,
        material
    );
    scene.addChild(instancedMesh);

    // 3. 인스턴스 무작위 분산 배치
    const instances = instancedMesh.instanceChildren;
    for (let i = 0; i < maxCount; i++) {
        const item = instances[i];
        item.x = Math.random() * 80 - 40;
        item.y = Math.random() * 80 - 40;
        item.z = Math.random() * 80 - 40;
        
        item.rotationX = Math.random() * 360;
        item.rotationY = Math.random() * 360;
        item.rotationZ = Math.random() * 360;
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 60;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        for (let i = 0; i < maxCount; i++) {
            instances[i].rotationY += 0.5;
        }
    });
});
```

---

## 관련 예제

- [InstancingMesh 기본 예제](/RedGPU/examples/3d/instancedMesh/simple/)
- [InstancingMesh 구체 배열](/RedGPU/examples/3d/instancedMesh/sphere/)
- [InstancingMesh GPU LOD](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)

---

## 다음 단계

- **[스프라이트](../sprite/index.md)** : 항상 카메라를 바라보는 빌보드 스프라이트와 프레임 애니메이션 활용하기
