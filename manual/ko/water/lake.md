---
title: Lake
order: 1
---

# 물리 기반 호수 수체

`Lake` 는 수심에 따른 Beer-Lambert 빛 감쇠, 굴절 (Refraction), 수중 커스틱 (Caustics), 실시간 화면 공간 반사 (**SSR**), 그리고 물체 충돌에 의한 **실시간 2D 파동
방정식 수면 인터랙션**을 제공하는 호수 수체 클래스입니다.

## 1. 수체 생성 및 Scene 전용 등록

`Lake` 는 불투명 지오메트리 및 지형 렌더링 완료 후 배경 색상·깊이 버퍼를 캡처하여 굴절과 수심 페이드를 계산하므로, 일반 `scene.addChild()` 가 아닌 `scene.addWater(lake)`
전용 메서드로 등록해야 합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 가로 200m, 세로 200m, 세그먼트 64x64 크기의 호수 생성
const lake = new RedGPU.Water.Lake(redGPUContext, 200, 200, 64, 64);

// 2. 수면 높이(Y 좌표) 및 정점 파도 설정
lake.waterLevel = 15.0;       // lake.y = 15.0 과 동일
lake.waveAmplitude = 0.03;    // 정점 파동 진폭 (기본값: 0.025)
lake.waveWavelength = 16.0;   // 정점 파동 파장 (기본값: 16.0)

// 3. Scene의 전용 수체 렌더 레이어에 등록 (필수)
scene.addWater(lake);
```

---

## 2. 광학 수체 재질

`Lake` 인스턴스 생성 시 `lake.material` 에 `LakeMaterial` 이 자동으로 할당됩니다.

| 속성명                                      | 기본값          | 설명                                                                                    |
|:--------------------------------------------|:----------------|:----------------------------------------------------------------------------------------|
| **`baseColor`**                             | `'#18d8b6'`     | 얕은 수면의 기본 색상 (`ColorRGB` — `lake.material.baseColor.setColorByHEX('#18d8b6')`) |
| **`deepColor`**                             | `'#065279'`     | 깊은 수심의 색상 (`ColorRGB`)                                                           |
| **`extinctionFactor`**                      | `0.22`          | 수심 증가에 따른 빛 감쇠 계수                                                           |
| **`depthFadeDistance`**                     | `0.8`           | 해안선(물가) 경계가 지형과 부드럽게 페이드되는 수심 거리                                |
| **`turbidity`**                             | `0.35`          | 물의 탁도 (`0.0 ~ 1.0`)                                                                 |
| **`refractionStrength`**                    | `1.0`           | 수중 배경의 굴절 왜곡 강도 (`0.0 ~ 1.0`)                                                |
| **`roughness`**                             | `0.07`          | 수면 거칠기 (`0.0 ~ 1.0`)                                                               |
| **`normalTexture` / `normalDetailTexture`** | `null`          | 기본 물결 노멀 맵 및 미세 물결 디테일 노멀 맵 (`BitmapTexture`)                         |
| **`normalScale` / `normalDetailScale`**     | `1.0` / `0.5`   | 기본 노멀 및 디테일 노멀 강도 (`0.0 ~ 1.0`)                                             |
| **`normalTiling` / `normalDetailTiling`**   | `20.0` / `40.0` | 월드 `100m` 기준 노멀 텍스처 반복 횟수                                                  |
| **`flowRateScale`**                         | `0.025`         | 전역 바람(`scene.windManager`)에 연동되는 물결 흐름 속도 배율                           |
| **`causticsStrength`**                      | `1.0`           | 수중 바닥에 맺히는 커스틱(물결 무늬 빛) 강도 (`0.0 ~ 2.0`)                              |
| **`causticsScale` / `causticsSpeed`**       | `1.0` / `1.0`   | 수중 커스틱 패턴 크기 및 애니메이션 속도                                                |
| **`enableSSR`**                             | `true`          | 화면 공간 반사(SSR) 활성화 여부                                                         |
| **`ssrMaxDistance` / `ssrStepCount`**       | `100.0` / `64`  | SSR 레이 마칭 최대 추적 거리 및 스텝 수                                                 |

```javascript
const waterMat = lake.material;

// 노멀 맵 연결 및 광학 파라미터 조정
waterMat.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, './assets/water/water_normal.png');
waterMat.normalDetailTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, './assets/water/water_detail_normal.png');
waterMat.baseColor.setColorByHEX('#18d8b6');
waterMat.deepColor.setColorByHEX('#065279');
waterMat.depthFadeDistance = 1.2;
waterMat.causticsStrength = 1.2;
waterMat.enableSSR = true;
```

---

## 3. 실시간 2D 파동 방정식 수면 인터랙션

`Lake` 는 캐릭터나 물체가 물과 접촉할 때 동심원 물결 (Ripple)을 전파하는 GPU 기반 2D 파동 시뮬레이터 (`LakeWaveSimulator`)를 내장하고 있습니다.

1. **상호작용할 객체 설정**: 물결을 일으킬 `Mesh` 에 `mesh.enableWaterInteraction = true` 를 설정합니다. (glTF 캐릭터 루트 메시에 설정 시 하위 자식 메시에 자동
   전파됩니다.)
2. **수체 추적 대상 설정**: `lake.interactionFollowTarget` 에 대상 메시를 지정하여 파동 시뮬레이션 영역이 대상을 따라다니도록 설정합니다.

```javascript
// 1. 캐릭터(또는 일반 Mesh)의 수면 파동 인터랙션 활성화
characterMesh.enableWaterInteraction = true;
characterMesh.waterWaveStrength = 1.2; // 파동 생성 강도 배율 (기본값: 1.0)

// 2. 호수의 파동 시뮬레이션 중심이 캐릭터를 따라다니도록 설정
lake.interactionEnabled = true;
lake.interactionFollowTarget = characterMesh;

// 3. 물결 전파 속도, 감쇠율 및 노멀 강도 미세 조정
lake.rippleWaveSpeed = 0.32;      // 물결 전파 속도 (기본값: 0.32)
lake.rippleDamping = 0.012;       // 물결 감쇠율 (기본값: 0.012)
lake.rippleNormalStrength = 1.0;  // 물결 노멀 강도 (기본값: 1.0)
```

---

## 다음 단계

- **[플러그인](../plugins/index.md)** : WASM 기반 물리 엔진 (Rapier)을 비롯한 RedGPU의 플러그인 시스템
