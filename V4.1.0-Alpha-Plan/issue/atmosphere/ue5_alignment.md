# Sky Atmosphere 속성 및 용어 UE5 정렬 계획 (Alignment with Unreal Engine 5)

## 1. 개요
RedGPU의 `SkyAtmosphere` 클래스와 관련 셰이더에서 사용하는 속성명 및 용어를 업계 표준인 Unreal Engine 5(UE5)의 명명 규칙과 물리적 파라미터 구조에 맞게 재정의합니다. 이를 통해 개발자들에게 더 친숙한 워크플로우를 제공하고 물리적 일관성을 강화합니다.

## 2. 속성 매핑 및 변경 사항

### 2.1 Planet (행성 설정)
| 현재 속성명 (RedGPU) | 변경 후 속성명 (UE5 Style) | 설명 |
| :--- | :--- | :--- |
| `earthRadius` | `bottomRadius` | 행성의 바닥 반지름 (km). 기본값 6360.0. |
| `atmosphereHeight` | `atmosphereHeight` | (유지) 대기층의 상단 고도 (km). |
| `groundAlbedo` | `groundAlbedo` | (유지) 지표면 반사율. |

### 2.2 Rayleigh (레일리 산란)
| 현재 속성명 (RedGPU) | 변경 후 속성명 (UE5 Style) | 설명 |
| :--- | :--- | :--- |
| `rayleighScattering` | `rayleighScattering` | (유지) 레일리 산란 계수 (Color). |
| `rayleighScaleHeight` | `rayleighExponentialDistribution` | 레일리 산란의 고도 별 지수 분포 (Scale Height). |

### 2.3 Mie (미 산란)
| 현재 속성명 (RedGPU) | 변경 후 속성명 (UE5 Style) | 설명 |
| :--- | :--- | :--- |
| `mieScattering` | `mieScattering` | 미 산란 계수. |
| `mieExtinction` | `mieAbsorption` | **구조 변경**: UE5는 소멸(Extinction) 대신 흡수(Absorption)를 직접 설정함. `Extinction = Scattering + Absorption`. |
| `mieAnisotropy` | `mieAnisotropy` | (유지) 미 산란 비등방성 계수 (g). |
| `mieScaleHeight` | `mieExponentialDistribution` | 미 산란의 고도 별 지수 분포 (Scale Height). |

### 2.4 Absorption (흡수층 - 오존 등)
| 현재 속성명 (RedGPU) | 변경 후 속성명 (UE5 Style) | 설명 |
| :--- | :--- | :--- |
| `ozoneAbsorption` | `absorptionCoefficient` | 대기 중 흡수 물질(오존 등)의 흡수 계수. |
| `ozoneLayerCenter` | `absorptionTipAltitude` | 흡수층(Tent Distribution)의 중심 고도 (km). |
| `ozoneLayerWidth` | `absorptionTentWidth` | 흡수층의 두께 범위 (km). |

### 2.5 Artistic Controls (예술적 제어)
| 현재 속성명 (RedGPU) | 변경 후 속성명 (UE5 Style) | 설명 |
| :--- | :--- | :--- |
| `skyViewScatMult` | `skyLuminanceFactor` | 최종 하늘 휘도에 곱해지는 배율. |
| `aerialPerspectiveMaxDistance` | `aerialPerspectiveDistanceScale` | 공중 투시 효과가 적용되는 거리 스케일. |

## 3. 세부 수정 단계

### STEP 1: Uniform 구조체 및 WGSL 상수 수정
- `src/display/skyAtmosphere/wgsl/uniformStructCode.wgsl`의 `Uniforms` 구조체 필드명 변경.
- `src/display/skyAtmosphere/core/skyAtmosphereFn.wgsl` 내의 물리 계산 로직에서 `mieExtinction`을 `mieScattering + mieAbsorption`으로 변경.

### STEP 2: SkyAtmosphere.ts API 업데이트
- 클래스 내부의 `#params` 객체 키값 변경.
- Public Getter/Setter 이름을 UE5 스타일로 변경.
- 기존 속성명(예: `earthRadius`)은 `deprecated` 태그와 함께 유지하여 하위 호환성 보장 (내부적으로 새 속성으로 리다이렉트).

### STEP 3: 관련 Generator 및 Shader 코드 일괄 수정
- `Transmittance`, `MultiScattering`, `SkyView`, `CameraVolume` 등 모든 생성기 셰이더의 바인딩 및 변수명 업데이트.
- `background_fragment.wgsl`, `computeCode.wgsl` 등 렌더링 셰이더 수정.

## 4. 기대 효과
- **상호 운용성**: UE5에서 설정한 대기 파라미터 값을 RedGPU에 직관적으로 이식 가능.
- **물리적 명확성**: 소멸(Extinction) 대신 산란(Scattering)과 흡수(Absorption)를 분리함으로써 물리 기반 렌더링(PBR) 정의에 더 부합함.
