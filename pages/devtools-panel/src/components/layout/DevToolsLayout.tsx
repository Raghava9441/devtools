import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TabNavigation from './TabNavigation';

type Props = {
    children?: React.ReactNode;
    selectedTab?: string;
    onTabSelect?: (tab: string) => void;
};

function DevToolsLayout({ children, selectedTab: externalSelectedTab, onTabSelect: externalOnTabSelect }: Props) {
    const [internalSelectedTab, setInternalSelectedTab] = useState('local-storage');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Use external state if provided, otherwise use internal state
    const selectedTab = externalSelectedTab || internalSelectedTab;
    const onTabSelect = externalOnTabSelect || setInternalSelectedTab;

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <Header />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    selectedTab={selectedTab}
                    onTabSelect={onTabSelect}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab Navigation */}
                    <TabNavigation
                        selectedTab={selectedTab}
                        onTabSelect={onTabSelect}
                    />

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DevToolsLayout;