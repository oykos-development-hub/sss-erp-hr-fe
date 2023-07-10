import {JobTenderTypeResponse} from '../../../types/graphql/useJobTendersTypes';
import {GraphQL} from '../index';

const jobTenderTypesSearch = async (search: string): Promise<{data: JobTenderTypeResponse}> => {
  const response = await GraphQL.fetch(`query {
    jobTenderTypes(search: "${search}") {
        message
        status
        items {
          id
          title
          abbreviation
          value
          description
          is_judge
          is_judge_president
          color
          icon
        }
    }
  }`);

  return response?.data?.jobTenderTypes || {};
};

export default jobTenderTypesSearch;
