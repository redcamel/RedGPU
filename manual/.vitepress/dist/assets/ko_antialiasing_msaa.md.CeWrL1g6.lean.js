import{f as o,D as t,c as d,o as p,a2 as c,H as i,k as e,w as s,a as n}from"./chunks/framework.cYGcyyTy.js";const M=JSON.parse('{"title":"MSAA","description":"","frontmatter":{"title":"MSAA","order":2},"headers":[],"relativePath":"ko/antialiasing/msaa.md","filePath":"ko/antialiasing/msaa.md","lastUpdated":1769498891000}'),h={name:"ko/antialiasing/msaa.md"};function g(u,a,A,m,P,x){const r=t("CodePen"),l=t("ClientOnly");return p(),d("div",null,[a[1]||(a[1]=c("",9)),i(l,null,{default:s(()=>[i(r,{title:"RedGPU - MSAA Example",slugHash:"antialiasing-msaa"},{default:s(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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

// 초기 상태: MSAA 활성화
redGPUContext.antialiasingManager.useMSAA = true;

// UI: MSAA 토글
const btn = document.createElement('button');
btn.textContent = 'MSAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useMSAA) {
        manager.useMSAA = false; // 끄기
    } else {
        manager.useMSAA = true; // 켜기
    }
    
    btn.textContent = \`MSAA: \${manager.useMSAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useMSAA ? '#00aaff' : '#ccc';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    sphere.rotationY += 0.01;
    box.rotationY += 0.01;
});
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),a[2]||(a[2]=e("h2",{id:"핵심-요약",tabindex:"-1"},[n("핵심 요약 "),e("a",{class:"header-anchor",href:"#핵심-요약","aria-label":'Permalink to "핵심 요약"'},"​")],-1)),a[3]||(a[3]=e("ul",null,[e("li",null,[e("strong",null,"하드웨어 지원"),n(": GPU의 내장 기능을 사용합니다.")]),e("li",null,[e("strong",null,"경계선 특화"),n(": 물체의 테두리를 부드럽게 만드는 데 탁월합니다.")]),e("li",null,[e("strong",null,"기본값"),n(": 일반 디스플레이 환경에서는 기본적으로 활성화됩니다.")])],-1))])}const U=o(h,[["render",g]]);export{M as __pageData,U as default};
