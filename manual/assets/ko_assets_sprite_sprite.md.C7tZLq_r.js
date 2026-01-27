import{f as d,D as i,o as h,c as o,a2 as a,G as n,w as l,k as e,a as t}from"./chunks/framework.Dn9yU8Jh.js";const P=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"ko/assets/sprite/sprite.md","filePath":"ko/assets/sprite/sprite.md","lastUpdated":1769502195000}'),k={name:"ko/assets/sprite/sprite.md"};function c(g,s,u,y,E,b){const r=i("CodePen"),p=i("ClientOnly");return h(),o("div",null,[s[1]||(s[1]=a(`<h1 id="sprite3d" tabindex="-1">Sprite3D <a class="header-anchor" href="#sprite3d" aria-label="Permalink to &quot;Sprite3D&quot;">​</a></h1><p><strong>Sprite3D</strong> 는 3D 공간 내에 배치되는 2D 평면 객체입니다. 일반적인 메시와 달리 <strong>빌보드</strong>(Billboard) 기능을 기본으로 내장하고 있어, 카메라의 회전 방향에 관계없이 항상 정면을 유지해야 하는 요소(아이콘, 이름표, 특수 효과 등)를 구현하는 데 최적화되어 있습니다.</p><h2 id="_1-주요-특징" tabindex="-1">1. 주요 특징 <a class="header-anchor" href="#_1-주요-특징" aria-label="Permalink to &quot;1. 주요 특징&quot;">​</a></h2><ul><li><strong>Billboard</strong> : 카메라를 항상 정면으로 바라보는 기능을 기본으로 지원합니다.</li><li><strong>자동 비율 유지</strong>: 할당된 텍스처의 원본 비율(Aspect Ratio)을 자동으로 계산하여 평면의 크기를 조절합니다.</li><li><strong>UI 친화적</strong> : 3D 공간 내에서의 위치(World Position)와 2D적인 표현 방식을 결합하여 공간감 있는 UI 요소를 제공합니다.</li></ul><h2 id="_2-기본-사용법" tabindex="-1">2. 기본 사용법 <a class="header-anchor" href="#_2-기본-사용법" aria-label="Permalink to &quot;2. 기본 사용법&quot;">​</a></h2><p><code>Sprite3D</code> 는 내부적으로 <strong>Plane</strong> 지오메트리를 사용하며, 이미지를 출력하기 위해 <strong>BitmapMaterial</strong> 과 함께 사용됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. 텍스처 및 재질 생성</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> texture</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BitmapTexture</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> material</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Material.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BitmapMaterial</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, texture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. 스프라이트 생성 및 추가</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sprite</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sprite3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, material);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sprite);</span></span></code></pre></div><h2 id="_3-핵심-속성-제어" tabindex="-1">3. 핵심 속성 제어 <a class="header-anchor" href="#_3-핵심-속성-제어" aria-label="Permalink to &quot;3. 핵심 속성 제어&quot;">​</a></h2><p>스프라이트의 빌보드 동작과 시각적 표현을 제어하는 주요 속성들입니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">속성명</th><th style="text-align:left;">설명</th><th style="text-align:left;">기본값</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>useBillboard</code></strong></td><td style="text-align:left;">카메라를 항상 향하게 할지 여부</td><td style="text-align:left;"><code>true</code></td></tr><tr><td style="text-align:left;"><strong><code>useBillboardPerspective</code></strong></td><td style="text-align:left;">카메라와의 거리에 따른 원근감(크기 변화) 적용 여부</td><td style="text-align:left;"><code>true</code></td></tr></tbody></table><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 멀어져도 크기가 일정하게 유지되는 아이콘 스타일 설정</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sprite.useBillboard </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sprite.useBillboardPerspective </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="_4-실습-예제-빌보드-유형별-비교" tabindex="-1">4. 실습 예제: 빌보드 유형별 비교 <a class="header-anchor" href="#_4-실습-예제-빌보드-유형별-비교" aria-label="Permalink to &quot;4. 실습 예제: 빌보드 유형별 비교&quot;">​</a></h2><p>3D 공간에 세 가지 서로 다른 설정의 스프라이트를 배치하여 빌보드 옵션에 따른 시각적 차이를 확인해 봅니다.</p>`,13)),n(p,null,{default:l(()=>[n(r,{title:"RedGPU - Sprite3D Billboard Showcase",slugHash:"sprite3d-showcase"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),e("pre",null,[e("code",null,`// 공용 재질 생성
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. 기본 빌보드 (Perspective ON)
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
scene.addChild(sprite1);

// 2. 빌보드 비활성화 (공간에 고정된 평면)
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 0; sprite2.y = 1;
sprite2.useBillboard = false;
scene.addChild(sprite2);

// 3. 고정 크기 빌보드 (Perspective OFF)
const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite3.x = 3; sprite3.y = 1;
sprite3.useBillboardPerspective = false;
scene.addChild(sprite3);

// 4. 옵션 설명 라벨 (TextField3D)
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
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=a('<hr><h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><strong>Sprite3D</strong> 는 3D 좌표계를 가지면서도 카메라를 정면으로 바라보는 <strong>Billboard</strong> 기능을 제공합니다.</li><li><code>useBillboardPerspective</code> 속성을 통해 거리에 관계없이 일정한 크기로 표현되는 UI 스타일 요소를 구현할 수 있습니다.</li><li>텍스처의 해상도와 비율에 따라 지오메트리 크기가 자동 조정되어 편리하게 사용할 수 있습니다.</li></ul><hr><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><p>스프라이트를 활용한 애니메이션 효과에 대해 알아봅니다.</p><ul><li><strong><a href="./../sprite/spritesheet.html">SpriteSheet3D</a></strong></li></ul>',7))])}const C=d(k,[["render",c]]);export{P as __pageData,C as default};
