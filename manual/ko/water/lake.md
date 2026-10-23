---
title: Lake
order: 1
---

# Lake (호수 수체)

`RedGPU.Water.Lake`는 수심별 빛 감쇠, 수중 굴절, 커스틱 (Caustics), 화면 공간 반사 (**SSR**), 그리고 물체와 부딪힐 때 동심원 물결이 퍼져나가는 **실시간 수면 인터랙션**을
지원하는 호수 수체 클래스입니다.

---

## 1. 생성 및 Scene 등록

`Lake`는 불투명 객체 렌더링이 끝난 뒤 배경 색상·깊이 버퍼를 참조하는 2-Pass 구조로 동작합니다. `scene.addWater(lake)` 메서드로 씬에 등록하여 사용합니다.

> [!NOTE]
> 물결 노멀 맵 (`normalTexture`, `normalDetailTexture`)은 색상이 아닌 법선 벡터 데이터이므로 `BitmapTexture` 생성 시 포맷을 선형 포맷인 **
`'rgba8unorm'`** 으로 지정해야 정확한 물결 굴곡이 표현됩니다.

```javascript
// 1. 호수 생성 (width = 100, height = 100, widthSegments = 64, heightSegments = 64)
const lake = new RedGPU.Water.Lake(redGPUContext, 100, 100, 64, 64);

// 2. 수위(Y 좌표) 및 정점 파동 설정
lake.waterLevel = 0.0;        // 수면 높이 (lake.y 와 동일)
lake.waveAmplitude = 0.025;   // 정점 파동 진폭 (기본값: 0.025)
lake.waveWavelength = 16.0;   // 정점 파동 파장 (기본값: 16.0)

// 3. 선형('rgba8unorm') 노멀 텍스처 설정
lake.material.normalTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext, './assets/water/lake_normal.png', true, null, null, 'rgba8unorm'
);
lake.material.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext, './assets/water/lake_normal_detail.png', true, null, null, 'rgba8unorm'
);

// 4. 씬에 호수 등록
scene.addWater(lake);
```

### 라이브 예제: 기본 호수 및 수위 제어

<iframe src="/RedGPU/examples/3d/water/lake/basicLake/" style="width:100%; height:500px;"></iframe>

---

## 2. 광학 재질 설정 (`LakeMaterial`)

`Lake` 생성 시 `lake.material`에 `LakeMaterial`이 자동으로 할당됩니다. 수심에 따른 색상 (`baseColor`, `deepColor`), 굴절
(`refractionStrength`), 수중 커스틱 (`causticsStrength`), 화면 공간 반사 (`enableSSR`) 등을 조절할 수 있습니다.

```javascript
const mat = lake.material;
mat.baseColor.setColorByHEX('#18d8b6'); // 얕은 수면 색상
mat.deepColor.setColorByHEX('#065279'); // 깊은 수심 색상
mat.extinctionFactor = 0.22;            // 수심별 빛 감쇠율
mat.refractionStrength = 1.0;           // 수중 굴절 강도
mat.causticsStrength = 1.0;             // 수중 커스틱 빛 무늬 강도
mat.enableSSR = true;                   // 화면 공간 반사(SSR) 활성화
```

---

## 3. 실시간 수면 파동 인터랙션

캐릭터나 물체가 수면에 닿거나 이동할 때 실시간으로 동심원 물결 (Ripple)이 퍼져나가는 GPU 2D 파동 시뮬레이션을 지원합니다.

1. **상호작용할 객체 (`Mesh`) 설정**: 물결을 일으킬 메시에 `mesh.enableWaterInteraction = true`를 설정합니다. (루트 메시에 설정 시 하위 자식 메시에 자동 적용)
2. **시뮬레이션 추적 대상 설정**: 넓은 호수에서 특정 캐릭터 주변에 물결 해상도를 집중시키려면 `lake.interactionFollowTarget = characterMesh`를 지정합니다.

```javascript
// 1. 물결을 일으킬 객체 설정
characterMesh.enableWaterInteraction = true;
characterMesh.waterWaveStrength = 1.0; // 파동 생성 강도 (기본값: 1.0)

// 2. 호수의 파동 시뮬레이션 제어
lake.interactionEnabled = true;
lake.interactionFollowTarget = characterMesh; // 생략 시 호수 중심 기준 동작

// 3. 물결 전파 속성 조절
lake.rippleWaveSpeed = 0.32;      // 물결 전파 속도 (기본값: 0.32)
lake.rippleDamping = 0.012;       // 물결 감쇠율 (기본값: 0.012)
lake.rippleNormalStrength = 1.0;  // 물결 노멀 강도 (기본값: 1.0)
```

### 라이브 예제: 수면 물결 인터랙션

<iframe src="/RedGPU/examples/3d/water/lake/interaction/" style="width:100%; height:500px;"></iframe>

---

## 관련 예제

- [기본 호수 (Basic Lake)](/RedGPU/examples/3d/water/lake/basicLake/)
- [호수 광학 재질 설정 (Lake Material)](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [수면 물결 인터랙션 (Water Interaction)](/RedGPU/examples/3d/water/lake/interaction/)
- [캐릭터 수면 보행 파동 (Character Walking)](/RedGPU/examples/3d/water/lake/characterWalking/)
- [다중 호수 (Multi Lake)](/RedGPU/examples/3d/water/lake/multiLake/)
- [지형과 호수 통합 (Lake with Landscape)](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

[다음 단계: 플러그인 시스템 배우기](../plugins/index.md)
