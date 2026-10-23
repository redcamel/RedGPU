---
title: Particle & Line
order: 5
---

# 파티클 및 라인

수만 개의 입자를 GPU 컴퓨트 셰이더에서 병렬 시뮬레이션하는 `ParticleEmitter` 와, 3D/2D 공간의 정점들을 직선 또는 곡선으로 연결하는 `Line3D` / `Line2D` 클래스를 다룹니다.

## 1. GPU 파티클 시스템

`ParticleEmitter` 는 불꽃, 연기, 눈, 마법 효과 등 대량의 입자를 CPU 부하 없이 GPU 컴퓨트 셰이더 (Compute Shader)로
실시간 시뮬레이션하고 렌더링합니다.

| 속성                                      | 기본값          | 설명                                                                        |
|:------------------------------------------|:----------------|:----------------------------------------------------------------------------|
| **`particleNum`**                         | `2000`          | 동시 시뮬레이션할 총 파티클 입자 개수                                       |
| **`useBillboard`**                        | `true`          | 파티클 평면이 항상 카메라를 정면으로 바라볼지 여부                          |
| **`minLife` / `maxLife`**                 | `1000` / `5000` | 개별 파티클의 최소·최대 수명 (밀리초 단위)                                  |
| **`minStartX/Y/Z` ~ `maxStartX/Y/Z`**     | `0`             | 파티클 생성 시점의 시작 위치 랜덤 범위                                      |
| **`minEndX/Y/Z` ~ `maxEndX/Y/Z`**         | `-5` ~ `5`      | 파티클 소멸 시점의 종료 위치 랜덤 범위                                      |
| **`minStartScale` ~ `maxEndScale`**       | `0` ~ `1`       | 수명에 따른 시작·종료 크기(Scale) 범위                                      |
| **`minStartAlpha` ~ `maxEndAlpha`**       | `1`             | 수명에 따른 시작·종료 투명도(Alpha) 범위                                    |
| **`easeX/Y/Z`, `easeAlpha`, `easeScale`** | `PARTICLE_EASE` | 위치, 투명도, 크기 변화에 적용할 이징 함수 (`RedGPU.Display.PARTICLE_EASE`) |

```javascript
// 1. 파티클 이미터 생성 및 입자 수 설정
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;
emitter.minLife = 1000;
emitter.maxLife = 3500;

// 2. 파티클 텍스처 및 블렌드 모드 설정
emitter.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/particle.png'
);
emitter.blendMode = RedGPU.GPU_BLEND_MODE.ADD;

scene.addChild(emitter);
```

---

## 2. 3D/2D 직선 및 곡선 렌더러

`Line3D`(`RedGPU.Display.Line3D`, 2D 뷰에서는 `RedGPU.Display.Line2D`)는 공간상의 정점 (`addPoint`)들을 연결하여 직선, 베지어 곡선, 또는 캣멀롬 스플라인
곡선을 생성합니다.

| 라인 타입                   | 설명                                                                                              |
|:----------------------------|:--------------------------------------------------------------------------------------------------|
| **`LINE_TYPE.LINEAR`**      | 추가된 정점들을 직선으로 즉시 연결합니다.                                                         |
| **`LINE_TYPE.CATMULL_ROM`** | 모든 경유 정점을 부드럽게 통과하는 스플라인 곡선을 생성하며 `tension` 속성으로 곡률을 조절합니다. |
| **`LINE_TYPE.BEZIER`**      | 입·출력 제어점(`inX/Y/Z`, `outX/Y/Z`)을 기반으로 베지어 곡선을 그립니다.                          |

```javascript
// Catmull-Rom 곡선 타입의 Line3D 생성
const line = new RedGPU.Display.Line3D(
    redGPUContext,
    RedGPU.Display.LINE_TYPE.CATMULL_ROM,
    '#00ffff'
);

// 정점 추가: addPoint(x, y, z, color, alpha)
line.addPoint(-5, 0, 0, '#ff0055');
line.addPoint(0, 4, 2, '#00ffff');
line.addPoint(5, 0, 0, '#ffcc00');

scene.addChild(line);
```

---

## 다음 단계

- **[인터랙션](../../interaction/index.md)** : 화면의 객체들을 마우스와 터치로 클릭·제어하는 이벤트 시스템
