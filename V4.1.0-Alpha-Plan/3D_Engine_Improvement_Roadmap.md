# RedGPU 3D 엔진 개선 및 고도화 로드맵 (3D Engine Improvement Roadmap)

본 문서는 `src/` 디렉터리의 코드를 분석하여, RedGPU가 현대적이고 완전한 3D 그래픽스 엔진으로 거듭나기 위해 필요한 개선 사항과 신규 기능들을 정리한 로드맵입니다.

---

## 1. 렌더링 파이프라인 및 아키텍처 (Rendering & Architecture)

### 1.1. 공간 분할 및 컬링 최적화 (Spatial Partitioning & Culling)
- **현재 상태**: `Mesh`의 `render` 단계에서 선형(Linear) 순회를 통해 Frustum 및 Distance Culling을 수행하고 있습니다.
- **개선 목표**:
  - 대규모 씬 렌더링을 위해 **BVH (Bounding Volume Hierarchy)** 또는 **Octree/Quadtree** 공간 분할 자료구조 도입.
  - 객체가 다른 객체에 가려졌을 때 렌더링을 제외하는 **Occlusion Culling** (또는 GPU 기반의 Hierarchical Z-Buffer Culling) 구현.

### 1.2. 그림자 시스템 확장 (Shadow System Expansion)
- **현재 상태**: `DirectionalShadowManager`를 통해 직사광(Directional Light)에 대한 그림자만 지원하고 있습니다.
- **개선 목표**:
  - `SpotLight`를 위한 그림자 매핑 (Perspective Shadow Map) 추가.
  - `PointLight`를 위한 전방위 그림자 (Omnidirectional / Cube Shadow Map) 추가.
  - 부드러운 그림자를 위한 **PCSS (Percentage-Closer Soft Shadows)** 또는 VSM 알고리즘 도입.

### 1.3. 글로벌 일루미네이션 및 라이팅 (Global Illumination)
- **현재 상태**: IBL(Image-Based Lighting)과 Clustered Lighting 체계를 훌륭하게 갖추고 있습니다.
- **개선 목표**:
  - 동적 빛 반사를 위한 **SSGI (Screen Space Global Illumination)** 도입.
  - 정적 씬을 위한 Lightmap 베이킹 시스템 또는 Voxel-based GI 고려.

### 1.4. FrameGraph (RenderGraph) 아키텍처 도입
- **현재 상태**: 렌더링 패스(`FinalRender`, `PostEffectManager`)가 순차적으로 하드코딩되어 있습니다.
- **개선 목표**: 메모리 사용량을 최소화하고 패스 간의 의존성을 자동으로 관리(Barrier, Resource Transition)하는 **FrameGraph** 도입. 이는 현재 계획 중인 Post-processing 동적 리소스 풀링 시스템을 엔진 전역으로 확장하는 형태가 됩니다.

---

## 2. 머티리얼 및 시각 효과 (Materials & Visual Effects)

### 2.1. 셰이더 그래프 (Shader Graph / Visual Node Editor)
- **현재 상태**: `ShaderVariantGenerator`를 통해 코드로 변형(Variant)을 생성 및 관리하고 있습니다.
- **개선 목표**: 개발자 및 아티스트가 코딩 없이 노드 연결만으로 복잡한 커스텀 머티리얼을 제작할 수 있는 기반 시스템 마련.

### 2.2. 데칼 시스템 (Decal System)
- **현재 상태**: 표면에 총알 자국이나 스티커 등을 투사하는 기능이 부재합니다.
- **개선 목표**: Deferred 또는 Forward+ 파이프라인과 호환되는 Screen Space Decal 지원.

### 2.3. 볼류메트릭 렌더링 (Volumetric Rendering)
- **현재 상태**: `HeightFog` 및 `SkyAtmosphere`가 훌륭하게 구현되어 있습니다.
- **개선 목표**: 
  - 빛이 안개나 먼지에 산란되어 보이는 **Volumetric Light (God Rays / Light Shafts)** 추가.
  - 레이마칭(Raymarching) 기반의 **Volumetric Clouds** 지원.

---

## 3. 애니메이션 및 캐릭터 (Animation & Characters)

### 3.1. 애니메이션 상태 머신 (Animation State Machine / Blend Tree)
- **현재 상태**: `GLTFLoader`와 `GltfAnimationLooperManager`를 통해 단순한 클립 반복 재생 및 보간을 수행합니다.
- **개선 목표**: 
  - Idle -> Walk -> Run 상태를 전이하고, 두 애니메이션을 부드럽게 섞는 **Crossfading** 구현.
  - 부위별(상체/하체)로 다른 애니메이션을 재생하는 **Layered Animation** 지원.

### 3.2. Inverse Kinematics (IK)
- **현재 상태**: Forward Kinematics (FK) 기반의 스키닝만 제공합니다.
- **개선 목표**: 캐릭터의 발이 지형 높낮이에 맞춰지거나, 특정 대상을 쳐다보도록 관절을 제어하는 IK 시스템 구현.

---

## 4. 물리 및 상호작용 (Physics & Interaction)

### 4.1. 물리 엔진 통합 고도화
- **현재 상태**: Rapier 기반의 플러그인(`RapierPhysics`, `RapierBody`)이 실험적으로 구현되어 있습니다.
- **개선 목표**:
  - 힌지(Hinge), 스프링(Spring) 등의 **Constraint / Joint** 인터페이스 추가.
  - 렌더링 피킹 외에 물리 엔진 자체의 공간 질의 기능 (Raycasting, Shape Cast, Overlap) 래핑 및 노출.
  - 고급 Character Controller 완성.

---

## 5. 에셋 파이프라인 및 최적화 (Asset Pipeline & Optimization)

### 5.1. Web Worker 기반 비동기 파싱
- **현재 상태**: `GLTFLoader`에서 많은 파싱 작업(JSON 해석, 버퍼 재조합)이 메인 스레드에서 이루어져, 무거운 모델 로딩 시 UI 프리징 현상이 발생할 수 있습니다.
- **개선 목표**: GLTF 파싱, 텍스처 디코딩, 지오메트리 처리 작업을 **Web Worker**로 오프로딩(Offloading)하여 성능 최적화.

### 5.2. 최신 압축 포맷 지원
- **현재 상태**: 기본 포맷 중심. (주석 상 `KHR_draco_mesh_compression` 미지원 알림 있음)
- **개선 목표**: 
  - 텍스처: **KTX2 / BasisU** 압축 텍스처 네이티브 지원을 통한 GPU 메모리 획기적 절감.
  - 메쉬: **Draco / Meshopt** 디코딩 지원.

### 5.3. 지형 (Terrain) 시스템
- **현재 상태**: `Ground`, `Plane` 등 기본 도형만 존재.
- **개선 목표**: 대규모 오픈 월드를 위한 **LOD 기반 Terrain 시스템** (Geo Clipmap 또는 Quadtree 기반)과 Heightmap 기반 멀티 텍스처 텍스처링 지원.
