# [Architecture] Standardize Direct-Injected Cube Texture Management (DirectCubeTexture)

## 📝 Context
RedGPU manages cube textures through two distinct paths: file-based loading (`CubeTexture`) and direct GPU resource injection from system generators (e.g., IBL filters, SkyAtmosphere). Previously, the latter was coupled with the IBL module under the misleading name `IBLCubeTexture`.

## ❌ Problem
1. **의도와 명칭의 불일치**: `IBLCubeTexture`라는 이름은 IBL 전용 리소스로 오해받기 쉬우나, 실제로는 `SkyAtmosphere`나 `Custom Reflection` 등 **직접 주입(Direct Injection)** 방식의 모든 큐브 텍스처를 처리하는 범용 컨테이너입니다.
2. **강한 결합도(Tight Coupling)**: 파일 위치가 `ibl/core/` 하위에 있어, 이를 사용하는 다른 시스템들이 특정 모듈의 내부 폴더를 깊게 참조해야 하는 아키텍처적 결함이 있었습니다.
3. **가독성 저하**: 파일 로딩 방식의 `CubeTexture`와 기능적으로 대칭을 이루는 이름이 부재하여 학습 곡선이 높았습니다.

## ✅ Solution
1. **명칭 정규화**: 클래스명을 `IBLCubeTexture` → **`DirectCubeTexture`**로 변경하여 "직접 주입형" 리소스임을 명확히 정의합니다.
2. **위치 이주**: IBL 모듈 종속성을 탈피하기 위해 공용 디렉토리(`src/resources/texture/`)로 파일을 이동하였습니다.
3. **의존성 정리**: 엔진 전반의 임포트 경로를 수정하여 모듈 간 결합도를 낮추고 리소스 접근성을 평등화하였습니다.

## 🛠 Task List
- [x] Rename `IBLCubeTexture.ts` to `DirectCubeTexture.ts`
- [x] Relocate file to `src/resources/texture/`
- [x] Update Class/Type references in `IBL.ts`, `SkyAtmosphere`, `SkyBox`
- [x] Synchronize `ResourceManager` cache and view generation logic
- [x] Update `ResourceStateCubeTexture` for unified reference counting

## 📊 Impact
- **Architecture**: IBL 모듈에 대한 타 시스템의 불필요한 의존성 제거.
- **Maintainability**: 리소스 성격에 따른 명확한 네이밍 컨벤션 확립 (`CubeTexture` vs `DirectCubeTexture`).
- **DX**: 클래스 이름만으로 데이터 공급 방식(Load vs Direct)을 직관적으로 이해 가능.

---
**Status:** Completed
**Milestone:** V4.1.0-Alpha
**Labels:** `refactoring`, `architecture`, `textures`
