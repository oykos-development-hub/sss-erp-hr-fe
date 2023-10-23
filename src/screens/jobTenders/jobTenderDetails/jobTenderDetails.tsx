import React, {useEffect, useState} from 'react';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {ScreenProps} from '../../../types/screen-props';
import JobTenderInfo from '../../../components/jobTenderInfo/jobTenderInfo';
import SectionBox from '../../../shared/sectionBox';
import useJobTendersOverview from '../../../services/graphql/jobTenders/useGetJobTenders';
import JobTenderApplicationsList from '../../../components/jobTenderApplicationsList/jobTenderApplicationsList';
import {JobTender} from '../../../types/graphql/jobTenders';

export const JobTenderDetailsScreen: React.FC<ScreenProps> = ({context}) => {
  const jobTenderId = Number(context?.navigation?.location?.pathname.split('/')[4]) || 0;
  const [jobTender, setJobTender] = useState<JobTender>();

  const {alert} = context.alert;

  const {jobTenders} = useJobTendersOverview({page: 1, size: 10, id: jobTenderId});

  useEffect(() => {
    if (jobTenders.length > 0) setJobTender(jobTenders[0]);
  }, [jobTenders]);

  return (
    <ScreenWrapper>
      <SectionBox style={{marginTop: 25}}>
        <JobTenderInfo data={jobTender} {...context} />
        <JobTenderApplicationsList jobTender={jobTender} alert={alert} context={context} />
      </SectionBox>
    </ScreenWrapper>
  );
};
