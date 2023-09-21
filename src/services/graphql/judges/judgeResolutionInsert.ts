import {GraphQL} from '..';

import {JudgeResolutionsInsert, JudgeResolutionsResponse} from '../../../types/graphql/judges';

const judgeResolutionInsert = async (
  data: JudgeResolutionsInsert,
): Promise<JudgeResolutionsResponse['data']['judgeResolutions_Insert']> => {
  const mutation = `mutation($data: JudgeResolutionInsertMutation!) {
      judgeResolutions_Insert(data: $data) {
          message
          status
          item {
              id
              serial_number
              active
              available_slots_judges
              number_of_judges
              items {
                  id
                  organization_unit {
                      title
                      id
                  }
                  available_slots_presidents
                  available_slots_judges
                  number_of_judges
                  number_of_presidents
                  number_of_employees
                  number_of_relocated_judges
                  number_of_suspended_judges
              }
          }
      }
  }`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.judgeResolutions_Insert || {};
};

export default judgeResolutionInsert;
