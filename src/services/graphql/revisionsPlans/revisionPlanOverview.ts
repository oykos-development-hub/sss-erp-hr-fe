import {GraphQL} from '..';
import {RevisionPlanResponse} from '../../../types/graphql/revisionPlansOverview';

const revisionPlansOverview = async (): Promise<RevisionPlanResponse['data']['revision_plans_Overview']> => {
  const query = `query RevisionPlansOverview($page: Int, $size: Int, $year: String){
    revision_plans_Overview(page: $page, size: $size, year: $year) {
        message
        status
        items {
            id
            name
            year
            created_at
            updated_at
        }
    }
}`;
  const response = await GraphQL.fetch(query, {});
  return response?.data?.revision_plans_Overview || {};
};

export default revisionPlansOverview;
