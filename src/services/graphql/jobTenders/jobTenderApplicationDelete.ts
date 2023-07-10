import {GraphQL} from '..';
import {JobTenderApplicationResponse} from '../../../types/graphql/jobTenders';

const jobTenderApplicationDelete = async (
  id: number,
): Promise<JobTenderApplicationResponse['data']['jobTender_Applications_Delete']> => {
  const response = await GraphQL.fetch(`
        mutation {
            jobTender_Applications_Delete(id: ${id}){
                message
                status
            }
        }
    `);

  return response?.data?.jobTender_Applications_Delete || {};
};

export default jobTenderApplicationDelete;
