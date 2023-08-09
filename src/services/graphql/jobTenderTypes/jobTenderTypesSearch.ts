import {JobTenderTypeResponse} from '../../../types/graphql/useJobTendersTypes';
import {GraphQL} from '../index';

const jobTenderTypesSearch = async (search: string, id?: number): Promise<{data: JobTenderTypeResponse}> => {
  const query = `query JobTendersTypes($search: String, $id: Int){
    jobTenderTypes(search: $search, id: $id) {
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
  const response = await GraphQL.fetch(query, {search, id});

  return response?.data?.jobTenderTypes || {};
};

export default jobTenderTypesSearch;
