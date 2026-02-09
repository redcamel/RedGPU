import{f as r,D as a,o as d,c as p,a2 as k,G as e,w as t,k as s,a as n}from"./chunks/framework.DpNgdNqH.js";const F=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"ko/lod/instanced-lod.md","filePath":"ko/lod/instanced-lod.md","lastUpdated":1770634323000}'),o={name:"ko/lod/instanced-lod.md"};function g(E,i,c,y,C,m){const h=a("CodePen"),l=a("ClientOnly");return d(),p("div",null,[i[1]||(i[1]=k(`<h1 id="instancing-mesh-lod" tabindex="-1">Instancing Mesh LOD <a class="header-anchor" href="#instancing-mesh-lod" aria-label="Permalink to &quot;Instancing Mesh LOD&quot;">​</a></h1><p>대량의 객체를 렌더링하는 <strong>인스턴싱 메시</strong>(Instancing Mesh) 에 LOD 를 적용하는 방법을 다룹니다. <code>InstancingMesh</code> 의 LOD 는 각 인스턴스별 거리 계산을 <strong>GPU 쉐이더</strong> 내부에서 병렬로 처리하므로, 수만 개의 객체에 대해 LOD 를 적용해도 CPU 부하가 거의 없는 것이 특징입니다.</p><h2 id="_1-동작-원리" tabindex="-1">1. 동작 원리 <a class="header-anchor" href="#_1-동작-원리" aria-label="Permalink to &quot;1. 동작 원리&quot;">​</a></h2><p><code>InstancingMesh</code> 에 LOD 를 등록하면, 내부적으로 LOD 개수만큼의 <strong>서브 드로우 콜</strong>(Sub Draw Call) 이 생성될 수 있습니다. 하지만 렌더링 파이프라인 최적화를 통해, GPU 에서 각 인스턴스의 카메라 거리를 판단하고 적절한 지오메트리 버퍼를 참조하여 그립니다.</p><h2 id="_2-사용법" tabindex="-1">2. 사용법 <a class="header-anchor" href="#_2-사용법" aria-label="Permalink to &quot;2. 사용법&quot;">​</a></h2><p>일반 <code>Mesh</code> 와 동일하게 <code>LODManager.addLOD</code> 를 사용합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. InstancingMesh 생성 (기본: Sphere High Poly)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> instancedMesh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">InstancingMesh</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    10000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    material</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. LOD 레벨 추가</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// GPU가 각 인스턴스별로 거리를 계산하여 아래 지오메트리를 적용합니다.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">instancedMesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">instancedMesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">40</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(instancedMesh);</span></span></code></pre></div><h2 id="_3-실습-예제-2-000개의-lod-큐브" tabindex="-1">3. 실습 예제: 2,000개의 LOD 큐브 <a class="header-anchor" href="#_3-실습-예제-2-000개의-lod-큐브" aria-label="Permalink to &quot;3. 실습 예제: 2,000개의 LOD 큐브&quot;">​</a></h2><p>2,000개의 객체가 카메라 와의 거리에 따라 모양이 변하는 것을 확인해 보세요. 카메라를 줌인/줌아웃 하면 멀리 있는 객체들은 박스(Box) 로, 가까운 객체들은 구(Sphere) 로 표시됩니다.</p>`,9)),e(l,null,{default:t(()=>[e(h,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
