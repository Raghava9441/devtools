import '@src/Panel.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import { ComponentPropsWithoutRef, useState } from 'react';
import Button from './components/common/UI/Button';
import DevToolsLayout from './components/layout/DevToolsLayout';
import ContentRouter from './components/ContentRouter';

const Panel = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const [selectedTab, setSelectedTab] = useState('local-storage');

  return (
    <div
      className="h-screen"
      style={{
        backgroundColor: theme === 'light' ? '#f9fafb' : '#111827',
      }}>
      <DevToolsLayout selectedTab={selectedTab} onTabSelect={setSelectedTab}>
        <ContentRouter selectedTab={selectedTab} />
      </DevToolsLayout>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <Button
      variant="primary" size="large" icon={<span>hey</span>}
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </Button>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
