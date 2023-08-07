import React from 'react';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {ScreenProps} from '../../../types/screen-props';
import JobTenderInfo from '../../../components/jobTenderInfo/jobTenderInfo';
import SectionBox from '../../../shared/sectionBox';
import useJobTender from '../../../services/graphql/jobTenders/useJobTender';
import JobTenderApplicationsList from '../../../components/jobTenderApplicationsList/jobTenderApplicationsList';

export const JobTenderDetailsScreen: React.FC<ScreenProps> = ({context}) => {
  const jobTenderId = Number(context?.navigation?.location?.pathname.split('/')[3]) || 0;

  const {alert} = context.alert;

  const {data: jobTender} = useJobTender(jobTenderId);

  return (
    <ScreenWrapper context={context}>
      <SectionBox style={{marginTop: 25}}>
        <JobTenderInfo data={jobTender} {...context} />
        <JobTenderApplicationsList jobTenderId={jobTenderId} alert={alert} {...context} />
      </SectionBox>
    </ScreenWrapper>
  );
};
