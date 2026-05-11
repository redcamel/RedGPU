import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import homeIcon from '../assets/icons/home.svg';
import IconButton from './basic/IconButton';
import IconToggleButton from './basic/IconToggleButton';
import RenderingSettingsGroup from './RenderingSettingsGroup';
import {useMediaQuery} from '../utils/useMediaQuery';

/**
 * [KO] 예제 헬퍼의 상단 네비게이션 바 컴포넌트입니다.
 * [EN] Top navigation bar component of the example helper.
 */
const ExampleHeader = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const topBarRightActions = useExampleHelperStore((state: ExampleHelperState) => state.topBarRightActions);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);

    const [ssao, setSSAO] = useState<boolean>(false);

    const isNarrow = useMediaQuery(768);

    useEffect(() => {
        if (redGPUContext) {
            if (redGPUContext.viewList.length > 0) {
                const firstView = redGPUContext.viewList[0];
                if (firstView.postEffectManager) {
                    setSSAO(firstView.postEffectManager.useSSAO);
                }
            }
        }
    }, [redGPUContext]);

    const handleSSAOChange = () => {
        const nextValue = !ssao;
        setSSAO(nextValue);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.postEffectManager) {
                    view.postEffectManager.useSSAO = nextValue;
                }
            });
        }
    };

    return (
        <header style={containerStyle}>
            <div style={navBarStyle}>
                <div style={leftSectionStyle}>
                    <IconButton
                        icon={homeIcon}
                        label="HOME"
                        onClick={() => { window.location.href = '../../index.html' }}
                        title="HOME"
                    />
                    <div style={titleBoxStyle}>
                        <span style={titleLabelStyle}>TITLE</span>
                        <span style={titleValueStyle}>
                          {currentExample ? currentExample.name : 'empty example name'}
                        </span>
                    </div>
                </div>

                <div style={rightSectionStyle}>
                    {!isNarrow && (
                        <>


                            <RenderingSettingsGroup />
                        </>
                    )}
                    <IconToggleButton
                        label="SSAO"
                        onClick={handleSSAOChange}
                        isActive={ssao}
                    />
                    {topBarRightActions.map((action) => (
                        <IconToggleButton
                            key={action.id}
                            icon={action.icon}
                            label={action.label}
                            onClick={action.onClick}
                            isActive={!!action.isActive}
                        />
                    ))}
                </div>
            </div>
        </header>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '52px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 10003,
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'keep-all'
};

const navBarStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)' // For the 1px gap line effect
};

const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px'
};

const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px'
};

const homeIconStyle: React.CSSProperties = {
    width: '18px',
    height: '18px'
};

const titleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
    backgroundColor: '#111112',
    minWidth: '120px',
    flexShrink: 0
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '2px'
};

const titleValueStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#ccc',
    fontWeight: 'bold'
};

export default ExampleHeader;
