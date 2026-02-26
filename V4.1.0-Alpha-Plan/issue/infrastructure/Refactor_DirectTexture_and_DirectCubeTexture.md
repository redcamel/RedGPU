# [Architecture] Standardize DirectTexture and DirectCubeTexture Architecture

## 📝 Context
RedGPU는 파일 경로(URL)를 통한 자산 로드 과정(`BitmapTexture`, `CubeTexture`) 없이, 시스템 내부에서 동적으로 생성되거나 계산된 GPU 리소스를 즉시 주입하여 관리하는 전용 클래스인 **`DirectTexture`**와 **`DirectCubeTexture`**를 제공합니다.

## ❌ Problem
1. **파편화된 리소스 관리**: `IBLCubeTexture`, `SkyAtmosphereLUTTexture` 등 특정 모듈에 종속된 명칭과 위치로 인해 범용적인 리소스 주입이 어려웠음.
2. **코드 중복**: 주입된 텍스처의 캐싱, 메모리 트래킹, 라이프사이클 관리 로직이 여러 클래스에 중복 구현되어 유지보수 효율 저하.
3. **불분명한 의도**: "파일 로딩 기반" 리소스와 "시스템 주입 기반" 리소스 간의 네이밍 대칭성이 부족하여 개발자 혼선 초래.

## ✅ Solution: Unified Direct Resource Architecture
1. **클래스 정규화 및 승격**:
    - **`DirectTexture`**: 파일 로딩 없이 **2D** GPU 리소스를 직접 제어하는 범용 컨테이너.
    - **`DirectCubeTexture`**: 파일 로딩 없이 **3D 및 Cube** GPU 리소스를 직접 제어하는 범용 컨테이너.
2. **추상 클래스 `ADirectTexture` 도입**:
    - 리소스 주입의 공통 메커니즘(싱글톤 캐싱, `#` 필드 기반 캡슐화, 메모리 통계 동기화)을 추상화하여 구조적 일관성 확보.
3. **아키텍처 대칭성 완성**:
    - 자산 로드형: `BitmapTexture` (2D), `CubeTexture` (Cube)
    - 시스템 주입형: **`DirectTexture` (2D)**, **`DirectCubeTexture` (3D/Cube)**
4. **글로벌 접근성**:
    - `src/resources/index.ts`를 통해 공식 노출하여 외부에서도 표준화된 방식으로 커스텀 텍스처를 엔진에 주입 가능하도록 개선.

## 🛠 Task List
- [x] Standardize `DirectTexture` and `DirectCubeTexture` APIs
- [x] Implement `ADirectTexture` abstract base class
- [x] Use `#` (Private fields) for enhanced resource security
- [x] Update all engine generators (IBL, SkyAtmosphere) to new standards
- [x] Comprehensive GPU resource labeling for SkyAtmosphere system
- [x] Export classes via `RedGPU.Resource` namespace

## 📊 Impact
- **Developer Experience**: 클래스 이름만으로 리소스 공급 방식(Load vs Direct)을 즉시 파악 가능.
- **Maintainability**: 리소스 관리의 핵심 로직이 단일 상속 구조(`ADirectTexture`) 하에 놓여 관리가 용이함.
- **Robustness**: 3D와 Cube 차원에 따른 유효성 검사 로직(ViewDescriptor) 내재화로 런타임 오류 방지.

---
**Status:** Completed
**Milestone:** V4.1.0-Alpha
**Labels:** `architecture`, `textures`, `standardization`
