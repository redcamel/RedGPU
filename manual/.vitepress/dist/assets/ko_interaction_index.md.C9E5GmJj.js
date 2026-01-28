import{f as r,D as s,o as h,c as p,a2 as a,G as i,w as l,k as e,a as n}from"./chunks/framework.Dn9yU8Jh.js";const f=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"ko/interaction/index.md","filePath":"ko/interaction/index.md","lastUpdated":1769586187000}'),c={name:"ko/interaction/index.md"};function E(k,t,g,y,x,C){const d=s("CodePen"),o=s("ClientOnly");return h(),p("div",null,[t[1]||(t[1]=a(`<h1 id="인터렉션" tabindex="-1">인터렉션 <a class="header-anchor" href="#인터렉션" aria-label="Permalink to &quot;인터렉션&quot;">​</a></h1><p>RedGPU는 3D 및 2D 객체에 대한 마우스 및 터치 이벤트를 처리하는 직관적인 <strong>피킹</strong>(Picking) 시스템을 제공합니다. <code>Mesh</code>, <code>Sprite3D</code>, <code>Sprite2D</code> 등 대부분의 디스플레이 객체는 사용자 입력을 수신하고 반응할 수 있습니다.</p><h2 id="_1-이벤트-리스너-등록" tabindex="-1">1. 이벤트 리스너 등록 <a class="header-anchor" href="#_1-이벤트-리스너-등록" aria-label="Permalink to &quot;1. 이벤트 리스너 등록&quot;">​</a></h2><p>객체에 이벤트를 등록하려면 <code>addListener</code> 메서드를 사용합니다. 이벤트가 발생하면 등록된 콜백 함수가 실행되며, 이벤트 정보 객체(<code>e</code>)가 전달됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 이벤트 타입 상수 참조</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Picking;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CLICK</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;클릭된 객체:&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, e.target);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 클릭 시 회전</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    e.target.rotationY </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 45</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h2 id="_2-지원하는-이벤트-타입" tabindex="-1">2. 지원하는 이벤트 타입 <a class="header-anchor" href="#_2-지원하는-이벤트-타입" aria-label="Permalink to &quot;2. 지원하는 이벤트 타입&quot;">​</a></h2><p><code>RedGPU.Picking.PICKING_EVENT_TYPE</code> 에 정의된 6가지 기본 이벤트를 지원합니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">이벤트 상수</th><th style="text-align:left;">문자열 값</th><th style="text-align:left;">설명</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>CLICK</code></strong></td><td style="text-align:left;"><code>&#39;click&#39;</code></td><td style="text-align:left;">마우스 클릭 또는 터치 탭 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>DOWN</code></strong></td><td style="text-align:left;"><code>&#39;down&#39;</code></td><td style="text-align:left;">마우스 버튼을 누르거나 터치 시작 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>UP</code></strong></td><td style="text-align:left;"><code>&#39;up&#39;</code></td><td style="text-align:left;">마우스 버튼을 떼거나 터치 종료 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>OVER</code></strong></td><td style="text-align:left;"><code>&#39;over&#39;</code></td><td style="text-align:left;">마우스 커서가 객체 위로 진입할 때 발생 (Hover In)</td></tr><tr><td style="text-align:left;"><strong><code>OUT</code></strong></td><td style="text-align:left;"><code>&#39;out&#39;</code></td><td style="text-align:left;">마우스 커서가 객체 밖으로 벗어날 때 발생 (Hover Out)</td></tr><tr><td style="text-align:left;"><strong><code>MOVE</code></strong></td><td style="text-align:left;"><code>&#39;move&#39;</code></td><td style="text-align:left;">객체 위에서 마우스 포인터가 이동할 때 지속적으로 발생</td></tr></tbody></table><h2 id="_3-실습-예제-인터렉티브-큐브" tabindex="-1">3. 실습 예제: 인터렉티브 큐브 <a class="header-anchor" href="#_3-실습-예제-인터렉티브-큐브" aria-label="Permalink to &quot;3. 실습 예제: 인터렉티브 큐브&quot;">​</a></h2><p>마우스 오버 시 크기가 변하고, 클릭 시 색상이 바뀌며, 이동 시 좌표를 확인할 수 있는 인터렉티브 예제입니다.</p>`,10)),i(o,null,{default:l(()=>[i(d,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),n(`
`),e("pre",null,[e("code",null,`// 1. 기본 큐브 생성
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. 상태 표시를 위한 HTML UI 생성 (하단 중앙)
const statusOverlay = document.createElement('div');
Object.assign(statusOverlay.style, {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 32px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontFamily: 'monospace',
    fontSize: '16px',
    textAlign: 'center',
    pointerEvents: 'none',
    border: '1px solid #444',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
});

// 두 줄 구조로 생성
statusOverlay.innerHTML = \`
    <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 4px;">Ready to Interact</div>
    <div id="event-detail" style="font-size: 14px; color: #aaa;">Move or Click the Cube</div>
\`;
document.body.appendChild(statusOverlay);

const typeEl = statusOverlay.querySelector('#event-type');
const detailEl = statusOverlay.querySelector('#event-detail');

// 3. 이벤트 리스너 등록

// [CLICK] 클릭 시 랜덤 색상 변경 및 회전
mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    e.target.material.color.setColorByRGB(r, g, b);
    
    e.target.rotationY += 45;
    e.target.rotationX += 45;

    typeEl.innerText = 'Event: CLICK';
    typeEl.style.color = '#ffcc00';
    detailEl.innerText = 'Color Changed!';
});

// [DOWN] 마우스 버튼을 눌렀을 때
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    typeEl.innerText = 'Event: MOUSE_DOWN';
    typeEl.style.color = '#ff4444';
});

// [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    detailEl.innerText = \`MOUSE_MOVE at (\${e.mouseX.toFixed(2)}, \${e.mouseY.toFixed(2)})\`;
});

// [OVER] 마우스 오버 시
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    typeEl.innerText = 'Event: MOUSE_OVER';
    typeEl.style.color = '#00CC99';
});

// [OUT] 마우스 아웃 시
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
    detailEl.innerText = 'Move or Click the Cube';
});

// 4. 카메라 및 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a('<h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><code>addListener</code> 를 통해 객체별로 독립적인 이벤트 처리가 가능합니다.</li><li><code>e.target</code> 을 통해 이벤트가 발생한 객체에 직접 접근할 수 있습니다.</li><li>마우스 커서 스타일 변경(<code>document.body.style.cursor</code>) 등 웹 표준 DOM API와 함께 사용하여 UX를 향상시킬 수 있습니다.</li></ul><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><p>인터렉션까지 더해진 풍성한 장면에 시각적인 완성도를 높여주는 후처리 효과를 적용해 봅니다.</p><ul><li><strong><a href="./../post-effect/">포스트 이펙트</a></strong></li></ul>',5))])}const P=r(c,[["render",E]]);export{f as __pageData,P as default};
