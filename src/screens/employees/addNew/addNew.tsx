import {MainTitle, OverviewBox} from '../../../components/employeesList/styles';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {ScreenProps} from '../../../types/screen-props';
import {BasicInfo} from '../basicInfo/basicInfo';

export const AddNewEmployee: React.FC<ScreenProps> = ({context}) => {
  return (
    <ScreenWrapper context={context}>
      <OverviewBox>
        <MainTitle content="DODAVANJE NOVOG ZAPOSLENOG" />
        <BasicInfo context={context} />
      </OverviewBox>
    </ScreenWrapper>
  );
};
