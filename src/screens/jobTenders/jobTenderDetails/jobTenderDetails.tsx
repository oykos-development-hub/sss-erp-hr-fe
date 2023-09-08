import React, {useEffect, useState} from 'react';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {ScreenProps} from '../../../types/screen-props';
import JobTenderInfo from '../../../components/jobTenderInfo/jobTenderInfo';
import SectionBox from '../../../shared/sectionBox';
import useJobTendersOverview from '../../../services/graphql/jobTenders/useJobTenderOverview';
import JobTenderApplicationsList from '../../../components/jobTenderApplicationsList/jobTenderApplicationsList';
import {JobTender} from '../../../types/graphql/jobTenders';

export const JobTenderDetailsScreen: React.FC<ScreenProps> = ({context}) => {
  const jobTenderId = Number(context?.navigation?.location?.pathname.split('/')[4]) || 0;
  const [jobTender, setJobTender] = useState<JobTender>();

  const {alert} = context.alert;

  const {data} = useJobTendersOverview({page: 1, size: 10, id: jobTenderId});
  useEffect(() => {
    if (data.items.length > 0) setJobTender(data.items[0]);
  }, [data]);
  return (
    <ScreenWrapper context={context}>
      <SectionBox style={{marginTop: 25}}>
        <JobTenderInfo data={jobTender} {...context} />
        <JobTenderApplicationsList jobTenderId={jobTenderId} alert={alert} context={context} />
      </SectionBox>
    </ScreenWrapper>
  );
};
