import{f as d,D as a,o as c,c as h,a2 as i,G as s,w as r,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const f=JSON.parse('{"title":"FXAA","description":"","frontmatter":{"title":"FXAA","order":3},"headers":[],"relativePath":"ko/antialiasing/fxaa.md","filePath":"ko/antialiasing/fxaa.md","lastUpdated":1770625747000}'),p={name:"ko/antialiasing/fxaa.md"};function g(A,n,x,u,P,m){const o=a("CodePen"),l=a("ClientOnly");return c(),h("div",null,[n[1]||(n[1]=i(`<h1 id="fxaa-fast-approximate-aa" tabindex="-1">FXAA (Fast Approximate AA) <a class="header-anchor" href="#fxaa-fast-approximate-aa" aria-label="Permalink to &quot;FXAA (Fast Approximate AA)&quot;">​</a></h1><p><strong>FXAA</strong> 는 렌더링된 최종 이미지를 분석하여 경계를 찾고 흐리게 만드는 <strong>후처리</strong>(Post-Processing) 방식의 안티앨리어싱입니다.</p><h2 id="_1-특징-및-장점" tabindex="-1">1. 특징 및 장점 <a class="header-anchor" href="#_1-특징-및-장점" aria-label="Permalink to &quot;1. 특징 및 장점&quot;">​</a></h2><ul><li><strong>초고속</strong>: 연산 비용이 매우 적어 모바일 기기에서도 부담 없이 사용할 수 있습니다.</li><li><strong>메모리 절약</strong>: MSAA처럼 추가적인 버퍼를 요구하지 않습니다.</li><li><strong>제약</strong>: 화면 전체적으로 미세한 블러(Blur)가 발생하여 텍스처가 약간 흐려 보일 수 있습니다.</li></ul><h2 id="_2-사용법" tabindex="-1">2. 사용법 <a class="header-anchor" href="#_2-사용법" aria-label="Permalink to &quot;2. 사용법&quot;">​</a></h2><p><code>antialiasingManager.useFXAA</code> 를 통해 활성화합니다. 이를 켜면 MSAA나 TAA는 자동으로 비활성화됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// FXAA 활성화 (다른 AA는 꺼짐)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.antialiasingManager.useFXAA </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="_3-실습-예제-fxaa-품질-확인" tabindex="-1">3. 실습 예제: FXAA 품질 확인 <a class="header-anchor" href="#_3-실습-예제-fxaa-품질-확인" aria-label="Permalink to &quot;3. 실습 예제: FXAA 품질 확인&quot;">​</a></h2><p>FXAA가 엣지뿐만 아니라 텍스처와 하이라이트의 자글거림을 어떻게 처리하는지 확인해 보세요.</p>`,9)),s(l,null,{default:r(()=>[s(o,{title:"RedGPU - FXAA Example",slugHash:"antialiasing-fxaa"},{default:r(()=>[...n[0]||(n[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=i('<h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><strong>후처리 방식</strong>: 렌더링된 이미지 위에서 동작합니다.</li><li><strong>배타적 실행</strong>: FXAA를 켜면 MSAA, TAA는 꺼집니다.</li><li><strong>전역 제어</strong>: <code>redGPUContext</code> 단위로 제어됩니다.</li></ul>',2))])}const G=d(p,[["render",g]]);export{f as __pageData,G as default};
