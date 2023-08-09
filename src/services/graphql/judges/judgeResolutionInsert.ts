import {GraphQL} from '..';

import {JudgeResolutionsInsert, JudgeResolutionsResponse} from '../../../types/graphql/judges';

const judgeResolutionInsert = async (
  data: JudgeResolutionsInsert,
): Promise<JudgeResolutionsResponse['data']['judgeResolutions_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    judgeResolutions_Insert(data: {
            id: ${data.id},
            user_profile_id: ${data.user_profile_id},
            serial_number: "${data.serial_number}",
            year: "${data.year}",
            items: ${JSON.stringify(data.items).replace(/"([^"]+)":/g, '$1:')},
          }) { 
            message
            status
            items {
              id
              serial_number
              year
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
    }}
    `);

  return response?.data?.judgeResolutions_Insert || {};
};

export default judgeResolutionInsert;
