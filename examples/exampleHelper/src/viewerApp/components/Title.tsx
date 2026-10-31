import React, {useEffect, useMemo, useState} from "react";
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {getFlatExampleList} from "../../utils/exampleFinder";
import {ExampleItem} from "../../types/example";
import {ChevronLeft, ChevronRight} from '../../common/components/Icons';
import {expBadgePillStyle} from '../../common/styles/uiStyles';

const Title = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);

    const [flatList, setFlatList] = useState<ExampleItem[]>([]);

    useEffect(() => {
        const loadList = async () => {
            const list = await getFlatExampleList();
            setFlatList(list);
        };
        loadList();
    }, []);

    const currentIndex = useMemo(() => {
        if (!currentExample || flatList.length === 0) return -1;
        return flatList.findIndex(item => item.path === currentExample.path);
    }, [currentExample, flatList]);

    const prevExample = currentIndex > 0 ? flatList[currentIndex - 1] : null;
    const nextExample = (currentIndex >= 0 && currentIndex < flatList.length - 1) ? flatList[currentIndex + 1] : null;

    const [isPrevHovered, setIsPrevHovered] = React.useState(false);
    const [isNextHovered, setIsNextHovered] = React.useState(false);

    const navigate = (path: string) => {
        const pathname = window.location.pathname;
        const examplesIndex = pathname.indexOf('/examples/');
        if (examplesIndex === -1) {
            window.location.href = `${window.location.origin}/examples/${path}/index.html`;
        } else {
            const base = pathname.substring(0, examplesIndex);
            window.location.href = `${window.location.origin}${base}/examples/${path}/index.html`;
        }
    };

    return (
        <div style={isNarrow ? narrowTitleBoxStyle : titleBoxStyle}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                minWidth: 0,
                gap: '2px',
                justifyContent: isNarrow ? 'space-between' : 'flex-start'
            }}>
                {prevExample && (
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: isPrevHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
                        }}
                        onClick={() => navigate(prevExample.path!)}
                        title={`Previous Example : ${prevExample.name}`}
                        onMouseEnter={() => setIsPrevHovered(true)}
                        onMouseLeave={() => setIsPrevHovered(false)}
                    >
                        <ChevronLeft color="#fdb48d"/>
                    </button>
                )}

                <div style={{...contentBoxStyle, textAlign: isNarrow ? 'center' : 'left'}}>
                    <span
                        style={{...titleValueStyle, maxWidth: isNarrow ? '100%' : '180px'}}
                        title={currentExample ? currentExample.name : 'Example'}
                    >
                        {currentExample ? currentExample.name : 'Example'}
                    </span>
                    {isNarrow && currentExample?.experimental && (
                        <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>
                    )}
                </div>

                {nextExample && (
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: isNextHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
                        }}
                        onClick={() => navigate(nextExample.path!)}
                        title={`Next Example : ${nextExample.name}`}
                        onMouseEnter={() => setIsNextHovered(true)}
                        onMouseLeave={() => setIsNextHovered(false)}
                    >
                        <ChevronRight color="#fdb48d"/>
                    </button>
                )}
            </div>
        </div>
    );
};

const narrowTitleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    width: '100%',
    minWidth: 0,
    flexShrink: 0
};

const titleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '36px',
    minWidth: 0,
    flexShrink: 1,
    alignItems: 'stretch'
};

const contentBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0 8px',
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
};

const experimentalBadgeStyle: React.CSSProperties = {
    ...expBadgePillStyle,
    fontSize: '10.5px',
    color: '#ff6b70',
    borderRadius: '5px',
    fontWeight: 600,
    display: 'inline-block',
};

const titleValueStyle: React.CSSProperties = {
    display: 'block',
    minWidth: 0,
    fontSize: '14px',
    lineHeight: '1.2',
    color: '#b19898',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#fdb48d',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s, color 0.15s',
    padding: 0,
    flexShrink: 0
};

export default Title;
