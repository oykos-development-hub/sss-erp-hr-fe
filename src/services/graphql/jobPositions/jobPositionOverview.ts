import {GraphQL} from '..';
import {JobPositionsResponse} from '../../../types/graphql/jobPositions';

const jobPositionOverview = async (search?: string): Promise<JobPositionsResponse['data']['jobPositions']> => {
  const queryIdentifier = 'jobPositions';
  const response = await GraphQL.fetch(`   
      query {
        jobPositions(search: "${search}") {
            message
            status
            items {
                id
                title
                abbreviation
                serial_number
                description
                requirements
                is_judge
                is_judge_president
                color
                icon
            }
        }
      }
    `);

  return response?.data[queryIdentifier] || {};
};

export default jobPositionOverview;
