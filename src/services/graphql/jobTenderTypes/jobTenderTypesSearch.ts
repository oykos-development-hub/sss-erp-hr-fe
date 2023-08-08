import {JobTenderTypeResponse} from '../../../types/graphql/useJobTendersTypes';
import {GraphQL} from '../index';

const jobTenderTypesSearch = async (search: string): Promise<{data: JobTenderTypeResponse}> => {
  const query = `query(search: String) {
    jobTenderTypes(search: $search) {
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
  }`;

  const response = await GraphQL.fetch(query, {search});
  return response?.data?.jobTenderTypes || {};
};

export default jobTenderTypesSearch;
