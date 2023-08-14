import React, {useMemo, useState} from 'react';
import JudgesNumbersList from '../../../components/judgesNumbersList/judgesNumbersList';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {DropdownDataString} from '../../../types/dropdownData';
import {ScreenProps} from '../../../types/screen-props';
import {yearsForDropdown} from '../../../utils/constants';
import useJudgesResolutionsOverview from '../../../services/graphql/judges/useJudgeResolutionOverview';

export interface JudgesNumberListFilters {
  year: DropdownDataString | null;
}

const initialValues: JudgesNumberListFilters = {
  year: null,
};

const JudgesNumberDecisions: React.FC<ScreenProps> = ({context}) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JudgesNumberListFilters>(initialValues);
  const {
    data: judgesResolutions,
    total,
    refetch,
  } = useJudgesResolutionsOverview({page, size: 10, year: filters?.year?.id || ''});

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const yearOptions = useMemo(
    () => [
      {id: '', title: 'Sve godine'},
      ...yearsForDropdown().map(year => ({id: year.id.toString(), title: year.title.toString()})),
    ],
    [],
  );

  return (
    <ScreenWrapper context={context}>
      <JudgesNumbersList
        years={yearOptions}
        data={judgesResolutions || []}
        total={total}
        filters={filters}
        onFilterChange={onFilterChange}
        onPageChange={onPageChange}
        navigate={context.navigation.navigate}
        alert={context.alert}
        refetch={refetch}
      />
    </ScreenWrapper>
  );
};

export default JudgesNumberDecisions;
