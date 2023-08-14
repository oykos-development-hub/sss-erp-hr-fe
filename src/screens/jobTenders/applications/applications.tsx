import React from 'react';
import {Divider, Pagination, Table, Theme} from 'client-library';
import {useState} from 'react';
import useJobTenderApplications from '../../../services/graphql/jobTenders/useJobTenderApplicationOverview';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {JobTenderApplication} from '../../../types/graphql/jobTenders';
import {ScreenProps} from '../../../types/screen-props';
import {applicationsTableHeads} from '../constants';

const ApplicationsScreen = (props: ScreenProps) => {
  const [page, setPage] = useState(1);
  const {data: applications} = useJobTenderApplications({page, size: 10, job_tender_id: 0});

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const navigateToDetails = (item: JobTenderApplication) => {
    props.context.navigation.navigate(`/hr/job-tenders/job-tender-applications/${item.id}`);
    props.context.breadcrumbs.add({
      name: `${item.id}`,
      to: `/hr/job-tenders/job-tender-applications/${item.id}`,
    });
  };

  return (
    <ScreenWrapper context={props.context}>
      <SectionBox style={{marginTop: 25}}>
        <MainTitle content="PREGLED SVIH KANDIDATA" />
        <Divider color={Theme?.palette?.gray200} height="1px" />

        <Table
          tableHeads={applicationsTableHeads}
          data={applications.items}
          style={{marginBottom: 22}}
          onRowClick={navigateToDetails}
        />
        <Pagination
          pageCount={applications.total / 10}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={2}
          previousLabel="Previous"
          nextLabel="Next"
          pageRangeDisplayed={3}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ApplicationsScreen;
