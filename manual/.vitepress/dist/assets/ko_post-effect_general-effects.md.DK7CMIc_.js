import{f as o,D as r,o as c,c as f,a2 as i,G as a,w as d,k as t,a as e}from"./chunks/framework.Dn9yU8Jh.js";const k=JSON.parse('{"title":"General Effects","description":"","frontmatter":{"title":"General Effects","order":2},"headers":[],"relativePath":"ko/post-effect/general-effects.md","filePath":"ko/post-effect/general-effects.md","lastUpdated":1769512249000}'),g={name:"ko/post-effect/general-effects.md"};function h(p,l,x,y,u,m){const n=r("CodePen"),s=r("ClientOnly");return c(),f("div",null,[l[2]||(l[2]=i(`<h1 id="일반-이펙트" tabindex="-1">일반 이펙트 <a class="header-anchor" href="#일반-이펙트" aria-label="Permalink to &quot;일반 이펙트&quot;">​</a></h1><p>방사형 블러, 그레이스케일 등 RedGPU가 제공하는 다양한 표준 효과들을 관리합니다.</p><div class="tip custom-block"><p class="custom-block-title">[학습 가이드]</p><p>기술적으로 톤 매핑은 전체 후처리 과정의 가장 첫 번째 단계에서 실행되지만, 이 장에서는 시각적인 변화를 가장 직관적으로 체감할 수 있는 <strong>일반 이펙트</strong> 를 먼저 다룹니다.</p></div><h2 id="_1-사용-방법" tabindex="-1">1. 사용 방법 <a class="header-anchor" href="#_1-사용-방법" aria-label="Permalink to &quot;1. 사용 방법&quot;">​</a></h2><p>이펙트 객체를 생성한 후 <code>view.postEffectManager.addEffect()</code> 를 통해 등록합니다. 등록된 순서대로 파이프라인 체인이 형성됩니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> radialBlur</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.PostEffect.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RadialBlur</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.postEffectManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(radialBlur);</span></span></code></pre></div><h2 id="_2-주요-이펙트-예시" tabindex="-1">2. 주요 이펙트 예시 <a class="header-anchor" href="#_2-주요-이펙트-예시" aria-label="Permalink to &quot;2. 주요 이펙트 예시&quot;">​</a></h2><h3 id="_2-1-방사형-블러-radial-blur" tabindex="-1">2.1 방사형 블러 (Radial Blur) <a class="header-anchor" href="#_2-1-방사형-블러-radial-blur" aria-label="Permalink to &quot;2.1 방사형 블러 (Radial Blur)&quot;">​</a></h3><p>중심점에서 바깥쪽으로 퍼져나가는 속도감이나 집중 효과를 연출합니다.</p>`,9)),a(s,null,{default:d(()=>[a(n,{title:"RedGPU PostEffect - RadialBlur",slugHash:"posteffect-radialblur"},{default:d(()=>[...l[0]||(l[0]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),t("p",null,[e(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),t("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),e(`'
);`)]),e(`
`),t("pre",null,[t("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
radialBlur.blur = 0.1;
view.postEffectManager.addEffect(radialBlur);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),t("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),l[3]||(l[3]=t("h3",{id:"_2-2-그레이스케일-grayscale",tabindex:"-1"},[e("2.2 그레이스케일 (Grayscale) "),t("a",{class:"header-anchor",href:"#_2-2-그레이스케일-grayscale","aria-label":'Permalink to "2.2 그레이스케일 (Grayscale)"'},"​")],-1)),l[4]||(l[4]=t("p",null,"이미지를 흑백으로 변환하여 고전적인 분위기를 연출합니다.",-1)),a(s,null,{default:d(()=>[a(n,{title:"RedGPU PostEffect - Grayscale",slugHash:"posteffect-grayscale"},{default:d(()=>[...l[1]||(l[1]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),t("p",null,[e(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),t("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),e(`'
);`)]),e(`
`),t("pre",null,[t("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

redGPUContext.addView(view);

// 흑백 효과 추가
const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(grayscale);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),t("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),l[5]||(l[5]=i('<h2 id="_3-전체-지원-목록" tabindex="-1">3. 전체 지원 목록 <a class="header-anchor" href="#_3-전체-지원-목록" aria-label="Permalink to &quot;3. 전체 지원 목록&quot;">​</a></h2><p>RedGPU가 제공하는 모든 일반 이펙트 목록입니다. 모든 이펙트는 <code>RedGPU.PostEffect</code> 네임스페이스 하위에 위치합니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">카테고리</th><th style="text-align:left;">클래스 명</th><th style="text-align:left;">설명</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Blur</strong></td><td style="text-align:left;"><code>Blur</code>, <code>GaussianBlur</code></td><td style="text-align:left;">가우시안 블러 (가장 일반적인 흐림 효과)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>BlurX</code>, <code>BlurY</code></td><td style="text-align:left;">단방향(가로/세로) 블러</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>DirectionalBlur</code></td><td style="text-align:left;">지정된 각도 방향으로 흐려지는 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>RadialBlur</code></td><td style="text-align:left;">중심에서 바깥쪽으로 원형으로 흐려지는 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ZoomBlur</code></td><td style="text-align:left;">중심에서 바깥쪽으로 확대되며 흐려지는 효과</td></tr><tr><td style="text-align:left;"><strong>Adjustments</strong></td><td style="text-align:left;"><code>BrightnessContrast</code></td><td style="text-align:left;">밝기와 대비 조절</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>HueSaturation</code></td><td style="text-align:left;">색조와 채도 조절</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ColorBalance</code></td><td style="text-align:left;">색상 균형(미드톤, 쉐도우, 하이라이트) 조절</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ColorTemperatureTint</code></td><td style="text-align:left;">색온도와 틴트 조절</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Vibrance</code></td><td style="text-align:left;">활기(채도가 낮은 부분 위주로 보정) 조절</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Grayscale</code></td><td style="text-align:left;">흑백 이미지로 변환</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Invert</code></td><td style="text-align:left;">색상 반전</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Threshold</code></td><td style="text-align:left;">임계값을 기준으로 이진화</td></tr><tr><td style="text-align:left;"><strong>Lens</strong></td><td style="text-align:left;"><code>OldBloom</code></td><td style="text-align:left;">클래식한 빛 번짐 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>DOF</code></td><td style="text-align:left;">피사계 심도 (초점 외 영역 블러)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Vignetting</code></td><td style="text-align:left;">화면 외곽을 어둡게 처리하는 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ChromaticAberration</code></td><td style="text-align:left;">렌즈의 색수차 현상 재현</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>LensDistortion</code></td><td style="text-align:left;">렌즈 왜곡 효과</td></tr><tr><td style="text-align:left;"><strong>Atmospheric</strong></td><td style="text-align:left;"><code>Fog</code></td><td style="text-align:left;">거리 기반 안개 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>HeightFog</code></td><td style="text-align:left;">높이 기반 안개 효과</td></tr><tr><td style="text-align:left;"><strong>Visual / Utility</strong></td><td style="text-align:left;"><code>FilmGrain</code></td><td style="text-align:left;">필름 노이즈(그레인) 효과</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Sharpen</code></td><td style="text-align:left;">선명도 강조</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Convolution</code></td><td style="text-align:left;">커널 기반 필터 (Sharpen, Edge, Emboss 등 지원)</td></tr></tbody></table><div class="info custom-block"><p class="custom-block-title">[라이브 확인]</p><p>위의 모든 이펙트들은 <a href="https://redcamel.github.io/RedGPU/examples/#postEffect" target="_blank" rel="noreferrer">RedGPU 공식 예제 페이지</a>의 <strong>PostEffect</strong> 카테고리에서 실시간 데모로 확인하실 수 있습니다.</p></div><h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><code>addEffect()</code> 를 사용해 원하는 순서대로 효과를 중첩할 수 있습니다.</li><li>모든 이펙트 객체는 생성 시 <code>redGPUContext</code> 가 필요합니다.</li><li>실제 렌더링은 톤 매핑 직후 단계에서 수행됩니다.</li></ul><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><ul><li><strong><a href="./tone-mapping.html">톤 매핑</a></strong></li><li><strong><a href="./builtin-effects.html">빌트인 이펙트</a></strong></li></ul>',8))])}const b=o(g,[["render",h]]);export{k as __pageData,b as default};
