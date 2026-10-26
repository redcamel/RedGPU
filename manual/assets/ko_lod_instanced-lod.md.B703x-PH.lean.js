import{f as r,D as a,o as p,c as d,a2 as k,G as e,w as t,k as s,a as i}from"./chunks/framework.n5RLHRfo.js";const U=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"ko/lod/instanced-lod.md","filePath":"ko/lod/instanced-lod.md","lastUpdated":1792993711000}'),o={name:"ko/lod/instanced-lod.md"};function g(c,n,E,y,m,P){const l=a("CodePen"),h=a("ClientOnly");return p(),d("div",null,[n[1]||(n[1]=k("",9)),e(h,null,{default:t(()=>[e(l,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...n[0]||(n[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),s("pre",null,[s("code",null,`// 조명 추가
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 60);
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
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    // 전체 회전
    mesh.rotationY += 0.002;
});
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=s("h2",{id:"관련-예제",tabindex:"-1"},[i("관련 예제 "),s("a",{class:"header-anchor",href:"#관련-예제","aria-label":'Permalink to "관련 예제"'},"​")],-1)),n[3]||(n[3]=s("ul",null,[s("li",null,[s("a",{href:"/RedGPU/examples/3d/lod/InstanceMeshGPULOD/",target:"_blank",rel:"noopener noreferrer"},"InstancingMesh GPU LOD")]),s("li",null,[s("a",{href:"/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/",target:"_blank",rel:"noopener noreferrer"},"InstancingMesh GPU LOD (레벨별 재질 변경)")])],-1))])}const D=r(o,[["render",g]]);export{U as __pageData,D as default};
