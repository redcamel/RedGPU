# 시작하기
영문테스트
RedGPU를 사용하여 첫 번째 WebGPU 애플리케이션을 만들어보세요.

## 설치

npm을 사용하여 RedGPU를 설치합니다:

```bash
npm install redgpu
```

## 기본 사용법

RedGPU를 사용하기 위한 기본 설정:

```javascript
import RedGPU from 'redgpu';

// RedGPU 컨텍스트 생성
const redGPU = await RedGPU({
  canvas: document.getElementById('canvas')
});

// 3D 씬 설정
const scene = redGPU.scene();
const camera = redGPU.camera();
const view = redGPU.view3D();

// 렌더링 루프
function render() {
  view.render();
  requestAnimationFrame(render);
}
render();
```

## 다음 단계

- [RedGPU Context](../core-concepts/redgpu-context.md)에서 핵심 개념 알아보기
