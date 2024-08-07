'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import CreateYourStory from './CreateYourStory';
import YourStoryCollections from './YourStoryCollections';

const tabs = ['Create Your Story', 'Your Story Collections'];

const tabContents = {
  'Create Your Story': <CreateYourStory />,
  'Your Story Collections': <YourStoryCollections />
};

const ButtonShapeTabs = () => {
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="tabs-container mb-4 flex flex-wrap items-center gap-2 justify-center">
        {tabs.map((tab) => (
          <Tabs
            text={tab}
            selected={selected === tab}
            setSelected={setSelected}
            key={tab}
          />
        ))}
      </div>
      <div className="w-full">
        {tabContents[selected]}
      </div>
    </div>
  );
};

export default ButtonShapeTabs;
