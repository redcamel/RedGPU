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

**인스턴싱 메시** (Instancing Mesh) 는 동일한 지오메트리 와 재질 을 공유하는 수천, 수만 개의 객체를 단 한 번의 **드로우 콜** (Draw Call) 로 렌더링하는 고성능 객체입니다. 숲(
나무), 잔디, 파티클, 군중 등을 표현할 때 필수적입니다.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

## 1. 왜 인스턴싱인가?

일반적인 **메시** (Mesh) 를 1만 개 생성하여 씬에 추가하면 1만 번의 드로우 콜 이 발생하여 CPU 오버헤드로 인해 프레임이 급격히 떨어집니다. 반면, `InstancingMesh` 는 데이터들을 하나의
버퍼로 묶어 단 1번의 드로우 콜 로 GPU에 전송하여 처리하므로 압도적인 렌더링 성능을 제공합니다.

## 2. 기본 사용법

`InstancingMesh` 는 생성 시 할당할 최대 인스턴스 개수 (Capacity) 와 초기 사용 개수를 지정해야 합니다.

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
    initCount,  // 현재 렌더링할 개수 (동적 변경 가능)
    geometry,
    material
);

scene.addChild(instancedMesh);
```

## 3. 개별 인스턴스 제어

`instancedMesh.instanceChildren` 배열 을 통해 각 인스턴스의 트랜스폼(위치, 회전, 크기) 을 개별적으로 제어할 수 있습니다.

```javascript
// 각 인스턴스 위치 무작위 설정
const instances = instancedMesh.instanceChildren;

for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    
    // 위치 설정
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    
    // 회전 및 스케일 설정
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
}
```

::: warning [자식 구조 제약]
`InstancingMesh` 의 자식 인스턴스 (인스턴스 개별 객체) 는 일반 `Mesh` 와 유사한 인터페이스를 가지지만, 실제로 독립된 3D 객체가 아니라 GPU 인스턴싱 버퍼 데이터를 제어하는 가상 대리자
객체입니다. 따라서 `addChild()` 등을 통해 자식 객체를 계층적으로 가질 수 없습니다.
:::

---

## 4. 실습 예제: 1만 개의 큐브

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

    // 3. 인스턴스들 무작위 분산 배치
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
        // 매 프레임마다 전체 인스턴스를 살짝 회전시킵니다.
        for (let i = 0; i < maxCount; i++) {
            instances[i].rotationY += 0.5;
        }
    });
});
```

## 핵심 요약

- **대량 렌더링**: 수만 개의 객체를 단일 드로우 콜로 렌더링하는 최적의 솔루션입니다.
- **성능 극대화**: CPU와 GPU 간의 통신 부하를 없애 프레임 속도를 유지합니다.
- **동적 제어**: `instanceCount` 속성 을 사용하여 화면에 보일 실제 렌더링 개수를 동적으로 제어할 수 있습니다.

---

## 다음 학습 추천

3D 공간 내에서 항상 카메라를 마주보거나 간결한 2D 리소스를 효과적으로 활용하는 방법에 대해 알아봅니다.

- **[스프라이트](../sprite/index.md)**
