import {JobPositionResponse} from '../../../types/graphql/useJobPositions';
import {GraphQL} from '../index';

const jobPositionSearch = async (search: string): Promise<{data: JobPositionResponse}> => {
  const response = await GraphQL.fetch(`query {
    jobPositions(search: "${search}") {
        message
        status
        items {
            id
            title
            abbreviation
            serial_number
            description
            is_judge
            is_judge_president
            color
            icon
        }
    }
  }`);

  return response?.data?.jobPositions || {};
};

export default jobPositionSearch;
