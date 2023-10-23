import React, {useMemo, useState} from 'react';
import JudgesNumbersList from '../../../components/judgesNumbersList/judgesNumbersList';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {DropdownDataString} from '../../../types/dropdownData';
import {ScreenProps} from '../../../types/screen-props';
import {yearsForDropdownFilter} from '../../../utils/constants';
import useGetJudgeResolutions from '../../../services/graphql/judges/resolutions/useGetJudgeResolutions';

export interface JudgesNumberListFilters {
  year: DropdownDataString | null;
}

const initialValues: JudgesNumberListFilters = {
  year: null,
};

const JudgesNumberDecisions: React.FC<ScreenProps> = ({context}) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JudgesNumberListFilters>(initialValues);
  const {judgeResolutions, total, refetch, loading} = useGetJudgeResolutions({page, size: 10});

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const yearOptions = useMemo(
    () => [...yearsForDropdownFilter(5).map(year => ({id: year.id.toString(), title: year.title.toString()}))],
    [],
  );

  return (
    <ScreenWrapper>
      <JudgesNumbersList
        years={yearOptions}
        data={judgeResolutions || []}
        total={total}
        filters={filters}
        onFilterChange={onFilterChange}
        onPageChange={onPageChange}
        navigate={context.navigation.navigate}
        alert={context.alert}
        refetch={refetch}
        loading={loading}
      />
    </ScreenWrapper>
  );
};

export default JudgesNumberDecisions;
