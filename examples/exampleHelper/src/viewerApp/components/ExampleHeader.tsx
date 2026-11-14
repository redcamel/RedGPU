import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {CodeIcon, ExternalLinkIcon, HomeIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';
import IconToggleButton from '../../common/components/basic/IconToggleButton';
import LabelButton from '../../common/components/basic/LabelButton';
import RenderingSettingsGroup from '../../viewerApp/components/RenderingSettingsGroup';
import Title from '../../viewerApp/components/Title';
import {glassCircleIslandStyle, glassPillContainerStyle, verticalDividerStyle} from '../../common/styles/uiStyles';

interface ExampleHeaderProps {
    isIframe?: boolean;
}

/**
 * [KO] 예제 헬퍼의 상단 네비게이션 바 컴포넌트입니다.
 * [EN] Top navigation bar component of the example helper.
 */
const ExampleHeader: React.FC<ExampleHeaderProps> = ({isIframe = false}) => {
    const topBarRightActions = useExampleHelperStore((state: ExampleHelperState) => state.topBarRightActions);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);
    const showSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.showSourceModal);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const guiConfig = useExampleHelperStore((state: ExampleHelperState) => state.guiConfig);
    const showSSAO = guiConfig?.topBar?.ssao !== false;

    const [ssao, setSSAO] = useState<boolean>(false);

    useEffect(() => {
        if (redGPUContext) {
            if (redGPUContext.viewList.length > 0) {
                const lastView = redGPUContext.viewList[redGPUContext.viewList.length - 1];
                if (lastView.builtInEffectManager) {
                    setSSAO(lastView.builtInEffectManager.useSSAO);
                }
            }
        }
    }, [redGPUContext]);

    const handleSSAOChange = () => {
        const nextValue = !ssao;
        setSSAO(nextValue);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.builtInEffectManager) {
                    view.builtInEffectManager.useSSAO = nextValue;
                }
            });
        }
    };

    const viewportActions = topBarRightActions.filter((action) => action.id !== 'setting-toggle');
    const settingAction = topBarRightActions.find((action) => action.id === 'setting-toggle');

    if (isIframe) {
        return (
            <header>
                <div
                    style={{
                        ...headerLeftGroupStyle,
                        top: '16px',
                        left: '16px',
                    }}
                >
                    <div style={rightSectionStyle}>
                        <LabelButton
                            icon={<ExternalLinkIcon color="#fdb48d" size={15}/>}
                            label="NEW TAB"
                            title="Open in new tab"
                            onClick={() => {
                                window.open(window.location.href, '_blank', 'noopener,noreferrer');
                            }}
                        />
                    </div>
                </div>

                {redGPUContext && settingAction && (
                    <div
                        style={{
                            ...headerRightGroupStyle,
                            top: '16px',
                            right: '16px',
                        }}
                    >
                        <div style={circleIslandStyle}>
                            <IconToggleButton
                                key={settingAction.id}
                                icon={settingAction.icon}
                                label={settingAction.label}
                                onClick={settingAction.onClick}
                                isActive={!!settingAction.isActive}
                            />
                        </div>
                    </div>
                )}
            </header>
        );
    }

    return (
        <header>
            <div
                style={{
                    ...headerLeftGroupStyle,
                    top: isNarrow ? '16px' : '20px',
                    left: isNarrow ? '16px' : '20px',
                }}
            >
                <div style={circleIslandStyle}>
                    <IconButton
                        icon={<HomeIcon color="#fff" size={18}/>}
                        label="HOME"
                        onClick={() => {
                            window.location.href = '/RedGPU/examples/'
                        }}
                        title="HOME"
                    />
                </div>
                {!isNarrow && (
                    <>
                        <div style={leftSectionStyle}>
                            <Title/>
                        </div>
                        <div style={rightSectionStyle}>
                            <LabelButton
                                icon={<CodeIcon color="#fdb48d" size={18}/>}
                                label="CODE"
                                onClick={() => setShowSourceModal(!showSourceModal)}
                            />
                        </div>
                    </>
                )}
            </div>

            {redGPUContext && (
                <div
                    style={{
                        ...headerRightGroupStyle,
                        top: isNarrow ? '16px' : '20px',
                        right: isNarrow ? '16px' : '20px',
                    }}
                >
                    <div style={rightSectionStyle}>
                        {!isNarrow && (
                            <>
                                <RenderingSettingsGroup/>
                                <div style={verticalDividerStyle}/>
                            </>
                        )}
                        {showSSAO && (
                            <>
                                <IconToggleButton
                                    label="SSAO"
                                    onClick={handleSSAOChange}
                                    isActive={ssao}
                                />
                                <div style={verticalDividerStyle}/>
                            </>
                        )}
                        {viewportActions.map((action) => (
                            <IconToggleButton
                                key={action.id}
                                icon={action.icon}
                                label={action.label}
                                onClick={action.onClick}
                                isActive={!!action.isActive}
                            />
                        ))}
                        {settingAction && (
                            <>
                                <div style={verticalDividerStyle}/>
                                <IconToggleButton
                                    key={settingAction.id}
                                    icon={settingAction.icon}
                                    label={settingAction.label}
                                    onClick={settingAction.onClick}
                                    isActive={!!settingAction.isActive}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

// Styles
const headerLeftGroupStyle: React.CSSProperties = {
    position: 'fixed',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 10003,
    pointerEvents: 'none',
    wordBreak: 'keep-all'
};

const headerRightGroupStyle: React.CSSProperties = {
    position: 'fixed',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 10003,
    pointerEvents: 'none',
    wordBreak: 'keep-all'
};

const circleIslandStyle: React.CSSProperties = {
    ...glassCircleIslandStyle,
    display: 'flex',
    padding: 0,
    pointerEvents: 'auto'
};

const rightSectionStyle: React.CSSProperties = {
    ...glassPillContainerStyle,
    padding: '4px',
    pointerEvents: 'auto'
};

const leftSectionStyle: React.CSSProperties = {
    ...rightSectionStyle,
    flexShrink: undefined,
    minWidth: 0,
};

export default ExampleHeader;
