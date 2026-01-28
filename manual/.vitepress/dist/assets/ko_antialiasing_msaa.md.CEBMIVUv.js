import{f as o,D as t,o as d,c as p,a2 as c,G as i,w as s,k as e,a as n}from"./chunks/framework.Dn9yU8Jh.js";const G=JSON.parse('{"title":"MSAA","description":"","frontmatter":{"title":"MSAA","order":2},"headers":[],"relativePath":"ko/antialiasing/msaa.md","filePath":"ko/antialiasing/msaa.md","lastUpdated":1769586579000}'),h={name:"ko/antialiasing/msaa.md"};function g(u,a,A,m,P,x){const r=t("CodePen"),l=t("ClientOnly");return d(),p("div",null,[a[1]||(a[1]=c(`<h1 id="msaa-multisample-aa" tabindex="-1">MSAA (Multisample AA) <a class="header-anchor" href="#msaa-multisample-aa" aria-label="Permalink to &quot;MSAA (Multisample AA)&quot;">​</a></h1><p><strong>MSAA</strong>(Multisample Antialiasing) 는 하드웨어(GPU) 레벨에서 지원하는 가장 표준적인 안티앨리어싱 방식입니다. 지오메트리의 경계(Edge) 부분을 여러 번 샘플링하여 부드럽게 처리합니다.</p><h2 id="_1-특징-및-장점" tabindex="-1">1. 특징 및 장점 <a class="header-anchor" href="#_1-특징-및-장점" aria-label="Permalink to &quot;1. 특징 및 장점&quot;">​</a></h2><ul><li><strong>표준 품질</strong>: 오랫동안 사용되어 온 검증된 방식으로, 물체의 외곽선을 매우 깔끔하게 정리합니다.</li><li><strong>성능 밸런스</strong>: 텍스처 내부까지 처리하는 슈퍼 샘플링(SSAA)보다는 가볍지만, 후처리 방식(FXAA)보다는 메모리를 더 사용합니다.</li><li><strong>제약</strong>: 지오메트리의 외곽선만 부드럽게 처리하므로, 텍스처 내부의 자글거림이나 쉐이더 알리어싱은 해결하지 못합니다.</li></ul><h2 id="_2-사용법" tabindex="-1">2. 사용법 <a class="header-anchor" href="#_2-사용법" aria-label="Permalink to &quot;2. 사용법&quot;">​</a></h2><p><code>antialiasingManager.useMSAA</code> 를 통해 활성화합니다. 이를 켜면 FXAA나 TAA는 자동으로 비활성화됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// MSAA 활성화 (다른 AA는 꺼짐)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.antialiasingManager.useMSAA </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="_3-실습-예제-msaa-적용" tabindex="-1">3. 실습 예제: MSAA 적용 <a class="header-anchor" href="#_3-실습-예제-msaa-적용" aria-label="Permalink to &quot;3. 실습 예제: MSAA 적용&quot;">​</a></h2><p>MSAA를 켜고 끄면서 지오메트리 외곽선과 하이라이트의 변화를 비교해 보세요.</p>`,9)),i(l,null,{default:s(()=>[i(r,{title:"RedGPU - MSAA Example",slugHash:"antialiasing-msaa"},{default:s(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),a[2]||(a[2]=e("h2",{id:"핵심-요약",tabindex:"-1"},[n("핵심 요약 "),e("a",{class:"header-anchor",href:"#핵심-요약","aria-label":'Permalink to "핵심 요약"'},"​")],-1)),a[3]||(a[3]=e("ul",null,[e("li",null,[e("strong",null,"하드웨어 지원"),n(": GPU의 내장 기능을 사용합니다.")]),e("li",null,[e("strong",null,"경계선 특화"),n(": 물체의 테두리를 부드럽게 만드는 데 탁월합니다.")]),e("li",null,[e("strong",null,"기본값"),n(": 일반 디스플레이 환경에서는 기본적으로 활성화됩니다.")])],-1))])}const M=o(h,[["render",g]]);export{G as __pageData,M as default};
