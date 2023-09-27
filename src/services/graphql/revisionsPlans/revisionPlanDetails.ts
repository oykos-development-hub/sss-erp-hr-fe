import {GraphQL} from '..';
import {RevisionPlanResponse} from '../../../types/graphql/revisionPlansOverview';

const revisionPlanDetails = async (id: number): Promise<RevisionPlanResponse['data']['revision_plans_Details']> => {
  const query = `query RevisionPlansDetails($id: Int!){
    revision_plans_Details(id: $id) {
        message
        status
        item {
            id
            name
            year
            created_at
            updated_at
        }
    }
}`;
  const response = await GraphQL.fetch(query, {id});
  return response?.data?.revision_plans_Details || {};
};

export default revisionPlanDetails;
