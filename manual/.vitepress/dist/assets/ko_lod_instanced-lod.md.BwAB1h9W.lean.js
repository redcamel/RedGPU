import{f as r,D as a,o as d,c as p,a2 as k,G as e,w as t,k as s,a as n}from"./chunks/framework.DpNgdNqH.js";const F=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"ko/lod/instanced-lod.md","filePath":"ko/lod/instanced-lod.md","lastUpdated":1769835435000}'),o={name:"ko/lod/instanced-lod.md"};function g(E,i,c,y,C,m){const h=a("CodePen"),l=a("ClientOnly");return d(),p("div",null,[i[1]||(i[1]=k("",9)),e(l,null,{default:t(()=>[e(h,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
`),s("pre",null,[s("code",null,`// 조명 추가
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. InstancingMesh 생성
// 기본(0~30): Sphere High (32x32)
const maxCount = 2000;
const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);

const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

const mesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,
    maxCount,
    geometry,
    material
);
scene.addChild(mesh);

// 2. LOD 레벨 추가
// 30 이상: Sphere Low (8x8)
mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// 60 이상: Box
mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 3. 인스턴스 위치 랜덤 배치
const range = 100;
for (let i = 0; i < maxCount; i++) {
    const instance = mesh.instanceChildren[i];
    instance.setPosition(
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range
    );
    instance.scale = Math.random() * 1.5 + 1.0;
}

// 4. 카메라 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 150;
controller.speedDistance = 5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. 렌더링
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    // 전체 회전
    mesh.rotationY += 0.002;
});
`)]),n(`
`),s("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=s("h2",{id:"핵심-요약",tabindex:"-1"},[n("핵심 요약 "),s("a",{class:"header-anchor",href:"#핵심-요약","aria-label":'Permalink to "핵심 요약"'},"​")],-1)),i[3]||(i[3]=s("ul",null,[s("li",null,[s("strong",null,"GPU 가속"),n(": CPU 연산 없이 GPU 에서 거리를 판단하므로 대량의 객체에도 성능 저하가 거의 없습니다.")]),s("li",null,[s("strong",null,"메모리 절약"),n(": 멀리 있는 객체에 저해상도 모델을 사용하여 정점 처리 비용을 획기적으로 줄입니다.")])],-1))])}const u=r(o,[["render",g]]);export{F as __pageData,u as default};
