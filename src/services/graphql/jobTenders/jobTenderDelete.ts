import {GraphQL} from '..';
import {JobTendersResponse} from '../../../types/graphql/jobTenders';

const jobTenderDelete = async (id: number): Promise<JobTendersResponse['data']['jobTenders_Delete']> => {
  const response = await GraphQL.fetch(`
        mutation {
            jobTenders_Delete(id: ${id}){
                message
                status
            }
        }
    `);

  return response?.data?.jobTenders_Delete || {};
};

export default jobTenderDelete;
