import React, {useEffect} from 'react';
import {useExamplesStore} from './store/useExamplesStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from '../common/components/Footer';
import './styles/common.css';

const ExamplesApp: React.FC = () => {
    const restoreState = useExamplesStore(state => state.restoreState);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);

    useEffect(() => {
        restoreState();
    }, [restoreState]);

    return (
        <div className="examples-app">
            <Header />
            <div className="layout-wrapper">
                <Sidebar />
                <MainContent />
            </div>
            <Footer useSourceModal={false} />
        </div>
    );
};

export default ExamplesApp;
