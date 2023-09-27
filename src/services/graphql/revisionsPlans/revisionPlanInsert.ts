import {GraphQL} from '..';
import {revisionPlanInsertItem, revisionPlanInsertResponse} from '../../../types/graphql/revisionPlanInsert';

const revisionPlanInsert = async (
  data: revisionPlanInsertItem,
): Promise<revisionPlanInsertResponse['data']['revision_plans_Insert']> => {
  const mutation = `mutation($data: RevisionPlanInsertMutation!) {
        revision_plans_Insert(data: $data) {
            message
            status
            data
            item {
                id
                name
                year
                created_at
                updated_at
            }
        }
    }`;
  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.revision_plans_Insert || {};
};

export default revisionPlanInsert;
