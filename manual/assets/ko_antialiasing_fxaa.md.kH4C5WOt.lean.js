import{f as d,D as a,o as c,c as h,a2 as i,G as s,w as r,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const f=JSON.parse('{"title":"FXAA","description":"","frontmatter":{"title":"FXAA","order":3},"headers":[],"relativePath":"ko/antialiasing/fxaa.md","filePath":"ko/antialiasing/fxaa.md","lastUpdated":1769835435000}'),p={name:"ko/antialiasing/fxaa.md"};function g(A,n,x,u,P,m){const o=a("CodePen"),l=a("ClientOnly");return c(),h("div",null,[n[1]||(n[1]=i("",9)),s(l,null,{default:r(()=>[s(o,{title:"RedGPU - FXAA Example",slugHash:"antialiasing-fxaa"},{default:r(()=>[...n[0]||(n[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
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

// 2. FXAA 활성화
redGPUContext.antialiasingManager.useFXAA = true;

// UI: FXAA 토글
const btn = document.createElement('button');
btn.textContent = 'FXAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useFXAA) {
         manager.useFXAA = false; 
    } else {
         manager.useFXAA = true;
    }
    
    btn.textContent = \`FXAA: \${manager.useFXAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useFXAA ? '#00aaff' : '#555';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    // 천천히 회전하며 텍스처 블러링 관찰
    scene.children.forEach(mesh => {
        if(mesh instanceof RedGPU.Display.Mesh) mesh.rotationY += 0.01;
    })
});
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=i("",2))])}const G=d(p,[["render",g]]);export{f as __pageData,G as default};
