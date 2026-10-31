import React from 'react';
import {useExamplesStore} from './store/useExamplesStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ViewControls from './components/ViewControls';
import Footer from '../common/components/Footer';
import {useAppInitialization} from './hooks/useAppInitialization';
import './styles/common.css';

const ExamplesApp: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    // [KO] 앱 초기화 및 전역 이벤트 관리 훅
    // [EN] Hook for app initialization and global event management
    useAppInitialization();

    return (
        <div className="examples-app">
            <Header />
            <div className="layout-wrapper">
                <Sidebar />
                <MainContent />
            </div>
            <Footer
                useSourceModal={false}
                isNarrow={isNarrow}
                narrowSettings={isNarrow ? <ViewControls/> : undefined}
            />
        </div>
    );
};

export default ExamplesApp;
