import {GraphQL} from '..';

import {Norms, NormsInsertResponse} from '../../../types/graphql/judges';

const judgeNormInsert = async (data: Norms): Promise<NormsInsertResponse['data']['judgeNorms_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
        judgeNorms_Insert(data: {
            id: ${data.id},
            user_profile_id: ${data.user_profile_id},
            area: "${data.area}",
            norm: ${data.norm},
            percentage_of_norm_decrease: "${data.percentage_of_norm_decrease}",
            number_of_items: ${data.number_of_items},
            number_of_solved_items: ${data.number_of_solved_items},
            start_date: "${data.start_date}",
            end_date: "${data.end_date}",
            evaluation_valid_to: "",
            evaluation: "",
            relocation: "",
          }) {
            status 
            message
            item {
                id
                user_profile_id
                area
                norm
                percentage_of_norm_decrease
                number_of_items
                number_of_solved_items
                start_date
                end_date
                evaluation
                evaluation_valid_to
                relocation
            }
        }
    }`);

  return response?.data?.judgeNorms_Insert || {};
};

export default judgeNormInsert;
