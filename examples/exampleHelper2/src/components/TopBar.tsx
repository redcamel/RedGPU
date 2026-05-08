import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import homeIcon from '../assets/icons/home.svg';

/**
 * [KO] 예제 헬퍼의 상단 네비게이션 바 컴포넌트입니다.
 * [EN] Top navigation bar component of the example helper.
 */
const TopBar = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);

    return (
        <header style={containerStyle}>
            <div style={navBarStyle}>
                <a href="../../index.html" style={homeButtonStyle}>
                    <img
                        src={homeIcon}
                        style={homeIconStyle}
                        alt="HOME"
                    />
                </a>
                <div style={titleBoxStyle}>
                    <span style={titleLabelStyle}>TITLE</span>
                    <span style={titleValueStyle}>
                      {currentExample ? currentExample.name : 'empty example name'}
                    </span>
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
    backgroundColor: '#202020',
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
    gap: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)' // For the 1px gap line effect
};

const homeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '100%',
    backgroundColor: '#111112',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    flexShrink: 0
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

export default TopBar;
