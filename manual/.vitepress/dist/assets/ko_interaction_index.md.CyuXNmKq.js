import{f as o,D as i,o as h,c as p,a2 as a,G as n,w as l,k as t,a as s}from"./chunks/framework.DZW1bhNM.js";const b=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"ko/interaction/index.md","filePath":"ko/interaction/index.md","lastUpdated":1770698112000}'),c={name:"ko/interaction/index.md"};function k(g,e,y,E,x,f){const d=i("CodePen"),r=i("ClientOnly");return h(),p("div",null,[e[1]||(e[1]=a(`<h1 id="인터렉션" tabindex="-1">인터렉션 <a class="header-anchor" href="#인터렉션" aria-label="Permalink to &quot;인터렉션&quot;">​</a></h1><p>RedGPU는 3D 및 2D 객체에 대한 마우스 및 터치 이벤트를 처리하는 직관적인 <strong>피킹</strong>(Picking) 시스템과 키보드 상태를 실시간으로 관리하는 <strong>키보드 버퍼</strong>(keyboardKeyBuffer) 기능을 제공합니다. 이를 통해 마우스 클릭부터 복잡한 캐릭터 컨트롤까지 다양한 사용자 입력을 손쉽게 처리할 수 있습니다.</p><h2 id="_1-마우스-및-터치-인터렉션-picking" tabindex="-1">1. 마우스 및 터치 인터렉션 (Picking) <a class="header-anchor" href="#_1-마우스-및-터치-인터렉션-picking" aria-label="Permalink to &quot;1. 마우스 및 터치 인터렉션 (Picking)&quot;">​</a></h2><p>RedGPU의 피킹 시스템은 <code>Mesh</code>, <code>Sprite3D</code>, <code>Sprite2D</code> 등 대부분의 디스플레이 객체에 대해 사용자 입력을 수신하고 반응할 수 있는 기능을 제공합니다.</p><h3 id="_1-1-이벤트-리스너-등록" tabindex="-1">1.1 이벤트 리스너 등록 <a class="header-anchor" href="#_1-1-이벤트-리스너-등록" aria-label="Permalink to &quot;1.1 이벤트 리스너 등록&quot;">​</a></h3><p>객체에 이벤트를 등록하려면 <code>addListener</code> 메서드를 사용합니다. 이벤트가 발생하면 등록된 콜백 함수가 실행되며, 이벤트 정보 객체(<code>e</code>)가 전달됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 이벤트 타입 상수 참조</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Picking;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CLICK</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;클릭된 객체:&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, e.target);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 클릭 시 회전</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    e.target.rotationY </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 45</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="_1-2-지원하는-이벤트-타입" tabindex="-1">1.2 지원하는 이벤트 타입 <a class="header-anchor" href="#_1-2-지원하는-이벤트-타입" aria-label="Permalink to &quot;1.2 지원하는 이벤트 타입&quot;">​</a></h3><p><code>RedGPU.Picking.PICKING_EVENT_TYPE</code> 에 정의된 6가지 기본 이벤트를 지원합니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">이벤트 상수</th><th style="text-align:left;">문자열 값</th><th style="text-align:left;">설명</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>CLICK</code></strong></td><td style="text-align:left;"><code>&#39;click&#39;</code></td><td style="text-align:left;">마우스 클릭 또는 터치 탭 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>DOWN</code></strong></td><td style="text-align:left;"><code>&#39;down&#39;</code></td><td style="text-align:left;">마우스 버튼을 누르거나 터치 시작 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>UP</code></strong></td><td style="text-align:left;"><code>&#39;up&#39;</code></td><td style="text-align:left;">마우스 버튼을 떼거나 터치 종료 시 발생</td></tr><tr><td style="text-align:left;"><strong><code>OVER</code></strong></td><td style="text-align:left;"><code>&#39;over&#39;</code></td><td style="text-align:left;">마우스 커서가 객체 위로 진입할 때 발생 (Hover In)</td></tr><tr><td style="text-align:left;"><strong><code>OUT</code></strong></td><td style="text-align:left;"><code>&#39;out&#39;</code></td><td style="text-align:left;">마우스 커서가 객체 밖으로 벗어날 때 발생 (Hover Out)</td></tr><tr><td style="text-align:left;"><strong><code>MOVE</code></strong></td><td style="text-align:left;"><code>&#39;move&#39;</code></td><td style="text-align:left;">객체 위에서 마우스 포인터가 이동할 때 지속적으로 발생</td></tr></tbody></table><h3 id="_1-3-상세-이벤트-정보-pickingevent" tabindex="-1">1.3 상세 이벤트 정보 (PickingEvent) <a class="header-anchor" href="#_1-3-상세-이벤트-정보-pickingevent" aria-label="Permalink to &quot;1.3 상세 이벤트 정보 (PickingEvent)&quot;">​</a></h3><p>이벤트 콜백에 전달되는 객체(<code>e</code>)는 발생 시점의 다양한 정보를 담고 있습니다. 이를 통해 정밀한 상호작용 로직을 구현할 수 있습니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">속성명</th><th style="text-align:left;">타입</th><th style="text-align:left;">설명</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>target</code></strong></td><td style="text-align:left;"><code>Mesh</code></td><td style="text-align:left;">이벤트가 발생한 대상 객체입니다.</td></tr><tr><td style="text-align:left;"><strong><code>type</code></strong></td><td style="text-align:left;"><code>string</code></td><td style="text-align:left;">발생한 이벤트의 타입입니다.</td></tr><tr><td style="text-align:left;"><strong><code>pickingId</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">피킹에 사용되는 고유 ID입니다.</td></tr><tr><td style="text-align:left;"><strong><code>mouseX</code></strong>, <strong><code>mouseY</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">캔버스 내에서의 마우스/터치 좌표입니다.</td></tr><tr><td style="text-align:left;"><strong><code>movementX</code></strong>, <strong><code>movementY</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">이전 이벤트 대비 마우스 이동량입니다.</td></tr><tr><td style="text-align:left;"><strong><code>point</code></strong></td><td style="text-align:left;"><code>vec3</code></td><td style="text-align:left;">월드 공간상의 정확한 교차 지점 좌표입니다.</td></tr><tr><td style="text-align:left;"><strong><code>localPoint</code></strong></td><td style="text-align:left;"><code>vec3</code></td><td style="text-align:left;">객체의 로컬 공간상의 교차 지점 좌표입니다.</td></tr><tr><td style="text-align:left;"><strong><code>localX</code></strong>, <strong><code>localY</code></strong>, <strong><code>localZ</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">로컬 공간상의 개별 좌표값입니다.</td></tr><tr><td style="text-align:left;"><strong><code>uv</code></strong></td><td style="text-align:left;"><code>vec2</code></td><td style="text-align:left;">교차 지점의 텍스처 좌표(UV)입니다.</td></tr><tr><td style="text-align:left;"><strong><code>distance</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">카메라와 교차 지점 사이의 거리입니다.</td></tr><tr><td style="text-align:left;"><strong><code>faceIndex</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">교차된 삼각형(Polygon)의 인덱스입니다. (없을 경우 -1)</td></tr><tr><td style="text-align:left;"><strong><code>time</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">이벤트가 발생한 시간(ms)입니다.</td></tr><tr><td style="text-align:left;"><strong><code>altKey</code></strong>, <strong><code>ctrlKey</code></strong>, <strong><code>shiftKey</code></strong></td><td style="text-align:left;"><code>boolean</code></td><td style="text-align:left;">이벤트 발생 시 조합 키의 눌림 상태입니다.</td></tr></tbody></table><h3 id="_1-4-실습-예제-인터렉티브-큐브" tabindex="-1">1.4 실습 예제: 인터렉티브 큐브 <a class="header-anchor" href="#_1-4-실습-예제-인터렉티브-큐브" aria-label="Permalink to &quot;1.4 실습 예제: 인터렉티브 큐브&quot;">​</a></h3><p>마우스 오버 시 크기가 변하고, 클릭 시 색상이 바뀌며, 이동 시 좌표를 확인할 수 있는 인터렉티브 예제입니다.</p>`,15)),n(r,null,{default:l(()=>[n(d,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...e[0]||(e[0]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),t("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),s(`
`),t("pre",null,[t("code",null,`// 1. 기본 큐브 생성
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. 상태 표시를 위한 HTML UI 생성 (하단 좌측)
const statusOverlay = document.createElement('div');
Object.assign(statusOverlay.style, {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    padding: '12px 16px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    textAlign: 'left',
    pointerEvents: 'none',
    border: '1px solid #444',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    minWidth: '240px'
});

