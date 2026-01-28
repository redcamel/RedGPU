import{f as h,D as t,o as d,c as o,a2 as n,G as a,w as l,k as e,a as i}from"./chunks/framework.Dn9yU8Jh.js";const C=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"ko/assets/sprite/spritesheet.md","filePath":"ko/assets/sprite/spritesheet.md","lastUpdated":1769586579000}'),k={name:"ko/assets/sprite/spritesheet.md"};function c(g,s,S,y,E,P){const p=t("CodePen"),r=t("ClientOnly");return d(),o("div",null,[s[1]||(s[1]=n(`<h1 id="spritesheet3d" tabindex="-1">SpriteSheet3D <a class="header-anchor" href="#spritesheet3d" aria-label="Permalink to &quot;SpriteSheet3D&quot;">​</a></h1><p><strong>SpriteSheet3D</strong> 는 하나의 이미지에 여러 애니메이션 프레임이 포함된 <strong>스프라이트 시트</strong>(Sprite Sheet) 를 사용하여 3D 공간 내에서 연속된 동작을 구현하는 객체입니다. 폭발 효과, 불꽃, 걷는 캐릭터 등 역동적인 2D 애니메이션을 3D 공간에 배치할 때 유용합니다.</p><h2 id="_1-스프라이트-시트-이해" tabindex="-1">1. 스프라이트 시트 이해 <a class="header-anchor" href="#_1-스프라이트-시트-이해" aria-label="Permalink to &quot;1. 스프라이트 시트 이해&quot;">​</a></h2><p>스프라이트 시트는 여러 프레임의 이미지를 격자 형태로 나열한 하나의 커다란 텍스처입니다. RedGPU는 이 텍스처를 지정된 구획(Segment)으로 나누어 프레임별로 순차적으로 보여줌으로써 애니메이션을 완성합니다.</p><p><img src="https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png" alt="SpriteSheet Image"></p><h2 id="_2-기본-사용법" tabindex="-1">2. 기본 사용법 <a class="header-anchor" href="#_2-기본-사용법" aria-label="Permalink to &quot;2. 기본 사용법&quot;">​</a></h2><p>스프라이트 시트를 사용하기 위해서는 먼저 시트의 구조를 정의하는 <strong>SpriteSheetInfo</strong> 객체를 생성한 뒤, 이를 <strong>SpriteSheet3D</strong> 에 전달해야 합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. 스프라이트 시트 정보 정의</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sheetInfo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SpriteSheetInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 가로 5개, 세로 3개 세그먼트</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 총 프레임 수</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,    </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 시작 프레임 인덱스</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 반복 재생 여부 (loop)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    24</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 초당 프레임 수 (FPS)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. SpriteSheet3D 인스턴스 생성 및 추가</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> spriteSheet</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SpriteSheet3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sheetInfo);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(spriteSheet);</span></span></code></pre></div><h2 id="_3-애니메이션-제어" tabindex="-1">3. 애니메이션 제어 <a class="header-anchor" href="#_3-애니메이션-제어" aria-label="Permalink to &quot;3. 애니메이션 제어&quot;">​</a></h2><p><code>SpriteSheet3D</code> 인스턴스를 통해 애니메이션의 재생 상태를 실시간으로 제어할 수 있습니다.</p><ul><li><strong><code>play()</code></strong>: 애니메이션을 시작합니다.</li><li><strong><code>stop()</code></strong>: 현재 프레임에서 애니메이션을 일시 정지합니다.</li><li><strong><code>gotoAndPlay(frameIndex)</code></strong>: 지정한 프레임으로 이동한 즉시 재생합니다.</li><li><strong><code>gotoAndStop(frameIndex)</code></strong>: 지정한 프레임으로 이동한 후 정지합니다.</li></ul><h2 id="_4-실습-예제-걷는-캐릭터-애니메이션" tabindex="-1">4. 실습 예제: 걷는 캐릭터 애니메이션 <a class="header-anchor" href="#_4-실습-예제-걷는-캐릭터-애니메이션" aria-label="Permalink to &quot;4. 실습 예제: 걷는 캐릭터 애니메이션&quot;">​</a></h2><p>격자 형태의 시트 이미지가 <code>SpriteSheet3D</code> 와 <strong>Billboard</strong> 설정을 통해 어떻게 자연스러운 캐릭터 동작으로 변하는지 확인해 봅니다.</p>`,13)),a(r,null,{default:l(()=>[a(p,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),e("pre",null,[e("code",null,`// 1. SpriteSheetInfo 생성 (5x3 격자, 15프레임, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. 기본 빌보드 (Perspective ON)
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
scene.addChild(spriteSheet1);

// 3. 빌보드 비활성화 (공간에 고정된 평면)
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 0; spriteSheet2.y = 1;
spriteSheet2.useBillboard = false;
scene.addChild(spriteSheet2);

// 4. 고정 크기 빌보드 (Perspective OFF)
const spriteSheet3 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet3.x = 3; spriteSheet3.y = 1;
spriteSheet3.useBillboardPerspective = false;
scene.addChild(spriteSheet3);

// 5. 옵션 설명 라벨 (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true; // 라벨은 항상 정면 보기
    scene.addChild(label);
};

createLabel('Billboard ON', -3, 2.2);
createLabel('Billboard OFF', 0, 2.2);
createLabel('Perspective OFF', 3, 2.2);

// 3D 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),i(`
`),e("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=n('<hr><h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><strong>SpriteSheetInfo</strong> : 이미지 소스와 시트의 격자 구조(Segments), 애니메이션 속도(FPS) 등을 정의합니다.</li><li><strong>애니메이션 제어</strong>: <code>play</code>, <code>stop</code>, <code>gotoAndPlay</code> 등의 메서드를 통해 시각적 흐름을 제어합니다.</li><li><strong>효율성</strong>: 여러 장의 이미지를 각각 불러오는 대신 하나의 시트 파일을 사용하므로 네트워크 오버헤드와 GPU 메모리 관리 측면에서 유리합니다.</li></ul>',3))])}const u=h(k,[["render",c]]);export{C as __pageData,u as default};
