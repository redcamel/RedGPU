import{f as r,D as a,o as p,c as d,a2 as k,G as n,w as t,k as s,a as i}from"./chunks/framework.DZW1bhNM.js";const x=JSON.parse('{"title":"Mesh LOD","description":"","frontmatter":{"title":"Mesh LOD","order":2},"headers":[],"relativePath":"ko/lod/mesh-lod.md","filePath":"ko/lod/mesh-lod.md","lastUpdated":1770698112000}'),o={name:"ko/lod/mesh-lod.md"};function c(E,e,g,m,y,C){const l=a("CodePen"),h=a("ClientOnly");return p(),d("div",null,[e[1]||(e[1]=k(`<h1 id="mesh-lod" tabindex="-1">Mesh LOD <a class="header-anchor" href="#mesh-lod" aria-label="Permalink to &quot;Mesh LOD&quot;">​</a></h1><p>일반적인 <strong>메시</strong>(Mesh) 객체에 LOD 를 적용하는 방법을 다룹니다. <code>Mesh</code> 의 LOD 는 CPU 에서 카메라 와의 거리를 매 프레임 계산하여, 조건에 맞는 <strong>지오메트리</strong>(Geometry) 로 교체하는 방식으로 동작합니다.</p><h2 id="_1-동작-원리" tabindex="-1">1. 동작 원리 <a class="header-anchor" href="#_1-동작-원리" aria-label="Permalink to &quot;1. 동작 원리&quot;">​</a></h2><p><code>Mesh</code> 내부의 <code>LODManager</code> 는 등록된 LOD 레벨들을 순회하며, 현재 카메라 거리보다 작거나 같은 가장 큰 거리값의 레벨을 찾습니다. 적합한 레벨을 찾으면 해당 레벨에 등록된 지오메트리 로 렌더링 대상이 교체됩니다.</p><h2 id="_2-사용법" tabindex="-1">2. 사용법 <a class="header-anchor" href="#_2-사용법" aria-label="Permalink to &quot;2. 사용법&quot;">​</a></h2><p><code>mesh.LODManager.addLOD(distance, geometry)</code> 를 사용하여 거리별 지오메트리 를 등록합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. 기본 메쉬 생성 (거리 0~10)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mesh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Mesh</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    material</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. LOD 레벨 추가</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 거리 10 이상: Sphere (16x16)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 거리 20 이상: Box</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(mesh);</span></span></code></pre></div><h2 id="_3-실습-예제" tabindex="-1">3. 실습 예제 <a class="header-anchor" href="#_3-실습-예제" aria-label="Permalink to &quot;3. 실습 예제&quot;">​</a></h2><p>거리에 따라 구 형태가 단순해지다가 결국 박스로 변하는 과정을 확인해 보세요.</p>`,9)),n(h,null,{default:t(()=>[n(l,{title:"RedGPU - Mesh LOD Example",slugHash:"lod-mesh-basic"},{default:t(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
