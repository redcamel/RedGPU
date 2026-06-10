import React, {useState} from 'react';
import TexturePreviewModal from './texture/TexturePreviewModal';
import BufferDetailModal from './buffer/BufferDetailModal';
import {TabBar, TabItem} from '../common/Tabs';
import TextureResourcesView from './texture/TextureResourcesView';
import BufferResourcesView from './buffer/BufferResourcesView';
import GBufferResourcesView from './gbuffer/GBufferResourcesView';

/**
 * [KO] 엔진에서 관리하는 리소스 현황을 표시하는 메인 컴포넌트입니다.
 * [EN] Main component that displays the status of resources managed by the engine.
 */
const ResourcesView = () => {
    const [activeSubTab, setActiveSubTab] = useState('GBUFFER');
    const [previewData, setPreviewData] = useState<{ item: any, type: string } | null>(null);

    const handlePreview = (item: any, type: string) => {
        setPreviewData({item, type});
    };

    const subTabs: TabItem[] = [
        {id: 'GBUFFER', label: 'G-Buffer'},
        {id: 'TEXTURES', label: 'Textures'},
        {id: 'BUFFERS', label: 'Buffers'}
    ];

    const isTextureType = previewData && ['bitmapTexture', 'cubeTexture', 'hdrTexture'].includes(previewData.type);

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={stickyHeaderStyle}>
                <TabBar
                    tabs={subTabs}
                    activeTab={activeSubTab}
                    onTabChange={setActiveSubTab}
                    isSticky={false}
                />
            </div>

            <div style={{padding: '12px 0'}}>
                {activeSubTab === 'GBUFFER' && (
                    <GBufferResourcesView onPreview={handlePreview}/>
                )}

                {activeSubTab === 'TEXTURES' && (
                    <TextureResourcesView onPreview={handlePreview}/>
                )}

                {activeSubTab === 'BUFFERS' && (
                    <BufferResourcesView onPreview={handlePreview}/>
                )}
            </div>

            {previewData && isTextureType && (
                <TexturePreviewModal
                    item={previewData.item}
                    onClose={() => setPreviewData(null)}
                />
            )}

            {previewData && !isTextureType && (
                <BufferDetailModal
                    item={previewData.item}
                    type={previewData.type}
                    onClose={() => setPreviewData(null)}
                />
            )}
        </div>
    );
};

const stickyHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0, // Offset container padding
    zIndex: 10,
    background: '#111',
};

export default ResourcesView;
