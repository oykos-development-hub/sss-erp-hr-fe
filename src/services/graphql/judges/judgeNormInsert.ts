import {GraphQL} from '..';

import {Norms, NormsInsertResponse} from '../../../types/graphql/judges';

const judgeNormInsert = async (data: Norms): Promise<NormsInsertResponse['data']['judgeNorms_Insert']> => {
  const query = `mutation($data: JudgeNormInsertMutation!) {
      judgeNorms_Insert(data: $data) {
          status 
          message
          item {
              id
              user_profile_id
              topic
              title
              norm
              percentage_of_norm_decrease
              number_of_norm_decrease
              number_of_items
              percentage_of_norm_fulfilment
              number_of_items_solved
              evaluation_id
              date_of_evaluation
              date_of_evaluation_validity
              relocation_id
              file_id
          }
      }
  }`;
  const response = await GraphQL.fetch(query, {...data, topic: data?.topic?.id});

  return response?.data?.judgeNorms_Insert || {};
};

export default judgeNormInsert;
