import {GraphQL} from '..';
import {CheckJudgeAndPresidentIsAvailableResponse} from '../../../types/graphql/judges';

const judgeAndPresidentCheckIsAvailable = async (
  organization_unit_id: number,
): Promise<CheckJudgeAndPresidentIsAvailableResponse['data']['checkJudgeAndPresidentIsAvailable']> => {
  const query = `query CheckJudgeAndPresidentIsAvailable($organization_unit_id: Int) {
    checkJudgeAndPresidentIsAvailable(organization_unit_id: $organization_unit_id) {
        status 
        message
        item {
            judge
            president
        }
    }
}`;

  const response = await GraphQL.fetch(query, {organization_unit_id});

  return response?.data?.checkJudgeAndPresidentIsAvailable || {};
};

export default judgeAndPresidentCheckIsAvailable;
