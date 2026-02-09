import{D as p,o,c as g,a2 as l,G as n,w as e,k as s,a}from"./chunks/framework.DpNgdNqH.js";const m=JSON.parse('{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","frontmatter":{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","order":2},"headers":[],"relativePath":"ko/view-system/view3d.md","filePath":"ko/view-system/view3d.md","lastUpdated":1770635218000}'),c={name:"ko/view-system/view3d.md"},w=Object.assign(c,{setup(y){const r=`
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Pass)"]
        Scene["Scene (Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input)"]

        Context -->|Manages| View
        View -->|References| Scene
        View -->|References| Camera
        Controller -->|Updates| Camera
        View -.->|Holds| Controller
        
        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View mermaid-main;
`,d=`
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
    
    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
`,E=`
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared Reference| SceneA
        View2 --> CameraY

        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View1,View2 mermaid-main;
`;return(C,i)=>{const h=p("MermaidResponsive"),t=p("ClientOnly"),k=p("CodePen");return o(),g("div",null,[i[2]||(i[2]=l('<h1 id="view3d" tabindex="-1">View3D <a class="header-anchor" href="#view3d" aria-label="Permalink to &quot;View3D&quot;">​</a></h1><p><strong>View System</strong> 의 가장 핵심적인 &#39;틀&#39; 역할을 하는 <strong>View3D</strong> 는, <strong>RedGPUContext</strong> 내에서 실제로 렌더링이 수행되는 <strong>화면 영역</strong>(Viewport) 을 정의하는 객체입니다. 장면 데이터(<strong>Scene</strong>) 와 시점 정보(<strong>Camera</strong>) 를 하나로 묶어 최종 프레임을 생성하는 <strong>렌더링 패스</strong>(Render Pass) 역할을 수행합니다.</p><h2 id="_1-기술적-개요" tabindex="-1">1. 기술적 개요 <a class="header-anchor" href="#_1-기술적-개요" aria-label="Permalink to &quot;1. 기술적 개요&quot;">​</a></h2><p><strong>View3D</strong> 는 <strong>RedGPUContext</strong> 로부터 생성된 GPU 환경 위에서 동작하며, 다른 구성 요소들과 다음과 같은 관계를 맺습니다.</p>',4)),n(t,null,{default:e(()=>[n(h,{definition:r})]),_:1}),i[3]||(i[3]=l(`<p><strong>View3D</strong> 인스턴스는 다음과 같은 독립적인 설정과 기능을 가집니다.</p><ul><li><strong>독립적 환경 설정</strong>: 스카이박스, 포스트 이펙트 등을 뷰별로 다르게 적용 가능</li><li><strong>디버깅 도구 지원</strong>: 그리드(<strong>Grid</strong>) 및 축(<strong>Axis</strong>) 표시 여부 개별 제어</li><li><strong>멀티 뷰 운용</strong>: 하나의 컨텍스트 내에서 여러 개의 독립적인 뷰를 동시에 렌더링 가능</li></ul><h2 id="_2-초기화-및-등록" tabindex="-1">2. 초기화 및 등록 <a class="header-anchor" href="#_2-초기화-및-등록" aria-label="Permalink to &quot;2. 초기화 및 등록&quot;">​</a></h2><p><strong>View3D</strong> 를 생성하고 화면에 표시하기 위해서는 다음과 같은 단계를 거칩니다.</p><ol><li><strong>인스턴스 생성</strong>: <strong>RedGPUContext</strong> 가 준비된 후, <strong>Scene</strong> 과 <strong>Camera</strong> 를 연결하여 생성합니다.</li><li><strong>컨텍스트 등록</strong>: <code>addView()</code> 메서드를 호출하여 렌더링 루프에 포함시킵니다. 등록되지 않은 뷰는 화면에 출력되지 않습니다.</li></ol><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    canvas,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 1. 구성 요소 준비 (Scene 및 Camera)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> camera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 2. View3D 생성 및 설정</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, scene, camera);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        view.grid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        view.axis </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 3. 컨텍스트에 뷰 등록 (필수)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(view);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 4. 렌더러 시작</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> renderer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Renderer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        renderer.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><h3 id="라이브-데모" tabindex="-1">라이브 데모 <a class="header-anchor" href="#라이브-데모" aria-label="Permalink to &quot;라이브 데모&quot;">​</a></h3>`,7)),n(t,null,{default:e(()=>[n(k,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.OrbitController(redGPUContext);`),a(`
`),s("pre",null,[s("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=l(`<h2 id="_3-크기와-해상도-관리" tabindex="-1">3. 크기와 해상도 관리 <a class="header-anchor" href="#_3-크기와-해상도-관리" aria-label="Permalink to &quot;3. 크기와 해상도 관리&quot;">​</a></h2><p><strong>View3D</strong> 는 캔버스 내에서 자신이 차지할 영역과 렌더링 해상도를 결정합니다. 반응형 레이아웃 대응을 위해 CSS 픽셀 단위의 크기와 실제 GPU 렌더링 해상도를 분리하여 관리합니다.</p><h3 id="영역-설정-size-position" tabindex="-1">영역 설정 (Size &amp; Position) <a class="header-anchor" href="#영역-설정-size-position" aria-label="Permalink to &quot;영역 설정 (Size &amp; Position)&quot;">​</a></h3><p><code>setSize()</code> 와 <code>setPosition()</code> 메서드를 통해 뷰의 크기와 위치를 지정할 수 있습니다. 수치(Number), 퍼센트(<code>%</code>), 그리고 픽셀(<code>px</code>) 단위를 모두 지원합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 수치(Number) 또는 픽셀(px) 문자열 사용 가능</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">300</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;500px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;300px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 퍼센트(%) 단위 사용 가능</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 위치 설정</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;10px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;10%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">[픽셀 단위 가이드]</p><p>고해상도 디스플레이(HiDPI/Retina) 대응을 위해 두 가지 좌표 객체를 제공합니다.</p><ul><li><strong><code>view.screenRectObject</code></strong>: CSS 픽셀 단위의 <strong>표시 크기</strong>(Layout Size) 입니다. <strong>UI 배치</strong>나 <strong>마우스 이벤트 좌표 계산</strong> 시에 사용합니다.</li><li><strong><code>view.pixelRectObject</code></strong>: <code>devicePixelRatio</code> 가 적용된 실제 <strong>물리 해상도</strong>(Physical Resolution) 입니다. 내부적인 렌더링 계산에 사용됩니다.</li></ul></div><h3 id="_3-3-뷰별-크기-변경-감지-onresize" tabindex="-1">3.3 뷰별 크기 변경 감지 (onResize) <a class="header-anchor" href="#_3-3-뷰별-크기-변경-감지-onresize" aria-label="Permalink to &quot;3.3 뷰별 크기 변경 감지 (onResize)&quot;">​</a></h3><p><code>redGPUContext.onResize</code>가 전체 캔버스의 크기 변화를 감지한다면, 개별 <strong>View3D</strong> 객체의 <code>onResize</code> 콜백은 해당 뷰의 크기가 변경될 때마다 호출됩니다.</p><p>뷰의 크기를 퍼센트(<code>%</code>) 단위로 설정했을 때 부모인 캔버스 크기가 변하거나, <code>setSize()</code>를 통해 직접 크기를 변경할 때 유용하게 사용할 수 있습니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 개별 뷰의 크기 변경 시 호출될 콜백 정의</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onResize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">event</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> event.screenRectObject;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`뷰 영역 변경: \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">width</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}x\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">height</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 해당 뷰 내의 특정 UI 요소를 재배치하거나 카메라 설정을 조정합니다.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="_4-디버깅-도구" tabindex="-1">4. 디버깅 도구 <a class="header-anchor" href="#_4-디버깅-도구" aria-label="Permalink to &quot;4. 디버깅 도구&quot;">​</a></h2><p>개발 중 객체의 상대적인 위치와 방향을 직관적으로 파악할 수 있도록 시각화 도구를 제공합니다.</p><ul><li><strong>grid</strong>: 3D 월드의 기본 평면(<strong>XZ</strong> 축) 에 격자를 렌더링합니다. 물체가 지면에 닿아 있는지 가늠하는 기준이 됩니다.</li><li><strong>axis</strong>: 월드의 원점(<strong>0, 0, 0</strong>) 을 기준으로 <strong>XYZ</strong> 축을 색상별로 표시합니다. <ul><li><span style="color:#ff3e3e;font-weight:bold;">Red</span>: <strong>X</strong> 축 (Right)</li><li><span style="color:#3eff3e;font-weight:bold;">Green</span>: <strong>Y</strong> 축 (Up)</li><li><span style="color:#3e3eff;font-weight:bold;">Blue</span>: <strong>Z</strong> 축 (Depth)</li></ul></li></ul><h2 id="_5-멀티-뷰-시스템" tabindex="-1">5. 멀티 뷰 시스템 <a class="header-anchor" href="#_5-멀티-뷰-시스템" aria-label="Permalink to &quot;5. 멀티 뷰 시스템&quot;">​</a></h2><p>RedGPU는 단일 컨텍스트 내에서 다수의 <strong>뷰포트</strong>(Viewport) 를 운용하는 멀티 뷰 렌더링을 지원합니다. 각 뷰는 화면의 특정 영역을 점유하며 독립적인 장면과 카메라를 렌더링합니다.</p>`,15)),n(t,null,{default:e(()=>[n(h,{definition:E})]),_:1}),i[5]||(i[5]=l(`<h3 id="멀티-뷰-구성-예제" tabindex="-1">멀티 뷰 구성 예제 <a class="header-anchor" href="#멀티-뷰-구성-예제" aria-label="Permalink to &quot;멀티 뷰 구성 예제&quot;">​</a></h3><p>앞서 배운 <strong>표시 크기</strong>(screenRectObject) 를 활용하여 메인 화면과 미니맵을 배치하는 방법입니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// [전제 조건] RedGPU.init 콜백 내부라고 가정합니다.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sharedScene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. 메인 뷰 설정</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mainCamera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mainView</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sharedScene, mainCamera);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mainView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(mainView);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. 미니맵 뷰 설정 (우측 상단 고정)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapCamera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PerspectiveCamera</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapCamera.y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapCamera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lookAt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapView</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sharedScene, miniMapCamera);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapSize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(miniMapSize, miniMapSize);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(miniMapView);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 3. 리사이즈 시 메인 뷰의 표시 크기를 기준으로 미니맵 위치 갱신</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onResize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">event</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mainView.screenRectObject;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    miniMapView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(width </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> miniMapSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div>`,3)),n(t,null,{default:e(()=>[n(k,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:e(()=>[...i[1]||(i[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`    // 메인 뷰 설정
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // 미니맵 뷰 설정
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0.1);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    const updateLayout = (event) => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // 씬 오브젝트 배치
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    for (let i = 0; i < 30; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.x = Math.random() * 40 - 20;
        mesh.z = Math.random() * 40 - 20;
        sharedScene.addChild(mesh);
    }

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
},
(error) => console.error(error)
`)]),a(`
`),s("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),i[6]||(i[6]=s("h2",{id:"_6-렌더링-흐름",tabindex:"-1"},[a("6. 렌더링 흐름 "),s("a",{class:"header-anchor",href:"#_6-렌더링-흐름","aria-label":'Permalink to "6. 렌더링 흐름"'},"​")],-1)),i[7]||(i[7]=s("p",null,[s("strong",null,"Renderer"),a(" 가 매 프레임 컨텍스트에 등록된 뷰 목록을 순회하며 수행하는 작업 흐름입니다.")],-1)),n(t,null,{default:e(()=>[n(h,{definition:d})]),_:1}),i[8]||(i[8]=l('<h2 id="다음-단계" tabindex="-1">다음 단계 <a class="header-anchor" href="#다음-단계" aria-label="Permalink to &quot;다음 단계&quot;">​</a></h2><p><strong>View3D</strong> 를 통해 장면을 그려낼 &#39;틀&#39; 을 준비했습니다. 이제 그 틀 안에 채워넣을 실제 <strong>장면</strong>(Scene) 을 구성할 차례입니다.</p><p>메시와 조명이 배치되는 공간인 <strong>Scene</strong> 의 역할과 구성 방법을 알아봅니다.</p><ul><li><strong><a href="./scene.html">Scene</a></strong></li></ul>',4))])}}});export{m as __pageData,w as default};