statusOverlay.innerHTML = \`
    <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #444; padding-bottom: 4px;">Ready to Interact</div>
    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
        <div style="color: #888;">Canvas:</div><div id="canvas-pos">-</div>
        <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">World:</div><div id="world-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
        <div style="color: #888;">Local:</div><div id="local-pos">-</div>
        <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">UV:</div><div id="uv-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
        <div style="color: #888;">Distance:</div><div id="distance">-</div>
        <div style="color: #888;">FaceIdx:</div><div id="face-index">-</div>
    </div>
\`;
document.body.appendChild(statusOverlay);

const typeEl = statusOverlay.querySelector('#event-type');
const updateUI = (e) => {
    typeEl.innerText = \`Event: \${e.type.toUpperCase()}\`;
 
    statusOverlay.querySelector('#world-pos').innerText = \`\${e.point[0].toFixed(2)}, \${e.point[1].toFixed(2)}, \${e.point[2].toFixed(2)}\`;
    statusOverlay.querySelector('#local-pos').innerText = \`\${e.localPoint[0].toFixed(2)}, \${e.localPoint[1].toFixed(2)}, \${e.localPoint[2].toFixed(2)}\`;
    statusOverlay.querySelector('#uv-pos').innerText = \`\${e.uv[0].toFixed(3)}, \${e.uv[1].toFixed(3)}\`;
    statusOverlay.querySelector('#distance').innerText = e.distance.toFixed(3);
    statusOverlay.querySelector('#face-index').innerText = e.faceIndex;
};

// 3. 이벤트 리스너 등록

// [CLICK] 클릭 시 랜덤 색상 변경 및 회전
mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    e.target.material.color.setColorByRGB(r, g, b);
    
    
    updateUI(e);
    typeEl.style.color = '#ffcc00';
});

// [DOWN] 마우스 버튼을 눌렀을 때
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    updateUI(e);
    typeEl.style.color = '#ff4444';
});

// [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    updateUI(e);
});

// [OVER] 마우스 오버 시
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    updateUI(e);
    typeEl.style.color = '#00CC99';
});

// [OUT] 마우스 아웃 시
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    updateUI(e); // 마우스 아웃 시 UI 업데이트 (대시 표시)
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
});

// 4. 카메라 및 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),s(`
`),t("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),e[2]||(e[2]=a(`<h2 id="_2-키보드-인터렉션-keyboardkeybuffer" tabindex="-1">2. 키보드 인터렉션 (keyboardKeyBuffer) <a class="header-anchor" href="#_2-키보드-인터렉션-keyboardkeybuffer" aria-label="Permalink to &quot;2. 키보드 인터렉션 (keyboardKeyBuffer)&quot;">​</a></h2><p>객체 피킹 외에도, <code>redGPUContext.keyboardKeyBuffer</code>를 통해 키보드의 실시간 눌림 상태를 확인할 수 있습니다. 이는 캐릭터 이동, 카메라 컨트롤 등 매 프레임마다 키 상태를 체크해야 하는 로직에 매우 유용합니다.</p><h3 id="_2-1-기본-사용법" tabindex="-1">2.1 기본 사용법 <a class="header-anchor" href="#_2-1-기본-사용법" aria-label="Permalink to &quot;2.1 기본 사용법&quot;">​</a></h3><p><code>keyboardKeyBuffer</code>는 현재 눌려있는 키의 이름을 키(Key)로, 눌림 여부를 값(Value)으로 가지는 객체입니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(canvas, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 렌더 루프 내에서 상태 확인</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> render</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">time</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">keyboardKeyBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> redGPUContext;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;w&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">||</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;W&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;앞으로 이동 중...&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39; &#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;점프!&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> renderer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Renderer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    renderer.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, render);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="_2-2-주요-특징" tabindex="-1">2.2 주요 특징 <a class="header-anchor" href="#_2-2-주요-특징" aria-label="Permalink to &quot;2.2 주요 특징&quot;">​</a></h3><ul><li><strong>실시간 상태 관리</strong>: 별도의 <code>keydown</code>, <code>keyup</code> 리스너를 직접 관리할 필요 없이 <code>redGPUContext</code>에서 통합 관리됩니다.</li><li><strong>대소문자 구분</strong>: <code>e.key</code> 값을 그대로 사용하므로 대소문자를 구분합니다. 보편적인 입력을 위해서는 <code>&#39;w&#39;</code>와 <code>&#39;W&#39;</code>를 모두 체크하는 것이 좋습니다.</li><li><strong>조합 키 지원</strong>: <code>Shift</code>, <code>Control</code>, <code>Alt</code> 등의 특수 키 상태도 동일하게 확인할 수 있습니다.</li></ul><h2 id="_3-라이브-예제" tabindex="-1">3. 라이브 예제 <a class="header-anchor" href="#_3-라이브-예제" aria-label="Permalink to &quot;3. 라이브 예제&quot;">​</a></h2><p>RedGPU가 제공하는 다양한 인터렉션 동작을 아래 예제들을 통해 직접 확인할 수 있습니다.</p><h3 id="_3-1-마우스-및-터치-예제" tabindex="-1">3.1 마우스 및 터치 예제 <a class="header-anchor" href="#_3-1-마우스-및-터치-예제" aria-label="Permalink to &quot;3.1 마우스 및 터치 예제&quot;">​</a></h3><ul><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/mesh/" target="_blank" rel="noreferrer">일반 메시 인터렉션</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/" target="_blank" rel="noreferrer">스프라이트 인터렉션</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/textField3D/" target="_blank" rel="noreferrer">텍스트 필드 인터렉션</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/" target="_blank" rel="noreferrer">고정밀 레이캐스팅 (Raycasting)</a></li></ul><h3 id="_3-2-키보드-인터렉션-예제" tabindex="-1">3.2 키보드 인터렉션 예제 <a class="header-anchor" href="#_3-2-키보드-인터렉션-예제" aria-label="Permalink to &quot;3.2 키보드 인터렉션 예제&quot;">​</a></h3><ul><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/keyboardEvent/" target="_blank" rel="noreferrer">키보드 인터렉션 3D예제</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/2d/interaction/keyboardEvent/" target="_blank" rel="noreferrer">키보드 인터렉션 2D예제</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/controller/characterController/" target="_blank" rel="noreferrer">캐릭터 컨트롤러 (WASD)</a></li></ul><h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><code>addListener</code> 를 통해 객체별로 독립적인 이벤트 처리가 가능합니다.</li><li><code>keyboardKeyBuffer</code> 를 통해 프레임 단위의 정밀한 키보드 상태 제어가 가능합니다.</li><li>웹 표준 DOM API와 함께 사용하여 풍부한 사용자 경험(UX)을 제공할 수 있습니다.</li></ul><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><p>인터렉션까지 더해진 풍성한 장면에 시각적인 완성도를 높여주는 후처리 효과를 적용해 봅니다.</p><ul><li><strong><a href="./../post-effect/">포스트 이펙트</a></strong></li></ul>`,18))])}const m=o(c,[["render",k]]);export{b as __pageData,m as default};
