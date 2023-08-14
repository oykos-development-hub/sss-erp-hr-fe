import {GraphQL} from '..';

import {JudgeNormInsertParams, NormsInsertResponse} from '../../../types/graphql/judges';

export interface JudgeNormInsertReponse {
  data: JudgeNormInsertParams;
}

const judgeNormInsert = async (
  data: JudgeNormInsertReponse,
): Promise<NormsInsertResponse['data']['judgeNorms_Insert']> => {
  const query = `mutation($data: JudgeNormInsertMutation!) {
      judgeNorms_Insert(data: $data) {
          status 
          data
          message 
          item {
            id
            user_profile_id
            topic
            title
            percentage_of_norm_decrease
            number_of_norm_decrease
            number_of_items
            number_of_items_solved
            evaluation {
                id
                date_of_evaluation
                evaluation_type {
                    id
                    title
                }
                score
                evaluator
                is_relevant
            }
            date_of_evaluation_validity
            file_id
            relocation {
                id
                location
                date_of_start
                date_of_end
                absent_type {
                    id
                    title
                }
                target_organization_unit {
                    id
                    title
                }
            }
        }
      }
  }`;

  const response = await GraphQL.fetch(query, {...data, topic: data?.data?.topic});

  return response?.data.judgeNorms_Insert || {};
};

export default judgeNormInsert;
