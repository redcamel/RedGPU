import{f as r,D as a,o as p,c as d,a2 as k,G as n,w as t,k as s,a as i}from"./chunks/framework.DpNgdNqH.js";const x=JSON.parse('{"title":"Mesh LOD","description":"","frontmatter":{"title":"Mesh LOD","order":2},"headers":[],"relativePath":"ko/lod/mesh-lod.md","filePath":"ko/lod/mesh-lod.md","lastUpdated":1769587164000}'),o={name:"ko/lod/mesh-lod.md"};function c(E,e,g,m,y,C){const l=a("CodePen"),h=a("ClientOnly");return p(),d("div",null,[e[1]||(e[1]=k("",9)),n(h,null,{default:t(()=>[n(l,{title:"RedGPU - Mesh LOD Example",slugHash:"lod-mesh-basic"},{default:t(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),s("pre",null,[s("code",null,`// 조명 추가
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. 재질 및 텍스처 설정
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

// 2. 기본 메쉬 생성 (거리 0 ~ 10)
// High Detail: Sphere (반지름 2, 세그먼트 32x32)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
    material
);
scene.addChild(mesh);

// 3. LOD 레벨 추가
// Level 1: 거리 10 이상 (Mid Detail - Sphere 2, 8x8)
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// Level 2: 거리 20 이상 (Low Detail - Box 3x3x3)
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 4. 상태 표시 UI
const label = document.createElement('div');
Object.assign(label.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px',
    fontFamily: 'monospace', fontSize: '16px', textAlign: 'center'
});
document.body.appendChild(label);

// 5. 카메라 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
controller.speedDistance = 0.5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 6. 렌더링 루프
const renderer = new RedGPU.Renderer(redGPUContext);
const render = () => {
    // 거리 계산 및 UI 업데이트 (시각적 확인용)
    const dist = Math.sqrt(
        Math.pow(view.rawCamera.x - mesh.x, 2) +
        Math.pow(view.rawCamera.y - mesh.y, 2) +
        Math.pow(view.rawCamera.z - mesh.z, 2)
    );
    
    let currentLevel = "High (Sphere 32)";
    if (dist >= 20) currentLevel = "Low (Box)";
    else if (dist >= 10) currentLevel = "Mid (Sphere 8)";

    label.innerHTML = \`Distance: \${dist.toFixed(1)}m <br/> Geometry: \${currentLevel}\`;
};

renderer.start(redGPUContext, render);
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1})])}const D=r(o,[["render",c]]);export{x as __pageData,D as default};
