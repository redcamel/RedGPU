import{D as a,o as n,c as d,a2 as t,G as s,w as i}from"./chunks/framework.n5RLHRfo.js";const P=JSON.parse('{"title":"View System","description":"","frontmatter":{"title":"View System","order":3},"headers":[],"relativePath":"ko/view-system/index.md","filePath":"ko/view-system/index.md","lastUpdated":1792993711000}'),c={name:"ko/view-system/index.md"},f=Object.assign(c,{setup(m){const l=`
    graph TD
        Context["RedGPUContext"]
        
        subgraph MainView ["View3D (메인 뷰)"]
            View1["View3D 인스턴스"]
            Camera1["Camera (메인 카메라)"]
            View1 -->|소유| Camera1
        end
        
        subgraph MiniView ["View3D (미니맵 뷰)"]
            View2["View3D 인스턴스"]
            Camera2["Camera (탑다운 카메라)"]
            View2 -->|소유| Camera2
        end
        
        Scene["Scene (3D 무대)"]
        Meshes["Mesh / Light / 환경"]
        Controller1["Controller"]
        Controller2["Controller"]
        
        Context -->|등록 및 렌더링| View1
        Context -->|등록 및 렌더링| View2
        
        View1 -->|참조| Scene
        View2 -->|공유 참조| Scene
        
        Controller1 -->|시점 제어| Camera1
        Controller2 -->|시점 제어| Camera2
        
        Scene -->|포함| Meshes

        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style MainView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style MiniView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style View1 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style View2 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style Camera1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Camera2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Meshes fill:#fafafa,stroke:#e4e4e7,color:#3f3f46,stroke-width:1px
`;return(p,e)=>{const o=a("MermaidResponsive"),r=a("ClientOnly");return n(),d("div",null,[e[0]||(e[0]=t('<h1 id="view-system" tabindex="-1">View System <a class="header-anchor" href="#view-system" aria-label="Permalink to &quot;View System&quot;">​</a></h1><p>앞서 학습한 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Context/classes/RedGPUContext.html"><code>RedGPUContext</code></a> 가 엔진이 실행될 &#39;환경&#39;이라면, <strong>View System</strong> 은 그 환경 위에서 실제 콘텐츠가 어떻게 보여질지를 결정하는 &#39;틀&#39;입니다.</p><h2 id="_1-아키텍처-및-역할" tabindex="-1">1. 아키텍처 및 역할 <a class="header-anchor" href="#_1-아키텍처-및-역할" aria-label="Permalink to &quot;1. 아키텍처 및 역할&quot;">​</a></h2><p>RedGPU의 <strong>View System</strong> 은 3D 공간 데이터와 카메라 시점을 결합하여 화면에 출력하는 핵심 아키텍처로서 다음과 같은 역할을 수행합니다:</p><ul><li><strong>장면 구성</strong>: 3D 공간 내 객체와 조명의 계층적 배치 정의 (<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a>)</li><li><strong>시점 및 입력 제어</strong>: 3D 공간을 2D 화면으로 투영하고 사용자 입력에 따라 시점 갱신 (<code>Camera</code>, <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/namespaces/Core/classes/AController.html"><code>AController</code></a>)</li><li><strong>화면 출력 및 환경 분리</strong>: 뷰포트 영역 지정 및 뷰별 독립 환경·후처리 적용 (<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a>)</li></ul>',5)),s(r,null,{default:i(()=>[s(o,{definition:l})]),_:1}),e[1]||(e[1]=t('<ol><li><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Context/classes/RedGPUContext.html"><code>RedGPUContext</code></a> 는 하나 이상의 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a> 를 가집니다 (예: 메인 게임 화면과 미니맵).</li><li>각 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a> 는 무엇을 보여줄지 (<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a>)와 어디서 볼지 (<code>Camera</code>)를 연결합니다.</li><li>컨트롤러 (<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/classes/OrbitController.html"><code>OrbitController</code></a> 등)는 사용자의 입력을 받아 <code>Camera</code> 를 움직입니다.</li></ol><p>이러한 구조 덕분에 하나의 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a> 을 여러 개의 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a> 를 통해 서로 다른 각도에서 동시에 볼 수 있습니다.</p><hr><h2 id="_2-핵심-구성-요소" tabindex="-1">2. 핵심 구성 요소 <a class="header-anchor" href="#_2-핵심-구성-요소" aria-label="Permalink to &quot;2. 핵심 구성 요소&quot;">​</a></h2><p>RedGPU의 렌더링 파이프라인을 구성하는 4가지 핵심 모듈입니다.</p><table tabindex="0"><thead><tr><th style="text-align:left;">모듈</th><th style="text-align:left;">주요 역할 및 기능</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a></strong></td><td style="text-align:left;">화면 출력 영역(Viewport)을 지정하고, 스카이박스(<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyBox.html"><code>skybox</code></a>), 환경광(<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>ibl</code></a>), 후처리(<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/PostEffect/classes/PostEffectManager.html"><code>postEffectManager</code></a>) 및 디버깅 도구(<code>grid</code>, <code>axis</code>)를 뷰 단위로 관리합니다.</td></tr><tr><td style="text-align:left;"><strong><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a></strong></td><td style="text-align:left;">렌더링될 3D 객체들의 계층 구조(Scene Graph), 조명(<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Light/classes/LightManager.html"><code>lightManager</code></a>), 그림자(<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Shadow/classes/ShadowManager.html"><code>shadowManager</code></a>) 및 지형·수체를 통합 관리합니다.</td></tr><tr><td style="text-align:left;"><strong><code>Camera</code></strong></td><td style="text-align:left;">3D 공간을 2D 화면으로 변환하는 투영(Projection) 및 뷰(View) 행렬을 계산하고 자동 노출(<code>useAutoExposure</code>)을 관리합니다.</td></tr><tr><td style="text-align:left;"><strong><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/namespaces/Core/classes/AController.html"><code>AController</code></a></strong></td><td style="text-align:left;">마우스·터치·키보드 입력을 감지하여 카메라 트랜스폼을 실시간으로 갱신합니다 (<a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/classes/OrbitController.html"><code>OrbitController</code></a>, <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/classes/FreeController.html"><code>FreeController</code></a>, <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Camera/classes/FollowController.html"><code>FollowController</code></a> 등).</td></tr></tbody></table><hr><h2 id="_3-학습-로드맵" tabindex="-1">3. 학습 로드맵 <a class="header-anchor" href="#_3-학습-로드맵" aria-label="Permalink to &quot;3. 학습 로드맵&quot;">​</a></h2><p>각 모듈의 상세한 사용법과 설정 방법은 다음 순서로 학습하는 것을 권장합니다.</p><ol><li><strong><a href="./view3d.html">View3D</a></strong> : 화면 렌더링의 기본 단위와 뷰포트 레이아웃 설정 방법</li><li><strong><a href="./scene.html">Scene</a></strong> : 무대를 구성하고 객체와 조명을 관리하는 루트 컨테이너</li><li><strong><a href="./camera.html">Camera</a></strong> : 3D 좌표를 화면 좌표로 변환하는 시점의 이해</li><li><strong><a href="./controller.html">Camera Controller</a></strong> : 마우스·터치·키보드를 통한 인터랙티브한 카메라 조작</li></ol><hr><h2 id="관련-예제" tabindex="-1">관련 예제 <a class="header-anchor" href="#관련-예제" aria-label="Permalink to &quot;관련 예제&quot;">​</a></h2><ul><li><a href="/RedGPU/examples/3d/view/singleView/" target="_blank" rel="noopener noreferrer">단일 뷰 (Single View)</a></li><li><a href="/RedGPU/examples/3d/view/multiView/" target="_blank" rel="noopener noreferrer">다중 뷰 (Multi View)</a></li><li><a href="/RedGPU/examples/3d/scene/" target="_blank" rel="noopener noreferrer">Scene 구성</a></li><li><a href="/RedGPU/examples/3d/controller/orbitController/" target="_blank" rel="noopener noreferrer">OrbitController</a></li></ul><hr><h2 id="다음-단계" tabindex="-1">다음 단계 <a class="header-anchor" href="#다음-단계" aria-label="Permalink to &quot;다음 단계&quot;">​</a></h2><p>먼저 View System의 가장 핵심적인 렌더링 단위인 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a> 의 생성 방법과 레이아웃 제어부터 살펴봅니다.</p><ul><li><strong><a href="./view3d.html">View3D</a></strong> : 화면 렌더링의 기본 단위와 뷰포트 레이아웃 설정</li></ul>',17))])}}});export{P as __pageData,f as default};
