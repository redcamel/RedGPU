import{$ as t,Q as s,j as l,m as o,o as n,ax as c}from"./chunks/framework.D5MFXpji.js";const u=JSON.parse('{"title":"Post-Effect Overview","description":"","frontmatter":{"title":"Post-Effect Overview","order":9},"headers":[],"relativePath":"en/post-effect/index.md","filePath":"en/post-effect/index.md","lastUpdated":1781137916000}'),d={name:"en/post-effect/index.md"},h=Object.assign(d,{setup(f){const i=`
    graph TB
        subgraph Control ["Control Interface (API)"]
            direction TB
            TMM["view.toneMappingManager"]:::controlNode
            PEM["view.postEffectManager"]:::controlNode
        end

        subgraph HDR ["1. HDR Phase (Scene Components)"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (Built-in)"]:::pipelineNode
            SSR["SSR (Built-in)"]:::pipelineNode
            SA --> SSAO --> SSR
        end

        subgraph Transition ["2. Transition Phase (Exposure & User Effects)"]
            direction TB
            AE["AutoExposure"]:::pipelineNode
            GE["User General Effects (Loop)"]:::pipelineNode
            TM["Tone Mapping"]:::pipelineNode
            AE --> GE --> TM
        end

        AA["3. LDR Phase (FXAA / TAA)"]:::pipelineNode

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Transition
    Control --> HDR
    HDR --> Transition
    Transition --> AA

    classDef controlNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    
    style Control fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
`;return(p,e)=>{const a=t("MermaidResponsive"),r=t("ClientOnly");return s(),l("div",null,[e[0]||(e[0]=o('<h1 id="post-effect" tabindex="-1">Post-Effect <a class="header-anchor" href="#post-effect" aria-label="Permalink to &quot;Post-Effect&quot;">​</a></h1><p>Post-effect is a technique for adding visual effects to the final 2D image after the 3D scene rendering is complete. RedGPU&#39;s post-processing system provides a dualized interface for <strong>configuration convenience</strong> and <strong>execution efficiency</strong>.</p><h2 id="_1-system-structure-control-and-execution" tabindex="-1">1. System Structure: Control and Execution <a class="header-anchor" href="#_1-system-structure-control-and-execution" aria-label="Permalink to &quot;1. System Structure: Control and Execution&quot;">​</a></h2><p>Users control post-processing through two managers depending on their purpose, but the actual operations are executed sequentially within a single pipeline supervised by the <code>PostEffectManager</code>.</p><ul><li><strong>ToneMappingManager</strong> (<code>view.toneMappingManager</code>): A dedicated window responsible for <strong>color transformation settings</strong> such as the basic hue, exposure, and contrast of the scene.</li><li><strong>PostEffectManager</strong> (<code>view.postEffectManager</code>): Responsible for adding or deleting general effects and the <strong>overall execution</strong> of the pipeline.</li></ul>',5)),n(r,null,{default:c(()=>[n(a,{definition:i})]),_:1}),e[1]||(e[1]=o('<h2 id="_2-rendering-pipeline-flow" tabindex="-1">2. Rendering Pipeline Flow <a class="header-anchor" href="#_2-rendering-pipeline-flow" aria-label="Permalink to &quot;2. Rendering Pipeline Flow&quot;">​</a></h2><p>All effects are processed in the following order. This sequence is fixed for graphics optimization and consistency of visual results.</p><ol><li><strong>HDR Phase (Scene Components)</strong>: The stage for assembling physical scene components, including <code>SkyAtmosphere</code>, <code>SSAO</code> (Screen Space Ambient Occlusion), and <code>SSR</code> (Screen Space Reflections).</li><li><strong>Exposure &amp; Transition (Exposure and Tone Mapping Transition)</strong>: <ul><li><code>AutoExposure</code> calculation is performed.</li><li>The loop for <strong>User General Effects</strong> registered via <code>addEffect()</code> is executed.</li><li>During this loop, <strong>Tone Mapping</strong> is performed immediately when the first LDR (Low Dynamic Range) effect is encountered. If not triggered during the loop, it is executed at the end of the loop.</li></ul></li><li><strong>LDR Phase (Antialiasing)</strong>: The final correction stage for the final image, where <code>FXAA</code> or <code>TAA</code> (along with <code>TAASharpen</code>) is executed based on activation states.</li></ol><div class="tip custom-block"><p class="custom-block-title">[Live Demo]</p><p>Check out all effects in action in real-time on the <a href="https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect" target="_blank" rel="noreferrer">RedGPU Official Examples Page</a>.</p></div><h2 id="_3-learning-guide" tabindex="-1">3. Learning Guide <a class="header-anchor" href="#_3-learning-guide" aria-label="Permalink to &quot;3. Learning Guide&quot;">​</a></h2><ul><li><strong><a href="./general-effects.html">General Effects</a></strong>: Adding various effects such as bloom, blur, and grayscale.</li><li><strong><a href="./tone-mapping.html">Tone Mapping</a></strong>: Configuring basic scene color and exposure.</li><li><strong><a href="./builtin-effects.html">Built-in Effects</a></strong>: Activating high-performance effects like SSAO and SSR.</li><li><strong><a href="./../antialiasing/">Antialiasing</a></strong>: Smoothing jagged edges.</li></ul>',6))])}}});export{u as __pageData,h as default};
