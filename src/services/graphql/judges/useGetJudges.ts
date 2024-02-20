import {useEffect, useMemo, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {Judge, JudgesOverviewQueryParams, JudgesResponse} from '../../../types/graphql/judges';
import {REQUEST_STATUSES} from '../../constants';
import {QueryOptions} from '../../../types/queryOptions';

const ueGetJudges = (
  {organization_unit, user_profile, page, size, search, norm_year}: JudgesOverviewQueryParams,
  options?: QueryOptions,
) => {
  const [judges, setJudges] = useState<Judge[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const judgeOptions = useMemo(() => {
    const optionList = [
      {id: 0, title: 'Sve sudije'},
      ...(judges ?? []).map((unit: Judge) => {
        return {id: unit.id, title: `${unit.first_name} ${unit.last_name}`};
      }),
    ];

    if (options?.allOption) {
      optionList.unshift({id: 0, title: 'Sve sudije'});
    }

    return optionList;
  }, [judges]);

  const fetchJudges = async (onSuccess?: (items: any) => void) => {
    setLoading(true);

    const response: JudgesResponse = await fetch(GraphQL.getJudges, {
      user_profile_id: user_profile?.id,
      organization_unit_id: organization_unit?.id || null,
      page: page,
      size: size,
      search: search,
      norm_year: Number(norm_year?.id),
    });

    if (response.judges_Overview?.status === REQUEST_STATUSES.success) {
      const updatedList = [
        ...(response.judges_Overview.items || []).map(item => ({
          ...item,
          full_name: `${item.first_name} ${item.last_name}`,
          relocation: item?.norms[0]?.relocation,
        })),
      ];

      setTotal(response.judges_Overview?.total ?? 0);
      setJudges(updatedList as Judge[]);
      onSuccess && onSuccess(updatedList);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJudges();
  }, [user_profile, organization_unit, page, size, search, norm_year]);

  return {judges, judgeOptions, total, loading, refetch: fetchJudges};
};

export default ueGetJudges;
