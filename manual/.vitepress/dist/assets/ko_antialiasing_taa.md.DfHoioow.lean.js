import{f as l,D as a,o as d,c as p,a2 as h,G as i,w as r,k as e,a as n}from"./chunks/framework.DpNgdNqH.js";const G=JSON.parse('{"title":"TAA","description":"","frontmatter":{"title":"TAA","order":1},"headers":[],"relativePath":"ko/antialiasing/taa.md","filePath":"ko/antialiasing/taa.md","lastUpdated":1770634323000}'),c={name:"ko/antialiasing/taa.md"};function g(u,t,A,x,P,m){const s=a("CodePen"),o=a("ClientOnly");return d(),p("div",null,[t[1]||(t[1]=h("",10)),i(o,null,{default:r(()=>[i(s,{title:"RedGPU - TAA Example",slugHash:"antialiasing-taa"},{default:r(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
`),e("pre",null,[e("code",null,`// 조명 추가
const light = new RedGPU.Light.DirectionalLight();
light.x = 10; light.y = 10; light.z = 10;
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.3;
scene.lightManager.ambientLight = ambientLight;

// 1. 미세한 그리드 바닥 (패턴 알리어싱 확인용)
const grid = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 50, 50),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#999999')
);
grid.drawMode = 'lines';
scene.addChild(grid);

// 2. 와이어프레임 구체 (지오메트리 엣지 확인용)
const sphere = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 5, 32, 32),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00aaff')
);
sphere.y = 5;
sphere.x = -6;
sphere.drawMode = 'lines';
scene.addChild(sphere);

// 3. 텍스처 박스 (텍스처 선명도 확인용)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
boxMaterial.diffuseTexture = texture;

const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 6, 6, 6),
    boxMaterial
);
box.y = 5;
box.x = 6;
scene.addChild(box);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 25;
controller.tilt = -15;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 초기 상태: TAA 활성화
redGPUContext.antialiasingManager.useTAA = true;

// UI: TAA 토글 버튼
const btn = document.createElement('button');
btn.textContent = 'TAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useTAA) {
        manager.useTAA = false; // TAA 끔
    } else {
        manager.useTAA = true;  // TAA 켬
    }
    
    btn.textContent = \`TAA: \${manager.useTAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useTAA ? '#00aaff' : '#555';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    sphere.rotationY += 0.01;
    box.rotationY += 0.01;
});
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=e("h2",{id:"핵심-요약",tabindex:"-1"},[n("핵심 요약 "),e("a",{class:"header-anchor",href:"#핵심-요약","aria-label":'Permalink to "핵심 요약"'},"​")],-1)),t[3]||(t[3]=e("ul",null,[e("li",null,[e("strong",null,"최고 품질"),n(": 계단 현상을 거의 완벽하게 제거합니다.")]),e("li",null,[e("strong",null,"자동 선택"),n(": 고해상도 디스플레이(Retina 등)에서는 기본적으로 TAA가 활성화됩니다.")]),e("li",null,[e("strong",null,"고비용"),n(": 매 프레임 연산 및 메모리 오버헤드가 발생하므로 데스크탑 환경에서 권장됩니다.")])],-1))])}const U=l(c,[["render",g]]);export{G as __pageData,U as default};
