import React, {useEffect, useRef} from 'react';
import ExampleSection from './ExampleSection';
import {useFilteredExamples} from '../hooks/useFilteredExamples';
import {ExampleItem} from '../../types/example';

const ExampleGrid: React.FC = () => {
    const {filteredItems, resultCount, searchQuery} = useFilteredExamples();
    const lcpCounter = useRef<number>(0);
    lcpCounter.current = 0; // [KO] 렌더링마다 초기화하여 상위 아이템들만 LCP 최적화 [EN] Reset on every render to optimize LCP for top items

    // [KO] SEO: 검색 결과가 없을 때 noindex 메타 태그 추가
    // [EN] SEO: Add noindex meta tag when search results are empty
    useEffect(() => {
        const head = document.head;
        const existingTag = document.querySelector('meta[name="robots"]');
        
        if (searchQuery && filteredItems.length === 0) {
            if (!existingTag) {
                const meta = document.createElement('meta');
                meta.name = 'robots';
                meta.content = 'noindex, nofollow';
                head.appendChild(meta);
            }
        } else {
            if (existingTag) {
                head.removeChild(existingTag);
            }
        }

        // Cleanup on unmount
        return () => {
            const tagToRemove = document.querySelector('meta[name="robots"]');
            if (tagToRemove) {
                head.removeChild(tagToRemove);
            }
        };
    }, [searchQuery, filteredItems.length]);

    // [KO] SEO: 구조화 데이터(JSON-LD) 생성 및 주입
    // [EN] SEO: Generate and inject Structured Data (JSON-LD)
    useEffect(() => {
        const head = document.head;
        let jsonLdScript = document.querySelector('script[id="redgpu-json-ld"]');
        
        if (!jsonLdScript) {
            jsonLdScript = document.createElement('script');
            jsonLdScript.setAttribute('type', 'application/ld+json');
            jsonLdScript.setAttribute('id', 'redgpu-json-ld');
            head.appendChild(jsonLdScript);
        }

        const buildItemList = (items: ExampleItem[]) => {
            let position = 1;
            const elements: any[] = [];
            
            const traverse = (list: ExampleItem[]) => {
                list.forEach(item => {
                    if (item.path) {
                        elements.push({
                            "@type": "ListItem",
                            "position": position++,
                            "name": item.name,
                            "url": `${window.location.origin}/RedGPU/examples/${item.path}/index.html`
                        });
                    }
                    if (item.list) {
                        traverse(item.list);
                    }
                });
            };
            
            traverse(items);
            return elements;
        };

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": buildItemList(filteredItems)
        };

        jsonLdScript.textContent = JSON.stringify(schemaData);

        return () => {
            // [KO] 컴포넌트 언마운트 시 스크립트 태그 삭제
            // [EN] Clean up JSON-LD script on component unmount
            const scriptToRemove = document.querySelector('script[id="redgpu-json-ld"]');
            if (scriptToRemove) {
                head.removeChild(scriptToRemove);
            }
        };
    }, [filteredItems]);

    if (filteredItems.length === 0) {
        return (
            <div style={emptyStateStyle}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🔍</div>
                <h3>{searchQuery ? `No results for "${searchQuery}"` : 'No examples found'}</h3>
                <p style={{color: '#666'}}>Try searching for something else or check other categories.</p>
            </div>
        );
    }

    return (
        <div className="example-grid-container">
            {searchQuery && (
                <div style={searchHeaderStyle}>
                    <div style={{marginBottom: '4px'}}>
                        SEARCH RESULTS FOR <span style={{color: '#fdb48d'}}>"{searchQuery.toUpperCase()}"</span>
                    </div>
                    <div style={{fontSize: '14px', color: '#888', fontWeight: 'normal', textTransform: 'none'}}>
                        Found {resultCount} {resultCount === 1 ? 'example' : 'examples'}
                    </div>
                </div>
            )}
            {filteredItems.map((item, idx) => (
                <ExampleSection key={item.name + idx} item={item} lcpCounter={lcpCounter} />
            ))}
        </div>
    );
};

const searchHeaderStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: '0.15em',
    marginBottom: '40px',
    paddingBottom: '16px',
    borderBottom: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
};

const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
    textAlign: 'center',
};

export default ExampleGrid;
