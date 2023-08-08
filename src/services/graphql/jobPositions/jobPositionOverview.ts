import {GraphQL} from '..';
import {JobPositionsResponse} from '../../../types/graphql/jobPositions';

const jobPositionOverview = async (id?: number): Promise<JobPositionsResponse['data']['jobPositions']> => {
  const query = `query($id: Int) {
        jobPositions(id: $id) {
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
    `;

  const response = await GraphQL.fetch(query, {id});

  return response?.data?.jobPositions || {};
};

export default jobPositionOverview;
