import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Divider, Theme, Typography} from 'client-library';
import {useState} from 'react';
import {StyledTabs} from '../../components/employeeDetails/styles';
import {OverviewBox} from '../../components/employeesList/styles';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {TitleWrapper} from './styles';
import {reportsTabs} from './types';
import Templates from './templates/templates.tsx';
import Reports from './reports.tsx';

export const ReportsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const getTitle = reportsTabs.find(tab => tab.id === activeTab)?.title ?? '';

  return (
    <ScreenWrapper>
      <OverviewBox>
        <TitleWrapper>
          <Typography style={{fontWeight: 600}} variant="bodyMedium" content={getTitle} />
          <StyledTabs
            tabs={reportsTabs}
            activeTab={activeTab}
            onChange={onTabChange}
            //TODO: change in devkit/library
            style={{borderWidth: '1px', borderRadius: '0.5em 0.5em 0 0', whiteSpace: 'nowrap'}}
          />
        </TitleWrapper>
        <Divider color={Theme?.palette?.gray200} height="1px" style={{margin: 0}} />
        {activeTab === 1 ? <Reports /> : <Templates />}
      </OverviewBox>
    </ScreenWrapper>
  );
};
