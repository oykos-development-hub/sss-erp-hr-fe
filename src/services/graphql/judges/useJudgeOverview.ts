import {useEffect, useMemo, useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';
import {JudgesOverviewQueryParams, JudgeOverview} from '../../../types/graphql/judges';

const useJudgeOverview = ({user_profile_id, organization_unit_id, page, size, search}: JudgesOverviewQueryParams) => {
  const [data, setData] = useState<JudgeOverview[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const judgesUnitsList = useMemo(() => {
    return [
      {id: 0, title: 'Sve sudije'},
      ...(data ?? []).map((unit: JudgeOverview) => {
        return {id: unit.id, title: `${unit.first_name} ${unit.last_name}`};
      }),
    ];
  }, [data]);

  const fetchJudgesOverview = async () => {
    const response = await GraphQL.judgeOverview({
      user_profile_id: user_profile_id,
      organization_unit_id: organization_unit_id,
      page: page,
      size: size,
      search: search,
    });

    if (response?.status === REQUEST_STATUSES.success) {
      delete response.message;
      delete response.status;
      setTotal(response?.total || 0);
      setData([
        ...(response?.items || []).map(item => ({
          ...item,
          full_name: `${item.first_name} ${item.last_name}`,
          relocation: item?.norms[0]?.relocation,
        })),
      ] as JudgeOverview[]);
    } else {
      alert(`Login failed due to error - ${response.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJudgesOverview();
  }, [user_profile_id, organization_unit_id, page, size, search]);

  return {data, judgesUnitsList, total, loading, refetch: fetchJudgesOverview};
};

export default useJudgeOverview;
