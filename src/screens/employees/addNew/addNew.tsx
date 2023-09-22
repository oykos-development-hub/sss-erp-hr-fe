import React from 'react';
import {MainTitle, OverviewBox} from '../../../components/employeesList/styles';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {ScreenProps} from '../../../types/screen-props';
import {BasicInfo} from '../basicInfo/basicInfo';
import {Divider} from 'client-library';

export const AddNewEmployee: React.FC<ScreenProps> = ({context}: {context: any}) => {
  return (
    <ScreenWrapper context={context}>
      <OverviewBox>
        <MainTitle content="DODAVANJE NOVOG ZAPOSLENOG" />
        <Divider />
        <BasicInfo />
      </OverviewBox>
    </ScreenWrapper>
  );
};
